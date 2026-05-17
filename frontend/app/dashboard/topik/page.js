'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function calcAdtSederhanaProgress() {
  try {
    const d = JSON.parse(localStorage.getItem('asd_progress_adt_sederhana')) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch { return 0; }
}

function calcPengantarProgress() {
  try {
    const d = JSON.parse(localStorage.getItem('asd_progress_pengantar')) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch { return 0; }
}

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
      <Image
        src="/algoritma.png"
        alt="Pengantar Algoritma dan Struktur Data"
        width={208}
        height={120}
        className="w-full h-full object-cover"
      />
    ),
  },
  {
    id: 'adt-sederhana',
    title: 'ADT Sederhana',
    description: 'Mempelajari implementasi Abstract Data Type sederhana seperti Point, Time, dan Date dalam bahasa C menggunakan file .h dan .c.',
    progress: 0,
    href: '/dashboard/topik/adt-sederhana',
    available: true,
    bg: 'bg-purple-600',
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
  const [pengantarProgress, setPengantarProgress] = useState(0);
  const [adtSederhanaProgress, setAdtSederhanaProgress] = useState(0);

  useEffect(() => {
    setPengantarProgress(calcPengantarProgress());
    setAdtSederhanaProgress(calcAdtSederhanaProgress());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Topik Pembelajaran</h1>

      <div className="space-y-3 sm:space-y-4">
        {topics.map((topic) => {
          const pct =
            topic.id === 'pengantar' ? pengantarProgress :
            topic.id === 'adt-sederhana' ? adtSederhanaProgress :
            topic.progress;
          return (
            <div
              key={topic.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Thumbnail */}
              <div
                className={`w-full h-36 sm:w-48 sm:h-auto md:w-52 shrink-0 flex items-center justify-center overflow-hidden ${topic.bg}`}
              >
                {topic.icon ?? (
                  topic.available ? (
                    <span className="text-white text-2xl font-bold select-none font-mono opacity-80 tracking-tight">{`{ ADT }`}</span>
                  ) : (
                    <span className="text-white text-opacity-40 text-4xl select-none">🔒</span>
                  )
                )}
              </div>

              {/* Body */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">{topic.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">{topic.description}</p>

                  {topic.available && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
                    </div>
                  )}

                  {!topic.available && (
                    <span className="inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      Segera hadir
                    </span>
                  )}
                </div>

                {/* Action button */}
                <div className="shrink-0 self-start sm:self-auto">
                  {topic.available && topic.href ? (
                    <Link
                      href={topic.href}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap min-h-10"
                    >
                      {pct > 0 ? 'Lanjutkan' : 'Mulai'}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-400 cursor-not-allowed min-h-10"
                    >
                      Terkunci
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
