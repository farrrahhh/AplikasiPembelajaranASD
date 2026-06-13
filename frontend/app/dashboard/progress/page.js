'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAllProgress } from '../../lib/progress';

const CHART_HEIGHT = 180;

const TOPICS = [
  {
    id: 'pengantar',
    key: 'asd_progress_pengantar',
    shortTitle: 'Pengantar',
    title: 'Pengantar Algoritma dan Struktur Data',
    description: 'Dasar-dasar Algoritma dan Struktur Data, paradigma prosedural, ADT, notasi algoritmik.',
    href: '/dashboard/topik/pengantar',
    color: '#6366f1',
  },
  {
    id: 'adt-sederhana',
    key: 'asd_progress_adt_sederhana',
    shortTitle: 'ADT',
    title: 'ADT Sederhana',
    description: 'Implementasi Abstract Data Type sederhana seperti Point, Time, dan Date dalam bahasa C.',
    href: '/dashboard/topik/adt-sederhana',
    color: '#a855f7',
  },
  {
    id: 'list',
    key: 'asd_progress_list',
    shortTitle: 'List',
    title: 'List',
    description: 'Struktur data List dengan array: representasi implisit/eksplisit, 5 alternatif implementasi.',
    href: '/dashboard/topik/list',
    color: '#10b981',
  },
  {
    id: 'mesin-karakter',
    key: 'asd_progress_mesin_karakter',
    shortTitle: 'Mesin',
    title: 'Mesin Karakter & Kata',
    description: 'Mesin abstrak untuk pemrosesan pita karakter dan kata: primitif start/adv, tiga versi model.',
    href: '/dashboard/topik/mesin-karakter',
    color: '#0ea5e9',
  },
  {
    id: 'stack-queue',
    key: 'asd_progress_stack_queue',
    shortTitle: 'Stack',
    title: 'Stack & Queue',
    description: 'Implementasi Stack (LIFO) dan Queue (FIFO) dengan array dan circular buffer.',
    href: '/dashboard/topik/stack-queue',
    color: '#f43f5e',
  },
  {
    id: 'set-map',
    key: 'asd_progress_set_map',
    shortTitle: 'Set & Map',
    title: 'Set & Map',
    description: 'ADT Set dan Map dengan array tak terurut, array terurut, dan hash table.',
    href: '/dashboard/topik/set-map',
    color: '#14b8a6',
  },
  {
    id: 'list-linier',
    key: 'asd_progress_list_linier',
    shortTitle: 'L. Linier',
    title: 'List Linier',
    description: 'Doubly Linked List, List Sirkuler, Stack, Queue, dan Priority Queue berbasis linked list.',
    href: '/dashboard/topik/list-linier',
    color: '#06b6d4',
  },
  {
    id: 'binary-tree',
    key: 'asd_progress_binary_tree',
    shortTitle: 'B. Tree',
    title: 'Binary Tree',
    description: 'Pohon biner: traversal (pre/in/post-order), fungsi rekursif, pohon seimbang, dan BST.',
    href: '/dashboard/topik/binary-tree',
    color: '#f59e0b',
  },
  {
    id: 'graph',
    key: 'asd_progress_graph',
    shortTitle: 'Graph',
    title: 'Graph',
    description: 'Graf: terminologi, 5 representasi, directed graph, dan implementasi multilist.',
    href: '/dashboard/topik/graph',
    color: '#8b5cf6',
  },
  {
    id: 'aplikasi',
    key: 'asd_progress_aplikasi',
    shortTitle: 'Aplikasi',
    title: 'Aplikasi',
    description: 'Studi kasus: Polinom, Pengelolaan Memori, Multi-List, dan Representasi Relasi M-N.',
    href: '/dashboard/topik/aplikasi',
    color: '#f97316',
  },
];


const SECTIONS = [
  { key: 'materi', label: 'Materi' },
  { key: 'contoh', label: 'Contoh' },
  { key: 'latihan', label: 'Latihan' },
  { key: 'ringkasan', label: 'Ringkasan' },
];

function countSections(d) {
  return SECTIONS.filter((s) => d[s.key]).length;
}

export default function ProgressPage() {
  const [data, setData] = useState({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchAllProgress().then(setData);
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastVisit = localStorage.getItem('asd_last_visit');
      let s = parseInt(localStorage.getItem('asd_streak') ?? '0', 10);
      if (!lastVisit) {
        localStorage.setItem('asd_last_visit', today);
        localStorage.setItem('asd_streak', '1');
        setStreak(1);
        return;
      }
      if (lastVisit === today) { setStreak(s || 1); return; }
      const diff = Math.round((new Date(today) - new Date(lastVisit)) / 86400000);
      s = diff === 1 ? s + 1 : 1;
      localStorage.setItem('asd_last_visit', today);
      localStorage.setItem('asd_streak', String(s));
      setStreak(s);
    } catch { setStreak(0); }
  }, []);

  const getPct = (id) => countSections(data[id] ?? {}) * 25;

  const avgProgress = Math.round(
    TOPICS.reduce((sum, t) => sum + getPct(t.id), 0) / TOPICS.length,
  );
  const topicsStarted = TOPICS.filter((t) => getPct(t.id) > 0).length;
  const sectionsTotal = TOPICS.reduce(
    (sum, t) => sum + countSections(data[t.id] ?? {}),
    0,
  );
  const topicsCompleted = TOPICS.filter((t) => getPct(t.id) === 100).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUpIcon />
          Your Progress
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <SummaryCard
          icon={<ChartBarIcon />}
          iconBg="bg-blue-50"
          value={`${avgProgress}%`}
          valueColor="text-blue-600"
          label="Rata-rata Progress"
          border="border-blue-100"
        />
        <SummaryCard
          icon={<CheckIcon />}
          iconBg="bg-green-50"
          value={sectionsTotal}
          valueColor="text-green-600"
          label="Sesi Selesai"
          border="border-green-100"
        />
        <SummaryCard
          icon={<BookIcon />}
          iconBg="bg-sky-50"
          value={topicsStarted}
          valueColor="text-sky-600"
          label="Topik Dimulai"
          border="border-sky-100"
        />
        <SummaryCard
          icon={<FlameIcon />}
          iconBg="bg-amber-50"
          value={streak}
          valueColor="text-amber-500"
          label="Hari Berturut-turut"
          border="border-amber-100"
        />
      </div>

      {/* Detailed progress */}
      <h2 className="text-base font-semibold text-gray-900 mb-3">Detailed Progress</h2>
      <div className="space-y-3">
        {TOPICS.map((t) => {
          const d = data[t.id] ?? {};
          const pct = countSections(d) * 25;
          const secs = countSections(d);
          return <TopicCard key={t.id} topic={t} d={d} pct={pct} secs={secs} />;
        })}
      </div>
    </div>
  );
}

function SummaryCard({ icon, iconBg, value, valueColor, label, border }) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-4 sm:p-5 flex flex-col items-center gap-2 ${border}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <div className={`text-2xl sm:text-3xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-xs text-gray-500 text-center leading-tight">{label}</div>
    </div>
  );
}

function BarChart({ topics, getPct, animated }) {
  const H = CHART_HEIGHT;
  return (
    <div>
      {/* Chart area */}
      <div className="relative" style={{ paddingLeft: '36px', height: `${H}px` }}>
        {/* Y-axis grid lines */}
        {[100, 75, 50, 25, 0].map((v) => (
          <div
            key={v}
            className="absolute left-0 right-0 flex items-center pointer-events-none"
            style={{ bottom: `${(v / 100) * H}px`, transform: 'translateY(50%)' }}
          >
            <span
              className="absolute left-0 text-gray-400 select-none"
              style={{ fontSize: '10px', width: '28px', textAlign: 'right' }}
            >
              {v}
            </span>
            <div
              className="absolute right-0 border-t"
              style={{
                left: '34px',
                borderColor: v === 0 ? '#d1d5db' : '#f3f4f6',
              }}
            />
          </div>
        ))}

        {/* Bars */}
        <div
          className="absolute bottom-0 right-0 flex items-end"
          style={{ left: '36px', height: `${H}px`, gap: '6px' }}
        >
          {topics.map((t) => {
            const pct = getPct(t.id);
            const barH = animated ? Math.max((pct / 100) * H, pct > 0 ? 3 : 0) : 0;
            return (
              <div
                key={t.id}
                className="flex-1 flex items-end justify-center"
                style={{ height: `${H}px` }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '44px',
                    height: `${barH}px`,
                    backgroundColor: t.color,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  title={`${t.title}: ${pct}%`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex mt-2" style={{ paddingLeft: '36px', gap: '6px' }}>
        {topics.map((t) => (
          <div key={t.id} className="flex-1 flex justify-center">
            <span
              className="text-gray-400 text-center leading-tight select-none"
              style={{ fontSize: '9px', display: 'block', maxWidth: '44px' }}
            >
              {t.shortTitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicCard({ topic: t, d, pct, secs }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        {/* Color icon */}
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-sm select-none"
          style={{ backgroundColor: t.color }}
        >
          {t.shortTitle[0]}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug">{t.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.description}</p>
          </div>

          {/* Progress bar row */}
          <div className="mt-3 flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-gray-400 shrink-0 w-14">Progress</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: t.color }}
              />
            </div>
            <span
              className="text-xs font-semibold shrink-0 w-8 text-right"
              style={{ color: t.color }}
            >
              {pct}%
            </span>
            <span className="text-xs text-gray-400 shrink-0 hidden sm:inline">
              {secs}/4 sesi
            </span>
          </div>

          {/* Section tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {SECTIONS.map((sec) => {
              const done = !!d[sec.key];
              return (
                <span
                  key={sec.key}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                    done
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  <span className="text-xs leading-none">{done ? '✓' : '○'}</span>
                  <span>{sec.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 self-start">
          <Link
            href={t.href}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
          >
            {pct > 0 ? 'Lanjutkan' : 'Mulai'}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Inline SVG icons ── */

function TrendingUpIcon() {
  return (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function ChartBarIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-1 .23-1.98.75-2.73 1.5-2.68 2.7-2.38 6.88 0 9.58.27.32.51.66.75 1.01C12 15.09 12 15 12 14.94c0-.2-.01-.4-.04-.6C12.07 13 12.42 12 13 11.4c.2.6.3 1.26.3 1.9 0 1.78-.67 3.48-1.78 4.82C11 18.8 10.49 19.4 10 20c-.04.05-.08.11-.12.17a4.63 4.63 0 003.24-1.08c.85-.77 1.43-1.83 1.68-2.93.21-.92.24-1.82.06-2.74-.18-.93-.6-1.8-1.2-2.22zM9.23 12.94c-1.7 2.6-.73 5.45 1.13 7.06C9.84 19.73 9.1 19.1 8.6 18.3c-1.14-1.7-1.22-4.07-.21-5.82C8.71 11.72 9.68 11 10.5 10c.8-1 1.45-2.06 1.6-3.38-.1.12-.2.24-.3.37-1.1 1.5-2.55 2.96-2.57 4.95z" />
    </svg>
  );
}
