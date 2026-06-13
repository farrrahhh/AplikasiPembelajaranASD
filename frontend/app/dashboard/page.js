'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getSession } from '../lib/auth';
import { fetchAllProgress } from '../lib/progress';

const TOPICS = [
  { id: 'pengantar',      key: 'asd_progress_pengantar',      title: 'Pengantar Algoritma dan Struktur Data', shortTitle: 'Pengantar',  href: '/dashboard/topik/pengantar',      color: '#6366f1', cover: '/cover-materials/1.png'  },
  { id: 'adt-sederhana',  key: 'asd_progress_adt_sederhana',  title: 'ADT Sederhana',                        shortTitle: 'ADT',         href: '/dashboard/topik/adt-sederhana',  color: '#a855f7', cover: '/cover-materials/2.png'  },
  { id: 'list',           key: 'asd_progress_list',           title: 'List',                                 shortTitle: 'List',        href: '/dashboard/topik/list',           color: '#10b981', cover: '/cover-materials/3.png'  },
  { id: 'mesin-karakter', key: 'asd_progress_mesin_karakter', title: 'Mesin Karakter & Kata',                shortTitle: 'Mesin',       href: '/dashboard/topik/mesin-karakter', color: '#0ea5e9', cover: '/cover-materials/4.png'  },
  { id: 'stack-queue',    key: 'asd_progress_stack_queue',    title: 'Stack & Queue',                        shortTitle: 'Stack',       href: '/dashboard/topik/stack-queue',    color: '#f43f5e', cover: '/cover-materials/5.png'  },
  { id: 'set-map',        key: 'asd_progress_set_map',        title: 'Set & Map',                            shortTitle: 'Set & Map',   href: '/dashboard/topik/set-map',        color: '#14b8a6', cover: '/cover-materials/6.png'  },
  { id: 'list-linier',    key: 'asd_progress_list_linier',    title: 'List Linier',                          shortTitle: 'L. Linier',   href: '/dashboard/topik/list-linier',    color: '#06b6d4', cover: '/cover-materials/7.png'  },
  { id: 'binary-tree',    key: 'asd_progress_binary_tree',    title: 'Binary Tree',                          shortTitle: 'B. Tree',     href: '/dashboard/topik/binary-tree',    color: '#f59e0b', cover: '/cover-materials/8.png'  },
  { id: 'graph',          key: 'asd_progress_graph',          title: 'Graph',                                shortTitle: 'Graph',       href: '/dashboard/topik/graph',          color: '#8b5cf6', cover: '/cover-materials/9.png'  },
  { id: 'aplikasi',       key: 'asd_progress_aplikasi',       title: 'Aplikasi',                             shortTitle: 'Aplikasi',    href: '/dashboard/topik/aplikasi',       color: '#f97316', cover: '/cover-materials/10.png' },
];

const SECTIONS = ['materi', 'contoh', 'latihan', 'ringkasan'];
const SECTION_LABELS = { materi: 'Materi', contoh: 'Contoh', latihan: 'Latihan', ringkasan: 'Ringkasan' };

function greeting(name) {
  const h = new Date().getHours();
  const first = name.split(' ')[0];
  if (h < 12) return `Selamat pagi, ${first}!`;
  if (h < 18) return `Selamat siang, ${first}!`;
  return `Selamat malam, ${first}!`;
}

function buildInsights(rows) {
  const list = [];
  rows.forEach(({ topic, d, secs }) => {
    if (secs === 0) return;
    if (secs === 3) {
      const missing = SECTIONS.find((s) => !d[s]);
      list.push({ priority: 1, topic, message: `Hampir selesai di ${topic.shortTitle} — tinggal ${SECTION_LABELS[missing]}.`, cta: 'Selesaikan' });
    } else if (d.materi && d.contoh && !d.latihan) {
      list.push({ priority: 2, topic, message: `Sudah baca materi ${topic.shortTitle}, tapi belum mencoba latihan.`, cta: 'Coba latihan' });
    } else if (d.materi && !d.contoh) {
      list.push({ priority: 3, topic, message: `Pelajari contoh soal ${topic.shortTitle} untuk memperkuat pemahaman.`, cta: 'Lihat contoh' });
    } else if (secs === 1) {
      list.push({ priority: 4, topic, message: `${topic.shortTitle} baru dimulai — lanjutkan ke bagian berikutnya.`, cta: 'Lanjutkan' });
    }
  });
  return list.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

export default function BerandaPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const u = getSession()?.user ?? null;
    setUser(u);
    if (!u) { router.replace('/login'); return; }

    fetchAllProgress().then((progressMap) => {
      setRows(TOPICS.map((topic) => {
        const d = progressMap[topic.id] ?? {};
        const secs = SECTIONS.filter((s) => d[s]).length;
        return { topic, d, secs, pct: secs * 25 };
      }));
      setLoaded(true);
    });

    try {
      setStreak(parseInt(localStorage.getItem('asd_streak') ?? '0', 10));
    } catch {}
  }, [router]);

  if (!user || !loaded) return null;

  const inProgress     = rows.filter(({ pct }) => pct > 0 && pct < 100);
  const nextUnstarted  = rows.find(({ pct }) => pct === 0);
  const completedCount = rows.filter(({ pct }) => pct === 100).length;
  const avgProgress    = Math.round(rows.reduce((s, { pct }) => s + pct, 0) / rows.length);
  const insights       = buildInsights(rows);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Banner ── */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-5 sm:px-8 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-400 text-sm mb-1">Selamat datang kembali</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">
            {greeting(user.name)}
          </h1>

          <div className="flex flex-wrap gap-6 sm:gap-10">
            <HeroStat value={`${avgProgress}%`} label="Progress keseluruhan" />
            <div className="w-px bg-slate-700" />
            <HeroStat value={completedCount} label="Topik selesai" />
            <div className="w-px bg-slate-700" />
            <HeroStat value={`${streak} hari`} label="Streak belajar" highlight={streak > 0} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-10">

        {/* ── Lanjutkan Belajar ── */}
        {inProgress.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Lanjutkan belajar</h2>
              <Link href="/dashboard/topik" className="text-sm text-purple-700 hover:text-purple-900 font-medium transition-colors">
                Lihat semua
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {inProgress.slice(0, 4).map(({ topic, pct, secs }) => (
                <CourseCard key={topic.id} topic={topic} pct={pct} secs={secs} />
              ))}
            </div>
          </section>
        )}

        {/* ── Topik Selanjutnya ── */}
        {nextUnstarted && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {inProgress.length === 0 ? 'Mulai belajar' : 'Topik selanjutnya'}
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative sm:w-48 h-32 sm:h-auto shrink-0 overflow-hidden">
                <Image
                  src={nextUnstarted.topic.cover}
                  alt={nextUnstarted.topic.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
              {/* Info */}
              <div className="p-5 flex flex-col justify-center flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Belum dimulai</p>
                <h3 className="text-base font-bold text-slate-900 mb-1">{nextUnstarted.topic.title}</h3>
                <p className="text-sm text-slate-500 mb-4">4 sesi · Mulai dari awal</p>
                <div>
                  <Link
                    href={nextUnstarted.topic.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Mulai sekarang
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Yang Perlu Ditingkatkan ── */}
        {insights.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Yang perlu ditingkatkan</h2>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {insights.map((ins, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-slate-50 transition-colors">
                  {/* Color dot */}
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold select-none"
                    style={{ backgroundColor: ins.topic.color }}
                  >
                    {ins.topic.shortTitle[0]}
                  </div>
                  <p className="flex-1 text-sm text-slate-700">{ins.message}</p>
                  <Link
                    href={ins.topic.href}
                    className="shrink-0 text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors whitespace-nowrap"
                  >
                    {ins.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state ── */}
        {inProgress.length === 0 && !nextUnstarted && (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-base font-bold text-slate-800">Semua topik selesai!</p>
            <p className="text-sm text-slate-400 mt-1">Kamu telah menyelesaikan seluruh kurikulum ASD.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function HeroStat({ value, label, highlight }) {
  return (
    <div>
      <p className={`text-2xl sm:text-3xl font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function CourseCard({ topic, pct, secs }) {
  return (
    <Link
      href={topic.href}
      className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
    >
      {/* Thumbnail */}
      <div className="relative h-28 overflow-hidden">
        <Image
          src={topic.cover}
          alt={topic.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <span className="absolute bottom-2 right-2.5 text-xs font-bold text-white drop-shadow">
          {pct}%
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2 mb-2 min-h-10">
          {topic.title}
        </h3>
        <p className="text-xs text-slate-400 mb-2">{secs}/4 sesi selesai</p>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: topic.color }}
          />
        </div>
        <p className="text-xs text-slate-500 font-medium group-hover:text-purple-700 transition-colors">
          Lanjutkan →
        </p>
      </div>
    </Link>
  );
}
