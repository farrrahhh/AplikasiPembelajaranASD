'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, clearSession } from '../lib/auth';
import { useEffect, useRef, useState } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    setUser(session.user);
  }, [router]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Beranda', exact: true },
    { href: '/dashboard/topik', label: 'Topik', exact: false },
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

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          {/* Desktop nav links */}
          <div className="hidden md:flex gap-6">
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

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-sm font-bold transition-colors"
            >
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900 truncate">{user?.name}</div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</div>
                </div>

                {/* Menu items */}
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Pengaturan Profil
                </Link>

                <div className="border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-1.5 rounded hover:bg-gray-700 transition-colors"
          >
            <span className={`block w-5 h-0.5 bg-white transition-transform origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-transform origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
          <div className="border-t border-gray-600">
            <Link
              href="/dashboard/profile"
              className="block px-5 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white border-b border-gray-700 transition-colors"
            >
              Pengaturan Profil
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-5 py-3 text-sm font-medium text-red-400 hover:bg-gray-700 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
