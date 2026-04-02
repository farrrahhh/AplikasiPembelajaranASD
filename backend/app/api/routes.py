from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.learning import (
    ensure_user_learning_profile,
    get_dashboard_payload,
    generate_topic_content_payload,
    get_insights_payload,
    get_progress_payload,
    get_topic_learning_payload,
    get_topics_payload,
    submit_exercise_answer,
    track_topic_step,
)
from app.models import User
from app.schemas import (
    AuthResponse,
    DashboardResponse,
    ExerciseSubmissionRequest,
    ExerciseSubmissionResponse,
    GenerateTopicContentResponse,
    InsightsResponse,
    LoginRequest,
    LogoutResponse,
    ProgressResponse,
    RegisterRequest,
    TopicStepTrackingRequest,
    TopicStepTrackingResponse,
    TopicLearningResponse,
    TopicsResponse,
    UserResponse,
)
from app.security import (
    create_access_token,
    hash_password,
    verify_access_token,
    verify_password,
)

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
        )

    try:
        token_payload = verify_access_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    user = db.get(User, int(token_payload["sub"]))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this token was not found.",
        )

    return user


@router.get("/", tags=["root"])
async def read_root() -> dict[str, str]:
    return {"message": "Aplikasi Pembelajaran ASD API is running."}


@router.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post(
    "/auth/register",
    tags=["auth"],
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    existing_user = db.execute(
        select(User).where(User.email == payload.email)
    ).scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered.",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    ensure_user_learning_profile(db, user)

    return AuthResponse(
        message="User registered successfully.",
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.user_id, user.email),
    )


@router.post(
    "/auth/login",
    tags=["auth"],
    response_model=AuthResponse,
)
async def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    ensure_user_learning_profile(db, user)

    return AuthResponse(
        message="Login successful.",
        user=UserResponse.model_validate(user),
        access_token=create_access_token(user.user_id, user.email),
    )


@router.post("/auth/logout", tags=["auth"], response_model=LogoutResponse)
async def logout() -> LogoutResponse:
    return LogoutResponse(message="Logout successful.")


@router.get("/users/me", tags=["users"], response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.get(
    "/users/me/dashboard",
    tags=["dashboard"],
    response_model=DashboardResponse,
)
async def get_my_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DashboardResponse:
    return get_dashboard_payload(db, current_user)


@router.get(
    "/users/me/topics",
    tags=["topics"],
    response_model=TopicsResponse,
)
async def get_my_topics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TopicsResponse:
    return get_topics_payload(db, current_user)


@router.get(
    "/users/me/topics/{topic_slug}/learning",
    tags=["topics"],
    response_model=TopicLearningResponse,
)
async def get_topic_learning(
    topic_slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TopicLearningResponse:
    try:
        return get_topic_learning_payload(db, current_user, topic_slug)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        ) from exc


@router.post(
    "/users/me/topics/{topic_slug}/track-step",
    tags=["topics"],
    response_model=TopicStepTrackingResponse,
)
async def track_learning_step(
    topic_slug: str,
    payload: TopicStepTrackingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TopicStepTrackingResponse:
    try:
        return track_topic_step(db, current_user, topic_slug, payload.step_type)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        ) from exc


@router.post(
    "/users/me/topics/{topic_slug}/generate",
    tags=["topics"],
    response_model=GenerateTopicContentResponse,
)
async def generate_topic_content(
    topic_slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> GenerateTopicContentResponse:
    try:
        return generate_topic_content_payload(db, current_user, topic_slug)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        ) from exc


@router.post(
    "/users/me/topics/{topic_slug}/exercises/{exercise_id}/answer",
    tags=["topics"],
    response_model=ExerciseSubmissionResponse,
)
async def answer_topic_exercise(
    topic_slug: str,
    exercise_id: int,
    payload: ExerciseSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ExerciseSubmissionResponse:
    try:
        return submit_exercise_answer(
            db,
            current_user,
            topic_slug,
            exercise_id,
            payload.answer_text,
        )
    except KeyError as exc:
        detail = (
            "Exercise not found for this topic."
            if str(exc) == "'exercise_not_found'"
            else "Topic not found."
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
        ) from exc


@router.get(
    "/users/me/insights",
    tags=["insights"],
    response_model=InsightsResponse,
)
async def get_my_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InsightsResponse:
    return get_insights_payload(db, current_user)


@router.get(
    "/users/me/progress",
    tags=["progress"],
    response_model=ProgressResponse,
)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProgressResponse:
    return get_progress_payload(db, current_user)
