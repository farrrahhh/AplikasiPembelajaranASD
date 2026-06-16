const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

// Fetch progress for a single topic from DB.
export async function fetchTopicProgress(slug) {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/progress/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Fetch all topics' progress from DB. Returns a map: { slug -> { materi, contoh, latihan, ringkasan } }
export async function fetchAllProgress() {
  const token = getToken();
  if (!token) return {};
  try {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return {};
    const items = await res.json();
    return Object.fromEntries(
      items.map((item) => [
        item.topic_slug,
        { materi: item.materi, contoh: item.contoh, latihan: item.latihan, ringkasan: item.ringkasan },
      ])
    );
  } catch {
    return {};
  }
}

// Save progress for a single topic to DB.
// Pass weak_concepts in data to persist them; omit or set to undefined to leave unchanged.
export async function saveTopicProgress(slug, data) {
  const token = getToken();
  if (!token) return;
  const body = {
    materi: !!data.materi,
    contoh: !!data.contoh,
    latihan: !!data.latihan,
    ringkasan: !!data.ringkasan,
  };
  if (data.weak_concepts !== undefined) {
    body.weak_concepts = Array.isArray(data.weak_concepts) ? data.weak_concepts : [];
  }
  try {
    await fetch(`${API_BASE}/progress/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {}
}

// Hydrate localStorage from DB after login (used by login page to warm cache for topik/dashboard pages).
export async function loadProgressFromDb(token) {
  try {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const items = await res.json();
    for (const item of items) {
      localStorage.setItem(
        `asd_progress_${item.topic_slug.replace(/-/g, '_')}`,
        JSON.stringify({ materi: item.materi, contoh: item.contoh, latihan: item.latihan, ringkasan: item.ringkasan })
      );
    }
  } catch {}
}

// Legacy alias — kept so login page import doesn't break.
export const syncTopicProgress = saveTopicProgress;
