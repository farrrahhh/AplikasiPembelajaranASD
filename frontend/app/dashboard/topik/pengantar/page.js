'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// Sidebar section definitions
// ---------------------------------------------------------------------------
const SECTIONS = [
  { id: 'intro', title: 'Algoritma & Struktur Data', level: 0 },
  { id: 'prosedural', title: 'Paradigma Prosedural', level: 0 },
  { id: 'adt', title: 'Abstract Data Type (ADT)', level: 0 },
  { id: 'kenapa-adt', title: 'Kenapa ADT Penting?', level: 0 },
  { id: 'struktur-dasar', title: 'Struktur Data Dasar', level: 0 },
  { id: 'record', title: 'Record atau Tuple', level: 1 },
  { id: 'array', title: 'Array', level: 1 },
  { id: 'linked', title: 'Linked Structure', level: 1 },
  { id: 'adt-umum', title: 'ADT Umum yang Sering Dipakai', level: 0 },
  { id: 'stack', title: 'Stack', level: 0 },
  { id: 'queue', title: 'Queue', level: 0 },
  { id: 'tree', title: 'Tree', level: 0 },
  { id: 'binary-tree', title: 'Binary Tree & BST', level: 0 },
  { id: 'graph', title: 'Graph', level: 0 },
  { id: 'notasi', title: 'Notasi Algoritmik', level: 0 },
  { id: 'translasi', title: 'Translasi ke Bahasa C', level: 0 },
  { id: 'dasar-c', title: 'Dasar Bahasa C', level: 0 },
  { id: 'variabel', title: 'Variabel dan Konstanta', level: 1 },
  { id: 'tipe', title: 'Tipe Data Dasar', level: 1 },
  { id: 'assignment', title: 'Assignment', level: 1 },
  { id: 'io', title: 'Input dan Output', level: 1 },
  { id: 'percabangan', title: 'Percabangan', level: 1 },
  { id: 'pengulangan', title: 'Pengulangan', level: 1 },
  { id: 'fungsi', title: 'Fungsi dan Prosedur', level: 1 },
  { id: 'pointer', title: 'Pointer', level: 1 },
  { id: 'modularitas', title: 'Modularitas Program C', level: 0 },
];

const TABS = ['MATERI', 'CONTOH', 'LATIHAN', 'RINGKASAN'];

// ---------------------------------------------------------------------------
// Primitive building blocks
// ---------------------------------------------------------------------------

function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="text-xl font-bold text-gray-900 mt-10 mb-3 pb-2 border-b-2 border-gray-200 scroll-mt-28"
    >
      {children}
    </h2>
  );
}

function SubHeading({ id, children }) {
  return (
    <h3
      id={id}
      className="text-base font-bold text-gray-800 mt-6 mb-2 scroll-mt-28"
    >
      {children}
    </h3>
  );
}

function P({ children, className = '' }) {
  return <p className={`mb-3 leading-relaxed ${className}`}>{children}</p>;
}

function Mono({ children }) {
  return (
    <code className="bg-gray-100 text-blue-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200">
      {children}
    </code>
  );
}

function CodeBlock({ language, children }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 text-[13px]">
      {language && (
        <div className="bg-gray-700 text-gray-300 px-4 py-1 font-mono text-xs tracking-wide">
          {language}
        </div>
      )}
      <pre className="bg-gray-900 text-green-300 px-5 py-4 overflow-x-auto font-mono leading-relaxed">
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}

function Pseudocode({ children }) {
  return (
    <pre className="my-4 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed">
      {children.trim()}
    </pre>
  );
}

function AsciiBox({ children }) {
  return (
    <pre className="my-4 bg-blue-50 border border-blue-100 rounded-lg px-5 py-4 text-[13px] font-mono text-blue-900 overflow-x-auto leading-relaxed">
      {children.trim()}
    </pre>
  );
}

function NoteBox({ children }) {
  return (
    <div className="my-4 bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded-r-lg text-sm text-gray-700">
      <span className="font-semibold text-yellow-700">Catatan: </span>
      {children}
    </div>
  );
}

function InfoBox({ children }) {
  return (
    <div className="my-4 bg-blue-50 border-l-4 border-blue-500 px-4 py-3 rounded-r-lg text-sm text-gray-700">
      {children}
    </div>
  );
}

function UL({ items }) {
  return (
    <ul className="my-3 space-y-1 list-disc list-inside ml-2 text-[15px] text-gray-700">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function W3Table({ headers, rows }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="bg-gray-800 text-white px-4 py-2.5 text-left font-semibold border-r border-gray-600 last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 text-gray-700 border-t border-gray-100 border-r last:border-r-0"
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

function SideBySide({ leftLabel, rightLabel, left, right }) {
  return (
    <div className="my-4 grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{leftLabel}</div>
        {left}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{rightLabel}</div>
        {right}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="my-8 border-gray-200" />;
}

// ---------------------------------------------------------------------------
// MATERI full content
// ---------------------------------------------------------------------------
function MateriContent() {
  return (
    <div className="text-[15px] text-gray-700">

      {/* ── 1. Intro ──────────────────────────────────────────── */}
      <SectionHeading id="intro">Algoritma &amp; Struktur Data</SectionHeading>
      <P>
        <strong>Algoritma</strong> adalah langkah-langkah terurut untuk menyelesaikan masalah.
      </P>
      <P>
        <strong>Struktur data</strong> adalah cara menyimpan dan mengatur data agar mudah digunakan oleh program.
      </P>
      <P>Sederhananya:</P>
      <AsciiBox>{`Algoritma + Struktur Data = Program`}</AsciiBox>
      <P>Contoh — algoritma mencari nilai terbesar dari 5 angka:</P>
      <Pseudocode>{`Masalah:
  Mencari nilai terbesar dari 5 angka.

Algoritma:
  1. Ambil angka pertama sebagai nilai terbesar sementara.
  2. Bandingkan dengan angka kedua.
  3. Jika angka kedua lebih besar, jadikan angka kedua sebagai nilai terbesar.
  4. Ulangi sampai semua angka dicek.
  5. Tampilkan nilai terbesar.`}</Pseudocode>
      <Divider />

      {/* ── 2. Prosedural ─────────────────────────────────────── */}
      <SectionHeading id="prosedural">Paradigma Prosedural</SectionHeading>
      <P>
        Paradigma prosedural adalah cara membuat program berdasarkan urutan instruksi, fungsi, dan prosedur.
      </P>
      <P>Contoh alur program prosedural:</P>
      <AsciiBox>{`Input data
    ↓
Proses data
    ↓
Output hasil`}</AsciiBox>
      <P>Dalam paradigma prosedural, program biasanya dibagi menjadi:</P>
      <AsciiBox>{`Program utama
Fungsi
Prosedur`}</AsciiBox>
      <P>Contoh <strong>fungsi</strong> dalam C (mengembalikan nilai):</P>
      <CodeBlock language="c">{`
int square(int x) {
    return x * x;
}
`}</CodeBlock>
      <P>Contoh <strong>prosedur</strong> dalam C (tidak mengembalikan nilai):</P>
      <CodeBlock language="c">{`
void printHello() {
    printf("Hello");
}
`}</CodeBlock>
      <P>Perbedaan utama:</P>
      <W3Table
        headers={['Konsep', 'Mengembalikan Nilai?', 'Contoh']}
        rows={[
          ['Fungsi', 'Ya', 'square()'],
          ['Prosedur', 'Tidak', 'printHello()'],
        ]}
      />
      <Divider />

      {/* ── 3. ADT ────────────────────────────────────────────── */}
      <SectionHeading id="adt">Abstract Data Type (ADT)</SectionHeading>
      <P>
        <strong>ADT</strong> adalah tipe data yang didefinisikan berdasarkan <em>data yang disimpan</em> dan{' '}
        <em>operasi yang bisa dilakukan</em>.
      </P>
      <P>
        ADT tidak hanya memikirkan &ldquo;datanya apa&rdquo;, tetapi juga &ldquo;operasinya apa&rdquo;.
      </P>
      <P>Contoh ADT <Mono>Time</Mono>:</P>
      <AsciiBox>{`+----------------------+
|       ADT Time       |
+----------------------+
| Data                 |
|   - hours            |
|   - minutes          |
|   - seconds          |
+----------------------+
| Operasi              |
|   - CreateTime       |
|   - getHours         |
|   - getMinutes       |
|   - getSeconds       |
|   - difference       |
+----------------------+`}</AsciiBox>
      <P>Contoh penggunaan:</P>
      <Pseudocode>{`CreateTime(t1, 13, 45, 0)
CreateTime(t2, 14, 30, 0)

difference(t1, t2)`}</Pseudocode>
      <P>
        Dengan ADT, kita tidak perlu menulis ulang detail perhitungan setiap kali memakai data waktu.
      </P>
      <Divider />

      {/* ── 4. Kenapa ADT ─────────────────────────────────────── */}
      <SectionHeading id="kenapa-adt">Kenapa ADT Penting?</SectionHeading>
      <SideBySide
        leftLabel="Tanpa ADT"
        rightLabel="Dengan ADT"
        left={
          <Pseudocode>{`h1 ← 13
m1 ← 45
s1 ← 0

h2 ← 14
m2 ← 30
s2 ← 0

ss1 ← h1*3600 + m1*60 + s1
ss2 ← h2*3600 + m2*60 + s2

selisih ← ss2 - ss1`}</Pseudocode>
        }
        right={
          <Pseudocode>{`CreateTime(t1, 13, 45, 0)
CreateTime(t2, 14, 30, 0)


selisih ← difference(t1, t2)`}</Pseudocode>
        }
      />
      <P>ADT membuat program:</P>
      <UL items={[
        'Lebih rapi dan terstruktur',
        'Lebih mudah digunakan ulang (reusable)',
        'Lebih mudah diuji',
        'Lebih aman dari kesalahan logika',
      ]} />
      <Divider />

      {/* ── 5. Struktur Data Dasar ────────────────────────────── */}
      <SectionHeading id="struktur-dasar">Struktur Data Dasar</SectionHeading>

      <SubHeading id="record">Record atau Tuple</SubHeading>
      <P>
        Record adalah struktur data yang berisi beberapa nilai dengan nama tertentu.
      </P>
      <P>Contoh:</P>
      <Pseudocode>{`Point = <x, y>
Time  = <hours, minutes, seconds>`}</Pseudocode>
      <P>Dalam C menggunakan <Mono>struct</Mono>:</P>
      <CodeBlock language="c">{`
typedef struct Point {
    int x;
    int y;
} point;
`}</CodeBlock>
      <AsciiBox>{`Point
+-----+-----+
|  x  |  y  |
+-----+-----+`}</AsciiBox>
      <P>
        Cocok untuk data yang terdiri dari beberapa atribut, misalnya{' '}
        <Mono>Mahasiswa</Mono> dengan atribut nama, nim, dan jurusan.
      </P>

      <SubHeading id="array">Array</SubHeading>
      <P>
        Array adalah kumpulan data <strong>bertipe sama</strong> yang disimpan berurutan di memori.
      </P>
      <CodeBlock language="c">{`
int angka[5] = {10, 20, 30, 40, 50};
`}</CodeBlock>
      <AsciiBox>{`Index:   0    1    2    3    4
Value:  10   20   30   40   50`}</AsciiBox>
      <W3Table
        headers={['', 'Keterangan']}
        rows={[
          ['✅ Kelebihan', 'Akses data sangat cepat menggunakan indeks — O(1)'],
          ['⚠️ Kekurangan', 'Ukuran tetap; menambah/menghapus di tengah perlu menggeser elemen'],
        ]}
      />
      <P>Contoh akses elemen:</P>
      <CodeBlock language="c">{`
printf("%d", angka[0]);   // Output: 10
printf("%d", angka[2]);   // Output: 30
`}</CodeBlock>

      <SubHeading id="linked">Linked Structure (Struktur Berkait)</SubHeading>
      <P>
        Struktur berkait menyimpan data dalam bentuk <strong>node</strong>. Setiap node memiliki
        data dan pointer ke node berikutnya.
      </P>
      <AsciiBox>{`+------+------+     +------+------+     +------+------+
|  10  | next |---->|  20  | next |---->|  30  | NULL |
+------+------+     +------+------+     +------+------+`}</AsciiBox>
      <W3Table
        headers={['', 'Keterangan']}
        rows={[
          ['✅ Kelebihan', 'Mudah menambah dan menghapus elemen di mana saja'],
          ['⚠️ Kekurangan', 'Tidak bisa akses langsung; harus menelusuri dari node awal — O(n)'],
        ]}
      />
      <Divider />

      {/* ── 6. ADT Umum ───────────────────────────────────────── */}
      <SectionHeading id="adt-umum">ADT Umum yang Sering Dipakai</SectionHeading>
      <W3Table
        headers={['ADT', 'Konsep', 'Contoh Penggunaan']}
        rows={[
          ['List', 'Data berurutan', 'Daftar mahasiswa'],
          ['Matrix', 'Data 2 dimensi', 'Tabel, grid permainan'],
          ['Stack', 'Last In, First Out (LIFO)', 'Undo, call stack'],
          ['Queue', 'First In, First Out (FIFO)', 'Antrian printer'],
          ['Set', 'Kumpulan elemen unik', 'ID unik, tag'],
          ['Map', 'Pasangan key → value', 'Kamus, konfigurasi'],
          ['Tree', 'Data hierarkis', 'Folder file, HTML DOM'],
          ['Binary Search Tree', 'Tree terurut untuk pencarian', 'Database index'],
          ['Graph', 'Node dan edge', 'Peta jalan, social network'],
        ]}
      />
      <Divider />

      {/* ── 7. Stack ──────────────────────────────────────────── */}
      <SectionHeading id="stack">Stack</SectionHeading>
      <P>
        Stack adalah struktur data dengan prinsip{' '}
        <strong>Last In, First Out (LIFO)</strong> — data yang terakhir masuk
        akan keluar lebih dulu.
      </P>
      <AsciiBox>{`  Push 10 → Push 20 → Push 30

  +----+
  | 30 |  ← top (keluar duluan)
  +----+
  | 20 |
  +----+
  | 10 |
  +----+`}</AsciiBox>
      <P>Operasi umum:</P>
      <W3Table
        headers={['Operasi', 'Fungsi']}
        rows={[
          ['push(x)', 'Menambah elemen x ke atas stack'],
          ['pop()', 'Mengambil & menghapus elemen paling atas'],
          ['top()', 'Melihat elemen paling atas tanpa menghapus'],
          ['isEmpty()', 'Mengembalikan true jika stack kosong'],
        ]}
      />
      <P>Contoh penggunaan stack dalam kehidupan nyata:</P>
      <UL items={[
        'Fitur Undo / Redo di teks editor',
        'Tombol Back di browser (riwayat halaman)',
        'Call stack — urutan pemanggilan fungsi dalam program',
      ]} />
      <Divider />

      {/* ── 8. Queue ──────────────────────────────────────────── */}
      <SectionHeading id="queue">Queue</SectionHeading>
      <P>
        Queue adalah struktur data dengan prinsip{' '}
        <strong>First In, First Out (FIFO)</strong> — data yang masuk pertama akan keluar pertama.
      </P>
      <AsciiBox>{`  Masuk dari belakang (enqueue)
            ↓
  [ 10 ] [ 20 ] [ 30 ]
    ↑
  Keluar dari depan (dequeue)`}</AsciiBox>
      <P>Operasi umum:</P>
      <W3Table
        headers={['Operasi', 'Fungsi']}
        rows={[
          ['enqueue(x)', 'Menambah elemen x ke belakang antrian'],
          ['dequeue()', 'Mengambil & menghapus elemen paling depan'],
          ['front()', 'Melihat elemen paling depan tanpa menghapus'],
          ['isEmpty()', 'Mengembalikan true jika queue kosong'],
        ]}
      />
      <P>Contoh penggunaan:</P>
      <UL items={['Antrian printer', 'Antrian customer service', 'Task scheduler sistem operasi']} />
      <Divider />

      {/* ── 9. Tree ───────────────────────────────────────────── */}
      <SectionHeading id="tree">Tree</SectionHeading>
      <P>
        Tree adalah struktur data <strong>hierarkis</strong> yang terdiri dari node-node yang
        terhubung seperti pohon terbalik.
      </P>
      <AsciiBox>{`          A          ← Root
         / \\
        B   C        ← Child dari A
       / \\
      D   E          ← Leaf (tidak punya child)`}</AsciiBox>
      <W3Table
        headers={['Istilah', 'Pengertian']}
        rows={[
          ['Root', 'Node paling atas (A)'],
          ['Node', 'Setiap elemen dalam tree'],
          ['Child', 'Node di bawah node lain (B dan C adalah child dari A)'],
          ['Parent', 'Node di atas node lain (A adalah parent dari B dan C)'],
          ['Leaf', 'Node yang tidak punya child (C, D, E)'],
        ]}
      />
      <P>Contoh penggunaan:</P>
      <UL items={['Struktur folder di sistem operasi', 'HTML DOM (Document Object Model)', 'Struktur organisasi perusahaan']} />
      <Divider />

      {/* ── 10. Binary Tree ───────────────────────────────────── */}
      <SectionHeading id="binary-tree">Binary Tree &amp; Binary Search Tree</SectionHeading>
      <P>
        <strong>Binary Tree</strong> adalah tree yang setiap node memiliki{' '}
        <strong>maksimal dua child</strong> (kiri dan kanan).
      </P>
      <AsciiBox>{`        8
       / \\
      3   10`}</AsciiBox>
      <P>
        <strong>Binary Search Tree (BST)</strong> adalah binary tree dengan aturan tambahan:
      </P>
      <UL items={['Semua nilai di subtree kiri < nilai node', 'Semua nilai di subtree kanan > nilai node']} />
      <AsciiBox>{`          8
         / \\
        3   10
       / \\    \\
      1   6    14`}</AsciiBox>
      <NoteBox>
        BST berguna untuk pencarian efisien — pada setiap langkah kita bisa mengeliminasi
        setengah dari data, sehingga kompleksitas pencarian rata-rata adalah O(log n).
      </NoteBox>
      <Divider />

      {/* ── 11. Graph ─────────────────────────────────────────── */}
      <SectionHeading id="graph">Graph</SectionHeading>
      <P>
        Graph adalah struktur data yang terdiri dari <strong>vertex (node)</strong> dan{' '}
        <strong>edge (hubungan antar node)</strong>.
      </P>
      <AsciiBox>{`  A ----- B
  |       |
  |       |
  C ----- D`}</AsciiBox>
      <W3Table
        headers={['Jenis', 'Ciri', 'Ilustrasi']}
        rows={[
          ['Undirected Graph', 'Edge tidak punya arah', 'A — B — C'],
          ['Directed Graph (Digraph)', 'Edge punya arah tertentu', 'A → B → C'],
        ]}
      />
      <P>Contoh penggunaan:</P>
      <UL items={['Peta jalan (kota = vertex, jalan = edge)', 'Social network (pengguna = vertex, pertemanan = edge)', 'Jaringan komputer']} />
      <Divider />

      {/* ── 12. Notasi Algoritmik ─────────────────────────────── */}
      <SectionHeading id="notasi">Notasi Algoritmik</SectionHeading>
      <P>
        Notasi algoritmik adalah cara menulis algoritma <strong>tanpa bergantung</strong> pada
        bahasa pemrograman tertentu. Notasi ini fokus pada logika, bukan sintaks.
      </P>
      <P>Struktur umum program dalam notasi algoritmik:</P>
      <Pseudocode>{`Program NamaProgram
{ Spesifikasi program }

KAMUS
{ Deklarasi variabel dan tipe }

ALGORITMA
{ Langkah-langkah penyelesaian }`}</Pseudocode>
      <P>Contoh program penjumlahan:</P>
      <Pseudocode>{`Program Penjumlahan
{ Menghitung hasil penjumlahan dua bilangan a dan b }

KAMUS
  a, b, hasil : integer

ALGORITMA
  input(a)
  input(b)
  hasil ← a + b
  output(hasil)`}</Pseudocode>
      <Divider />

      {/* ── 13. Translasi ─────────────────────────────────────── */}
      <SectionHeading id="translasi">Translasi Notasi Algoritmik ke Bahasa C</SectionHeading>
      <W3Table
        headers={['Notasi Algoritmik', 'Bahasa C']}
        rows={[
          ['input(x)', 'scanf("%d", &x);'],
          ['output(x)', 'printf("%d", x);'],
          ['x ← 5', 'x = 5;'],
          ['x ← x + 1', 'x = x + 1;  atau  x++;'],
          ['if kondisi then', 'if (kondisi) {'],
          ['{ ... }', '    ...  }'],
        ]}
      />
      <P>Contoh translasi:</P>
      <SideBySide
        leftLabel="Notasi Algoritmik"
        rightLabel="Bahasa C"
        left={
          <Pseudocode>{`input(nilai)
nilai ← nilai + 10
output(nilai)`}</Pseudocode>
        }
        right={
          <CodeBlock language="c">{`
scanf("%d", &nilai);
nilai = nilai + 10;
printf("%d", nilai);
`}</CodeBlock>
        }
      />
      <Divider />

      {/* ── 14. Dasar C ───────────────────────────────────────── */}
      <SectionHeading id="dasar-c">Dasar Bahasa C</SectionHeading>

      <SubHeading id="variabel">Variabel dan Konstanta</SubHeading>
      <P>Variabel digunakan untuk menyimpan nilai yang bisa berubah selama program berjalan:</P>
      <CodeBlock language="c">{`
int umur;
float nilai;
char huruf;
`}</CodeBlock>
      <P>Konstanta digunakan untuk nilai yang <strong>tidak berubah</strong>:</P>
      <CodeBlock language="c">{`
const float PI = 3.14159;

// Atau menggunakan macro:
#define MAX_SIZE 100
`}</CodeBlock>

      <SubHeading id="tipe">Tipe Data Dasar</SubHeading>
      <W3Table
        headers={['Tipe', 'Ukuran', 'Fungsi', 'Contoh nilai']}
        rows={[
          ['int', '4 byte', 'Bilangan bulat', '10, -5, 0'],
          ['float', '4 byte', 'Bilangan desimal (presisi rendah)', '3.14f'],
          ['double', '8 byte', 'Bilangan desimal (presisi tinggi)', '3.14159265'],
          ['char', '1 byte', 'Karakter tunggal', "'A', 'z', '9'"],
          ['char[]', 'n byte', 'String (array karakter)', '"Halo"'],
        ]}
      />

      <SubHeading id="assignment">Assignment</SubHeading>
      <P>Assignment berarti memberi nilai ke variabel menggunakan operator <Mono>=</Mono>:</P>
      <CodeBlock language="c">{`
int x = 10;     // deklarasi sekaligus inisialisasi
x = x + 5;      // assignment biasa
x += 5;         // shorthand: x = x + 5
x++;            // increment: x = x + 1

printf("%d", x);   // Output: 21
`}</CodeBlock>

      <SubHeading id="io">Input dan Output</SubHeading>
      <P>Input menggunakan <Mono>scanf</Mono>, output menggunakan <Mono>printf</Mono>:</P>
      <CodeBlock language="c">{`
int x;
scanf("%d", &x);    // membaca integer dari keyboard
printf("%d\n", x);  // menampilkan integer ke layar
`}</CodeBlock>
      <W3Table
        headers={['Format Specifier', 'Tipe Data']}
        rows={[
          ['%d', 'int (integer)'],
          ['%f', 'float'],
          ['%lf', 'double'],
          ['%c', 'char'],
          ['%s', 'string (char[])'],
        ]}
      />

      <SubHeading id="percabangan">Percabangan</SubHeading>
      <P>Percabangan memilih aksi berdasarkan kondisi:</P>
      <CodeBlock language="c">{`
// if - else if - else
if (nilai >= 85) {
    printf("A");
} else if (nilai >= 75) {
    printf("B");
} else {
    printf("C");
}
`}</CodeBlock>
      <CodeBlock language="c">{`
// switch - case
switch (hari) {
    case 1:
        printf("Senin");
        break;
    case 2:
        printf("Selasa");
        break;
    default:
        printf("Hari tidak valid");
        break;
}
`}</CodeBlock>

      <SubHeading id="pengulangan">Pengulangan</SubHeading>
      <P>Ada tiga jenis pengulangan (loop) di C:</P>
      <CodeBlock language="c">{`
// 1. while — cek kondisi dulu, baru jalankan
int i = 1;
while (i <= 5) {
    printf("%d\n", i);
    i++;
}

// 2. do-while — jalankan dulu, baru cek kondisi (minimal 1x)
do {
    printf("%d\n", i);
    i++;
} while (i <= 5);

// 3. for — paling umum untuk iterasi dengan hitungan
for (int i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
// Output: 1 2 3 4 5
`}</CodeBlock>

      <SubHeading id="fungsi">Fungsi dan Prosedur</SubHeading>
      <P><strong>Fungsi</strong> — mengembalikan nilai (<Mono>return</Mono>):</P>
      <CodeBlock language="c">{`
int tambah(int a, int b) {
    return a + b;
}

// Pemanggilan:
int hasil = tambah(3, 4);
printf("%d", hasil);   // Output: 7
`}</CodeBlock>
      <P><strong>Prosedur</strong> — tidak mengembalikan nilai (<Mono>void</Mono>):</P>
      <CodeBlock language="c">{`
void cetakGaris() {
    printf("--------------------\n");
}

// Pemanggilan:
cetakGaris();
`}</CodeBlock>

      <SubHeading id="pointer">Pointer</SubHeading>
      <P>
        Pointer menyimpan <strong>alamat memori</strong> dari variabel lain.
        Pointer sangat berguna agar prosedur dapat mengubah nilai variabel asli.
      </P>
      <CodeBlock language="c">{`
void tambahSatu(int *x) {
    *x = *x + 1;   // mengubah nilai di alamat yang disimpan pointer
}

// Pemanggilan:
int angka = 5;
tambahSatu(&angka);   // kirim alamat angka

printf("%d", angka);  // Output: 6
`}</CodeBlock>
      <AsciiBox>{`Operator   Fungsi
---------  -------------------------------------------
&angka  →  Mengambil alamat memori dari variabel angka
*x      →  Mengakses nilai pada alamat yang disimpan x`}</AsciiBox>
      <Divider />

      {/* ── 15. Modularitas ───────────────────────────────────── */}
      <SectionHeading id="modularitas">Modularitas Program C</SectionHeading>
      <P>
        Program yang besar sebaiknya dibagi ke dalam beberapa file untuk mempermudah
        pembacaan, pengujian, dan perawatan.
      </P>
      <AsciiBox>{`project/
├── src/
│   ├── time.h      ← Deklarasi tipe & prototype fungsi
│   ├── time.c      ← Implementasi fungsi
│   └── main.c      ← Program utama
└── tests/
    └── check_time.c`}</AsciiBox>

      <SubHeading>File .h (Header File)</SubHeading>
      <P>Berisi deklarasi tipe data, konstanta, dan prototype fungsi:</P>
      <CodeBlock language="c">{`
// time.h
#ifndef TIME_H
#define TIME_H

typedef struct Time {
    int hours;
    int minutes;
    int seconds;
} time;

void CreateTime(time *t, int h, int m, int s);
int  difference(time start, time end);

#endif
`}</CodeBlock>

      <SubHeading>File .c (Implementation File)</SubHeading>
      <P>Berisi implementasi fungsi yang dideklarasikan di file .h:</P>
      <CodeBlock language="c">{`
// time.c
#include "time.h"

void CreateTime(time *t, int h, int m, int s) {
    t->hours   = h;
    t->minutes = m;
    t->seconds = s;
}

int difference(time start, time end) {
    int ss1 = start.hours*3600 + start.minutes*60 + start.seconds;
    int ss2 = end.hours*3600   + end.minutes*60   + end.seconds;
    return ss2 - ss1;
}
`}</CodeBlock>

      <SubHeading>File main.c</SubHeading>
      <CodeBlock language="c">{`
// main.c
#include <stdio.h>
#include "time.h"

int main() {
    time t1, t2;
    CreateTime(&t1, 13, 45, 0);
    CreateTime(&t2, 14, 30, 0);

    int selisih = difference(t1, t2);
    printf("Selisih: %d detik\n", selisih);   // Output: 2700 detik

    return 0;
}
`}</CodeBlock>

      {/* ── Summary card ──────────────────────────────────────── */}
      <div className="mt-10 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 text-base mb-3">Ringkasan Penting</h3>
        <ul className="space-y-1.5 text-sm text-blue-900">
          {[
            'Algoritma adalah langkah-langkah terurut untuk menyelesaikan masalah.',
            'Struktur data adalah cara menyimpan dan mengatur data.',
            'ADT menggabungkan data dan operasinya dalam satu kesatuan.',
            'Bahasa C digunakan untuk implementasi struktur data.',
            'Program yang baik sebaiknya diorganisasi secara modular (.h dan .c).',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-blue-500 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <InfoBox>
        <p className="text-sm font-medium text-blue-800">Urutan Belajar yang Disarankan</p>
        <ol className="mt-1 text-sm text-blue-700 space-y-0.5 list-decimal list-inside">
          <li>Pahami algoritma dasar dan tipe data</li>
          <li>Pahami array dan linked structure</li>
          <li>Pahami konsep ADT</li>
          <li>Pelajari Stack, Queue, Tree, Graph</li>
          <li>Biasakan modularisasi dengan file .h dan .c</li>
        </ol>
      </InfoBox>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content — Total Tabungan Setelah Bonus
// ---------------------------------------------------------------------------
function ContohContent() {
  const [showHint, setShowHint] = useState(false);
  const [showJawaban, setShowJawaban] = useState(false);

  return (
    <div className="text-[15px] text-gray-700">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
            Easy
          </span>
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
            Algoritma Dasar
          </span>
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
            Input-Output
          </span>
          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
            Aritmatika
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Total Tabungan Setelah Bonus</h2>
      </div>

      {/* Deskripsi */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed">
          <p>
            Diberikan sebuah nilai tabungan awal <code className="bg-white border border-gray-200 text-blue-700 px-1 rounded font-mono text-[13px]">N</code>.
            Bank memberikan <strong>bonus sebesar 10%</strong> dari tabungan awal.
            Hitung total tabungan setelah bonus.
          </p>
        </div>
      </div>

      {/* Input / Output / Constraint */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Input</div>
          <p className="text-sm text-gray-700">
            Sebuah bilangan bulat <code className="bg-gray-100 text-blue-700 text-[12px] px-1 rounded font-mono">N</code>
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Output</div>
          <p className="text-sm text-gray-700">Total tabungan setelah mendapat bonus</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Constraint</div>
          <p className="text-sm font-mono text-gray-700">0 ≤ N ≤ 1.000.000</p>
        </div>
      </div>

      {/* Contoh I/O */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Contoh</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200">
              Input
            </div>
            <pre className="bg-white px-4 py-3 font-mono text-sm text-gray-800">100000</pre>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200">
              Output
            </div>
            <pre className="bg-white px-4 py-3 font-mono text-sm text-gray-800">110000</pre>
          </div>
        </div>
      </div>

      {/* Hint (collapsible) */}
      <div className="mb-5">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 hover:bg-yellow-100 transition-colors w-full"
        >
          <span>{showHint ? '▾' : '▸'}</span>
          <span>Hint</span>
        </button>
        {showHint && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-gray-700">
            <p className="mb-2">Bonus dihitung dengan rumus:</p>
            <pre className="bg-white border border-yellow-100 rounded px-3 py-2 font-mono text-[13px] text-gray-800">
              {`bonus = N * 10 / 100`}
            </pre>
            <p className="mt-2">
              Kemudian tambahkan bonus ke tabungan awal untuk mendapatkan total.
            </p>
          </div>
        )}
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Pembahasan (collapsible) */}
      <div>
        <button
          onClick={() => setShowJawaban(!showJawaban)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 hover:bg-blue-100 transition-colors w-full mb-4"
        >
          <span>{showJawaban ? '▾' : '▸'}</span>
          <span>Lihat Pembahasan</span>
        </button>

        {showJawaban && (
          <div className="space-y-6">

            {/* Algoritma */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Algoritma</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Input nilai tabungan <code className="bg-white border border-gray-200 text-blue-700 px-1 rounded font-mono text-[12px]">N</code></li>
                  <li>
                    Hitung bonus:{' '}
                    <code className="bg-white border border-gray-200 text-blue-700 px-1.5 rounded font-mono text-[12px]">
                      bonus = N × 10 / 100
                    </code>
                  </li>
                  <li>
                    Hitung total:{' '}
                    <code className="bg-white border border-gray-200 text-blue-700 px-1.5 rounded font-mono text-[12px]">
                      total = N + bonus
                    </code>
                  </li>
                  <li>Output <code className="bg-white border border-gray-200 text-blue-700 px-1 rounded font-mono text-[12px]">total</code></li>
                </ol>
              </div>
            </div>

            {/* Notasi Algoritmik */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Notasi Algoritmik</h3>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed">
{`Program TotalTabungan

KAMUS
  N, bonus, total : integer

ALGORITMA
  input(N)

  bonus ← N * 10 / 100
  total ← N + bonus

  output(total)`}
              </pre>
            </div>

            {/* Implementasi C */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Implementasi Bahasa C</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 text-[13px]">
                <div className="bg-gray-700 text-gray-300 px-4 py-1 font-mono text-xs tracking-wide">c</div>
                <pre className="bg-gray-900 text-green-300 px-5 py-4 overflow-x-auto font-mono leading-relaxed">
{`#include <stdio.h>

int main() {
    int N, bonus, total;

    scanf("%d", &N);

    bonus = N * 10 / 100;
    total = N + bonus;

    printf("%d\\n", total);

    return 0;
}`}
                </pre>
              </div>
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                <span className="font-semibold text-gray-600">Trace untuk N = 100000:</span>
                <div className="mt-1 font-mono text-[13px] text-gray-700 space-y-0.5">
                  <div>bonus = 100000 * 10 / 100 = <span className="text-blue-700 font-bold">10000</span></div>
                  <div>total = 100000 + 10000 = <span className="text-green-700 font-bold">110000</span></div>
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
// LATIHAN data  —  from soal.md
// ---------------------------------------------------------------------------
const SOAL = [
  {
    id: 1,
    tipe: 'pengetahuan',
    topik: ['Fungsi & Prosedur', 'Paradigma Prosedural'],
    pertanyaan:
      'Jelaskan perbedaan antara fungsi dan prosedur dalam paradigma pemrograman prosedural. Berikan masing-masing satu contoh kasus nyata yang tepat untuk menggunakan fungsi dan satu kasus yang tepat untuk menggunakan prosedur, serta jelaskan alasannya!',
  },
  {
    id: 2,
    tipe: 'pengetahuan',
    topik: ['Modularitas', 'ADT', 'Reusability'],
    pertanyaan:
      'Dalam pembuatan program modular bahasa C, jelaskan peran masing-masing file berikut:\n• xxx.h — file header\n• xxx.c — file body\n• main.c — program utama\n• check_xxx.c — file unit test\n\nMengapa variabel tidak boleh dideklarasikan di dalam file header?',
  },
  {
    id: 3,
    tipe: 'implementasi',
    topik: ['Fungsi', 'Seleksi', 'Bahasa C'],
    pertanyaan:
      'Implementasikan fungsi MAKS dalam bahasa C berdasarkan notasi algoritma di bawah ini, lalu buat program utama yang membaca dua bilangan dari input dan mencetak nilai terbesarnya menggunakan fungsi tersebut.',
    notasiAlgoritma: `function MAKS(input a: integer, input b: integer) → integer
{ Mengembalikan nilai terbesar antara a dan b }
KAMUS LOKAL
  hasil : integer
ALGORITMA
  if (a > b) then
    hasil ← a
  else
    hasil ← b
  return hasil`,
  },
  {
    id: 4,
    tipe: 'implementasi',
    topik: ['Prosedur', 'Pointer', 'Pass by Reference'],
    pertanyaan:
      'Implementasikan prosedur TUKAR dalam bahasa C menggunakan pointer yang menukar nilai dua variabel integer tanpa variabel ketiga. Cetak nilai sebelum dan sesudah pertukaran dalam program utama.',
    notasiAlgoritma: `procedure TUKAR(input/output a: integer, input/output b: integer)
{ I.S. : a dan b terdefinisi }
{ F.S. : nilai a dan b saling tertukar }
KAMUS LOKAL
  -
ALGORITMA
  a ← a + b
  b ← a - b
  a ← a - b`,
  },
  {
    id: 5,
    tipe: 'implementasi',
    topik: ['Rekursi', 'Fungsi', 'Validasi Input'],
    pertanyaan:
      'Implementasikan fungsi rekursif FAKTORIAL dalam bahasa C. Buat program utama yang membaca n dari pengguna dan mencetak n!. Tambahkan validasi: jika n < 0, cetak pesan kesalahan.',
    notasiAlgoritma: `function FAKTORIAL(input n: integer) → integer
{ Mengembalikan n! untuk n ≥ 0 }
KAMUS LOKAL
  -
ALGORITMA
  if (n = 0) then
    return 1
  else
    return n * FAKTORIAL(n - 1)`,
  },
];

const NILAI_COLOR = {
  'Sangat Baik': 'bg-green-100 text-green-700 border-green-200',
  Baik: 'bg-blue-100 text-blue-700 border-blue-200',
  Cukup: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Perlu Perbaikan': 'bg-red-100 text-red-700 border-red-200',
  'Belum Dijawab': 'bg-gray-100 text-gray-500 border-gray-200',
};

const SKOR_BAR = (skor) => {
  if (skor >= 85) return 'bg-green-500';
  if (skor >= 70) return 'bg-blue-500';
  if (skor >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

// ---------------------------------------------------------------------------
// LATIHAN component  —  one question at a time
// ---------------------------------------------------------------------------
function LatihanContent() {
  const [idx, setIdx] = useState(0);              // 0-based current question
  const [jawaban, setJawaban] = useState({});
  const [showNotasi, setShowNotasi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState('');
  const [resultIdx, setResultIdx] = useState(0);  // navigate feedback in hasil view

  const soal = SOAL[idx];
  const totalDijawab = SOAL.filter((s) => jawaban[s.id]?.trim()).length;
  const isLast = idx === SOAL.length - 1;
  const isFirst = idx === 0;
  const canAnalyze = totalDijawab > 0;

  const goTo = (i) => {
    setIdx(i);
    setShowNotasi(false);
  };

  const handleAnalisis = async () => {
    setLoading(true);
    setError('');
    setHasil(null);
    try {
      const res = await fetch('/api/latihan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soal: SOAL.map((s) => ({
            id: s.id,
            tipe: s.tipe,
            topik: s.topik,
            pertanyaan: s.pertanyaan,
            ...(s.notasiAlgoritma ? { notasiAlgoritma: s.notasiAlgoritma } : {}),
          })),
          jawaban: Object.fromEntries(SOAL.map((s) => [s.id, jawaban[s.id] ?? ''])),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Analisis gagal');
      setHasil(data);
      setResultIdx(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJawaban({});
    setHasil(null);
    setError('');
    setIdx(0);
    setResultIdx(0);
    setShowNotasi(false);
  };

  const rataRata = hasil
    ? Math.round(hasil.feedback.reduce((a, f) => a + f.skor, 0) / hasil.feedback.length)
    : null;

  // ── Dot nav (soal or result) ─────────────────────────────────────────────
  const NavDots = ({ current, onSelect, feedbackList }) => (
    <div className="flex items-center gap-2 mb-5">
      {SOAL.map((s, i) => {
        const answered = !!jawaban[s.id]?.trim();
        const isCurrent = i === current;
        const fb = feedbackList?.find((f) => f.id === s.id);

        let cls = 'border-2 ';
        if (fb) {
          cls += fb.skor >= 70
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-red-400 border-red-400 text-white';
        } else if (isCurrent) {
          cls += answered
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'bg-white border-blue-600 text-blue-600';
        } else {
          cls += answered
            ? 'bg-blue-100 border-blue-400 text-blue-700'
            : 'bg-gray-100 border-gray-300 text-gray-400';
        }

        return (
          <button
            key={s.id}
            onClick={() => onSelect(i)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}
          >
            {answered && !fb ? '✓' : s.id}
          </button>
        );
      })}
      <span className="ml-2 text-xs text-gray-400">
        {feedbackList ? `${feedbackList.filter(f=>f.skor>0).length}/${SOAL.length} dinilai` : `${totalDijawab}/${SOAL.length} dijawab`}
      </span>
    </div>
  );

  // ── HASIL view ────────────────────────────────────────────────────────────
  if (hasil) {
    const fb = hasil.feedback[resultIdx];
    const s = SOAL[resultIdx];

    return (
      <div className="text-[15px] text-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hasil Latihan</h2>
            <p className="text-sm text-gray-500">IF2111 Algoritma dan Struktur Data — Pengantar</p>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Ulangi Latihan
          </button>
        </div>

        {/* Overall score */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Nilai Rata-rata</p>
              <p className="text-4xl font-bold">{rataRata}<span className="text-xl text-blue-300">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Soal dijawab</p>
              <p className="text-2xl font-bold">{totalDijawab}/{SOAL.length}</p>
            </div>
          </div>
          <div className="mt-3 bg-blue-500 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${rataRata}%` }} />
          </div>
        </div>

        {/* Per-question navigation */}
        <NavDots current={resultIdx} onSelect={setResultIdx} feedbackList={hasil.feedback} />

        {/* Feedback card for current result question */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
          {/* Card top */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {s.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.tipe === 'implementasi' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                  {s.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
                </span>
                {s.topik.map((t) => (
                  <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <p className="text-sm text-gray-800 font-medium whitespace-pre-line">{s.pertanyaan}</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[fb.nilai] ?? NILAI_COLOR['Cukup']}`}>
              {fb.nilai}
            </span>
            <span className="text-sm font-semibold text-gray-700">{fb.skor}/100</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${SKOR_BAR(fb.skor)}`} style={{ width: `${fb.skor}%` }} />
            </div>
          </div>

          {/* Feedback body */}
          <div className="px-4 py-4 space-y-3">
            {jawaban[s.id]?.trim() && (
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jawabanmu</div>
                <pre className={`whitespace-pre-wrap text-sm rounded-lg px-3 py-2.5 border border-gray-200 overflow-x-auto ${s.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300 text-[12px]' : 'bg-gray-50 text-gray-700 font-sans'}`}>
                  {jawaban[s.id]}
                </pre>
              </div>
            )}
            <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 leading-relaxed">{fb.komentar}</p>
            {fb.yang_benar && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-sm text-green-800 leading-relaxed">
                <span className="font-semibold">✓ Yang sudah benar: </span>{fb.yang_benar}
              </div>
            )}
            {fb.yang_perlu_diperbaiki && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-800 leading-relaxed">
                <span className="font-semibold">✗ Perlu diperbaiki: </span>{fb.yang_perlu_diperbaiki}
              </div>
            )}
            {fb.konsep_lemah?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pelajari:</span>
                {fb.konsep_lemah.map((k) => (
                  <span key={k} className="text-[11px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full">{k}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result prev/next */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setResultIdx(Math.max(0, resultIdx - 1))}
            disabled={resultIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Sebelumnya
          </button>
          <span className="text-sm text-gray-400">Soal {resultIdx + 1} dari {SOAL.length}</span>
          <button
            onClick={() => setResultIdx(Math.min(SOAL.length - 1, resultIdx + 1))}
            disabled={resultIdx === SOAL.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Berikutnya →
          </button>
        </div>

        {/* Weakness analysis */}
        {hasil.analisis_kelemahan && (
          <div className="border border-orange-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-200">
              <span className="text-orange-700 font-bold text-sm">Analisis Kelemahan</span>
            </div>
            <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">{hasil.analisis_kelemahan}</div>
            {hasil.area_fokus?.length > 0 && (
              <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Fokuskan belajar di:</span>
                {hasil.area_fokus.map((a) => (
                  <span key={a} className="text-[11px] bg-orange-50 border border-orange-300 text-orange-700 px-2 py-0.5 rounded-full font-medium">{a}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI-generated extra questions */}
        {hasil.soal_tambahan?.length > 0 && (
          <div className="border border-purple-200 rounded-xl overflow-hidden">
            <div className="bg-purple-50 px-4 py-2.5 border-b border-purple-200 flex items-center gap-2">
              <span className="text-purple-700 font-bold text-sm">Soal Latihan Tambahan — Dihasilkan AI</span>
              <span className="text-[10px] bg-purple-100 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full font-medium">Berdasarkan kelemahanmu</span>
            </div>
            <div className="divide-y divide-purple-100">
              {hasil.soal_tambahan.map((sq, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-[11px] text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">{sq.topik}</span>
                    <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{sq.tipe}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium mb-2 whitespace-pre-line">{sq.pertanyaan}</p>
                  {sq.hint && (
                    <p className="text-[12px] text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5">
                      <span className="font-semibold">Hint: </span>{sq.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── SOAL view  (one at a time) ────────────────────────────────────────────
  return (
    <div className="text-[15px] text-gray-700">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Soal Latihan</h2>
        <p className="text-sm text-gray-500 mt-0.5">IF2111 Algoritma dan Struktur Data — Pengantar</p>
      </div>

      {/* Dot navigation */}
      <NavDots current={idx} onSelect={goTo} feedbackList={null} />

      {/* Question card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Card header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${jawaban[soal.id]?.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {jawaban[soal.id]?.trim() ? '✓' : soal.id}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === 'implementasi' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                {soal.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
              </span>
              {soal.topik.map((t) => (
                <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line">{soal.pertanyaan}</p>
          </div>
        </div>

        {/* Notasi Algoritma (collapsible, implementasi only) */}
        {soal.notasiAlgoritma && (
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setShowNotasi((v) => !v)}
              className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              <span>{showNotasi ? '▾' : '▸'}</span>
              <span>Notasi Algoritma (referensi)</span>
            </button>
            {showNotasi && (
              <pre className="mt-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-mono text-gray-700 overflow-x-auto leading-relaxed">
                {soal.notasiAlgoritma}
              </pre>
            )}
          </div>
        )}

        {/* Answer area */}
        <div className="px-4 py-3">
          <textarea
            key={soal.id}
            value={jawaban[soal.id] ?? ''}
            onChange={(e) => setJawaban((prev) => ({ ...prev, [soal.id]: e.target.value }))}
            placeholder={soal.tipe === 'implementasi' ? '// Tulis kode C kamu di sini...' : 'Tulis jawabanmu di sini...'}
            rows={soal.tipe === 'implementasi' ? 12 : 6}
            className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y transition ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300' : 'bg-white text-gray-700'}`}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <span className="font-semibold">Error: </span>{error}
        </div>
      )}

      {/* Bottom nav */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {/* Prev */}
        <button
          onClick={() => goTo(idx - 1)}
          disabled={isFirst}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Sebelumnya
        </button>

        {/* Center: progress */}
        <span className="text-sm text-gray-400 shrink-0">
          Soal {idx + 1} dari {SOAL.length}
        </span>

        {/* Right side: Next OR Analisis on last */}
        <div className="flex items-center gap-2">
          {!isLast && (
            <button
              onClick={() => goTo(idx + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Berikutnya →
            </button>
          )}
          {(isLast || canAnalyze) && (
            <button
              onClick={handleAnalisis}
              disabled={!canAnalyze || loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Menganalisis...
                </>
              ) : (
                'Analisis Jawabanku'
              )}
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
    <div className="text-[15px] text-gray-700">

      {/* ── Title ── */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Ringkasan — Pengantar ASD</h2>
        <p className="text-sm text-gray-400 mt-0.5">IF2111 Algoritma dan Struktur Data</p>
      </div>

      {/* ── Infografis ── */}
      <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <Image
          src="/pengantar_infografis.png"
          alt="Infografis Pengantar Algoritma dan Struktur Data"
          width={1200}
          height={800}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* ── 4 key takeaways ── */}
      <div className="grid grid-cols-1 gap-4 mb-6">

        {/* 1 */}
        <div className="border border-blue-100 rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-white font-bold text-sm">Algoritma &amp; Struktur Data</span>
          </div>
          <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">
            Dua pilar utama dalam membangun program.{' '}
            <strong>Algoritma</strong> adalah langkah-langkah terurut untuk menyelesaikan masalah;{' '}
            <strong>Struktur data</strong> adalah cara mengorganisir data agar algoritma dapat bekerja efisien.
            <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2 font-mono text-blue-800 text-center text-[13px]">
              Algoritma + Struktur Data = Program
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className="border border-teal-100 rounded-xl overflow-hidden">
          <div className="bg-teal-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-teal-600 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-white font-bold text-sm">Abstract Data Type (ADT)</span>
          </div>
          <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">
            ADT <strong>mengabstraksi data beserta operasinya</strong> sehingga kode lebih rapi dan mudah dipakai ulang.
            Kita hanya perlu tahu <em>apa</em> yang bisa dilakukan, bukan <em>bagaimana</em> cara kerjanya di dalam.
            <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
              <div className="bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                <div className="font-bold text-teal-700 mb-0.5">Data</div>
                <div className="text-gray-600">Nilai yang disimpan</div>
              </div>
              <div className="bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                <div className="font-bold text-teal-700 mb-0.5">Operasi</div>
                <div className="text-gray-600">Apa yang bisa dilakukan</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className="border border-purple-100 rounded-xl overflow-hidden">
          <div className="bg-purple-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-purple-600 text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-white font-bold text-sm">Struktur Data Umum yang Perlu Dikuasai</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              {[
                { name: 'Array', desc: 'Akses cepat via indeks, ukuran tetap', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { name: 'Linked List', desc: 'Fleksibel, tambah/hapus mudah', color: 'bg-indigo-50 border-indigo-100 text-indigo-800' },
                { name: 'Stack (LIFO)', desc: 'Last In, First Out — Undo, call stack', color: 'bg-green-50 border-green-100 text-green-800' },
                { name: 'Queue (FIFO)', desc: 'First In, First Out — antrian, scheduler', color: 'bg-emerald-50 border-emerald-100 text-emerald-800' },
                { name: 'Tree', desc: 'Hierarkis — folder, DOM, org chart', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
                { name: 'BST', desc: 'Tree terurut — pencarian O(log n)', color: 'bg-orange-50 border-orange-100 text-orange-800' },
                { name: 'Graph', desc: 'Node & edge — peta, social network', color: 'bg-red-50 border-red-100 text-red-800' },
              ].map((item) => (
                <div key={item.name} className={`border rounded-lg px-3 py-2 ${item.color}`}>
                  <div className="font-bold mb-0.5">{item.name}</div>
                  <div className="text-[11px] opacity-80">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-gray-800 text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-white font-bold text-sm">Bahasa C — Implementasi</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-2 text-[12px]">
              {[
                ['Variabel & Tipe', 'int, float, char, char[]'],
                ['Percabangan', 'if-else, switch'],
                ['Pengulangan', 'while, do-while, for'],
                ['Fungsi', 'return type, return value'],
                ['Prosedur', 'void, efek samping'],
                ['Pointer', '&addr, *deref, pass by ref'],
                ['Modularitas', '.h deklarasi, .c implementasi'],
                ['Notasi Alg.', 'input(), output(), ←'],
              ].map(([label, detail]) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2">
                  <div className="font-bold text-gray-700 mb-0.5">{label}</div>
                  <div className="text-gray-500 text-[11px] leading-tight">{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Urutan belajar ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-blue-800 mb-2">Urutan Belajar yang Disarankan</p>
        <div className="flex items-center gap-0 flex-wrap text-[12px]">
          {[
            'Algoritma Dasar',
            'Tipe Data & Struct',
            'Array & Linked List',
            'ADT',
            'Stack, Queue, Tree, Graph',
            'Modularitas .h & .c',
          ].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-0">
              <span className="bg-white border border-blue-200 text-blue-800 font-medium px-2.5 py-1 rounded-full my-0.5">
                {step}
              </span>
              {i < arr.length - 1 && <span className="text-blue-300 px-1">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── Quick cheat: LIFO vs FIFO ── */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="border border-green-200 rounded-xl p-3 text-center bg-green-50">
          <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Stack — LIFO</p>
          <pre className="font-mono text-[12px] text-green-800 leading-loose">{`┌────┐
│ 30 │ ← top
├────┤
│ 20 │
├────┤
│ 10 │
└────┘`}</pre>
          <p className="text-[11px] text-green-700 mt-1">push / pop / top</p>
        </div>
        <div className="border border-blue-200 rounded-xl p-3 text-center bg-blue-50">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Queue — FIFO</p>
          <pre className="font-mono text-[12px] text-blue-800 leading-loose">{`        enqueue ↓
┌──┬──┬──┐
│10│20│30│
└──┴──┴──┘
↑ dequeue`}</pre>
          <p className="text-[11px] text-blue-700 mt-1">enqueue / dequeue / front</p>
        </div>
      </div>

    </div>
  );
}


// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function PengantarPage() {
  const [activeTab, setActiveTab] = useState('MATERI');
  const [activeSection, setActiveSection] = useState('intro');
  const mainRef = useRef(null);

  // Update sidebar highlight based on scroll position
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const handleScroll = () => {
      const scrollY = main.scrollTop + 120;
      let current = 'intro';
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) current = s.id;
      }
      setActiveSection(current);
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    const main = mainRef.current;
    if (el && main) {
      main.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="py-3">
          <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Pengantar
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${
                s.level === 1 ? 'pl-7' : ''
              } ${
                activeSection === s.id
                  ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Tabs */}
        <div className="shrink-0 border-b border-gray-200 flex gap-1 px-6 pt-3 bg-white">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-6">
            {activeTab === 'MATERI' && <MateriContent />}
            {activeTab === 'CONTOH' && <ContohContent />}
            {activeTab === 'LATIHAN' && <LatihanContent />}
            {activeTab === 'RINGKASAN' && <RingkasanContent />}
          </div>
        </div>
      </div>
    </div>
  );
}
