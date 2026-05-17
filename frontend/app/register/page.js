'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser, saveSession, getSession } from '../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace('/dashboard');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(form.name, form.email, form.password);
      saveSession(data);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col items-center justify-between py-16 px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 left-8 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-16 right-12 w-48 h-48 border-4 border-white rounded-full" />
          <span className="absolute top-1/3 right-4 text-white text-8xl font-bold opacity-30 select-none">{">"}</span>
          <span className="absolute bottom-1/4 left-4 text-white text-8xl font-bold opacity-30 select-none">{">"}</span>
        </div>

        {/* Illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          <div className="relative w-full max-w-sm aspect-square">
            <Image
              src="/auth-illustration.png"
              alt="Ilustrasi belajar"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Teman Belajar Algoritma & Struktur Data</h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto">
            Pahami konsep, coba latihan, dan kuasai algoritma langkah demi langkah.<br />
            Masuk untuk mulai belajar sekarang!
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-white px-5 sm:px-8 py-10 sm:py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Ayo Daftar!</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Mulai perjalanan belajarmu dan pahami konsep Algoritma & Struktur Data langkah demi langkah.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Nama lengkapmu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Min. 8 karakter"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
