"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  loginUser,
  registerUser,
  storeAuthSession,
} from "@/lib/auth";

const AUTH_CONTENT = {
  login: {
    title: "Selamat Datang Kembali!",
    subtitle:
      "Lanjutkan perjalanan belajarmu dan kuasai Algoritma & Struktur Data.",
    submitLabel: "Masuk",
    footerPrompt: "Tidak punya akun?",
    footerLinkLabel: "Daftar",
    footerHref: "/daftar",
    successMessage: "Login berhasil. Mengarahkan ke dashboard...",
  },
  register: {
    title: "Buat Akun Baru",
    subtitle:
      "Mulai perjalanan belajarmu hari ini dan susun progres yang konsisten.",
    submitLabel: "Daftar",
    footerPrompt: "Sudah punya akun?",
    footerLinkLabel: "Masuk",
    footerHref: "/login",
    successMessage: "Pendaftaran berhasil. Silakan masuk dengan akun barumu.",
  },
};

function getInitialForm(mode, searchParams) {
  return {
    name: "",
    email: searchParams.get("email") ?? "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  };
}

export default function AuthPage({ mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState(() => getInitialForm(mode, searchParams));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    mode === "login" && searchParams.get("registered") === "1"
      ? "Pendaftaran berhasil. Silakan masuk menggunakan akun yang baru dibuat."
      : "",
  );

  const content = AUTH_CONTENT[mode];

  useEffect(() => {
    setForm(getInitialForm(mode, searchParams));

    if (mode === "login" && searchParams.get("registered") === "1") {
      setSuccessMessage(
        "Pendaftaran berhasil. Silakan masuk menggunakan akun yang baru dibuat.",
      );
    }
  }, [mode, searchParams]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi harus sama.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });

        storeAuthSession(response, form.rememberMe);
        setSuccessMessage(content.successMessage);
        router.push("/dashboard");
        return;
      }

      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccessMessage(content.successMessage);
      router.push(`/login?registered=1&email=${encodeURIComponent(form.email)}`);
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
              Pahami konsep, coba latihan, dan kuasai algoritma langkah demi
              langkah. Masuk untuk mulai belajar sekarang.
            </p>
          </div>
        </section>

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
              {mode === "register" ? (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    Nama Lengkap
                  </span>
                  <input
                    className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    required
                  />
                </label>
              ) : null}

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[color:var(--foreground)]">
                  Email
                </span>
                <input
                  className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[color:var(--foreground)]">
                  Kata Sandi
                </span>
                <input
                  className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 8 karakter"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                />
              </label>

              {mode === "register" ? (
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    Konfirmasi Kata Sandi
                  </span>
                  <input
                    className="auth-input h-14 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-base transition"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Ulangi kata sandi"
                    autoComplete="new-password"
                    required
                  />
                </label>
              ) : null}

              <div className="flex flex-col gap-3 text-sm font-medium text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                {mode === "login" ? (
                  <div className="space-y-1">
                    <label className="flex items-center gap-3 text-[color:var(--foreground)]">
                      <input
                        className="auth-checkbox h-4 w-4 rounded border border-[color:var(--border)]"
                        type="checkbox"
                        name="rememberMe"
                        checked={form.rememberMe}
                        onChange={handleInputChange}
                      />
                      <span>Ingat Saya</span>
                    </label>
                    <p className="text-xs text-[color:var(--text-muted)]">
                      Session tersimpan 7 hari jika dicentang, atau 12 jam jika tidak.
                    </p>
                  </div>
                ) : (
                  <span className="text-sm text-[color:var(--text-muted)]">
                    Gunakan minimal 8 karakter dan kombinasikan huruf serta
                    angka agar lebih aman.
                  </span>
                )}
                {mode === "login" ? (
                  <Link
                    href="/lupa-kata-sandi"
                    className="text-sm text-[color:var(--primary)] transition hover:text-[color:var(--primary-strong)]"
                  >
                    Lupa kata sandi?
                  </Link>
                ) : (
                  <span className="text-sm text-[color:var(--text-muted)]">
                    Pastikan email yang dipakai aktif.
                  </span>
                )}
              </div>

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

              <button
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-6 text-lg font-semibold text-white transition hover:bg-[color:var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : content.submitLabel}
              </button>

              <p className="text-sm font-medium text-[color:var(--foreground)]">
                {content.footerPrompt}{" "}
                <Link
                  href={content.footerHref}
                  className="text-[color:var(--primary)] transition hover:text-[color:var(--primary-strong)]"
                >
                  {content.footerLinkLabel}
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
