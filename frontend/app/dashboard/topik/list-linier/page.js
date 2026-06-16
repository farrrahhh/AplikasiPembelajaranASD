'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchTopicProgress, saveTopicProgress } from '../../../lib/progress';

import SoalSendiriPanel from '../../../components/SoalSendiriPanel';
import MateriChatWidget from '../../../components/MateriChatWidget';
const SECTIONS = [
  { id: 'pengantar',     title: 'Struktur Berkait',           level: 0 },
  { id: 'deklarasi',     title: 'Deklarasi Node',             level: 1 },
  { id: 'fisik-pointer', title: 'Representasi dengan Pointer', level: 1 },
  { id: 'fisik-array',   title: 'Representasi dengan Array',   level: 1 },
  { id: 'variasi',       title: 'Variasi List Linier',         level: 0 },
  { id: 'dummy',         title: 'List dengan Dummy',           level: 1 },
  { id: 'dll',           title: 'Doubly Linked List',          level: 1 },
  { id: 'sirkuler',      title: 'List Sirkuler',               level: 1 },
  { id: 'stack-list',    title: 'Stack',                       level: 0 },
  { id: 'queue-list',    title: 'Queue',                       level: 0 },
  { id: 'priority',      title: 'Priority Queue',              level: 1 },
];

const TABS = ['MATERI', 'CONTOH', 'LATIHAN', 'RINGKASAN'];
const TOPIC_SLUG   = 'list-linier';
const STORAGE_KEY  = 'asd_latihan_list_linier_soal';
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
    <code className="bg-gray-100 text-cyan-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200">
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
    <pre className="my-4 bg-cyan-50 border border-cyan-100 rounded-lg px-5 py-4 text-[13px] font-mono text-cyan-900 overflow-x-auto leading-relaxed">
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
    <div className="my-4 bg-cyan-50 border-l-4 border-cyan-500 px-4 py-3 rounded-r-lg text-sm text-gray-700">
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

      <SectionHeading id="pengantar">Struktur Data Berkait</SectionHeading>
      <P>
        <strong>Struktur berkait</strong> (linked list) terdiri atas node-node yang saling terhubung lewat pointer.
        Berbeda dari array, node-node tidak harus berada di lokasi memori yang bersebelahan (kontigu).
      </P>
      <P>Setiap node adalah tuple dua bagian:</P>
      <AsciiBox>{`Node: ⟨ info : ElType,   ← nilai yang disimpan
         next : Address ⟩  ← pointer ke node berikutnya (NIL jika tidak ada)`}</AsciiBox>
      <W3Table
        headers={['Aspek', 'Array', 'Node-Based (Linked List)']}
        rows={[
          ['Lokasi memori',     'Bersebelahan (kontigu)',          'Tersebar, dihubungkan pointer'],
          ['Alokasi memori',    'Ditetapkan di awal (misal 100 slot)', 'Dialokasi sesuai kebutuhan'],
          ['Memori per elemen', 'Ukuran elemen saja',              'Ukuran elemen + ukuran pointer'],
          ['Insert/delete tengah', 'O(n) — perlu geser elemen',    'O(1) — hanya ubah pointer'],
          ['Akses indeks ke-i', 'O(1) — akses langsung',          'O(n) — harus traversal'],
        ]}
      />
      <Divider />

      <SectionHeading id="deklarasi">Deklarasi Node</SectionHeading>
      <SubHeading>Notasi Algoritmik</SubHeading>
      <AsciiBox>{`type ElType  : integer
type Address : pointer to Node
type Node    : < info : ElType, next : Address >

p1 ← alokasi(9)   { p1 → Node(info=9, next=NIL) }
p2 ← alokasi(5)   { p2 → Node(info=5, next=NIL) }
p1↑.next ← p2     { p1 menunjuk ke p2 }`}</AsciiBox>
      <SubHeading>Bahasa C</SubHeading>
      <CodeBlock language="c">{`
/* node.h */
typedef int ElType;
typedef struct node* Address;
typedef struct node {
    ElType  info;
    Address next;
} Node;

#define INFO(p) (p)->info
#define NEXT(p) (p)->next

Address newNode(ElType val);

/* node.c */
Address newNode(ElType val) {
    Address p = (Address) malloc(sizeof(Node));
    if (p != NULL) {
        INFO(p) = val;
        NEXT(p) = NULL;
    }
    return p;
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="fisik-pointer">Representasi dengan Pointer</SectionHeading>
      <SubHeading>Representasi Implisit</SubHeading>
      <P>Menunjuk ke list sama dengan menunjuk ke elemen pertamanya:</P>
      <AsciiBox>{`type List : Address   { address elemen pertama }

List kosong    : L = NIL
List tidak kosong: L → [info|next] → [info|next] → ... → NIL`}</AsciiBox>
      <P>
        Mewakili definisi rekursif: list kosong adalah list; list tidak kosong terdiri atas satu elemen diikuti list.
        Karena <Mono>next</Mono> bertipe <Mono>Address</Mono> yang sama dengan <Mono>List</Mono>, tipe cocok secara rekursif.
      </P>
      <SubHeading>Representasi Eksplisit</SubHeading>
      <P>Elemen pertama merupakan bagian dari struktur data list:</P>
      <AsciiBox>{`type List  : < first : Address >
type Queue : < head  : Address,
               tail  : Address >`}</AsciiBox>
      <InfoBox>
        <strong>Perbedaan kunci:</strong> Proses rekursif lebih alami menggunakan representasi <em>implisit</em>.
        Pada representasi eksplisit, <Mono>l.first↑.next</Mono> bertipe <Mono>Address</Mono> (bukan <Mono>List</Mono>),
        sehingga tidak bisa langsung di-pass ke fungsi rekursif yang menerima <Mono>List</Mono>.
      </InfoBox>
      <Divider />

      <SectionHeading id="fisik-array">Representasi dengan Array</SectionHeading>
      <P>
        Kekurangan pointer: alokasi/dealokasi satu per satu adalah operasi "mahal". Solusinya: gunakan{' '}
        <strong>array of Node</strong> — semua node dialokasi sekaligus dalam satu pemanggilan.
      </P>
      <UL items={[
        'Bagian next setiap node bukan alamat fisik, melainkan indeks array',
        'Inisialisasi: nodeArray[i].next = i + 1 untuk setiap node',
        'Node terakhir diisi indeks tidak valid (misal −1)',
        'Diperlukan pencatat node pertama yang kosong (awalnya indeks 0)',
        'Array of Node dapat dideklarasikan global untuk beberapa list sekaligus',
      ]} />
      <NoteBox>
        Indeks-indeks kosong yang saling terhubung membentuk sebuah <strong>Stack</strong>! Mengambil node kosong = pop,
        mengembalikan node = push.
      </NoteBox>
      <Divider />

      <SectionHeading id="variasi">Variasi List Linier</SectionHeading>
      <W3Table
        headers={['Variasi', 'List Kosong', 'Elemen Terakhir', 'Keunggulan']}
        rows={[
          ['List biasa',              'First = NIL',             'Next(P) = NIL',        'Paling sederhana'],
          ['List + First & Last',     'First = Last = NIL',      'Last',                 'insertLast O(1)'],
          ['List dengan Dummy akhir', 'First = Last = dummy@',   'Next(P) = dummy@',     'Sentinel untuk search'],
          ['Doubly Linked List',      'First = Last = NIL',      'Next(Last) = NIL',     'deleteLast O(1)'],
          ['List Sirkuler',           'First = NIL',             'Next(last) = First',   'Round-robin processing'],
        ]}
      />
      <Divider />

      <SectionHeading id="dummy">List dengan Dummy Element</SectionHeading>
      <P>
        Dummy element adalah node sentinel yang selalu ada di akhir list. Berguna untuk menyederhanakan
        algoritma pencarian — nilai yang dicari disimpan sementara di dummy, sehingga loop dijamin berhenti.
      </P>
      <AsciiBox>{`type List : < first : Address, last : Address >

List kosong : First(L) = Last(L) = dummy@
Elemen nyata: Next elemen terakhir = dummy@

Visualisasi:
First → [3] → [7] → [9] → [dummy] ← Last`}</AsciiBox>
      <SubHeading>indexOf dengan Sentinel</SubHeading>
      <CodeBlock language="c">{`
int indexOf(List l, ElType x) {
    Address p;
    int idx;
    INFO(LAST(l)) = x;    /* letakkan x di sentinel */
    p = FIRST(l);
    idx = 0;
    while (INFO(p) != x) {
        p = NEXT(p);
        idx++;
    }
    if (p != LAST(l)) return idx;   /* ditemukan di node nyata */
    else              return IDX_UNDEF;
}
      `}</CodeBlock>
      <SubHeading>insertLast — Dua Versi</SubHeading>
      <P>
        <strong>Versi 1</strong> (alamat dummy tetap): node baru disisipkan sebelum dummy, alamat <Mono>last</Mono> tidak berubah.{' '}
        <strong>Versi 2</strong> (alamat dummy boleh berubah): isi dummy dengan nilai baru, alokasi dummy baru, perbarui <Mono>last</Mono>.
      </P>
      <Divider />

      <SectionHeading id="dll">Doubly Linked List (DLL)</SectionHeading>
      <P>Setiap node memiliki dua pointer: <Mono>prev</Mono> (ke predesesor) dan <Mono>next</Mono> (ke suksesor).</P>
      <AsciiBox>{`type Node : < prev : Address, info : ElType, next : Address >
type List : < first : Address, last : Address >

NIL ←── [A] ←──► [B] ←──► [C] ──► NIL
          ↑                          ↑
        First                       Last`}</AsciiBox>
      <W3Table
        headers={['Operasi', 'Singly Linked List', 'Doubly Linked List']}
        rows={[
          ['deleteFirst', 'O(1)', 'O(1)'],
          ['deleteLast',  'O(n) — perlu cari prec', 'O(1) — PREV(last) langsung tersedia'],
          ['Memori/node', 'info + next',             'info + prev + next'],
          ['Kapan pakai', 'Cukup untuk kebanyakan kasus', 'Banyak operasi pada predesesor dan suksesor'],
        ]}
      />
      <SubHeading>insertFirst pada DLL</SubHeading>
      <CodeBlock language="c">{`
void insertFirst(List *l, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        NEXT(p) = FIRST(*l);
        PREV(p) = NIL;
        if (!isEmpty(*l))
            PREV(FIRST(*l)) = p;
        else
            LAST(*l) = p;
        FIRST(*l) = p;
    }
}
      `}</CodeBlock>
      <SubHeading>deleteFirst pada DLL</SubHeading>
      <CodeBlock language="c">{`
void deleteFirst(List *l, ElType *x) {
    Address p = FIRST(*l);
    *x = INFO(p);
    if (FIRST(*l) == LAST(*l)) {   /* 1 elemen */
        LAST(*l) = NIL;
    } else {
        PREV(NEXT(FIRST(*l))) = NIL;
    }
    FIRST(*l) = NEXT(FIRST(*l));
    free(p);
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="sirkuler">List Sirkuler</SectionHeading>
      <P>
        Elemen terakhir menunjuk kembali ke elemen pertama — tidak ada yang bernilai NIL dalam list tidak kosong.
      </P>
      <AsciiBox>{`type List : < first : Address >

First ──► [A] ──► [B] ──► [C] ──┐
  ▲                               │
  └───────────────────────────────┘

List kosong: First = NIL`}</AsciiBox>
      <P>
        Digunakan untuk proses berulang tanpa akhir, misal <strong>round-robin scheduling</strong> pada OS.
        Kelemahan: penambahan/penghapusan elemen <Mono>First</Mono> mengharuskan traversal untuk mengubah{' '}
        <Mono>Next</Mono> elemen terakhir.
      </P>
      <SubHeading>insertFirst pada List Sirkuler</SubHeading>
      <CodeBlock language="c">{`
void insertFirst(List *l, ElType x) {
    Address p, last;
    p = newNode(x);
    if (p != NIL) {
        if (isEmpty(*l)) {
            NEXT(p) = p;                /* self-loop: satu elemen */
        } else {
            last = FIRST(*l);
            while (NEXT(last) != FIRST(*l))
                last = NEXT(last);
            NEXT(p)    = FIRST(*l);
            NEXT(last) = p;
        }
        FIRST(*l) = p;
    }
}
      `}</CodeBlock>
      <SubHeading>deleteFirst pada List Sirkuler</SubHeading>
      <CodeBlock language="c">{`
void deleteFirst(List *l, ElType *x) {
    Address p, last;
    p  = FIRST(*l);
    *x = INFO(p);
    if (NEXT(FIRST(*l)) == FIRST(*l)) {   /* 1 elemen */
        FIRST(*l) = NIL;
    } else {
        last = FIRST(*l);
        while (NEXT(last) != FIRST(*l))
            last = NEXT(last);
        FIRST(*l)  = NEXT(FIRST(*l));
        NEXT(last) = FIRST(*l);
    }
    free(p);
}
      `}</CodeBlock>
      <SubHeading>displayList pada List Sirkuler</SubHeading>
      <CodeBlock language="c">{`
void displayList(List l) {
    Address p;
    if (isEmpty(l)) {
        printf("List Kosong\n");
    } else {
        p = FIRST(l);
        do {
            printf("%d\n", INFO(p));
            p = NEXT(p);
        } while (p != FIRST(l));   /* berhenti saat kembali ke First */
    }
}
      `}</CodeBlock>
      <NoteBox>
        Loop pada list sirkuler menggunakan <Mono>do-while</Mono>, bukan <Mono>while</Mono>, karena harus memproses
        elemen pertama sebelum memeriksa kondisi berhenti.
      </NoteBox>
      <Divider />

      <SectionHeading id="stack-list">Stack dengan Struktur Berkait</SectionHeading>
      <P>
        Stack (LIFO — Last In First Out) sangat cocok direpresentasikan sebagai list linier biasa.
        Puncak stack (<Mono>Top</Mono>) adalah elemen pertama list.
      </P>
      <AsciiBox>{`type Stack : < addrTop : Address >

Visualisasi (Top = kiri):
Top → [5] → [3] → [9] → [1] → NIL
       ↑
  elemen terbaru`}</AsciiBox>
      <W3Table
        headers={['Operasi Stack', 'Operasi List Setara', 'Kompleksitas']}
        rows={[
          ['CreateStack', 'CreateList',   'O(1)'],
          ['push(x, S)',  'insertFirst',  'O(1)'],
          ['pop(S)',       'deleteFirst',  'O(1)'],
          ['top(S)',       'INFO(First)',  'O(1)'],
          ['isEmpty(S)',   'isEmpty',      'O(1)'],
        ]}
      />
      <CodeBlock language="c">{`
typedef struct { Address addrTop; } Stack;
#define ADDR_TOP(s) (s).addrTop
#define TOP(s)      (s).addrTop->info

void push(Stack *s, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        NEXT(p)      = ADDR_TOP(*s);
        ADDR_TOP(*s) = p;
    }
}

void pop(Stack *s, ElType *x) {
    Address p;
    *x           = TOP(*s);
    p            = ADDR_TOP(*s);
    ADDR_TOP(*s) = NEXT(ADDR_TOP(*s));
    free(p);
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="queue-list">Queue dengan Struktur Berkait</SectionHeading>
      <P>
        Queue (FIFO — First In First Out) cocok direpresentasikan sebagai list yang mencatat <Mono>HEAD</Mono> dan <Mono>TAIL</Mono>.
        Enqueue di TAIL, dequeue di HEAD.
      </P>
      <AsciiBox>{`type Queue : < addrHead : Address, addrTail : Address >

HEAD → [1] → [3] → [5] → [7] → NIL ← TAIL
  ↑                                ↑
keluar di sini             masuk di sini`}</AsciiBox>
      <W3Table
        headers={['Operasi Queue', 'Operasi List Setara', 'Kompleksitas']}
        rows={[
          ['CreateQueue',  'CreateList',   'O(1)'],
          ['enqueue(x, Q)', 'insertLast',   'O(1) — karena ada TAIL'],
          ['dequeue(Q)',    'deleteFirst',  'O(1)'],
          ['head(Q)',       'INFO(HEAD)',   'O(1)'],
          ['isEmpty(Q)',    'isEmpty',      'O(1)'],
        ]}
      />
      <CodeBlock language="c">{`
typedef struct { Address addrHead; Address addrTail; } Queue;
#define ADDR_HEAD(q) (q).addrHead
#define ADDR_TAIL(q) (q).addrTail

void enqueue(Queue *q, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        if (isEmpty(*q))
            ADDR_HEAD(*q) = p;
        else
            NEXT(ADDR_TAIL(*q)) = p;
        ADDR_TAIL(*q) = p;
    }
}

void dequeue(Queue *q, ElType *x) {
    Address p;
    *x            = HEAD(*q);
    p             = ADDR_HEAD(*q);
    ADDR_HEAD(*q) = NEXT(ADDR_HEAD(*q));
    if (ADDR_HEAD(*q) == NIL)
        ADDR_TAIL(*q) = NIL;
    free(p);
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="priority">Priority Queue</SectionHeading>
      <P>
        Priority Queue adalah queue di mana elemen diurutkan berdasarkan <strong>prioritas</strong>.
        Penambahan menggunakan <Mono>sortedInsert</Mono> sesuai nilai prioritas. Penghapusan tetap di HEAD.
      </P>
      <AsciiBox>{`type Node : < info : ElType, prio : integer, next : Address >
type PrioQueue : < addrHead : Address >

Contoh (prio lebih kecil = prioritas lebih tinggi):
HEAD → [info=A, prio=1] → [info=B, prio=3] → [info=C, prio=5] → NIL`}</AsciiBox>
      <W3Table
        headers={['Operasi', 'Implementasi', 'Kompleksitas']}
        rows={[
          ['enqueue(x, pr)', 'sortedInsert berdasarkan prio', 'O(n) — harus cari posisi'],
          ['dequeue()',      'deleteFirst',                    'O(1) — elemen prioritas tertinggi di HEAD'],
          ['head()',         'INFO(HEAD)',                     'O(1)'],
        ]}
      />

      {/* Summary card */}
      <div className="mt-10 bg-cyan-50 border border-cyan-200 rounded-xl p-5">
        <p className="text-sm font-bold text-cyan-900 mb-3">Ringkasan — Poin Kunci Materi Ini</p>
        <div className="grid grid-cols-1 gap-2 text-[13px]">
          {[
            { label: 'Implisit vs Eksplisit', ket: 'Implisit (type List = Address) lebih cocok untuk rekursi; eksplisit lebih cocok untuk Queue.' },
            { label: 'Array of Node', ket: 'Alokasi massal, next = indeks bukan alamat, node kosong membentuk stack internal.' },
            { label: 'Dummy Element', ket: 'Sentinel di akhir menyederhanakan loop pencarian — dijamin berhenti tanpa cek NIL.' },
            { label: 'DLL vs SLL', ket: 'DLL: deleteLast O(1) karena PREV(Last) tersedia. SLL: deleteLast O(n) karena harus cari Prec.' },
            { label: 'List Sirkuler', ket: 'Tidak ada NIL di next. deleteFirst harus update Next(last). Loop traversal memakai do-while.' },
            { label: 'Stack = insertFirst + deleteFirst', ket: 'Keduanya O(1). Top = INFO(First).' },
            { label: 'Queue = insertLast + deleteFirst', ket: 'Enqueue O(1) karena ada pointer TAIL. Dequeue O(1) di HEAD.' },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-cyan-100 rounded-lg px-3 py-2">
              <span className="font-bold text-cyan-800">{item.label}: </span>
              <span className="text-gray-700">{item.ket}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content
// ---------------------------------------------------------------------------
function ContohContent() {
  const [showHint, setShowHint]     = useState(false);
  const [showSolusi, setShowSolusi] = useState(false);

  return (
    <div className="text-[15px] text-gray-700">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200">Contoh Soal</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200">Tingkat Sedang</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {['List Linier', 'sortedInsert', 'Manipulasi Pointer', 'Singly Linked List'].map((t) => (
            <span key={t} className="text-[11px] bg-cyan-50 border border-cyan-200 text-cyan-700 px-2.5 py-1 rounded-full">{t}</span>
          ))}
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Menyisipkan Elemen ke List Terurut (sortedInsert)</h2>
        <p className="mb-4 leading-relaxed">
          Diberikan list integer terurut menaik: <strong>1 → 3 → 7 → 9 → NIL</strong>.
          Implementasikan prosedur <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-cyan-700">sortedInsert</code> yang
          menyisipkan nilai <strong>x = 5</strong> ke dalam list sehingga urutan menaik tetap terjaga.
          Tunjukkan langkah-langkah perubahan pointer secara visual.
        </p>
      </div>

      {/* Hint */}
      <div className="mb-4">
        <button
          onClick={() => setShowHint((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <span>{showHint ? '▾' : '▸'}</span>
          <span>{showHint ? 'Sembunyikan Petunjuk' : 'Tampilkan Petunjuk'}</span>
        </button>
        {showHint && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-4 text-sm text-gray-700 space-y-2">
            <p><strong>Petunjuk 1:</strong> Untuk menyisipkan elemen ke tengah list, kamu perlu pointer <code className="bg-yellow-100 px-1 rounded">Prec</code> (pendahulu) dan <code className="bg-yellow-100 px-1 rounded">P</code> (saat ini). Traversal bersamaan sampai <code className="bg-yellow-100 px-1 rounded">INFO(P) ≥ x</code>.</p>
            <p><strong>Petunjuk 2:</strong> Ada tiga kasus yang harus ditangani: (1) sisip sebelum elemen pertama, (2) sisip di tengah/akhir, (3) list kosong. Pastikan pointer <code className="bg-yellow-100 px-1 rounded">First</code> diperbarui jika sisip di awal.</p>
            <p><strong>Petunjuk 3:</strong> Setelah menemukan posisi (Prec dan P), urutan kritis: pertama set <code className="bg-yellow-100 px-1 rounded">NEXT(node_baru) = P</code>, baru set <code className="bg-yellow-100 px-1 rounded">NEXT(Prec) = node_baru</code>. Urutan terbalik akan memutus chain!</p>
          </div>
        )}
      </div>

      {/* Solution */}
      <div className="mb-6">
        <button
          onClick={() => setShowSolusi((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 px-4 py-2 rounded-lg hover:bg-cyan-100 transition-colors"
        >
          <span>{showSolusi ? '▾' : '▸'}</span>
          <span>{showSolusi ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan Lengkap'}</span>
        </button>
        {showSolusi && (
          <div className="mt-3 space-y-5">

            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-cyan-600 px-4 py-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-cyan-600 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-white font-semibold text-sm">Kondisi Awal &amp; Cari Posisi Sisip</span>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm mb-3">List awal terurut menaik, x = 5. Traversal dengan dua pointer: <code className="bg-gray-100 px-1 rounded font-mono">Prec</code> dan <code className="bg-gray-100 px-1 rounded font-mono">P</code>.</p>
                <pre className="bg-cyan-50 border border-cyan-100 rounded-lg px-4 py-3 font-mono text-[13px] text-cyan-900">{`List awal:
First → [1] → [3] → [7] → [9] → NIL

Iterasi:
Prec = NIL, P = First = [1]
INFO([1]) = 1 < 5  →  maju: Prec = [1], P = [3]
INFO([3]) = 3 < 5  →  maju: Prec = [3], P = [7]
INFO([7]) = 7 ≥ 5  →  STOP di sini`}</pre>
                <p className="text-sm mt-3 text-gray-600">Posisi sisip: antara node [3] (Prec) dan node [7] (P).</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-blue-600 px-4 py-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-white font-semibold text-sm">Alokasi Node Baru &amp; Sambungkan Pointer</span>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm mb-3">Buat node baru (info=5), lalu sambungkan dalam urutan yang benar:</p>
                <pre className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 font-mono text-[13px] text-blue-900">{`pBaru = newNode(5)    →  [5 | ?]

Langkah A: NEXT(pBaru) ← P
           [5] → [7]   (node baru menunjuk ke P)

Langkah B: NEXT(Prec) ← pBaru
           [3] → [5]   (Prec menunjuk ke node baru)

URUTAN PENTING: A dulu baru B.
Jika B dulu, chain ke [7] akan hilang!`}</pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-green-600 px-4 py-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-green-600 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-white font-semibold text-sm">Hasil Akhir</span>
              </div>
              <div className="px-4 py-4">
                <pre className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 font-mono text-[13px] text-green-900">{`First → [1] → [3] → [5] → [7] → [9] → NIL
                      ↑
               node baru disisipkan`}</pre>
                <p className="text-sm mt-3 text-gray-600">List tetap terurut menaik: 1, 3, 5, 7, 9.</p>
              </div>
            </div>

            {/* Implementation */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Implementasi Bahasa C</h3>
              <CodeBlock language="c">{`
void sortedInsert(List *l, ElType x) {
    Address pBaru, Prec, P;
    pBaru = newNode(x);
    if (pBaru == NIL) return;    /* alokasi gagal */

    Prec = NIL;
    P    = *l;

    /* Cari posisi: maju selama INFO(P) < x */
    while (P != NIL && INFO(P) < x) {
        Prec = P;
        P    = NEXT(P);
    }

    /* Sambungkan node baru */
    NEXT(pBaru) = P;
    if (Prec == NIL)
        *l = pBaru;          /* sisip di awal list */
    else
        NEXT(Prec) = pBaru;  /* sisip di tengah/akhir */
}
              `}</CodeBlock>
            </div>

            {/* Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">Analisis:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Kompleksitas waktu: O(n) — traversal mencari posisi yang tepat</li>
                <li>Kasus tepi: list kosong (Prec=NIL, P=NIL) → node baru menjadi First</li>
                <li>Kasus tepi: x lebih kecil dari semua elemen → sisip di awal, First berubah</li>
                <li>Kasus tepi: x lebih besar dari semua elemen → P=NIL di akhir, sisip di last</li>
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
            <span key={k} className="text-[11px] bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full">{k}</span>
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
      const res = await fetch('/api/latihan-list-linier/generate', {
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
    fetchTopicProgress(TOPIC_SLUG).then((prog) => {

      generateSoal(prog?.weak_concepts ?? []);

    });
  }, [generateSoal]);

  const evaluasiSoal = async () => {
    const soal = soalList[idx];
    setIsEvaluating(true);
    setEvalError('');
    try {
      const res = await fetch('/api/latihan-list-linier/evaluasi', {
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
    saveTopicProgress(TOPIC_SLUG, { ...completed, weak_concepts: kelemahan });
    generateSoal(kelemahan);
  };

  const regenerateSoal = async (soalIdx) => {
    const target = soalList[soalIdx];
    setRegeneratingIdx(soalIdx);
    try {
      const res = await fetch('/api/latihan-list-linier/generate', {
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
        <svg className="animate-spin w-8 h-8 mb-4 text-cyan-500" viewBox="0 0 24 24" fill="none">
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
        <button onClick={() => generateSoal([])} className="px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700">Coba Lagi</button>
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
            <p className="text-sm text-gray-500">List Linier</p>
          </div>
        </div>
        <div className="bg-linear-to-r from-cyan-600 to-cyan-700 rounded-xl p-5 text-white mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-200 text-sm font-medium">Nilai Rata-rata</p>
              <p className="text-4xl font-bold">{avgSkor}<span className="text-xl text-cyan-300">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-cyan-200 text-sm">Soal dievaluasi</p>
              <p className="text-2xl font-bold">{allFeedbacks.length}/{soalList.length}</p>
            </div>
          </div>
          <div className="mt-3 bg-cyan-500 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${avgSkor}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-5">
          {soalList.map((sq, i) => {
            const f = feedbackMap[sq.id];
            let cls = 'border-2 ';
            if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
            else cls += i === resultIdx ? 'bg-white border-cyan-600 text-cyan-600' : 'bg-gray-100 border-gray-300 text-gray-400';
            return (
              <button key={sq.id} onClick={() => setResultIdx(i)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>{sq.id}</button>
            );
          })}
        </div>
        {curSoal && curFb && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{curSoal.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === 'implementasi' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
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
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
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
          <div className="border border-cyan-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-cyan-50 px-4 py-2.5 border-b border-cyan-200">
              <span className="text-cyan-700 font-bold text-sm">Analisis Kelemahan</span>
            </div>
            <div className="px-4 py-3">
              {soalLemah.length > 0 && (
                <p className="text-sm text-gray-700 mb-3">{soalLemah.length} soal dengan skor di bawah 70 ({soalLemah.map((s) => `Soal ${s.id}`).join(', ')}). Fokus belajar di:</p>
              )}
              <div className="flex flex-wrap gap-2">
                {konsepLemah.map((k) => (
                  <span key={k} className="text-[11px] bg-cyan-50 border border-cyan-300 text-cyan-700 px-2.5 py-1 rounded-full font-medium">{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="border border-cyan-200 rounded-xl p-4 text-center bg-cyan-50">
          <p className="text-sm font-semibold text-cyan-800 mb-1">
            {konsepLemah.length > 0 ? 'Latihan soal baru untuk perkuat kelemahanmu' : 'Kerjakan soal latihan baru'}
          </p>
          <p className="text-xs text-cyan-600 mb-3">
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(', ')}${konsepLemah.length > 3 ? '...' : ''}`
              : 'AI akan membuat soal baru dengan tingkat kesulitan serupa'}
          </p>
          <button onClick={handleGenerateBaru} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors">
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
        <p className="text-sm text-gray-500 mt-0.5">List Linier</p>
      </div>
      <div className="flex items-center gap-2 mb-5">
        {soalList.map((sq, i) => {
          const f = feedbackMap[sq.id];
          const isCur = i === idx;
          let cls = 'border-2 ';
          if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
          else if (isCur) cls += jawaban[sq.id]?.trim() ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white border-cyan-600 text-cyan-600';
          else cls += jawaban[sq.id]?.trim() ? 'bg-cyan-100 border-cyan-400 text-cyan-700' : 'bg-gray-100 border-gray-300 text-gray-400';
          return (
            <button key={sq.id} onClick={() => { setIdx(i); setShowNotasi(false); setEvalError(''); }} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>
              {f ? sq.id : jawaban[sq.id]?.trim() ? '✓' : sq.id}
            </button>
          );
        })}
        <span className="ml-2 text-xs text-gray-400">{totalEvaluated}/{soalList.length} dinilai</span>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{soal.id}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === 'implementasi' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                {soal.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
              </span>
              {soal.topik.map((t) => (
                <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <p className="text-sm text-gray-800 font-medium whitespace-pre-line">{soal.pertanyaan}</p>
          </div>
          <button
            onClick={() => regenerateSoal(idx)}
            disabled={regeneratingIdx !== null}
            className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
          >
            {regeneratingIdx === idx ? <><Spinner /> Generating...</> : <>↻ Ganti Soal</>}
          </button>
        </div>

        {soal.notasiAlgoritma && (
          <div className="border-b border-gray-200">
            <button
              onClick={() => setShowNotasi((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400">{showNotasi ? '▾' : '▸'}</span>
                Referensi Kode / Notasi Algoritmik
              </span>
            </button>
            {showNotasi && (
              <pre className="bg-gray-900 text-green-300 px-5 py-4 text-[12px] font-mono overflow-x-auto leading-relaxed border-t border-gray-200">
                {soal.notasiAlgoritma.trim()}
              </pre>
            )}
          </div>
        )}

        <div className="px-4 py-3">
          <textarea
            rows={soal.tipe === 'implementasi' ? 10 : 6}
            value={currentJawaban}
            onChange={(e) => setJawaban((prev) => ({ ...prev, [soal.id]: e.target.value }))}
            placeholder={soal.tipe === 'implementasi' ? 'Tuliskan kode C atau notasi algoritmik di sini...' : 'Tuliskan jawabanmu di sini...'}
            className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300 text-[13px]' : 'bg-white text-gray-800'}`}
          />
        </div>

        {currentFeedback ? (
          <>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[currentFeedback.nilai] ?? NILAI_COLOR['Cukup']}`}>{currentFeedback.nilai}</span>
              <span className="text-sm font-semibold text-gray-700">{currentFeedback.skor}/100</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${SKOR_BAR(currentFeedback.skor)}`} style={{ width: `${currentFeedback.skor}%` }} />
              </div>
            </div>
            {currentFeedback.metrik?.length > 0 && <MetrikBar metrik={currentFeedback.metrik} />}
            <FeedbackBody fb={currentFeedback} soal={soal} jawaban={currentJawaban} />
          </>
        ) : (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
            {evalError && <p className="text-red-500 text-xs flex-1">{evalError}</p>}
            <button
              onClick={evaluasiSoal}
              disabled={isEvaluating || !currentJawaban?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isEvaluating ? <><Spinner /> Menilai...</> : 'Nilai Soal Ini'}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => { setIdx(Math.max(0, idx - 1)); setShowNotasi(false); setEvalError(''); }}
          disabled={idx === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >← Sebelumnya</button>
        <button
          onClick={handleLanjut}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
        >
          {isLast ? 'Lihat Hasil' : 'Soal Berikutnya →'}
        </button>
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
      <h2 className="text-xl font-bold text-gray-900 mb-1">Ringkasan Materi</h2>
      <p className="text-sm text-gray-500 mb-6">List Linier (Struktur Berkait)</p>

      <div className="space-y-4">

        {/* 1 — Struktur Berkait */}
        <div className="border border-cyan-100 rounded-xl overflow-hidden">
          <div className="bg-cyan-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-cyan-600 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-white font-bold text-sm">Struktur Berkait &amp; Representasi</span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-cyan-50 border border-cyan-100 text-cyan-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Representasi Implisit</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`type List : Address
List kosong: L = NIL
Cocok untuk rekursi`}</code>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="font-bold mb-1 text-gray-700">Representasi Eksplisit</div>
                <code className="text-[11px] font-mono text-gray-600 leading-relaxed block">{`type List : < first : Address >
type Queue: < head, tail : Address >
Cocok untuk Queue`}</code>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { label: 'Array of Node', ket: 'next = indeks, bukan alamat. Alokasi massal. Node kosong membentuk stack internal.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { label: 'Dummy Element', ket: 'Sentinel di akhir list. Menyederhanakan pencarian: loop dijamin berhenti karena sentinel menyimpan x.', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
              ].map((r) => (
                <div key={r.label} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <span className="font-bold">{r.label}: </span><span>{r.ket}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2 — Variasi List */}
        <div className="border border-blue-100 rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-white font-bold text-sm">Variasi List Linier</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { label: 'DLL (Doubly Linked List)', ket: 'node: prev + info + next. deleteLast O(1) karena PREV(Last) langsung tersedia.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { label: 'List Sirkuler', ket: 'Next(last) = First. deleteFirst harus update Next(last) via traversal. Gunakan do-while untuk display.', color: 'bg-indigo-50 border-indigo-100 text-indigo-800' },
                { label: 'List + First & Last', ket: 'insertLast O(1). Wajib update Last saat insert/delete elemen terakhir.', color: 'bg-violet-50 border-violet-100 text-violet-800' },
              ].map((r) => (
                <div key={r.label} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <div className="font-bold mb-0.5">{r.label}</div>
                  <div className="text-[12px] opacity-80">{r.ket}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 — Stack & Queue */}
        <div className="border border-green-100 rounded-xl overflow-hidden">
          <div className="bg-green-700 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-green-700 text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-white font-bold text-sm">Stack &amp; Queue</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-green-50 border border-green-100 text-green-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Stack (LIFO)</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`push  ≡ insertFirst  O(1)
pop   ≡ deleteFirst  O(1)
top   ≡ INFO(First)  O(1)
addrTop = elemen pertama`}</code>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Queue (FIFO)</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`enqueue ≡ insertLast  O(1)*
dequeue ≡ deleteFirst O(1)
addrHead = HEAD; addrTail = TAIL
*O(1) karena pointer TAIL`}</code>
              </div>
            </div>
          </div>
        </div>

        {/* 4 — Priority Queue */}
        <div className="border border-purple-100 rounded-xl overflow-hidden">
          <div className="bg-purple-700 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-white font-bold text-sm">Priority Queue &amp; sortedInsert</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { label: 'Priority Queue', ket: 'Elemen terurut berdasarkan prioritas. enqueue = sortedInsert O(n). dequeue = deleteFirst O(1).', color: 'bg-purple-50 border-purple-100 text-purple-800' },
                { label: 'sortedInsert', ket: 'Traversal dengan Prec+P sampai INFO(P)≥x. NEXT(baru)=P dulu, baru NEXT(Prec)=baru. Jika Prec=NIL, update First.', color: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-800' },
              ].map((r) => (
                <div key={r.label} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <div className="font-bold mb-0.5">{r.label}</div>
                  <div className="text-[12px] opacity-80">{r.ket}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-xl p-4">
        <p className="text-sm font-bold text-cyan-800 mb-3">Hal-hal yang Perlu Diingat</p>
        <div className="grid grid-cols-1 gap-2 text-[13px]">
          {[
            { tip: 'Urutan pointer saat insert', detail: 'Selalu set NEXT(node_baru) = P sebelum NEXT(Prec) = node_baru. Urutan terbalik memutus chain!', color: 'bg-cyan-50 border-cyan-100 text-cyan-800' },
            { tip: 'deleteLast pada SLL', detail: 'O(n) karena perlu traversal untuk menemukan Prec. Jika sering butuh O(1), gunakan DLL.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
            { tip: 'deleteFirst sirkuler', detail: 'Harus update Next(last) agar tetap melingkar. Perlu traversal ke node terakhir dulu.', color: 'bg-indigo-50 border-indigo-100 text-indigo-800' },
            { tip: 'Sentinel pada indexOf', detail: 'Simpan x di dummy sebelum loop. Loop berhenti tanpa perlu cek P ≠ NIL — lebih bersih dan efisien.', color: 'bg-violet-50 border-violet-100 text-violet-800' },
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
export default function ListLinierPage() {
  const [activeTab, setActiveTab] = useState('MATERI');
  const [latihanMode, setLatihanMode] = useState('ai');
  const [activeSection, setActiveSection] = useState('pengantar');
  const [showToc, setShowToc] = useState(false);
  const [completed, setCompleted] = useState({ materi: false, contoh: false, latihan: false, ringkasan: false, weak_concepts: [] });

  useEffect(() => {
    fetchTopicProgress('list-linier').then((prog) => {
      if (prog) setCompleted({ materi: !!prog.materi, contoh: !!prog.contoh, latihan: !!prog.latihan, ringkasan: !!prog.ringkasan, weak_concepts: prog.weak_concepts ?? [] });
    });
  }, []);
  const mainRef = useRef(null);

  const handleTabClick = (tab) => { setActiveTab(tab); setShowToc(false); };

  const handleComplete = (tab) => {
    const key = TAB_KEYS[tab];
    if (!key || completed[key]) return;
    const next = { ...completed, [key]: true };
    setCompleted(next);
    saveTopicProgress('list-linier', next);
  };

  const handleQuestionEvaluated = useCallback((questionId) => {
    try {
      const evaluated = new Set(JSON.parse(localStorage.getItem('asd_evaluated_list_linier') ?? '[]'));
      evaluated.add(questionId);
      localStorage.setItem('asd_evaluated_list_linier', JSON.stringify([...evaluated]));
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
          <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">List Linier</div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${s.level === 1 ? 'pl-7' : ''} ${activeSection === s.id ? 'bg-cyan-50 text-cyan-700 font-semibold border-r-2 border-cyan-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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
                  className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${isActive ? 'bg-cyan-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                    className={`w-full text-left text-[13px] px-4 py-2 transition-colors ${s.level === 1 ? 'pl-8' : ''} ${activeSection === s.id ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
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
            {activeTab === 'MATERI' && <MateriChatWidget topicSlug={TOPIC_SLUG} />}
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
                <button onClick={() => handleComplete(activeTab)} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-sm font-semibold rounded-lg transition-colors">
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
