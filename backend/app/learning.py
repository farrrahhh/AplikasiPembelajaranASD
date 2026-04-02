from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.catalog import TOPIC_BLUEPRINTS, TOPIC_BLUEPRINTS_BY_NAME
from app.config import settings
from app.llm import generate_personalized_insight, generate_topic_learning_content
from app.models import (
    Example,
    Exercise,
    Explanation,
    LearningPath,
    Material,
    Progress,
    Topic,
    User,
    UserAnswer,
    UserPerformance,
    UserTopicTracking,
)
from app.schemas import (
    AchievementResponse,
    AdaptiveGuidanceResponse,
    DashboardResponse,
    ExampleSectionResponse,
    ExerciseItemResponse,
    ExerciseSubmissionResponse,
    GenerateTopicContentResponse,
    ImprovementAreaResponse,
    InsightSummaryResponse,
    InsightsResponse,
    LearningFlowStepResponse,
    LearningPlanItemResponse,
    MaterialSectionResponse,
    ProgressChartBarResponse,
    ProgressResponse,
    ProgressSummaryResponse,
    ProgressTopicDetailResponse,
    StatCardResponse,
    TopicLearningResponse,
    TopicOverviewResponse,
    TopicStepTrackingResponse,
    TopicsResponse,
)
from app.topic_content import TOPIC_CONTENT_BLUEPRINTS


DEFAULT_FLOW_STEPS = [
    {
        "step_order": 1,
        "step_type": "material",
        "title": "Pelajari Materi",
        "description": "Pahami konsep inti topik terlebih dahulu.",
    },
    {
        "step_order": 2,
        "step_type": "example",
        "title": "Lihat Contoh",
        "description": "Amati ilustrasi dan implementasi sederhana.",
    },
    {
        "step_order": 3,
        "step_type": "exercise",
        "title": "Kerjakan Latihan",
        "description": "Uji pemahaman dengan menjawab soal.",
    },
    {
        "step_order": 4,
        "step_type": "summary",
        "title": "Baca Ringkasan",
        "description": "Tutup sesi dengan rangkuman singkat.",
    },
]

STEP_TRACKING_MINUTES = {
    "material": 10,
    "example": 8,
    "exercise": 15,
    "summary": 6,
    "generate": 5,
}

PROGRESS_WEIGHTS = {
    "material": 20,
    "example": 20,
    "summary": 15,
    "exercise_completion": 20,
    "exercise_accuracy": 25,
}


def _serialize_material_item(kind: str, title: str, content: str) -> str:
    return json.dumps(
        {"kind": kind, "title": title, "content": content},
        ensure_ascii=False,
    )


def _serialize_example_item(title: str, description: str, code: str) -> str:
    return json.dumps(
        {"title": title, "description": description, "code": code},
        ensure_ascii=False,
    )


def _serialize_explanation_item(
    *,
    reference_answer: str,
    explanation: str,
    keywords: list[str],
) -> str:
    return json.dumps(
        {
            "reference_answer": reference_answer,
            "explanation": explanation,
            "keywords": keywords,
        },
        ensure_ascii=False,
    )


def _parse_json_payload(raw_value: str | None, fallback: dict | None = None) -> dict:
    if not raw_value:
        return fallback or {}

    try:
        payload = json.loads(raw_value)
        if isinstance(payload, dict):
            return payload
    except json.JSONDecodeError:
        pass

    return fallback or {}


def _normalize_text(value: str) -> str:
    return " ".join(value.lower().strip().split())


def _topic_blueprint_for_slug(topic_slug: str) -> dict:
    for blueprint in TOPIC_BLUEPRINTS:
        if blueprint["slug"] == topic_slug:
            return blueprint
    raise KeyError(topic_slug)


def _topic_content_for_name(topic_name: str) -> dict:
    return TOPIC_CONTENT_BLUEPRINTS[topic_name]


def _ensure_material_rows(
    db: Session,
    topic: Topic,
    *,
    materials: list[dict[str, str]],
    summary: str,
    generated_by_llm: bool,
) -> None:
    existing_rows = (
        db.execute(
            select(Material)
            .where(Material.topic_id == topic.topic_id)
            .order_by(Material.material_id.asc())
        )
        .scalars()
        .all()
    )
    material_payloads = [
        _serialize_material_item("material", item["title"], item["content"])
        for item in materials
    ] + [_serialize_material_item("summary", "Ringkasan", summary)]

    for index, payload in enumerate(material_payloads):
        if index < len(existing_rows):
            row = existing_rows[index]
            row.content = payload
            row.generated_by_llm = generated_by_llm
        else:
            db.add(
                Material(
                    topic_id=topic.topic_id,
                    content=payload,
                    generated_by_llm=generated_by_llm,
                )
            )


def _ensure_example_rows(
    db: Session,
    topic: Topic,
    *,
    examples: list[dict[str, str]],
    generated_by_llm: bool,
) -> None:
    existing_rows = (
        db.execute(
            select(Example)
            .where(Example.topic_id == topic.topic_id)
            .order_by(Example.example_id.asc())
        )
        .scalars()
        .all()
    )

    for index, item in enumerate(examples):
        payload = _serialize_example_item(
            item["title"], item["description"], item["code"]
        )
        if index < len(existing_rows):
            row = existing_rows[index]
            row.content = payload
            row.generated_by_llm = generated_by_llm
        else:
            db.add(
                Example(
                    topic_id=topic.topic_id,
                    content=payload,
                    generated_by_llm=generated_by_llm,
                )
            )


def _ensure_exercise_rows(
    db: Session,
    topic: Topic,
    *,
    exercises: list[dict[str, object]],
    difficulty_level: str,
    generated_by_llm: bool,
) -> None:
    existing_rows = (
        db.execute(
            select(Exercise)
            .where(Exercise.topic_id == topic.topic_id)
            .order_by(Exercise.exercise_id.asc())
        )
        .scalars()
        .all()
    )

    for index, item in enumerate(exercises):
        exercise = existing_rows[index] if index < len(existing_rows) else None
        if exercise is None:
            exercise = Exercise(
                topic_id=topic.topic_id,
                question=str(item["question"]),
                difficulty_level=difficulty_level,
                generated_by_llm=generated_by_llm,
            )
            db.add(exercise)
            db.flush()
        else:
            exercise.question = str(item["question"])
            exercise.difficulty_level = difficulty_level
            exercise.generated_by_llm = generated_by_llm

        explanation = db.execute(
            select(Explanation).where(Explanation.exercise_id == exercise.exercise_id)
        ).scalar_one_or_none()
        explanation_payload = _serialize_explanation_item(
            reference_answer=str(item["reference_answer"]),
            explanation=str(item["explanation"]),
            keywords=[str(keyword).lower() for keyword in item["keywords"]],
        )

        if explanation is None:
            db.add(
                Explanation(
                    exercise_id=exercise.exercise_id,
                    content=explanation_payload,
                    generated_by_llm=generated_by_llm,
                )
            )
        else:
            explanation.content = explanation_payload
            explanation.generated_by_llm = generated_by_llm


def _ensure_learning_path_rows(db: Session, topic: Topic) -> None:
    existing_rows = (
        db.execute(
            select(LearningPath)
            .where(LearningPath.topic_id == topic.topic_id)
            .order_by(LearningPath.step_order.asc())
        )
        .scalars()
        .all()
    )

    for index, step in enumerate(DEFAULT_FLOW_STEPS):
        if index < len(existing_rows):
            row = existing_rows[index]
            row.step_order = step["step_order"]
            row.step_type = step["step_type"]
        else:
            db.add(
                LearningPath(
                    topic_id=topic.topic_id,
                    step_order=step["step_order"],
                    step_type=step["step_type"],
                )
            )


def _get_tracking_record(
    db: Session,
    *,
    user_id: int,
    topic_id: int,
) -> UserTopicTracking:
    tracking = db.execute(
        select(UserTopicTracking).where(
            UserTopicTracking.user_id == user_id,
            UserTopicTracking.topic_id == topic_id,
        )
    ).scalar_one_or_none()

    if tracking is None:
        tracking = UserTopicTracking(
            user_id=user_id,
            topic_id=topic_id,
            material_completed=False,
            example_completed=False,
            summary_completed=False,
            exercises_attempted=0,
            exercises_completed=0,
            generated_content_count=0,
            study_minutes=0,
        )
        db.add(tracking)
        db.flush()

    return tracking


def _completed_steps_from_tracking(tracking: UserTopicTracking) -> list[str]:
    completed_steps: list[str] = []
    if tracking.material_completed:
        completed_steps.append("material")
    if tracking.example_completed:
        completed_steps.append("example")
    if tracking.exercises_attempted > 0:
        completed_steps.append("exercise")
    if tracking.summary_completed:
        completed_steps.append("summary")
    return completed_steps


def _compute_topic_progress(
    *,
    tracking: UserTopicTracking,
    exercise_total: int,
    accuracy: float | None,
) -> int:
    progress_value = 0.0

    if tracking.material_completed:
        progress_value += PROGRESS_WEIGHTS["material"]
    if tracking.example_completed:
        progress_value += PROGRESS_WEIGHTS["example"]
    if tracking.summary_completed:
        progress_value += PROGRESS_WEIGHTS["summary"]

    completion_ratio = (
        min(tracking.exercises_completed / max(exercise_total, 1), 1.0)
        if exercise_total
        else 0.0
    )
    accuracy_ratio = min((accuracy or 0.0) / 100, 1.0)

    progress_value += completion_ratio * PROGRESS_WEIGHTS["exercise_completion"]
    progress_value += accuracy_ratio * PROGRESS_WEIGHTS["exercise_accuracy"]

    return round(min(progress_value, 100))


def _format_estimated_duration(minutes: int) -> str:
    safe_minutes = max(int(minutes), 0)
    if safe_minutes <= 0:
        return "~0 min"

    hours, remaining_minutes = divmod(safe_minutes, 60)
    if hours == 0:
        return f"~{remaining_minutes} min"
    if remaining_minutes == 0:
        return f"~{hours} jam"
    return f"~{hours} jam {remaining_minutes} min"


def _estimate_topic_duration(row: dict) -> str:
    raw_material_count = int(row.get("material_count") or 0)
    material_count = max(raw_material_count - 1, 0)
    example_count = int(row.get("example_count") or 0)
    exercise_count = int(row.get("exercise_count") or 0)
    has_summary = raw_material_count > material_count

    estimated_minutes = (
        (material_count * 12)
        + (example_count * 10)
        + (exercise_count * 15)
        + (6 if has_summary else 0)
    )
    return _format_estimated_duration(estimated_minutes)


def _derive_topic_status(*, progress: int, unlocked: bool) -> str:
    if not unlocked:
        return "locked"
    if progress >= 70:
        return "mastered"
    if progress >= 35:
        return "in-progress"
    return "beginner"


def _is_topic_unlocked(topic_index: int, topic_rows: list[dict]) -> bool:
    if topic_index == 0:
        return True

    previous_row = topic_rows[topic_index - 1]
    return int(round(previous_row.get("computed_progress", 0))) >= 60


def seed_topics_and_exercises(db: Session) -> None:
    existing_topics = {
        topic.topic_name: topic for topic in db.execute(select(Topic)).scalars().all()
    }

    for blueprint in TOPIC_BLUEPRINTS:
        topic = existing_topics.get(blueprint["name"])
        if topic is None:
            topic = Topic(
                topic_name=blueprint["name"],
                description=blueprint["description"],
                difficulty_level=blueprint["difficulty"],
            )
            db.add(topic)
            db.flush()
            existing_topics[blueprint["name"]] = topic
        else:
            topic.description = blueprint["description"]
            topic.difficulty_level = blueprint["difficulty"]

        content_blueprint = _topic_content_for_name(blueprint["name"])
        _ensure_material_rows(
            db,
            topic,
            materials=content_blueprint["materials"],
            summary=content_blueprint["summary"],
            generated_by_llm=False,
        )
        _ensure_example_rows(
            db,
            topic,
            examples=content_blueprint["examples"],
            generated_by_llm=False,
        )
        _ensure_exercise_rows(
            db,
            topic,
            exercises=content_blueprint["exercises"],
            difficulty_level=blueprint["difficulty"],
            generated_by_llm=False,
        )
        _ensure_learning_path_rows(db, topic)

    db.commit()


def ensure_user_learning_profile(db: Session, user: User) -> None:
    topics = db.execute(select(Topic)).scalars().all()
    topic_by_name = {topic.topic_name: topic for topic in topics}
    now = datetime.now(timezone.utc)
    should_commit = False

    for blueprint in TOPIC_BLUEPRINTS:
        topic = topic_by_name.get(blueprint["name"])
        if topic is None:
            continue

        progress_record = db.execute(
            select(Progress).where(
                Progress.user_id == user.user_id,
                Progress.topic_id == topic.topic_id,
            )
        ).scalar_one_or_none()

        if progress_record is None:
            db.add(
                Progress(
                    user_id=user.user_id,
                    topic_id=topic.topic_id,
                    completion_percentage=0,
                    last_accessed=None,
                )
            )
            should_commit = True

        performance_record = db.execute(
            select(UserPerformance).where(
                UserPerformance.user_id == user.user_id,
                UserPerformance.topic_id == topic.topic_id,
            )
        ).scalar_one_or_none()

        if performance_record is None:
            db.add(
                UserPerformance(
                    user_id=user.user_id,
                    topic_id=topic.topic_id,
                    accuracy=0,
                    avg_score=0,
                    weakness_level="medium",
                )
            )
            should_commit = True

        tracking_record = db.execute(
            select(UserTopicTracking).where(
                UserTopicTracking.user_id == user.user_id,
                UserTopicTracking.topic_id == topic.topic_id,
            )
        ).scalar_one_or_none()

        if tracking_record is None:
            db.add(
                UserTopicTracking(
                    user_id=user.user_id,
                    topic_id=topic.topic_id,
                    material_completed=False,
                    example_completed=False,
                    summary_completed=False,
                    exercises_attempted=0,
                    exercises_completed=0,
                    generated_content_count=0,
                    study_minutes=0,
                    last_completed_step=None,
                    updated_at=now,
                )
            )
            should_commit = True

    if should_commit:
        db.commit()


def _fetch_topic_rows(db: Session, user_id: int) -> list[dict]:
    exercise_count_subquery = (
        select(func.count(Exercise.exercise_id))
        .where(Exercise.topic_id == Topic.topic_id)
        .scalar_subquery()
    )
    material_count_subquery = (
        select(func.count(Material.material_id))
        .where(Material.topic_id == Topic.topic_id)
        .scalar_subquery()
    )
    example_count_subquery = (
        select(func.count(Example.example_id))
        .where(Example.topic_id == Topic.topic_id)
        .scalar_subquery()
    )

    statement = (
        select(
            Topic.topic_id,
            Topic.topic_name,
            Topic.description,
            Topic.difficulty_level,
            Progress.completion_percentage,
            Progress.last_accessed,
            UserPerformance.avg_score,
            UserPerformance.accuracy,
            UserPerformance.weakness_level,
            UserTopicTracking.material_completed,
            UserTopicTracking.example_completed,
            UserTopicTracking.summary_completed,
            UserTopicTracking.exercises_attempted,
            UserTopicTracking.exercises_completed,
            UserTopicTracking.generated_content_count,
            UserTopicTracking.study_minutes,
            UserTopicTracking.last_completed_step,
            UserTopicTracking.updated_at.label("tracking_updated_at"),
            exercise_count_subquery.label("exercise_count"),
            material_count_subquery.label("material_count"),
            example_count_subquery.label("example_count"),
        )
        .join(Progress, Progress.topic_id == Topic.topic_id)
        .join(
            UserPerformance,
            (UserPerformance.topic_id == Topic.topic_id)
            & (UserPerformance.user_id == user_id),
        )
        .join(
            UserTopicTracking,
            (UserTopicTracking.topic_id == Topic.topic_id)
            & (UserTopicTracking.user_id == user_id),
        )
        .where(Progress.user_id == user_id)
        .order_by(Topic.topic_id.asc())
    )
    raw_rows = [dict(row._mapping) for row in db.execute(statement).all()]

    for index, row in enumerate(raw_rows):
        unlocked = _is_topic_unlocked(index, raw_rows)
        computed_progress = _compute_topic_progress(
            tracking=type(
                "_TrackingSnapshot",
                (),
                {
                    "material_completed": bool(row["material_completed"]),
                    "example_completed": bool(row["example_completed"]),
                    "summary_completed": bool(row["summary_completed"]),
                    "exercises_attempted": int(row["exercises_attempted"] or 0),
                    "exercises_completed": int(row["exercises_completed"] or 0),
                },
            )(),
            exercise_total=int(row["exercise_count"] or 0),
            accuracy=row["accuracy"],
        )
        row["computed_progress"] = computed_progress
        row["computed_unlocked"] = unlocked
        row["computed_status"] = _derive_topic_status(
            progress=computed_progress,
            unlocked=unlocked,
        )

    return raw_rows


def _topic_overview_from_row(row: dict) -> TopicOverviewResponse:
    blueprint = TOPIC_BLUEPRINTS_BY_NAME[row["topic_name"]]
    exercise_count = int(row.get("exercise_count") or 0)
    computed_progress = int(round(row.get("computed_progress", 0)))

    return TopicOverviewResponse(
        topic_id=row["topic_id"],
        slug=blueprint["slug"],
        title=row["topic_name"],
        description=row["description"] or blueprint["description"],
        short_description=blueprint["short_description"],
        progress=computed_progress,
        level=row["difficulty_level"] or blueprint["difficulty"],
        exercises=exercise_count,
        duration=_estimate_topic_duration(row),
        icon=blueprint["icon"],
        status=str(row.get("computed_status") or "beginner"),
        recommended=bool(blueprint["recommended"]),
        locked=not bool(row.get("computed_unlocked", True)),
    )


def _get_first_material_title(db: Session, topic_id: int) -> str:
    material_rows = (
        db.execute(
            select(Material)
            .where(Material.topic_id == topic_id)
            .order_by(Material.material_id.asc())
        )
        .scalars()
        .all()
    )

    for row in material_rows:
        payload = _parse_json_payload(row.content)
        if payload.get("kind") == "summary":
            continue
        title = str(payload.get("title", "")).strip()
        if title:
            return title

    return "Konsep inti topik"


def _get_first_example_title(db: Session, topic_id: int) -> str:
    example_row = db.execute(
        select(Example)
        .where(Example.topic_id == topic_id)
        .order_by(Example.example_id.asc())
    ).scalar_one_or_none()
    if example_row is None:
        return "Contoh implementasi"

    payload = _parse_json_payload(example_row.content)
    title = str(payload.get("title", "")).strip()
    return title or "Contoh implementasi"


def _resolve_current_learning_focus(
    db: Session,
    *,
    topic_id: int,
    row: dict,
) -> tuple[str, str]:
    progress = int(round(row.get("computed_progress", 0)))
    exercise_total = int(row.get("exercise_count") or 0)
    exercises_completed = int(row.get("exercises_completed") or 0)

    if progress >= 100:
        return "Review", "Topik ini sudah selesai. Ulangi latihan untuk memperkuat pemahaman."

    if not bool(row.get("material_completed")):
        return "Materi", f"Sedang mempelajari: {_get_first_material_title(db, topic_id)}"

    if not bool(row.get("example_completed")):
        return "Contoh", f"Sedang melihat contoh: {_get_first_example_title(db, topic_id)}"

    if exercises_completed < exercise_total:
        next_exercise = min(exercises_completed + 1, exercise_total)
        return "Latihan", f"Sedang mengerjakan latihan {next_exercise} dari {exercise_total}"

    if not bool(row.get("summary_completed")):
        return "Ringkasan", "Sedang meninjau ringkasan materi untuk menutup sesi belajar."

    return "Review", "Lanjutkan review materi dan latihan untuk meningkatkan akurasi."


def _apply_personalized_recommendation(
    topics: list[TopicOverviewResponse],
    topic_rows: list[dict],
) -> list[TopicOverviewResponse]:
    recommended_slug: str | None = None

    for row in sorted(
        topic_rows,
        key=lambda item: (
            bool(item.get("computed_unlocked")) is False,
            int(round(item.get("computed_progress", 0))),
            0
            if item.get("weakness_level") == "high"
            else 1
            if item.get("weakness_level") == "medium"
            else 2,
        ),
    ):
        if bool(row.get("computed_unlocked")) and int(round(row.get("computed_progress", 0))) < 100:
            recommended_slug = TOPIC_BLUEPRINTS_BY_NAME[row["topic_name"]]["slug"]
            break

    for topic in topics:
        topic.recommended = topic.slug == recommended_slug

    return topics


def _build_dashboard_topic_overview(db: Session, row: dict) -> TopicOverviewResponse:
    topic = _topic_overview_from_row(row)
    current_step_label, current_focus = _resolve_current_learning_focus(
        db,
        topic_id=int(row["topic_id"]),
        row=row,
    )
    topic.current_step_label = current_step_label
    topic.current_focus = current_focus
    return topic


def _get_topic_row(db: Session, user_id: int, topic_slug: str) -> dict:
    for row in _fetch_topic_rows(db, user_id):
        if TOPIC_BLUEPRINTS_BY_NAME[row["topic_name"]]["slug"] == topic_slug:
            return row
    raise KeyError(topic_slug)


def _get_topic_and_overview(db: Session, user: User, topic_slug: str) -> tuple[Topic, TopicOverviewResponse, dict]:
    ensure_user_learning_profile(db, user)
    row = _get_topic_row(db, user.user_id, topic_slug)
    topic = db.get(Topic, row["topic_id"])
    if topic is None:
        raise KeyError(topic_slug)
    return topic, _topic_overview_from_row(row), row


def _get_latest_answers_by_exercise(db: Session, user_id: int, exercise_ids: list[int]) -> dict[int, UserAnswer]:
    latest_answers: dict[int, UserAnswer] = {}
    if not exercise_ids:
        return latest_answers

    answers = (
        db.execute(
            select(UserAnswer)
            .where(
                UserAnswer.user_id == user_id,
                UserAnswer.exercise_id.in_(exercise_ids),
            )
            .order_by(UserAnswer.exercise_id.asc(), UserAnswer.created_at.desc())
        )
        .scalars()
        .all()
    )

    for answer in answers:
        latest_answers.setdefault(answer.exercise_id, answer)

    return latest_answers


def _get_topic_answers(db: Session, *, user_id: int, topic_id: int) -> list[UserAnswer]:
    return (
        db.execute(
            select(UserAnswer)
            .join(Exercise, Exercise.exercise_id == UserAnswer.exercise_id)
            .where(
                UserAnswer.user_id == user_id,
                Exercise.topic_id == topic_id,
            )
            .order_by(UserAnswer.created_at.asc())
        )
        .scalars()
        .all()
    )


def _get_topic_answer_metrics(
    db: Session,
    *,
    user_id: int,
    topic_id: int,
) -> dict[str, float | int | dict[int, UserAnswer]]:
    exercises = (
        db.execute(
            select(Exercise)
            .where(Exercise.topic_id == topic_id)
            .order_by(Exercise.exercise_id.asc())
        )
        .scalars()
        .all()
    )
    exercise_ids = [exercise.exercise_id for exercise in exercises]
    latest_answers = _get_latest_answers_by_exercise(db, user_id, exercise_ids)
    all_answers = _get_topic_answers(db, user_id=user_id, topic_id=topic_id)

    answered_unique_count = len(latest_answers)
    correct_count = sum(1 for answer in latest_answers.values() if answer.is_correct)
    average_score = (
        round(
            sum(float(answer.score or 0) for answer in latest_answers.values())
            / answered_unique_count,
            1,
        )
        if answered_unique_count
        else 0.0
    )
    accuracy = (
        round((correct_count / answered_unique_count) * 100, 1)
        if answered_unique_count
        else 0.0
    )

    return {
        "exercise_total": len(exercises),
        "latest_answers": latest_answers,
        "all_answers_count": len(all_answers),
        "answered_unique_count": answered_unique_count,
        "correct_count": correct_count,
        "average_score": average_score,
        "accuracy": accuracy,
    }


def _derive_weakness_level(*, progress: int, accuracy: float, answered_unique_count: int) -> str:
    if answered_unique_count == 0:
        return "medium"
    if accuracy < 50 or progress < 35:
        return "high"
    if accuracy < 75 or progress < 70:
        return "medium"
    return "low"


def _touch_last_accessed(progress_record: Progress) -> None:
    progress_record.last_accessed = datetime.now(timezone.utc)


def _recalculate_topic_state(
    db: Session,
    *,
    user: User,
    topic: Topic,
    tracking: UserTopicTracking | None = None,
) -> tuple[int, str, UserTopicTracking]:
    tracking_record = tracking or _get_tracking_record(
        db,
        user_id=user.user_id,
        topic_id=topic.topic_id,
    )
    metrics = _get_topic_answer_metrics(
        db,
        user_id=user.user_id,
        topic_id=topic.topic_id,
    )

    tracking_record.exercises_attempted = int(metrics["all_answers_count"])
    tracking_record.exercises_completed = int(metrics["answered_unique_count"])

    computed_progress = _compute_topic_progress(
        tracking=tracking_record,
        exercise_total=int(metrics["exercise_total"]),
        accuracy=float(metrics["accuracy"]),
    )
    weakness_level = _derive_weakness_level(
        progress=computed_progress,
        accuracy=float(metrics["accuracy"]),
        answered_unique_count=int(metrics["answered_unique_count"]),
    )

    progress_record = _get_progress_record(db, user.user_id, topic.topic_id)
    performance_record = _get_performance_record(db, user.user_id, topic.topic_id)
    progress_record.completion_percentage = computed_progress
    _touch_last_accessed(progress_record)
    performance_record.avg_score = float(metrics["average_score"])
    performance_record.accuracy = float(metrics["accuracy"])
    performance_record.weakness_level = weakness_level

    return computed_progress, weakness_level, tracking_record


def _recommended_next_step(
    *,
    tracking: UserTopicTracking,
    exercise_total: int,
) -> str:
    if not tracking.material_completed:
        return "Pelajari Materi"
    if not tracking.example_completed:
        return "Lihat Contoh"
    if tracking.exercises_completed < exercise_total:
        return "Kerjakan Latihan"
    if not tracking.summary_completed:
        return "Baca Ringkasan"
    return "Ulangi latihan yang masih lemah"


def _activity_dates_for_user(db: Session, user_id: int) -> list[datetime]:
    answer_dates = [
        answer.created_at
        for answer in db.execute(
            select(UserAnswer)
            .where(UserAnswer.user_id == user_id)
            .order_by(UserAnswer.created_at.asc())
        )
        .scalars()
        .all()
        if answer.created_at is not None
    ]
    tracking_dates = [
        tracking.updated_at
        for tracking in db.execute(
            select(UserTopicTracking)
            .where(UserTopicTracking.user_id == user_id)
            .order_by(UserTopicTracking.updated_at.asc())
        )
        .scalars()
        .all()
        if tracking.updated_at is not None
        and (
            tracking.material_completed
            or tracking.example_completed
            or tracking.summary_completed
            or tracking.exercises_attempted > 0
            or tracking.generated_content_count > 0
        )
    ]
    return sorted(answer_dates + tracking_dates)


def _calculate_day_streak(activity_dates: list[datetime]) -> int:
    if not activity_dates:
        return 0

    unique_days = sorted({activity.astimezone(timezone.utc).date() for activity in activity_dates})
    latest_day = unique_days[-1]
    today = datetime.now(timezone.utc).date()
    if today - latest_day > timedelta(days=1):
        return 0

    streak = 1
    for index in range(len(unique_days) - 1, 0, -1):
        if unique_days[index] - unique_days[index - 1] == timedelta(days=1):
            streak += 1
        else:
            break

    return streak


def _format_study_hours(total_minutes: int) -> str:
    if total_minutes <= 0:
        return "0"

    hours = total_minutes / 60
    rounded = round(hours, 1)
    if rounded.is_integer():
        return str(int(rounded))
    return str(rounded)


def _activity_sort_value(row: dict) -> float:
    activity = row.get("last_accessed") or row.get("tracking_updated_at")
    if isinstance(activity, datetime):
        return activity.timestamp()
    return 0.0


def _select_continue_learning_rows(topic_rows: list[dict], limit: int = 3) -> list[dict]:
    active_rows = [
        row
        for row in topic_rows
        if (
            bool(row.get("computed_unlocked"))
            and int(round(row.get("computed_progress", 0))) < 100
            and (
            int(round(row.get("computed_progress", 0))) > 0
            or _activity_sort_value(row) > 0
            or bool(row.get("material_completed"))
            or bool(row.get("example_completed"))
            or bool(row.get("summary_completed"))
            or int(row.get("exercises_attempted") or 0) > 0
            )
        )
    ]
    active_rows.sort(key=lambda row: int(row["topic_id"]))
    if active_rows:
        return active_rows[:1]

    unlocked_rows = [
        row
        for row in topic_rows
        if bool(row.get("computed_unlocked"))
        and int(round(row.get("computed_progress", 0))) < 100
    ]
    unlocked_rows.sort(
        key=lambda row: (
            not bool(row.get("recommended")),
            int(row["topic_id"]),
        )
    )
    return unlocked_rows[:1]


def _get_progress_record(db: Session, user_id: int, topic_id: int) -> Progress:
    progress_record = db.execute(
        select(Progress).where(
            Progress.user_id == user_id,
            Progress.topic_id == topic_id,
        )
    ).scalar_one()
    return progress_record


def _get_performance_record(db: Session, user_id: int, topic_id: int) -> UserPerformance:
    performance_record = db.execute(
        select(UserPerformance).where(
            UserPerformance.user_id == user_id,
            UserPerformance.topic_id == topic_id,
        )
    ).scalar_one()
    return performance_record


def _load_material_sections(db: Session, topic_id: int) -> tuple[list[MaterialSectionResponse], str]:
    rows = (
        db.execute(
            select(Material)
            .where(Material.topic_id == topic_id)
            .order_by(Material.material_id.asc())
        )
        .scalars()
        .all()
    )
    materials: list[MaterialSectionResponse] = []
    summary = ""

    for row in rows:
        payload = _parse_json_payload(row.content)
        if payload.get("kind") == "summary":
            summary = str(payload.get("content", ""))
            continue
        materials.append(
            MaterialSectionResponse(
                title=str(payload.get("title", "Materi")),
                content=str(payload.get("content", row.content or "")),
                generated_by_llm=row.generated_by_llm,
            )
        )

    return materials, summary


def _load_example_sections(db: Session, topic_id: int) -> list[ExampleSectionResponse]:
    rows = (
        db.execute(
            select(Example)
            .where(Example.topic_id == topic_id)
            .order_by(Example.example_id.asc())
        )
        .scalars()
        .all()
    )
    examples: list[ExampleSectionResponse] = []

    for row in rows:
        payload = _parse_json_payload(row.content)
        examples.append(
            ExampleSectionResponse(
                title=str(payload.get("title", "Contoh")),
                description=str(payload.get("description", row.content or "")),
                code=str(payload.get("code", "")),
                generated_by_llm=row.generated_by_llm,
            )
        )

    return examples


def _load_guided_flow(db: Session, topic_id: int) -> list[LearningFlowStepResponse]:
    rows = (
        db.execute(
            select(LearningPath)
            .where(LearningPath.topic_id == topic_id)
            .order_by(LearningPath.step_order.asc())
        )
        .scalars()
        .all()
    )
    flow_map = {step["step_type"]: step for step in DEFAULT_FLOW_STEPS}

    return [
        LearningFlowStepResponse(
            step_order=int(row.step_order or 0),
            step_type=str(row.step_type or "material"),
            title=flow_map.get(row.step_type, {}).get("title", "Langkah Belajar"),
            description=flow_map.get(row.step_type, {}).get(
                "description", "Ikuti langkah belajar berikutnya."
            ),
        )
        for row in rows
    ]


def _load_exercise_items(db: Session, user: User, topic_id: int) -> list[ExerciseItemResponse]:
    exercises = (
        db.execute(
            select(Exercise)
            .where(Exercise.topic_id == topic_id)
            .order_by(Exercise.exercise_id.asc())
        )
        .scalars()
        .all()
    )
    latest_answers = _get_latest_answers_by_exercise(
        db, user.user_id, [exercise.exercise_id for exercise in exercises]
    )
    items: list[ExerciseItemResponse] = []

    for exercise in exercises:
        explanation = db.execute(
            select(Explanation).where(Explanation.exercise_id == exercise.exercise_id)
        ).scalar_one_or_none()
        explanation_payload = _parse_json_payload(explanation.content if explanation else None)
        latest = latest_answers.get(exercise.exercise_id)
        items.append(
            ExerciseItemResponse(
                exercise_id=exercise.exercise_id,
                question=exercise.question or "",
                difficulty_level=exercise.difficulty_level,
                generated_by_llm=exercise.generated_by_llm,
                latest_answer=latest.answer_text if latest else None,
                latest_feedback=(
                    "Jawabanmu sudah tepat."
                    if latest and latest.is_correct
                    else "Jawabanmu masih perlu diperbaiki."
                    if latest
                    else None
                ),
                latest_score=latest.score if latest and latest.score is not None else None,
                latest_is_correct=latest.is_correct if latest else None,
                explanation=str(explanation_payload.get("explanation", "")) or None,
            )
        )

    return items


def _update_progress_and_performance(
    db: Session,
    *,
    user: User,
    topic: Topic,
) -> tuple[int, str]:
    updated_progress, weakness_level, _ = _recalculate_topic_state(
        db,
        user=user,
        topic=topic,
    )
    db.commit()
    return updated_progress, weakness_level


def _build_feedback_message(
    *,
    topic_name: str,
    answer_text: str,
    reference_answer: str,
    keywords: list[str],
    explanation_text: str,
    is_correct: bool,
) -> str:
    normalized_answer = _normalize_text(answer_text)
    missing_keywords = [keyword for keyword in keywords if keyword not in normalized_answer]

    if is_correct:
        return (
            f"Jawabanmu sudah tepat untuk topik {topic_name}. Kamu berhasil menangkap "
            "ide utama yang diminta soal."
        )

    if missing_keywords:
        joined_keywords = ", ".join(missing_keywords[:3])
        return (
            "Jawabanmu belum lengkap. Coba perjelas konsep kunci berikut: "
            f"{joined_keywords}. Petunjuk: {explanation_text}"
        )

    return (
        "Jawabanmu masih belum sesuai dengan fokus soal. Bandingkan lagi dengan "
        f"inti jawaban berikut: {reference_answer}"
    )


def _evaluate_answer(answer_text: str, explanation_payload: dict) -> tuple[bool, float]:
    keywords = [str(keyword).lower() for keyword in explanation_payload.get("keywords", [])]
    normalized_answer = _normalize_text(answer_text)
    if not keywords:
        is_correct = len(normalized_answer.split()) >= 8
        return is_correct, 100.0 if is_correct else 40.0

    matched = sum(1 for keyword in keywords if keyword in normalized_answer)
    score = round((matched / len(keywords)) * 100, 1)
    return score >= 60, score


def _apply_topic_generation(
    db: Session,
    *,
    topic: Topic,
    weakness_level: str,
) -> None:
    blueprint = TOPIC_BLUEPRINTS_BY_NAME[topic.topic_name]
    content_blueprint = _topic_content_for_name(topic.topic_name)
    adaptive_focus = content_blueprint["adaptive_focus"].get(
        weakness_level, content_blueprint["adaptive_focus"]["medium"]
    )
    generated_content = generate_topic_learning_content(
        topic_name=topic.topic_name,
        difficulty_level=blueprint["difficulty"],
        weakness_level=weakness_level,
        adaptive_focus=adaptive_focus,
        fallback_materials=content_blueprint["materials"],
        fallback_examples=content_blueprint["examples"],
        fallback_summary=content_blueprint["summary"],
        fallback_exercises=content_blueprint["exercises"],
    )

    _ensure_material_rows(
        db,
        topic,
        materials=generated_content.materials,
        summary=generated_content.summary,
        generated_by_llm=bool(settings.openai_api_key),
    )
    _ensure_example_rows(
        db,
        topic,
        examples=generated_content.examples,
        generated_by_llm=bool(settings.openai_api_key),
    )
    _ensure_exercise_rows(
        db,
        topic,
        exercises=generated_content.exercises,
        difficulty_level=blueprint["difficulty"],
        generated_by_llm=bool(settings.openai_api_key),
    )
    db.commit()


def get_dashboard_payload(db: Session, user: User) -> DashboardResponse:
    ensure_user_learning_profile(db, user)
    topic_rows = _fetch_topic_rows(db, user.user_id)
    continue_learning_rows = _select_continue_learning_rows(topic_rows)
    topics = [
        _build_dashboard_topic_overview(db, row)
        for row in continue_learning_rows
    ]

    completed_exercises = sum(int(row.get("exercises_completed") or 0) for row in topic_rows)
    completed_topics = sum(
        1 for row in topic_rows if int(round(row.get("computed_progress", 0))) >= 70
    )
    streak_days = _calculate_day_streak(_activity_dates_for_user(db, user.user_id))
    total_study_minutes = sum(int(row.get("study_minutes") or 0) for row in topic_rows)

    return DashboardResponse(
        continue_learning=topics,
        stats=[
            StatCardResponse(label="Latihan selesai", value=str(completed_exercises)),
            StatCardResponse(label="Hari berturut-turut", value=str(streak_days)),
            StatCardResponse(label="Topik selesai", value=str(completed_topics)),
            StatCardResponse(label="Jam belajar", value=_format_study_hours(total_study_minutes)),
        ],
    )


def get_topics_payload(db: Session, user: User) -> TopicsResponse:
    ensure_user_learning_profile(db, user)
    topic_rows = _fetch_topic_rows(db, user.user_id)
    topics = _apply_personalized_recommendation(
        [_topic_overview_from_row(row) for row in topic_rows],
        topic_rows,
    )

    return TopicsResponse(
        topics=topics,
        learning_path_title="Structured Learning Path",
        learning_path_description=(
            "We recommend following the topics in order, starting with beginner "
            "level. Our AI will adapt the content based on your progress and help "
            "you focus on areas that need improvement."
        ),
    )


def get_topic_learning_payload(
    db: Session,
    user: User,
    topic_slug: str,
) -> TopicLearningResponse:
    topic, overview, row = _get_topic_and_overview(db, user, topic_slug)
    tracking = _get_tracking_record(db, user_id=user.user_id, topic_id=topic.topic_id)
    progress_record = _get_progress_record(db, user.user_id, topic.topic_id)
    _touch_last_accessed(progress_record)
    db.commit()

    materials, summary = _load_material_sections(db, topic.topic_id)
    examples = _load_example_sections(db, topic.topic_id)
    exercises = _load_exercise_items(db, user, topic.topic_id)
    guided_flow = _load_guided_flow(db, topic.topic_id)
    content_blueprint = _topic_content_for_name(topic.topic_name)
    weakness_level = str(row.get("weakness_level") or "medium")
    adaptive_focus = content_blueprint["adaptive_focus"].get(
        weakness_level, content_blueprint["adaptive_focus"]["medium"]
    )

    recommended_next_step = _recommended_next_step(
        tracking=tracking,
        exercise_total=len(exercises),
    )

    return TopicLearningResponse(
        topic=overview,
        guided_flow=guided_flow,
        materials=materials,
        examples=examples,
        exercises=exercises,
        summary=summary,
        adaptive_guidance=AdaptiveGuidanceResponse(
            weakness_level=weakness_level,
            focus_message=adaptive_focus,
            recommended_next_step=recommended_next_step,
            adaptive_content_applied=weakness_level in {"high", "medium"},
        ),
        llm_enabled=bool(settings.openai_api_key),
        completed_steps=_completed_steps_from_tracking(tracking),
        study_minutes=int(tracking.study_minutes or 0),
    )


def submit_exercise_answer(
    db: Session,
    user: User,
    topic_slug: str,
    exercise_id: int,
    answer_text: str,
) -> ExerciseSubmissionResponse:
    topic, _, _ = _get_topic_and_overview(db, user, topic_slug)
    tracking = _get_tracking_record(db, user_id=user.user_id, topic_id=topic.topic_id)
    exercise = db.get(Exercise, exercise_id)
    if exercise is None or exercise.topic_id != topic.topic_id:
        raise KeyError("exercise_not_found")

    explanation = db.execute(
        select(Explanation).where(Explanation.exercise_id == exercise.exercise_id)
    ).scalar_one_or_none()
    explanation_payload = _parse_json_payload(explanation.content if explanation else None)
    reference_answer = str(explanation_payload.get("reference_answer", ""))
    explanation_text = str(explanation_payload.get("explanation", ""))
    keywords = [str(keyword).lower() for keyword in explanation_payload.get("keywords", [])]

    is_correct, score = _evaluate_answer(answer_text, explanation_payload)
    feedback = _build_feedback_message(
        topic_name=topic.topic_name,
        answer_text=answer_text,
        reference_answer=reference_answer,
        keywords=keywords,
        explanation_text=explanation_text,
        is_correct=is_correct,
    )

    db.add(
        UserAnswer(
            user_id=user.user_id,
            exercise_id=exercise.exercise_id,
            answer_text=answer_text,
            is_correct=is_correct,
            score=score,
        )
    )
    db.flush()
    tracking.last_completed_step = "exercise"
    tracking.study_minutes = int(tracking.study_minutes or 0) + STEP_TRACKING_MINUTES["exercise"]

    updated_progress, weakness_level = _update_progress_and_performance(
        db,
        user=user,
        topic=topic,
    )
    content_blueprint = _topic_content_for_name(topic.topic_name)
    recommended_review = content_blueprint["adaptive_focus"].get(
        weakness_level, content_blueprint["adaptive_focus"]["medium"]
    )
    completed_steps = _completed_steps_from_tracking(tracking)

    return ExerciseSubmissionResponse(
        message="Jawaban berhasil disimpan.",
        is_correct=is_correct,
        score=score,
        feedback=feedback,
        explanation=explanation_text or reference_answer,
        recommended_review=recommended_review,
        updated_progress=updated_progress,
        updated_weakness_level=weakness_level,
        completed_steps=completed_steps,
        study_minutes=int(tracking.study_minutes or 0),
    )


def track_topic_step(
    db: Session,
    user: User,
    topic_slug: str,
    step_type: str,
) -> TopicStepTrackingResponse:
    topic, _, _ = _get_topic_and_overview(db, user, topic_slug)
    tracking = _get_tracking_record(db, user_id=user.user_id, topic_id=topic.topic_id)

    first_completion = False
    if step_type == "material" and not tracking.material_completed:
        tracking.material_completed = True
        first_completion = True
    elif step_type == "example" and not tracking.example_completed:
        tracking.example_completed = True
        first_completion = True
    elif step_type == "summary" and not tracking.summary_completed:
        tracking.summary_completed = True
        first_completion = True
    elif step_type == "exercise" and tracking.last_completed_step != "exercise":
        first_completion = True

    tracking.last_completed_step = step_type
    if first_completion:
        tracking.study_minutes = int(tracking.study_minutes or 0) + STEP_TRACKING_MINUTES[step_type]

    updated_progress, _, tracking = _recalculate_topic_state(
        db,
        user=user,
        topic=topic,
        tracking=tracking,
    )
    db.commit()

    return TopicStepTrackingResponse(
        message="Progress langkah belajar berhasil diperbarui.",
        updated_progress=updated_progress,
        completed_steps=_completed_steps_from_tracking(tracking),
        study_minutes=int(tracking.study_minutes or 0),
    )


def generate_topic_content_payload(
    db: Session,
    user: User,
    topic_slug: str,
) -> GenerateTopicContentResponse:
    topic, _, row = _get_topic_and_overview(db, user, topic_slug)
    tracking = _get_tracking_record(db, user_id=user.user_id, topic_id=topic.topic_id)
    weakness_level = str(row.get("weakness_level") or "medium")
    _apply_topic_generation(db, topic=topic, weakness_level=weakness_level)
    tracking.generated_content_count = int(tracking.generated_content_count or 0) + 1
    tracking.study_minutes = int(tracking.study_minutes or 0) + STEP_TRACKING_MINUTES["generate"]
    tracking.last_completed_step = "generate"
    _recalculate_topic_state(db, user=user, topic=topic, tracking=tracking)
    db.commit()
    topic_learning = get_topic_learning_payload(db, user, topic_slug)

    return GenerateTopicContentResponse(
        message="Konten topik berhasil diperbarui menggunakan generator AI.",
        topic_learning=topic_learning,
    )


def get_insights_payload(db: Session, user: User) -> InsightsResponse:
    ensure_user_learning_profile(db, user)
    topic_rows = _fetch_topic_rows(db, user.user_id)
    topics = [_topic_overview_from_row(row) for row in topic_rows]

    strengths = [topic.title for topic in topics if topic.progress >= 70]
    weakness_rows = sorted(
        topic_rows,
        key=lambda row: (
            int(round(row.get("computed_progress", 0))),
            0
            if row.get("weakness_level") == "high"
            else 1
            if row.get("weakness_level") == "medium"
            else 2,
        ),
    )[:3]
    weaknesses = [row["topic_name"] for row in weakness_rows]
    strong_topics_count = len(strengths)
    needs_practice_count = len(
        [
            row
            for row in topic_rows
            if row.get("weakness_level") in {"high", "medium"}
            or int(round(row.get("computed_progress", 0))) < 70
        ]
    )
    average_score = round(
        sum(float(row["avg_score"] or 0) for row in topic_rows) / max(len(topic_rows), 1)
    )

    ai_result = generate_personalized_insight(
        user_name=user.name,
        strengths=strengths,
        weaknesses=weaknesses,
        topic_progress=[
            {"topic": topic.title, "progress": topic.progress} for topic in topics
        ],
    )

    improvement_lookup = {topic.title: topic for topic in topics}
    improvement_areas = [
        ImprovementAreaResponse(
            title=row["topic_name"],
            description=_topic_content_for_name(row["topic_name"])["adaptive_focus"].get(
                str(row.get("weakness_level") or "medium"),
                _topic_content_for_name(row["topic_name"])["adaptive_focus"]["medium"],
            ),
            progress=int(round(row.get("computed_progress", 0))),
            icon=improvement_lookup[row["topic_name"]].icon,
        )
        for row in weakness_rows
    ]

    return InsightsResponse(
        summary=[
            InsightSummaryResponse(label="Rata-rata nilai", value=f"{average_score}%", tone="blue"),
            InsightSummaryResponse(label="Topik yang kuat", value=str(strong_topics_count), tone="green"),
            InsightSummaryResponse(label="Butuh latihan", value=str(needs_practice_count), tone="red"),
        ],
        recommendation_title=ai_result.recommendation_title,
        recommendation_text=ai_result.recommendation_text,
        improvement_areas=improvement_areas,
        learning_plan=[
            LearningPlanItemResponse(**item) for item in ai_result.learning_plan
        ],
    )


def get_progress_payload(db: Session, user: User) -> ProgressResponse:
    ensure_user_learning_profile(db, user)
    topic_rows = _fetch_topic_rows(db, user.user_id)
    topics = [_topic_overview_from_row(row) for row in topic_rows]

    overall_progress = round(sum(topic.progress for topic in topics) / max(len(topics), 1))
    completed_exercises = sum(int(row.get("exercises_completed") or 0) for row in topic_rows)
    topics_started = sum(1 for topic in topics if topic.progress > 0)
    streak_days = _calculate_day_streak(_activity_dates_for_user(db, user.user_id))
    total_study_minutes = sum(int(row.get("study_minutes") or 0) for row in topic_rows)

    topic_details = []
    for row, topic in zip(topic_rows, topics, strict=True):
        topic_details.append(
            ProgressTopicDetailResponse(
                topic_id=topic.topic_id,
                slug=topic.slug,
                title=topic.title,
                description=topic.description,
                progress=topic.progress,
                exercises_completed=int(row.get("exercises_completed") or 0),
                exercises_total=topic.exercises,
                icon=topic.icon,
                status=topic.status,
                last_accessed=row["last_accessed"],
            )
        )

    return ProgressResponse(
        summary=[
            ProgressSummaryResponse(label="Overall Progress", value=f"{overall_progress}%", tone="purple"),
            ProgressSummaryResponse(label="Exercises Completed", value=str(completed_exercises), tone="green"),
            ProgressSummaryResponse(label="Topics Started", value=str(topics_started), tone="blue"),
            ProgressSummaryResponse(label="Day Streak", value=str(streak_days), tone="gold"),
        ],
        chart=[
            ProgressChartBarResponse(
                label=topic.title,
                value=topic.progress,
                color=TOPIC_BLUEPRINTS_BY_NAME[topic.title]["chart_color"],
            )
            for topic in topics
        ],
        topics=topic_details,
        achievements=[
            AchievementResponse(
                title="Topic Explorer",
                description="Mulai minimal 3 topik pembelajaran.",
                status="Unlocked" if topics_started >= 3 else "In progress",
                tone="gold",
            ),
            AchievementResponse(
                title="Week Warrior",
                description="Pertahankan streak belajar 7 hari.",
                status="Unlocked" if streak_days >= 7 else "Active",
                tone="green",
            ),
            AchievementResponse(
                title="Exercise Builder",
                description="Selesaikan minimal 20 latihan.",
                status="Unlocked" if completed_exercises >= 20 else "Locked",
                tone="blue",
            ),
        ],
        encouragement_title=f"Keep Up the Great Work, {user.name}!",
        encouragement_text=(
            f"Kamu sudah menyelesaikan {completed_exercises} latihan dengan total "
            f"{_format_study_hours(total_study_minutes)} jam belajar. Progress keseluruhanmu "
            f"sudah {overall_progress}%, jadi tinggal jaga ritme dan lanjutkan topik berikutnya."
        ),
    )
