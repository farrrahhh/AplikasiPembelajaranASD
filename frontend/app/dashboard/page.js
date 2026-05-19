'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession } from '../lib/auth';

const TOPICS = [
  { id: 'pengantar',      key: 'asd_progress_pengantar',      title: 'Pengantar Algoritma dan Struktur Data', shortTitle: 'Pengantar',   href: '/dashboard/topik/pengantar',      color: '#6366f1' },
  { id: 'adt-sederhana',  key: 'asd_progress_adt_sederhana',  title: 'ADT Sederhana',                        shortTitle: 'ADT',          href: '/dashboard/topik/adt-sederhana',  color: '#a855f7' },
  { id: 'list',           key: 'asd_progress_list',           title: 'List',                                 shortTitle: 'List',         href: '/dashboard/topik/list',           color: '#10b981' },
  { id: 'mesin-karakter', key: 'asd_progress_mesin_karakter', title: 'Mesin Karakter & Kata',                shortTitle: 'Mesin',        href: '/dashboard/topik/mesin-karakter', color: '#0ea5e9' },
  { id: 'stack-queue',    key: 'asd_progress_stack_queue',    title: 'Stack & Queue',                        shortTitle: 'Stack',        href: '/dashboard/topik/stack-queue',    color: '#f43f5e' },
  { id: 'set-map',        key: 'asd_progress_set_map',        title: 'Set & Map',                            shortTitle: 'Set & Map',    href: '/dashboard/topik/set-map',        color: '#14b8a6' },
  { id: 'list-linier',    key: 'asd_progress_list_linier',    title: 'List Linier',                          shortTitle: 'L. Linier',    href: '/dashboard/topik/list-linier',    color: '#06b6d4' },
  { id: 'binary-tree',    key: 'asd_progress_binary_tree',    title: 'Binary Tree',                          shortTitle: 'B. Tree',      href: '/dashboard/topik/binary-tree',    color: '#f59e0b' },
  { id: 'graph',          key: 'asd_progress_graph',          title: 'Graph',                                shortTitle: 'Graph',        href: '/dashboard/topik/graph',          color: '#8b5cf6' },
  { id: 'aplikasi',       key: 'asd_progress_aplikasi',       title: 'Aplikasi',                             shortTitle: 'Aplikasi',     href: '/dashboard/topik/aplikasi',       color: '#f97316' },
];

const SECTION_LABELS = { materi: 'Materi', contoh: 'Contoh', latihan: 'Latihan', ringkasan: 'Ringkasan' };
const SECTIONS = ['materi', 'contoh', 'latihan', 'ringkasan'];

function readProgress(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? {}; } catch { return {}; }
}

function countDone(d) {
  return SECTIONS.filter((s) => d[s]).length;
}

function getStreak() {
  try { return parseInt(localStorage.getItem('asd_streak') ?? '0', 10); } catch { return 0; }
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';
  if (h < 18) return 'Selamat siang';
  return 'Selamat malam';
}

function buildInsights(rows) {
  const insights = [];
  rows.forEach(({ topic, d, secs }) => {
    if (secs === 0) return;

    // 75% done — one section left
    if (secs === 3) {
      const missing = SECTIONS.find((s) => !d[s]);
      insights.push({
        priority: 1,
        icon: '🎯',
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        topic,
        message: `Hampir selesai di ${topic.shortTitle}! Tinggal bagian ${SECTION_LABELS[missing]}.`,
        cta: 'Selesaikan',
      });
      return;
    }

    // Materi done but latihan skipped
    if (d.materi && d.contoh && !d.latihan) {
      insights.push({
        priority: 2,
        icon: '✏️',
        bg: 'bg-amber-50',
        iconBg: 'bg-amber-100',
        topic,
        message: `Kamu sudah membaca materi ${topic.shortTitle} tapi belum mencoba latihan.`,
        cta: 'Coba Latihan',
      });
      return;
    }

    // Materi done, contoh skipped
    if (d.materi && !d.contoh) {
      insights.push({
        priority: 3,
        icon: '📖',
        bg: 'bg-sky-50',
        iconBg: 'bg-sky-100',
        topic,
        message: `Pelajari contoh soal di ${topic.shortTitle} untuk memperkuat pemahamanmu.`,
        cta: 'Lihat Contoh',
      });
      return;
    }

    // Only materi done (stuck early)
    if (secs === 1) {
      insights.push({
        priority: 4,
        icon: '⚡',
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        topic,
        message: `${topic.shortTitle} baru dimulai. Lanjutkan ke bagian berikutnya!`,
        cta: 'Lanjutkan',
      });
    }
  });

  return insights.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

export default function BerandaPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/login'); return; }
    setUser(s.user);
    setRows(
      TOPICS.map((topic) => {
        const d = readProgress(topic.key);
        const secs = countDone(d);
        return { topic, d, secs, pct: secs * 25 };
      }),
    );
    setStreak(getStreak());
  }, [router]);

  if (!user || rows.length === 0) return null;

  const inProgress  = rows.filter(({ pct }) => pct > 0 && pct < 100);
  const nextUnstarted = rows.find(({ pct }) => pct === 0);
  const completedCount = rows.filter(({ pct }) => pct === 100).length;
  const avgProgress = Math.round(rows.reduce((s, { pct }) => s + pct, 0) / rows.length);
  const insights = buildInsights(rows);

  const subtitle =
    avgProgress === 0
      ? 'Yuk mulai perjalanan belajarmu hari ini.'
      : completedCount === TOPICS.length
      ? 'Luar biasa! Kamu telah menyelesaikan semua topik. 🎉'
      : `Kamu sudah ${avgProgress}% dari semua topik. Terus semangat!`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">

      {/* ── Sambutan ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold select-none shrink-0">
            {user.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {greeting()}, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat value={`${avgProgress}%`}    label="Progress"       color="text-blue-600"  bg="bg-blue-50"  />
          <MiniStat value={completedCount}        label="Topik Selesai"  color="text-green-600" bg="bg-green-50" />
          <MiniStat value={`${streak}d`}          label="Hari Streak"    color="text-amber-500" bg="bg-amber-50" />
        </div>
      </div>

      {/* ── Lanjutkan Belajar ── */}
      {inProgress.length > 0 && (
        <section>
          <SectionHeader title="Lanjutkan Belajar" href="/dashboard/topik" linkLabel="Lihat semua" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inProgress.slice(0, 3).map(({ topic, d, pct, secs }) => (
              <TopicCard key={topic.id} topic={topic} d={d} pct={pct} secs={secs} />
            ))}
          </div>
        </section>
      )}

      {/* ── Topik Berikutnya ── */}
      {nextUnstarted && (
        <section>
          <SectionHeader title="Topik Berikutnya" />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base select-none shrink-0"
              style={{ backgroundColor: nextUnstarted.topic.color }}
            >
              {nextUnstarted.topic.shortTitle[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{nextUnstarted.topic.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Belum dimulai · 4 sesi</p>
            </div>
            <Link
              href={nextUnstarted.topic.href}
              className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Mulai
            </Link>
          </div>
        </section>
      )}

      {/* ── Analisis ── */}
      {insights.length > 0 && (
        <section>
          <SectionHeader title="Yang Perlu Ditingkatkan" />
          <div className="space-y-2.5">
            {insights.map((ins, i) => (
              <div
                key={i}
                className={`rounded-xl border border-transparent ${ins.bg} p-4 flex items-center gap-3`}
              >
                <div className={`w-9 h-9 rounded-xl ${ins.iconBg} flex items-center justify-center text-base shrink-0`}>
                  {ins.icon}
                </div>
                <p className="flex-1 text-sm text-gray-700 leading-snug">{ins.message}</p>
                <Link
                  href={ins.topic.href}
                  className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap"
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
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-base font-semibold text-gray-800">Semua topik selesai!</p>
          <p className="text-sm text-gray-500 mt-1">Kamu telah menguasai seluruh materi ASD.</p>
        </div>
      )}

    </div>
  );
}

/* ── Sub-components ── */

function MiniStat({ value, label, color, bg }) {
  return (
    <div className={`${bg} rounded-xl px-3 py-3 flex flex-col items-center`}>
      <span className={`text-lg sm:text-xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-gray-500 mt-0.5 text-center leading-tight">{label}</span>
    </div>
  );
}

function SectionHeader({ title, href, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function TopicCard({ topic, pct, secs }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm select-none shrink-0"
          style={{ backgroundColor: topic.color }}
        >
          {topic.shortTitle[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{topic.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{secs}/4 sesi selesai</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-semibold" style={{ color: topic.color }}>{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: topic.color }}
          />
        </div>
      </div>

      <Link
        href={topic.href}
        className="flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Lanjutkan
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
