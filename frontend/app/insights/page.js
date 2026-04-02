"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import { TopicIcon } from "@/components/app/topic-visuals";
import { ApiError, fetchInsightsData } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

function SummaryBox({ label, value, tone }) {
  const toneClasses = {
    blue: "border-[#5b7fe9] text-[#2f73c9]",
    green: "border-[#a3e635] text-[#73bf2d]",
    red: "border-[#ff3b30] text-[#ff4d4f]",
  };

  return (
    <div className={`rounded-[18px] border bg-white px-6 py-4 ${toneClasses[tone]}`}>
      <p className="text-[18px] text-[#111827]">{label}</p>
      <p className="mt-2 text-5xl font-bold">{value}</p>
    </div>
  );
}

function ImprovementCard({ item }) {
  return (
    <article className="rounded-[24px] border border-[#d7deea] bg-white px-5 py-5 shadow-[0_12px_24px_rgba(18,52,115,0.04)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#2f73c9]">
          <TopicIcon kind={item.icon} className="h-12 w-12" />
        </div>
        <div className="flex-1">
          <h3 className="text-[22px] font-bold text-[#111827]">{item.title}</h3>
          <p className="mt-2 text-lg text-[#111827]">{item.description}</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="h-4 flex-1 rounded-full bg-[#d7d7d9]">
              <div
                className="h-full rounded-full bg-[#2f73c9]"
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <span className="text-2xl text-[#111827]">{item.progress}%</span>
          </div>
          <button
            type="button"
            className="mt-5 rounded-lg border border-[#2f73c9] px-4 py-2 text-[16px] font-semibold text-[#0f4fae]"
          >
            Latihan topik ini
          </button>
        </div>
      </div>
    </article>
  );
}

export default function InsightsPage() {
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
      const payload = await fetchInsightsData(session.access_token);
      setData(payload);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error ? fetchError.message : "Gagal mengambil data insights.",
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
      {(user) => {
        if (loading) {
          return <PageLoadingState title="Memuat insight belajarmu..." />;
        }

        if (error) {
          return <PageErrorState message={error} onRetry={loadData} />;
        }

        return (
          <div className="space-y-8">
            <section>
              <h1 className="text-[44px] font-bold tracking-tight text-[#111827]">
                Learning Insights!
              </h1>
              <p className="mt-2 text-[18px] leading-8 text-[#111827]">
                Analisis kemajuan belajarmu yang didukung AI dan rekomendasi yang
                dipersonalisasi.
              </p>
            </section>

            <section className="rounded-[24px] border border-[#c6d1e3] bg-[#eaf3ff] px-6 py-6">
              <p className="text-[18px] font-semibold text-[#0f4fae]">
                ✨ AI Analysis
              </p>
              <h2 className="mt-2 text-[20px] font-bold text-[#111827]">
                Overall Performance
              </h2>
              <p className="text-[18px] text-[#111827]">
                Berdasarkan latihan dan kegiatanmu sekarang.
              </p>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {data.summary.map((item) => (
                  <SummaryBox key={item.label} {...item} />
                ))}
              </div>

              <div className="mt-7 rounded-[20px] border border-[#0f62fe] bg-white px-6 py-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#dbeafe]">
                    <TopicIcon kind="spark" className="h-16 w-16" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827]">
                      {data.recommendation_title}
                    </h3>
                    <p className="mt-1 text-[18px] leading-8 text-[#222]">
                      {data.recommendation_text}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[40px] font-bold tracking-tight text-[#111827]">
                Area untuk perbaikan
              </h2>
              <div className="mt-5 space-y-5">
                {data.improvement_areas.map((item) => (
                  <ImprovementCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section className="rounded-[24px] bg-[#f5f7fb] px-6 py-6">
              <h2 className="text-[40px] font-bold tracking-tight text-[#111827]">
                Personalized learning plan
              </h2>
              <p className="mt-2 text-lg text-[#111827]">
                Jalur yang direkomendasikan AI untuk {user.name}
              </p>
              <div className="mt-6 space-y-4">
                {data.learning_plan.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2f73c9] text-xl font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#111827]">
                        {item.title}
                      </h3>
                      <p className="text-[18px] leading-8 text-[#222]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      }}
    </AppShell>
  );
}
