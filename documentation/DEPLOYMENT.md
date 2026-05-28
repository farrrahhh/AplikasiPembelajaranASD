# Deployment Guide — Aplikasi Pembelajaran ASD

## Architecture Overview

```
Internet
   │
   ├── asd-frontend (Cloud Run)   → Next.js 16
   │        │
   │        └── calls
   │
   └── asd-backend (Cloud Run)    → FastAPI
            │
            └── asd-db (Cloud SQL) → PostgreSQL 16
```

Every `git push` to `main` triggers GitHub Actions which builds Docker images, pushes them to Artifact Registry, and deploys both services to Cloud Run automatically.

---

## Prerequisites

- GCP project with billing enabled
- `gcloud` CLI installed and authenticated
- GitHub repository with the source code

---

## One-Time GCP Setup

These steps only need to be done once when setting up the project for the first time.

### 1. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com
```

### 2. Create Artifact Registry Repository

Stores Docker images for both frontend and backend.

```bash
gcloud artifacts repositories create asd-app \
  --repository-format=docker \
  --location=asia-southeast2
```

### 3. Create Service Account for GitHub Actions

```bash
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

PROJECT_ID=$(gcloud config get-value project)
SA="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" --role="roles/cloudsql.client"
```

### 4. Set Up Workload Identity Federation

Allows GitHub Actions to authenticate to GCP without a JSON key file.

```bash
# Create identity pool
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Get pool resource name
POOL_ID=$(gcloud iam workload-identity-pools describe "github-pool" \
  --location="global" --format="value(name)")

# Create OIDC provider (replace with your GitHub username/repo)
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
  --attribute-condition="assertion.repository=='YOUR_GITHUB_USERNAME/YOUR_REPO_NAME'"

# Bind service account to the pool
gcloud iam service-accounts add-iam-policy-binding $SA \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${POOL_ID}/attribute.repository/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME"

# Get provider resource name (save this for GitHub Secrets)
gcloud iam workload-identity-pools providers describe "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)"
```

### 5. Create Cloud SQL Instance

```bash
gcloud sql instances create asd-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --edition=ENTERPRISE \
  --region=asia-southeast2 \
  --storage-auto-increase

# Wait until state is RUNNABLE
gcloud sql instances describe asd-db --format="value(state)"

# Create database and user
gcloud sql databases create asd_learning_db --instance=asd-db

gcloud sql users create asd_user \
  --instance=asd-db \
  --password=YOUR_STRONG_PASSWORD
```

### 6. Grant Runtime Permission to Compute SA

Cloud Run uses the Compute Engine default service account at runtime.

```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

---

## GitHub Secrets

Go to **GitHub repo → Settings → Secrets and variables → Actions** and add:

| Secret | Value | Notes |
|--------|-------|-------|
| `GCP_PROJECT_ID` | Your GCP project ID | e.g. `my-project-123` |
| `WIF_PROVIDER` | Full provider resource name from step 4 | `projects/.../providers/github-provider` |
| `WIF_SERVICE_ACCOUNT` | `github-actions-deployer@PROJECT_ID.iam.gserviceaccount.com` | |
| `DATABASE_URL` | `postgresql+psycopg://asd_user:PASSWORD@/asd_learning_db?host=/cloudsql/PROJECT_ID:asia-southeast2:asd-db` | Unix socket format for Cloud SQL |
| `SECRET_KEY` | Random string for JWT signing | Run `openssl rand -hex 32` |
| `OPENAI_API_KEY` | Your OpenAI API key | Used at runtime, never baked into image |
| `FRONTEND_ORIGIN` | `https://asd-frontend-HASH.asia-southeast2.run.app` | Fill after first frontend deploy |
| `NEXT_PUBLIC_API_URL` | `https://asd-backend-HASH.asia-southeast2.run.app/api` | Fill after first backend deploy |

> `FRONTEND_ORIGIN` and `NEXT_PUBLIC_API_URL` can only be filled after the first deploy. Do an empty commit to trigger a redeploy after adding them.

---

## Project File Structure

```
AplikasiPembelajaranASD/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← CI/CD pipeline
├── backend/
│   ├── Dockerfile              ← FastAPI container
│   ├── app/
│   └── pyproject.toml
└── frontend/
    ├── Dockerfile              ← Next.js container (multi-stage)
    ├── next.config.mjs         ← output: standalone (required)
    └── app/
```

---

## CI/CD Pipeline Flow

Every `git push` to `main` triggers this flow:

```
git push main
     │
     ▼
GitHub Actions
     │
     ├─── Job 1: deploy-backend
     │         │
     │         ├── Checkout code
     │         ├── Authenticate to GCP (Workload Identity)
     │         ├── Build Docker image (backend/)
     │         ├── Push image to Artifact Registry
     │         └── Deploy to Cloud Run (asd-backend)
     │                  └── connects to Cloud SQL via Unix socket
     │
     └─── Job 2: deploy-frontend  (runs after backend succeeds)
               │
               ├── Checkout code
               ├── Authenticate to GCP (Workload Identity)
               ├── Build Docker image (frontend/) with NEXT_PUBLIC_API_URL baked in
               ├── Push image to Artifact Registry
               └── Deploy to Cloud Run (asd-frontend)
                        └── OPENAI_API_KEY injected at runtime
```

**Total deploy time: ~5–8 minutes**

---

## Deployment Commands Reference

### Trigger a deploy
```bash
git push origin main
```

### Force redeploy without code changes
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

### Get service URLs
```bash
gcloud run services describe asd-backend \
  --region=asia-southeast2 --format="value(status.url)"

gcloud run services describe asd-frontend \
  --region=asia-southeast2 --format="value(status.url)"
```

### Roll back to a previous revision
```bash
# List revisions
gcloud run revisions list --service=asd-backend --region=asia-southeast2

# Roll back
gcloud run services update-traffic asd-backend \
  --region=asia-southeast2 \
  --to-revisions=REVISION_NAME=100
```

### View live logs
```bash
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=asd-backend" \
  --limit=50 --format="value(textPayload)"
```

---

## Environment Variables Reference

### Backend (Cloud Run runtime)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string via Cloud SQL Unix socket |
| `SECRET_KEY` | JWT signing secret |
| `FRONTEND_ORIGIN` | Frontend URL for CORS whitelist |
| `APP_ENV` | Set to `production` |
| `OPENAI_API_KEY` | OpenAI API key |

### Frontend (Cloud Run runtime + build time)

| Variable | Build time | Runtime | Description |
|----------|-----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | No | Backend API base URL — baked into JS bundle |
| `OPENAI_API_KEY` | No | Yes | OpenAI key for server-side API routes |

> **Important:** `NEXT_PUBLIC_*` variables are embedded at build time. Changing them requires a rebuild and redeploy.

---

## Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Container failed to start on port 8080` | App not reading `PORT` env var | Use `${PORT:-8080}` in CMD |
| `Connection refused` on Cloud SQL socket | Runtime SA missing `cloudsql.client` | Grant role to Compute default SA |
| `CORS header missing` | Wrong `FRONTEND_ORIGIN` value | Set to frontend Cloud Run URL, not backend |
| `Key creation is not allowed` | Org policy blocks SA keys | Use Workload Identity Federation instead |
| `Invalid Tier db-f1-micro` | GCP defaults to ENTERPRISE_PLUS | Add `--edition=ENTERPRISE` flag |
| `NEXT_PUBLIC_API_URL` empty | Secret added after image was built | Trigger redeploy with empty commit |
