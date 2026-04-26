"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/app/app-shell";
import { PageErrorState, PageLoadingState } from "@/components/app/page-state";
import {
  LinkedListCardVisual,
  LinkedListLessonVisual,
  QueueCardVisual,
  QueueLessonVisual,
  StackCardVisual,
  StackLessonVisual,
  TopicIcon,
} from "@/components/app/topic-visuals";
import {
  ApiError,
  fetchTopicLearningData,
  generateTopicContent,
  submitTopicExerciseAnswer,
  trackTopicStep,
} from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

function StepBadge({ step, active, completed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-[#2f73c9] bg-[#eaf3ff] text-[#0f4fae]"
          : completed
            ? "border-[#bde3c1] bg-[#f0fff4] text-[#15803d]"
            : "border-[#d7deea] bg-white text-[#344054]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em]">
        Step {step.step_order}
      </p>
      <p className="mt-1 text-base font-bold">{step.title}</p>
      <p className="mt-1 text-sm leading-6">{step.description}</p>
    </button>
  );
}

function AdaptiveBadge({ weaknessLevel }) {
  const toneMap = {
    low: "bg-[#edfdf3] text-[#027a48]",
    medium: "bg-[#fff7e6] text-[#b54708]",
    high: "bg-[#fff1f3] text-[#c01048]",
  };

  return (
    <span className={`rounded-full px-4 py-1 text-sm font-semibold ${toneMap[weaknessLevel] ?? toneMap.medium}`}>
      Adaptive mode: {weaknessLevel}
    </span>
  );
}

function parseMaterialContent(rawContent) {
  const lines = rawContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const intro = [];
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace(/^##\s+/, ""),
        paragraphs: [],
        bullets: [],
      };
      continue;
    }

    if (line.startsWith("- ")) {
      if (currentSection) {
        currentSection.bullets.push(line.replace(/^-+\s+/, ""));
      } else {
        intro.push(line.replace(/^-+\s+/, ""));
      }
      continue;
    }

    if (currentSection) {
      currentSection.paragraphs.push(line);
    } else {
      intro.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { intro, sections };
}

function GenericTopicFigure({ topicIcon, title }) {
  return (
    <div className="rounded-[24px] border border-[#d9e2f0] bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
          <TopicIcon kind={topicIcon} className="h-10 w-10" />
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
            Visual ringkas
          </p>
          <p className="mt-1 text-[20px] font-bold text-[#111827]">{title}</p>
        </div>
      </div>
    </div>
  );
}

function MaterialFigure({ topicIcon, title, index }) {
  if (topicIcon === "linked-list" && index === 0) {
    return <LinkedListLessonVisual />;
  }

  if (topicIcon === "stack" && index === 0) {
    return <StackLessonVisual />;
  }

  if (topicIcon === "queue" && index === 0) {
    return <QueueLessonVisual />;
  }

  return <GenericTopicFigure topicIcon={topicIcon} title={title} />;
}

function MaterialStep({ materials, topicIcon }) {
  return (
    <div className="space-y-5">
      {materials.map((item, index) => {
        const parsed = parseMaterialContent(item.content);

        return (
        <article
          key={item.title}
          className="overflow-hidden rounded-[28px] border border-[#d7deea] bg-white shadow-[0_12px_24px_rgba(18,52,115,0.04)]"
        >
          <div className="px-7 pt-7">
            <div className="overflow-hidden rounded-[24px] border border-[#dfe7f2] bg-[#f8fbff]">
              <MaterialFigure topicIcon={topicIcon} title={item.title} index={index} />
            </div>
          </div>

          <div className="border-b border-[#e8edf5] bg-[linear-gradient(180deg,#fbfcff_0%,#f5f8fd_100%)] px-7 py-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f73c9]">
              Materi
            </p>
            <h3 className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-[#111827]">
              {item.title}
            </h3>
            {item.generated_by_llm ? (
              <p className="mt-3 text-sm font-semibold text-[#7a55ec]">
                Konten ini diperkaya secara dinamis dengan AI.
              </p>
            ) : null}
          </div>

          <div className="space-y-6 px-7 py-7">
            {parsed.intro.length > 0 ? (
              <div className="rounded-[22px] bg-[#f8fafc] px-5 py-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Pengantar
                </p>
                <div className="mt-3 space-y-3 text-[17px] leading-8 text-[#475467]">
                  {parsed.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {parsed.sections.length > 0 ? (
              parsed.sections.map((section) => (
                <section key={section.heading} className="rounded-[24px] border border-[#e7edf5] bg-white px-5 py-5">
                  <h4 className="text-[24px] font-bold tracking-[-0.02em] text-[#111827]">
                    {section.heading}
                  </h4>
                  <div className="mt-3 space-y-3 text-[17px] leading-8 text-[#475467]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-[16px] leading-7 text-[#344054]">
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f73c9]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))
            ) : (
              <section className="rounded-[24px] border border-[#e7edf5] bg-white px-5 py-5">
                <div className="space-y-3 text-[17px] leading-8 text-[#475467]">
                  <p>{item.content}</p>
                </div>
              </section>
            )}
          </div>
        </article>
        );
      })}
    </div>
  );
}

function ExampleStep({ examples }) {
  return (
    <div className="space-y-5">
      {examples.map((item) => (
        <article
          key={item.title}
          className="rounded-[24px] border border-[#d7deea] bg-white px-6 py-6 shadow-[0_12px_24px_rgba(18,52,115,0.04)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-bold text-[#111827]">{item.title}</h3>
              <p className="mt-3 text-lg leading-8 text-[#475467]">{item.description}</p>
            </div>
            {item.generated_by_llm ? (
              <span className="rounded-full bg-[#f3efff] px-4 py-1 text-sm font-semibold text-[#7a55ec]">
                AI
              </span>
            ) : null}
          </div>
          <pre className="mt-5 overflow-x-auto rounded-[20px] bg-[#111827] px-5 py-4 text-sm leading-7 text-[#d1e9ff]">
            <code>{item.code}</code>
          </pre>
        </article>
      ))}
    </div>
  );
}

function ExerciseCard({
  exercise,
  answer,
  onChange,
  onSubmit,
  isSubmitting,
  submission,
}) {
  const feedback = submission ?? (exercise.latest_feedback
    ? {
        feedback: exercise.latest_feedback,
        score: exercise.latest_score,
        is_correct: exercise.latest_is_correct,
        explanation: exercise.explanation,
      }
    : null);

  return (
    <article className="rounded-[24px] border border-[#d7deea] bg-white px-6 py-6 shadow-[0_12px_24px_rgba(18,52,115,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-bold text-[#111827]">
            Latihan #{exercise.exercise_id}
          </h3>
          <p className="mt-2 text-lg leading-8 text-[#101828]">
            {exercise.question}
          </p>
        </div>
        <span className="rounded-full bg-[#eef5ff] px-4 py-1 text-sm font-semibold text-[#2f73c9]">
          {exercise.difficulty_level || "Topic"}
        </span>
      </div>

      <textarea
        value={answer}
        onChange={(event) => onChange(exercise.exercise_id, event.target.value)}
        rows={5}
        placeholder="Tulis jawabanmu di sini..."
        className="mt-5 w-full rounded-[20px] border border-[#d0d5dd] px-4 py-4 text-base text-[#101828] outline-none transition focus:border-[#2f73c9] focus:ring-4 focus:ring-[#dbeafe]"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onSubmit(exercise.exercise_id)}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#2f73c9] px-5 text-sm font-semibold text-white transition hover:bg-[#1f5ba6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Memeriksa..." : "Kirim jawaban"}
        </button>
        {exercise.generated_by_llm ? (
          <span className="rounded-full bg-[#f3efff] px-4 py-1 text-sm font-semibold text-[#7a55ec]">
            Soal AI
          </span>
        ) : null}
      </div>

      {feedback ? (
        <div
          className={`mt-5 rounded-[20px] border px-5 py-4 ${
            feedback.is_correct
              ? "border-[#b7e3c5] bg-[#f0fff4]"
              : "border-[#ffd6d6] bg-[#fff5f5]"
          }`}
        >
          <p className="text-base font-semibold text-[#111827]">
            {feedback.is_correct ? "Feedback jawaban" : "Perlu perbaikan"}
          </p>
          <p className="mt-2 text-base leading-7 text-[#344054]">
            {feedback.feedback}
          </p>
          {typeof feedback.score === "number" ? (
            <p className="mt-3 text-sm font-semibold text-[#475467]">
              Skor: {feedback.score}%
            </p>
          ) : null}
          {feedback.explanation ? (
            <div className="mt-4 rounded-2xl bg-white/80 px-4 py-4">
              <p className="text-sm font-semibold text-[#111827]">
                Pembahasan latihan
              </p>
              <p className="mt-2 text-sm leading-7 text-[#475467]">
                {feedback.explanation}
              </p>
            </div>
          ) : null}
          {feedback.recommended_review ? (
            <p className="mt-3 text-sm text-[#475467]">
              Saran adaptif: {feedback.recommended_review}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function SummaryStep({ summary }) {
  return (
    <article className="rounded-[24px] border border-[#d7deea] bg-white px-6 py-6 shadow-[0_12px_24px_rgba(18,52,115,0.04)]">
      <h3 className="text-[24px] font-bold text-[#111827]">Ringkasan Materi</h3>
      <p className="mt-4 text-lg leading-8 text-[#475467]">{summary}</p>
    </article>
  );
}

function resolveInitialStep(payload) {
  const firstIncomplete = payload.guided_flow.find(
    (step) => !payload.completed_steps.includes(step.step_type),
  );

  return firstIncomplete?.step_type ?? payload.guided_flow[0]?.step_type ?? "material";
}

export default function TopicLearningPage() {
  const params = useParams();
  const router = useRouter();
  const session = useAuthSession();
  const topicSlug = params.slug;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState("material");
  const [answers, setAnswers] = useState({});
  const [submissionState, setSubmissionState] = useState({});

  const loadData = useCallback(async () => {
    if (!session?.access_token || !topicSlug) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await fetchTopicLearningData(session.access_token, topicSlug);
      setData(payload);
      setCurrentStep(resolveInitialStep(payload));
      setAnswers(
        Object.fromEntries(
          payload.exercises.map((exercise) => [
            exercise.exercise_id,
            exercise.latest_answer ?? "",
          ]),
        ),
      );
    } catch (fetchError) {
      if (fetchError instanceof ApiError && fetchError.status === 401) {
        clearStoredAuth();
        router.replace("/login");
        return;
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal memuat detail topik.",
      );
    } finally {
      setLoading(false);
    }
  }, [router, session?.access_token, topicSlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (
      !data ||
      !session?.access_token ||
      !topicSlug ||
      currentStep === "exercise" ||
      data.completed_steps.includes(currentStep)
    ) {
      return;
    }

    let cancelled = false;

    async function syncTrackedStep() {
      try {
        const payload = await trackTopicStep(
          session.access_token,
          topicSlug,
          currentStep,
        );

        if (cancelled) {
          return;
        }

        setData((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            topic: {
              ...current.topic,
              progress: payload.updated_progress,
            },
            completed_steps: payload.completed_steps,
            study_minutes: payload.study_minutes,
          };
        });
      } catch (trackError) {
        if (trackError instanceof ApiError && trackError.status === 401) {
          clearStoredAuth();
          router.replace("/login");
        }
      }
    }

    syncTrackedStep();

    return () => {
      cancelled = true;
    };
  }, [currentStep, data, router, session?.access_token, topicSlug]);

  const currentStepIndex = data
    ? data.guided_flow.findIndex((step) => step.step_type === currentStep)
    : 0;

  function goToAdjacentStep(offset) {
    if (!data) {
      return;
    }

    const nextStep = data.guided_flow[currentStepIndex + offset];
    if (nextStep) {
      setCurrentStep(nextStep.step_type);
    }
  }

  async function handleGenerateContent() {
    if (!session?.access_token || !topicSlug) {
      return;
    }

    setGenerating(true);
    try {
      const payload = await generateTopicContent(session.access_token, topicSlug);
      setData(payload.topic_learning);
      setCurrentStep(resolveInitialStep(payload.topic_learning));
      setAnswers(
        Object.fromEntries(
          payload.topic_learning.exercises.map((exercise) => [
            exercise.exercise_id,
            exercise.latest_answer ?? "",
          ]),
        ),
      );
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal generate konten AI.",
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleAnswerChange(exerciseId, value) {
    setAnswers((current) => ({
      ...current,
      [exerciseId]: value,
    }));
  }

  async function handleSubmitAnswer(exerciseId) {
    const answerText = answers[exerciseId]?.trim();
    if (!answerText || !session?.access_token || !topicSlug) {
      return;
    }

    setSubmissionState((current) => ({
      ...current,
      [exerciseId]: { loading: true },
    }));

    try {
      const payload = await submitTopicExerciseAnswer(
        session.access_token,
        topicSlug,
        exerciseId,
        answerText,
      );
      setSubmissionState((current) => ({
        ...current,
        [exerciseId]: { loading: false, result: payload },
      }));
      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          topic: {
            ...current.topic,
            progress: payload.updated_progress,
          },
          completed_steps: payload.completed_steps,
          study_minutes: payload.study_minutes,
          adaptive_guidance: {
            ...current.adaptive_guidance,
            weakness_level: payload.updated_weakness_level,
            recommended_next_step: payload.completed_steps.includes("summary")
              ? "Ulangi latihan yang masih lemah"
              : payload.completed_steps.includes("exercise")
                ? "Baca Ringkasan"
                : current.adaptive_guidance.recommended_next_step,
          },
          exercises: current.exercises.map((exercise) =>
            exercise.exercise_id === exerciseId
              ? {
                  ...exercise,
                  latest_answer: answerText,
                  latest_feedback: payload.feedback,
                  latest_score: payload.score,
                  latest_is_correct: payload.is_correct,
                  explanation: payload.explanation,
                }
              : exercise,
          ),
        };
      });
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Gagal mengirim jawaban.";
      setSubmissionState((current) => ({
        ...current,
        [exerciseId]: {
          loading: false,
          result: {
            feedback: message,
            is_correct: false,
          },
        },
      }));
    }
  }

  function renderCurrentStep() {
    if (!data) {
      return null;
    }

    if (currentStep === "material") {
      return <MaterialStep materials={data.materials} topicIcon={data.topic.icon} />;
    }

    if (currentStep === "example") {
      return <ExampleStep examples={data.examples} />;
    }

    if (currentStep === "exercise") {
      return (
        <div className="space-y-5">
          {data.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.exercise_id}
              exercise={exercise}
              answer={answers[exercise.exercise_id] ?? ""}
              onChange={handleAnswerChange}
              onSubmit={handleSubmitAnswer}
              isSubmitting={Boolean(submissionState[exercise.exercise_id]?.loading)}
              submission={submissionState[exercise.exercise_id]?.result}
            />
          ))}
        </div>
      );
    }

    return <SummaryStep summary={data.summary} />;
  }

  return (
    <AppShell
      hero={(user) => (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/topik" className="text-sm font-semibold text-white/70 hover:text-white">
              ← Kembali ke semua topik
            </Link>
            <h1 className="mt-4 text-[42px] font-bold tracking-tight">
              {data?.topic?.title || "Belajar Topik"}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-white/80">
              {data?.topic?.description ||
                `Lanjutkan belajar, ${user.name}. Ikuti alur terpandu dari materi hingga ringkasan.`}
            </p>
          </div>
          {data ? (
            <div className="rounded-[22px] border border-white/12 bg-white/8 px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Progress
              </p>
              <p className="mt-2 text-4xl font-bold">{data.topic.progress}%</p>
              <p className="mt-2 text-sm text-white/75">
                {data.study_minutes} menit belajar tercatat
              </p>
            </div>
          ) : null}
        </div>
      )}
    >
      {() => {
        if (loading) {
          return <PageLoadingState title="Memuat alur belajar topik..." />;
        }

        if (error && !data) {
          return <PageErrorState message={error} onRetry={loadData} />;
        }

        return (
          <div className="space-y-8">
            {error ? <PageErrorState message={error} onRetry={loadData} /> : null}

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-[26px] border border-[#d7deea] bg-white px-6 py-6 shadow-[0_12px_24px_rgba(18,52,115,0.04)]">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-18 w-18 items-center justify-center rounded-[20px] bg-[#eef5ff]">
                      <TopicIcon kind={data.topic.icon} className="h-12 w-12" />
                    </div>
                    <div>
                      <h2 className="text-[24px] font-bold text-[#111827]">
                        Guided Learning Flow
                      </h2>
                      <p className="mt-1 text-base text-[#667085]">
                        Ikuti urutan belajar: materi → contoh → latihan → ringkasan.
                      </p>
                    </div>
                  </div>
                  <AdaptiveBadge
                    weaknessLevel={data.adaptive_guidance.weakness_level}
                  />
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {data.guided_flow.map((step) => (
                    <StepBadge
                      key={step.step_type}
                      step={step}
                      active={currentStep === step.step_type}
                      completed={data.completed_steps.includes(step.step_type)}
                      onClick={() => setCurrentStep(step.step_type)}
                    />
                  ))}
                </div>
              </article>

              <article className="rounded-[26px] border border-[#d7deea] bg-white px-6 py-6 shadow-[0_12px_24px_rgba(18,52,115,0.04)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2f73c9]">
                  Adaptive Learning
                </p>
                <h2 className="mt-3 text-[24px] font-bold text-[#111827]">
                  Fokus belajarmu saat ini
                </h2>
                <p className="mt-3 text-base leading-8 text-[#475467]">
                  {data.adaptive_guidance.focus_message}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#344054]">
                  Langkah berikut yang disarankan:
                </p>
                <p className="mt-1 text-base text-[#111827]">
                  {data.adaptive_guidance.recommended_next_step}
                </p>
                <button
                  type="button"
                  onClick={handleGenerateContent}
                  disabled={generating}
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#7a55ec] px-5 text-sm font-semibold text-white transition hover:bg-[#6542d8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {generating ? "Generating..." : "Generate konten dengan AI"}
                </button>
                <p className="mt-3 text-sm text-[#667085]">
                  {data.llm_enabled
                    ? "AI siap memperbarui materi, contoh, dan latihan sesuai kebutuhanmu."
                    : "AI belum aktif di environment ini, jadi sistem akan memakai konten fallback."}
                </p>
              </article>
            </section>

            <section className="space-y-6">
              {renderCurrentStep()}
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => goToAdjacentStep(-1)}
                disabled={currentStepIndex <= 0}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#d0d5dd] bg-white px-5 text-sm font-semibold text-[#344054] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Langkah sebelumnya
              </button>
              <button
                type="button"
                onClick={() => goToAdjacentStep(1)}
                disabled={currentStepIndex >= data.guided_flow.length - 1}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f73c9] px-5 text-sm font-semibold text-white transition hover:bg-[#1f5ba6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Langkah berikutnya
              </button>
            </section>
          </div>
        );
      }}
    </AppShell>
  );
}
