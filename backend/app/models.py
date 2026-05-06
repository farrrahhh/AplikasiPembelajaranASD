from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    answers: Mapped[list["UserAnswer"]] = relationship(back_populates="user")
    progress_records: Mapped[list["Progress"]] = relationship(back_populates="user")
    performance_records: Mapped[list["UserPerformance"]] = relationship(
        back_populates="user"
    )
    topic_tracking_records: Mapped[list["UserTopicTracking"]] = relationship(
        back_populates="user"
    )


class Topic(Base):
    __tablename__ = "topics"

    topic_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    difficulty_level: Mapped[str | None] = mapped_column(String(100))

    materials: Mapped[list["Material"]] = relationship(back_populates="topic")
    examples: Mapped[list["Example"]] = relationship(back_populates="topic")
    exercises: Mapped[list["Exercise"]] = relationship(back_populates="topic")
    learning_paths: Mapped[list["LearningPath"]] = relationship(back_populates="topic")
    progress_records: Mapped[list["Progress"]] = relationship(back_populates="topic")
    performance_records: Mapped[list["UserPerformance"]] = relationship(
        back_populates="topic"
    )
    tracking_records: Mapped[list["UserTopicTracking"]] = relationship(
        back_populates="topic"
    )
    lecture_materials: Mapped[list["LectureMaterial"]] = relationship(back_populates="topic")


class Material(Base):
    __tablename__ = "materials"

    material_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    generated_by_llm: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    topic: Mapped["Topic"] = relationship(back_populates="materials")


class Example(Base):
    __tablename__ = "examples"

    example_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    generated_by_llm: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    topic: Mapped["Topic"] = relationship(back_populates="examples")


class Exercise(Base):
    __tablename__ = "exercises"

    exercise_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    question: Mapped[str | None] = mapped_column(Text)
    difficulty_level: Mapped[str | None] = mapped_column(String(100))
    generated_by_llm: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    topic: Mapped["Topic"] = relationship(back_populates="exercises")
    explanation: Mapped["Explanation | None"] = relationship(
        back_populates="exercise",
        uselist=False,
    )
    user_answers: Mapped[list["UserAnswer"]] = relationship(back_populates="exercise")


class Explanation(Base):
    __tablename__ = "explanations"

    explanation_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    exercise_id: Mapped[int] = mapped_column(
        ForeignKey("exercises.exercise_id"),
        unique=True,
        nullable=False,
    )
    content: Mapped[str | None] = mapped_column(Text)
    generated_by_llm: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    exercise: Mapped["Exercise"] = relationship(back_populates="explanation")


class UserAnswer(Base):
    __tablename__ = "user_answers"

    answer_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    exercise_id: Mapped[int] = mapped_column(
        ForeignKey("exercises.exercise_id"),
        nullable=False,
    )
    answer_text: Mapped[str | None] = mapped_column(Text)
    is_correct: Mapped[bool | None] = mapped_column(Boolean)
    score: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="answers")
    exercise: Mapped["Exercise"] = relationship(back_populates="user_answers")


class Progress(Base):
    __tablename__ = "progress"

    progress_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    completion_percentage: Mapped[float | None] = mapped_column(Float)
    last_accessed: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="progress_records")
    topic: Mapped["Topic"] = relationship(back_populates="progress_records")


class UserPerformance(Base):
    __tablename__ = "user_performance"

    performance_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    accuracy: Mapped[float | None] = mapped_column(Float)
    avg_score: Mapped[float | None] = mapped_column(Float)
    weakness_level: Mapped[str | None] = mapped_column(String(100))

    user: Mapped["User"] = relationship(back_populates="performance_records")
    topic: Mapped["Topic"] = relationship(back_populates="performance_records")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    path_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    step_order: Mapped[int | None] = mapped_column(Integer)
    step_type: Mapped[str | None] = mapped_column(String(50))

    topic: Mapped["Topic"] = relationship(back_populates="learning_paths")


class UserTopicTracking(Base):
    __tablename__ = "user_topic_tracking"
    __table_args__ = (UniqueConstraint("user_id", "topic_id", name="uq_user_topic_tracking"),)

    tracking_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.topic_id"), nullable=False)
    material_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    example_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    summary_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    exercises_attempted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    exercises_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    generated_content_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    study_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_completed_step: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="topic_tracking_records")
    topic: Mapped["Topic"] = relationship(back_populates="tracking_records")


# RAG System Models
class LectureMaterial(Base):
    """Store lecture materials from instructor PDFs"""
    __tablename__ = "lecture_materials"

    material_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[int | None] = mapped_column(ForeignKey("topics.topic_id"), nullable=True)
    week: Mapped[str] = mapped_column(String(10), nullable=False)  # e.g., "W01", "W02"
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    source_file: Mapped[str] = mapped_column(String(255), nullable=False)  # PDF filename
    content_summary: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    topic: Mapped["Topic | None"] = relationship(back_populates="lecture_materials")
    chunks: Mapped[list["MaterialChunk"]] = relationship(back_populates="lecture_material")
    concepts: Mapped[list["ConceptDefinition"]] = relationship(back_populates="lecture_material")
    code_examples: Mapped[list["CodeExample"]] = relationship(back_populates="lecture_material")
    exercises: Mapped[list["ExerciseProblem"]] = relationship(back_populates="lecture_material")


class MaterialChunk(Base):
    """Store semantic chunks of lecture materials for RAG retrieval"""
    __tablename__ = "material_chunks"

    chunk_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    material_id: Mapped[int] = mapped_column(
        ForeignKey("lecture_materials.material_id"), nullable=False
    )
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)  # Order in document
    section_title: Mapped[str | None] = mapped_column(String(255))
    chunk_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # "definition", "concept", "example", "theory"
    keywords: Mapped[str | None] = mapped_column(Text)  # JSON array of keywords
    relevance_score: Mapped[float | None] = mapped_column(Float)  # For ranking
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    lecture_material: Mapped["LectureMaterial"] = relationship(back_populates="chunks")


class ConceptDefinition(Base):
    """Store key concepts and definitions from lecture materials"""
    __tablename__ = "concept_definitions"

    concept_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    material_id: Mapped[int] = mapped_column(
        ForeignKey("lecture_materials.material_id"), nullable=False
    )
    concept_name: Mapped[str] = mapped_column(String(255), nullable=False)
    definition: Mapped[str] = mapped_column(Text, nullable=False)
    related_concepts: Mapped[str | None] = mapped_column(Text)  # JSON array
    mathematical_notation: Mapped[str | None] = mapped_column(Text)
    importance_level: Mapped[str | None] = mapped_column(String(50))  # "fundamental", "intermediate", "advanced"

    lecture_material: Mapped["LectureMaterial"] = relationship(back_populates="concepts")


class CodeExample(Base):
    """Store code examples from lecture materials"""
    __tablename__ = "code_examples"

    example_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    material_id: Mapped[int] = mapped_column(
        ForeignKey("lecture_materials.material_id"), nullable=False
    )
    concept_name: Mapped[str] = mapped_column(String(255), nullable=False)
    code_content: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(String(50))  # e.g., "C", "python", "pseudocode"
    explanation: Mapped[str | None] = mapped_column(Text)
    complexity: Mapped[str | None] = mapped_column(String(50))  # time/space complexity

    lecture_material: Mapped["LectureMaterial"] = relationship(back_populates="code_examples")


class ExerciseProblem(Base):
    """Store exercise problems and practice questions from lecture materials"""
    __tablename__ = "exercise_problems"

    problem_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    material_id: Mapped[int] = mapped_column(
        ForeignKey("lecture_materials.material_id"), nullable=False
    )
    problem_statement: Mapped[str] = mapped_column(Text, nullable=False)
    solution: Mapped[str | None] = mapped_column(Text)
    difficulty_level: Mapped[str] = mapped_column(String(50))  # "easy", "medium", "hard"
    problem_type: Mapped[str] = mapped_column(String(100))  # "implementation", "analysis", "design"
    related_concepts: Mapped[str | None] = mapped_column(Text)  # JSON array

    lecture_material: Mapped["LectureMaterial"] = relationship(back_populates="exercises")
