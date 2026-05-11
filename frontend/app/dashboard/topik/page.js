'use client';

import Link from 'next/link';

const topics = [
  {
    id: 'pengantar',
    title: 'Pengantar Algoritma dan Struktur Data',
    description:
      'Materi ini membahas dasar-dasar Algoritma dan Struktur Data, paradigma prosedural, ADT (Abstract Data Type), notasi algoritmik, dasar Bahasa C, serta modularitas program.',
    progress: 0,
    href: '/dashboard/topik/pengantar',
    available: true,
    bg: 'bg-blue-600',
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="20" height="14" rx="2" fill="white" fillOpacity="0.3" />
        <rect x="36" y="8" width="20" height="14" rx="2" fill="white" fillOpacity="0.3" />
        <rect x="22" y="30" width="20" height="14" rx="2" fill="white" fillOpacity="0.5" />
        <rect x="8" y="48" width="14" height="10" rx="2" fill="white" fillOpacity="0.25" />
        <rect x="42" y="48" width="14" height="10" rx="2" fill="white" fillOpacity="0.25" />
        <line x1="18" y1="22" x2="32" y2="30" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
        <line x1="46" y1="22" x2="32" y2="30" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
        <line x1="15" y1="44" x2="30" y2="44" stroke="white" strokeOpacity="0.4" strokeWidth="2" />
        <line x1="49" y1="44" x2="34" y2="44" stroke="white" strokeOpacity="0.4" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'adt-sederhana',
    title: 'ADT Sederhana',
    description: 'Mempelajari implementasi Abstract Data Type sederhana seperti Point, Time, dan Date.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'list',
    title: 'List',
    description: 'Struktur data List: representasi, operasi, dan implementasi dalam bahasa C.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'mesin-karakter',
    title: 'Mesin Karakter & Kata',
    description: 'Pemrosesan karakter dan kata menggunakan mesin abstrak.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'stack-queue',
    title: 'Stack & Queue',
    description: 'Implementasi Stack (LIFO) dan Queue (FIFO) dalam berbagai konteks.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'set-map',
    title: 'Set & Map',
    description: 'Struktur data Set dan Map: operasi dan aplikasinya.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'list-linier',
    title: 'List Linier',
    description: 'Linked list: singly linked, doubly linked, dan circular linked list.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'binary-tree',
    title: 'Binary Tree',
    description: 'Pohon biner: traversal, BST, dan operasi pada tree.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
  {
    id: 'aplikasi',
    title: 'Aplikasi',
    description: 'Aplikasi struktur data dalam pemecahan masalah nyata.',
    progress: 0,
    href: null,
    available: false,
    bg: 'bg-gray-400',
    icon: null,
  },
];

export default function TopikPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Topik Pembelajaran</h1>

      <div className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex"
          >
            <div
              className={`w-52 flex-shrink-0 flex items-center justify-center ${topic.bg}`}
              style={{ minHeight: '120px' }}
            >
              {topic.icon ?? (
                <span className="text-white text-opacity-40 text-4xl select-none">🔒</span>
              )}
            </div>

            <div className="flex-1 p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900">{topic.title}</h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{topic.description}</p>

                {topic.available && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">{topic.progress}%</span>
                  </div>
                )}

                {!topic.available && (
                  <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Segera hadir
                  </span>
                )}
              </div>

              <div className="flex-shrink-0">
                {topic.available && topic.href ? (
                  <Link
                    href={topic.href}
                    className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    {topic.progress > 0 ? 'Lanjutkan' : 'Mulai'}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-400 cursor-not-allowed"
                  >
                    Terkunci
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
