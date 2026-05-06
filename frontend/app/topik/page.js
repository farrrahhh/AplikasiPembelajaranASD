"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import { TopicIcon } from "@/components/app/topic-visuals";
import { ApiError, fetchTutorialCatalog } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

const TOPIC_TONES = {
  "w01-pengantar": {
    accent: "#2f6fd0",
    iconSurface: "#e8f0ff",
    glow: "radial-gradient(circle at top left, rgba(47,111,208,0.18), transparent 58%)",
  },
  "w02-adt-sederhana": {
    accent: "#6f5ad8",
    iconSurface: "#efe9ff",
    glow: "radial-gradient(circle at top left, rgba(111,90,216,0.16), transparent 58%)",
  },
  "w03-list": {
    accent: "#447dd9",
    iconSurface: "#eaf2ff",
    glow: "radial-gradient(circle at top left, rgba(68,125,217,0.16), transparent 58%)",
  },
  "w05-mesin-karakter-kata": {
    accent: "#c57938",
    iconSurface: "#fff0df",
    glow: "radial-gradient(circle at top left, rgba(197,121,56,0.16), transparent 58%)",
  },
  "w06-stack-queue": {
    accent: "#8a56d8",
    iconSurface: "#f1e9ff",
    glow: "radial-gradient(circle at top left, rgba(138,86,216,0.16), transparent 58%)",
  },
  "w07-set-map": {
    accent: "#b4861f",
    iconSurface: "#fff5d7",
    glow: "radial-gradient(circle at top left, rgba(180,134,31,0.16), transparent 58%)",
  },
  "w09-w10-list-linier": {
    accent: "#2f73c9",
    iconSurface: "#e6f2ff",
    glow: "radial-gradient(circle at top left, rgba(47,115,201,0.16), transparent 58%)",
  },
  "w13-binary-tree": {
    accent: "#4e9253",
    iconSurface: "#eaf5ea",
    glow: "radial-gradient(circle at top left, rgba(78,146,83,0.16), transparent 58%)",
  },
  "w14-w15-aplikasi": {
    accent: "#3c7ca2",
    iconSurface: "#e8f3f9",
    glow: "radial-gradient(circle at top left, rgba(60,124,162,0.16), transparent 58%)",
  },
};

function TopicCard({ topic, index }) {
  const tone = TOPIC_TONES[topic.slug] ?? TOPIC_TONES["w01-pengantar"];

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
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#d7dfeb] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#344054]">
              {topic.week}
            </span>
            {index === 0 ? (
              <span className="rounded-full border border-[#d8deea] bg-[#111827] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                Mulai sini
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: tone.accent }}
          >
            Urutan materi dosen
          </p>
          <h3 className="mt-3 text-[30px] font-bold tracking-[-0.025em] text-[#111827]">
            {topic.title}
          </h3>
          <p className="mt-3 min-h-24 text-[19px] leading-9 text-[#566074]">
            {topic.description}
          </p>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#edf1f6] bg-[#fbfcfd] px-5 py-5">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#98a2b3]">
                Struktur materi
              </p>
              <p className="mt-1 text-[28px] font-bold text-[#111827]">
                {topic.chapter_count} bab
              </p>
            </div>
            <div className="text-right text-[15px] leading-6 text-[#667085]">
              <p>{topic.pdf_count} PDF dosen</p>
              <p>tutorial berurutan</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-[#d9deea]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, ((index + 1) / 9) * 100)}%`,
                backgroundColor: tone.accent,
              }}
            />
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <div className="text-[15px] leading-6 text-[#667085]">
            <p className="font-medium text-[#111827]">Ikuti sesuai minggu kuliah</p>
            <p className="mt-1">
              Buka materi ini untuk melihat bab-bab dan slide dosen yang sudah diurutkan.
            </p>
          </div>
          <Link
            href={`/materi?topic=${encodeURIComponent(topic.slug)}`}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-[#d2dae6] bg-white px-5 text-[15px] font-semibold text-[#111827] transition hover:border-[#111827] hover:bg-[#111827] hover:text-white"
          >
            Buka materi
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function TopicsPage() {
  const router = useRouter();
  const session = useAuthSession();
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!session?.access_token) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await fetchTutorialCatalog(session.access_token);
      setTopics(payload);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal mengambil data topik materi dosen.",
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
          return <PageLoadingState title="Memuat topik materi dosen..." />;
        }

        if (error) {
          return <PageErrorState message={error} onRetry={loadData} />;
        }

        return (
          <div className="space-y-8">
            <section className="rounded-[32px] border border-[#e4e7ec] bg-[linear-gradient(135deg,#f8f6f1_0%,#fbfcfd_46%,#eef3ff_100%)] px-7 py-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#667085]">
                Kurikulum dosen
              </p>
              <h1 className="mt-3 text-[48px] font-bold tracking-[-0.03em] text-[#1e293b]">
                Topik sesuai urutan materi kuliah
              </h1>
              <p className="mt-3 max-w-4xl text-[18px] leading-8 text-[#475467]">
                Daftar ini mengikuti urutan minggu materi dosen: mulai dari pengantar, ADT sederhana,
                list, mesin kata, stack-queue, sampai aplikasi di akhir semester.
              </p>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              {topics.map((topic, index) => (
                <TopicCard key={topic.slug} topic={topic} index={index} />
              ))}
            </section>

            <section className="rounded-[30px] border border-[#d6dee8] bg-[#f6f8fb] px-6 py-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white">
                  <TopicIcon kind="book" className="h-9 w-9" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                    Urutan resmi
                  </p>
                  <h2 className="mt-2 text-[20px] font-bold text-[#111827]">
                    W01 → W02 → W03 → W05 → W06 → W07 → W09-W10 → W13 → W14-W15
                  </h2>
                  <p className="mt-2 text-lg leading-8 text-[#394150]">
                    Setiap kartu membuka halaman materi dengan bab berurutan dan PDF dosen yang sesuai topik tersebut.
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
