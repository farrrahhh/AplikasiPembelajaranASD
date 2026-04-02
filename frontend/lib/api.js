const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function resolveApiErrorMessage(payload) {
  if (typeof payload?.detail === "string") {
    return payload.detail;
  }

  if (Array.isArray(payload?.detail) && payload.detail.length > 0) {
    return payload.detail
      .map((issue) => issue?.msg)
      .filter(Boolean)
      .join(" ");
  }

  return "Terjadi kesalahan saat mengambil data.";
}

async function apiRequest(path, accessToken) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(resolveApiErrorMessage(payload), response.status);
  }

  return payload;
}

async function apiPost(path, accessToken, body = null) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(resolveApiErrorMessage(payload), response.status);
  }

  return payload;
}

export function fetchDashboardData(accessToken) {
  return apiRequest("/users/me/dashboard", accessToken);
}

export function fetchTopicsData(accessToken) {
  return apiRequest("/users/me/topics", accessToken);
}

export function fetchInsightsData(accessToken) {
  return apiRequest("/users/me/insights", accessToken);
}

export function fetchProgressData(accessToken) {
  return apiRequest("/users/me/progress", accessToken);
}

export function fetchTopicLearningData(accessToken, topicSlug) {
  return apiRequest(`/users/me/topics/${topicSlug}/learning`, accessToken);
}

export function trackTopicStep(accessToken, topicSlug, stepType) {
  return apiPost(`/users/me/topics/${topicSlug}/track-step`, accessToken, {
    step_type: stepType,
  });
}

export function generateTopicContent(accessToken, topicSlug) {
  return apiPost(`/users/me/topics/${topicSlug}/generate`, accessToken);
}

export function submitTopicExerciseAnswer(
  accessToken,
  topicSlug,
  exerciseId,
  answerText,
) {
  return apiPost(
    `/users/me/topics/${topicSlug}/exercises/${exerciseId}/answer`,
    accessToken,
    { answer_text: answerText },
  );
}

export function logoutUser(accessToken) {
  return apiPost("/auth/logout", accessToken);
}
