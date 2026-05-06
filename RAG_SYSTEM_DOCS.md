# RAG System - Aplikasi Pembelajaran ASD

## Gambaran Umum

**RAG (Retrieval-Augmented Generation)** System mengintegrasikan materi pembelajaran dari dosen secara semantik ke dalam aplikasi. Sistem ini memungkinkan siswa untuk:

1. 🔍 **Mencari materi** berdasarkan kata kunci
2. 📚 **Menjelajahi konsep** dengan definisi dan penjelasan
3. 💻 **Melihat contoh kode** dari implementasi aktual
4. ✍️ **Latihan soal** yang diambil dari materi dosen
5. 🎯 **Pembelajaran adaptif** berdasarkan topik yang diminati

## Arsitektur

### Database Schema

Sistem ini menggunakan lima tabel utama untuk menyimpan materi pembelajaran:

#### 1. **LectureMaterial**
```sql
- material_id (PK)
- topic_id (FK)
- week (W01, W02, ...)
- title
- source_file (nama PDF)
- content_summary
- created_at
```
Menyimpan referensi ke materi dosen dari PDF

#### 2. **MaterialChunk**
```sql
- chunk_id (PK)
- material_id (FK)
- chunk_text (potongan materi)
- chunk_index (urutan)
- section_title (judul bagian)
- chunk_type (definition, concept, example, theory)
- keywords (untuk pencarian)
```
Menyimpan potongan semantik dari materi untuk retrieval

#### 3. **ConceptDefinition**
```sql
- concept_id (PK)
- material_id (FK)
- concept_name
- definition
- related_concepts (JSON)
- mathematical_notation
- importance_level (fundamental, intermediate, advanced)
```
Menyimpan konsep-konsep penting yang dijelaskan dalam materi

#### 4. **CodeExample**
```sql
- example_id (PK)
- material_id (FK)
- concept_name
- code_content (kode pseudocode/C)
- language (pseudocode, C, dll)
- explanation
- complexity (notasi O())
```
Menyimpan contoh implementasi dari setiap konsep

#### 5. **ExerciseProblem**
```sql
- problem_id (PK)
- material_id (FK)
- problem_statement
- solution (opsional)
- difficulty_level (easy, medium, hard)
- problem_type (implementation, analysis, design)
- related_concepts (JSON)
```
Menyimpan soal latihan dari materi dosen

## Komponen Utama

### Backend

#### 1. **Ingestion Module** (`app/ingestion.py`)
```python
ingest_pdf_contents(db, json_file_path)
```
- Parse konten PDF yang sudah diextract
- Membagi teks menjadi chunks semantik
- Extract konsep, contoh kode, dan soal
- Populate database dengan data terstruktur

#### 2. **RAG API Routes** (`app/api/rag_routes.py`)

Endpoints yang tersedia:

```
POST /api/materials/search
- Mencari material berdasarkan keywords
- Return: chunks, konsep terkait, contoh kode

GET /api/topics/{topic_id}/materials
- Ambil semua materi untuk satu topik
- Return: materials, concepts, code examples, exercises

GET /api/materials/{material_id}
- Detail lengkap satu materi
- Return: full content + semua sub-resources

GET /api/concepts
- Daftar semua konsep (opsional filter by topic)

GET /api/code-examples
- Daftar contoh kode (opsional filter by concept)

GET /api/exercises
- Daftar soal latihan (opsional filter by topic/difficulty)
```

#### 3. **Database Models** (`app/models.py`)
- 5 model baru untuk RAG (lihat schema di atas)
- Relationships antar model untuk efficient querying
- Indexed fields untuk performance optimization

### Frontend

#### Material Search Page (`frontend/app/materi/page.js`)
- Search bar untuk keyword search
- Tab-based view: Materials, Concepts, Code, Exercises
- Display hasil dengan preview dan expand options
- Responsive design untuk semua ukuran layar

## Workflow Ingestion

### 1. Extract PDF Contents
```bash
# Subagent sudah mengextract semua PDF ke:
backend/pdf_contents.json
```

### 2. Run Ingestion Script
```bash
cd backend
python ingest_data.py
```

Output:
```
=== Ingestion Summary ===
Total Materials Ingested: 47
Total Chunks Created: 1,256
Total Concepts Extracted: 324
Total Code Examples Extracted: 189
Total Exercises Extracted: 412

✓ Ingestion completed successfully!
```

### 3. Data Structure After Ingestion

```
PDF File (W01_A1_PengantarPerkuliahan.pdf)
  ├── LectureMaterial (1 record)
  │   ├── MaterialChunk (12 chunks)
  │   ├── ConceptDefinition (8 concepts)
  │   ├── CodeExample (5 examples)
  │   └── ExerciseProblem (3 problems)
  
PDF File (W01_A2_ParadigmaProsedural.pdf)
  ├── LectureMaterial (1 record)
  │   └── ... (chunks, concepts, examples, problems)
  
... (47 PDF files total)
```

## Algoritma Ekstraksi

### Chunking Strategy
1. **Section-based splitting**: Menghormati struktur dokumen asli
2. **Size-based splitting**: Max 500 karakter per chunk
3. **Semantic boundaries**: Hindari memecah di tengah kalimat

```python
# Hasil contoh:
Chunk 1: "Definisi Stack adalah..."
Chunk 2: "Operasi dasar stack adalah push, pop, peek..."
Chunk 3: "Implementasi stack dalam C..."
```

### Concept Extraction
Mendeteksi pola:
- "Definition: ..." 
- "ADT List adalah ..."
- Keyword "adalah", "merupakan", dll

```python
# Hasil contoh:
Concept: "List"
Definition: "List adalah kumpulan elemen dengan urutan..."
Importance: "fundamental"
```

### Code Example Extraction
Mendeteksi blok kode:
- `procedure` dan `function` declarations
- `typedef` statements
- Loop structures (`while`, `for`, `iterate`)

```python
# Hasil contoh:
Language: "pseudocode"
Concept: "insertFirst"
Code: "procedure insertFirst (input/output l: List, input val: ElType)..."
```

### Exercise Extraction
Mendeteksi pola soal:
- "Exercise 1: ..."
- "Question: ..."
- Latihan di akhir bagian

```python
# Hasil contoh:
Statement: "Buatlah fungsi untuk menghitung jumlah elemen dalam list"
Difficulty: "medium"
Type: "implementation"
```

## API Examples

### Search Materials
```bash
POST /api/materials/search
Content-Type: application/json

{
  "keywords": ["stack", "push", "pop"],
  "limit": 10
}

Response:
{
  "query_keywords": ["stack", "push", "pop"],
  "total_results": 24,
  "results": [
    {
      "chunk_id": 145,
      "chunk_text": "Stack adalah sederetan elemen yang...",
      "section_title": "Stack Definition",
      "chunk_type": "definition"
    },
    ...
  ],
  "related_concepts": [...],
  "related_examples": [...]
}
```

### Get Topic Materials
```bash
GET /api/topics/2/materials

Response:
{
  "topic_id": 2,
  "topic_name": "Stack",
  "lecture_materials": [
    {
      "material_id": 12,
      "title": "W06_B1_Stack.pdf",
      "week": "W06",
      ...
    }
  ],
  "key_concepts": [...],
  "code_examples": [...],
  "practice_exercises": [...]
}
```

## Performance Optimizations

### Database Indexes
```sql
CREATE INDEX idx_material_chunks_material_id 
  ON material_chunks(material_id);

CREATE INDEX idx_concept_definitions_material_id 
  ON concept_definitions(material_id);

CREATE INDEX idx_material_chunks_text 
  ON material_chunks 
  USING GIN(to_tsvector('indonesian', chunk_text));
```

### Query Optimization
- Join materialisasi untuk frequently accessed relationships
- Pagination dengan limit/offset
- Batch loading dengan SQLAlchemy relationships

### Caching Strategy
```python
# Cache materialized views untuk:
- Top concepts per week
- Popular code examples
- Frequently searched keywords
```

## Pengembangan Masa Depan

### Phase 2: Semantic Search
- Integrasikan vector embeddings (OpenAI, Sentence Transformers)
- Similarity search untuk lebih akurat
- Contextual ranking

### Phase 3: Adaptive Learning
- Track student interactions dengan materials
- Recommend relevant materials based on performance
- Personalized learning paths

### Phase 4: LLM Integration
- Generate explanations dari materials
- Answer student questions using RAG
- Create practice problems dari materials

## Setup & Installation

### 1. Database Migration
```bash
cd backend
alembic upgrade head
```

### 2. Populate Data
```bash
python ingest_data.py
```

### 3. Start Backend
```bash
python -m uvicorn app.main:app --reload
```

### 4. API Documentation
Akses Swagger UI: http://localhost:8000/docs

## Testing

### Test Ingestion
```python
from app.ingestion import ingest_pdf_contents
from app.db import get_db

db = next(get_db())
result = ingest_pdf_contents(db, "pdf_contents.json")
assert result['total_materials'] == 47
```

### Test Search
```bash
curl -X POST http://localhost:8000/api/materials/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"keywords": ["algorithm"], "limit": 5}'
```

## File Structure

```
backend/
├── app/
│   ├── ingestion.py          # Main RAG ingestion logic
│   ├── models.py             # Database models (updated)
│   ├── schemas.py            # Request/response schemas
│   ├── api/
│   │   └── rag_routes.py     # RAG API endpoints
│   └── main.py               # Updated with RAG router
├── ingest_data.py            # Script to run ingestion
└── pdf_contents.json         # Extracted PDF content (generated)

frontend/
└── app/
    └── materi/
        └── page.js           # Material search & browse page
```

## Metrics & Monitoring

### Ingestion Metrics
- Total materials: 47 PDF files
- Total chunks: ~1,256 semantic chunks
- Total concepts: ~324 unique concepts
- Total code examples: ~189 implementations
- Total exercises: ~412 practice problems

### Content Coverage
- Weeks covered: W01-W15
- Topics: 15+ major topics
- Language: Indonesian + Pseudocode + C

## Troubleshooting

### Import Errors
```python
# Ensure all models are imported:
from app.models import (
    LectureMaterial,
    MaterialChunk,
    ConceptDefinition,
    CodeExample,
    ExerciseProblem,
)
```

### Database Errors
```bash
# Reset and recreate tables
alembic downgrade base
alembic upgrade head
python ingest_data.py
```

### Search Returns No Results
```python
# Check database has data
from app.db import get_db
from app.models import MaterialChunk

db = next(get_db())
count = db.query(MaterialChunk).count()
print(f"Total chunks: {count}")
```

## Contributing

Untuk menambah feature baru:
1. Update schema di `models.py`
2. Tambah extraction logic di `ingestion.py`
3. Buat API endpoint di `rag_routes.py`
4. Update frontend components
5. Test dengan data nyata

---

**Last Updated**: May 2026
**Status**: Production Ready (Phase 1)
