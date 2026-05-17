'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, clearSession } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    setUser(session.user);
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Beranda', exact: true },
    { href: '/dashboard/topik', label: 'Topik', exact: false },
    { href: '/dashboard/rekomendasi', label: 'Rekomendasi', exact: false },
    { href: '/dashboard/progress', label: 'Progress', exact: false },
  ];

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top navbar ── */}
      <nav className="bg-gray-900 text-white px-4 sm:px-6 h-14 flex items-center sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm select-none">
            A
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-bold text-sm">Algoria</div>
            <div className="text-xs text-gray-400">Teman Belajar Algoritma &amp; Struktur Data</div>
          </div>
          <div className="leading-tight sm:hidden">
            <div className="font-bold text-sm">Algoria</div>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-6 ml-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item) ? 'text-blue-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleLogout}
            title="Keluar"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center text-sm font-bold transition-colors"
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-1.5 rounded hover:bg-gray-700 transition-colors"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-transform origin-center ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-opacity ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-transform origin-center ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 sticky top-14 z-40 border-b border-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-5 py-3 text-sm font-medium border-b border-gray-700 last:border-b-0 transition-colors ${
                isActive(item)
                  ? 'text-blue-400 bg-gray-700'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
