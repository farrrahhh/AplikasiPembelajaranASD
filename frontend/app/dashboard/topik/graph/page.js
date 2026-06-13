'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchTopicProgress, saveTopicProgress } from '../../../lib/progress';

import SoalSendiriPanel from '../../../components/SoalSendiriPanel';
const SECTIONS = [
  { id: 'pengantar',     title: 'Graph',                        level: 0 },
  { id: 'terminologi',   title: 'Terminologi Dasar',            level: 1 },
  { id: 'variasi',       title: 'Variasi Graph',                level: 1 },
  { id: 'aplikasi',      title: 'Aplikasi Graph',               level: 1 },
  { id: 'representasi',  title: 'Representasi Graph',           level: 0 },
  { id: 'adj-matrix',    title: 'Adjacency Matrix',             level: 1 },
  { id: 'adj-list',      title: 'Adjacency List',               level: 1 },
  { id: 'inc-matrix',    title: 'Incidence Matrix',             level: 1 },
  { id: 'inc-list',      title: 'Incidence List',               level: 1 },
  { id: 'edge-list',     title: 'Edge List',                    level: 1 },
  { id: 'directed',      title: 'Graph Berarah',                level: 0 },
  { id: 'multilist',     title: 'Implementasi Multilist',       level: 1 },
  { id: 'leader-list',   title: 'Leader List',                  level: 1 },
  { id: 'trailer-list',  title: 'Trailer List',                 level: 1 },
  { id: 'operasi',       title: 'Operasi Graph',                level: 0 },
  { id: 'search-node',   title: 'searchNode',                   level: 1 },
  { id: 'search-edge',   title: 'searchEdge',                   level: 1 },
  { id: 'insert-node',   title: 'insertNode',                   level: 1 },
  { id: 'insert-edge',   title: 'insertEdge',                   level: 1 },
  { id: 'delete-node',   title: 'deleteNode',                   level: 1 },
];

const TABS = ['MATERI', 'CONTOH', 'LATIHAN', 'RINGKASAN'];
const TOPIC_SLUG   = 'graph';
const STORAGE_KEY  = 'asd_latihan_graph_soal';
const TAB_KEYS = { MATERI: 'materi', CONTOH: 'contoh', LATIHAN: 'latihan', RINGKASAN: 'ringkasan' };



// ---------------------------------------------------------------------------
// Primitive building blocks
// ---------------------------------------------------------------------------
function SectionHeading({ id, children }) {
  return (
    <h2 id={id} className="text-xl font-bold text-gray-900 mt-10 mb-3 pb-2 border-b-2 border-gray-200 scroll-mt-28">
      {children}
    </h2>
  );
}
function SubHeading({ id, children }) {
  return (
    <h3 id={id} className="text-base font-bold text-gray-800 mt-6 mb-2 scroll-mt-28">
      {children}
    </h3>
  );
}
function P({ children, className = '' }) {
  return <p className={`mb-3 leading-relaxed ${className}`}>{children}</p>;
}
function Mono({ children }) {
  return (
    <code className="bg-gray-100 text-indigo-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200">
      {children}
    </code>
  );
}
function CodeBlock({ language, children }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 text-[13px]">
      {language && (
        <div className="bg-gray-700 text-gray-300 px-4 py-1 font-mono text-xs tracking-wide">{language}</div>
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
    <pre className="my-4 bg-indigo-50 border border-indigo-100 rounded-lg px-5 py-4 text-[13px] font-mono text-indigo-900 overflow-x-auto leading-relaxed">
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
    <div className="my-4 bg-indigo-50 border-l-4 border-indigo-500 px-4 py-3 rounded-r-lg text-sm text-gray-700">
      {children}
    </div>
  );
}
function UL({ items }) {
  return (
    <ul className="my-3 space-y-1 list-disc list-inside ml-2 text-[15px] text-gray-700">
      {items.map((item, i) => <li key={i}>{item}</li>)}
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
              <th key={i} className="bg-gray-800 text-white px-4 py-2.5 text-left font-semibold border-r border-gray-600 last:border-r-0">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-700 border-t border-gray-100 border-r last:border-r-0">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Divider() { return <hr className="my-8 border-gray-200" />; }

// ---------------------------------------------------------------------------
// MATERI full content
// ---------------------------------------------------------------------------
function MateriContent() {
  return (
    <div className="text-[15px] text-gray-700">

      <SectionHeading id="pengantar">Graph</SectionHeading>
      <P>
        <strong>Graph</strong> (atau Graf) adalah struktur data yang terdiri dari sekumpulan simpul dan busur yang menghubungkan simpul-simpul tersebut.
      </P>
      <P>Secara formal:</P>
      <AsciiBox>{`G = (V, E)

V = sekumpulan simpul (vertices / nodes), tidak boleh kosong
E = sekumpulan busur (edges), boleh kosong`}</AsciiBox>
      <P>Contoh graph sederhana:</P>
      <AsciiBox>{`A ----- B
|       |
|       |
C ----- D`}</AsciiBox>
      <Divider />

      <SectionHeading id="terminologi">Terminologi Dasar</SectionHeading>
      <SubHeading>Bertetangga (Adjacent)</SubHeading>
      <P>Dua simpul disebut bertetangga jika dihubungkan oleh sebuah busur.</P>
      <AsciiBox>{`Simpul A dan B bertetangga jika ada busur (A, B).`}</AsciiBox>
      <SubHeading>Berhubungan (Incident)</SubHeading>
      <P>Sebuah simpul dinyatakan <em>incident</em> dengan semua busur yang menghubungkannya dengan simpul lain.</P>
      <AsciiBox>{`Simpul C incident dengan busur (B,C) dan (C,D).`}</AsciiBox>
      <SubHeading>Derajat (Degree)</SubHeading>
      <P>Derajat sebuah simpul adalah jumlah busur yang terhubung dengan simpul tersebut.</P>
      <AsciiBox>{`A ----- B
|       |        degree(A) = 2  (terhubung ke B dan C)
|       |        degree(B) = 2  (terhubung ke A dan D)
C ----- D        degree(C) = 2  (terhubung ke A dan D)
                 degree(D) = 2  (terhubung ke B dan C)`}</AsciiBox>
      <InfoBox>
        Pada <strong>directed graph</strong>, derajat dibedakan menjadi <em>in-degree</em> (busur masuk) dan <em>out-degree</em> (busur keluar).
      </InfoBox>
      <Divider />

      <SectionHeading id="variasi">Variasi Graph</SectionHeading>
      <W3Table
        headers={['Jenis Graph', 'Penjelasan']}
        rows={[
          ['Weighted graph',    'Busur memiliki bobot atau nilai'],
          ['Directed graph',    'Busur memiliki arah (a→b ≠ b→a)'],
          ['Undirected graph',  'Busur tidak memiliki arah (a—b = b—a)'],
          ['Simple graph',      'Undirected, tanpa loop, maksimum satu busur antara dua simpul'],
          ['Regular graph',     'Semua simpul berderajat sama'],
          ['Complete graph',    'Setiap pasang simpul dihubungkan busur'],
          ['Empty graph',       'Graph tanpa busur'],
        ]}
      />
      <AsciiBox>{`Directed graph:        Undirected graph:

A → B → C             A — B — C
↑       |
└───────┘`}</AsciiBox>
      <Divider />

      <SectionHeading id="aplikasi">Aplikasi Graph</SectionHeading>
      <W3Table
        headers={['Bidang', 'Penggunaan', 'Simpul', 'Busur']}
        rows={[
          ['Computer science', 'Jaringan komunikasi',  'Perangkat',  'Koneksi'],
          ['Peta / navigasi',  'Rute terpendek',       'Kota',       'Jalan'],
          ['Sosial media',     'Jaringan pertemanan',  'Pengguna',   'Pertemanan'],
          ['Kimia',            'Struktur molekul',     'Atom',       'Ikatan'],
          ['Biologi',          'Penyebaran penyakit',  'Individu',   'Kontak'],
        ]}
      />
      <Divider />

      <SectionHeading id="representasi">Representasi Graph</SectionHeading>
      <P>Ada lima cara utama merepresentasikan graph dalam program, masing-masing dengan karakteristik berbeda.</P>
      <Divider />

      <SectionHeading id="adj-matrix">1. Adjacency Matrix</SectionHeading>
      <P>Jika graph memiliki <Mono>n</Mono> simpul, adjacency matrix adalah matriks <Mono>n×n</Mono>. Nilai <Mono>M[i][j]</Mono> menyatakan jumlah busur antara simpul <Mono>i</Mono> dan simpul <Mono>j</Mono>.</P>
      <P>Contoh graph dan adjacency matrix-nya:</P>
      <AsciiBox>{`    1
   / \\
  2   3
   \\ /
    4

     1  2  3  4
1  [ 0  1  1  0 ]
2  [ 1  0  0  1 ]
3  [ 1  0  0  1 ]
4  [ 0  1  1  0 ]`}</AsciiBox>
      <W3Table
        headers={['', 'Adjacency Matrix']}
        rows={[
          ['Kelebihan', 'Cek apakah dua simpul bertetangga sangat cepat: O(1)'],
          ['Kekurangan', 'Boros memori jika graph jarang (sparse): O(V²)'],
          ['Cocok untuk', 'Dense graph (banyak busur)'],
        ]}
      />
      <NoteBox>
        Pada undirected graph, adjacency matrix bersifat simetris: <Mono>M[i][j] = M[j][i]</Mono>.
      </NoteBox>
      <Divider />

      <SectionHeading id="adj-list">2. Adjacency List</SectionHeading>
      <P>Setiap simpul menyimpan list dari semua simpul yang terhubung dengannya.</P>
      <AsciiBox>{`1 → [2, 3]
2 → [1, 4]
3 → [1, 4]
4 → [2, 3]`}</AsciiBox>
      <W3Table
        headers={['', 'Adjacency List']}
        rows={[
          ['Kelebihan', 'Hemat memori untuk graph jarang: O(V + E)'],
          ['Kekurangan', 'Cek tetangga lebih lambat dibanding adjacency matrix'],
          ['Cocok untuk', 'Sparse graph (sedikit busur)'],
        ]}
      />
      <Divider />

      <SectionHeading id="inc-matrix">3. Incidence Matrix</SectionHeading>
      <P>Matriks dengan <strong>simpul sebagai baris</strong> dan <strong>busur sebagai kolom</strong>. Nilai <Mono>M[i][j]</Mono> bernilai 1 jika simpul <Mono>i</Mono> terhubung dengan busur <Mono>j</Mono>.</P>
      <AsciiBox>{`         e1  e2  e3
simpul 1 [  1   1   0 ]
simpul 2 [  1   0   1 ]
simpul 3 [  0   1   1 ]

e1 = busur antara simpul 1 dan 2
e2 = busur antara simpul 1 dan 3
e3 = busur antara simpul 2 dan 3`}</AsciiBox>
      <Divider />

      <SectionHeading id="inc-list">4. Incidence List</SectionHeading>
      <P>Setiap simpul menyimpan list dari busur-busur yang terhubung dengannya (bukan simpul tetangga, melainkan busur).</P>
      <AsciiBox>{`simpul 1 → [e1, e2]
simpul 2 → [e1, e3]
simpul 3 → [e2, e3]`}</AsciiBox>
      <Divider />

      <SectionHeading id="edge-list">5. Edge List</SectionHeading>
      <P>Tabel yang berisi pasangan simpul yang membentuk setiap busur. Paling sederhana namun pencarian tetangga O(E).</P>
      <AsciiBox>{`Busur   Simpul-1   Simpul-2
e1         1          2
e2         1          3
e3         2          3`}</AsciiBox>
      <W3Table
        headers={['Representasi', 'Memori', 'Cek Tetangga', 'Cocok Untuk']}
        rows={[
          ['Adjacency Matrix', 'O(V²)',   'O(1)',    'Dense graph'],
          ['Adjacency List',   'O(V+E)', 'O(deg)', 'Sparse graph'],
          ['Incidence Matrix', 'O(V×E)', 'O(E)',    'Analisis busur'],
          ['Incidence List',   'O(V+E)', 'O(deg)', 'Sparse + busur'],
          ['Edge List',        'O(E)',   'O(E)',    'Traversal busur'],
        ]}
      />
      <Divider />

      <SectionHeading id="directed">Graph Berarah (Directed Graph)</SectionHeading>
      <P>Pada directed graph, busur memiliki arah. Busur <Mono>(a, k)</Mono> berarti ada busur <em>dari</em> simpul <Mono>a</Mono> menuju simpul <Mono>k</Mono>.</P>
      <W3Table
        headers={['Istilah', 'Definisi']}
        rows={[
          ['Predecessor', 'Simpul asal busur (simpul dari mana busur berangkat)'],
          ['Successor',   'Simpul tujuan busur (simpul ke mana busur menuju)'],
        ]}
      />
      <AsciiBox>{`1 → 2
3 → 5
4 → 5
3 → 2

Pada busur (3→5):
  predecessor = 3
  successor   = 5

nPred(simpul 5) = 2  (ada 2 busur masuk: dari 3 dan dari 4)
nPred(simpul 2) = 2  (ada 2 busur masuk: dari 1 dan dari 3)`}</AsciiBox>
      <Divider />

      <SectionHeading id="multilist">Implementasi Multilist Directed Graph</SectionHeading>
      <P>Directed graph diimplementasikan dengan variasi adjacency list berupa <strong>multilist</strong> yang terdiri dari dua list:</P>
      <UL items={[
        'Leader list — list berisi semua simpul, terurut berdasarkan id',
        'Trailer list — setiap simpul memiliki list successor-nya',
      ]} />
      <SubHeading>Struktur Data</SubHeading>
      <Pseudocode>{`type Node:
  id    : integer         { identitas simpul }
  nPred : integer         { jumlah busur yang masuk ke simpul ini }
  trail : AdrSuccNode     { pointer ke list successor }
  next  : AdrNode         { pointer ke simpul berikutnya }

type SuccNode:
  succ  : AdrNode         { address simpul successor }
  next  : AdrSuccNode     { pointer ke successor berikutnya }

type Graph:
  first : AdrNode         { pointer ke simpul pertama }`}</Pseudocode>
      <InfoBox>
        <Mono>nPred</Mono> menyimpan jumlah busur yang <em>masuk</em> ke simpul tersebut. Nilai ini perlu diperbarui setiap kali busur ditambahkan atau dihapus.
      </InfoBox>
      <Divider />

      <SectionHeading id="leader-list">Leader List (List Simpul)</SectionHeading>
      <P>List berisi semua simpul dalam graph, <strong>terurut membesar</strong> berdasarkan id. Setiap elemen menyimpan id, nPred, dan pointer ke list successor-nya.</P>
      <AsciiBox>{`Graph dengan busur: 1→2, 3→5, 4→5, 3→2

first → [id=1|nPred=0] → [id=2|nPred=2] → [id=3|nPred=0]
      → [id=4|nPred=0] → [id=5|nPred=2] → NIL`}</AsciiBox>
      <Divider />

      <SectionHeading id="trailer-list">Trailer List (List Successor)</SectionHeading>
      <P>Setiap simpul memiliki <strong>trailer list</strong> yang menunjuk ke simpul-simpul successornya.</P>
      <AsciiBox>{`simpul 1: trail → [succ→simpul 2] → NIL
simpul 2: trail → NIL            (tidak punya successor)
simpul 3: trail → [succ→simpul 2] → [succ→simpul 5] → NIL
simpul 4: trail → [succ→simpul 5] → NIL
simpul 5: trail → NIL            (tidak punya successor)`}</AsciiBox>
      <NoteBox>
        Urutan elemen dalam trailer list tidak harus terurut. Setiap SuccNode menyimpan pointer ke Node (bukan hanya id), sehingga akses ke informasi successor langsung tanpa perlu pencarian.
      </NoteBox>
      <Divider />

      <SectionHeading id="operasi">Operasi Graph</SectionHeading>
      <W3Table
        headers={['Operasi', 'Keterangan']}
        rows={[
          ['CreateGraph(V, E)',     'Membuat graph baru dengan simpul V dan busur E'],
          ['IsEmpty(G)',            'Mengecek apakah graph kosong (first = NIL)'],
          ['Adjacent(G, v1, v2)',   'Mengecek apakah v1 dan v2 bertetangga'],
          ['Incident(G, v, e)',     'Mengecek apakah simpul v berhubungan dengan busur e'],
          ['Neighbors(G, v)',       'Mengembalikan daftar simpul yang bertetangga dengan v'],
          ['AddV(G, v)',            'Menambahkan simpul v ke G'],
          ['DeleteV(G, v)',         'Menghapus simpul v beserta semua busur yang terhubung'],
          ['AddE(G, v1, v2)',       'Menambahkan busur (v1, v2) ke G'],
          ['DeleteE(G, v1, v2)',    'Menghapus busur (v1, v2) dari G'],
        ]}
      />
      <Divider />

      <SectionHeading id="search-node">searchNode</SectionHeading>
      <P>Mencari simpul dengan id tertentu dalam graph. Melakukan linear search pada leader list.</P>
      <Pseudocode>{`function searchNode(g: Graph, x: integer) → AdrNode

ALGORITMA
p ← g.first
while p ≠ NIL and p↑.id ≠ x do
    p ← p↑.next
searchNode ← p`}</Pseudocode>
      <InfoBox>
        Mengembalikan <Mono>NIL</Mono> jika simpul tidak ditemukan. Kompleksitas O(V) dalam kasus terburuk.
      </InfoBox>
      <Divider />

      <SectionHeading id="search-edge">searchEdge</SectionHeading>
      <P>Mencari busur dari simpul <Mono>prec</Mono> menuju simpul <Mono>succ</Mono>. Pertama cari simpul prec, lalu telusuri trailer list-nya.</P>
      <Pseudocode>{`function searchEdge(g: Graph, prec: integer, succ: integer) → AdrSuccNode

ALGORITMA
pNode ← searchNode(g, prec)
if pNode = NIL then
    searchEdge ← NIL
else
    pt ← pNode↑.trail
    while pt ≠ NIL and pt↑.succ↑.id ≠ succ do
        pt ← pt↑.next
    searchEdge ← pt`}</Pseudocode>
      <Divider />

      <SectionHeading id="insert-node">insertNode</SectionHeading>
      <P>Menambahkan simpul baru ke graph. Simpul disisipkan di posisi <strong>terurut berdasarkan id</strong> pada leader list.</P>
      <Pseudocode>{`procedure insertNode(input/output g: Graph, input x: integer, output pn: AdrNode)

ALGORITMA
pn ← newGraphNode(x)
if pn ≠ NIL then
    { sisipkan ke posisi terurut }
    if g.first = NIL or x < g.first↑.id then
        pn↑.next ← g.first
        g.first  ← pn
    else
        p ← g.first
        while p↑.next ≠ NIL and p↑.next↑.id < x do
            p ← p↑.next
        pn↑.next ← p↑.next
        p↑.next  ← pn`}</Pseudocode>
      <NoteBox>
        Simpul baru diinisialisasi dengan <Mono>nPred=0</Mono> dan <Mono>trail=NIL</Mono>. Jika alokasi gagal (<Mono>pn=NIL</Mono>), tidak ada yang dilakukan.
      </NoteBox>
      <Divider />

      <SectionHeading id="insert-edge">insertEdge</SectionHeading>
      <P>Menambahkan busur dari <Mono>prec</Mono> menuju <Mono>succ</Mono>. Jika simpul belum ada, tambahkan terlebih dahulu. Busur duplikat tidak ditambahkan.</P>
      <Pseudocode>{`procedure insertEdge(input/output g: Graph, input prec, succ: integer)

ALGORITMA
if searchEdge(g, prec, succ) = NIL then
    pPrec ← searchNode(g, prec)
    if pPrec = NIL then
        insertNode(g, prec, pPrec)

    pSucc ← searchNode(g, succ)
    if pSucc = NIL then
        insertNode(g, succ, pSucc)

    pt ← newSuccNode(pSucc)
    if pt ≠ NIL then
        pt↑.next      ← pPrec↑.trail
        pPrec↑.trail  ← pt
        pSucc↑.nPred  ← pSucc↑.nPred + 1`}</Pseudocode>
      <InfoBox>
        Setiap kali busur berhasil ditambahkan, <Mono>nPred</Mono> dari simpul <em>tujuan</em> (succ) diincrement. Ini penting untuk algoritma topological sort dan deteksi siklus.
      </InfoBox>
      <Divider />

      <SectionHeading id="delete-node">deleteNode</SectionHeading>
      <P>Menghapus simpul beserta <strong>semua busur yang terhubung</strong>, baik yang keluar maupun yang masuk ke simpul tersebut.</P>
      <Pseudocode>{`procedure deleteNode(input/output g: Graph, input x: integer)

Langkah-langkah:
1. Hapus semua busur yang keluar dari simpul x
   (kosongkan trailer list simpul x)

2. Hapus semua busur dari simpul lain yang menuju x
   (telusuri seluruh simpul, hapus SuccNode yang succ↑.id = x,
   update nPred simpul x untuk setiap busur yang dihapus)

3. Hapus simpul x dari leader list

4. Dealokasi simpul x`}</Pseudocode>
      <InfoBox>
        Langkah 2 membutuhkan traversal seluruh leader list dan trailer list setiap simpul — kompleksitas O(V + E). Inilah mengapa <Mono>nPred</Mono> disimpan: untuk memverifikasi jumlah busur masuk yang perlu dihapus.
      </InfoBox>

      {/* Summary card */}
      <div className="mt-10 mb-6 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="font-bold text-indigo-900 text-base mb-3">Ringkasan Penting</h3>
        <ul className="space-y-1.5 text-sm text-indigo-900">
          {[
            'Graph G=(V,E): V tidak boleh kosong, E boleh kosong.',
            'Adjacency Matrix: cek tetangga O(1), memori O(V²) — cocok untuk dense graph.',
            'Adjacency List: memori O(V+E) — cocok untuk sparse graph.',
            'Multilist: leader list (simpul terurut) + trailer list (successor per simpul).',
            'nPred menyimpan jumlah busur masuk ke simpul — diupdate pada insertEdge dan deleteNode.',
            'insertEdge: cek duplikat dulu, tambah SuccNode ke trailer prec, increment nPred succ.',
            'deleteNode: 4 langkah — hapus trailer x, hapus busur masuk dari semua simpul, hapus dari leader list, dealokasi.',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-indigo-500 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content
// ---------------------------------------------------------------------------
function ContohContent() {
  const [showHint, setShowHint] = useState(false);
  const [showJawaban, setShowJawaban] = useState(false);

  return (
    <div className="text-[15px] text-gray-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">Easy</span>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">Graph</span>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">Adjacency Matrix</span>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100">Derajat Simpul</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Menghitung Derajat Simpul</h2>
      </div>

      {/* Deskripsi */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed">
          <p>
            Diberikan graph tidak berarah yang direpresentasikan dengan <strong>adjacency matrix</strong> berukuran N×N. Hitung derajat dari simpul ke-K.
          </p>
          <p className="mt-2">
            Derajat simpul adalah jumlah busur yang terhubung dengan simpul tersebut. Pada adjacency matrix undirected graph, nilai <code className="font-mono bg-white border border-gray-200 text-indigo-700 px-1.5 rounded text-[13px]">M[i][j] = 1</code> berarti ada busur antara simpul <code className="font-mono text-indigo-700">i</code> dan simpul <code className="font-mono text-indigo-700">j</code>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Input (N=4, K=2):</p>
              <pre className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-800">{`4 2
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0`}</pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Output:</p>
              <pre className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-800">{`2`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
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
            <p className="mb-2">Derajat simpul K = jumlah nilai 1 pada <strong>baris ke-K</strong> di adjacency matrix:</p>
            <pre className="font-mono text-[13px] bg-white border border-gray-200 rounded px-3 py-2">{`degree ← 0
for j ← 1 to N do
    degree ← degree + A[K][j]`}</pre>
            <p className="mt-2">Gambarkan dulu graph-nya dari adjacency matrix untuk memverifikasi jawaban secara visual.</p>
          </div>
        )}
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Pembahasan */}
      <div>
        <button
          onClick={() => setShowJawaban(!showJawaban)}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2.5 hover:bg-indigo-100 transition-colors w-full mb-4"
        >
          <span>{showJawaban ? '▾' : '▸'}</span>
          <span>Lihat Pembahasan</span>
        </button>

        {showJawaban && (
          <div className="space-y-6">
            {/* Visualisasi graph */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-3">Visualisasi Graph</h3>
              <p className="text-sm text-gray-600 mb-2">Dari adjacency matrix, baca setiap nilai 1 sebagai busur:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Adjacency Matrix:</p>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-[13px] text-gray-800">{`     1  2  3  4
1  [ 0  1  1  0 ]
2  [ 1  0  0  1 ]  ← baris K=2
3  [ 1  0  0  1 ]
4  [ 0  1  1  0 ]`}</pre>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Struktur Graph:</p>
                  <pre className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 font-mono text-[13px] text-indigo-900">{`    1
   / \\
  2   3
   \\ /
    4

Busur: (1,2),(1,3),(2,4),(3,4)`}</pre>
                </div>
              </div>
            </div>

            {/* Langkah perhitungan */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-3">Menghitung Derajat Simpul K=2</h3>
              <p className="text-sm text-gray-600 mb-2">Jumlahkan semua nilai pada baris ke-2:</p>
              <div className="space-y-2">
                {[
                  { j: 1, val: 1, keterangan: 'A[2][1] = 1 → ada busur (2,1)', collision: true },
                  { j: 2, val: 0, keterangan: 'A[2][2] = 0 → tidak ada busur ke diri sendiri', collision: false },
                  { j: 3, val: 0, keterangan: 'A[2][3] = 0 → tidak ada busur (2,3)', collision: false },
                  { j: 4, val: 1, keterangan: 'A[2][4] = 1 → ada busur (2,4)', collision: true },
                ].map((item) => (
                  <div key={item.j} className={`border rounded-lg p-3 flex items-center gap-3 ${item.collision ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 font-mono ${item.collision ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-500'}`}>
                      j={item.j}: {item.val}
                    </span>
                    <p className="text-sm text-gray-700">{item.keterangan}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 font-mono text-sm text-green-800">
                degree(simpul 2) = 1 + 0 + 0 + 1 = <strong>2</strong>
              </div>
            </div>

            {/* Derajat semua simpul */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Derajat Semua Simpul</h3>
              <W3Table
                headers={['Simpul', 'Baris Matrix', 'Jumlah 1', 'Derajat']}
                rows={[
                  ['1', '[0, 1, 1, 0]', '2', '2'],
                  ['2', '[1, 0, 0, 1]', '2', '2 ← K=2'],
                  ['3', '[1, 0, 0, 1]', '2', '2'],
                  ['4', '[0, 1, 1, 0]', '2', '2'],
                ]}
              />
              <InfoBox>
                Graph ini adalah <strong>regular graph</strong> karena semua simpul berderajat sama (derajat = 2).
              </InfoBox>
            </div>

            {/* Implementasi C */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Implementasi Bahasa C</h3>
              <CodeBlock language="c">{`
#include <stdio.h>

int main() {
    int N, K;
    int A[101][101];
    int degree = 0;

    scanf("%d %d", &N, &K);

    for (int i = 1; i <= N; i++)
        for (int j = 1; j <= N; j++)
            scanf("%d", &A[i][j]);

    for (int j = 1; j <= N; j++)
        degree += A[K][j];

    printf("%d\\n", degree);
    return 0;
}
              `}</CodeBlock>
            </div>

            {/* Analisis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">Analisis:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Kompleksitas waktu: O(N) untuk menghitung derajat satu simpul</li>
                <li>Kompleksitas memori: O(N²) untuk menyimpan adjacency matrix</li>
                <li>Pada undirected graph, jumlah semua derajat = 2 × jumlah busur (Handshaking Lemma)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Latihan helpers
// ---------------------------------------------------------------------------
const NILAI_COLOR = {
  'Sangat Baik':    'bg-green-100 text-green-700 border-green-200',
  'Baik':           'bg-blue-100 text-blue-700 border-blue-200',
  'Cukup':          'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Perlu Perbaikan':'bg-red-100 text-red-700 border-red-200',
  'Belum Dijawab':  'bg-gray-100 text-gray-500 border-gray-200',
};
const SKOR_BAR = (skor) => {
  if (skor >= 85) return 'bg-green-500';
  if (skor >= 70) return 'bg-blue-500';
  if (skor >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
function MetrikBar({ metrik }) {
  return (
    <div className="px-4 py-3 border-t border-gray-100 space-y-2.5">
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rincian Penilaian</div>
      {metrik.map((m) => {
        const pct = m.maks > 0 ? (m.skor / m.maks) * 100 : 0;
        const barColor = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-400';
        return (
          <div key={m.nama}>
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-gray-600 font-medium">{m.nama}</span>
              <span className="text-gray-500 font-mono">{m.skor}/{m.maks}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-1.5 mb-0.5">
              <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            {m.keterangan && <p className="text-[11px] text-gray-400 leading-tight">{m.keterangan}</p>}
          </div>
        );
      })}
    </div>
  );
}
function FeedbackBody({ fb, soal, jawaban }) {
  return (
    <div className="px-4 py-4 border-t border-gray-100 space-y-3">
      {jawaban?.trim() && (
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jawabanmu</div>
          <pre className={`whitespace-pre-wrap text-sm rounded-lg px-3 py-2.5 border border-gray-200 overflow-x-auto ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300 text-[12px]' : 'bg-gray-50 text-gray-700 font-sans'}`}>
            {jawaban}
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
  );
}

// ---------------------------------------------------------------------------
// LATIHAN component
// ---------------------------------------------------------------------------
function LatihanContent({ onQuestionEvaluated }) {
  const [fase, setFase]               = useState('loading');
  const [soalList, setSoalList]       = useState([]);
  const [genError, setGenError]       = useState('');
  const [idx, setIdx]                 = useState(0);
  const [jawaban, setJawaban]         = useState({});
  const [feedbackMap, setFeedbackMap] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError]     = useState('');
  const [showNotasi, setShowNotasi]   = useState(false);
  const [resultIdx, setResultIdx]     = useState(0);
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);

  const generateSoal = useCallback(async (kelemahan = []) => {
    setFase('loading');
    setGenError('');
    try {
      const res = await fetch('/api/latihan-graph/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jumlah: 5, kelemahan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal generate soal');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.soal));
      setSoalList(data.soal);
      setIdx(0);
      setJawaban({});
      setFeedbackMap({});
      setShowNotasi(false);
      setFase('latihan');
    } catch (e) {
      setGenError(e.message);
      setFase('error');
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSoalList(parsed);
          setFase('latihan');
          return;
        }
      }
    } catch {}
    generateSoal([]);
  }, [generateSoal]);

  const evaluasiSoal = async () => {
    const soal = soalList[idx];
    setIsEvaluating(true);
    setEvalError('');
    try {
      const res = await fetch('/api/latihan-graph/evaluasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soal, jawaban: jawaban[soal.id] ?? '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Evaluasi gagal');
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
      setEvalError('');
    } else {
      setResultIdx(0);
      setFase('ringkasan');
    }
  };

  const handleGenerateBaru = () => {
    const kelemahan = [...new Set(Object.values(feedbackMap).flatMap((f) => f.konsep_lemah ?? []))];
    generateSoal(kelemahan);
  };

  const regenerateSoal = async (soalIdx) => {
    const target = soalList[soalIdx];
    setRegeneratingIdx(soalIdx);
    try {
      const res = await fetch('/api/latihan-graph/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jumlah: 1, tipe_paksa: target.tipe, topik_referensi: target.topik }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal generate soal');
      const newSoal = { ...data.soal[0], id: target.id };
      const updatedList = soalList.map((s, i) => (i === soalIdx ? newSoal : s));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setSoalList(updatedList);
      setJawaban((prev) => { const next = { ...prev }; delete next[target.id]; return next; });
      setFeedbackMap((prev) => { const next = { ...prev }; delete next[target.id]; return next; });
      setShowNotasi(false);
    } catch {}
    finally { setRegeneratingIdx(null); }
  };

  if (fase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg className="animate-spin w-8 h-8 mb-4 text-indigo-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm font-medium">Menyiapkan soal latihan...</p>
        <p className="text-xs text-gray-400 mt-1">AI sedang membuat soal untukmu</p>
      </div>
    );
  }
  if (fase === 'error') {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600 text-sm mb-3">{genError}</p>
        <button onClick={() => generateSoal([])} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Coba Lagi</button>
      </div>
    );
  }

  if (fase === 'ringkasan') {
    const allFeedbacks = soalList.map((s) => feedbackMap[s.id]).filter(Boolean);
    const avgSkor = allFeedbacks.length ? Math.round(allFeedbacks.reduce((a, f) => a + f.skor, 0) / allFeedbacks.length) : 0;
    const konsepLemah = [...new Set(allFeedbacks.flatMap((f) => f.konsep_lemah ?? []))];
    const soalLemah = soalList.filter((s) => (feedbackMap[s.id]?.skor ?? 100) < 70);
    const curSoal = soalList[resultIdx];
    const curFb = feedbackMap[curSoal?.id];
    return (
      <div className="text-[15px] text-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hasil Latihan</h2>
            <p className="text-sm text-gray-500">Graph</p>
          </div>
        </div>
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 rounded-xl p-5 text-white mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium">Nilai Rata-rata</p>
              <p className="text-4xl font-bold">{avgSkor}<span className="text-xl text-indigo-300">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-sm">Soal dievaluasi</p>
              <p className="text-2xl font-bold">{allFeedbacks.length}/{soalList.length}</p>
            </div>
          </div>
          <div className="mt-3 bg-indigo-500 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${avgSkor}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-5">
          {soalList.map((sq, i) => {
            const f = feedbackMap[sq.id];
            let cls = 'border-2 ';
            if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
            else cls += i === resultIdx ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-gray-100 border-gray-300 text-gray-400';
            return (
              <button key={sq.id} onClick={() => setResultIdx(i)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>{sq.id}</button>
            );
          })}
        </div>
        {curSoal && curFb && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{curSoal.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === 'implementasi' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                    {curSoal.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
                  </span>
                  {curSoal.topik.map((t) => (
                    <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-800 font-medium whitespace-pre-line">{curSoal.pertanyaan}</p>
              </div>
              <button
                onClick={async () => { await regenerateSoal(resultIdx); setIdx(resultIdx); setFase('latihan'); }}
                disabled={regeneratingIdx !== null}
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
              >
                {regeneratingIdx === resultIdx ? <><Spinner /> Generating...</> : <>↻ Ganti Soal</>}
              </button>
            </div>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[curFb.nilai] ?? NILAI_COLOR['Cukup']}`}>{curFb.nilai}</span>
              <span className="text-sm font-semibold text-gray-700">{curFb.skor}/100</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${SKOR_BAR(curFb.skor)}`} style={{ width: `${curFb.skor}%` }} />
              </div>
            </div>
            {curFb.metrik?.length > 0 && <MetrikBar metrik={curFb.metrik} />}
            <FeedbackBody fb={curFb} soal={curSoal} jawaban={jawaban[curSoal.id]} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setResultIdx(Math.max(0, resultIdx - 1))} disabled={resultIdx === 0} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Sebelumnya</button>
          <span className="text-sm text-gray-400">Soal {resultIdx + 1} dari {soalList.length}</span>
          <button onClick={() => setResultIdx(Math.min(soalList.length - 1, resultIdx + 1))} disabled={resultIdx === soalList.length - 1} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Berikutnya →</button>
        </div>
        {konsepLemah.length > 0 && (
          <div className="border border-orange-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-200">
              <span className="text-orange-700 font-bold text-sm">Analisis Kelemahan</span>
            </div>
            <div className="px-4 py-3">
              {soalLemah.length > 0 && (
                <p className="text-sm text-gray-700 mb-3">{soalLemah.length} soal dengan skor di bawah 70 ({soalLemah.map((s) => `Soal ${s.id}`).join(', ')}). Fokus belajar di:</p>
              )}
              <div className="flex flex-wrap gap-2">
                {konsepLemah.map((k) => (
                  <span key={k} className="text-[11px] bg-orange-50 border border-orange-300 text-orange-700 px-2.5 py-1 rounded-full font-medium">{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="border border-indigo-200 rounded-xl p-4 text-center bg-indigo-50">
          <p className="text-sm font-semibold text-indigo-800 mb-1">
            {konsepLemah.length > 0 ? 'Latihan soal baru untuk perkuat kelemahanmu' : 'Kerjakan soal latihan baru'}
          </p>
          <p className="text-xs text-indigo-600 mb-3">
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(', ')}${konsepLemah.length > 3 ? '...' : ''}`
              : 'AI akan membuat soal baru dengan tingkat kesulitan serupa'}
          </p>
          <button onClick={handleGenerateBaru} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Generate Soal Baru
          </button>
        </div>
      </div>
    );
  }

  if (!soalList.length) return null;
  const soal = soalList[idx];
  const currentJawaban = jawaban[soal.id] ?? '';
  const currentFeedback = feedbackMap[soal.id];
  const isLast = idx === soalList.length - 1;
  const totalEvaluated = soalList.filter((s) => feedbackMap[s.id]).length;

  return (
    <div className="text-[15px] text-gray-700">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Soal Latihan</h2>
        <p className="text-sm text-gray-500 mt-0.5">Graph</p>
      </div>
      <div className="flex items-center gap-2 mb-5">
        {soalList.map((sq, i) => {
          const f = feedbackMap[sq.id];
          const isCur = i === idx;
          let cls = 'border-2 ';
          if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
          else if (isCur) cls += jawaban[sq.id]?.trim() ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600';
          else cls += jawaban[sq.id]?.trim() ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'bg-gray-100 border-gray-300 text-gray-400';
          return (
            <button key={sq.id} onClick={() => { setIdx(i); setShowNotasi(false); setEvalError(''); }} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>
              {f ? sq.id : jawaban[sq.id]?.trim() ? '✓' : sq.id}
            </button>
          );
        })}
        <span className="ml-2 text-xs text-gray-400">{totalEvaluated}/{soalList.length} dinilai</span>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${currentFeedback ? (currentFeedback.skor >= 70 ? 'bg-green-500 text-white' : 'bg-red-400 text-white') : currentJawaban.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {currentJawaban.trim() && !currentFeedback ? '✓' : soal.id}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === 'implementasi' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                {soal.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
              </span>
              {soal.topik.map((t) => (
                <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line">{soal.pertanyaan}</p>
          </div>
          <button
            onClick={() => regenerateSoal(idx)}
            disabled={regeneratingIdx !== null || isEvaluating}
            className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
          >
            {regeneratingIdx === idx ? <><Spinner /> Generating...</> : <>↻ Ganti Soal</>}
          </button>
        </div>

        {soal.notasiAlgoritma && (
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <button onClick={() => setShowNotasi((v) => !v)} className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1">
              <span>{showNotasi ? '▾' : '▸'}</span>
              <span>Notasi Algoritma (referensi)</span>
            </button>
            {showNotasi && (
              <pre className="mt-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-mono text-gray-700 overflow-x-auto leading-relaxed">{soal.notasiAlgoritma}</pre>
            )}
          </div>
        )}

        {!currentFeedback && (
          <div className="px-4 py-3">
            <textarea
              key={soal.id}
              value={currentJawaban}
              onChange={(e) => setJawaban((prev) => ({ ...prev, [soal.id]: e.target.value }))}
              placeholder={soal.tipe === 'implementasi' ? '// Tulis notasi algoritmik atau kode C kamu di sini...' : 'Tulis jawabanmu di sini...'}
              rows={soal.tipe === 'implementasi' ? 12 : 6}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y transition ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300' : 'bg-white text-gray-700'}`}
              spellCheck={false}
            />
          </div>
        )}

        {currentFeedback && (
          <>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[currentFeedback.nilai] ?? NILAI_COLOR['Cukup']}`}>{currentFeedback.nilai}</span>
              <span className="text-sm font-semibold text-gray-700">{currentFeedback.skor}/100</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${SKOR_BAR(currentFeedback.skor)}`} style={{ width: `${currentFeedback.skor}%` }} />
              </div>
            </div>
            {currentFeedback.metrik?.length > 0 && <MetrikBar metrik={currentFeedback.metrik} />}
            <FeedbackBody fb={currentFeedback} soal={soal} jawaban={jawaban[soal.id]} />
          </>
        )}
      </div>

      {evalError && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <span className="font-semibold">Error: </span>{evalError}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => { setIdx(Math.max(0, idx - 1)); setShowNotasi(false); setEvalError(''); }} disabled={idx === 0} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-10">
          ← Sebelumnya
        </button>
        <span className="text-sm text-gray-400 shrink-0 order-last sm:order-0 w-full sm:w-auto text-center">Soal {idx + 1} dari {soalList.length}</span>
        <div className="flex items-center gap-2">
          {!currentFeedback ? (
            <button onClick={evaluasiSoal} disabled={isEvaluating || !currentJawaban.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors min-h-10">
              {isEvaluating ? <><Spinner /> Menilai...</> : 'Nilai Soal Ini'}
            </button>
          ) : (
            <button onClick={handleLanjut} className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors min-h-10">
              {isLast ? 'Lihat Hasil' : 'Soal Berikutnya →'}
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
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Ringkasan — Graph</h2>
        <p className="text-sm text-gray-400 mt-0.5">Terminologi, Representasi, Multilist, Primitif</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">

        {/* 1 — Terminologi */}
        <div className="border border-indigo-100 rounded-xl overflow-hidden">
          <div className="bg-indigo-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-white font-bold text-sm">Terminologi & Variasi</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Definisi</div>
                <code className="text-[12px] font-mono leading-relaxed block">{`G = (V, E)
V = simpul (tidak kosong)
E = busur (boleh kosong)
Adjacent = dihubungkan busur
Degree   = jumlah busur pada simpul`}</code>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="font-bold mb-1 text-gray-700">Jenis Graph</div>
                <code className="text-[11px] font-mono text-gray-600 leading-relaxed block">{`Directed   → busur berarah
Undirected → busur tak-berarah
Weighted   → busur berbobot
Complete   → semua simpul terhubung
Simple     → tanpa loop, tanpa multi-edge
Regular    → semua degree sama`}</code>
              </div>
            </div>
          </div>
        </div>

        {/* 2 — Representasi */}
        <div className="border border-blue-100 rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-white font-bold text-sm">5 Cara Representasi</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { name: 'Adjacency Matrix', mem: 'O(V²)',   cek: 'O(1)',    ket: 'Dense graph. M[i][j]=1 jika ada busur.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { name: 'Adjacency List',   mem: 'O(V+E)', cek: 'O(deg)', ket: 'Sparse graph. Setiap simpul simpan list tetangga.', color: 'bg-green-50 border-green-100 text-green-800' },
                { name: 'Incidence Matrix', mem: 'O(V×E)', cek: 'O(E)',   ket: 'Baris=simpul, kolom=busur.', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
                { name: 'Incidence List',   mem: 'O(V+E)', cek: 'O(deg)', ket: 'Simpan list busur (bukan tetangga).', color: 'bg-orange-50 border-orange-100 text-orange-800' },
                { name: 'Edge List',        mem: 'O(E)',   cek: 'O(E)',   ket: 'Tabel pasangan simpul per busur.', color: 'bg-purple-50 border-purple-100 text-purple-800' },
              ].map((r) => (
                <div key={r.name} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold">{r.name}</span>
                    <div className="flex gap-3 text-[11px] font-mono">
                      <span>Memori: {r.mem}</span>
                      <span>Cek: {r.cek}</span>
                    </div>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-70">{r.ket}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 — Multilist */}
        <div className="border border-violet-100 rounded-xl overflow-hidden">
          <div className="bg-violet-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-violet-600 text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-white font-bold text-sm">Implementasi Multilist</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-violet-50 border border-violet-100 text-violet-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Node (Leader List)</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`id    : integer
nPred : integer  ← busur masuk
trail : AdrSuccNode
next  : AdrNode`}</code>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="font-bold mb-1 text-gray-700">SuccNode (Trailer List)</div>
                <code className="text-[11px] font-mono text-gray-600 leading-relaxed block">{`succ : AdrNode    ← tujuan busur
next : AdrSuccNode`}</code>
              </div>
            </div>
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
              <span className="font-bold text-gray-600">Invariant: </span>
              <span className="text-gray-600">Leader list terurut berdasarkan id. nPred selalu akurat (diupdate setiap insertEdge/deleteNode).</span>
            </div>
          </div>
        </div>

        {/* 4 — Primitif */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-gray-800 text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-white font-bold text-sm">Primitif Graph</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { fn: 'searchNode(g, x)',         ret: '→ AdrNode',     ket: 'Linear search di leader list. Kembalikan NIL jika tidak ada.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { fn: 'searchEdge(g, prec, succ)', ret: '→ AdrSuccNode', ket: 'Cari simpul prec, lalu linear search di trailer list-nya.', color: 'bg-green-50 border-green-100 text-green-800' },
                { fn: 'insertNode(g, x, pn)',      ret: 'procedure',     ket: 'Alokasi node, sisipkan ke posisi terurut di leader list.', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
                { fn: 'insertEdge(g, prec, succ)', ret: 'procedure',     ket: 'Cek duplikat, tambah node jika perlu, tambah SuccNode, increment nPred.', color: 'bg-orange-50 border-orange-100 text-orange-800' },
                { fn: 'deleteNode(g, x)',          ret: 'procedure',     ket: '4 langkah: hapus trailer, hapus SuccNode menuju x, hapus dari leader, dealokasi.', color: 'bg-red-50 border-red-100 text-red-800' },
              ].map((f) => (
                <div key={f.fn} className={`border rounded-lg px-3 py-2 ${f.color}`}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <code className="font-bold font-mono text-[12px]">{f.fn}</code>
                    <code className="font-mono text-[11px] opacity-70">{f.ret}</code>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-80">{f.ket}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick ref */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-indigo-800 mb-2">insertEdge — Urutan Langkah</p>
        <pre className="bg-white border border-indigo-100 rounded-lg px-3 py-2 font-mono text-gray-800 text-[12px] leading-relaxed">{`1. searchEdge(g, prec, succ) → jika sudah ada, return (tidak duplikat)
2. searchNode(g, prec) → jika NIL, insertNode dulu
3. searchNode(g, succ) → jika NIL, insertNode dulu
4. newSuccNode(pSucc) → alokasi SuccNode baru
5. pt↑.next ← pPrec↑.trail; pPrec↑.trail ← pt  (tambah ke depan trailer)
6. pSucc↑.nPred ← pSucc↑.nPred + 1`}</pre>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-bold text-gray-700 mb-3">Hal-hal yang Perlu Diingat</p>
        <div className="grid grid-cols-1 gap-2 text-[13px]">
          {[
            { tip: 'Adjacency Matrix vs List', detail: 'Matrix: cek tetangga O(1), memori O(V²). List: memori O(V+E), cocok untuk graph jarang.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
            { tip: 'nPred harus selalu akurat', detail: 'Increment saat insertEdge berhasil. Decrement setiap kali SuccNode menuju simpul dihapus pada deleteNode.', color: 'bg-violet-50 border-violet-100 text-violet-800' },
            { tip: 'insertEdge tidak duplikat', detail: 'Selalu cek searchEdge dulu. Jika busur sudah ada, tidak perlu menambahkan lagi.', color: 'bg-green-50 border-green-100 text-green-800' },
            { tip: 'deleteNode: 4 langkah wajib', detail: 'Hapus trailer x → hapus semua SuccNode menuju x → hapus dari leader list → dealokasi. Urutan penting!', color: 'bg-red-50 border-red-100 text-red-800' },
          ].map((item) => (
            <div key={item.tip} className={`border rounded-lg px-3 py-2 ${item.color}`}>
              <div className="font-bold mb-0.5">{item.tip}</div>
              <div className="text-[12px] opacity-80">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function GraphPage() {
  const [activeTab, setActiveTab] = useState('MATERI');
  const [latihanMode, setLatihanMode] = useState('ai');
  const [activeSection, setActiveSection] = useState('pengantar');
  const [showToc, setShowToc] = useState(false);
  const [completed, setCompleted] = useState({ materi: false, contoh: false, latihan: false, ringkasan: false });

  useEffect(() => {
    fetchTopicProgress('graph').then((prog) => {
      if (prog) setCompleted({ materi: !!prog.materi, contoh: !!prog.contoh, latihan: !!prog.latihan, ringkasan: !!prog.ringkasan });
    });
  }, []);
  const mainRef = useRef(null);

  const handleTabClick = (tab) => { setActiveTab(tab); setShowToc(false); };

  const handleComplete = (tab) => {
    const key = TAB_KEYS[tab];
    if (!key || completed[key]) return;
    const next = { ...completed, [key]: true };
    setCompleted(next);
    saveTopicProgress('graph', next);
  };

  const handleQuestionEvaluated = useCallback((questionId) => {
    try {
      const evaluated = new Set(JSON.parse(localStorage.getItem('asd_evaluated_graph') ?? '[]'));
      evaluated.add(questionId);
      localStorage.setItem('asd_evaluated_graph', JSON.stringify([...evaluated]));
    } catch {}
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const handleScroll = () => {
      const scrollY = main.scrollTop + 120;
      let current = 'pengantar';
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
    if (el && main) main.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Sidebar (desktop only) */}
      <aside className="hidden lg:block w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="py-3">
          <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Graph</div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${s.level === 1 ? 'pl-7' : ''} ${activeSection === s.id ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
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
        <div className="shrink-0 border-b border-gray-200 bg-white overflow-x-auto">
          <div className="flex gap-1 px-3 sm:px-6 pt-3 min-w-max">
            {TABS.map((tab) => {
              const isDone = completed[TAB_KEYS[tab]];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${isActive ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tab}
                  {isDone && (
                    <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-green-300' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile TOC toggle */}
        {activeTab === 'MATERI' && (
          <div className="lg:hidden shrink-0 bg-gray-50 border-b border-gray-200">
            <button onClick={() => setShowToc((v) => !v)} className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 active:bg-gray-100">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                Daftar Isi
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showToc && (
              <div className="max-h-52 overflow-y-auto border-t border-gray-100 bg-white">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { scrollToSection(s.id); setShowToc(false); }}
                    className={`w-full text-left text-[13px] px-4 py-2 transition-colors ${s.level === 1 ? 'pl-8' : ''} ${activeSection === s.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
            {activeTab === 'MATERI'    && <MateriContent />}
            {activeTab === 'CONTOH'   && <ContohContent />}
            {activeTab === 'LATIHAN' && (
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
            {activeTab === 'RINGKASAN' && <RingkasanContent />}

            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between">
              <p className="text-sm text-gray-400">{Object.values(completed).filter(Boolean).length} dari 4 sesi diselesaikan</p>
              {completed[TAB_KEYS[activeTab]] ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  sesi ini telah diselesaikan
                </div>
              ) : (
                <button onClick={() => handleComplete(activeTab)} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg transition-colors">
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
