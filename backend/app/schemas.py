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
