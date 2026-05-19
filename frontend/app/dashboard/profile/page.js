'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, saveSession, clearSession, updateProfile } from '../../lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [editing, setEditing] = useState(null); // 'name' | 'email' | 'password' | null

  const [nameDraft, setNameDraft] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });

  const [status, setStatus] = useState({ field: null, error: null, success: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/login'); return; }
    setSession(s);
    setNameDraft(s.user.name);
    setEmailDraft(s.user.email);
  }, [router]);

  const refreshSession = (updatedUser) => {
    const s = getSession();
    const newUser = { ...s.user, ...updatedUser };
    saveSession({ token: s.token, user: newUser });
    setSession((prev) => ({ ...prev, user: newUser }));
  };

  const startEdit = (field) => {
    const s = getSession();
    if (field === 'name') setNameDraft(s.user.name);
    if (field === 'email') setEmailDraft(s.user.email);
    if (field === 'password') setPassForm({ current: '', next: '', confirm: '' });
    setStatus({ field: null, error: null, success: null });
    setEditing(field);
  };

  const cancelEdit = () => {
    setEditing(null);
    setStatus({ field: null, error: null, success: null });
  };

  const saveName = async () => {
    if (!nameDraft.trim()) return setStatus({ field: 'name', error: 'Nama tidak boleh kosong.' });
    setLoading(true);
    try {
      const updated = await updateProfile(session.token, { name: nameDraft.trim() });
      refreshSession(updated);
      setStatus({ field: 'name', success: 'Nama berhasil diperbarui.' });
      setEditing(null);
    } catch (err) {
      setStatus({ field: 'name', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const saveEmail = async () => {
    if (!emailDraft.trim()) return setStatus({ field: 'email', error: 'Email tidak boleh kosong.' });
    setLoading(true);
    try {
      const updated = await updateProfile(session.token, { email: emailDraft.trim() });
      refreshSession(updated);
      setStatus({ field: 'email', success: 'Email berhasil diperbarui.' });
      setEditing(null);
    } catch (err) {
      setStatus({ field: 'email', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    if (!passForm.current) return setStatus({ field: 'password', error: 'Kata sandi lama wajib diisi.' });
    if (passForm.next.length < 8) return setStatus({ field: 'password', error: 'Kata sandi baru minimal 8 karakter.' });
    if (passForm.next !== passForm.confirm) return setStatus({ field: 'password', error: 'Konfirmasi tidak cocok.' });
    setLoading(true);
    try {
      await updateProfile(session.token, {
        currentPassword: passForm.current,
        newPassword: passForm.next,
      });
      setStatus({ field: 'password', success: 'Kata sandi berhasil diperbarui.' });
      setEditing(null);
    } catch (err) {
      setStatus({ field: 'password', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  if (!session) return null;
  const { user } = session;

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Avatar */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-24 h-24 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center text-white text-3xl font-bold select-none mb-4">
          {user.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
        {joinDate && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Bergabung {joinDate}
          </span>
        )}
      </div>

      <div className="space-y-5">

        {/* Nama */}
        <div>
          <p className="text-sm font-bold text-gray-900 mb-2">Nama</p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {editing === 'name' ? (
              <div className="px-4 py-3 space-y-3">
                <input
                  autoFocus
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nama lengkap"
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                />
                {status.field === 'name' && <StatusBanner status={status} />}
                <div className="flex gap-2 justify-end">
                  <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                    Batal
                  </button>
                  <button onClick={saveName} disabled={loading} className="px-4 py-2 text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl transition-colors">
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-gray-800">{user.name}</span>
                <button onClick={() => startEdit('name')} className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50">
                  <PencilIcon />
                </button>
              </div>
            )}
          </div>
          {status.field === 'name' && !editing && <StatusBanner status={status} className="mt-2" />}
        </div>

        {/* Email */}
        <div>
          <p className="text-sm font-bold text-gray-900 mb-2">Email</p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {editing === 'email' ? (
              <div className="px-4 py-3 space-y-3">
                <input
                  autoFocus
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="nama@email.com"
                  onKeyDown={(e) => e.key === 'Enter' && saveEmail()}
                />
                {status.field === 'email' && <StatusBanner status={status} />}
                <div className="flex gap-2 justify-end">
                  <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                    Batal
                  </button>
                  <button onClick={saveEmail} disabled={loading} className="px-4 py-2 text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl transition-colors">
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-gray-800">{user.email}</span>
                <button onClick={() => startEdit('email')} className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50">
                  <PencilIcon />
                </button>
              </div>
            )}
          </div>
          {status.field === 'email' && !editing && <StatusBanner status={status} className="mt-2" />}
        </div>

        {/* Kata Sandi */}
        <div>
          <p className="text-sm font-bold text-gray-900 mb-2">Kata Sandi</p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {editing === 'password' ? (
              <div className="px-4 py-3 space-y-3">
                <input
                  autoFocus
                  type="password"
                  value={passForm.current}
                  onChange={(e) => setPassForm((f) => ({ ...f, current: e.target.value }))}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Kata sandi lama"
                />
                <input
                  type="password"
                  value={passForm.next}
                  onChange={(e) => setPassForm((f) => ({ ...f, next: e.target.value }))}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Kata sandi baru (min. 8 karakter)"
                />
                <input
                  type="password"
                  value={passForm.confirm}
                  onChange={(e) => setPassForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Konfirmasi kata sandi baru"
                  onKeyDown={(e) => e.key === 'Enter' && savePassword()}
                />
                {status.field === 'password' && <StatusBanner status={status} />}
                <div className="flex gap-2 justify-end">
                  <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                    Batal
                  </button>
                  <button onClick={savePassword} disabled={loading} className="px-4 py-2 text-sm text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl transition-colors">
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-gray-400 tracking-widest">••••••••</span>
                <button onClick={() => startEdit('password')} className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-blue-50">
                  <PencilIcon />
                </button>
              </div>
            )}
          </div>
          {status.field === 'password' && !editing && <StatusBanner status={status} className="mt-2" />}
        </div>

        {/* Keluar */}
        <div className="pt-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-red-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-red-600">Keluar dari Akun</span>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function StatusBanner({ status, className = '' }) {
  const isError = !!status.error;
  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs border ${
      isError
        ? 'bg-red-50 border-red-100 text-red-700'
        : 'bg-green-50 border-green-100 text-green-700'
    } ${className}`}>
      {isError ? (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{status.error ?? status.success}</span>
    </div>
  );
}
