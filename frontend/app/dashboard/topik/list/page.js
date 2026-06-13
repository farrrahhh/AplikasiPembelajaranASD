"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { fetchTopicProgress, saveTopicProgress } from '../../../lib/progress';

import SoalSendiriPanel from '../../../components/SoalSendiriPanel';
// ---------------------------------------------------------------------------
// Sidebar section definitions
// ---------------------------------------------------------------------------
const SECTIONS = [
  { id: "intro", title: "ADT List", level: 0 },
  { id: "istilah", title: "Istilah-istilah", level: 0 },
  { id: "operasi", title: "Operasi ADT List", level: 0 },
  { id: "operasi-dasar", title: "Operasi Dasar", level: 1 },
  { id: "operasi-insert", title: "Operasi Insert", level: 1 },
  { id: "operasi-delete", title: "Operasi Delete", level: 1 },
  { id: "ilustrasi", title: "Ilustrasi Insert & Delete", level: 0 },
  { id: "impl-array", title: "Implementasi dengan Array", level: 0 },
  { id: "representasi", title: "Implisit vs Eksplisit", level: 1 },
  { id: "posisi", title: "Rata Kiri vs Tidak Rata Kiri", level: 1 },
  { id: "ringkasan-alt", title: "Ringkasan 4 Alternatif", level: 0 },
  { id: "notasi-alt1a", title: "Notasi alt-1a", level: 1 },
  { id: "notasi-alt2a", title: "Notasi alt-2a", level: 1 },
  { id: "deklarasi", title: "Deklarasi Selektor & Operasi", level: 0 },
  { id: "contoh-length", title: "Contoh: length", level: 1 },
  { id: "contoh-insert", title: "Contoh: insertAt", level: 1 },
  { id: "alt-b", title: "Elemen Tidak Rata Kiri (alt-b)", level: 0 },
  { id: "dinamis", title: "Implementasi Array Dinamis", level: 0 },
  { id: "alt-3", title: "Elemen Tersebar (alt-3)", level: 0 },
  { id: "efisiensi", title: "Perbandingan Efisiensi", level: 0 },
];

const TABS = ["MATERI", "CONTOH", "LATIHAN", "RINGKASAN"];

// ---------------------------------------------------------------------------
// Primitive building blocks
// ---------------------------------------------------------------------------
function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className='text-xl font-bold text-gray-900 mt-10 mb-3 pb-2 border-b-2 border-gray-200 scroll-mt-28'
    >
      {children}
    </h2>
  );
}

function SubHeading({ id, children }) {
  return (
    <h3
      id={id}
      className='text-base font-bold text-gray-800 mt-6 mb-2 scroll-mt-28'
    >
      {children}
    </h3>
  );
}

function P({ children, className = "" }) {
  return <p className={`mb-3 leading-relaxed ${className}`}>{children}</p>;
}

function Mono({ children }) {
  return (
    <code className='bg-gray-100 text-purple-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200'>
      {children}
    </code>
  );
}

function Pseudocode({ children }) {
  return (
    <pre className='my-4 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed'>
      {children.trim()}
    </pre>
  );
}

function AsciiBox({ children }) {
  return (
    <pre className='my-4 bg-purple-50 border border-purple-100 rounded-lg px-5 py-4 text-[13px] font-mono text-purple-900 overflow-x-auto leading-relaxed'>
      {children.trim()}
    </pre>
  );
}

function NoteBox({ children }) {
  return (
    <div className='my-4 bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded-r-lg text-sm text-gray-700'>
      <span className='font-semibold text-yellow-700'>Catatan: </span>
      {children}
    </div>
  );
}

function InfoBox({ children }) {
  return (
    <div className='my-4 bg-purple-50 border-l-4 border-purple-500 px-4 py-3 rounded-r-lg text-sm text-gray-700'>
      {children}
    </div>
  );
}

function UL({ items }) {
  return (
    <ul className='my-3 space-y-1 list-disc list-inside ml-2 text-[15px] text-gray-700'>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function W3Table({ headers, rows }) {
  return (
    <div className='my-4 overflow-x-auto rounded-lg border border-gray-200'>
      <table className='w-full border-collapse text-sm'>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className='bg-gray-800 text-white px-4 py-2.5 text-left font-semibold border-r border-gray-600 last:border-r-0'
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className='px-4 py-2.5 text-gray-700 border-t border-gray-100 border-r last:border-r-0'
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Divider() {
  return <hr className='my-8 border-gray-200' />;
}

// ---------------------------------------------------------------------------
// MATERI full content
// ---------------------------------------------------------------------------
function MateriContent() {
  return (
    <div className='text-[15px] text-gray-700'>
      {/* ── 1. Intro ──────────────────────────────────────────── */}
      <SectionHeading id='intro'>ADT List</SectionHeading>
      <P>
        <strong>List</strong> (atau <em>sequence</em>) adalah sekumpulan elemen
        bertipe sama yang memiliki keterurutan tertentu (<em>ordered</em>, tidak
        harus <em>sorted</em>).
      </P>
      <P>Ada konsep elemen pertama, elemen kedua, hingga elemen ke-n.</P>
      <P>Contoh list dalam kehidupan sehari-hari:</P>
      <AsciiBox>{`Daftar belanjaan         → terurut berdasarkan urutan penulisan
Daftar kota road trip    → terurut berdasarkan rute perjalanan
Instagram feed           → terurut berdasarkan waktu publikasi
String                   → list of characters!`}</AsciiBox>
      <Divider />

      {/* ── 2. Istilah ────────────────────────────────────────── */}
      <SectionHeading id='istilah'>Istilah-istilah</SectionHeading>
      <AsciiBox>{`head       → elemen pertama list
length     → jumlah elemen dalam list
empty list → list yang tidak mempunyai elemen
traversal  → mengunjungi elemen list satu per satu dari ujung ke ujung`}</AsciiBox>
      <P>Ilustrasi sebuah list dengan 5 elemen:</P>
      <AsciiBox>{`Index:   0    1    2    3    4
Value:   9    5   12    7    1

head   = 9
length = 5`}</AsciiBox>
      <Divider />

      {/* ── 3. Operasi ────────────────────────────────────────── */}
      <SectionHeading id='operasi'>Operasi ADT List</SectionHeading>

      <SubHeading id='operasi-dasar'>Operasi Dasar</SubHeading>
      <W3Table
        headers={["Operasi", "Keterangan"]}
        rows={[
          ["isEmpty", "Memeriksa apakah list kosong"],
          ["length", "Menghitung jumlah elemen efektif"],
          ["getElmt", "Melihat nilai pada posisi/indeks tertentu"],
          ["setElmt", "Mengubah nilai pada posisi/indeks tertentu"],
          ["indexOf", "Mencari indeks elemen pertama yang bernilai x"],
          ["concat", "Menggabungkan dua list"],
        ]}
      />

      <SubHeading id='operasi-insert'>Operasi Insert</SubHeading>
      <W3Table
        headers={["Operasi", "Keterangan"]}
        rows={[
          ["insertFirst", "Menambah elemen di awal list"],
          ["insertAt", "Menambah elemen pada indeks tertentu"],
          ["insertLast", "Menambah elemen di akhir list"],
        ]}
      />

      <SubHeading id='operasi-delete'>Operasi Delete</SubHeading>
      <W3Table
        headers={["Operasi", "Keterangan"]}
        rows={[
          ["deleteFirst", "Menghapus elemen di awal list"],
          ["deleteAt", "Menghapus elemen pada indeks tertentu"],
          ["deleteLast", "Menghapus elemen di akhir list"],
        ]}
      />
      <Divider />

      {/* ── 4. Ilustrasi ──────────────────────────────────────── */}
      <SectionHeading id='ilustrasi'>
        Ilustrasi Insert dan Delete
      </SectionHeading>
      <P>
        <strong>Insert 6 di awal:</strong>
      </P>
      <AsciiBox>{`Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [6] [9] [5] [12] [7] [1]`}</AsciiBox>
      <P>
        <strong>Insert 6 setelah indeks 1 (setelah angka 5):</strong>
      </P>
      <AsciiBox>{`Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [6] [12] [7] [1]`}</AsciiBox>
      <P>
        <strong>Insert 6 di akhir:</strong>
      </P>
      <AsciiBox>{`Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [12] [7] [1] [6]`}</AsciiBox>
      <P>
        <strong>Delete elemen pertama:</strong>
      </P>
      <AsciiBox>{`Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [5] [12] [7] [1]`}</AsciiBox>
      <P>
        <strong>Delete elemen di indeks 2 (angka 12):</strong>
      </P>
      <AsciiBox>{`Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [7] [1]`}</AsciiBox>
      <P>
        <strong>Delete elemen terakhir:</strong>
      </P>
      <AsciiBox>{`Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [12] [7]`}</AsciiBox>
      <Divider />

      {/* ── 5. Implementasi ───────────────────────────────────── */}
      <SectionHeading id='impl-array'>Implementasi dengan Array</SectionHeading>
      <P>
        ADT List dapat diimplementasikan dengan dua cara: <strong>Array</strong>{" "}
        (elemen disimpan dalam array statik atau dinamis) atau{" "}
        <strong>Berkait</strong> (elemen disimpan dalam node-node yang saling
        terhubung). Materi ini fokus pada implementasi dengan{" "}
        <strong>array</strong>.
      </P>
      <P>Ada dua dimensi pilihan dalam implementasi array:</P>

      <SubHeading id='representasi'>
        Representasi: Implisit (alt-1) vs Eksplisit (alt-2)
      </SubHeading>
      <P>
        <strong>Implisit (alt-1)</strong> — elemen kosong ditandai dengan nilai
        khusus (mark):
      </P>
      <AsciiBox>{`Contoh mark: MARK = -9999

Array kosong:    [?] [?] [?] [?] [?] [?] [?] [?]
Array sebagian:  [9] [5] [12] [7] [1] [?] [?] [?]
                  ↑                    ↑
               elemen terisi         masih MARK

Traversal: while elemen ≠ MARK do ...`}</AsciiBox>
      <P>
        <strong>Eksplisit (alt-2)</strong> — jumlah elemen efektif disimpan
        dalam variabel <Mono>nEff</Mono>:
      </P>
      <AsciiBox>{`Array kosong:    [9] [5] [?] [?] [?]   nEff = 0
Array sebagian:  [9] [5] [12] [7] [1]  nEff = 5
Array penuh:     [9] [5] [12] [7] [1] [6] [71] [4]  nEff = 8

Traversal: for i = 0 to nEff-1 do ...`}</AsciiBox>

      <SubHeading id='posisi'>
        Posisi Elemen: Rata Kiri (alt-a) vs Tidak Rata Kiri (alt-b)
      </SubHeading>
      <P>
        <strong>Rata kiri (alt-a)</strong> — elemen selalu dimulai dari indeks
        0:
      </P>
      <UL
        items={[
          "insertFirst → perlu menggeser semua elemen ke kanan",
          "deleteFirst → perlu menggeser semua elemen ke kiri",
          "Akses indeks lojik = indeks fisik (sederhana)",
        ]}
      />
      <P>
        <strong>Tidak rata kiri (alt-b)</strong> — elemen boleh dimulai dari
        indeks mana saja:
      </P>
      <UL
        items={[
          "insertFirst / deleteFirst → tidak perlu geser elemen jika ada ruang",
          "Perlu menyimpan informasi indeks pertama (firstIdx)",
          "Diperlukan fungsi antara: firstIdx, lastIdx, isIdxEff",
        ]}
      />
      <Divider />

      {/* ── 6. Ringkasan 4 Alt ────────────────────────────────── */}
      <SectionHeading id='ringkasan-alt'>Ringkasan 4 Alternatif</SectionHeading>
      <W3Table
        headers={["Alternatif", "Representasi", "Posisi"]}
        rows={[
          ["alt-1a", "Implisit (mark)", "Rata kiri"],
          ["alt-2a", "Eksplisit (nEff)", "Rata kiri"],
          ["alt-1b", "Implisit (mark)", "Tidak rata kiri"],
          ["alt-2b", "Eksplisit (nEff)", "Tidak rata kiri"],
        ]}
      />

      <SubHeading id='notasi-alt1a'>
        Notasi Algoritmik: alt-1a (Implisit, Rata Kiri)
      </SubHeading>
      <Pseudocode>{`constant CAPACITY  : integer = 100
constant IDX_UNDEF : integer = -1
constant MARK      : integer = -9999

type ElType : integer
type List   : < contents: array [0..CAPACITY-1] of ElType >

{ Konstruktor }
procedure CreateList(output l: List)
{ Membentuk List kosong. Semua elemen diinisialisasi dengan MARK. }`}</Pseudocode>

      <SubHeading id='notasi-alt2a'>
        Notasi Algoritmik: alt-2a (Eksplisit, Rata Kiri)
      </SubHeading>
      <Pseudocode>{`constant CAPACITY  : integer = 100
constant IDX_UNDEF : integer = -1

type ElType : integer
type List   : < contents : array [0..CAPACITY-1] of ElType
                nEff     : integer ≥ 0 >

{ Konstruktor }
procedure CreateList(output l: List)
{ Membentuk List kosong. nEff diinisialisasi dengan 0. }`}</Pseudocode>
      <Divider />

      {/* ── 7. Deklarasi ──────────────────────────────────────── */}
      <SectionHeading id='deklarasi'>
        Deklarasi Selektor &amp; Operasi
      </SectionHeading>
      <Pseudocode>{`function isEmpty(l: List) → boolean
{ Memeriksa apakah l kosong.
  alt-1: tidak boleh ada elemen yang bukan MARK.
  alt-2: l.nEff = 0. }

function length(l: List) → integer
{ Mengirimkan jumlah elemen efektif l.
  alt-1: hitung elemen yang bukan MARK.
  alt-2: kembalikan l.nEff. }

function getElmt(l: List, i: integer) → ElType
{ Mengirimkan elemen list ke-i (indeks lojik).
  Prekondisi: l tidak kosong, i antara 0..length(l)-1. }

procedure setElmt(input/output l: List, input i: integer, input v: ElType)
{ Mengeset elemen list ke-i menjadi v.
  Prekondisi: l tidak kosong, i antara 0..length(l)-1. }

function indexOf(l: List, x: ElType) → integer
{ Mengembalikan indeks elemen pertama yang bernilai x,
  atau IDX_UNDEF jika tidak ada. }

procedure insertFirst(input/output l: List, input x: ElType)
{ x menjadi elemen pertama l. }

procedure insertAt(input/output l: List, input x: ElType, input idx: integer)
{ x disisipkan pada indeks ke-idx (bukan menimpa). }

procedure insertLast(input/output l: List, input x: ElType)
{ x menjadi elemen terakhir l. }

procedure deleteFirst(input/output l: List, output e: ElType)
{ e diset dengan elemen pertama l, lalu elemen pertama dihapus. }

procedure deleteAt(input/output l: List, input idx: integer, output e: ElType)
{ e diset dengan elemen ke-idx, lalu elemen ke-idx dihapus. }

procedure deleteLast(input/output l: List, output e: ElType)
{ e diset dengan elemen terakhir l, lalu elemen terakhir dihapus. }

function concat(l1, l2: List) → List
{ Mengembalikan list hasil penggabungan l1 dan l2 (l2 di belakang l1). }`}</Pseudocode>

      <SubHeading id='contoh-length'>
        Contoh Algoritma: <code className='font-mono text-[14px]'>length</code>
      </SubHeading>
      <P>
        Perbedaan efisiensi antara alt-1a dan alt-2a terlihat jelas di sini:
      </P>
      <P>
        <strong>alt-1a (implisit):</strong>
      </P>
      <Pseudocode>{`KAMUS LOKAL
i: integer

ALGORITMA
i ← 0
while l.contents[i] ≠ MARK AND i < CAPACITY do
    i ← i + 1
{ berhenti saat ketemu MARK atau habis }
→ i`}</Pseudocode>
      <P>
        <strong>alt-2a (eksplisit):</strong>
      </P>
      <Pseudocode>{`ALGORITMA
→ l.nEff`}</Pseudocode>
      <InfoBox>
        <p className='text-sm font-semibold text-purple-800 mb-1'>
          Perbandingan Efisiensi
        </p>
        <p className='text-sm text-purple-700'>
          alt-2a jauh lebih efisien: <strong>O(1)</strong> langsung
          mengembalikan <Mono>nEff</Mono>, sementara alt-1a membutuhkan{" "}
          <strong>O(n)</strong> traversal untuk menghitung elemen.
        </p>
      </InfoBox>

      <SubHeading id='contoh-insert'>
        Contoh Algoritma:{" "}
        <code className='font-mono text-[14px]'>insertAt</code>
      </SubHeading>
      <P>
        Proses: geser semua elemen dari indeks <Mono>idx</Mono> ke kanan satu
        posisi, lalu isi posisi <Mono>idx</Mono> dengan <Mono>x</Mono>.
      </P>
      <P>
        <strong>alt-1a:</strong>
      </P>
      <Pseudocode>{`KAMUS LOKAL
i: integer

ALGORITMA
if length(l) < CAPACITY then
    i traversal [length(l)..idx+1]
        l.contents[i] ← l.contents[i-1]
    l.contents[idx] ← x`}</Pseudocode>
      <P>
        <strong>alt-2a:</strong>
      </P>
      <Pseudocode>{`ALGORITMA
if length(l) < CAPACITY then
    i traversal [length(l)..idx+1]
        l.contents[i] ← l.contents[i-1]
    l.contents[idx] ← x
    l.nEff ← l.nEff + 1`}</Pseudocode>
      <NoteBox>
        Perbedaan utama: alt-2a perlu memperbarui <Mono>nEff</Mono> setiap kali
        ada insert atau delete.
      </NoteBox>
      <Divider />

      {/* ── 8. alt-b ──────────────────────────────────────────── */}
      <SectionHeading id='alt-b'>Elemen Tidak Rata Kiri (alt-b)</SectionHeading>
      <P>
        Pada alt-b, elemen tidak harus dimulai dari indeks 0. Ini memungkinkan{" "}
        <Mono>insertFirst</Mono> dan <Mono>deleteFirst</Mono> tanpa penggeseran.
      </P>
      <P>Diperlukan fungsi-fungsi antara:</P>
      <Pseudocode>{`function firstIdx(l: List) → integer
{ Mengirimkan indeks fisik elemen pertama.
  alt-1b: cari elemen pertama yang bukan MARK.
  alt-2b: kembalikan indeks yang disimpan. }

function lastIdx(l: List) → integer
{ Mengirimkan indeks fisik elemen terakhir.
  alt-1b: cari elemen terakhir yang bukan MARK.
  alt-2b: firstIdx + nEff - 1. }

function isIdxValid(l: List, i: integer) → boolean
{ true jika i adalah indeks fisik yang valid (0..CAPACITY-1). }

function isIdxEff(l: List, i: integer) → boolean
{ true jika i adalah indeks efektif (firstIdx..lastIdx). }`}</Pseudocode>
      <W3Table
        headers={["Operasi", "alt-a (rata kiri)", "alt-b (tidak rata kiri)"]}
        rows={[
          [
            "insertFirst",
            "O(n) — geser semua elemen ke kanan",
            "O(1) — tulis di firstIdx−1",
          ],
          [
            "deleteFirst",
            "O(n) — geser semua elemen ke kiri",
            "O(1) — majukan firstIdx",
          ],
          ["insertLast", "O(1)", "O(1) jika ada ruang"],
          ["deleteLast", "O(1)", "O(1)"],
        ]}
      />
      <Divider />

      {/* ── 9. Array Dinamis ──────────────────────────────────── */}
      <SectionHeading id='dinamis'>Implementasi Array Dinamis</SectionHeading>
      <P>
        Array statik memiliki keterbatasan kapasitas tetap. Pada array dinamis,
        kapasitas bisa berubah saat runtime.
      </P>
      <Pseudocode>{`constant INITIAL_CAP : integer = 100

type List : < contents : array of ElType
              capacity : integer
              nEff     : integer >

procedure CreateList(output l: List)
ALGORITMA
    l.capacity ← INITIAL_CAP
    alokasi(l.contents, l.capacity)
    l.nEff ← 0`}</Pseudocode>

      <P>
        <strong>Strategi Resize:</strong>
      </P>
      <div className='my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]'>
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
          <p className='font-bold text-blue-800 mb-1'>
            Array penuh — saat insert
          </p>
          <ul className='text-blue-700 text-sm space-y-1 list-disc list-inside'>
            <li>
              Alokasi array baru ukuran <strong>2× kapasitas lama</strong>
            </li>
            <li>Salin semua elemen ke array baru</li>
            <li>Lanjutkan insert</li>
          </ul>
        </div>
        <div className='bg-orange-50 border border-orange-200 rounded-xl p-4'>
          <p className='font-bold text-orange-800 mb-1'>
            Array terlalu kosong (≤25%) — setelah delete
          </p>
          <ul className='text-orange-700 text-sm space-y-1 list-disc list-inside'>
            <li>
              Alokasi array baru ukuran <strong>0.5× kapasitas lama</strong>
            </li>
            <li>Salin semua elemen ke array baru</li>
          </ul>
        </div>
      </div>
      <P>
        Dalam bahasa C, resize bisa menggunakan <Mono>realloc()</Mono>:
      </P>
      <Pseudocode>{`int *baru = realloc(l.contents, newCapacity * sizeof(int));
if (baru != NULL) {
    l.contents = baru;
    l.capacity = newCapacity;
}`}</Pseudocode>
      <NoteBox>
        <Mono>realloc()</Mono> bisa gagal. Selalu periksa apakah hasilnya{" "}
        <Mono>NULL</Mono>.
      </NoteBox>
      <Divider />

      {/* ── 10. alt-3 ─────────────────────────────────────────── */}
      <SectionHeading id='alt-3'>Elemen Tersebar (alt-3)</SectionHeading>
      <P>
        Pada alt-3, elemen list boleh berada di sembarang indeks dalam array
        (tidak harus kontigu).
      </P>
      <AsciiBox>{`Array kosong:    [?] [?] [?] [?] [?] [?] [?] [?]
Array sebagian:  [?] [9] [?] [5] [12] [?] [?] [7]
                      ↑        ↑   ↑              ↑
                 elemen list tersebar di berbagai indeks`}</AsciiBox>
      <W3Table
        headers={["Operasi", "Keterangan alt-3"]}
        rows={[
          ["isEmpty", "true jika semua elemen bernilai MARK"],
          ["indexOf", "skip elemen yang bernilai MARK"],
          ["length", "traversal, cacah yang bukan MARK"],
          ["getElmt", "hitung indeks lojik mulai dari fisik = 0, skip MARK"],
          ["delete", "set elemen yang dihapus menjadi MARK (cepat!)"],
          ["insert", 'lakukan "defragmen" dulu sebelum insert'],
        ]}
      />
      <P>Proses defragmen (memampatkan):</P>
      <AsciiBox>{`Sebelum:  [?] [9] [?] [5] [12] [?] [?] [7]
Sesudah:  [?] [?] [9] [5] [12] [7] [?] [?]

Elemen digeser ke kiri agar kembali kontigu.`}</AsciiBox>
      <Divider />

      {/* ── 11. Perbandingan Efisiensi ────────────────────────── */}
      <SectionHeading id='efisiensi'>
        Perbandingan Efisiensi 5 Alternatif
      </SectionHeading>
      <W3Table
        headers={["Operasi", "alt-1a", "alt-2a", "alt-1b", "alt-2b", "alt-3"]}
        rows={[
          [
            "insertFirst",
            "O(n) geser",
            "O(n) geser",
            "O(1)*",
            "O(1)*",
            "O(n) defragmen",
          ],
          ["insertLast", "O(n)*", "O(1)", "O(1)*", "O(1)*", "O(n) defragmen"],
          [
            "deleteFirst",
            "O(n) geser",
            "O(n) geser",
            "O(1)",
            "O(1)",
            "O(1) set MARK",
          ],
          ["deleteLast", "O(n)*", "O(1)", "O(1)", "O(1)", "O(1) set MARK"],
        ]}
      />
      <NoteBox>
        * alt-1a perlu traversal untuk mencari posisi akhir list terlebih
        dahulu. alt-1b dan alt-2b: O(1) jika masih ada ruang; O(n) jika harus
        defragmen.
      </NoteBox>

      <P>
        <strong>Pola Traversal per alternatif:</strong>
      </P>
      <Pseudocode>{`{ Alt-1 (implisit): }
i ← 0
while l.contents[i] ≠ MARK AND i < CAPACITY do
    { proses l.contents[i] }
    i ← i + 1

{ Alt-2 (eksplisit): }
i traversal [0..l.nEff-1]
    { proses l.contents[i] }

{ Alt-3 (tersebar): }
i traversal [0..CAPACITY-1]
    if l.contents[i] ≠ MARK then
        { proses l.contents[i] }`}</Pseudocode>

      {/* Summary card */}
      <div className='mt-10 mb-6 bg-purple-50 border border-purple-200 rounded-xl p-6'>
        <h3 className='font-bold text-purple-900 text-base mb-3'>
          Ringkasan Penting
        </h3>
        <ul className='space-y-1.5 text-sm text-purple-900'>
          {[
            "List adalah kumpulan elemen bertipe sama yang ordered (berurutan).",
            "Dua dimensi pilihan: representasi (implisit/eksplisit) × posisi (rata kiri/tidak).",
            "alt-2 lebih efisien untuk length dan insert/delete karena nEff tersimpan.",
            "alt-b lebih efisien untuk insertFirst/deleteFirst karena tidak perlu geser.",
            "alt-3 hemat untuk delete (O(1)), tapi insert perlu defragmen terlebih dahulu.",
            "Array dinamis mengatasi keterbatasan kapasitas dengan strategi resize 2× / 0.5×.",
          ].map((item, i) => (
            <li key={i} className='flex gap-2'>
              <span className='text-purple-500 font-bold'>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content — isSimetris
// ---------------------------------------------------------------------------
function ContohContent() {
  const [showHint, setShowHint] = useState(false);
  const [showJawaban, setShowJawaban] = useState(false);

  return (
    <div className='text-[15px] text-gray-700'>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-3 flex-wrap'>
          <span className='bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-200'>
            Medium
          </span>
          <span className='bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100'>
            ADT List
          </span>
          <span className='bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100'>
            Traversal
          </span>
          <span className='bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100'>
            Predikat
          </span>
        </div>
        <h2 className='text-xl font-bold text-gray-900'>
          Memeriksa List Simetris
        </h2>
      </div>

      {/* Deskripsi */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Deskripsi
        </h3>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed'>
          <p>
            Diberikan definisi ADT List dengan representasi{" "}
            <strong>eksplisit, rata kiri</strong> (alt-2a). Buatlah fungsi{" "}
            <code className='bg-white border border-gray-200 text-purple-700 px-1 rounded font-mono text-[13px]'>
              isSimetris
            </code>{" "}
            yang mengembalikan{" "}
            <code className='bg-white border border-gray-200 text-purple-700 px-1 rounded font-mono text-[13px]'>
              true
            </code>{" "}
            jika list bersifat simetrik: elemen pertama sama dengan elemen
            terakhir, elemen kedua sama dengan elemen sebelum terakhir, dan
            seterusnya.
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            List kosong dan list dengan satu elemen dianggap simetris.
          </p>
        </div>
      </div>

      {/* Spesifikasi */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Spesifikasi
        </h3>
        <pre className='bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed'>
          {`function isSimetris(l: List) → boolean
{ Menghasilkan true jika List l simetrik.
  List disebut simetrik jika:
  - elemen pertama = elemen terakhir,
  - elemen kedua = elemen sebelum terakhir,
  - dan seterusnya.
  List kosong adalah List simetris. }`}
        </pre>
      </div>

      {/* Contoh I/O */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Contoh
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200'>
              Input (list)
            </div>
            <pre className='bg-white px-4 py-3 font-mono text-sm text-gray-800'>{`[1, 2, 3, 2, 1]
[1, 2, 3, 4, 5]
[5]
[]`}</pre>
          </div>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200'>
              Output
            </div>
            <pre className='bg-white px-4 py-3 font-mono text-sm text-gray-800'>{`true
false
true
true`}</pre>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className='mb-5'>
        <button
          onClick={() => setShowHint(!showHint)}
          className='flex items-center gap-2 text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 hover:bg-yellow-100 transition-colors w-full'
        >
          <span>{showHint ? "▾" : "▸"}</span>
          <span>Hint</span>
        </button>
        {showHint && (
          <div className='mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-gray-700'>
            <p className='mb-2'>
              Cukup bandingkan separuh elemen dari kiri dengan pasangannya dari
              kanan:
            </p>
            <pre className='bg-white border border-yellow-100 rounded px-3 py-2 font-mono text-[13px] text-gray-800'>
              {`i = 0 bandingkan dengan length(l) - 1 - i\ni = 1 bandingkan dengan length(l) - 2\n...\nCukup sampai i < length(l) div 2`}
            </pre>
            <p className='mt-2'>
              Indeks tengah (jika length ganjil) tidak perlu diperiksa — selalu
              sama dengan dirinya sendiri.
            </p>
          </div>
        )}
      </div>

      <hr className='my-6 border-gray-200' />

      {/* Pembahasan */}
      <div>
        <button
          onClick={() => setShowJawaban(!showJawaban)}
          className='flex items-center gap-2 text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2.5 hover:bg-purple-100 transition-colors w-full mb-4'
        >
          <span>{showJawaban ? "▾" : "▸"}</span>
          <span>Lihat Pembahasan</span>
        </button>

        {showJawaban && (
          <div className='space-y-6'>
            {/* Algoritma */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Ide Algoritma
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                <ol className='list-decimal list-inside space-y-2 text-sm text-gray-700'>
                  <li>
                    Inisialisasi{" "}
                    <code className='font-mono'>simetris ← true</code> dan{" "}
                    <code className='font-mono'>i ← 0</code>
                  </li>
                  <li>
                    Loop selama{" "}
                    <code className='font-mono'>i {"<"} length(l) div 2</code>{" "}
                    dan masih simetris
                  </li>
                  <li>
                    Bandingkan <code className='font-mono'>getElmt(l, i)</code>{" "}
                    dengan{" "}
                    <code className='font-mono'>getElmt(l, length(l)−1−i)</code>
                  </li>
                  <li>
                    Jika berbeda, set{" "}
                    <code className='font-mono'>simetris ← false</code>
                  </li>
                  <li>
                    Kembalikan <code className='font-mono'>simetris</code>
                  </li>
                </ol>
              </div>
            </div>

            {/* Notasi Algoritmik */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Notasi Algoritmik
              </h3>
              <pre className='bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed'>
                {`function isSimetris(l: List) → boolean
KAMUS LOKAL
    i        : integer
    simetris : boolean

ALGORITMA
    simetris ← true
    i ← 0
    while i < length(l) div 2 AND simetris do
        if getElmt(l, i) ≠ getElmt(l, length(l) - 1 - i) then
            simetris ← false
        i ← i + 1
    { i ≥ length(l) div 2 OR NOT simetris }
    → simetris`}
              </pre>
            </div>

            {/* Trace */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Trace untuk{" "}
                <code className='font-mono text-[14px]'>[1, 2, 3, 2, 1]</code>
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                <W3Table
                  headers={[
                    "i",
                    "getElmt(l, i)",
                    "getElmt(l, 4-i)",
                    "Sama?",
                    "simetris",
                  ]}
                  rows={[
                    ["0", "1", "1", "Ya", "true"],
                    ["1", "2", "2", "Ya", "true"],
                    ["2 ≥ 5 div 2 = 2", "—", "—", "(stop)", "true"],
                  ]}
                />
                <p className='text-sm text-gray-600 mt-2'>
                  Length = 5, jadi loop berjalan untuk i = 0 dan i = 1 saja.
                  Elemen tengah (indeks 2) tidak perlu diperiksa.
                </p>
              </div>
            </div>

            {/* Kasus khusus */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Kasus Khusus
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                  <p className='font-semibold text-green-800 mb-1'>
                    List kosong <code className='font-mono'>[]</code>
                  </p>
                  <p className='text-green-700'>
                    <code className='font-mono'>length(l) = 0</code>, sehingga{" "}
                    <code className='font-mono'>0 div 2 = 0</code>.<br />
                    Loop tidak dieksekusi → langsung{" "}
                    <code className='font-mono'>→ true</code>.
                  </p>
                </div>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                  <p className='font-semibold text-blue-800 mb-1'>
                    List satu elemen <code className='font-mono'>[5]</code>
                  </p>
                  <p className='text-blue-700'>
                    <code className='font-mono'>length(l) = 1</code>, sehingga{" "}
                    <code className='font-mono'>1 div 2 = 0</code>.<br />
                    Loop tidak dieksekusi → langsung{" "}
                    <code className='font-mono'>→ true</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Latihan helpers (shared)
// ---------------------------------------------------------------------------
const NILAI_COLOR = {
  "Sangat Baik": "bg-green-100 text-green-700 border-green-200",
  Baik: "bg-blue-100 text-blue-700 border-blue-200",
  Cukup: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Perlu Perbaikan": "bg-red-100 text-red-700 border-red-200",
  "Belum Dijawab": "bg-gray-100 text-gray-500 border-gray-200",
};

const SKOR_BAR = (skor) => {
  if (skor >= 85) return "bg-green-500";
  if (skor >= 70) return "bg-blue-500";
  if (skor >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

function Spinner() {
  return (
    <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none'>
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8v8z'
      />
    </svg>
  );
}

function MetrikBar({ metrik }) {
  return (
    <div className='px-4 py-3 border-t border-gray-100 space-y-2.5'>
      <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest'>
        Rincian Penilaian
      </div>
      {metrik.map((m) => {
        const pct = m.maks > 0 ? (m.skor / m.maks) * 100 : 0;
        const barColor =
          pct >= 70
            ? "bg-green-500"
            : pct >= 50
              ? "bg-yellow-500"
              : "bg-red-400";
        return (
          <div key={m.nama}>
            <div className='flex items-center justify-between text-xs mb-0.5'>
              <span className='text-gray-600 font-medium'>{m.nama}</span>
              <span className='text-gray-500 font-mono'>
                {m.skor}/{m.maks}
              </span>
            </div>
            <div className='bg-gray-100 rounded-full h-1.5 mb-0.5'>
              <div
                className={`h-1.5 rounded-full ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {m.keterangan && (
              <p className='text-[11px] text-gray-400 leading-tight'>
                {m.keterangan}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FeedbackBody({ fb, soal, jawaban }) {
  return (
    <div className='px-4 py-4 border-t border-gray-100 space-y-3'>
      {jawaban?.trim() && (
        <div>
          <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
            Jawabanmu
          </div>
          <pre
            className={`whitespace-pre-wrap text-sm rounded-lg px-3 py-2.5 border border-gray-200 overflow-x-auto ${soal.tipe === "implementasi" ? "font-mono bg-gray-900 text-green-300 text-[12px]" : "bg-gray-50 text-gray-700 font-sans"}`}
          >
            {jawaban}
          </pre>
        </div>
      )}
      <p className='text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 leading-relaxed'>
        {fb.komentar}
      </p>
      {fb.yang_benar && (
        <div className='bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-sm text-green-800 leading-relaxed'>
          <span className='font-semibold'>✓ Yang sudah benar: </span>
          {fb.yang_benar}
        </div>
      )}
      {fb.yang_perlu_diperbaiki && (
        <div className='bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-800 leading-relaxed'>
          <span className='font-semibold'>✗ Perlu diperbaiki: </span>
          {fb.yang_perlu_diperbaiki}
        </div>
      )}
      {fb.konsep_lemah?.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap pt-1'>
          <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest'>
            Pelajari:
          </span>
          {fb.konsep_lemah.map((k) => (
            <span
              key={k}
              className='text-[11px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full'
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LATIHAN component — AI-generated questions for ADT List
// ---------------------------------------------------------------------------
function LatihanContent({ onQuestionEvaluated }) {
  const [fase, setFase] = useState("loading");
  const [soalList, setSoalList] = useState([]);
  const [genError, setGenError] = useState("");
  const [idx, setIdx] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [feedbackMap, setFeedbackMap] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState("");
  const [showNotasi, setShowNotasi] = useState(false);
  const [resultIdx, setResultIdx] = useState(0);
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);

  const STORAGE_KEY = "asd_latihan_list_soal";

  const generateSoal = useCallback(async (kelemahan = []) => {
    setFase("loading");
    setGenError("");
    try {
      const res = await fetch("/api/latihan-list/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jumlah: 5, kelemahan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal generate soal");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.soal));
      setSoalList(data.soal);
      setIdx(0);
      setJawaban({});
      setFeedbackMap({});
      setShowNotasi(false);
      setFase("latihan");
    } catch (e) {
      setGenError(e.message);
      setFase("error");
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSoalList(parsed);
          setFase("latihan");
          return;
        }
      }
    } catch {
      // ignore — fall through to generate
    }
    generateSoal([]);
  }, [generateSoal]);

  const evaluasiSoal = async () => {
    const soal = soalList[idx];
    setIsEvaluating(true);
    setEvalError("");
    try {
      const res = await fetch("/api/latihan-list/evaluasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soal, jawaban: jawaban[soal.id] ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Evaluasi gagal");
      setFeedbackMap((prev) => ({ ...prev, [soal.id]: data }));
      onQuestionEvaluated?.(soal.id);
    } catch (e) {
      setEvalError(e.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleLanjut = () => {
    if (idx < soalList.length - 1) {
      setIdx(idx + 1);
      setShowNotasi(false);
      setEvalError("");
    } else {
      setResultIdx(0);
      setFase("ringkasan");
    }
  };

  const handleGenerateBaru = () => {
    const kelemahan = [
      ...new Set(
        Object.values(feedbackMap).flatMap((f) => f.konsep_lemah ?? []),
      ),
    ];
    generateSoal(kelemahan);
  };

  const regenerateSoal = async (soalIdx) => {
    const target = soalList[soalIdx];
    setRegeneratingIdx(soalIdx);
    try {
      const res = await fetch("/api/latihan-list/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jumlah: 1,
          tipe_paksa: target.tipe,
          topik_referensi: target.topik,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal generate soal");
      const newSoal = { ...data.soal[0], id: target.id };
      const updatedList = soalList.map((s, i) => (i === soalIdx ? newSoal : s));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setSoalList(updatedList);
      setJawaban((prev) => {
        const next = { ...prev };
        delete next[target.id];
        return next;
      });
      setFeedbackMap((prev) => {
        const next = { ...prev };
        delete next[target.id];
        return next;
      });
      setShowNotasi(false);
    } catch {
      // silently ignore — user can retry
    } finally {
      setRegeneratingIdx(null);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (fase === "loading") {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
        <svg
          className='animate-spin w-8 h-8 mb-4 text-purple-500'
          viewBox='0 0 24 24'
          fill='none'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8v8z'
          />
        </svg>
        <p className='text-sm font-medium'>Menyiapkan soal latihan...</p>
        <p className='text-xs text-gray-400 mt-1'>
          AI sedang membuat soal untukmu
        </p>
      </div>
    );
  }

  if (fase === "error") {
    return (
      <div className='py-10 text-center'>
        <p className='text-red-600 text-sm mb-3'>{genError}</p>
        <button
          onClick={() => generateSoal([])}
          className='px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700'
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ── Ringkasan ──────────────────────────────────────────────────────────────
  if (fase === "ringkasan") {
    const allFeedbacks = soalList.map((s) => feedbackMap[s.id]).filter(Boolean);
    const avgSkor = allFeedbacks.length
      ? Math.round(
          allFeedbacks.reduce((a, f) => a + f.skor, 0) / allFeedbacks.length,
        )
      : 0;
    const konsepLemah = [
      ...new Set(allFeedbacks.flatMap((f) => f.konsep_lemah ?? [])),
    ];
    const soalLemah = soalList.filter(
      (s) => (feedbackMap[s.id]?.skor ?? 100) < 70,
    );
    const curSoal = soalList[resultIdx];
    const curFb = feedbackMap[curSoal?.id];

    return (
      <div className='text-[15px] text-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Hasil Latihan</h2>
            <p className='text-sm text-gray-500'>
              ADT List — Implementasi Array
            </p>
          </div>
        </div>

        {/* Overall score */}
        <div className='bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-5 text-white mb-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-200 text-sm font-medium'>
                Nilai Rata-rata
              </p>
              <p className='text-4xl font-bold'>
                {avgSkor}
                <span className='text-xl text-purple-300'>/100</span>
              </p>
            </div>
            <div className='text-right'>
              <p className='text-purple-200 text-sm'>Soal dievaluasi</p>
              <p className='text-2xl font-bold'>
                {allFeedbacks.length}/{soalList.length}
              </p>
            </div>
          </div>
          <div className='mt-3 bg-purple-500 rounded-full h-2'>
            <div
              className='bg-white h-2 rounded-full'
              style={{ width: `${avgSkor}%` }}
            />
          </div>
        </div>

        {/* Dot nav */}
        <div className='flex items-center gap-2 mb-5'>
          {soalList.map((sq, i) => {
            const f = feedbackMap[sq.id];
            let cls = "border-2 ";
            if (f)
              cls +=
                f.skor >= 70
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-red-400 border-red-400 text-white";
            else
              cls +=
                i === resultIdx
                  ? "bg-white border-purple-600 text-purple-600"
                  : "bg-gray-100 border-gray-300 text-gray-400";
            return (
              <button
                key={sq.id}
                onClick={() => setResultIdx(i)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}
              >
                {sq.id}
              </button>
            );
          })}
        </div>

        {/* Feedback card */}
        {curSoal && curFb && (
          <div className='border border-gray-200 rounded-xl overflow-hidden mb-4'>
            <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3'>
              <div className='w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>
                {curSoal.id}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap mb-1'>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === "implementasi" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}
                  >
                    {curSoal.tipe === "implementasi"
                      ? "Implementasi"
                      : "Pengetahuan"}
                  </span>
                  {curSoal.topik.map((t) => (
                    <span
                      key={t}
                      className='text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className='text-sm text-gray-800 font-medium whitespace-pre-line'>
                  {curSoal.pertanyaan}
                </p>
              </div>
              <button
                onClick={async () => {
                  await regenerateSoal(resultIdx);
                  setIdx(resultIdx);
                  setFase("latihan");
                }}
                disabled={regeneratingIdx !== null}
                title='Ganti soal ini dengan soal baru bertipe sama'
                className='shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5'
              >
                {regeneratingIdx === resultIdx ? (
                  <>
                    <Spinner /> Generating...
                  </>
                ) : (
                  <>↻ Ganti Soal</>
                )}
              </button>
            </div>
            <div className='px-4 py-3 border-b border-gray-100 flex items-center gap-3'>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[curFb.nilai] ?? NILAI_COLOR["Cukup"]}`}
              >
                {curFb.nilai}
              </span>
              <span className='text-sm font-semibold text-gray-700'>
                {curFb.skor}/100
              </span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full ${SKOR_BAR(curFb.skor)}`}
                  style={{ width: `${curFb.skor}%` }}
                />
              </div>
            </div>
            {curFb.metrik?.length > 0 && <MetrikBar metrik={curFb.metrik} />}
            <FeedbackBody
              fb={curFb}
              soal={curSoal}
              jawaban={jawaban[curSoal.id]}
            />
          </div>
        )}

        {/* Result prev/next */}
        <div className='flex items-center justify-between mb-6'>
          <button
            onClick={() => setResultIdx(Math.max(0, resultIdx - 1))}
            disabled={resultIdx === 0}
            className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          >
            ← Sebelumnya
          </button>
          <span className='text-sm text-gray-400'>
            Soal {resultIdx + 1} dari {soalList.length}
          </span>
          <button
            onClick={() =>
              setResultIdx(Math.min(soalList.length - 1, resultIdx + 1))
            }
            disabled={resultIdx === soalList.length - 1}
            className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
          >
            Berikutnya →
          </button>
        </div>

        {/* Weakness summary */}
        {konsepLemah.length > 0 && (
          <div className='border border-orange-200 rounded-xl overflow-hidden mb-4'>
            <div className='bg-orange-50 px-4 py-2.5 border-b border-orange-200'>
              <span className='text-orange-700 font-bold text-sm'>
                Analisis Kelemahan
              </span>
            </div>
            <div className='px-4 py-3'>
              {soalLemah.length > 0 && (
                <p className='text-sm text-gray-700 mb-3'>
                  {soalLemah.length} soal dengan skor di bawah 70 (
                  {soalLemah.map((s) => `Soal ${s.id}`).join(", ")}). Fokus
                  belajar di:
                </p>
              )}
              <div className='flex flex-wrap gap-2'>
                {konsepLemah.map((k) => (
                  <span
                    key={k}
                    className='text-[11px] bg-orange-50 border border-orange-300 text-orange-700 px-2.5 py-1 rounded-full font-medium'
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generate new CTA */}
        <div className='border border-purple-200 rounded-xl p-4 text-center bg-purple-50'>
          <p className='text-sm font-semibold text-purple-800 mb-1'>
            {konsepLemah.length > 0
              ? "Latihan soal baru untuk perkuat kelemahanmu"
              : "Kerjakan soal latihan baru"}
          </p>
          <p className='text-xs text-purple-600 mb-3'>
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(", ")}${konsepLemah.length > 3 ? "..." : ""}`
              : "AI akan membuat soal baru dengan tingkat kesulitan serupa"}
          </p>
          <button
            onClick={handleGenerateBaru}
            className='px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors'
          >
            Generate Soal Baru
          </button>
        </div>
      </div>
    );
  }

  // ── Latihan view ───────────────────────────────────────────────────────────
  if (!soalList.length) return null;
  const soal = soalList[idx];
  const currentJawaban = jawaban[soal.id] ?? "";
  const currentFeedback = feedbackMap[soal.id];
  const isLast = idx === soalList.length - 1;
  const totalEvaluated = soalList.filter((s) => feedbackMap[s.id]).length;

  return (
    <div className='text-[15px] text-gray-700'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold text-gray-900'>Soal Latihan</h2>
        <p className='text-sm text-gray-500 mt-0.5'>
          ADT List — Implementasi Array
        </p>
      </div>

      {/* Dot navigation */}
      <div className='flex items-center gap-2 mb-5'>
        {soalList.map((sq, i) => {
          const f = feedbackMap[sq.id];
          const isCur = i === idx;
          let cls = "border-2 ";
          if (f)
            cls +=
              f.skor >= 70
                ? "bg-green-500 border-green-500 text-white"
                : "bg-red-400 border-red-400 text-white";
          else if (isCur)
            cls += jawaban[sq.id]?.trim()
              ? "bg-purple-600 border-purple-600 text-white"
              : "bg-white border-purple-600 text-purple-600";
          else
            cls += jawaban[sq.id]?.trim()
              ? "bg-purple-100 border-purple-400 text-purple-700"
              : "bg-gray-100 border-gray-300 text-gray-400";
          return (
            <button
              key={sq.id}
              onClick={() => {
                setIdx(i);
                setShowNotasi(false);
                setEvalError("");
              }}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}
            >
              {f ? sq.id : jawaban[sq.id]?.trim() ? "✓" : sq.id}
            </button>
          );
        })}
        <span className='ml-2 text-xs text-gray-400'>
          {totalEvaluated}/{soalList.length} dinilai
        </span>
      </div>

      {/* Question card */}
      <div className='border border-gray-200 rounded-xl overflow-hidden'>
        {/* Card header */}
        <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3'>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${currentFeedback ? (currentFeedback.skor >= 70 ? "bg-green-500 text-white" : "bg-red-400 text-white") : currentJawaban.trim() ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            {currentJawaban.trim() && !currentFeedback ? "✓" : soal.id}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap mb-1.5'>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === "implementasi" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}
              >
                {soal.tipe === "implementasi" ? "Implementasi" : "Pengetahuan"}
              </span>
              {soal.topik.map((t) => (
                <span
                  key={t}
                  className='text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'
                >
                  {t}
                </span>
              ))}
            </div>
            <p className='text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line'>
              {soal.pertanyaan}
            </p>
          </div>
          <button
            onClick={() => regenerateSoal(idx)}
            disabled={regeneratingIdx !== null || isEvaluating}
            title='Ganti soal ini dengan soal baru bertipe sama'
            className='shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5'
          >
            {regeneratingIdx === idx ? (
              <>
                <Spinner /> Generating...
              </>
            ) : (
              <>↻ Ganti Soal</>
            )}
          </button>
        </div>

        {/* Notasi Algoritma */}
        {soal.notasiAlgoritma && (
          <div className='px-4 py-2.5 bg-gray-50 border-b border-gray-200'>
            <button
              onClick={() => setShowNotasi((v) => !v)}
              className='text-xs text-purple-600 hover:underline font-medium flex items-center gap-1'
            >
              <span>{showNotasi ? "▾" : "▸"}</span>
              <span>Notasi Algoritma (referensi)</span>
            </button>
            {showNotasi && (
              <pre className='mt-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-mono text-gray-700 overflow-x-auto leading-relaxed'>
                {soal.notasiAlgoritma}
              </pre>
            )}
          </div>
        )}

        {/* Answer textarea */}
        {!currentFeedback && (
          <div className='px-4 py-3'>
            <textarea
              key={soal.id}
              value={currentJawaban}
              onChange={(e) =>
                setJawaban((prev) => ({ ...prev, [soal.id]: e.target.value }))
              }
              placeholder={
                soal.tipe === "implementasi"
                  ? "// Tulis algoritma atau kode kamu di sini..."
                  : "Tulis jawabanmu di sini..."
              }
              rows={soal.tipe === "implementasi" ? 12 : 6}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-y transition ${soal.tipe === "implementasi" ? "font-mono bg-gray-900 text-green-300" : "bg-white text-gray-700"}`}
              spellCheck={false}
            />
          </div>
        )}

        {/* Inline feedback */}
        {currentFeedback && (
          <>
            <div className='px-4 py-3 border-t border-gray-100 flex items-center gap-3'>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[currentFeedback.nilai] ?? NILAI_COLOR["Cukup"]}`}
              >
                {currentFeedback.nilai}
              </span>
              <span className='text-sm font-semibold text-gray-700'>
                {currentFeedback.skor}/100
              </span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full ${SKOR_BAR(currentFeedback.skor)}`}
                  style={{ width: `${currentFeedback.skor}%` }}
                />
              </div>
            </div>
            {currentFeedback.metrik?.length > 0 && (
              <MetrikBar metrik={currentFeedback.metrik} />
            )}
            <FeedbackBody
              fb={currentFeedback}
              soal={soal}
              jawaban={jawaban[soal.id]}
            />
          </>
        )}
      </div>

      {evalError && (
        <div className='mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700'>
          <span className='font-semibold'>Error: </span>
          {evalError}
        </div>
      )}

      {/* Bottom nav */}
      <div className='mt-4 flex flex-wrap items-center justify-between gap-2'>
        <button
          onClick={() => {
            setIdx(Math.max(0, idx - 1));
            setShowNotasi(false);
            setEvalError("");
          }}
          disabled={idx === 0}
          className='flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-10'
        >
          ← Sebelumnya
        </button>

        <span className='text-sm text-gray-400 shrink-0 order-last sm:order-0 w-full sm:w-auto text-center'>
          Soal {idx + 1} dari {soalList.length}
        </span>

        <div className='flex items-center gap-2'>
          {!currentFeedback ? (
            <button
              onClick={evaluasiSoal}
              disabled={isEvaluating || !currentJawaban.trim()}
              className='flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors min-h-10'
            >
              {isEvaluating ? (
                <>
                  <Spinner /> Menilai...
                </>
              ) : (
                "Nilai Soal Ini"
              )}
            </button>
          ) : (
            <button
              onClick={handleLanjut}
              className='flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold rounded-lg transition-colors min-h-10'
            >
              {isLast ? "Lihat Hasil" : "Soal Berikutnya →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RINGKASAN content
// ---------------------------------------------------------------------------
function RingkasanContent() {
  return (
    <div className='text-[15px] text-gray-700'>
      {/* ── Title ── */}
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-gray-900'>
          Ringkasan — ADT List
        </h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Implementasi List dengan Array
        </p>
      </div>

      {/* ── Key takeaways ── */}
      <div className='grid grid-cols-1 gap-4 mb-6'>
        {/* 1 — Definisi & Istilah */}
        <div className='border border-purple-100 rounded-xl overflow-hidden'>
          <div className='bg-purple-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-purple-600 text-xs font-bold flex items-center justify-center shrink-0'>
              1
            </span>
            <span className='text-white font-bold text-sm'>
              Definisi &amp; Istilah
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 text-[13px]'>
              {[
                {
                  term: "List",
                  def: "Kumpulan elemen bertipe sama, terurut",
                  color: "bg-purple-50 border-purple-100 text-purple-800",
                },
                {
                  term: "head",
                  def: "Elemen pertama list",
                  color: "bg-indigo-50 border-indigo-100 text-indigo-800",
                },
                {
                  term: "length",
                  def: "Jumlah elemen efektif",
                  color: "bg-blue-50 border-blue-100 text-blue-800",
                },
                {
                  term: "traversal",
                  def: "Kunjungi elemen satu per satu, ujung ke ujung",
                  color: "bg-teal-50 border-teal-100 text-teal-800",
                },
              ].map((item) => (
                <div
                  key={item.term}
                  className={`border rounded-lg px-3 py-2 ${item.color}`}
                >
                  <code className='font-mono font-bold text-[12px] block mb-0.5'>
                    {item.term}
                  </code>
                  <div className='text-[11px] opacity-80'>{item.def}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2 — Operasi */}
        <div className='border border-indigo-100 rounded-xl overflow-hidden'>
          <div className='bg-indigo-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0'>
              2
            </span>
            <span className='text-white font-bold text-sm'>Operasi Utama</span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]'>
              {[
                {
                  group: "Dasar",
                  ops: "isEmpty, length, getElmt, setElmt, indexOf, concat",
                  color: "bg-gray-50 border-gray-200 text-gray-700",
                },
                {
                  group: "Insert",
                  ops: "insertFirst, insertAt, insertLast",
                  color: "bg-green-50 border-green-100 text-green-800",
                },
                {
                  group: "Delete",
                  ops: "deleteFirst, deleteAt, deleteLast",
                  color: "bg-red-50 border-red-100 text-red-800",
                },
              ].map((item) => (
                <div
                  key={item.group}
                  className={`border rounded-lg px-3 py-2 ${item.color}`}
                >
                  <div className='font-bold mb-1'>{item.group}</div>
                  <code className='text-[11px] font-mono opacity-80 leading-relaxed'>
                    {item.ops}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 — 5 Alternatif */}
        <div className='border border-blue-100 rounded-xl overflow-hidden'>
          <div className='bg-blue-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shrink-0'>
              3
            </span>
            <span className='text-white font-bold text-sm'>
              5 Alternatif Implementasi
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-5 gap-2 text-[12px]'>
              {[
                {
                  alt: "alt-1a",
                  rep: "Implisit",
                  pos: "Rata kiri",
                  color: "bg-gray-50 border-gray-200",
                },
                {
                  alt: "alt-2a",
                  rep: "Eksplisit",
                  pos: "Rata kiri",
                  color: "bg-purple-50 border-purple-100",
                },
                {
                  alt: "alt-1b",
                  rep: "Implisit",
                  pos: "Tidak rata kiri",
                  color: "bg-blue-50 border-blue-100",
                },
                {
                  alt: "alt-2b",
                  rep: "Eksplisit",
                  pos: "Tidak rata kiri",
                  color: "bg-teal-50 border-teal-100",
                },
                {
                  alt: "alt-3",
                  rep: "Implisit",
                  pos: "Tersebar",
                  color: "bg-orange-50 border-orange-100",
                },
              ].map((item) => (
                <div
                  key={item.alt}
                  className={`border rounded-lg px-2 py-2 ${item.color} text-center`}
                >
                  <code className='font-mono font-bold text-[11px] block mb-0.5'>
                    {item.alt}
                  </code>
                  <div className='text-[10px] opacity-70'>{item.rep}</div>
                  <div className='text-[10px] opacity-70'>{item.pos}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 — Efisiensi */}
        <div className='border border-teal-100 rounded-xl overflow-hidden'>
          <div className='bg-teal-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-teal-600 text-xs font-bold flex items-center justify-center shrink-0'>
              4
            </span>
            <span className='text-white font-bold text-sm'>
              Perbandingan Efisiensi Kunci
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 gap-2 text-[13px]'>
              {[
                {
                  op: "length",
                  alt1: "O(n) — traversal sampai MARK",
                  alt2: "O(1) — langsung nEff",
                  winner: "alt-2",
                },
                {
                  op: "insertFirst / deleteFirst",
                  alt1: "O(n) — geser semua elemen",
                  altb: "O(1) — geser pointer",
                  winner: "alt-b",
                },
                {
                  op: "delete (tanpa geser)",
                  altx: "O(1) — set MARK",
                  note: "alt-3",
                  winner: "alt-3",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className='border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'
                >
                  <code className='font-mono font-bold text-[12px] text-gray-800'>
                    {item.op}
                  </code>
                  <div className='mt-1 grid grid-cols-2 gap-2 text-[11px]'>
                    {item.alt1 && (
                      <div className='bg-red-50 border border-red-100 rounded px-2 py-1 text-red-700'>
                        alt-a: {item.alt1}
                      </div>
                    )}
                    {item.alt2 && (
                      <div className='bg-green-50 border border-green-100 rounded px-2 py-1 text-green-700'>
                        alt-2: {item.alt2}
                      </div>
                    )}
                    {item.altb && (
                      <div className='bg-green-50 border border-green-100 rounded px-2 py-1 text-green-700'>
                        alt-b: {item.altb}
                      </div>
                    )}
                    {item.altx && (
                      <div className='bg-green-50 border border-green-100 rounded px-2 py-1 text-green-700 col-span-2'>
                        {item.note}: {item.altx}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5 — Tips & Pola Traversal */}
        <div className='border border-gray-200 rounded-xl overflow-hidden'>
          <div className='bg-gray-800 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-gray-800 text-xs font-bold flex items-center justify-center shrink-0'>
              5
            </span>
            <span className='text-white font-bold text-sm'>
              Pola Traversal per Alternatif
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]'>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Alt-1 (implisit)
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed'>{`i ← 0
while contents[i] ≠ MARK
    { proses }
    i ← i + 1`}</pre>
              </div>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Alt-2 (eksplisit)
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed'>{`i traversal
    [0..l.nEff-1]
    { proses }`}</pre>
              </div>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Alt-3 (tersebar)
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed'>{`i traversal
    [0..CAPACITY-1]
    if ≠ MARK then
        { proses }`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pola utama ── */}
      <div className='bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6'>
        <p className='text-sm font-bold text-purple-800 mb-2'>
          Aturan Praktis Memilih Alternatif
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]'>
          <div className='bg-white border border-purple-100 rounded-lg px-3 py-2 text-purple-900'>
            <div className='font-bold mb-0.5'>Butuh length yang cepat?</div>
            <div className='opacity-80'>
              → Gunakan <code className='font-mono'>alt-2</code> (eksplisit)
            </div>
          </div>
          <div className='bg-white border border-purple-100 rounded-lg px-3 py-2 text-purple-900'>
            <div className='font-bold mb-0.5'>
              Sering insertFirst/deleteFirst?
            </div>
            <div className='opacity-80'>
              → Gunakan <code className='font-mono'>alt-b</code> (tidak rata
              kiri)
            </div>
          </div>
          <div className='bg-white border border-purple-100 rounded-lg px-3 py-2 text-purple-900'>
            <div className='font-bold mb-0.5'>
              Sering delete acak, jarang insert?
            </div>
            <div className='opacity-80'>
              → Pertimbangkan <code className='font-mono'>alt-3</code>{" "}
              (tersebar)
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick reference ── */}
      <div className='border border-gray-200 rounded-xl p-4 bg-gray-50'>
        <p className='text-sm font-bold text-gray-700 mb-3'>
          Notasi Algoritmik — Referensi Cepat (alt-2a)
        </p>
        <pre className='bg-gray-900 text-green-300 rounded-lg px-4 py-3 font-mono text-[12px] leading-relaxed overflow-x-auto'>{`constant CAPACITY  : integer = 100
constant IDX_UNDEF : integer = -1

type ElType : integer
type List   : < contents : array [0..CAPACITY-1] of ElType
                nEff     : integer ≥ 0 >

{ Konstruktor }
procedure CreateList(output l: List)
{ l.nEff ← 0 }

{ length — O(1) }
function length(l: List) → integer
{ → l.nEff }

{ insertAt — geser dari kanan, perbarui nEff }
procedure insertAt(input/output l: List, input x: ElType, input idx: integer)
{ if length(l) < CAPACITY then
      i traversal [length(l)..idx+1]: l.contents[i] ← l.contents[i-1]
      l.contents[idx] ← x
      l.nEff ← l.nEff + 1 }`}</pre>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress helpers
// ---------------------------------------------------------------------------
const PROGRESS_KEY = "asd_progress_list";
const TOPIC_SLUG   = "list";
const TAB_KEYS = {
  MATERI: "materi",
  CONTOH: "contoh",
  LATIHAN: "latihan",
  RINGKASAN: "ringkasan",
};




// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function ListPage() {
  const [activeTab, setActiveTab] = useState("MATERI");
  const [latihanMode, setLatihanMode] = useState('ai');
  const [activeSection, setActiveSection] = useState("intro");
  const [showToc, setShowToc] = useState(false);
  const [completed, setCompleted] = useState({ materi: false, contoh: false, latihan: false, ringkasan: false });

  useEffect(() => {
    fetchTopicProgress('list').then((prog) => {
      if (prog) setCompleted({ materi: !!prog.materi, contoh: !!prog.contoh, latihan: !!prog.latihan, ringkasan: !!prog.ringkasan });
    });
  }, []);
  const mainRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowToc(false);
  };

  const handleComplete = (tab) => {
    const key = TAB_KEYS[tab];
    if (!key || completed[key]) return;
    const next = { ...completed, [key]: true };
    setCompleted(next);
    saveTopicProgress('list', next);
  };

  const handleQuestionEvaluated = useCallback((questionId) => {
    try {
      const evaluated = new Set(JSON.parse(localStorage.getItem('asd_evaluated_list') ?? '[]'));
      evaluated.add(questionId);
      localStorage.setItem('asd_evaluated_list', JSON.stringify([...evaluated]));
    } catch {}
  }, []);

  // Sidebar highlight on scroll
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const handleScroll = () => {
      const scrollY = main.scrollTop + 120;
      let current = "intro";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) current = s.id;
      }
      setActiveSection(current);
    };
    main.addEventListener("scroll", handleScroll, { passive: true });
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    const main = mainRef.current;
    if (el && main) {
      main.scrollTo({ top: el.offsetTop - 110, behavior: "smooth" });
    }
  };

  return (
    <div
      className='flex flex-col lg:flex-row overflow-hidden'
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* ── Sidebar (desktop only) ── */}
      <aside className='hidden lg:block w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto'>
        <div className='py-3'>
          <div className='px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest'>
            ADT List
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${
                s.level === 1 ? "pl-7" : ""
              } ${
                activeSection === s.id
                  ? "bg-purple-50 text-purple-700 font-semibold border-r-2 border-purple-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className='flex-1 flex flex-col min-w-0 bg-white overflow-hidden'>
        {/* Back navigation */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 pb-2">
          <Link
            href="/dashboard/topik"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Topik
          </Link>
        </div>
        {/* Tabs */}
        <div className='shrink-0 border-b border-gray-200 bg-white overflow-x-auto'>
          <div className='flex gap-1 px-3 sm:px-6 pt-3 min-w-max'>
            {TABS.map((tab) => {
              const isDone = completed[TAB_KEYS[tab]];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-purple-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                  {isDone && (
                    <svg
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-green-300" : "text-green-500"}`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile TOC toggle — MATERI tab only */}
        {activeTab === "MATERI" && (
          <div className='lg:hidden shrink-0 bg-gray-50 border-b border-gray-200'>
            <button
              onClick={() => setShowToc((v) => !v)}
              className='w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 active:bg-gray-100'
            >
              <span className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h10'
                  />
                </svg>
                Daftar Isi
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showToc ? "rotate-180" : ""}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
            {showToc && (
              <div className='max-h-52 overflow-y-auto border-t border-gray-100 bg-white'>
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      scrollToSection(s.id);
                      setShowToc(false);
                    }}
                    className={`w-full text-left text-[13px] px-4 py-2 transition-colors ${
                      s.level === 1 ? "pl-8" : ""
                    } ${
                      activeSection === s.id
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div ref={mainRef} className='flex-1 overflow-y-auto'>
          <div className='max-w-3xl mx-auto px-4 sm:px-8 py-5 sm:py-6'>
            {activeTab === "MATERI" && <MateriContent />}
            {activeTab === "CONTOH" && <ContohContent />}
            {activeTab === "LATIHAN" && (
              <div>
                <div className='flex gap-1 mb-5 p-1 bg-gray-100 rounded-xl w-fit'>
                  <button
                    onClick={() => setLatihanMode('ai')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      latihanMode === 'ai' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Soal dari AI
                  </button>
                  <button
                    onClick={() => setLatihanMode('sendiri')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      latihanMode === 'sendiri' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Soal Sendiri
                  </button>
                </div>
                {latihanMode === 'ai'
                  ? <LatihanContent onQuestionEvaluated={handleQuestionEvaluated} />
                  : <SoalSendiriPanel topicSlug={TOPIC_SLUG} onGoToMateri={() => setActiveTab('MATERI')} />}
              </div>
            )}
            {activeTab === "RINGKASAN" && <RingkasanContent />}

            {/* Section completion footer */}
            <div className='mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between'>
              <p className='text-sm text-gray-400'>
                {Object.values(completed).filter(Boolean).length} dari 4 sesi
                diselesaikan
              </p>
              {completed[TAB_KEYS[activeTab]] ? (
                <div className='flex items-center gap-2 text-green-600 text-sm font-semibold'>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  sesi ini telah diselesaikan
                </div>
              ) : (
                <button
                  onClick={() => handleComplete(activeTab)}
                  className='w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold rounded-lg transition-colors'
                >
                  Tandai Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
