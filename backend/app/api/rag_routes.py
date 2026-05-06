"""
RAG System Routes
Endpoints for semantic material retrieval and management
"""

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, Topic, ConceptDefinition, CodeExample, ExerciseProblem, LectureMaterial, MaterialChunk
from app.api.routes import get_current_user
from app.schemas import (
    MaterialSearchRequest,
    MaterialSearchResponse,
    MaterialChunkResponse,
    ConceptDefinitionResponse,
    CodeExampleResponse,
    ExerciseProblemResponse,
    LectureMaterialResponse,
    TopicMaterialResponse,
    MaterialDetailResponse,
    TutorialCatalogItemResponse,
    TutorialTopicResponse,
)
from app.ingestion import (
    search_materials_by_keywords,
    get_material_chunks_for_topic,
    get_concepts_for_topic,
    get_code_examples_for_concept,
    get_exercises_for_topic,
)
from app.tutorials import PDF_DIRECTORY, get_tutorial_catalog, get_tutorial_topic

router = APIRouter()


@router.post(
    "/materials/search",
    tags=["rag"],
    response_model=MaterialSearchResponse,
    status_code=status.HTTP_200_OK,
)
async def search_materials(
    request: MaterialSearchRequest,
    db: Session = Depends(get_db),
) -> MaterialSearchResponse:
    """
    Search for learning materials using keywords
    Uses semantic search to find relevant chunks from lecture materials
    """
    # Get chunks matching keywords
    chunks = search_materials_by_keywords(db, request.keywords, limit=request.limit)

    if not chunks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No materials found matching your search query.",
        )

    # Convert chunks to response format
    chunk_responses = [MaterialChunkResponse.from_orm(chunk) for chunk in chunks]

    # Get related concepts
    related_concepts = []
    for chunk in chunks[:3]:  # Get concepts from top 3 results
        concepts = db.query(ConceptDefinition).filter_by(material_id=chunk.material_id).limit(2).all()
        related_concepts.extend([ConceptDefinitionResponse.from_orm(c) for c in concepts])

    # Get code examples for found concepts
    related_examples = []
    concept_names = [c.concept_name for c in related_concepts[:3]]
    for concept_name in concept_names:
        examples = get_code_examples_for_concept(db, concept_name, limit=2)
        related_examples.extend(
            [CodeExampleResponse.from_orm(ex) for ex in examples]
        )

    return MaterialSearchResponse(
        query_keywords=request.keywords,
        total_results=len(chunk_responses),
        results=chunk_responses,
        related_concepts=related_concepts[:5],
        related_examples=related_examples[:3],
    )


@router.get(
    "/topics/{topic_id}/materials",
    tags=["rag"],
    response_model=TopicMaterialResponse,
    status_code=status.HTTP_200_OK,
)
async def get_topic_materials(
    topic_id: int,
    db: Session = Depends(get_db),
) -> TopicMaterialResponse:
    """
    Get all materials and resources for a specific topic
    Includes lecture materials, concepts, code examples, and exercises
    """
    # Verify topic exists
    topic = db.get(Topic, topic_id)
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )

    # Get lecture materials
    lecture_materials = (
        db.query(LectureMaterial)
        .filter_by(topic_id=topic_id)
        .all()
    )

    # Get concepts
    concepts = get_concepts_for_topic(db, topic_id)

    # Get code examples
    code_examples = []
    for concept in concepts:
        examples = get_code_examples_for_concept(db, concept.concept_name, limit=2)
        code_examples.extend(examples)

    # Get exercises
    exercises = get_exercises_for_topic(db, topic_id)

    return TopicMaterialResponse(
        topic_id=topic_id,
        topic_name=topic.topic_name,
        lecture_materials=[
            LectureMaterialResponse.from_orm(lm) for lm in lecture_materials
        ],
        key_concepts=[ConceptDefinitionResponse.from_orm(c) for c in concepts[:10]],
        code_examples=[CodeExampleResponse.from_orm(ex) for ex in code_examples[:10]],
        practice_exercises=[
            ExerciseProblemResponse.from_orm(ex) for ex in exercises[:10]
        ],
    )


@router.get(
    "/materials/{material_id}",
    tags=["rag"],
    response_model=MaterialDetailResponse,
    status_code=status.HTTP_200_OK,
)
async def get_material_detail(
    material_id: int,
    db: Session = Depends(get_db),
) -> MaterialDetailResponse:
    """
    Get detailed view of a specific lecture material
    Includes full content and all associated resources
    """
    material = db.get(LectureMaterial, material_id)
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found.",
        )

    # Reconstruct full content from chunks
    full_content = " ".join([chunk.chunk_text for chunk in material.chunks])

    return MaterialDetailResponse(
        material_id=material.material_id,
        title=material.title,
        week=material.week,
        source_file=material.source_file,
        full_content=full_content,
        chunks=[MaterialChunkResponse.from_orm(chunk) for chunk in material.chunks],
        concepts=[
            ConceptDefinitionResponse.from_orm(concept) for concept in material.concepts
        ],
        code_examples=[
            CodeExampleResponse.from_orm(example) for example in material.code_examples
        ],
        exercises=[
            ExerciseProblemResponse.from_orm(exercise)
            for exercise in material.exercises
        ],
    )


@router.get(
    "/concepts",
    tags=["rag"],
    response_model=list[ConceptDefinitionResponse],
    status_code=status.HTTP_200_OK,
)
async def get_all_concepts(
    topic_id: int | None = Query(None),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
) -> list[ConceptDefinitionResponse]:
    """
    Get all key concepts, optionally filtered by topic
    """
    query = db.query(ConceptDefinition)

    if topic_id:
        topic = db.get(Topic, topic_id)
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Topic not found.",
            )
        query = query.join(LectureMaterial).filter(
            LectureMaterial.topic_id == topic_id
        )

    concepts = query.limit(limit).all()
    return [ConceptDefinitionResponse.from_orm(c) for c in concepts]


@router.get(
    "/code-examples",
    tags=["rag"],
    response_model=list[CodeExampleResponse],
    status_code=status.HTTP_200_OK,
)
async def get_code_examples(
    concept: str | None = Query(None),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
) -> list[CodeExampleResponse]:
    """
    Get code examples, optionally filtered by concept name
    """
    if concept:
        examples = get_code_examples_for_concept(db, concept, limit=limit)
    else:
        examples = db.query(CodeExample).limit(limit).all()

    return [CodeExampleResponse.from_orm(ex) for ex in examples]


@router.get(
    "/exercises",
    tags=["rag"],
    response_model=list[ExerciseProblemResponse],
    status_code=status.HTTP_200_OK,
)
async def get_practice_exercises(
    topic_id: int | None = Query(None),
    difficulty: str | None = Query(None),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),
) -> list[ExerciseProblemResponse]:
    """
    Get practice exercises, optionally filtered by topic and difficulty
    """
    if topic_id:
        topic = db.get(Topic, topic_id)
        if not topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Topic not found.",
            )
        exercises = get_exercises_for_topic(db, topic_id, difficulty=difficulty)
    else:
        query = db.query(ExerciseProblem)
        if difficulty:
            query = query.filter_by(difficulty_level=difficulty)
        exercises = query.limit(limit).all()

    return [ExerciseProblemResponse.from_orm(ex) for ex in exercises[:limit]]


@router.get(
    "/tutorials",
    tags=["rag"],
    response_model=list[TutorialCatalogItemResponse],
    status_code=status.HTTP_200_OK,
)
async def list_tutorial_topics() -> list[TutorialCatalogItemResponse]:
    """
    Return tutorial-style topic catalog built from lecturer PDFs.
    """
    return [TutorialCatalogItemResponse(**item) for item in get_tutorial_catalog()]


@router.get(
    "/tutorials/{topic_slug}",
    tags=["rag"],
    response_model=TutorialTopicResponse,
    status_code=status.HTTP_200_OK,
)
async def get_tutorial_topic_detail(topic_slug: str) -> TutorialTopicResponse:
    """
    Return ordered tutorial content for one topic, inspired by step-by-step learning pages.
    """
    try:
        payload = get_tutorial_topic(topic_slug)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tutorial topic not found.",
        ) from exc

    return TutorialTopicResponse(**payload)


@router.get(
    "/material-files/{file_name:path}",
    tags=["rag"],
    status_code=status.HTTP_200_OK,
)
async def get_material_pdf(file_name: str) -> FileResponse:
    """
    Serve lecturer PDF files for inline embedding in the tutorial page.
    """
    requested_path = (PDF_DIRECTORY / file_name).resolve()
    pdf_root = PDF_DIRECTORY.resolve()

    if requested_path.parent != pdf_root and pdf_root not in requested_path.parents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file path.",
        )

    if requested_path.suffix.lower() != ".pdf" or not requested_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF file not found.",
        )

    return FileResponse(
        path=Path(requested_path),
        media_type="application/pdf",
        filename=requested_path.name,
    )
