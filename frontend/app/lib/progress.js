const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const SLUG_TO_KEY = {
  'pengantar':      'asd_progress_pengantar',
  'adt-sederhana':  'asd_progress_adt_sederhana',
  'list':           'asd_progress_list',
  'mesin-karakter': 'asd_progress_mesin_karakter',
  'stack-queue':    'asd_progress_stack_queue',
  'set-map':        'asd_progress_set_map',
  'list-linier':    'asd_progress_list_linier',
  'binary-tree':    'asd_progress_binary_tree',
  'graph':          'asd_progress_graph',
  'aplikasi':       'asd_progress_aplikasi',
};

// Fetch all progress from DB and write into localStorage.
// Called once after login so the cache is always warm.
export async function loadProgressFromDb(token) {
  try {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const items = await res.json();
    for (const item of items) {
      const key = SLUG_TO_KEY[item.topic_slug];
      if (key) {
        localStorage.setItem(key, JSON.stringify({
          materi:   item.materi,
          contoh:   item.contoh,
          latihan:  item.latihan,
          ringkasan: item.ringkasan,
        }));
      }
    }
  } catch {
    // silent — localStorage fallback still works
  }
}

// Fire-and-forget: push latest section state to DB.
// Reads the token from localStorage directly so callers don't need to pass it.
export function syncTopicProgress(slug, data) {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE}/progress/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        materi:   !!data.materi,
        contoh:   !!data.contoh,
        latihan:  !!data.latihan,
        ringkasan: !!data.ringkasan,
      }),
    }).catch(() => {});
  } catch {}
}
