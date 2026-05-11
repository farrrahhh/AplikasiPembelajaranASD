'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
// Placeholder tabs
// ---------------------------------------------------------------------------
function ComingSoon({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-3">
      <span className="text-5xl">{icon}</span>
      <p className="font-medium text-base">{label}</p>
      <p className="text-sm">Segera hadir</p>
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
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
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
        <div className="flex-shrink-0 border-b border-gray-200 flex gap-1 px-6 pt-3 bg-white">
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
            {activeTab === 'CONTOH' && (
              <ComingSoon icon="💡" label="Contoh soal sedang disiapkan" />
            )}
            {activeTab === 'LATIHAN' && (
              <ComingSoon icon="✏️" label="Latihan interaktif sedang disiapkan" />
            )}
            {activeTab === 'RINGKASAN' && (
              <ComingSoon icon="📋" label="Ringkasan sedang disiapkan" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
