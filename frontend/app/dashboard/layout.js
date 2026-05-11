'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, clearSession } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    setUser(session.user);
  }, [router]);

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
      <nav className="bg-gray-900 text-white px-6 h-14 flex items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm select-none">
            A
          </div>
          <div className="leading-tight">
            <div className="font-bold text-sm">Algoria</div>
            <div className="text-xs text-gray-400">Teman Belajar Algoritma &amp; Struktur Data</div>
          </div>
        </div>

        <div className="flex gap-7 ml-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item)
                  ? 'text-blue-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto">
          <button
            onClick={handleLogout}
            title="Keluar"
            className="w-9 h-9 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center text-sm font-bold transition-colors"
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </button>
        </div>
      </nav>

      {children}
    </div>
  );
}
