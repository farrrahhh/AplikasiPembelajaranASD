"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import { TopicIcon } from "@/components/app/topic-visuals";
import { ApiError, fetchTopicsData } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

function ProgressBar({ value, color = "#5f6af4" }) {
  return (
    <div className="h-3 rounded-full bg-[#d7d9fa]">
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
      <span className="rounded-full bg-gradient-to-r from-[#574ae8] to-[#9d2df4] px-4 py-1 text-sm font-semibold text-white shadow-sm">
        ✨ Recommended
      </span>
    );
  }

  const toneClass =
    label === "Beginner"
      ? "border-[#22c55e] text-[#15803d]"
      : label === "Intermediate"
        ? "border-[#f1b600] text-[#b87900]"
        : "border-[#f29aa1] text-[#d9444e]";

  return (
    <span className={`rounded-full border px-4 py-1 text-sm font-semibold ${toneClass}`}>
      {label}
    </span>
  );
}

function TopicCard({ topic }) {
  const isLocked = Boolean(topic.locked);

  if (isLocked) {
    return (
      <article className="overflow-hidden rounded-[26px] border border-[#d9e2f7] bg-white shadow-[0_14px_30px_rgba(18,52,115,0.06)]">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#f4f7ff]">
              <TopicIcon kind={topic.icon} className="h-12 w-12 opacity-50" />
            </div>
            <LevelBadge label={topic.level} />
          </div>

          <h3 className="mt-8 text-[21px] font-bold text-[#98a2b3]">{topic.title}</h3>
          <p className="mt-2 min-h-20 text-lg leading-8 text-[#98a2b3]">
            {topic.description}
          </p>

          <div className="mt-8 rounded-[24px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-6 py-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <svg viewBox="0 0 24 24" className="h-11 w-11 text-[#94a3b8]" fill="none">
                <path
                  d="M8 10V7a4 4 0 118 0v3M6 10h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-5 text-[24px] font-semibold leading-9 text-[#344054]">
              Selesaikan topik sebelumnya untuk membuka materi ini
            </p>
            <p className="mt-2 text-base leading-7 text-[#667085]">
              Topik ini akan terbuka otomatis saat progres belajarmu sudah cukup.
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`relative overflow-hidden rounded-[26px] border border-[#c8d3f8] bg-white p-6 shadow-[0_14px_30px_rgba(18,52,115,0.06)] ${
        topic.recommended ? "ring-1 ring-[#9fb8ff]" : ""
      }`}
    >
      <div className={isLocked ? "pointer-events-none opacity-35 blur-[2px]" : ""}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#f4f7ff]">
            <TopicIcon kind={topic.icon} className="h-12 w-12" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {topic.recommended ? <LevelBadge recommended /> : null}
            <LevelBadge label={topic.level} />
          </div>
        </div>

        <h3 className="mt-8 text-[21px] font-bold text-[#111827]">{topic.title}</h3>
        <p className="mt-2 min-h-20 text-lg leading-8 text-[#575a71]">
          {topic.description}
        </p>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-lg text-[#394150]">
            <span>Progress</span>
            <span className="font-semibold text-[#3526ff]">{topic.progress}%</span>
          </div>
          <ProgressBar
            value={topic.progress}
            color={topic.recommended ? "#5f6af4" : "#6d67ee"}
          />
        </div>

        <div className="mt-6 flex gap-5 text-lg text-[#394150]">
          <span>📝 {topic.exercises} exercises</span>
          <span>⏱️ {topic.duration}</span>
        </div>

        <Link
          href={`/topik/${topic.slug}`}
          className={`mt-6 h-14 w-full rounded-2xl border text-lg font-semibold transition ${
            topic.recommended
              ? "border-transparent bg-gradient-to-r from-[#5d66f6] to-[#ad1ef7] text-white"
              : "border-[#d2d5dd] bg-white text-[#111827]"
          } flex items-center justify-center`}
        >
          Continue Learning
        </Link>
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
            <section className="rounded-[28px] bg-[#f6f8ff] px-6 py-7">
              <h1 className="text-[48px] font-bold tracking-tight text-[#1e293b]">
                All Topics
              </h1>
              <p className="mt-3 max-w-4xl text-[18px] leading-8 text-[#475467]">
                Choose a topic to start learning. Follow the structured path or
                jump to any topic!
              </p>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              {data.topics.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </section>

            <section className="rounded-[28px] border border-[#b9d1ff] bg-[#eaf3ff] px-6 py-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/70">
                  <TopicIcon kind="book" className="h-9 w-9" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-[#111827]">
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
