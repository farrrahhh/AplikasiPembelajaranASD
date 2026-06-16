"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { fetchTopicProgress, saveTopicProgress } from '../../../lib/progress';

import SoalSendiriPanel from '../../../components/SoalSendiriPanel';
import MateriChatWidget from '../../../components/MateriChatWidget';
// ---------------------------------------------------------------------------
// Sidebar section definitions
// ---------------------------------------------------------------------------
const SECTIONS = [
  { id: "intro", title: "Mesin Abstrak", level: 0 },
  { id: "mesin-karakter", title: "Mesin Karakter", level: 0 },
  { id: "komponen", title: "Komponen", level: 1 },
  { id: "primitif", title: "Primitif Mesin Karakter", level: 1 },
  { id: "impl-c", title: "Implementasi di C", level: 1 },
  { id: "studi-kar", title: "Studi Kasus Mesin Karakter", level: 0 },
  { id: "mesin-kata", title: "Mesin Kata", level: 0 },
  { id: "definisi-kata", title: "Definisi Kata", level: 1 },
  { id: "model-akuisisi", title: "Model Akuisisi Kata", level: 1 },
  { id: "versi-1", title: "Versi 1 — endKata", level: 0 },
  { id: "v1-primitif", title: "Primitif Versi 1", level: 1 },
  { id: "v1-impl", title: "Implementasi C Versi 1", level: 1 },
  { id: "versi-2", title: "Versi 2 — length = 0", level: 0 },
  { id: "versi-3", title: "Versi 3 — cc = MARK", level: 0 },
  { id: "perbandingan", title: "Perbandingan 3 Versi", level: 0 },
  { id: "studi-kata", title: "Studi Kasus Mesin Kata", level: 0 },
  { id: "kompilasi", title: "Cara Kompilasi", level: 0 },
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
      {/* ── 1. Mesin Abstrak ─────────────────────────────────── */}
      <SectionHeading id='intro'>Mesin Abstrak</SectionHeading>
      <P>
        <strong>Mesin</strong> adalah mekanisme yang terdefinisi dan mampu
        mengeksekusi aksi-aksi primitif yang terdefinisi untuknya.
      </P>
      <P>
        <strong>Mesin abstrak</strong> adalah mesin yang <em>dianggap ada</em>{" "}
        dan diasumsikan mampu melakukan mekanisme yang didefinisikan. Mesin
        abstrak memodelkan suatu semesta (<em>universe</em>) tertentu.
      </P>
      <P>Mesin abstrak mendefinisikan:</P>
      <AsciiBox>{`Sekumpulan state yang mungkin
Sekumpulan aksi primitif yang dapat dimengerti dan dieksekusi mesin tersebut`}</AsciiBox>
      <P>Contoh mesin abstrak:</P>
      <AsciiBox>{`mesin gambar
mesin integer
mesin rekam
mesin karakter`}</AsciiBox>
      <Divider />

      {/* ── 2. Mesin Karakter ────────────────────────────────── */}
      <SectionHeading id='mesin-karakter'>Mesin Karakter</SectionHeading>

      <SubHeading id='komponen'>Komponen Mesin Karakter</SubHeading>
      <P>Mesin karakter terdiri atas:</P>
      <div className='my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]'>
        {[
          {
            name: "Pita",
            desc: "Deret karakter, diakhiri MARK berupa titik ('.').\nPita yang hanya berisi MARK disebut pita kosong.",
            color: "bg-blue-50 border-blue-200 text-blue-900",
          },
          {
            name: "Tombol start & adv",
            desc: "start → menyiapkan pita untuk dibaca.\nadv → memajukan pita satu karakter.",
            color: "bg-purple-50 border-purple-200 text-purple-900",
          },
          {
            name: "Jendela (CC)",
            desc: "Berukuran satu karakter.\nCC = Current Character: karakter yang sedang tampak.",
            color: "bg-teal-50 border-teal-200 text-teal-900",
          },
          {
            name: "Lampu EOP",
            desc: "End of Pita: menyala (true) ketika CC = '.'\nJika EOP menyala, mesin tidak dapat dioperasikan lagi.",
            color: "bg-orange-50 border-orange-200 text-orange-900",
          },
        ].map((item) => (
          <div
            key={item.name}
            className={`border rounded-xl px-4 py-3 ${item.color}`}
          >
            <p className='font-bold text-[13px] mb-1'>{item.name}</p>
            <p className='text-[12px] whitespace-pre-line opacity-80'>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      <P>
        State mesin karakter ditentukan oleh <strong>CC</strong> dan{" "}
        <strong>EOP</strong>.
      </P>
      <AsciiBox>{`Ilustrasi pita:
Index:  I  T  B  A  D  A  D  I  .
                   ↑
                   CC = 'D', EOP tidak menyala

Ketika CC = '.', lampu EOP menyala.`}</AsciiBox>
      <NoteBox>
        EOP diwakili oleh boolean: <Mono>true</Mono> jika menyala,{" "}
        <Mono>false</Mono> jika tidak. Jika EOP menyala, mesin sudah tidak dapat
        dioperasikan lagi.
      </NoteBox>

      <SubHeading id='primitif'>Primitif Mesin Karakter</SubHeading>
      <Pseudocode>{`procedure start
{ Mesin siap dioperasikan. Pita disiapkan untuk dibaca.
  I.S.: sembarang
  F.S.: cc adalah karakter pertama pada pita
        Jika cc ≠ MARK maka eop = false
        Jika cc = MARK maka eop = true }

procedure adv
{ Pita dimajukan satu karakter.
  I.S.: Karakter pada jendela = cc, cc ≠ MARK
  F.S.: cc adalah karakter berikutnya dari cc yang lama,
        cc mungkin = MARK
        Jika cc = MARK maka eop = true }`}</Pseudocode>
      <InfoBox>
        <p className='text-sm font-semibold text-purple-800 mb-1'>
          Pola Pemrosesan Mesin Karakter
        </p>
        <pre className='text-sm font-mono text-purple-700 mt-1 leading-relaxed'>{`start         { First Elmt }
while cc ≠ MARK do
    { proses cc }
    adv         { Next Elmt }
{ cc = MARK → selesai }`}</pre>
      </InfoBox>

      <SubHeading id='impl-c'>Implementasi di C</SubHeading>
      <P>
        <strong>mesinkar.h</strong> — antarmuka:
      </P>
      <CodeBlock language='c'>{`
#ifndef __MESIN_KAR__
#define __MESIN_KAR__

#include "boolean.h"
#define MARK '.'

/* State Mesin */
extern char cc;
extern boolean eop;

void start();
void adv();

#endif
`}</CodeBlock>
      <P>
        <strong>mesinkar.c</strong> — implementasi:
      </P>
      <CodeBlock language='c'>{`
#include <stdio.h>
#include "mesinkar.h"

char cc;
boolean eop;
static FILE *pita;

void start() {
    pita = fopen("pitakar.txt", "r");
    adv();
}

void adv() {
    fscanf(pita, "%c", &cc);
    eop = (cc == MARK);
    if (eop) {
        fclose(pita);
    }
}
`}</CodeBlock>
      <NoteBox>
        Variabel <Mono>cc</Mono> dan <Mono>eop</Mono> bersifat{" "}
        <Mono>extern</Mono> — dideklarasikan di .h, didefinisikan di .c, dan
        dapat diakses oleh semua modul yang meng-include header-nya.
      </NoteBox>
      <Divider />

      {/* ── 3. Studi Kasus Mesin Karakter ────────────────────── */}
      <SectionHeading id='studi-kar'>Studi Kasus Mesin Karakter</SectionHeading>

      <SubHeading>CountCharacters — Menghitung Banyak Huruf</SubHeading>
      <Pseudocode>{`Program CountCharacters
{ Menghitung banyaknya huruf pada pita karakter }

KAMUS
    ctr: integer

ALGORITMA
    ctr ← 0             { Inisialisasi }
    start               { First Elmt }
    while (cc ≠ MARK) do
        ctr ← ctr + 1   { Proses }
        adv             { Next Elmt }
    { cc = MARK }
    output(ctr)         { Terminasi }`}</Pseudocode>

      <SubHeading>CountA — Menghitung Huruf &apos;A&apos;</SubHeading>
      <Pseudocode>{`Program CountA
{ Menghitung banyaknya huruf 'A' pada pita karakter }

KAMUS
    ctr: integer

ALGORITMA
    ctr ← 0
    start
    while (cc ≠ MARK) do
        if cc = 'A' then
            ctr ← ctr + 1
        adv
    output(ctr)`}</Pseudocode>
      <Divider />

      {/* ── 4. Mesin Kata ────────────────────────────────────── */}
      <SectionHeading id='mesin-kata'>Mesin Kata</SectionHeading>

      <SubHeading id='definisi-kata'>Definisi Kata</SubHeading>
      <P>
        <strong>Mesin Kata</strong> adalah mesin abstrak yang bekerja memproses
        kata <em>berdasarkan mesin karakter</em>. Kata didefinisikan sebagai:
      </P>
      <InfoBox>
        <p className='text-sm text-purple-800'>
          <strong>Kata</strong> = sederetan karakter suksesif pada pita yang
          merupakan karakter <strong>bukan blank</strong>
        </p>
      </InfoBox>
      <P>
        <strong>Definisi type Kata (notasi algoritmik):</strong>
      </P>
      <Pseudocode>{`type Kata: < buffer: array [0..N_MAX-1] of character,
             length: integer >
{ buffer adalah tempat penampung kata,
  length menyatakan panjang kata }
{ Kata kosong: K.length = 0 }`}</Pseudocode>
      <P>
        <strong>Dalam C:</strong>
      </P>
      <CodeBlock language='c'>{`
#define N_MAX 50
#define BLANK ' '

typedef struct {
    char buffer[N_MAX];
    int length;
} Kata;
`}</CodeBlock>

      <SubHeading id='model-akuisisi'>Model Akuisisi Kata</SubHeading>
      <P>
        Ada tiga versi model akuisisi kata, tergantung bagaimana blank dan akhir
        pita ditangani:
      </P>
      <W3Table
        headers={["Versi", "Penanda Akhir", "Keterangan"]}
        rows={[
          [
            "Versi 1",
            "endKata = true (boolean)",
            "Akhir proses ditandai boolean endKata",
          ],
          [
            "Versi 2",
            "currentKata.length = 0",
            "Akhir proses ditandai kata kosong",
          ],
          [
            "Versi 3",
            "cc = MARK langsung",
            "Tanpa variabel tambahan, ada initAkses",
          ],
        ]}
      />
      <P>Semua versi berbagi dua prosedur pembantu:</P>
      <Pseudocode>{`procedure ignoreBlank
{ Mengabaikan satu atau beberapa BLANK }
{ I.S.: cc sembarang }
{ F.S.: cc ≠ BLANK atau cc = MARK }
ALGORITMA
    while (cc = BLANK) do
        adv
{ cc ≠ BLANK }

procedure salinKata
{ Menyalin karakter non-blank ke currentKata }
{ I.S.: cc = karakter pertama dari kata }
{ F.S.: currentKata berisi kata; cc = BLANK atau cc = MARK }
KAMUS LOKAL
    i: integer
ALGORITMA
    i ← 0
    repeat
        currentKata.buffer[i] ← cc
        adv
        i ← i + 1
    until (cc = MARK) or (cc = BLANK)
    currentKata.length ← i`}</Pseudocode>
      <Divider />

      {/* ── 5. Versi 1 ───────────────────────────────────────── */}
      <SectionHeading id='versi-1'>
        Model Akuisisi Kata Versi 1 —{" "}
        <code className='font-mono text-[16px]'>endKata</code>
      </SectionHeading>
      <P>
        State tambahan: <Mono>endKata: boolean</Mono> dan{" "}
        <Mono>currentKata: Kata</Mono>. Akhir proses ditandai oleh{" "}
        <Mono>endKata = true</Mono>.
      </P>

      <SubHeading id='v1-primitif'>Primitif Versi 1</SubHeading>
      <Pseudocode>{`procedure startKata
{ I.S.: cc sembarang }
{ F.S.: endKata = true dan cc = MARK;
        atau endKata = false, currentKata adalah kata yang sudah
        diakuisisi, cc = karakter pertama sesudah karakter terakhir kata }
ALGORITMA
    start
    ignoreBlank
    if (cc = MARK) then
        endKata ← true
    else
        endKata ← false
        salinKata

procedure advKata
{ I.S.: cc = karakter pertama kata yang akan diakuisisi }
{ F.S.: currentKata = kata terakhir yang sudah diakuisisi,
        cc = karakter pertama sesudah karakter terakhir kata }
ALGORITMA
    ignoreBlank
    if (cc = MARK) then
        endKata ← true
    else
        salinKata`}</Pseudocode>
      <P>
        <strong>Pola penggunaan Versi 1:</strong>
      </P>
      <Pseudocode>{`startKata
while not endKata do
    { proses currentKata }
    advKata`}</Pseudocode>

      <SubHeading id='v1-impl'>Implementasi C Versi 1</SubHeading>
      <CodeBlock language='c'>{`
#include "mesinkata1.h"

boolean endKata;
Kata currentKata;

void ignoreBlank() {
    while (cc == BLANK) {
        adv();
    }
}

void salinKata() {
    int i = 0;
    while ((cc != MARK) && (cc != BLANK)) {
        currentKata.buffer[i] = cc;
        adv();
        i++;
    }
    currentKata.length = i;
}

void startKata() {
    start();
    ignoreBlank();
    if (cc == MARK) {
        endKata = TRUE;
    } else {
        endKata = FALSE;
        salinKata();
    }
}

void advKata() {
    ignoreBlank();
    if (cc == MARK) {
        endKata = TRUE;
    } else {
        salinKata();
    }
}
`}</CodeBlock>
      <Divider />

      {/* ── 6. Versi 2 ───────────────────────────────────────── */}
      <SectionHeading id='versi-2'>
        Model Akuisisi Kata Versi 2 —{" "}
        <code className='font-mono text-[16px]'>length = 0</code>
      </SectionHeading>
      <P>
        Seperti versi 1, tetapi{" "}
        <strong>akhir proses ditandai oleh kata kosong</strong> (
        <Mono>currentKata.length = 0</Mono>), bukan boolean <Mono>endKata</Mono>
        . Tidak ada state tambahan boolean.
      </P>

      <W3Table
        headers={["Aspek", "Versi 1", "Versi 2"]}
        rows={[
          ["Penanda akhir", "endKata = true", "currentKata.length = 0"],
          ["State tambahan", "endKata: boolean", "tidak ada"],
          [
            "salinKata saat MARK",
            "dicek sebelum salinKata",
            "salinKata langsung → length = 0",
          ],
        ]}
      />

      <P>
        <strong>startKata versi 2:</strong>
      </P>
      <Pseudocode>{`ALGORITMA
    start
    ignoreBlank
    salinKata
{ salinKata langsung dipanggil; jika cc = MARK, maka loop repeat
  tidak berjalan karena kondisi until langsung terpenuhi → length = 0 }`}</Pseudocode>
      <P>
        <strong>advKata versi 2:</strong>
      </P>
      <Pseudocode>{`ALGORITMA
    ignoreBlank
    salinKata`}</Pseudocode>
      <P>
        <strong>Pola penggunaan Versi 2:</strong>
      </P>
      <Pseudocode>{`startKata
while currentKata.length ≠ 0 do
    { proses currentKata }
    advKata`}</Pseudocode>
      <NoteBox>
        Pada versi 2, <Mono>salinKata</Mono> perlu dimodifikasi: loop{" "}
        <Mono>repeat-until</Mono>
        diganti dengan <Mono>while</Mono> agar langsung menghasilkan{" "}
        <Mono>length = 0</Mono>
        ketika <Mono>cc = MARK</Mono> sejak awal.
      </NoteBox>
      <Divider />

      {/* ── 7. Versi 3 ───────────────────────────────────────── */}
      <SectionHeading id='versi-3'>
        Model Akuisisi Kata Versi 3 —{" "}
        <code className='font-mono text-[16px]'>cc = MARK</code>
      </SectionHeading>
      <P>
        Versi 3 menggunakan <Mono>cc</Mono> langsung sebagai kondisi loop —
        tanpa variabel tambahan. Model ini membutuhkan prosedur{" "}
        <strong>
          <Mono>initAkses</Mono>
        </strong>{" "}
        yang memposisikan <Mono>cc</Mono> pada karakter pertama kata pertama.
      </P>

      <Pseudocode>{`procedure initAkses
{ Mengabaikan blank pada awal pita }
{ I.S.: cc sembarang }
{ F.S.: cc = MARK; atau cc = karakter pertama dari kata yang akan diakuisisi }
ALGORITMA
    start
    ignoreBlank

procedure advKata  { versi 3 }
{ I.S.: cc = karakter pertama kata yang akan diakuisisi }
{ F.S.: currentKata = kata terakhir yang sudah diakuisisi,
        cc = karakter pertama dari kata berikutnya, mungkin MARK }
ALGORITMA
    salinKata
    ignoreBlank`}</Pseudocode>
      <P>
        <strong>Pola penggunaan Versi 3:</strong>
      </P>
      <Pseudocode>{`initAkses
while cc ≠ MARK do
    advKata
    { proses currentKata }`}</Pseudocode>
      <NoteBox>
        Perhatikan urutan: pada versi 3, <Mono>advKata</Mono> dipanggil{" "}
        <em>sebelum</em> proses, bukan setelah. <Mono>advKata</Mono> melakukan
        akuisisi kata ke <Mono>currentKata</Mono>, baru kemudian{" "}
        <Mono>currentKata</Mono> diproses.
      </NoteBox>
      <Divider />

      {/* ── 8. Perbandingan ──────────────────────────────────── */}
      <SectionHeading id='perbandingan'>Perbandingan Tiga Versi</SectionHeading>
      <W3Table
        headers={["", "Versi 1", "Versi 2", "Versi 3"]}
        rows={[
          ["Penanda akhir", "endKata (boolean)", "length = 0", "cc = MARK"],
          ["Prosedur inisialisasi", "startKata", "startKata", "initAkses"],
          ["Prosedur lanjut", "advKata", "advKata", "advKata"],
          ["Kata kosong mungkin?", "Tidak", "Ya (sebagai sentinel)", "Tidak"],
          ["State tambahan", "endKata", "Tidak ada", "Tidak ada"],
          [
            "Kondisi loop",
            "not endKata",
            "currentKata.length ≠ 0",
            "cc ≠ MARK",
          ],
        ]}
      />
      <div className='my-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]'>
        {[
          {
            ver: "Versi 1",
            pola: "startKata\nwhile not endKata do\n    { proses }\n    advKata",
            color: "bg-blue-50 border-blue-200 text-blue-900",
          },
          {
            ver: "Versi 2",
            pola: "startKata\nwhile length ≠ 0 do\n    { proses }\n    advKata",
            color: "bg-purple-50 border-purple-200 text-purple-900",
          },
          {
            ver: "Versi 3",
            pola: "initAkses\nwhile cc ≠ MARK do\n    advKata\n    { proses }",
            color: "bg-teal-50 border-teal-200 text-teal-900",
          },
        ].map((item) => (
          <div
            key={item.ver}
            className={`border rounded-xl px-4 py-3 ${item.color}`}
          >
            <p className='font-bold mb-2'>{item.ver}</p>
            <pre className='font-mono text-[11px] whitespace-pre leading-relaxed opacity-90'>
              {item.pola}
            </pre>
          </div>
        ))}
      </div>
      <Divider />

      {/* ── 9. Studi Kasus Mesin Kata ────────────────────────── */}
      <SectionHeading id='studi-kata'>Studi Kasus Mesin Kata</SectionHeading>

      <SubHeading>Panjang Rata-Rata Kata</SubHeading>
      <P>
        Hitung panjang rata-rata dari semua kata dalam pita. Jika pita kosong,
        output pesan khusus.
      </P>
      <P>
        <strong>Menggunakan Versi 1:</strong>
      </P>
      <Pseudocode>{`KAMUS
    lengthTotal, nbKata: integer

ALGORITMA
    lengthTotal ← 0
    nbKata ← 0
    startKata
    while not endKata do
        lengthTotal ← lengthTotal + currentKata.length
        nbKata ← nbKata + 1
        advKata
    if (nbKata ≠ 0) then
        output(lengthTotal / nbKata)
    else
        output("Pita tidak mengandung kata")`}</Pseudocode>
      <P>
        <strong>Menggunakan Versi 3:</strong>
      </P>
      <Pseudocode>{`KAMUS
    lengthTotal, nbKata: integer

ALGORITMA
    initAkses
    lengthTotal ← 0
    nbKata ← 0
    while cc ≠ MARK do
        advKata
        lengthTotal ← lengthTotal + currentKata.length
        nbKata ← nbKata + 1
    if (nbKata ≠ 0) then
        output(lengthTotal / nbKata)
    else
        output("Pita tidak mengandung kata")`}</Pseudocode>

      <SubHeading>Hitung WHILE</SubHeading>
      <P>
        Hitung berapa kali kata <Mono>&apos;WHILE&apos;</Mono> muncul dalam
        pita. Diperlukan fungsi pembantu:
      </P>
      <Pseudocode>{`function isKataEqual(k1, k2: Kata) → boolean
{ Menghasilkan true jika k1 = k2 }`}</Pseudocode>
      <Pseudocode>{`KAMUS
    kataWHILE: Kata
    nWHILE: integer

ALGORITMA
    { Inisialisasi kataWHILE }
    kataWHILE.buffer[0] ← 'W'
    kataWHILE.buffer[1] ← 'H'
    kataWHILE.buffer[2] ← 'I'
    kataWHILE.buffer[3] ← 'L'
    kataWHILE.buffer[4] ← 'E'
    kataWHILE.length ← 5

    nWHILE ← 0
    startKata
    while not endKata do
        if isKataEqual(kataWHILE, currentKata) then
            nWHILE ← nWHILE + 1
        advKata
    output(nWHILE)`}</Pseudocode>
      <Divider />

      {/* ── 10. Kompilasi ────────────────────────────────────── */}
      <SectionHeading id='kompilasi'>Cara Kompilasi</SectionHeading>
      <P>
        Karena program terdiri dari beberapa file, kompilasi dilakukan bersama:
      </P>
      <CodeBlock language='bash'>{`
# Cara 1: kompilasi terpisah lalu link
$ cc -c mesinkar.c
$ cc -c mesinkata1.c
$ cc -c mainkata.c
$ cc -o mainkata mesinkar.o mesinkata1.o mainkata.o

# Cara 2: kompilasi sekaligus (lebih praktis)
$ cc -o mainkata mesinkar.c mesinkata1.c mainkata.c
`}</CodeBlock>
      <AsciiBox>{`Struktur file:
boolean.h       ← definisi boolean
mesinkar.h      ← state (cc, eop) + prototype start, adv
mesinkar.c      ← implementasi start, adv (baca dari file)
mesinkata1.h    ← state (endKata, currentKata) + prototype
mesinkata1.c    ← implementasi ignoreBlank, salinKata, startKata, advKata
mainkata.c      ← program yang menggunakan mesin kata`}</AsciiBox>

      {/* Summary card */}
      <div className='mt-10 mb-6 bg-purple-50 border border-purple-200 rounded-xl p-6'>
        <h3 className='font-bold text-purple-900 text-base mb-3'>
          Ringkasan Penting
        </h3>
        <ul className='space-y-1.5 text-sm text-purple-900'>
          {[
            "Mesin karakter membaca pita karakter satu per satu; MARK ('.') menandai akhir pita.",
            "Primitif mesin karakter: start (First Elmt) dan adv (Next Elmt).",
            "Mesin kata dibangun di atas mesin karakter; kata = deretan karakter non-blank.",
            "ignoreBlank dan salinKata adalah primitif pembantu yang dipakai ketiga versi.",
            "Versi 1: loop while not endKata. Versi 2: loop while length ≠ 0. Versi 3: loop while cc ≠ MARK.",
            "Pada versi 3, advKata dipanggil sebelum proses (urutan berbeda dari versi 1 & 2).",
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
// CONTOH content — Hitung-LE
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
            Mesin Karakter
          </span>
          <span className='bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100'>
            Traversal Pita
          </span>
          <span className='bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100'>
            Pencacahan
          </span>
        </div>
        <h2 className='text-xl font-bold text-gray-900'>
          Hitung-LE: Menghitung Pasangan &apos;L&apos; dan &apos;E&apos;
        </h2>
      </div>

      {/* Deskripsi */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Deskripsi
        </h3>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed'>
          <p>
            Diberikan sebuah mesin karakter dengan pita berisi karakter (mungkin
            kosong). Buatlah algoritma untuk menghitung banyaknya{" "}
            <strong>
              pasangan huruf &apos;L&apos; yang diikuti langsung oleh huruf
              &apos;E&apos;
            </strong>{" "}
            pada pita tersebut.
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            Banyaknya pasangan &apos;L&apos; dan &apos;E&apos; pada pita kosong
            adalah nol.
          </p>
        </div>
      </div>

      {/* Contoh I/O */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Contoh
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200'>
              Isi pita
            </div>
            <pre className='bg-white px-4 py-3 font-mono text-sm text-gray-800'>{`HELLO WORLD LEVEL.`}</pre>
          </div>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200'>
              Output
            </div>
            <pre className='bg-white px-4 py-3 font-mono text-sm text-gray-800'>{`2\n{ "LE" di HELLO dan LEVEL }`}</pre>
          </div>
        </div>
        <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200'>
              Pita kosong
            </div>
            <pre className='bg-white px-4 py-3 font-mono text-sm text-gray-800'>{`.`}</pre>
          </div>
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-200'>
              Output
            </div>
            <pre className='bg-white px-4 py-3 font-mono text-sm text-gray-800'>{`0`}</pre>
          </div>
        </div>
      </div>

      {/* Primitif yang tersedia */}
      <div className='mb-5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900'>
        <p className='font-semibold mb-1'>Primitif yang tersedia:</p>
        <code className='font-mono text-[13px]'>
          start, adv, cc, eop, MARK = &apos;.&apos;
        </code>
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
              Gunakan variabel <code className='font-mono'>prev</code> untuk
              menyimpan karakter sebelumnya:
            </p>
            <pre className='bg-white border border-yellow-100 rounded px-3 py-2 font-mono text-[13px] text-gray-800'>
              {`prev ← cc   { simpan cc sebelum adv }\nadv\n{ jika prev = 'L' AND cc = 'E' → hitung }\n\nAtau: setelah adv, cek apakah cc = 'E'\ndan cc lama = 'L'.`}
            </pre>
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
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Ide Algoritma
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700'>
                <ol className='list-decimal list-inside space-y-1.5'>
                  <li>
                    Inisialisasi counter{" "}
                    <code className='font-mono'>ctr ← 0</code>
                  </li>
                  <li>
                    Panggil <code className='font-mono'>start</code> (First
                    Elmt)
                  </li>
                  <li>
                    Dalam loop, simpan <code className='font-mono'>cc</code> ke{" "}
                    <code className='font-mono'>prev</code>, lalu panggil{" "}
                    <code className='font-mono'>adv</code>
                  </li>
                  <li>
                    Jika <code className='font-mono'>prev = &apos;L&apos;</code>{" "}
                    dan <code className='font-mono'>cc = &apos;E&apos;</code>,
                    tambah counter
                  </li>
                  <li>
                    Loop berakhir saat{" "}
                    <code className='font-mono'>cc = MARK</code>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Notasi Algoritmik
              </h3>
              <Pseudocode>{`Program HitungLE
{ Menghitung banyaknya pasangan 'LE' pada pita karakter }

KAMUS
    ctr  : integer
    prev : character

ALGORITMA
    ctr ← 0
    start
    { cc = karakter pertama pita }
    while cc ≠ MARK do
        prev ← cc       { simpan karakter sekarang }
        adv             { maju ke karakter berikutnya }
        if (prev = 'L') and (cc = 'E') then
            ctr ← ctr + 1
    { cc = MARK }
    output(ctr)`}</Pseudocode>
            </div>

            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Trace untuk{" "}
                <code className='font-mono text-[14px]'>
                  HELLO WORLD LEVEL.
                </code>
              </h3>
              <W3Table
                headers={["Langkah", "prev", "cc", "Kondisi", "ctr"]}
                rows={[
                  ["start", "—", "H", "—", "0"],
                  ["iter 1", "H", "E", "H≠L", "0"],
                  ["iter 2", "E", "L", "E≠L", "0"],
                  ["iter 3", "L", "L", "L=L, L≠E", "0"],
                  ["iter 4", "L", "O", "L=L, O≠E", "0"],
                  ["iter 5", "O", " ", "O≠L", "0"],
                  ["...", "...", "...", "...", "..."],
                  ["iter L→E (HELLO)", "L", "E", "L=L AND E=E ✓", "1"],
                  ["...", "...", "...", "...", "..."],
                  ["iter L→E (LEVEL)", "L", "E", "L=L AND E=E ✓", "2"],
                  ["akhir", "—", ".", "cc = MARK", "2"],
                ]}
              />
            </div>

            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Kasus Pita Kosong
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700'>
                <p>
                  Pita kosong = hanya berisi{" "}
                  <code className='font-mono'>&apos;.&apos;</code>.
                </p>
                <p className='mt-1'>
                  Setelah <code className='font-mono'>start</code>,{" "}
                  <code className='font-mono'>cc = &apos;.&apos;</code> = MARK.
                </p>
                <p className='mt-1'>
                  Loop <code className='font-mono'>while cc ≠ MARK</code>{" "}
                  langsung tidak dieksekusi → output 0. ✓
                </p>
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
// LATIHAN component
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

  const STORAGE_KEY = "asd_latihan_mesin_karakter_soal";

  const generateSoal = useCallback(async (kelemahan = []) => {
    setFase("loading");
    setGenError("");
    try {
      const res = await fetch("/api/latihan-mesin-karakter/generate", {
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
      /* fall through */
    }
    fetchTopicProgress(TOPIC_SLUG).then((prog) => {

      generateSoal(prog?.weak_concepts ?? []);

    });
  }, [generateSoal]);

  const evaluasiSoal = async () => {
    const soal = soalList[idx];
    setIsEvaluating(true);
    setEvalError("");
    try {
      const res = await fetch("/api/latihan-mesin-karakter/evaluasi", {
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
    saveTopicProgress(TOPIC_SLUG, { ...completed, weak_concepts: kelemahan });
    generateSoal(kelemahan);
  };

  const regenerateSoal = async (soalIdx) => {
    const target = soalList[soalIdx];
    setRegeneratingIdx(soalIdx);
    try {
      const res = await fetch("/api/latihan-mesin-karakter/generate", {
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
      /* silently ignore */
    } finally {
      setRegeneratingIdx(null);
    }
  };

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
        <div className='mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Hasil Latihan</h2>
          <p className='text-sm text-gray-500'>Mesin Karakter dan Kata</p>
        </div>
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
        <p className='text-sm text-gray-500 mt-0.5'>Mesin Karakter dan Kata</p>
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

      <div className='border border-gray-200 rounded-xl overflow-hidden'>
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
                  ? "// Tulis algoritma atau kode C kamu di sini..."
                  : "Tulis jawabanmu di sini..."
              }
              rows={soal.tipe === "implementasi" ? 12 : 6}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-y transition ${soal.tipe === "implementasi" ? "font-mono bg-gray-900 text-green-300" : "bg-white text-gray-700"}`}
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
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-gray-900'>
          Ringkasan — Mesin Karakter dan Kata
        </h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Mesin abstrak untuk pemrosesan pita
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 mb-6'>
        {/* 1 */}
        <div className='border border-purple-100 rounded-xl overflow-hidden'>
          <div className='bg-purple-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-purple-600 text-xs font-bold flex items-center justify-center shrink-0'>
              1
            </span>
            <span className='text-white font-bold text-sm'>
              Komponen Mesin Karakter
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 text-[13px]'>
              {[
                {
                  name: "Pita",
                  desc: "Deret karakter diakhiri MARK = '.'",
                  color: "bg-blue-50 border-blue-100 text-blue-800",
                },
                {
                  name: "CC",
                  desc: "Current Character — isi jendela saat ini",
                  color: "bg-purple-50 border-purple-100 text-purple-800",
                },
                {
                  name: "EOP",
                  desc: "true jika CC = MARK; mesin berhenti",
                  color: "bg-red-50 border-red-100 text-red-800",
                },
                {
                  name: "start / adv",
                  desc: "First Elmt / Next Elmt pita",
                  color: "bg-teal-50 border-teal-100 text-teal-800",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`border rounded-lg px-3 py-2 ${item.color}`}
                >
                  <code className='font-mono font-bold text-[12px] block mb-0.5'>
                    {item.name}
                  </code>
                  <div className='text-[11px] opacity-80'>{item.desc}</div>
                </div>
              ))}
            </div>
            <div className='mt-3'>
              <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                Pola Pemrosesan
              </div>
              <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[12px] leading-relaxed'>{`start
while cc ≠ MARK do
    { proses cc }
    adv`}</pre>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className='border border-indigo-100 rounded-xl overflow-hidden'>
          <div className='bg-indigo-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0'>
              2
            </span>
            <span className='text-white font-bold text-sm'>
              Primitif Bersama Mesin Kata
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]'>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  ignoreBlank
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[12px] leading-relaxed'>{`while cc = BLANK do
    adv
{ cc ≠ BLANK }`}</pre>
              </div>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  salinKata
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[12px] leading-relaxed'>{`i ← 0
repeat
  buffer[i] ← cc; adv; i++
until cc=MARK or cc=BLANK
length ← i`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className='border border-teal-100 rounded-xl overflow-hidden'>
          <div className='bg-teal-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-teal-600 text-xs font-bold flex items-center justify-center shrink-0'>
              3
            </span>
            <span className='text-white font-bold text-sm'>
              3 Versi Model Akuisisi Kata
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]'>
              {[
                {
                  ver: "Versi 1",
                  penanda: "endKata (boolean)",
                  init: "startKata",
                  pola: "while not endKata do\n    { proses }\n    advKata",
                  color: "bg-blue-50 border-blue-100 text-blue-900",
                },
                {
                  ver: "Versi 2",
                  penanda: "length = 0",
                  init: "startKata",
                  pola: "while length ≠ 0 do\n    { proses }\n    advKata",
                  color: "bg-purple-50 border-purple-100 text-purple-900",
                },
                {
                  ver: "Versi 3",
                  penanda: "cc = MARK",
                  init: "initAkses",
                  pola: "while cc ≠ MARK do\n    advKata\n    { proses }",
                  color: "bg-teal-50 border-teal-100 text-teal-900",
                },
              ].map((item) => (
                <div
                  key={item.ver}
                  className={`border rounded-xl px-3 py-3 ${item.color}`}
                >
                  <p className='font-bold mb-1'>{item.ver}</p>
                  <p className='text-[11px] mb-0.5 opacity-70'>
                    Penanda: <strong>{item.penanda}</strong>
                  </p>
                  <p className='text-[11px] mb-2 opacity-70'>
                    Init: <code className='font-mono'>{item.init}</code>
                  </p>
                  <pre className='font-mono text-[10px] leading-relaxed opacity-90 bg-white bg-opacity-50 rounded px-2 py-1'>
                    {item.pola}
                  </pre>
                </div>
              ))}
            </div>
            <div className='mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-[12px] text-yellow-800'>
              <strong>Perhatian Versi 3:</strong>{" "}
              <code className='font-mono'>advKata</code> dipanggil{" "}
              <em>sebelum</em> proses, bukan sesudah.
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className='border border-gray-200 rounded-xl overflow-hidden'>
          <div className='bg-gray-800 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-gray-800 text-xs font-bold flex items-center justify-center shrink-0'>
              4
            </span>
            <span className='text-white font-bold text-sm'>
              Struktur File &amp; Kompilasi
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]'>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Struktur File
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed'>{`boolean.h
mesinkar.h / mesinkar.c
mesinkata1.h / mesinkata1.c
mainkata.c`}</pre>
              </div>
              <div>
                <div className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                  Kompilasi
                </div>
                <pre className='bg-gray-900 text-green-300 rounded-lg px-3 py-2 font-mono text-[11px] leading-relaxed'>{`cc -o mainkata \\
  mesinkar.c \\
  mesinkata1.c \\
  mainkata.c`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-purple-50 border border-purple-200 rounded-xl p-4'>
        <p className='text-sm font-bold text-purple-800 mb-2'>
          Kapan Menggunakan Versi Mana?
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]'>
          {[
            {
              ver: "Versi 1",
              when: "Perlu state eksplisit untuk kontrol alur lebih fleksibel",
              color: "bg-white border-purple-100 text-purple-900",
            },
            {
              ver: "Versi 2",
              when: "Ingin menghindari state boolean tambahan; sentinel lebih bersih",
              color: "bg-white border-purple-100 text-purple-900",
            },
            {
              ver: "Versi 3",
              when: "Paling sederhana; langsung pakai cc sebagai kondisi loop",
              color: "bg-white border-purple-100 text-purple-900",
            },
          ].map((item) => (
            <div
              key={item.ver}
              className={`border rounded-lg px-3 py-2 ${item.color}`}
            >
              <div className='font-bold mb-0.5'>{item.ver}</div>
              <div className='opacity-80'>{item.when}</div>
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
const PROGRESS_KEY = "asd_progress_mesin_karakter";
const TOPIC_SLUG   = "mesin-karakter";
const TAB_KEYS = {
  MATERI: "materi",
  CONTOH: "contoh",
  LATIHAN: "latihan",
  RINGKASAN: "ringkasan",
};




// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function MesinKarakterPage() {
  const [activeTab, setActiveTab] = useState("MATERI");
  const [lockNotif, setLockNotif] = useState("");
  const [latihanMode, setLatihanMode] = useState('ai');
  const [activeSection, setActiveSection] = useState("intro");
  const [showToc, setShowToc] = useState(false);
  const [completed, setCompleted] = useState({ materi: false, contoh: false, latihan: false, ringkasan: false, weak_concepts: [] });

  useEffect(() => {
    fetchTopicProgress('mesin-karakter').then((prog) => {
      if (prog) setCompleted({ materi: !!prog.materi, contoh: !!prog.contoh, latihan: !!prog.latihan, ringkasan: !!prog.ringkasan, weak_concepts: prog.weak_concepts ?? [] });
    });
  }, []);
  const mainRef = useRef(null);

  const handleTabClick = (tab) => {
    const requires = { CONTOH: 'materi', LATIHAN: 'contoh', RINGKASAN: 'latihan' }[tab];
    if (requires && !completed[requires]) {
      const label = { materi: 'Materi', contoh: 'Contoh', latihan: 'Latihan' }[requires];
      setLockNotif(`Selesaikan tab ${label} terlebih dahulu.`);
      setTimeout(() => setLockNotif(''), 3000);
      return;
    }
    setLockNotif('');
    setActiveTab(tab);
    setShowToc(false);
  };

  const handleComplete = (tab) => {
    const key = TAB_KEYS[tab];
    if (!key || completed[key]) return;
    const next = { ...completed, [key]: true };
    setCompleted(next);
    saveTopicProgress('mesin-karakter', next);
  };

  const handleQuestionEvaluated = useCallback((questionId) => {
    try {
      const evaluated = new Set(JSON.parse(localStorage.getItem('asd_evaluated_mesin_karakter') ?? '[]'));
      evaluated.add(questionId);
      localStorage.setItem('asd_evaluated_mesin_karakter', JSON.stringify([...evaluated]));
    } catch {}
  }, []);

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
    if (el && main)
      main.scrollTo({ top: el.offsetTop - 110, behavior: "smooth" });
  };

  return (
    <div
      className='flex flex-col lg:flex-row overflow-hidden'
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Sidebar */}
      <aside className='hidden lg:block w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto'>
        <div className='py-3'>
          <div className='px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest'>
            Mesin Karakter & Kata
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${s.level === 1 ? "pl-7" : ""} ${activeSection === s.id ? "bg-purple-50 text-purple-700 font-semibold border-r-2 border-purple-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
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
              const requires = { CONTOH: 'materi', LATIHAN: 'contoh', RINGKASAN: 'latihan' }[tab];
              const isLocked = requires ? !completed[requires] : false;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${isActive ? "bg-purple-700 text-white" : isLocked ? "bg-gray-50 text-gray-300 cursor-not-allowed" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {tab}
                  {isLocked && (
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
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

        {/* Mobile TOC */}
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
                    className={`w-full text-left text-[13px] px-4 py-2 transition-colors ${s.level === 1 ? "pl-8" : ""} ${activeSection === s.id ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {lockNotif && (
          <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            {lockNotif}
          </div>
        )}
        {/* Scrollable content */}
        <div ref={mainRef} className='flex-1 overflow-y-auto'>
          <div className='max-w-3xl mx-auto px-4 sm:px-8 py-5 sm:py-6'>
            {activeTab === "MATERI" && <MateriContent />}
            {activeTab === "MATERI" && <MateriChatWidget topicSlug={TOPIC_SLUG} />}
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
