"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import {
  LinkedListCardVisual,
  QueueCardVisual,
  StackCardVisual,
  TopicIcon,
} from "@/components/app/topic-visuals";
import { ApiError, fetchDashboardData } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

function ProgressBar({ value }) {
  return (
    <div className="h-3 rounded-full bg-[#d7d7d9]">
      <div
        className="h-full rounded-full bg-[#2f73c9]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function renderLearningVisual(topic) {
  if (topic.slug === "linked-list") {
    return <LinkedListCardVisual />;
  }

  if (topic.slug === "stack") {
    return <StackCardVisual />;
  }

  if (topic.slug === "queue") {
    return <QueueCardVisual />;
  }

  return (
    <div className="flex h-44 items-center justify-center rounded-t-[22px] bg-gradient-to-br from-[#e3edff] to-[#f6f9ff]">
      <TopicIcon kind={topic.icon} className="h-24 w-24" />
    </div>
  );
}

function LearningCard({ topic, href }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[#d9dbe8] bg-white shadow-[0_14px_35px_rgba(18,52,115,0.08)]">
      {renderLearningVisual(topic)}
      <div className="space-y-2 px-5 py-4">
        {topic.current_step_label ? (
          <span className="inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#2f73c9]">
            {topic.current_step_label}
          </span>
        ) : null}
        <h3 className="text-[22px] font-bold text-[#111827]">{topic.title}</h3>
        <p className="min-h-12 text-lg leading-7 text-[#667085]">
          {topic.current_focus || topic.short_description}
        </p>
        <div className="pt-2">
          <ProgressBar value={topic.progress} />
          <p className="mt-2 text-[18px] text-[#667085]">
            {topic.progress}% selesai
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex pt-2 text-sm font-semibold text-[#2f73c9] hover:text-[#1f5ba6]"
        >
          {topic.current_step_label
            ? `Lanjut ke ${topic.current_step_label.toLowerCase()} →`
            : "Lanjutkan belajar →"}
        </Link>
      </div>
    </article>
  );
}

function StatCard({ value, label }) {
  return (
    <article className="rounded-[20px] border border-[#d5d8e3] bg-white px-6 py-7 text-center">
      <p className="text-5xl font-bold text-[#2f73c9]">{value}</p>
      <p className="mt-3 text-2xl font-semibold text-[#717171]">{label}</p>
    </article>
  );
}

function QuickLinkCard({ icon, title, description, href }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-6 rounded-[22px] border-2 border-[#2f73c9] bg-white px-6 py-6 shadow-[0_14px_28px_rgba(47,115,201,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(47,115,201,0.08)]"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#b9d7ff]">
        <TopicIcon kind={icon} className="h-9 w-9" />
      </div>
      <div>
        <h3 className="text-[20px] font-bold text-[#111827]">{title}</h3>
        <p className="mt-1 text-lg text-[#667085]">{description}</p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
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
      const payload = await fetchDashboardData(session.access_token);
      setData(payload);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal mengambil data dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [router, session?.access_token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AppShell
      hero={(user) => (
        <div>
          <h1 className="text-[44px] font-bold tracking-tight">
            Selamat datang kembali {user.name}!
          </h1>
          <p className="mt-3 text-xl text-white/80">
            Lanjutkan perjalananmu belajar Algoritma dan Struktur Data
          </p>
        </div>
      )}
    >
      {() => {
        if (loading) {
          return <PageLoadingState title="Memuat dashboard..." />;
        }

        if (error) {
          return <PageErrorState message={error} onRetry={loadData} />;
        }

        return (
          <div className="space-y-14">
            <section>
              <h2 className="text-[42px] font-bold tracking-tight text-[#111827]">
                Lanjutkan belajar!
              </h2>
              <div className="mt-8 grid gap-7 xl:grid-cols-3">
                {data.continue_learning.map((topic) => (
                  <LearningCard
                    key={topic.slug}
                    topic={topic}
                    href={`/topik/${topic.slug}`}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[28px] bg-[#f2f4f7] px-6 py-8">
              <h2 className="text-[40px] font-bold tracking-tight text-[#111827]">
                Statistik pembelajaranmu!
              </h2>
              <div className="mt-8 grid gap-4 lg:grid-cols-4">
                {data.stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <QuickLinkCard
                icon="book"
                title="Cari Semua Topik!"
                description="Jelajahi semua kurikulum yang ada!"
                href="/topik"
              />
              <QuickLinkCard
                icon="star"
                title="Lihat Progresmu!"
                description="Pantau prestasimu!"
                href="/progress"
              />
            </section>
          </div>
        );
      }}
    </AppShell>
  );
}
