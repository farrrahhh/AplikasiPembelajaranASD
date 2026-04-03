import { useSyncExternalStore } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api";

const AUTH_STORAGE_KEY = "asd-learning-auth";
const AUTH_CHANGE_EVENT = "asd-learning-auth-change";
const REMEMBER_ME_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const DEFAULT_SESSION_DURATION_MS = 1000 * 60 * 60 * 12;
let cachedAuthRawValue;
let cachedAuthSnapshot = null;

function getPreferredStorage(rememberMe) {
  return rememberMe ? window.localStorage : window.sessionStorage;
}

function emitAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChanged();
}

export function storeAuthSession(payload, rememberMe = false) {
  if (typeof window === "undefined") {
    return;
  }

  const now = Date.now();
  const expiresAt = now + (
    rememberMe ? REMEMBER_ME_DURATION_MS : DEFAULT_SESSION_DURATION_MS
  );

  clearStoredAuth();
  getPreferredStorage(rememberMe).setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      data: payload,
      rememberMe,
      expiresAt,
      storedAt: now,
    }),
  );
  emitAuthChanged();
}

function readStoredAuthRaw() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem(AUTH_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_STORAGE_KEY)
  );
}

export function readStoredAuth() {
  const rawValue = readStoredAuthRaw();

  if (rawValue === cachedAuthRawValue) {
    return cachedAuthSnapshot;
  }

  if (!rawValue) {
    cachedAuthRawValue = rawValue;
    cachedAuthSnapshot = null;
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const normalizedPayload = parsedValue?.data ?? parsedValue;
    const expiresAt = Number(parsedValue?.expiresAt ?? 0);

    if (expiresAt && Date.now() > expiresAt) {
      cachedAuthRawValue = null;
      cachedAuthSnapshot = null;
      clearStoredAuth();
      return null;
    }

    cachedAuthRawValue = rawValue;
    cachedAuthSnapshot = normalizedPayload;
    return cachedAuthSnapshot;
  } catch {
    cachedAuthRawValue = null;
    cachedAuthSnapshot = null;
    clearStoredAuth();
    return null;
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

  return "Terjadi kesalahan. Silakan coba lagi.";
}

async function sendAuthRequest(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resolveApiErrorMessage(payload));
  }

  return payload;
}

export function loginUser(payload) {
  return sendAuthRequest("/auth/login", payload);
}

export function registerUser(payload) {
  return sendAuthRequest("/auth/register", payload);
}

export function requestPasswordReset(payload) {
  return sendAuthRequest("/auth/forgot-password", payload);
}

export function resetPassword(payload) {
  return sendAuthRequest("/auth/reset-password", payload);
}

function subscribeToAuthStore(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAuthSession() {
  return useSyncExternalStore(
    subscribeToAuthStore,
    readStoredAuth,
    () => null,
  );
}
