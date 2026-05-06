from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Name must not be empty.")
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if "@" not in cleaned or cleaned.startswith("@") or cleaned.endswith("@"):
            raise ValueError("Email must be a valid email address.")
        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return value


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if "@" not in cleaned or cleaned.startswith("@") or cleaned.endswith("@"):
            raise ValueError("Email must be a valid email address.")
        return cleaned


class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if "@" not in cleaned or cleaned.startswith("@") or cleaned.endswith("@"):
            raise ValueError("Email must be a valid email address.")
        return cleaned


class ForgotPasswordResponse(BaseModel):
    message: str
    reset_url: str | None = None


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("token")
    @classmethod
    def validate_token(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Token must not be empty.")
        return cleaned

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return value


class ResetPasswordResponse(BaseModel):
    message: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    name: str
    email: str
    created_at: datetime


class AuthResponse(BaseModel):
    message: str
    user: UserResponse
    access_token: str


class LogoutResponse(BaseModel):
    message: str


class TopicOverviewResponse(BaseModel):
    topic_id: int
    slug: str
    title: str
    description: str
    short_description: str
    current_step_label: str | None = None
    current_focus: str | None = None
    progress: int
    level: str
    exercises: int
    duration: str
    icon: str
    status: str
    recommended: bool = False
    locked: bool = False


class LearningFlowStepResponse(BaseModel):
    step_order: int
    step_type: str
    title: str
    description: str


class MaterialSectionResponse(BaseModel):
    title: str
    content: str
    generated_by_llm: bool = False


class ExampleSectionResponse(BaseModel):
    title: str
    description: str
    code: str
    generated_by_llm: bool = False


class ExerciseItemResponse(BaseModel):
    exercise_id: int
    question: str
    difficulty_level: str | None = None
    generated_by_llm: bool = False
    latest_answer: str | None = None
    latest_feedback: str | None = None
    latest_score: float | None = None
    latest_is_correct: bool | None = None
    explanation: str | None = None


class AdaptiveGuidanceResponse(BaseModel):
    weakness_level: str
    focus_message: str
    recommended_next_step: str
    adaptive_content_applied: bool


class TopicLearningResponse(BaseModel):
    topic: TopicOverviewResponse
    guided_flow: list[LearningFlowStepResponse]
    materials: list[MaterialSectionResponse]
    examples: list[ExampleSectionResponse]
    exercises: list[ExerciseItemResponse]
    summary: str
    adaptive_guidance: AdaptiveGuidanceResponse
    llm_enabled: bool
    completed_steps: list[str]
    study_minutes: int


class ExerciseSubmissionRequest(BaseModel):
    answer_text: str

    @field_validator("answer_text")
    @classmethod
    def validate_answer_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Answer must not be empty.")
        return cleaned


class ExerciseSubmissionResponse(BaseModel):
    message: str
    is_correct: bool
    score: float
    feedback: str
    explanation: str
    recommended_review: str
    updated_progress: int
    updated_weakness_level: str
    completed_steps: list[str]
    study_minutes: int


class GenerateTopicContentResponse(BaseModel):
    message: str
    topic_learning: TopicLearningResponse


class TopicStepTrackingRequest(BaseModel):
    step_type: str

    @field_validator("step_type")
    @classmethod
    def validate_step_type(cls, value: str) -> str:
        cleaned = value.strip().lower()
        if cleaned not in {"material", "example", "exercise", "summary"}:
            raise ValueError("Invalid step type.")
        return cleaned


class TopicStepTrackingResponse(BaseModel):
    message: str
    updated_progress: int
    completed_steps: list[str]
    study_minutes: int


class StatCardResponse(BaseModel):
    label: str
    value: str


class DashboardResponse(BaseModel):
    continue_learning: list[TopicOverviewResponse]
    stats: list[StatCardResponse]


class TopicsResponse(BaseModel):
    topics: list[TopicOverviewResponse]
    learning_path_title: str
    learning_path_description: str


class InsightSummaryResponse(BaseModel):
    label: str
    value: str
    tone: str


class ImprovementAreaResponse(BaseModel):
    title: str
    description: str
    progress: int
    icon: str


class LearningPlanItemResponse(BaseModel):
    title: str
    description: str


class InsightsResponse(BaseModel):
    summary: list[InsightSummaryResponse]
    recommendation_title: str
    recommendation_text: str
    improvement_areas: list[ImprovementAreaResponse]
    learning_plan: list[LearningPlanItemResponse]


class ProgressSummaryResponse(BaseModel):
    label: str
    value: str
    tone: str


class ProgressChartBarResponse(BaseModel):
    label: str
    value: int
    color: str


class ProgressTopicDetailResponse(BaseModel):
    topic_id: int
    slug: str
    title: str
    description: str
    progress: int
    exercises_completed: int
    exercises_total: int
    icon: str
    status: str
    last_accessed: datetime | None


class AchievementResponse(BaseModel):
    title: str
    description: str
    status: str
    tone: str


class ProgressResponse(BaseModel):
    summary: list[ProgressSummaryResponse]
    chart: list[ProgressChartBarResponse]
    topics: list[ProgressTopicDetailResponse]
    achievements: list[AchievementResponse]
    encouragement_title: str
    encouragement_text: str


# RAG System Schemas
class MaterialChunkResponse(BaseModel):
    chunk_id: int
    chunk_text: str
    section_title: str | None = None
    chunk_type: str
    material_id: int

    model_config = ConfigDict(from_attributes=True)


class ConceptDefinitionResponse(BaseModel):
    concept_id: int
    concept_name: str
    definition: str
    importance_level: str | None = None
    related_concepts: str | None = None

    model_config = ConfigDict(from_attributes=True)


class CodeExampleResponse(BaseModel):
    example_id: int
    concept_name: str
    code_content: str
    language: str
    explanation: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ExerciseProblemResponse(BaseModel):
    problem_id: int
    problem_statement: str
    solution: str | None = None
    difficulty_level: str
    problem_type: str

    model_config = ConfigDict(from_attributes=True)


class LectureMaterialResponse(BaseModel):
    material_id: int
    week: str
    title: str
    source_file: str
    content_summary: str | None = None
    chunks: list[MaterialChunkResponse] = []
    concepts: list[ConceptDefinitionResponse] = []
    code_examples: list[CodeExampleResponse] = []
    exercises: list[ExerciseProblemResponse] = []

    model_config = ConfigDict(from_attributes=True)


class MaterialSearchRequest(BaseModel):
    keywords: list[str]
    topic_id: int | None = None
    limit: int = 10

    @field_validator("keywords")
    @classmethod
    def validate_keywords(cls, value: list[str]) -> list[str]:
        if not value or len(value) == 0:
            raise ValueError("At least one keyword is required.")
        return [k.strip() for k in value if k.strip()]

    @field_validator("limit")
    @classmethod
    def validate_limit(cls, value: int) -> int:
        if value < 1 or value > 100:
            raise ValueError("Limit must be between 1 and 100.")
        return value


class MaterialSearchResponse(BaseModel):
    query_keywords: list[str]
    total_results: int
    results: list[MaterialChunkResponse]
    related_concepts: list[ConceptDefinitionResponse] = []
    related_examples: list[CodeExampleResponse] = []


class TopicMaterialResponse(BaseModel):
    topic_id: int
    topic_name: str
    lecture_materials: list[LectureMaterialResponse]
    key_concepts: list[ConceptDefinitionResponse]
    code_examples: list[CodeExampleResponse]
    practice_exercises: list[ExerciseProblemResponse]


class MaterialDetailResponse(BaseModel):
    material_id: int
    title: str
    week: str
    source_file: str
    full_content: str
    chunks: list[MaterialChunkResponse]
    concepts: list[ConceptDefinitionResponse]
    code_examples: list[CodeExampleResponse]
    exercises: list[ExerciseProblemResponse]

    model_config = ConfigDict(from_attributes=True)


class TutorialCatalogItemResponse(BaseModel):
    slug: str
    week: str
    title: str
    icon: str
    description: str
    chapter_count: int
    pdf_count: int


class TutorialResourceResponse(BaseModel):
    file_name: str
    title: str
    week: str
    pdf_url: str
    excerpt: str


class TutorialConceptResponse(BaseModel):
    name: str
    definition: str
    importance: str


class TutorialCodeExampleResponse(BaseModel):
    title: str
    language: str
    code: str


class TutorialExerciseResponse(BaseModel):
    statement: str
    difficulty: str
    type: str


class TutorialChapterResponse(BaseModel):
    slug: str
    title: str
    summary: str
    key_points: list[str]
    concepts: list[TutorialConceptResponse]
    code_examples: list[TutorialCodeExampleResponse]
    exercises: list[TutorialExerciseResponse]
    resources: list[TutorialResourceResponse]


class TutorialTopicResponse(BaseModel):
    slug: str
    week: str
    title: str
    icon: str
    description: str
    intro: str
    chapter_count: int
    pdf_count: int
    chapters: list[TutorialChapterResponse]
