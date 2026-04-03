"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { requestPasswordReset, resetPassword } from "@/lib/auth";

const PAGE_COPY = {
  request: {
    title: "Lupa Kata Sandi",
    subtitle:
      "Masukkan email akunmu. Kami akan siapkan link reset agar kamu bisa membuat kata sandi baru.",
    submitLabel: "Kirim Link Reset",
    successFallback:
      "Permintaan reset berhasil diproses. Cek langkah berikutnya untuk mengganti kata sandi.",
  },
  reset: {
    title: "Atur Kata Sandi Baru",
    subtitle:
      "Masukkan kata sandi baru untuk akunmu, lalu gunakan kata sandi itu saat login kembali.",
    submitLabel: "Simpan Kata Sandi Baru",
    successFallback:
      "Kata sandi berhasil diperbarui. Kamu bisa login kembali sekarang.",
  },
};

function AuthSidePanel() {
  return (
    <section className="auth-left-panel relative hidden overflow-hidden px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-14 xl:py-12">
      <div className="relative mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-6 py-10">
        <div className="auth-illustration-glow absolute inset-6 rounded-full" />
        <div className="relative aspect-[4/3] w-full max-w-xl">
          <Image
            src="/illustation_login_sinup.png"
            alt="Ilustrasi belajar algoritma dan struktur data"
            fill
            priority
            className="object-contain"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </div>
      </div>

      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight">
          Teman Belajar Algoritma & Struktur Data
        </h2>
        <p className="mt-4 text-lg leading-8 text-blue-50/90">
          Kembali ke ritme belajarmu dengan aman. Atur ulang kata sandi lalu
          lanjutkan progres yang sudah kamu bangun.
        </p>
      </div>
    </section>
  );
}

export default function PasswordResetPage({ mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const content = PAGE_COPY[mode];

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const isResetMode = mode === "reset";
  const isTokenMissing = isResetMode && !token;

  const helperText = useMemo(() => {
    if (mode === "request") {
      return "Untuk development lokal, link reset akan ditampilkan langsung di halaman ini.";
    }

    return "Gunakan minimal 8 karakter agar kata sandi baru lebih aman.";
  }, [mode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "request") {
      if (!email.trim()) {
        setErrorMessage("Email harus diisi.");
        return;
      }
    }

    if (mode === "reset") {
      if (!token) {
        setErrorMessage("Token reset tidak ditemukan.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi harus sama.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "request") {
        const response = await requestPasswordReset({ email });
        setSuccessMessage(response.message || content.successFallback);
        setResetUrl(response.reset_url || "");
      } else {
        const response = await resetPassword({
          token,
          new_password: password,
        });
        setSuccessMessage(response.message || content.successFallback);
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_minmax(460px,0.98fr)]">
        <AuthSidePanel />

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="auth-card w-full max-w-xl rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 lg:hidden">
              <p className="inline-flex rounded-full bg-[color:var(--primary-soft)] px-4 py-1 text-sm font-semibold text-[color:var(--primary)]">
                ASD Learning
              </p>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {content.title}
              </h1>
              <p className="max-w-lg text-lg leading-8 text-[color:var(--text-muted)]">
                {content.subtitle}
              </p>
            </div>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              {mode === "request" ? (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    Email
                  </span>
                  <input
                    className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </label>
              ) : (
                <>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[color:var(--foreground)]">
                      Kata Sandi Baru
                    </span>
                    <input
                      className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[color:var(--foreground)]">
                      Konfirmasi Kata Sandi Baru
                    </span>
                    <input
                      className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      autoComplete="new-password"
                      required
                    />
                  </label>
                </>
              )}

              <div className="text-sm text-[color:var(--text-muted)]">
                {helperText}
              </div>

              {isTokenMissing ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Link reset tidak memiliki token yang valid. Minta link reset baru
                  dari halaman lupa kata sandi.
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[color:var(--danger)]">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-[color:var(--success)]">
                  {successMessage}
                </div>
              ) : null}

              {resetUrl ? (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-900">
                  <p className="font-semibold">Link reset untuk development</p>
                  <Link
                    href={resetUrl}
                    className="mt-2 inline-flex break-all text-[color:var(--primary)] underline underline-offset-4"
                  >
                    {resetUrl}
                  </Link>
                </div>
              ) : null}

              <button
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-6 text-lg font-semibold text-white transition hover:bg-[color:var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting || isTokenMissing}
              >
                {isSubmitting ? "Memproses..." : content.submitLabel}
              </button>

              <div className="flex flex-wrap gap-3 text-sm font-medium text-[color:var(--foreground)]">
                <Link
                  href="/login"
                  className="text-[color:var(--primary)] transition hover:text-[color:var(--primary-strong)]"
                >
                  Kembali ke login
                </Link>
                {mode === "reset" ? (
                  <Link
                    href="/lupa-kata-sandi"
                    className="text-[color:var(--primary)] transition hover:text-[color:var(--primary-strong)]"
                  >
                    Minta link reset baru
                  </Link>
                ) : null}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
