"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import {
  API_ORIGIN,
  ApiError,
  fetchTutorialCatalog,
  fetchTutorialTopicDetail,
} from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

function PdfViewer({ pdfUrl, title }) {
  if (!pdfUrl) {
    return (
      <div className="rounded-[24px] border border-[#d8dee9] bg-white p-6 text-sm text-[#667085]">
        Pilih materi PDF dari bab di sebelah kiri untuk melihat slide dosen langsung di halaman ini.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#d8dee9] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#e7ecf3] px-5 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f73c9]">
          PDF Dosen
        </p>
        <h3 className="mt-2 text-lg font-bold text-[#101828]">{title}</h3>
      </div>
      <iframe
        title={title}
        src={pdfUrl.startsWith("http") ? pdfUrl : `${API_ORIGIN}${pdfUrl}`}
        className="h-[680px] w-full bg-white"
      />
    </div>
  );
}

function TopicSelector({ topics, activeSlug, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {topics.map((topic) => {
        const active = topic.slug === activeSlug;

        return (
          <button
            key={topic.slug}
            type="button"
            onClick={() => onSelect(topic.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-[#1f7ae0] text-white shadow-[0_10px_24px_rgba(31,122,224,0.22)]"
                : "bg-white text-[#344054] ring-1 ring-[#d0d8e5] hover:bg-[#f7faff]"
            }`}
          >
            {topic.week} · {topic.title}
          </button>
        );
      })}
    </div>
  );
}

function Sidebar({ topic, activeChapterSlug, onJump, onOpenPdf }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-[24px] border border-[#d9e2ef] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
          Urutan Belajar
        </p>
        <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f73c9]">
          {topic.week}
        </p>
        <h2 className="mt-2 text-[22px] font-bold tracking-[-0.02em] text-[#101828]">
          {topic.title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#667085]">{topic.description}</p>
      </div>

      <div className="rounded-[24px] border border-[#d9e2ef] bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
        <div className="space-y-3">
          {topic.chapters.map((chapter, index) => {
            const active = chapter.slug === activeChapterSlug;

            return (
              <button
                key={chapter.slug}
                type="button"
                onClick={() => onJump(chapter.slug)}
                className={`w-full rounded-[18px] px-4 py-4 text-left transition ${
                  active
                    ? "bg-[#eff6ff] ring-1 ring-[#9fc5ff]"
                    : "bg-[#fbfcfe] ring-1 ring-[#e6ebf2] hover:bg-[#f5f8fc]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2f73c9]">
                  Bab {index + 1}
                </p>
                <p className="mt-2 text-[15px] font-semibold leading-6 text-[#101828]">
                  {chapter.title}
                </p>
                {chapter.resources[0] ? (
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenPdf(chapter.resources[0]);
                    }}
                    className="mt-3 inline-block cursor-pointer text-sm font-semibold text-[#1f7ae0] hover:text-[#125fb7]"
                  >
                    Lihat PDF bab →
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function ChapterCard({ chapter, index, onOpenPdf }) {
  return (
    <article
      id={`chapter-${chapter.slug}`}
      className="rounded-[28px] border border-[#dce4ef] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
    >
      <div className="border-b border-[#edf1f6] bg-[linear-gradient(180deg,#fdfefe_0%,#f5f8fd_100%)] px-7 py-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f73c9]">
          Bab {index + 1}
        </p>
        <h3 className="mt-2 text-[30px] font-bold tracking-[-0.03em] text-[#101828]">
          {chapter.title}
        </h3>
        <p className="mt-3 max-w-3xl text-[16px] leading-8 text-[#667085]">
          {chapter.summary}
        </p>
      </div>

      <div className="space-y-7 px-7 py-7">
        {chapter.key_points.length > 0 ? (
          <section className="rounded-[22px] bg-[#f7fbff] px-5 py-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
              Yang Dipelajari
            </p>
            <ul className="mt-4 space-y-3">
              {chapter.key_points.map((point) => (
                <li key={point} className="flex gap-3 text-[16px] leading-7 text-[#344054]">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1f7ae0]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {chapter.concepts.length > 0 ? (
          <section>
            <h4 className="text-[22px] font-bold tracking-[-0.02em] text-[#101828]">
              Konsep penting
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {chapter.concepts.map((concept) => (
                <div
                  key={`${chapter.slug}-${concept.name}`}
                  className="rounded-[20px] border border-[#e7edf5] bg-white px-5 py-5"
                >
                  <div className="flex items-center gap-3">
                    <h5 className="text-lg font-bold text-[#101828]">{concept.name}</h5>
                    <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#2f73c9]">
                      {concept.importance}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#667085]">
                    {concept.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {chapter.code_examples.length > 0 ? (
          <section>
            <h4 className="text-[22px] font-bold tracking-[-0.02em] text-[#101828]">
              Contoh kode
            </h4>
            <div className="mt-4 space-y-4">
              {chapter.code_examples.map((example) => (
                <div
                  key={`${chapter.slug}-${example.title}-${example.language}-${example.code.slice(0, 48)}`}
                  className="overflow-hidden rounded-[22px] border border-[#dae3ef] bg-[#0f172a]"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-white">
                    <p className="font-semibold">{example.title}</p>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                      {example.language}
                    </span>
                  </div>
                  <pre className="overflow-x-auto px-5 py-5 text-[13px] leading-6 text-[#dbe8ff]">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {chapter.exercises.length > 0 ? (
          <section>
            <h4 className="text-[22px] font-bold tracking-[-0.02em] text-[#101828]">
              Latihan dari materi
            </h4>
            <div className="mt-4 space-y-4">
              {chapter.exercises.map((exercise) => (
                <div
                  key={`${chapter.slug}-${exercise.statement}`}
                  className="rounded-[22px] border border-[#eceff4] bg-[#fafbfd] px-5 py-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#fff1cc] px-3 py-1 text-xs font-semibold text-[#946200]">
                      {exercise.difficulty}
                    </span>
                    <span className="rounded-full bg-[#edf7ff] px-3 py-1 text-xs font-semibold text-[#1262b3]">
                      {exercise.type}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#475467]">
                    {exercise.statement}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h4 className="text-[22px] font-bold tracking-[-0.02em] text-[#101828]">
            Slide dosen untuk bab ini
          </h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {chapter.resources.map((resource) => (
              <button
                key={resource.file_name}
                type="button"
                onClick={() => onOpenPdf(resource)}
                className="rounded-[22px] border border-[#dde4ee] bg-white px-5 py-5 text-left transition hover:-translate-y-0.5 hover:bg-[#f9fbff] hover:shadow-[0_14px_28px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f73c9]">
                  {resource.week}
                </p>
                <h5 className="mt-2 text-[18px] font-bold text-[#101828]">
                  {resource.title}
                </h5>
                <p className="mt-3 text-sm leading-7 text-[#667085]">
                  {resource.excerpt}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#1f7ae0]">
                  Buka dan embed PDF →
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export default function MaterialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useAuthSession();
  const [catalog, setCatalog] = useState([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [topic, setTopic] = useState(null);
  const [currentChapterSlug, setCurrentChapterSlug] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topicLoading, setTopicLoading] = useState(false);
  const [error, setError] = useState("");

  const activeChapterSlug = useMemo(
    () => currentChapterSlug || topic?.chapters?.[0]?.slug || "",
    [currentChapterSlug, topic],
  );

  const loadCatalog = useCallback(async () => {
    if (!session?.access_token) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await fetchTutorialCatalog(session.access_token);
      setCatalog(payload);
      const requestedSlug = searchParams.get("topic");
      const validRequestedSlug = payload.find((item) => item.slug === requestedSlug)?.slug;
      if (payload[0]?.slug) {
        setActiveSlug((current) => current || validRequestedSlug || payload[0].slug);
      }
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal memuat katalog materi.",
      );
    } finally {
      setLoading(false);
    }
  }, [router, searchParams, session?.access_token]);

  const loadTopic = useCallback(async () => {
    if (!session?.access_token || !activeSlug) {
      return;
    }

    setTopicLoading(true);
    setError("");

    try {
      const payload = await fetchTutorialTopicDetail(session.access_token, activeSlug);
      setTopic(payload);
      const firstPdf = payload.chapters[0]?.resources?.[0] ?? null;
      setCurrentChapterSlug(payload.chapters[0]?.slug ?? "");
      setSelectedPdf(firstPdf);
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal memuat detail materi.",
      );
    } finally {
      setTopicLoading(false);
    }
  }, [activeSlug, router, session?.access_token]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadTopic();
  }, [loadTopic]);

  function handleSelectTopic(slug) {
    setActiveSlug(slug);
    setCurrentChapterSlug("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleJumpToChapter(chapterSlug) {
    setCurrentChapterSlug(chapterSlug);
    const target = document.getElementById(`chapter-${chapterSlug}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (loading) {
    return (
      <AppShell hero={() => null}>
        {() => <PageLoadingState title="Memuat katalog materi..." />}
      </AppShell>
    );
  }

  return (
    <AppShell
      hero={() => (
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7cb8ff]">
            Materi Dosen
          </p>
          <h1 className="mt-3 text-[44px] font-bold tracking-tight">
            Tutorial belajar berbasis slide dosen
          </h1>
          <p className="mt-3 max-w-4xl text-xl text-white/80">
            Alurnya dibuat seperti halaman tutorial bertahap: pilih topik, ikuti bab secara berurutan,
            lalu buka PDF dosen yang sesuai langsung di samping materi.
          </p>
        </div>
      )}
    >
      {() => {
        if (error) {
          return <PageErrorState message={error} onRetry={activeSlug ? loadTopic : loadCatalog} />;
        }

        if (topicLoading || !topic) {
          return <PageLoadingState title="Menyusun tutorial materi..." />;
        }

        return (
          <div className="space-y-8">
            <section className="rounded-[28px] border border-[#d8e2ef] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] px-6 py-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f73c9]">
                    Gaya tutorial
                  </p>
                  <h2 className="mt-2 text-[34px] font-bold tracking-[-0.03em] text-[#101828]">
                    {topic.week}: {topic.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-[17px] leading-8 text-[#667085]">
                    {topic.intro}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] bg-white px-5 py-4 ring-1 ring-[#e1e7f0]">
                    <p className="text-sm text-[#667085]">Bab</p>
                    <p className="mt-1 text-3xl font-bold text-[#101828]">
                      {topic.chapter_count}
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-white px-5 py-4 ring-1 ring-[#e1e7f0]">
                    <p className="text-sm text-[#667085]">PDF dosen</p>
                    <p className="mt-1 text-3xl font-bold text-[#101828]">
                      {topic.pdf_count}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <TopicSelector
                  topics={catalog}
                  activeSlug={activeSlug}
                  onSelect={handleSelectTopic}
                />
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_420px]">
              <div className="xl:sticky xl:top-8 xl:self-start">
                <Sidebar
                  topic={topic}
                  activeChapterSlug={activeChapterSlug}
                  onJump={handleJumpToChapter}
                  onOpenPdf={setSelectedPdf}
                />
              </div>

              <div className="space-y-6">
                {topic.chapters.map((chapter, index) => (
                  <ChapterCard
                    key={chapter.slug}
                    chapter={chapter}
                    index={index}
                    onOpenPdf={setSelectedPdf}
                  />
                ))}
              </div>

              <div className="xl:sticky xl:top-8 xl:self-start">
                <PdfViewer
                  pdfUrl={selectedPdf?.pdf_url}
                  title={selectedPdf?.title ?? "Slide dosen"}
                />
              </div>
            </div>
          </div>
        );
      }}
    </AppShell>
  );
}
