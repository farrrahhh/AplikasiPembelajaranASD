"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logoutUser } from "@/lib/api";
import { clearStoredAuth, useAuthSession } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/topik", label: "Topik" },
  { href: "/insights", label: "Insights" },
  { href: "/progress", label: "Progress" },
];

function isActivePath(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppShell({ hero = null, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.replace("/login");
    }
  }, [router, session]);

  async function handleLogout() {
    if (session?.access_token) {
      try {
        await logoutUser(session.access_token);
      } catch {
        // The client still clears local session even if the API logout call fails.
      }
    }
    clearStoredAuth();
    router.push("/login");
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#101828]">
      <header className="bg-[#1f1f22] text-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Algoria"
                width={170}
                height={48}
                priority
                className="h-11 w-auto object-contain"
              />
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <nav className="flex items-center gap-10 text-[15px] font-semibold">
                {NAV_ITEMS.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`border-b-2 pb-1 transition ${
                        active
                          ? "border-[#2f73c9] text-[#2f73c9]"
                          : "border-transparent text-white hover:text-[#b8d7ff]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/18 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
              >
                Keluar
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1f1f22]">
                {initials}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
              aria-label="Toggle navigation"
            >
              <span className="text-lg">{mobileOpen ? "×" : "☰"}</span>
            </button>
          </div>

          {mobileOpen ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 lg:hidden">
              <nav className="flex flex-col gap-4 text-sm font-semibold">
                {NAV_ITEMS.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={active ? "text-[#79b8ff]" : "text-white"}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1f1f22]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
                >
                  Keluar
                </button>
              </div>
            </div>
          ) : null}

          {hero ? <div className="pt-8 pb-10">{hero(user, session)}</div> : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {children(user, session)}
      </main>
    </div>
  );
}
