"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

function calcMesinKarakterProgress() {
  try {
    const d =
      JSON.parse(localStorage.getItem("asd_progress_mesin_karakter")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcListProgress() {
  try {
    const d = JSON.parse(localStorage.getItem("asd_progress_list")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcSetMapProgress() {
  try {
    const d = JSON.parse(localStorage.getItem("asd_progress_set_map")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcStackQueueProgress() {
  try {
    const d =
      JSON.parse(localStorage.getItem("asd_progress_stack_queue")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcBinaryTreeProgress() {
  try {
    const d =
      JSON.parse(localStorage.getItem("asd_progress_binary_tree")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcListLinierProgress() {
  try {
    const d =
      JSON.parse(localStorage.getItem("asd_progress_list_linier")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcAplikasiProgress() {
  try {
    const d = JSON.parse(localStorage.getItem("asd_progress_aplikasi")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcGraphProgress() {
  try {
    const d = JSON.parse(localStorage.getItem("asd_progress_graph")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcAdtSederhanaProgress() {
  try {
    const d =
      JSON.parse(localStorage.getItem("asd_progress_adt_sederhana")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

function calcPengantarProgress() {
  try {
    const d = JSON.parse(localStorage.getItem("asd_progress_pengantar")) ?? {};
    let count = 0;
    if (d.materi) count++;
    if (d.contoh) count++;
    if (d.latihan) count++;
    if (d.ringkasan) count++;
    return count * 25;
  } catch {
    return 0;
  }
}

const topics = [
  {
    id: "pengantar",
    title: "Pengantar Algoritma dan Struktur Data",
    description:
      "Konsep dasar algoritma dan struktur data: paradigma prosedural, ADT, notasi algoritmik, dasar bahasa C, serta modularitas dan reusabilitas program.",
    progress: 0,
    href: "/dashboard/topik/pengantar",
    available: true,
    bg: "bg-blue-600",
    icon: (
      <Image
        src='/cover-materials/1.png'
        alt='Pengantar Algoritma dan Struktur Data'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "adt-sederhana",
    title: "ADT Sederhana",
    description:
      "Implementasi ADT sederhana seperti Point, Time, dan Date dalam bahasa C menggunakan pasangan file header (.h) dan implementasi (.c).",
    progress: 0,
    href: "/dashboard/topik/adt-sederhana",
    available: true,
    bg: "bg-purple-600",
    icon: (
      <Image
        src='/cover-materials/2.png'
        alt='ADT Sederhana'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "list",
    title: "List",
    description:
      "List berbasis array: representasi implisit dan eksplisit, lima alternatif implementasi, operasi pencarian dan pengurutan, serta array dinamis.",
    progress: 0,
    href: "/dashboard/topik/list",
    available: true,
    bg: "bg-emerald-600",
    icon: (
      <Image
        src='/cover-materials/3.png'
        alt='List'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "mesin-karakter",
    title: "Mesin Karakter & Kata",
    description:
      "Mesin abstrak pemrosesan teks: primitif start dan advance, model pembacaan karakter dan kata, serta implementasi word scanner dalam C.",
    progress: 0,
    href: "/dashboard/topik/mesin-karakter",
    available: true,
    bg: "bg-sky-600",
    icon: (
      <Image
        src='/cover-materials/4.png'
        alt='Mesin Karakter & Kata'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "stack-queue",
    title: "Stack & Queue",
    description:
      "Stack (LIFO) dan Queue (FIFO) berbasis array: circular buffer, operasi push/pop/enqueue/dequeue, dan aplikasi evaluasi ekspresi postfix.",
    progress: 0,
    href: "/dashboard/topik/stack-queue",
    available: true,
    bg: "bg-rose-600",
    icon: (
      <Image
        src='/cover-materials/5.png'
        alt='Stack & Queue'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "set-map",
    title: "Set & Map",
    description:
      "ADT Set dan Map: operasi union, intersection, dan difference, diimplementasikan dengan array tak terurut, array terurut, dan hash table.",
    progress: 0,
    href: "/dashboard/topik/set-map",
    available: true,
    bg: "bg-teal-600",
    icon: (
      <Image
        src='/cover-materials/6.png'
        alt='Set & Map'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "list-linier",
    title: "List Linier",
    description:
      "Linked list: singly dan doubly linked list, list sirkuler, dan list dengan sentinel. Implementasi Stack, Queue, dan Priority Queue berbasis pointer.",
    progress: 0,
    href: "/dashboard/topik/list-linier",
    available: true,
    bg: "bg-cyan-600",
    icon: (
      <Image
        src='/cover-materials/7.png'
        alt='List Linier'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "binary-tree",
    title: "Binary Tree",
    description:
      "Pohon biner: traversal pre/in/post-order, fungsi rekursif, pohon seimbang, dan Binary Search Tree dengan operasi insert, delete, dan pencarian.",
    progress: 0,
    href: "/dashboard/topik/binary-tree",
    available: true,
    bg: "bg-amber-600",
    icon: (
      <Image
        src='/cover-materials/8.png'
        alt='Binary Tree'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "graph",
    title: "Graph",
    description:
      "Representasi graf: adjacency matrix, adjacency list, incidence matrix, dan edge list. Mencakup directed graph dan implementasi multilist dengan operasi insert dan delete.",
    progress: 0,
    href: "/dashboard/topik/graph",
    available: true,
    bg: "bg-indigo-600",
    icon: (
      <Image
        src='/cover-materials/9.png'
        alt='Graph'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
  {
    id: "aplikasi",
    title: "Aplikasi",
    description:
      "Studi kasus terpadu: representasi polinom, manajemen memori dinamis (First Fit/Best Fit), Multi-List, dan relasi M-N sebagai penerapan nyata struktur data.",
    progress: 0,
    href: "/dashboard/topik/aplikasi",
    available: true,
    bg: "bg-orange-600",
    icon: (
      <Image
        src='/cover-materials/10.png'
        alt='Aplikasi'
        width={208}
        height={120}
        className='w-full h-full object-cover'
      />
    ),
  },
];

export default function TopikPage() {
  const [pengantarProgress, setPengantarProgress] = useState(0);
  const [adtSederhanaProgress, setAdtSederhanaProgress] = useState(0);
  const [listProgress, setListProgress] = useState(0);
  const [mesinKarakterProgress, setMesinKarakterProgress] = useState(0);
  const [stackQueueProgress, setStackQueueProgress] = useState(0);
  const [setMapProgress, setSetMapProgress] = useState(0);
  const [binaryTreeProgress, setBinaryTreeProgress] = useState(0);
  const [graphProgress, setGraphProgress] = useState(0);
  const [listLinierProgress, setListLinierProgress] = useState(0);
  const [aplikasiProgress, setAplikasiProgress] = useState(0);

  useEffect(() => {
    setPengantarProgress(calcPengantarProgress());
    setAdtSederhanaProgress(calcAdtSederhanaProgress());
    setListProgress(calcListProgress());
    setMesinKarakterProgress(calcMesinKarakterProgress());
    setStackQueueProgress(calcStackQueueProgress());
    setSetMapProgress(calcSetMapProgress());
    setBinaryTreeProgress(calcBinaryTreeProgress());
    setGraphProgress(calcGraphProgress());
    setListLinierProgress(calcListLinierProgress());
    setAplikasiProgress(calcAplikasiProgress());
  }, []);

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
      <h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6'>
        Topik Pembelajaran
      </h1>

      <div className='space-y-3 sm:space-y-4'>
        {topics.map((topic) => {
          const pct =
            topic.id === "pengantar"
              ? pengantarProgress
              : topic.id === "adt-sederhana"
                ? adtSederhanaProgress
                : topic.id === "list"
                  ? listProgress
                  : topic.id === "mesin-karakter"
                    ? mesinKarakterProgress
                    : topic.id === "stack-queue"
                      ? stackQueueProgress
                      : topic.id === "set-map"
                        ? setMapProgress
                        : topic.id === "binary-tree"
                          ? binaryTreeProgress
                          : topic.id === "graph"
                            ? graphProgress
                            : topic.id === "list-linier"
                              ? listLinierProgress
                              : topic.id === "aplikasi"
                                ? aplikasiProgress
                                : topic.progress;
          return (
            <div
              key={topic.id}
              className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row'
            >
              {/* Thumbnail */}
              <div
                className={`w-full h-36 sm:w-48 sm:h-auto md:w-52 shrink-0 flex items-center justify-center overflow-hidden ${topic.bg}`}
              >
                {topic.icon ??
                  (topic.available ? (
                    <span className='text-white text-2xl font-bold select-none font-mono opacity-80 tracking-tight'>{`{ ADT }`}</span>
                  ) : (
                    <span className='text-white text-opacity-40 text-4xl select-none'>
                      🔒
                    </span>
                  ))}
              </div>

              {/* Body */}
              <div className='flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-sm sm:text-base font-semibold text-gray-900'>
                    {topic.title}
                  </h2>
                  <p className='text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed'>
                    {topic.description}
                  </p>

                  {topic.available && (
                    <div className='mt-3 flex items-center gap-2'>
                      <div className='flex-1 bg-gray-200 rounded-full h-1.5'>
                        <div
                          className='bg-blue-600 h-1.5 rounded-full transition-all'
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className='text-xs text-gray-400 w-8 text-right shrink-0'>
                        {pct}%
                      </span>
                    </div>
                  )}

                  {!topic.available && (
                    <span className='inline-block mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                      Segera hadir
                    </span>
                  )}
                </div>

                {/* Action button */}
                <div className='shrink-0 self-start sm:self-auto'>
                  {topic.available && topic.href ? (
                    <Link
                      href={topic.href}
                      className='flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors whitespace-nowrap min-h-10'
                    >
                      {pct > 0 ? "Lanjutkan" : "Mulai"}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className='px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-400 cursor-not-allowed min-h-10'
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
