"""
RAG System Ingestion Module
Handles parsing and ingestion of lecture materials from PDF extracts
"""

import json
import re
from typing import Any, Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.models import (
    LectureMaterial,
    MaterialChunk,
    ConceptDefinition,
    CodeExample,
    ExerciseProblem,
    Topic,
)


def extract_week_from_filename(filename: str) -> str:
    """Extract week number from filename like W01_A1_something.pdf"""
    match = re.match(r"(W\d{2})", filename)
    return match.group(1) if match else "Unknown"


def chunk_text_by_sections(text: str, max_chunk_size: int = 500) -> list[dict[str, Any]]:
    """
    Split text into semantic chunks with metadata
    Attempts to respect section boundaries when possible
    """
    chunks = []
    current_chunk = ""
    section_title = "General Content"
    chunk_index = 0

    # Split by common section markers
    lines = text.split("\n")

    for line in lines:
        # Detect potential section headers
        if re.match(r"^[A-Z][a-zA-Z\s]+$", line.strip()) and len(line.strip()) > 5:
            if current_chunk.strip():
                # Save current chunk
                chunks.append({
                    "text": current_chunk.strip(),
                    "section_title": section_title,
                    "chunk_index": chunk_index,
                    "chunk_type": "theory",
                })
                chunk_index += 1
                current_chunk = ""
            section_title = line.strip()
        else:
            current_chunk += line + "\n"

            # Check if chunk is getting too large
            if len(current_chunk) > max_chunk_size:
                chunks.append({
                    "text": current_chunk.strip(),
                    "section_title": section_title,
                    "chunk_index": chunk_index,
                    "chunk_type": "theory",
                })
                chunk_index += 1
                current_chunk = ""

    # Save remaining chunk
    if current_chunk.strip():
        chunks.append({
            "text": current_chunk.strip(),
            "section_title": section_title,
            "chunk_index": chunk_index,
            "chunk_type": "theory",
        })

    return chunks


def extract_code_examples(text: str) -> list[dict[str, Any]]:
    """Extract code examples from text using common patterns"""
    code_examples = []

    # Patterns for code blocks (pseudo-code and real code)
    code_patterns = [
        r"(procedure|function|void|typedef|#include|if|while|for)\s+[a-zA-Z_][a-zA-Z0-9_]*.*?(?=\n(?:procedure|function|void|typedef|#include|if\s+|while\s|for\s|[A-Z]|$))",
        r"```[a-z]*\n(.*?)\n```",
    ]

    # Look for procedure/function definitions
    proc_pattern = r"(?:procedure|function|void|typedef|#include)\s+([^\n]+(?:\n(?!(?:procedure|function|void|typedef|#include|[A-Z])[a-zA-Z]).*)*)"
    matches = re.finditer(proc_pattern, text, re.MULTILINE)

    for match in matches:
        code_text = match.group(0)
        if len(code_text) > 50:  # Only include substantial code blocks
            code_examples.append({
                "code": code_text,
                "language": "pseudocode",
                "concept": extract_concept_from_code(code_text),
            })

    return code_examples


def extract_concept_from_code(code_text: str) -> str:
    """Extract concept name from code block"""
    match = re.search(r"(?:procedure|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)", code_text)
    if match:
        return match.group(1)
    match = re.search(r"(?:type|typedef)\s+([a-zA-Z_][a-zA-Z0-9_]*)", code_text)
    if match:
        return match.group(1)
    return "Code Example"


def extract_definitions(text: str) -> list[dict[str, Any]]:
    """Extract key concepts and definitions from text"""
    concepts = []

    # Look for definition-like patterns
    def_patterns = [
        r"(?:Definition|Definisi)[\s:]+([^\n]+)",
        r"(?:ADT|Abstract Data Type)\s+([A-Za-z0-9_]+)[^\n]*[:\-]([^\n]+)",
        r"(?:is|adalah)\s+([a-z][a-zA-Z0-9_\s]*?)(?:\.|,|;)",
    ]

    for pattern in def_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            if len(match.groups()) == 1:
                concept_name = match.group(1).strip()
                # Extract surrounding context
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 200)
                definition = text[start:end].strip()

                if len(concept_name) > 3 and len(concept_name) < 100:
                    concepts.append({
                        "name": concept_name,
                        "definition": definition,
                        "importance": "fundamental" if "fundamental" in definition.lower() else "intermediate",
                    })

    return concepts


def extract_exercises(text: str) -> list[dict[str, Any]]:
    """Extract exercise problems from text"""
    exercises = []

    # Look for exercise/problem patterns
    exercise_patterns = [
        r"(?:Exercise|Latihan|Problem|Soal)\s+(\d+)[:\s]+([^\n]+(?:\n(?!(?:Exercise|Latihan|Problem|Soal|Procedure|Function))).*?)",
        r"(?:Question|Pertanyaan)[:\s]+([^\n]+)",
    ]

    for pattern in exercise_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
        for match in matches:
            problem_text = match.group(0) if len(match.groups()) == 1 else match.group(2)
            if len(problem_text) > 20:
                exercises.append({
                    "statement": problem_text.strip(),
                    "difficulty": "medium",
                    "type": "implementation",
                })

    return exercises


def ingest_pdf_contents(
    db: Session, json_file_path: str, batch_size: int = 5
) -> dict[str, Any]:
    """
    Main ingestion function to populate database from extracted PDF contents
    """
    result = {
        "total_materials": 0,
        "total_chunks": 0,
        "total_concepts": 0,
        "total_code_examples": 0,
        "total_exercises": 0,
        "errors": [],
    }

    try:
        with open(json_file_path, "r", encoding="utf-8") as f:
            pdf_contents = json.load(f)
    except FileNotFoundError:
        result["errors"].append(f"File not found: {json_file_path}")
        return result
    except json.JSONDecodeError as e:
        result["errors"].append(f"Invalid JSON: {str(e)}")
        return result

    # Process each PDF
    for item in pdf_contents:
        try:
            filename = item.get("file", "Unknown")
            content = item.get("content", "")

            if not content:
                continue

            # Extract week and create title
            week = extract_week_from_filename(filename)
            title = filename.replace(".pdf", "").replace("_", " ")

            # Create LectureMaterial record
            lecture_material = LectureMaterial(
                week=week,
                title=title,
                source_file=filename,
                content_summary=content[:500],  # Store first 500 chars as summary
            )
            db.add(lecture_material)
            db.flush()  # Get the ID

            result["total_materials"] += 1

            # Extract and create chunks
            chunks = chunk_text_by_sections(content)
            for chunk_data in chunks:
                chunk = MaterialChunk(
                    material_id=lecture_material.material_id,
                    chunk_text=chunk_data["text"],
                    chunk_index=chunk_data["chunk_index"],
                    section_title=chunk_data["section_title"],
                    chunk_type=chunk_data["chunk_type"],
                    keywords=None,  # Will be populated by embedding service
                )
                db.add(chunk)
                result["total_chunks"] += 1

            # Extract and create concepts
            concepts = extract_definitions(content)
            for concept_data in concepts:
                concept = ConceptDefinition(
                    material_id=lecture_material.material_id,
                    concept_name=concept_data["name"],
                    definition=concept_data["definition"],
                    importance_level=concept_data.get("importance", "intermediate"),
                )
                db.add(concept)
                result["total_concepts"] += 1

            # Extract and create code examples
            code_examples = extract_code_examples(content)
            for code_data in code_examples:
                code_example = CodeExample(
                    material_id=lecture_material.material_id,
                    concept_name=code_data["concept"],
                    code_content=code_data["code"],
                    language=code_data["language"],
                )
                db.add(code_example)
                result["total_code_examples"] += 1

            # Extract and create exercises
            exercises = extract_exercises(content)
            for exercise_data in exercises:
                exercise = ExerciseProblem(
                    material_id=lecture_material.material_id,
                    problem_statement=exercise_data["statement"],
                    difficulty_level=exercise_data["difficulty"],
                    problem_type=exercise_data["type"],
                )
                db.add(exercise)
                result["total_exercises"] += 1

        except Exception as e:
            result["errors"].append(f"Error processing {filename}: {str(e)}")
            continue

        # Commit in batches
        if result["total_materials"] % batch_size == 0:
            db.commit()

    # Final commit
    db.commit()

    return result


def get_material_chunks_for_topic(
    db: Session, topic_id: int, limit: int = 10
) -> list[MaterialChunk]:
    """Retrieve material chunks related to a specific topic"""
    return (
        db.query(MaterialChunk)
        .join(LectureMaterial)
        .filter(LectureMaterial.topic_id == topic_id)
        .limit(limit)
        .all()
    )


def search_materials_by_keywords(
    db: Session, keywords: list[str], limit: int = 10
) -> list[MaterialChunk]:
    """Simple keyword search in material chunks"""
    query = db.query(MaterialChunk)

    for keyword in keywords:
        query = query.filter(MaterialChunk.chunk_text.ilike(f"%{keyword}%"))

    return query.limit(limit).all()


def get_concepts_for_topic(db: Session, topic_id: int) -> list[ConceptDefinition]:
    """Get all concepts defined for a specific topic"""
    return (
        db.query(ConceptDefinition)
        .join(LectureMaterial)
        .filter(LectureMaterial.topic_id == topic_id)
        .all()
    )


def get_code_examples_for_concept(
    db: Session, concept_name: str, limit: int = 5
) -> list[CodeExample]:
    """Get code examples for a specific concept"""
    return (
        db.query(CodeExample)
        .filter(CodeExample.concept_name.ilike(f"%{concept_name}%"))
        .limit(limit)
        .all()
    )


def get_exercises_for_topic(
    db: Session, topic_id: int, difficulty: Optional[str] = None
) -> list[ExerciseProblem]:
    """Get exercises for a specific topic, optionally filtered by difficulty"""
    query = (
        db.query(ExerciseProblem)
        .join(LectureMaterial)
        .filter(LectureMaterial.topic_id == topic_id)
    )

    if difficulty:
        query = query.filter(ExerciseProblem.difficulty_level == difficulty)

    return query.all()
