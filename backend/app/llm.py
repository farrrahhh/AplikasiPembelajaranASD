from __future__ import annotations

import json
from collections.abc import Sequence
from dataclasses import dataclass
from hashlib import sha256
from urllib import error, request

from app.config import settings


@dataclass(frozen=True)
class InsightGenerationResult:
    recommendation_title: str
    recommendation_text: str
    learning_plan: list[dict[str, str]]


@dataclass(frozen=True)
class TopicContentGenerationResult:
    materials: list[dict[str, str]]
    examples: list[dict[str, str]]
    summary: str
    exercises: list[dict[str, object]]


_INSIGHT_CACHE: dict[str, InsightGenerationResult] = {}
_TOPIC_CONTENT_CACHE: dict[str, TopicContentGenerationResult] = {}


def _extract_output_text(payload: dict) -> str:
    if isinstance(payload.get("output_text"), str) and payload["output_text"].strip():
        return payload["output_text"].strip()

    parts: list[str] = []
    for item in payload.get("output", []):
        for content in item.get("content", []):
            text_value = content.get("text")
            if isinstance(text_value, str) and text_value.strip():
                parts.append(text_value.strip())
            elif isinstance(text_value, dict):
                nested_value = text_value.get("value")
                if isinstance(nested_value, str) and nested_value.strip():
                    parts.append(nested_value.strip())

    return "\n".join(parts).strip()


def _extract_json_object(raw_text: str) -> dict | None:
    if not raw_text:
        return None

    stripped = raw_text.strip()

    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass

    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    try:
        return json.loads(stripped[start : end + 1])
    except json.JSONDecodeError:
        return None


def _request_openai_json(prompt: dict) -> dict | None:
    if not settings.openai_api_key:
        return None

    payload = {
        "model": settings.openai_model,
        "input": json.dumps(prompt, ensure_ascii=False),
    }

    http_request = request.Request(
        "https://api.openai.com/v1/responses",
        method="POST",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with request.urlopen(http_request, timeout=20) as response:
            response_payload = json.loads(response.read().decode("utf-8"))
    except (error.URLError, json.JSONDecodeError, TimeoutError):
        return None

    raw_text = _extract_output_text(response_payload)
    return _extract_json_object(raw_text)


def _fallback_result(user_name: str, strengths: Sequence[str], weaknesses: Sequence[str]) -> InsightGenerationResult:
    strength_text = ", ".join(strengths[:2]) or "dasar struktur data"
    primary_weakness = weaknesses[0] if weaknesses else "Linked List"
    secondary_weakness = weaknesses[1] if len(weaknesses) > 1 else "Tree"
    tertiary_focus = weaknesses[2] if len(weaknesses) > 2 else "Graph"

    return InsightGenerationResult(
        recommendation_title="AI Recommendation",
        recommendation_text=(
            f"Kemajuan yang bagus, {user_name}! Kamu sudah cukup kuat pada {strength_text}. "
            f"Fokuskan latihan berikutnya pada {primary_weakness} dan {secondary_weakness} "
            "supaya fondasi algoritmamu makin stabil sebelum masuk materi yang lebih kompleks."
        ),
        learning_plan=[
            {
                "title": f"Fokus pada dasar {primary_weakness}",
                "description": f"Selesaikan 5 latihan tambahan untuk menguatkan konsep inti {primary_weakness}.",
            },
            {
                "title": f"Latihan terarah untuk {secondary_weakness}",
                "description": f"Kerjakan soal bertahap dan review kesalahan umum pada topik {secondary_weakness}.",
            },
            {
                "title": f"Persiapan menuju {tertiary_focus}",
                "description": f"Bangun pemahaman visual dan latihan dasar agar siap lanjut ke {tertiary_focus}.",
            },
        ],
    )


def generate_personalized_insight(
    *,
    user_name: str,
    strengths: Sequence[str],
    weaknesses: Sequence[str],
    topic_progress: Sequence[dict[str, int | str]],
) -> InsightGenerationResult:
    cache_key_payload = {
        "user_name": user_name,
        "strengths": list(strengths),
        "weaknesses": list(weaknesses),
        "topic_progress": list(topic_progress),
    }
    cache_key = sha256(
        json.dumps(cache_key_payload, sort_keys=True).encode("utf-8")
    ).hexdigest()

    if cache_key in _INSIGHT_CACHE:
        return _INSIGHT_CACHE[cache_key]

    fallback = _fallback_result(user_name, strengths, weaknesses)

    prompt = {
        "user_name": user_name,
        "strengths": list(strengths),
        "weaknesses": list(weaknesses),
        "topic_progress": list(topic_progress),
        "instructions": (
            "Buat rekomendasi belajar singkat dalam Bahasa Indonesia untuk aplikasi "
            "pembelajaran algoritma dan struktur data. Balas hanya JSON dengan bentuk: "
            '{"recommendation_title":"AI Recommendation","recommendation_text":"...","learning_plan":[{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}]}. '
            "Gunakan nada suportif, konkret, dan personal."
        ),
    }
    parsed = _request_openai_json(prompt)

    if not isinstance(parsed, dict):
        _INSIGHT_CACHE[cache_key] = fallback
        return fallback

    recommendation_title = parsed.get("recommendation_title")
    recommendation_text = parsed.get("recommendation_text")
    learning_plan = parsed.get("learning_plan")

    if (
        not isinstance(recommendation_title, str)
        or not recommendation_title.strip()
        or not isinstance(recommendation_text, str)
        or not recommendation_text.strip()
        or not isinstance(learning_plan, list)
    ):
        _INSIGHT_CACHE[cache_key] = fallback
        return fallback

    normalized_plan = []
    for item in learning_plan[:3]:
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        description = item.get("description")
        if isinstance(title, str) and isinstance(description, str):
            normalized_plan.append(
                {"title": title.strip(), "description": description.strip()}
            )

    if len(normalized_plan) < 3:
        normalized_plan = fallback.learning_plan

    result = InsightGenerationResult(
        recommendation_title=recommendation_title.strip(),
        recommendation_text=recommendation_text.strip(),
        learning_plan=normalized_plan,
    )
    _INSIGHT_CACHE[cache_key] = result
    return result


def generate_topic_learning_content(
    *,
    topic_name: str,
    difficulty_level: str,
    weakness_level: str,
    adaptive_focus: str,
    fallback_materials: Sequence[dict[str, str]],
    fallback_examples: Sequence[dict[str, str]],
    fallback_summary: str,
    fallback_exercises: Sequence[dict[str, object]],
) -> TopicContentGenerationResult:
    cache_key_payload = {
        "topic_name": topic_name,
        "difficulty_level": difficulty_level,
        "weakness_level": weakness_level,
        "adaptive_focus": adaptive_focus,
    }
    cache_key = sha256(
        json.dumps(cache_key_payload, sort_keys=True).encode("utf-8")
    ).hexdigest()

    fallback = TopicContentGenerationResult(
        materials=list(fallback_materials),
        examples=list(fallback_examples),
        summary=fallback_summary,
        exercises=list(fallback_exercises),
    )

    if cache_key in _TOPIC_CONTENT_CACHE:
        return _TOPIC_CONTENT_CACHE[cache_key]

    prompt = {
        "topic_name": topic_name,
        "difficulty_level": difficulty_level,
        "weakness_level": weakness_level,
        "adaptive_focus": adaptive_focus,
        "instructions": (
            "Buat konten pembelajaran topik algoritma dan struktur data dalam Bahasa Indonesia. "
            "Balas hanya JSON dengan bentuk: "
            '{"materials":[{"title":"...","content":"..."}],'
            '"examples":[{"title":"...","description":"...","code":"..."}],'
            '"summary":"...",'
            '"exercises":[{"question":"...","reference_answer":"...","keywords":["..."],"explanation":"..."}]}. '
            "Beri 2 materi, 2 contoh, 2 latihan yang relevan dengan fokus adaptif pengguna."
        ),
    }

    parsed = _request_openai_json(prompt)
    if not isinstance(parsed, dict):
        _TOPIC_CONTENT_CACHE[cache_key] = fallback
        return fallback

    materials = parsed.get("materials")
    examples = parsed.get("examples")
    summary = parsed.get("summary")
    exercises = parsed.get("exercises")

    if (
        not isinstance(materials, list)
        or not isinstance(examples, list)
        or not isinstance(summary, str)
        or not isinstance(exercises, list)
    ):
        _TOPIC_CONTENT_CACHE[cache_key] = fallback
        return fallback

    normalized_materials = []
    for item in materials[:2]:
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        content = item.get("content")
        if isinstance(title, str) and isinstance(content, str):
            normalized_materials.append(
                {"title": title.strip(), "content": content.strip()}
            )

    normalized_examples = []
    for item in examples[:2]:
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        description = item.get("description")
        code = item.get("code")
        if (
            isinstance(title, str)
            and isinstance(description, str)
            and isinstance(code, str)
        ):
            normalized_examples.append(
                {
                    "title": title.strip(),
                    "description": description.strip(),
                    "code": code.strip(),
                }
            )

    normalized_exercises = []
    for item in exercises[:2]:
        if not isinstance(item, dict):
            continue
        question = item.get("question")
        reference_answer = item.get("reference_answer")
        explanation = item.get("explanation")
        keywords = item.get("keywords")
        if (
            isinstance(question, str)
            and isinstance(reference_answer, str)
            and isinstance(explanation, str)
            and isinstance(keywords, list)
        ):
            normalized_exercises.append(
                {
                    "question": question.strip(),
                    "reference_answer": reference_answer.strip(),
                    "explanation": explanation.strip(),
                    "keywords": [str(keyword).strip().lower() for keyword in keywords if str(keyword).strip()],
                }
            )

    if (
        len(normalized_materials) < 2
        or len(normalized_examples) < 2
        or len(normalized_exercises) < 2
        or not summary.strip()
    ):
        _TOPIC_CONTENT_CACHE[cache_key] = fallback
        return fallback

    result = TopicContentGenerationResult(
        materials=normalized_materials,
        examples=normalized_examples,
        summary=summary.strip(),
        exercises=normalized_exercises,
    )
    _TOPIC_CONTENT_CACHE[cache_key] = result
    return result
