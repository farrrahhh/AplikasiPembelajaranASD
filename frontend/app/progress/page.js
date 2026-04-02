"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import { TopicIcon } from "@/components/app/topic-visuals";
import { ApiError, fetchProgressData } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

function SummaryTile({ item }) {
  const toneMap = {
    purple: "bg-[#f3efff] border-[#ddd2ff] text-[#6c4cf6]",
    green: "bg-[#f0fff4] border-[#d3f2da] text-[#49b95d]",
    blue: "bg-[#eef5ff] border-[#d6e7ff] text-[#4d7de0]",
    gold: "bg-[#fff7e1] border-[#ffe8a3] text-[#ee9824]",
  };

  return (
    <article className={`rounded-[22px] border px-6 py-6 text-center ${toneMap[item.tone]}`}>
      <p className="text-5xl font-bold">{item.value}</p>
      <p className="mt-3 text-lg font-semibold text-[#475467]">{item.label}</p>
    </article>
  );
}

function ChartCard({ chart }) {
  return (
    <section className="rounded-[26px] border border-[#d8deea] bg-white px-6 py-6 shadow-[0_16px_30px_rgba(18,52,115,0.05)]">
      <h2 className="text-[24px] font-bold text-[#111827]">📈 Progress by Topic</h2>
      <p className="mt-1 text-[18px] text-[#667085]">
        Your completion percentage across all topics
      </p>
      <div className="mt-8">
        <div className="flex h-[300px] items-end gap-4 rounded-[22px] bg-[linear-gradient(180deg,#fcfdff_0%,#f7f9ff_100%)] px-4 pb-10 pt-8">
          {chart.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full max-w-[120px] rounded-t-[18px]"
                style={{
                  height: `${Math.max(item.value * 2.2, 18)}px`,
                  backgroundColor: item.color,
                }}
              />
              <p className="mt-4 rotate-[-45deg] text-sm text-[#667085]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatLastAccessed(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
}

function DetailedProgressCard({ topic }) {
  const statusClass =
    topic.status === "in-progress"
      ? "bg-[#e7f4ea] text-[#16a34a]"
      : topic.status === "beginner"
        ? "bg-[#ecfdf3] text-[#22c55e]"
        : topic.status === "intermediate"
          ? "bg-[#fff6dd] text-[#d4a10f]"
          : "bg-[#ffe8e8] text-[#e85a4f]";

  return (
    <article className="rounded-[24px] border border-[#d8deea] bg-white px-6 py-6 shadow-[0_14px_28px_rgba(18,52,115,0.04)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#f5f8ff]">
          <TopicIcon kind={topic.icon} className="h-12 w-12" />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-[22px] font-bold text-[#111827]">{topic.title}</h3>
              <p className="mt-1 text-lg text-[#667085]">{topic.description}</p>
            </div>
            <span className={`rounded-full px-4 py-1 text-sm font-semibold ${statusClass}`}>
              {topic.status.replace("-", " ")}
            </span>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_160px_180px]">
            <div>
              <div className="mb-2 flex items-center justify-between text-[16px] text-[#475467]">
                <span>Progress</span>
                <span className="font-semibold text-[#4d59e8]">{topic.progress}%</span>
              </div>
              <div className="h-3 rounded-full bg-[#d9dcf2]">
                <div
                  className="h-full rounded-full bg-[#5f6af4]"
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-[#667085]">Exercises</p>
              <p className="mt-1 text-lg font-semibold text-[#111827]">
                {topic.exercises_completed} / {topic.exercises_total}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#667085]">Last Accessed</p>
              <p className="mt-1 text-lg font-semibold text-[#111827]">
                {formatLastAccessed(topic.last_accessed)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function AchievementCard({ item }) {
  const badgeClass =
    item.tone === "gold"
      ? "bg-[#fff4d6] text-[#c49102]"
      : item.tone === "green"
        ? "bg-[#eafbf1] text-[#16a34a]"
        : "bg-[#edf2ff] text-[#3b82f6]";

  return (
    <article className="rounded-[22px] border border-[#e2d9b4] bg-white px-5 py-6 text-center shadow-[0_10px_20px_rgba(176,146,40,0.06)]">
      <div className="text-4xl">
        {item.tone === "gold" ? "🏆" : item.tone === "green" ? "⚡" : "🎯"}
      </div>
      <h3 className="mt-4 text-[22px] font-bold text-[#111827]">{item.title}</h3>
      <p className="mt-1 text-lg text-[#667085]">{item.description}</p>
      <span className={`mt-4 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${badgeClass}`}>
        {item.status}
      </span>
    </article>
  );
}

export default function ProgressPage() {
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
      const payload = await fetchProgressData(session.access_token);
      setData(payload);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error ? fetchError.message : "Gagal mengambil progress.",
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
          return <PageLoadingState title="Memuat progress belajarmu..." />;
        }

        if (error) {
          return <PageErrorState message={error} onRetry={loadData} />;
        }

        return (
          <div className="space-y-8">
            <section>
              <h1 className="text-[44px] font-bold tracking-tight text-[#111827]">
                Your Progress
              </h1>
              <p className="mt-2 text-[18px] leading-8 text-[#667085]">
                Track your learning journey and celebrate your achievements
              </p>
            </section>

            <section className="grid gap-5 lg:grid-cols-4">
              {data.summary.map((item) => (
                <SummaryTile key={item.label} item={item} />
              ))}
            </section>

            <ChartCard chart={data.chart} />

            <section>
              <h2 className="text-[30px] font-bold text-[#111827]">Detailed Progress</h2>
              <div className="mt-5 space-y-5">
                {data.topics.map((topic) => (
                  <DetailedProgressCard key={topic.slug} topic={topic} />
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-[#f0d67c] bg-[#fffbea] px-6 py-6">
              <h2 className="text-[28px] font-bold text-[#111827]">
                🏅 Recent Achievements
              </h2>
              <p className="mt-1 text-[18px] text-[#667085]">
                Celebrate your milestones!
              </p>
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {data.achievements.map((item) => (
                  <AchievementCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-[#cfd9ff] bg-[#eef1ff] px-6 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#6c4cf6] text-white">
                  <TopicIcon kind="target" className="h-12 w-12" />
                </div>
                <div>
                  <h2 className="text-[24px] font-bold text-[#111827]">
                    {data.encouragement_title}
                  </h2>
                  <p className="mt-1 text-[18px] leading-8 text-[#475467]">
                    {data.encouragement_text.replaceAll("&apos;", "'")}
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
