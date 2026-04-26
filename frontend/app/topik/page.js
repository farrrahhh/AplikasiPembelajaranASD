"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import { TopicIcon } from "@/components/app/topic-visuals";
import { ApiError, fetchTopicsData } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

const TOPIC_TONES = {
  "linked-list": {
    accent: "#2f6fd0",
    soft: "#eef4ff",
    iconSurface: "#e7f0ff",
    progress: "#4f76d7",
    glow: "radial-gradient(circle at top left, rgba(47,111,208,0.18), transparent 58%)",
  },
  stack: {
    accent: "#6f5ad8",
    soft: "#f4f0ff",
    iconSurface: "#efe9ff",
    progress: "#6f5ad8",
    glow: "radial-gradient(circle at top left, rgba(111,90,216,0.16), transparent 58%)",
  },
  queue: {
    accent: "#c3773b",
    soft: "#fff5ea",
    iconSurface: "#fff0dc",
    progress: "#d08143",
    glow: "radial-gradient(circle at top left, rgba(195,119,59,0.16), transparent 58%)",
  },
  tree: {
    accent: "#4d8d4f",
    soft: "#eef8ee",
    iconSurface: "#e7f4e7",
    progress: "#5a9b5b",
    glow: "radial-gradient(circle at top left, rgba(77,141,79,0.15), transparent 58%)",
  },
  graph: {
    accent: "#3f77a7",
    soft: "#edf7fb",
    iconSurface: "#e5f1f8",
    progress: "#4e84b2",
    glow: "radial-gradient(circle at top left, rgba(63,119,167,0.15), transparent 58%)",
  },
  sorting: {
    accent: "#af8a1e",
    soft: "#fff8e7",
    iconSurface: "#fff3d4",
    progress: "#d0a22c",
    glow: "radial-gradient(circle at top left, rgba(175,138,30,0.14), transparent 58%)",
  },
};

function ProgressBar({ value, color = "#5f6af4" }) {
  return (
    <div className="h-2 rounded-full bg-[#d9deea]">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function LevelBadge({ label, recommended = false }) {
  if (recommended) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d8deea] bg-[#111827] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
        <span className="text-[10px] text-[#f6d365]">✦</span>
        Direkomendasikan
      </span>
    );
  }

  const toneClass =
    label === "Beginner"
      ? "border-[#cce8d4] bg-[#f4fbf6] text-[#2f7a41]"
      : label === "Intermediate"
        ? "border-[#f3dfaa] bg-[#fff8e7] text-[#9e6f00]"
        : "border-[#f4cfd4] bg-[#fff5f6] text-[#c34d59]";

  return (
    <span className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${toneClass}`}>
      {label}
    </span>
  );
}

function TopicCard({ topic }) {
  const isLocked = Boolean(topic.locked);
  const tone = TOPIC_TONES[topic.icon] ?? TOPIC_TONES["linked-list"];

  if (isLocked) {
    return (
      <article className="overflow-hidden rounded-[30px] border border-[#e2e8f0] bg-[#fcfcfb] shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <div className="h-1.5 w-full" style={{ backgroundColor: tone.accent }} />
        <div className="relative p-7" style={{ backgroundImage: tone.glow }}>
          <div className="flex items-start justify-between gap-4">
            <div
              className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] border border-white/70"
              style={{ backgroundColor: tone.iconSurface }}
            >
              <TopicIcon kind={topic.icon} className="h-12 w-12 opacity-50" />
            </div>
            <LevelBadge label={topic.level} />
          </div>

          <h3 className="mt-8 text-[28px] font-bold tracking-[-0.02em] text-[#98a2b3]">
            {topic.title}
          </h3>
          <p className="mt-3 min-h-24 text-[20px] leading-9 text-[#98a2b3]">
            {topic.description}
          </p>

          <div className="mt-8 rounded-[28px] border border-[#e3e8ef] bg-white/80 px-6 py-7 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_12px_24px_rgba(15,23,42,0.07)]">
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-[#94a3b8]" fill="none">
                  <path
                    d="M8 10V7a4 4 0 118 0v3M6 10h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                  Belum terbuka
                </p>
                <p className="mt-1 text-[24px] font-semibold leading-8 text-[#344054]">
                  Selesaikan topik sebelumnya dulu
                </p>
              </div>
            </div>
            <p className="mt-5 text-[17px] leading-8 text-[#667085]">
              Materi ini akan terbuka otomatis begitu progres belajarmu di topik
              sebelumnya sudah cukup kuat.
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[30px] border border-[#dde5f0] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.08)]">
      <div className="h-1.5 w-full" style={{ backgroundColor: tone.accent }} />
      <div className="relative p-7" style={{ backgroundImage: tone.glow }}>
        <div className="flex items-start justify-between gap-4">
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] border border-white/70"
            style={{ backgroundColor: tone.iconSurface }}
          >
            <TopicIcon kind={topic.icon} className="h-12 w-12" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {topic.recommended ? <LevelBadge recommended /> : null}
            <LevelBadge label={topic.level} />
          </div>
        </div>

        <div className="mt-8">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: tone.accent }}
          >
            {topic.recommended ? "Pilihan saat ini" : "Topik belajar"}
          </p>
          <h3 className="mt-3 text-[30px] font-bold tracking-[-0.025em] text-[#111827]">
            {topic.title}
          </h3>
          <p className="mt-3 min-h-24 text-[20px] leading-9 text-[#566074]">
            {topic.description}
          </p>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#edf1f6] bg-[#fbfcfd] px-5 py-5">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#98a2b3]">
                Progress
              </p>
              <p className="mt-1 text-[28px] font-bold text-[#111827]">
                {topic.progress}%
              </p>
            </div>
            <div className="text-right text-[15px] leading-6 text-[#667085]">
              <p>{topic.exercises} latihan</p>
              <p>{topic.duration}</p>
            </div>
          </div>
          <ProgressBar value={topic.progress} color={tone.progress} />
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <div className="text-[15px] leading-6 text-[#667085]">
            <p className="font-medium text-[#111827]">
              {topic.progress >= 100 ? "Siap direview lagi" : "Lanjut dari progres terakhirmu"}
            </p>
            <p className="mt-1">
              {topic.progress >= 100
                ? "Buka ulang materi dan latihan untuk menguatkan pemahaman."
                : "Masuk kembali ke alur belajar tanpa kehilangan progress."}
            </p>
          </div>
          <Link
            href={`/topik/${topic.slug}`}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-[#d2dae6] bg-white px-5 text-[15px] font-semibold text-[#111827] transition hover:border-[#111827] hover:bg-[#111827] hover:text-white"
          >
            Lanjut belajar
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function TopicsPage() {
  const router = useRouter();
  const session = useAuthSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!session?.access_token) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await fetchTopicsData(session.access_token);
      setData(payload);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error ? fetchError.message : "Gagal mengambil data topik.",
      );
    } finally {
      setLoading(false);
    }
  }, [router, session?.access_token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AppShell>
      {() => {
        if (loading) {
          return <PageLoadingState title="Memuat daftar topik..." />;
        }

        if (error) {
          return <PageErrorState message={error} onRetry={loadData} />;
        }

        return (
          <div className="space-y-8">
            <section className="rounded-[32px] border border-[#e4e7ec] bg-[linear-gradient(135deg,#f8f6f1_0%,#fbfcfd_46%,#eef3ff_100%)] px-7 py-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#667085]">
                Kurikulum
              </p>
              <h1 className="mt-3 text-[48px] font-bold tracking-[-0.03em] text-[#1e293b]">
                Pilih topik belajarmu
              </h1>
              <p className="mt-3 max-w-4xl text-[18px] leading-8 text-[#475467]">
                Ikuti jalur belajar yang terstruktur, atau lanjutkan langsung ke
                topik yang sedang kamu pelajari sekarang.
              </p>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              {data.topics.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </section>

            <section className="rounded-[30px] border border-[#d6dee8] bg-[#f6f8fb] px-6 py-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white">
                  <TopicIcon kind="book" className="h-9 w-9" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                    Jalur belajar
                  </p>
                  <h2 className="mt-2 text-[20px] font-bold text-[#111827]">
                    {data.learning_path_title}
                  </h2>
                  <p className="mt-2 text-lg leading-8 text-[#394150]">
                    {data.learning_path_description}
                  </p>
                </div>
              </div>
            </section>
          </div>
        );
      }}
    </AppShell>
  );
}
