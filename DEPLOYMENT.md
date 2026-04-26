# Docker Deployment

This project now includes:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`
- `.env.example`

## 1. Prepare environment

Create a root `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update these values before deploying on your VPS:

- `APP_SECRET_KEY`
- `POSTGRES_PASSWORD`
- `FRONTEND_ORIGIN`
- `NEXT_PUBLIC_API_BASE_URL`
- `OPENAI_API_KEY` if you want AI insights enabled

Important:

- `NEXT_PUBLIC_API_BASE_URL` must use your VPS public IP or domain, not `localhost`.
- Use a simple PostgreSQL password without URL-reserved characters like `#`, `@`, or `/` unless you also update how `DATABASE_URL` is constructed.

## 2. Build and run

```bash
docker compose up -d --build
```

## 3. Check containers

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

## 4. Useful VPS notes

- Open port `3000` for the frontend and `8000` for the backend in your VPS firewall/security group.
- PostgreSQL is not published publicly by default, which is safer for production.
- If you change `NEXT_PUBLIC_API_BASE_URL`, rebuild the frontend:

```bash
docker compose up -d --build frontend
```
