# 🚀 Setup & Implementation Guide - RAG System

## 📋 Checklist Implementasi

- [x] Extract PDF content ke JSON
- [x] Create database models untuk RAG
- [x] Implement ingestion module
- [x] Create RAG API endpoints
- [x] Create frontend components
- [ ] Run ingestion script
- [ ] Test API endpoints
- [ ] Deploy to production

## 🔧 Quick Start

### Step 1: Database Migration & Setup

```bash
cd backend

# Create new migration (jika ada perubahan model)
alembic revision --autogenerate -m "Add RAG tables"

# Apply migrations
alembic upgrade head
```

### Step 2: Populate Database with Lecture Materials

```bash
# From backend folder
python ingest_data.py
```

**Expected Output:**
```
Starting ingestion from /path/to/pdf_contents.json...

=== Ingestion Summary ===
Total Materials Ingested: 47
Total Chunks Created: 1256
Total Concepts Extracted: 324
Total Code Examples Extracted: 189
Total Exercises Extracted: 412

✓ Ingestion completed successfully!
```

### Step 3: Start Backend Server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

### Step 4: Access API Documentation

Open browser: http://localhost:8000/docs

## 🧪 Testing

### Test 1: Search Materials

```bash
# Get authentication token first
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Then search
curl -X POST http://localhost:8000/api/materials/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "keywords": ["stack", "push"],
    "limit": 5
  }'
```

### Test 2: Get Topic Materials

```bash
curl -X GET http://localhost:8000/api/topics/2/materials \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 3: Get All Concepts

```bash
curl -X GET http://localhost:8000/api/concepts?limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📱 Frontend Setup

### Update Navigation

Add link ke Material Search page di navigation menu:

```javascript
// app/components/app/app-shell.jsx
<a href="/materi" className="nav-link">
  📚 Jelajahi Materi
</a>
```

### Frontend Features

1. **Material Search** (`/materi`)
   - Keyword search
   - Tab-based results (Materials, Concepts, Code, Exercises)
   - Preview dan expand

2. **Responsive Design**
   - Mobile-friendly
   - Lazy loading untuk performa
   - Syntax highlighting untuk code

## 📊 Data Structure Examples

### Example 1: Search Result

```json
{
  "query_keywords": ["stack", "push"],
  "total_results": 24,
  "results": [
    {
      "chunk_id": 145,
      "chunk_text": "Stack adalah sederetan elemen yang dikenali elemen puncaknya (Top)...",
      "section_title": "Stack Definition",
      "chunk_type": "definition",
      "material_id": 8
    }
  ],
  "related_concepts": [
    {
      "concept_id": 12,
      "concept_name": "LIFO",
      "definition": "Last In First Out - urutan elemen dalam stack...",
      "importance_level": "fundamental"
    }
  ],
  "related_examples": [
    {
      "example_id": 5,
      "concept_name": "push",
      "code_content": "procedure push(Stack *s, ElType val)...",
      "language": "pseudocode"
    }
  ]
}
```

### Example 2: Topic Materials

```json
{
  "topic_id": 2,
  "topic_name": "Stack",
  "lecture_materials": [
    {
      "material_id": 8,
      "week": "W06",
      "title": "Stack - Representasi Array",
      "source_file": "W06_B1_Stack.pdf",
      "chunks": [...],
      "concepts": [...],
      "code_examples": [...],
      "exercises": [...]
    }
  ],
  "key_concepts": [...],
  "code_examples": [...],
  "practice_exercises": [...]
}
```

## 🔍 Database Query Examples

### Find Materials by Week

```python
from app.db import get_db
from app.models import LectureMaterial

db = next(get_db())
week_materials = db.query(LectureMaterial).filter_by(week="W06").all()
```

### Search Concepts by Topic

```python
from app.models import ConceptDefinition, LectureMaterial

concepts = (
    db.query(ConceptDefinition)
    .join(LectureMaterial)
    .filter(LectureMaterial.topic_id == 2)
    .all()
)
```

### Get Code Examples for Concept

```python
from app.models import CodeExample

examples = (
    db.query(CodeExample)
    .filter(CodeExample.concept_name.ilike("%push%"))
    .limit(5)
    .all()
)
```

## 🎯 Content Statistics

### By Week
- W01 (Pengantar): 4 materials
- W02 (ADT Sederhana): 3 materials
- W03 (List): 4 materials
- W05 (Mesin Karakter/Kata): 5 materials
- W06 (Stack & Queue): 6 materials
- W07 (Set & Map): 3 materials
- W09-W10 (List Linier): 9 materials
- W13 (Binary Tree): 4 materials
- W14-W15 (Aplikasi): 4 materials

### By Content Type
- **Chunks**: 1,256 semantic pieces
- **Concepts**: 324 definitions
- **Code Examples**: 189 implementations
- **Exercises**: 412 problems

## ⚙️ Configuration

### Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost/asd_db"
ENVIRONMENT="development"
```

### Database Connection

```python
# app/config.py - Already configured
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./app.db"  # Default fallback
)
```

## 🐛 Troubleshooting

### Issue: No materials found after ingestion

```python
# Check if data was inserted
from app.db import get_db
from app.models import LectureMaterial

db = next(get_db())
count = db.query(LectureMaterial).count()
print(f"Total materials: {count}")  # Should be 47
```

### Issue: Search returns empty results

```python
# Check if json file exists and is valid
import json
with open("pdf_contents.json") as f:
    data = json.load(f)
print(f"Total items: {len(data)}")  # Should be 47
```

### Issue: API authentication errors

```bash
# Make sure you include token in header
-H "Authorization: Bearer YOUR_TOKEN"

# Or use swagger UI authentication first
```

## 📈 Performance Tips

### 1. Add Database Indexes

```sql
-- For faster searches
CREATE INDEX idx_material_chunks_text 
  ON material_chunks 
  USING GIN(to_tsvector('indonesian', chunk_text));

CREATE INDEX idx_concepts_material_id 
  ON concept_definitions(material_id);
```

### 2. Enable Query Caching

```python
# app/db.py
# Add SQLAlchemy-Utils for query caching
from sqlalchemy_utils import create_database

# Cache frequent queries
@cache.cached(timeout=3600)
def get_concepts_for_topic(topic_id):
    ...
```

### 3. Pagination for Large Results

```python
# In routes
skip = (page - 1) * page_size
results = db.query(...).offset(skip).limit(page_size).all()
```

## 🚀 Deployment

### 1. Build Container

```bash
cd backend
docker build -t asd-rag-api .
```

### 2. Run Container

```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  asd-rag-api
```

### 3. Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable CORS for frontend domain
- [ ] Setup authentication tokens
- [ ] Add database backups
- [ ] Monitor API logs
- [ ] Setup error tracking (Sentry)

## 📚 Additional Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 👥 Support

For issues or questions:
1. Check RAG_SYSTEM_DOCS.md for detailed documentation
2. Review API documentation at /docs endpoint
3. Check database logs for errors
4. Review ingestion output for warnings

---

**Next Steps**: 
1. ✅ Run ingestion script
2. ✅ Test API endpoints
3. ✅ Test frontend components
4. 🎯 Deploy to production

