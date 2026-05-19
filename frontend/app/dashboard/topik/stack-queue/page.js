"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

const SECTIONS = [
  { id: "queue-intro", title: "Queue (Antrian)", level: 0 },
  { id: "queue-struktur", title: "Struktur Queue", level: 1 },
  { id: "queue-operasi", title: "Operasi Queue", level: 1 },
  { id: "queue-adt", title: "ADT Queue dengan Array", level: 1 },
  { id: "queue-alt1", title: "Implementasi: Alt-1", level: 1 },
  { id: "queue-alt2", title: "Implementasi: Alt-2", level: 1 },
  { id: "queue-alt3", title: "Circular Buffer (Alt-3)", level: 1 },
  { id: "queue-c", title: "Implementasi C", level: 1 },
  { id: "stack-intro", title: "Stack (Tumpukan)", level: 0 },
  { id: "stack-struktur", title: "Struktur Stack", level: 1 },
  { id: "stack-perbandingan", title: "Queue vs Stack vs List", level: 1 },
  { id: "stack-operasi", title: "Operasi Stack", level: 1 },
  { id: "stack-adt", title: "ADT Stack dengan Array", level: 1 },
  { id: "stack-pushpop", title: "Algoritma Push & Pop", level: 1 },
  { id: "stack-c", title: "Implementasi C", level: 1 },
  { id: "aplikasi", title: "Aplikasi: Evaluasi Postfix", level: 0 },
  { id: "tabel-perbandingan", title: "Tabel Perbandingan", level: 0 },
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

function CodeBlock({ language, children }) {
  return (
    <div className='my-4 rounded-lg overflow-hidden border border-gray-200 text-[13px]'>
      {language && (
        <div className='bg-gray-700 text-gray-300 px-4 py-1 font-mono text-xs tracking-wide'>
          {language}
        </div>
      )}
      <pre className='bg-gray-900 text-green-300 px-5 py-4 overflow-x-auto font-mono leading-relaxed'>
        <code>{children.trim()}</code>
      </pre>
    </div>
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
    <pre className='my-4 bg-rose-50 border border-rose-100 rounded-lg px-5 py-4 text-[13px] font-mono text-rose-900 overflow-x-auto leading-relaxed'>
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
    <div className='my-4 bg-rose-50 border-l-4 border-rose-500 px-4 py-3 rounded-r-lg text-sm text-gray-700'>
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
      {/* ── 1. Queue Intro ──────────────────────────────────────── */}
      <SectionHeading id='queue-intro'>Queue (Antrian)</SectionHeading>
      <P>
        <strong>Queue</strong> adalah struktur data dengan prinsip{" "}
        <strong>First In, First Out (FIFO)</strong> — data yang masuk pertama
        akan keluar pertama, seperti antrian di dunia nyata.
      </P>
      <AsciiBox>{`Masuk dari belakang
        ↓
[w] [x] [y] [z]
 ↑
Keluar dari depan (HEAD)`}</AsciiBox>
      <P>Contoh penggunaan queue dalam kehidupan nyata:</P>
      <UL
        items={[
          "Antrian printer — job yang masuk pertama dicetak pertama",
          "Antrian customer service — penelepon pertama dilayani pertama",
          "Job scheduling di sistem operasi",
        ]}
      />
      <Divider />

      {/* ── 2. Struktur Queue ──────────────────────────────────── */}
      <SectionHeading id='queue-struktur'>Struktur Queue</SectionHeading>
      <P>Queue dikenali dari dua ujungnya:</P>
      <Pseudocode>{`HEAD → elemen paling depan (keluar duluan)
TAIL → elemen paling belakang (masuk paling baru)

Penyisipan  → selalu dilakukan setelah TAIL
Penghapusan → selalu dilakukan pada HEAD`}</Pseudocode>
      <P>Tiga kondisi queue yang mungkin:</P>
      <AsciiBox>{`Queue dengan 4 elemen:    HEAD → [w][x][y][z] ← TAIL
Queue dengan 1 elemen:    HEAD → [w] ← TAIL
Queue kosong:             HEAD dan TAIL = IDX_UNDEF`}</AsciiBox>
      <Divider />

      {/* ── 3. Operasi Queue ──────────────────────────────────── */}
      <SectionHeading id='queue-operasi'>Operasi Queue</SectionHeading>
      <W3Table
        headers={["Operasi", "Fungsi"]}
        rows={[
          ["CreateQueue", "Membuat antrian kosong"],
          ["head", "Mengirimkan elemen terdepan saat ini"],
          ["length", "Mengirimkan banyaknya elemen saat ini"],
          ["enqueue", "Menambahkan elemen setelah TAIL"],
          ["dequeue", "Menghapus HEAD, queue mungkin jadi kosong"],
          ["isEmpty", "Mengecek apakah queue kosong"],
          ["isFull", "Mengecek apakah queue penuh"],
        ]}
      />
      <Divider />

      {/* ── 4. ADT Queue ─────────────────────────────────────── */}
      <SectionHeading id='queue-adt'>ADT Queue dengan Array</SectionHeading>
      <P>Struktur data queue dalam notasi algoritmik:</P>
      <Pseudocode>{`KAMUS UMUM
constant IDX_UNDEF: integer = -1
constant CAPACITY: integer = 10

type ElType: integer  { elemen Queue }

type Queue: < buffer: array [0..CAPACITY-1] of ElType,
               idxHead: integer,
               idxTail: integer >`}</Pseudocode>
      <P>
        Queue kosong ditandai dengan <Mono>idxHead = IDX_UNDEF</Mono> dan{" "}
        <Mono>idxTail = IDX_UNDEF</Mono>.
      </P>
      <Divider />

      {/* ── 5. Alt-1 ─────────────────────────────────────────── */}
      <SectionHeading id='queue-alt1'>Implementasi Queue: Alt-1</SectionHeading>
      <P>
        HEAD selalu di indeks 0. Saat <Mono>dequeue</Mono>,{" "}
        <strong>semua elemen digeser ke kiri</strong>.
      </P>
      <AsciiBox>{`Sebelum dequeue(x):
HEAD                    TAIL
 ↓                       ↓
[x][y][z][a][b][ ][ ][ ][ ][ ]
 0  1  2  3  4  5  6  7  8  9

Setelah dequeue(x):
HEAD                TAIL
 ↓                   ↓
[y][z][a][b][ ][ ][ ][ ][ ][ ]
 0  1  2  3  4  5  6  7  8  9`}</AsciiBox>
      <P>Algoritma penghapusan (naif):</P>
      <Pseudocode>{`1. Ambil nilai HEAD
2. Geser semua elemen dari idxHead+1 sampai idxTail ke kiri
3. Geser TAIL ke kiri (idxTail--)
4. Kasus khusus (berelemen 1): idxHead dan idxTail = IDX_UNDEF`}</Pseudocode>
      <InfoBox>
        <strong>Analisis Alt-1:</strong> Sederhana karena HEAD selalu di indeks
        0, tetapi <em>tidak efisien</em> — setiap dequeue membutuhkan O(n)
        operasi pergeseran.
      </InfoBox>
      <Divider />

      {/* ── 6. Alt-2 ─────────────────────────────────────────── */}
      <SectionHeading id='queue-alt2'>Implementasi Queue: Alt-2</SectionHeading>
      <P>
        HEAD bergeser ke kanan saat dequeue. Tidak perlu menggeser elemen tiap
        hapus.
      </P>
      <AsciiBox>{`Setelah beberapa dequeue:
       HEAD            TAIL
        ↓               ↓
[ ][ ][z][a][b][c][d][ ][ ][ ]
 0  1  2  3  4  5  6  7  8  9`}</AsciiBox>
      <P>Algoritma penghapusan (efisien):</P>
      <Pseudocode>{`1. Ambil nilai HEAD (buffer[idxHead])
2. Jika berelemen 1: idxHead = idxTail = IDX_UNDEF
3. Jika lebih dari 1: idxHead++`}</Pseudocode>
      <NoteBox>
        <strong>Masalah penuh semu (semi-full):</strong> Ketika{" "}
        <Mono>idxTail = CAPACITY-1</Mono> tetapi masih ada ruang kosong di kiri.
        Solusinya: saat akan enqueue dan idxTail sudah di ujung kanan, geser
        semua elemen kembali ke indeks 0.
      </NoteBox>
      <Divider />

      {/* ── 7. Alt-3 Circular ────────────────────────────────── */}
      <SectionHeading id='queue-alt3'>
        Implementasi Queue: Alt-3 (Circular Buffer)
      </SectionHeading>
      <P>
        HEAD dan TAIL berputar mengelilingi array — setelah mencapai ujung
        kanan, kembali ke awal. <strong>Tidak perlu pergeseran apapun</strong> —
        paling efisien.
      </P>
      <AsciiBox>{`Visualisasi melingkar (kapasitas 10):

         9   0
       8       1
      7         2
       6       3
         5   4

HEAD dan TAIL bergerak searah jarum jam saat enqueue,
HEAD bergerak saat dequeue.`}</AsciiBox>
      <P>Rumus suksesor indeks (modular):</P>
      <Pseudocode>{`Jika idxTail < CAPACITY-1 → idxTail baru = idxTail + 1
Jika idxTail = CAPACITY-1 → idxTail baru = 0

Ringkas: idxTail baru = (idxTail + 1) mod CAPACITY`}</Pseudocode>
      <P>
        Variasi lain: mengganti <Mono>idxTail</Mono> dengan <Mono>count</Mono>{" "}
        (jumlah elemen saat ini) sehingga kondisi penuh cukup dicek dengan{" "}
        <Mono>count = CAPACITY</Mono>.
      </P>
      <InfoBox>
        <strong>Analisis Alt-3:</strong> Enqueue dan dequeue keduanya O(1) —
        tidak ada pergeseran elemen sama sekali. Ini adalah implementasi terbaik
        untuk queue berbasis array.
      </InfoBox>
      <Divider />

      {/* ── 8. Implementasi C ────────────────────────────────── */}
      <SectionHeading id='queue-c'>
        Implementasi Queue dalam Bahasa C (Alt-2)
      </SectionHeading>
      <SubHeading>File queue.h</SubHeading>
      <CodeBlock language='c'>{`
#ifndef QUEUE_H
#define QUEUE_H

#include "boolean.h"
#include <stdlib.h>

#define IDX_UNDEF -1
#define CAPACITY  10

typedef int ElType;

typedef struct {
    ElType buffer[CAPACITY];
    int idxHead;
    int idxTail;
} Queue;

/* Selektor */
#define IDX_HEAD(q) (q).idxHead
#define IDX_TAIL(q) (q).idxTail
#define HEAD(q)     (q).buffer[(q).idxHead]
#define TAIL(q)     (q).buffer[(q).idxTail]

void    CreateQueue(Queue *q);
boolean isEmpty(Queue q);
boolean isFull(Queue q);
int     length(Queue q);
void    enqueue(Queue *q, ElType val);
void    dequeue(Queue *q, ElType *val);

#endif
`}</CodeBlock>

      <SubHeading>Fungsi-fungsi dasar</SubHeading>
      <CodeBlock language='c'>{`
void CreateQueue(Queue *q) {
    IDX_HEAD(*q) = IDX_UNDEF;
    IDX_TAIL(*q) = IDX_UNDEF;
}

boolean isEmpty(Queue q) {
    return (IDX_HEAD(q) == IDX_UNDEF) && (IDX_TAIL(q) == IDX_UNDEF);
}

boolean isFull(Queue q) {
    return (IDX_HEAD(q) == 0) && (IDX_TAIL(q) == CAPACITY - 1);
}

int length(Queue q) {
    return (IDX_TAIL(q) - IDX_HEAD(q)) + 1;
}
`}</CodeBlock>

      <SubHeading>
        Implementasi enqueue (Alt-2 — geser jika mentok kanan)
      </SubHeading>
      <CodeBlock language='c'>{`
void enqueue(Queue *q, ElType val) {
    if (isEmpty(*q)) {
        IDX_HEAD(*q) = 0;
        IDX_TAIL(*q) = 0;
    } else {
        if (IDX_TAIL(*q) == (CAPACITY - 1)) {  /* mentok kanan, geser dulu */
            int i;
            for (i = IDX_HEAD(*q); i <= IDX_TAIL(*q); i++) {
                (*q).buffer[i - IDX_HEAD(*q)] = (*q).buffer[i];
            }
            IDX_TAIL(*q) -= IDX_HEAD(*q);
            IDX_HEAD(*q) = 0;
        }
        IDX_TAIL(*q)++;
    }
    TAIL(*q) = val;
}
`}</CodeBlock>

      <SubHeading>Implementasi dequeue</SubHeading>
      <CodeBlock language='c'>{`
void dequeue(Queue *q, ElType *val) {
    *val = HEAD(*q);
    if (IDX_HEAD(*q) == IDX_TAIL(*q)) {
        IDX_HEAD(*q) = IDX_UNDEF;
        IDX_TAIL(*q) = IDX_UNDEF;
    } else {
        IDX_HEAD(*q)++;
    }
}
`}</CodeBlock>
      <Divider />

      {/* ── 9. Stack Intro ───────────────────────────────────── */}
      <SectionHeading id='stack-intro'>Stack (Tumpukan)</SectionHeading>
      <P>
        <strong>Stack</strong> adalah struktur data dengan prinsip{" "}
        <strong>Last In, First Out (LIFO)</strong> — data yang terakhir masuk
        akan keluar paling pertama, seperti tumpukan piring.
      </P>
      <AsciiBox>{`push(10)   push(20)   push(30)

+----+
| 30 |  ← TOP (keluar duluan)
+----+
| 20 |
+----+
| 10 |
+----+`}</AsciiBox>
      <P>Contoh penggunaan stack:</P>
      <UL
        items={[
          "Undo di text editor",
          "Riwayat browser (back/forward)",
          "Call stack dalam eksekusi program",
          "Evaluasi ekspresi aritmatika (postfix)",
          "Rekursivitas dan backtracking",
        ]}
      />
      <Divider />

      {/* ── 10. Struktur Stack ───────────────────────────────── */}
      <SectionHeading id='stack-struktur'>Struktur Stack</SectionHeading>
      <P>
        Stack hanya dikenali dari satu ujung, yaitu <strong>TOP</strong>:
      </P>
      <Pseudocode>{`Penyisipan (push) → dilakukan di atas TOP
Penghapusan (pop)  → dilakukan pada TOP`}</Pseudocode>
      <AsciiBox>{`Stack tidak kosong (5 elemen):
Index:   0    1    2    3    4    5    6    7    8    9
Value:  [x]  [y]  [z]  [a]  [b]  [ ]  [ ]  [ ]  [ ]  [ ]
                              ↑
                        TOP (idxTop = 4)

Stack kosong:
Index:   0    1    2    3    4    5    6    7    8    9
Value:  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]
  ↑
TOP = IDX_UNDEF`}</AsciiBox>
      <Divider />

      {/* ── 11. Perbandingan ─────────────────────────────────── */}
      <SectionHeading id='stack-perbandingan'>
        Queue vs Stack vs List
      </SectionHeading>
      <W3Table
        headers={["Konsep", "Prinsip", "Ujung Aktif"]}
        rows={[
          [
            "Stack",
            "LIFO — terakhir masuk, pertama keluar",
            "Satu ujung (TOP)",
          ],
          [
            "Queue",
            "FIFO — pertama masuk, pertama keluar",
            "Dua ujung (HEAD dan TAIL)",
          ],
          ["List", "Bebas — akses di mana saja", "Di mana saja"],
        ]}
      />
      <Divider />

      {/* ── 12. Operasi Stack ────────────────────────────────── */}
      <SectionHeading id='stack-operasi'>Operasi Stack</SectionHeading>
      <W3Table
        headers={["Operasi", "Fungsi"]}
        rows={[
          ["CreateStack", "Membuat tumpukan kosong"],
          ["top", "Mengirimkan elemen teratas saat ini"],
          ["length", "Mengirimkan banyaknya elemen saat ini"],
          ["push", "Menambahkan elemen sebagai TOP baru"],
          ["pop", "Mengambil nilai TOP, TOP berkurang 1"],
          ["isEmpty", "Mengecek apakah stack kosong"],
          ["isFull", "Mengecek apakah stack penuh"],
        ]}
      />
      <Divider />

      {/* ── 13. ADT Stack ────────────────────────────────────── */}
      <SectionHeading id='stack-adt'>ADT Stack dengan Array</SectionHeading>
      <Pseudocode>{`KAMUS UMUM
constant IDX_UNDEF: integer = -1
constant CAPACITY: integer = 10

type ElType: integer  { elemen Stack }

type Stack: < buffer: array [0..CAPACITY-1] of ElType,
               idxTop: integer >`}</Pseudocode>
      <P>
        Stack kosong ditandai dengan <Mono>idxTop = IDX_UNDEF</Mono>. Stack
        tidak memerlukan <Mono>idxHead</Mono> karena hanya beroperasi di satu
        ujung.
      </P>
      <Divider />

      {/* ── 14. Push & Pop ───────────────────────────────────── */}
      <SectionHeading id='stack-pushpop'>Algoritma Push & Pop</SectionHeading>
      <P>
        Algoritma <strong>push</strong> (tambah elemen ke TOP):
      </P>
      <Pseudocode>{`s.idxTop ← s.idxTop + 1
s.buffer[s.idxTop] ← val`}</Pseudocode>
      <P>
        Algoritma <strong>pop</strong> (ambil elemen dari TOP):
      </P>
      <Pseudocode>{`val ← top(s)        { yaitu s.buffer[s.idxTop] }
s.idxTop ← s.idxTop - 1`}</Pseudocode>
      <InfoBox>
        <strong>Mengapa Stack lebih sederhana dari Queue?</strong> Stack hanya
        mengelola satu ujung (TOP) sehingga push dan pop masing-masing O(1)
        tanpa pergeseran dan tanpa masalah penuh semu.
      </InfoBox>
      <Divider />

      {/* ── 15. Implementasi C Stack ─────────────────────────── */}
      <SectionHeading id='stack-c'>
        Implementasi Stack dalam Bahasa C
      </SectionHeading>
      <SubHeading>File stack.h</SubHeading>
      <CodeBlock language='c'>{`
#ifndef STACK_H
#define STACK_H

#include "boolean.h"

#define IDX_UNDEF -1
#define CAPACITY  10

typedef int ElType;

typedef struct {
    ElType buffer[CAPACITY];
    int    idxTop;
} Stack;

#define IDX_TOP(s) (s).idxTop
#define TOP(s)     (s).buffer[(s).idxTop]

void    CreateStack(Stack *s);
boolean isEmpty(Stack s);
boolean isFull(Stack s);
int     length(Stack s);
void    push(Stack *s, ElType val);
void    pop(Stack *s, ElType *val);

#endif
`}</CodeBlock>

      <SubHeading>Implementasi semua fungsi</SubHeading>
      <CodeBlock language='c'>{`
void CreateStack(Stack *s) {
    IDX_TOP(*s) = IDX_UNDEF;
}

boolean isEmpty(Stack s) {
    return (IDX_TOP(s) == IDX_UNDEF);
}

boolean isFull(Stack s) {
    return (IDX_TOP(s) == CAPACITY - 1);
}

int length(Stack s) {
    return (IDX_TOP(s) + 1);
}

void push(Stack *s, ElType val) {
    IDX_TOP(*s)++;
    TOP(*s) = val;
}

void pop(Stack *s, ElType *val) {
    *val = TOP(*s);
    IDX_TOP(*s)--;
}
`}</CodeBlock>
      <Divider />

      {/* ── 16. Aplikasi Postfix ─────────────────────────────── */}
      <SectionHeading id='aplikasi'>
        Aplikasi: Evaluasi Ekspresi Postfix
      </SectionHeading>
      <P>
        Stack sangat cocok untuk mengevaluasi ekspresi <strong>postfix</strong>{" "}
        (Reverse Polish Notation — RPN). Dibandingkan dengan notasi infix,
        postfix tidak memerlukan tanda kurung.
      </P>
      <W3Table
        headers={["Postfix", "Infix"]}
        rows={[
          ["A B * C /", "(A*B)/C"],
          ["A B C ^ / D E * + A C * −", "(A/(B^C))+(D*E)−(A*C)"],
        ]}
      />
      <SubHeading>Algoritma Evaluasi Postfix</SubHeading>
      <Pseudocode>{`Baca token satu per satu:
  Jika token bukan operator → push ke stack
  Jika token operator       → pop dua operan, hitung, push hasilnya

Setelah semua token → top(stack) adalah hasil akhir`}</Pseudocode>
      <SubHeading>Contoh: A B * C /</SubHeading>
      <AsciiBox>{`Token 'A' → push        → Stack: [A]
Token 'B' → push        → Stack: [A, B]
Token '*' → pop B, pop A,
            push A*B    → Stack: [A×B]
Token 'C' → push        → Stack: [A×B, C]
Token '/' → pop C, pop A×B,
            push A×B/C  → Stack: [(A×B)/C]

Selesai → output: (A×B)/C`}</AsciiBox>
      <Divider />

      {/* ── 17. Tabel Perbandingan ───────────────────────────── */}
      <SectionHeading id='tabel-perbandingan'>
        Tabel Perbandingan Queue vs Stack
      </SectionHeading>
      <W3Table
        headers={["Aspek", "Queue", "Stack"]}
        rows={[
          ["Prinsip", "FIFO", "LIFO"],
          [
            "Ujung aktif",
            "HEAD (keluar) & TAIL (masuk)",
            "TOP (masuk & keluar)",
          ],
          ["Operasi tambah", "enqueue ke TAIL", "push ke TOP"],
          ["Operasi hapus", "dequeue dari HEAD", "pop dari TOP"],
          ["Implementasi array", "Lacak HEAD dan TAIL", "Cukup lacak TOP"],
          [
            "Alt. implementasi",
            "Alt-1, Alt-2, Alt-3 (circular)",
            "Satu cara (TOP naik/turun)",
          ],
          [
            "Contoh penggunaan",
            "Printer, job scheduling",
            "Undo, call stack, postfix",
          ],
        ]}
      />

      {/* Summary card */}
      <div className='mt-10 mb-6 bg-rose-50 border border-rose-200 rounded-xl p-6'>
        <h3 className='font-bold text-rose-900 text-base mb-3'>
          Ringkasan Penting
        </h3>
        <ul className='space-y-1.5 text-sm text-rose-900'>
          {[
            "Queue: FIFO — elemen pertama masuk adalah yang pertama keluar.",
            "Stack: LIFO — elemen terakhir masuk adalah yang pertama keluar.",
            "Queue memerlukan dua pointer (HEAD & TAIL); Stack hanya butuh satu (TOP).",
            "Alt-3 (circular buffer) adalah implementasi queue paling efisien — semua operasi O(1).",
            "Stack adalah solusi alami untuk evaluasi ekspresi postfix dan rekursivitas.",
            "Keduanya dapat diimplementasikan dengan array statis atau pointer dinamis.",
          ].map((item, i) => (
            <li key={i} className='flex gap-2'>
              <span className='text-rose-500 font-bold'>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content — Evaluasi Ekspresi Postfix
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
          <span className='bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full border border-rose-100'>
            Stack
          </span>
          <span className='bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full border border-rose-100'>
            Evaluasi Postfix
          </span>
          <span className='bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full border border-rose-100'>
            Implementasi C
          </span>
        </div>
        <h2 className='text-xl font-bold text-gray-900'>
          Evaluasi Ekspresi Postfix
        </h2>
      </div>

      {/* Deskripsi */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Deskripsi
        </h3>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed'>
          <p>
            Diberikan ekspresi postfix:{" "}
            <code className='bg-white border border-gray-200 text-rose-700 px-1.5 rounded font-mono text-[13px]'>
              2 3 + 4 *
            </code>
          </p>
          <p className='mt-2'>
            Dengan menggunakan ADT Stack, tuliskan penelusuran (trace) langkah
            demi langkah evaluasi ekspresi postfix tersebut. Kemudian tulis
            pseudocode algoritma umum untuk mengevaluasi ekspresi postfix
            sembarang.
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            Aturan: jika token adalah operan (angka) → push ke stack; jika
            operator → pop dua operan, hitung, push hasilnya.
          </p>
        </div>
      </div>

      {/* Input / Output */}
      <div className='grid grid-cols-2 gap-3 mb-5'>
        <div className='border border-gray-200 rounded-lg p-3'>
          <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
            Input
          </div>
          <p className='text-sm font-mono text-gray-700'>2 3 + 4 *</p>
        </div>
        <div className='border border-gray-200 rounded-lg p-3'>
          <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
            Output
          </div>
          <p className='text-sm font-mono text-gray-700'>20</p>
          <p className='text-xs text-gray-400 mt-0.5'>setara dengan (2+3)×4</p>
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
              Bayangkan kamu membaca token dari kiri ke kanan:
            </p>
            <ul className='list-disc list-inside space-y-1 text-sm'>
              <li>
                Token <code className='font-mono'>2</code> → angka, push ke
                stack
              </li>
              <li>
                Token <code className='font-mono'>3</code> → angka, push ke
                stack
              </li>
              <li>
                Token <code className='font-mono'>+</code> → operator, pop dua
                angka teratas, tambahkan, push hasilnya
              </li>
              <li>
                Token <code className='font-mono'>4</code> → angka, push ke
                stack
              </li>
              <li>
                Token <code className='font-mono'>*</code> → operator, pop dua
                angka teratas, kalikan, push hasilnya
              </li>
            </ul>
            <p className='mt-2'>
              Saat semua token habis, top(stack) adalah hasil akhir.
            </p>
          </div>
        )}
      </div>

      <hr className='my-6 border-gray-200' />

      {/* Pembahasan */}
      <div>
        <button
          onClick={() => setShowJawaban(!showJawaban)}
          className='flex items-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5 hover:bg-rose-100 transition-colors w-full mb-4'
        >
          <span>{showJawaban ? "▾" : "▸"}</span>
          <span>Lihat Pembahasan</span>
        </button>

        {showJawaban && (
          <div className='space-y-6'>
            {/* Trace table */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Trace Langkah demi Langkah
              </h3>
              <div className='overflow-x-auto rounded-lg border border-gray-200'>
                <table className='w-full border-collapse text-sm'>
                  <thead>
                    <tr>
                      <th className='bg-gray-800 text-white px-4 py-2.5 text-left font-semibold border-r border-gray-600'>
                        Token
                      </th>
                      <th className='bg-gray-800 text-white px-4 py-2.5 text-left font-semibold border-r border-gray-600'>
                        Aksi
                      </th>
                      <th className='bg-gray-800 text-white px-4 py-2.5 text-left font-semibold'>
                        Stack (bawah → atas)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["2", "push(2)", "[2]"],
                      ["3", "push(3)", "[2, 3]"],
                      ["+", "pop 3, pop 2 → push(2+3=5)", "[5]"],
                      ["4", "push(4)", "[5, 4]"],
                      ["*", "pop 4, pop 5 → push(5×4=20)", "[20]"],
                    ].map(([token, aksi, stack], i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className='px-4 py-2.5 font-mono font-bold text-rose-700 border-t border-gray-100 border-r'>
                          {token}
                        </td>
                        <td className='px-4 py-2.5 text-gray-700 border-t border-gray-100 border-r'>
                          {aksi}
                        </td>
                        <td className='px-4 py-2.5 font-mono text-gray-700 border-t border-gray-100'>
                          {stack}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='mt-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-800'>
                <strong>Hasil akhir:</strong>{" "}
                <code className='font-mono'>top(stack) = 20</code> — sesuai
                dengan (2+3)×4 = 20
              </div>
            </div>

            {/* Pseudocode */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Pseudocode Algoritma Umum
              </h3>
              <pre className='bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed'>
                {`procedure evalPostfix (input ekspresi: string)
{ IS: ekspresi adalah ekspresi postfix valid }
{ FS: menampilkan nilai hasil evaluasi }

KAMUS LOKAL
  s    : Stack
  token: string

ALGORITMA
  CreateStack(s)
  start          { inisialisasi mesin kata }
  WHILE cc ≠ MARK DO
    salinKata(token)
    IF isOperand(token) THEN
      push(s, strToInt(token))
    ELSE  { token adalah operator }
      pop(s, b)  { pop operan kedua }
      pop(s, a)  { pop operan pertama }
      push(s, applyOp(token, a, b))
    ENDIF
    ignoreBlank
  ENDWHILE
  { top(s) adalah hasil akhir }
  output ← top(s)`}
              </pre>
            </div>

            {/* Implementasi C */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Implementasi Inti dalam C
              </h3>
              <div className='rounded-lg overflow-hidden border border-gray-200 text-[13px]'>
                <div className='bg-gray-700 text-gray-300 px-4 py-1 font-mono text-xs tracking-wide'>
                  c
                </div>
                <pre className='bg-gray-900 text-green-300 px-5 py-4 overflow-x-auto font-mono leading-relaxed'>
                  {`int applyOp(char op, int a, int b) {
    if (op == '+') return a + b;
    if (op == '-') return a - b;
    if (op == '*') return a * b;
    if (op == '/') return a / b;
    return 0;
}

/* Dalam loop utama: */
if (isdigit(token[0])) {
    push(&s, atoi(token));
} else {
    int b, a;
    pop(&s, &b);   /* pop operan kedua */
    pop(&s, &a);   /* pop operan pertama */
    push(&s, applyOp(token[0], a, b));
}`}
                </pre>
              </div>
              <div className='mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 text-sm text-yellow-800'>
                <strong>Perhatian urutan pop:</strong> Pop pertama menghasilkan
                operan
                <em> kedua</em> (b), pop kedua menghasilkan operan{" "}
                <em>pertama</em> (a). Untuk operasi tidak komutatif seperti{" "}
                <code className='font-mono'>-</code> dan{" "}
                <code className='font-mono'>/</code>, urutan ini penting:
                hasilnya adalah <code className='font-mono'>a op b</code>, bukan{" "}
                <code className='font-mono'>b op a</code>.
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
// LATIHAN component — AI-generated questions for Stack & Queue
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

  const STORAGE_KEY = "asd_latihan_stack_queue_soal";

  const generateSoal = useCallback(async (kelemahan = []) => {
    setFase("loading");
    setGenError("");
    try {
      const res = await fetch("/api/latihan-stack-queue/generate", {
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
      // ignore
    }
    generateSoal([]);
  }, [generateSoal]);

  const evaluasiSoal = async () => {
    const soal = soalList[idx];
    setIsEvaluating(true);
    setEvalError("");
    try {
      const res = await fetch("/api/latihan-stack-queue/evaluasi", {
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
      const res = await fetch("/api/latihan-stack-queue/generate", {
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
      // silently ignore
    } finally {
      setRegeneratingIdx(null);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (fase === "loading") {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
        <svg
          className='animate-spin w-8 h-8 mb-4 text-rose-500'
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
          className='px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700'
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
            <p className='text-sm text-gray-500'>Queue dan Stack</p>
          </div>
        </div>

        <div className='bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl p-5 text-white mb-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-rose-200 text-sm font-medium'>
                Nilai Rata-rata
              </p>
              <p className='text-4xl font-bold'>
                {avgSkor}
                <span className='text-xl text-rose-300'>/100</span>
              </p>
            </div>
            <div className='text-right'>
              <p className='text-rose-200 text-sm'>Soal dievaluasi</p>
              <p className='text-2xl font-bold'>
                {allFeedbacks.length}/{soalList.length}
              </p>
            </div>
          </div>
          <div className='mt-3 bg-rose-500 rounded-full h-2'>
            <div
              className='bg-white h-2 rounded-full'
              style={{ width: `${avgSkor}%` }}
            />
          </div>
        </div>

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
                  ? "bg-white border-rose-600 text-rose-600"
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

        {curSoal && curFb && (
          <div className='border border-gray-200 rounded-xl overflow-hidden mb-4'>
            <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3'>
              <div className='w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>
                {curSoal.id}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap mb-1'>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === "implementasi" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}
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
                className='shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5'
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

        <div className='border border-rose-200 rounded-xl p-4 text-center bg-rose-50'>
          <p className='text-sm font-semibold text-rose-800 mb-1'>
            {konsepLemah.length > 0
              ? "Latihan soal baru untuk perkuat kelemahanmu"
              : "Kerjakan soal latihan baru"}
          </p>
          <p className='text-xs text-rose-600 mb-3'>
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(", ")}${konsepLemah.length > 3 ? "..." : ""}`
              : "AI akan membuat soal baru dengan tingkat kesulitan serupa"}
          </p>
          <button
            onClick={handleGenerateBaru}
            className='px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors'
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
        <p className='text-sm text-gray-500 mt-0.5'>Queue dan Stack</p>
      </div>

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
              ? "bg-rose-600 border-rose-600 text-white"
              : "bg-white border-rose-600 text-rose-600";
          else
            cls += jawaban[sq.id]?.trim()
              ? "bg-rose-100 border-rose-400 text-rose-700"
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

      <div className='border border-gray-200 rounded-xl overflow-hidden'>
        <div className='bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3'>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${currentFeedback ? (currentFeedback.skor >= 70 ? "bg-green-500 text-white" : "bg-red-400 text-white") : currentJawaban.trim() ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            {currentJawaban.trim() && !currentFeedback ? "✓" : soal.id}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap mb-1.5'>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === "implementasi" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}
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
            className='shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5'
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

        {soal.notasiAlgoritma && (
          <div className='px-4 py-2.5 bg-gray-50 border-b border-gray-200'>
            <button
              onClick={() => setShowNotasi((v) => !v)}
              className='text-xs text-rose-600 hover:underline font-medium flex items-center gap-1'
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
                  ? "// Tulis notasi algoritmik atau kode C kamu di sini..."
                  : "Tulis jawabanmu di sini..."
              }
              rows={soal.tipe === "implementasi" ? 12 : 6}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-y transition ${soal.tipe === "implementasi" ? "font-mono bg-gray-900 text-green-300" : "bg-white text-gray-700"}`}
              spellCheck={false}
            />
          </div>
        )}

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
              className='flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors min-h-10'
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
              className='flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg transition-colors min-h-10'
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
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-gray-900'>
          Ringkasan — Queue dan Stack
        </h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Implementasi Queue & Stack dengan Array
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 mb-6'>
        {/* 1 — Queue */}
        <div className='border border-rose-100 rounded-xl overflow-hidden'>
          <div className='bg-rose-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-rose-600 text-xs font-bold flex items-center justify-center shrink-0'>
              1
            </span>
            <span className='text-white font-bold text-sm'>Queue — FIFO</span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]'>
              {[
                {
                  name: "Alt-1",
                  desc: "HEAD di indeks 0, geser semua saat dequeue",
                  color: "bg-red-50 border-red-100 text-red-800",
                  perf: "O(n) dequeue",
                },
                {
                  name: "Alt-2",
                  desc: "HEAD geser kanan, geser balik jika mentok kanan",
                  color: "bg-yellow-50 border-yellow-100 text-yellow-800",
                  perf: "O(n) worst case",
                },
                {
                  name: "Alt-3",
                  desc: "Circular buffer, modular index",
                  color: "bg-green-50 border-green-100 text-green-800",
                  perf: "O(1) selalu",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`border rounded-lg px-3 py-2 ${item.color}`}
                >
                  <div className='font-bold mb-0.5'>{item.name}</div>
                  <div className='text-[11px] opacity-80 mb-1'>{item.desc}</div>
                  <code className='text-[11px] font-mono font-bold opacity-90'>
                    {item.perf}
                  </code>
                </div>
              ))}
            </div>
            <div className='mt-3 grid grid-cols-2 gap-2 text-[13px]'>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Struktur
                </div>
                <code className='font-mono text-[12px]'>
                  {"Queue: <buffer, idxHead, idxTail>"}
                </code>
              </div>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Kosong
                </div>
                <code className='font-mono text-[12px]'>
                  idxHead = idxTail = IDX_UNDEF
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* 2 — Stack */}
        <div className='border border-orange-100 rounded-xl overflow-hidden'>
          <div className='bg-orange-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-orange-600 text-xs font-bold flex items-center justify-center shrink-0'>
              2
            </span>
            <span className='text-white font-bold text-sm'>Stack — LIFO</span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-2 gap-2 text-[13px] mb-3'>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Struktur
                </div>
                <code className='font-mono text-[12px]'>
                  {"Stack: <buffer, idxTop>"}
                </code>
              </div>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Kosong
                </div>
                <code className='font-mono text-[12px]'>
                  idxTop = IDX_UNDEF
                </code>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-[13px]'>
              <div className='bg-orange-50 border border-orange-100 text-orange-800 rounded-lg px-3 py-2'>
                <div className='font-bold mb-0.5'>push</div>
                <code className='text-[11px] font-mono'>
                  idxTop++; buffer[idxTop] = val
                </code>
              </div>
              <div className='bg-orange-50 border border-orange-100 text-orange-800 rounded-lg px-3 py-2'>
                <div className='font-bold mb-0.5'>pop</div>
                <code className='text-[11px] font-mono'>
                  val = buffer[idxTop]; idxTop--
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* 3 — Postfix Eval */}
        <div className='border border-indigo-100 rounded-xl overflow-hidden'>
          <div className='bg-indigo-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0'>
              3
            </span>
            <span className='text-white font-bold text-sm'>
              Aplikasi: Evaluasi Postfix
            </span>
          </div>
          <div className='px-4 py-3 text-sm text-gray-700'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Algoritma
                </div>
                <pre className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-[12px] text-gray-800 leading-relaxed'>{`FOR setiap token DO
  IF operan → push
  IF operator →
    pop b (atas)
    pop a (bawah)
    push(a op b)
ENDFOR
output: top(stack)`}</pre>
              </div>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Trace: 2 3 + 4 *
                </div>
                <pre className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-[12px] text-gray-800 leading-relaxed'>{`2 → push → [2]
3 → push → [2,3]
+ → pop→push5 → [5]
4 → push → [5,4]
* → pop→push20 → [20]
Hasil: 20`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* 4 — Perbandingan */}
        <div className='border border-gray-200 rounded-xl overflow-hidden'>
          <div className='bg-gray-800 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-gray-800 text-xs font-bold flex items-center justify-center shrink-0'>
              4
            </span>
            <span className='text-white font-bold text-sm'>
              Perbandingan Cepat
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 gap-2 text-[13px]'>
              {[
                {
                  aspek: "Prinsip",
                  queue: "FIFO",
                  stack: "LIFO",
                  color: "bg-blue-50 border-blue-100 text-blue-800",
                },
                {
                  aspek: "Pointer",
                  queue: "HEAD + TAIL",
                  stack: "TOP saja",
                  color: "bg-green-50 border-green-100 text-green-800",
                },
                {
                  aspek: "Tambah",
                  queue: "enqueue → TAIL",
                  stack: "push → TOP",
                  color: "bg-yellow-50 border-yellow-100 text-yellow-800",
                },
                {
                  aspek: "Hapus",
                  queue: "dequeue ← HEAD",
                  stack: "pop ← TOP",
                  color: "bg-orange-50 border-orange-100 text-orange-800",
                },
              ].map((row) => (
                <div
                  key={row.aspek}
                  className={`border rounded-lg px-3 py-2 ${row.color}`}
                >
                  <span className='font-bold mr-2'>{row.aspek}:</span>
                  <span className='mr-2'>
                    Queue = <code className='font-mono'>{row.queue}</code>
                  </span>
                  <span>
                    Stack = <code className='font-mono'>{row.stack}</code>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick ref */}
      <div className='bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6'>
        <p className='text-sm font-bold text-rose-800 mb-2'>
          Operasi Queue — Referensi Cepat
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]'>
          <pre className='bg-white border border-rose-100 rounded-lg px-3 py-2 font-mono text-gray-800 leading-relaxed'>{`CreateQueue → buat queue kosong
enqueue     → tambah ke TAIL
dequeue     → hapus dari HEAD
head        → lihat HEAD
isEmpty     → cek kosong
isFull      → cek penuh
length      → jumlah elemen`}</pre>
          <pre className='bg-white border border-rose-100 rounded-lg px-3 py-2 font-mono text-gray-800 leading-relaxed'>{`CreateStack → buat stack kosong
push        → tambah ke TOP
pop         → hapus dari TOP
top         → lihat TOP
isEmpty     → cek kosong
isFull      → cek penuh
length      → jumlah elemen`}</pre>
        </div>
      </div>

      <div className='border border-gray-200 rounded-xl p-4 bg-gray-50'>
        <p className='text-sm font-bold text-gray-700 mb-3'>
          Kondisi Khusus yang Perlu Diingat
        </p>
        <div className='grid grid-cols-1 gap-2 text-[13px]'>
          {[
            {
              tip: "Queue kosong",
              detail: "idxHead = IDX_UNDEF dan idxTail = IDX_UNDEF",
              color: "bg-rose-50 border-rose-100 text-rose-800",
            },
            {
              tip: "Stack kosong",
              detail: "idxTop = IDX_UNDEF (yaitu -1)",
              color: "bg-orange-50 border-orange-100 text-orange-800",
            },
            {
              tip: "Alt-2 semi-full",
              detail:
                "idxTail = CAPACITY-1 tapi masih ada ruang di kiri → perlu geser balik",
              color: "bg-yellow-50 border-yellow-100 text-yellow-800",
            },
            {
              tip: "Postfix pop order",
              detail:
                "Pop pertama = operan kedua (b), pop kedua = operan pertama (a)",
              color: "bg-blue-50 border-blue-100 text-blue-800",
            },
          ].map((item) => (
            <div
              key={item.tip}
              className={`border rounded-lg px-3 py-2 ${item.color}`}
            >
              <div className='font-bold mb-0.5'>{item.tip}</div>
              <code className='text-[11px] font-mono opacity-80'>
                {item.detail}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress helpers
// ---------------------------------------------------------------------------
const PROGRESS_KEY = "asd_progress_stack_queue";
const TAB_KEYS = {
  MATERI: "materi",
  CONTOH: "contoh",
  LATIHAN: "latihan",
  RINGKASAN: "ringkasan",
};

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveProgress(updates) {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ ...readProgress(), ...updates }),
  );
}

const noopSubscribe = () => () => {};
const emptyCompleted = { materi: false, contoh: false, latihan: false, ringkasan: false };

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function StackQueuePage() {
  const [activeTab, setActiveTab] = useState("MATERI");
  const [activeSection, setActiveSection] = useState("queue-intro");
  const [showToc, setShowToc] = useState(false);
  const completedRef = useRef(null);
  const completed = useSyncExternalStore(
    noopSubscribe,
    () => {
      if (!completedRef.current) {
        const prog = readProgress();
        completedRef.current = {
          materi: !!prog.materi,
          contoh: !!prog.contoh,
          latihan: !!prog.latihan,
          ringkasan: !!prog.ringkasan,
        };
      }
      return completedRef.current;
    },
    () => emptyCompleted,
  );
  const [, forceUpdate] = useState(0);
  const mainRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowToc(false);
  };

  const handleComplete = (tab) => {
    const key = TAB_KEYS[tab];
    if (!key || completed[key]) return;
    saveProgress({ [key]: true });
    completedRef.current = { ...completedRef.current, [key]: true };
    forceUpdate((n) => n + 1);
  };

  const handleQuestionEvaluated = useCallback((questionId) => {
    const prog = readProgress();
    const evaluated = new Set(prog.latihanEvaluated ?? []);
    evaluated.add(questionId);
    saveProgress({ latihanEvaluated: [...evaluated] });
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const handleScroll = () => {
      const scrollY = main.scrollTop + 120;
      let current = "queue-intro";
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
            Queue dan Stack
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${
                s.level === 1 ? "pl-7" : ""
              } ${
                activeSection === s.id
                  ? "bg-rose-50 text-rose-700 font-semibold border-r-2 border-rose-600"
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
                      ? "bg-rose-700 text-white"
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

        {/* Mobile TOC toggle */}
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
                        ? "bg-rose-50 text-rose-700 font-semibold"
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
              <LatihanContent onQuestionEvaluated={handleQuestionEvaluated} />
            )}
            {activeTab === "RINGKASAN" && <RingkasanContent />}

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
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  sesi ini telah diselesaikan
                </div>
              ) : (
                <button
                  onClick={() => handleComplete(activeTab)}
                  className='w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold rounded-lg transition-colors'
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
