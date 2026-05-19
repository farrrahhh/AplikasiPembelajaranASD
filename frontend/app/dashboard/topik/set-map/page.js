"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

const SECTIONS = [
  { id: "set-definisi", title: "ADT Set", level: 0 },
  { id: "set-operasi", title: "Operasi Set", level: 1 },
  { id: "set-aksioma", title: "Axiomatic Semantics", level: 1 },
  { id: "set-array", title: "Implementasi dengan Array", level: 1 },
  { id: "set-kinerja", title: "Perbandingan Kinerja", level: 1 },
  { id: "map-definisi", title: "ADT Map", level: 0 },
  { id: "map-operasi", title: "Operasi Map", level: 1 },
  { id: "map-aksioma", title: "Axiomatic Semantics", level: 1 },
  { id: "map-array", title: "Implementasi dengan Array", level: 1 },
  { id: "hash-fungsi", title: "Fungsi Hash", level: 0 },
  { id: "hash-collision", title: "Collision", level: 1 },
  { id: "hash-chaining", title: "Hash Chaining", level: 1 },
  { id: "hash-probing", title: "Open Addressing", level: 1 },
  { id: "hash-load", title: "Load Factor", level: 1 },
  { id: "hash-algoritma", title: "Algoritma set & find", level: 1 },
  { id: "hash-delete", title: "Penghapusan Elemen", level: 1 },
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
    <code className='bg-gray-100 text-teal-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200'>
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
    <pre className='my-4 bg-teal-50 border border-teal-100 rounded-lg px-5 py-4 text-[13px] font-mono text-teal-900 overflow-x-auto leading-relaxed'>
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
    <div className='my-4 bg-teal-50 border-l-4 border-teal-500 px-4 py-3 rounded-r-lg text-sm text-gray-700'>
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
      {/* ── 1. Set Definisi ──────────────────────────────────────── */}
      <SectionHeading id='set-definisi'>ADT Set</SectionHeading>
      <P>
        <strong>Set</strong> adalah kumpulan objek yang memenuhi tiga syarat:
      </P>
      <AsciiBox>{`1. Memiliki tipe yang sama
2. Setiap elemennya unik (tidak ada duplikat)
3. Tidak memiliki keterurutan (tidak ada "next" atau "previous")`}</AsciiBox>
      <P>Contoh operasi pada set:</P>
      <AsciiBox>{`S = {7, 12, 26, 32, 47}

add(S, 22) → S = {7, 12, 22, 26, 32, 47}  ✓ (22 belum ada)
add(S, 26) → S = {7, 12, 22, 26, 32, 47}  ✗ (26 sudah ada, tidak ditambah)`}</AsciiBox>
      <Divider />

      {/* ── 2. Operasi Set ───────────────────────────────────────── */}
      <SectionHeading id='set-operasi'>Operasi Set</SectionHeading>
      <P>
        Jika <Mono>S</Mono>, <Mono>S1</Mono>, <Mono>S2</Mono> adalah Set dengan
        elemen <Mono>ElmtS</Mono>:
      </P>
      <W3Table
        headers={["Operasi", "Keterangan"]}
        rows={[
          ["CreateSet", "Membuat sebuah set kosong"],
          ["isEmpty(S)", "True jika S kosong, false jika tidak"],
          ["length(S)", "Mengembalikan banyaknya elemen S"],
          ["add(ElmtS, S)", "Menambahkan ElmtS ke S, jika belum ada"],
          ["remove(ElmtS, S)", "Menghapus ElmtS dari S"],
          ["isIn(ElmtS, S)", "True jika ElmtS ada di dalam S"],
          ["isEqual(S1, S2)", "True jika S1 dan S2 memiliki elemen yang sama"],
          ["union(S1, S2)", "Menghasilkan gabungan S1 dan S2"],
          ["intersection(S1,S2)", "Menghasilkan irisan S1 dan S2"],
          ["setDifference(S1,S2)", "Menghasilkan S1 dikurangi S2"],
          ["isSubset(S1, S2)", "True jika S1 adalah subset dari S2"],
          ["copy(S)", "Mengcopy set S ke set baru"],
        ]}
      />
      <P>Contoh penggunaan:</P>
      <AsciiBox>{`s = {12, 26, 7, 47, 32}
t = {5, 12}

add(s, 22)           → s = {12, 26, 7, 47, 32, 22}
remove(s, 47)        → s = {12, 26, 7, 32, 22}
isIn(s, 7)           = true
isIn(t, 7)           = false
union(s, t)          = {12, 26, 7, 32, 22, 5}
intersection(s, t)   = {12}
setDifference(s, t)  = {26, 7, 32, 22}`}</AsciiBox>
      <Divider />

      {/* ── 3. Aksioma Set ───────────────────────────────────────── */}
      <SectionHeading id='set-aksioma'>Axiomatic Semantics Set</SectionHeading>
      <P>Aksioma mendeskripsikan perilaku operasi Set secara formal:</P>
      <Pseudocode>{`1) new() returns a set
2) isIn(v, new())        = false
3) isIn(v, add(v, S))   = true
4) isIn(v, add(u, S))   = isIn(v, S)           jika v ≠ u
5) remove(v, new())     = new()
6) remove(v, add(v, S)) = remove(v, S)
7) remove(v, add(u, S)) = add(u, remove(v, S))  jika v ≠ u
8) isEmpty(new())        = true
9) isEmpty(add(v, S))   = false`}</Pseudocode>
      <InfoBox>
        Aksioma 6 berarti <Mono>remove(v, add(v, S))</Mono> mengembalikan{" "}
        <Mono>remove(v, S)</Mono>— penghapusan <em>semua</em> kemunculan v
        (meskipun dalam Set, v sudah unik sehingga hanya ada satu). Aksioma 4
        dan 7 menjamin bahwa operasi pada elemen lain tidak berpengaruh.
      </InfoBox>
      <Divider />

      {/* ── 4. Implementasi Array ────────────────────────────────── */}
      <SectionHeading id='set-array'>
        Implementasi Set dengan Array
      </SectionHeading>
      <P>Set dapat diimplementasikan menggunakan array statik-eksplisit:</P>
      <Pseudocode>{`KAMUS UMUM
constant CAPACITY: integer = 100

type ElType: integer

type Set:
    < buffer: array [0..CAPACITY-1] of ElType,
      length: integer >`}</Pseudocode>
      <AsciiBox>{`S = {7, 12, 26, 32, 47}

Index:   0    1    2    3    4    5    6    7
Value:   7   12   26   32   47
         ^--------- terisi ---------^
                              length = 5`}</AsciiBox>
      <P>Ada dua cara menyusun elemen di dalam array:</P>
      <AsciiBox>{`1. Terurut berdasarkan nilai
   → [7, 12, 26, 32, 47]

2. Berdasarkan urutan insert (tidak terurut)
   → [12, 26, 7, 47, 32]`}</AsciiBox>
      <SubHeading>Trik hapus elemen (tidak terurut)</SubHeading>
      <P>
        Untuk <Mono>remove</Mono> pada array tidak terurut, elemen terakhir
        dipindahkan ke posisi elemen yang dihapus — tidak perlu menggeser semua
        elemen:
      </P>
      <AsciiBox>{`remove(26, S):

Sebelum:                         Sesudah:
Index:  0   1   2   3   4        Index:  0   1   2   3
Value: 12  26   7  47  32        Value: 12  32   7  47
       length = 5                       length = 4

Elemen terakhir (32) dipindah ke posisi 26 (indeks 1).`}</AsciiBox>
      <Divider />

      {/* ── 5. Perbandingan Kinerja ──────────────────────────────── */}
      <SectionHeading id='set-kinerja'>Perbandingan Kinerja</SectionHeading>
      <W3Table
        headers={["Operasi", "Array Tidak Terurut", "Array Terurut"]}
        rows={[
          ["isIn", "O(n) — linear search", "O(log n) — binary search"],
          ["add", "O(1) — tambah di akhir", "O(n) — cari posisi + geser"],
          ["remove", "O(n) — cari + pindah akhir", "O(n) — cari + geser"],
          [
            "union",
            "O(n × m) — cek satu per satu",
            "O(n + m) — merge dua list",
          ],
        ]}
      />
      <InfoBox>
        <strong>Kapan memilih mana?</strong> Jika <Mono>isIn</Mono> jauh lebih
        sering dipanggil daripada <Mono>add</Mono>, gunakan array{" "}
        <strong>terurut</strong> (binary search O(log n)). Jika <Mono>add</Mono>{" "}
        lebih dominan, gunakan array <strong>tidak terurut</strong> (O(1)).
        Untuk kinerja terbaik secara keseluruhan, gunakan hash table (O(1)
        rata-rata).
      </InfoBox>
      <Divider />

      {/* ── 6. Map Definisi ──────────────────────────────────────── */}
      <SectionHeading id='map-definisi'>ADT Map</SectionHeading>
      <P>
        <strong>Map</strong> adalah kumpulan pasangan{" "}
        <Mono>{"<key, value>"}</Mono> di mana nilai <Mono>key</Mono> bersifat
        unik. Map juga dikenal sebagai:
      </P>
      <UL items={["Associative array", "Symbol table", "Dictionary"]} />
      <AsciiBox>{`+------------+-----------+
|    Key     |   Value   |
+------------+-----------+
| "nama"     | "Budi"    |
| "nim"      | "13523001"|
| "jurusan"  | "IF"      |
+------------+-----------+`}</AsciiBox>
      <W3Table
        headers={["Konsep", "Isi", "Keunikan"]}
        rows={[
          ["Set", "Elemen tunggal", "Elemen unik"],
          ["Map", "Pasangan key-value", "Key unik"],
        ]}
      />
      <Divider />

      {/* ── 7. Operasi Map ───────────────────────────────────────── */}
      <SectionHeading id='map-operasi'>Operasi Map</SectionHeading>
      <W3Table
        headers={["Operasi", "Keterangan"]}
        rows={[
          ["CreateMap", "Membuat sebuah Map kosong"],
          ["isEmpty(M)", "True jika M kosong"],
          [
            "find(K, M)",
            "Mengembalikan value dari key K, atau VAL_UNDEF jika tidak ada",
          ],
          [
            "set(K, V, M)",
            "Menambah pasangan (K,V), atau update value jika K sudah ada",
          ],
          ["unset(K, M)", "Menghapus pasangan dengan key K"],
        ]}
      />
      <P>Contoh penggunaan:</P>
      <AsciiBox>{`M = {}

set("nama", "Budi", M)    → M = {("nama","Budi")}
set("nim", "13523001", M) → M = {("nama","Budi"), ("nim","13523001")}
set("nama", "Andi", M)    → M = {("nama","Andi"), ("nim","13523001")}
                              ^-- key "nama" sudah ada, value diupdate

find("nama", M)   = "Andi"
find("email", M)  = VAL_UNDEF

unset("nim", M)   → M = {("nama","Andi")}`}</AsciiBox>
      <Divider />

      {/* ── 8. Aksioma Map ───────────────────────────────────────── */}
      <SectionHeading id='map-aksioma'>Axiomatic Semantics Map</SectionHeading>
      <Pseudocode>{`1) new() returns a map
2) find(k, set(k, v, M))    = v
3) find(k, set(j, v, M))    = find(k, M)              jika k ≠ j
4) unset(k, new())           = new()
5) unset(k, set(k, v, M))   = unset(k, M)
6) unset(k, set(j, v, M))   = set(j, v, unset(k, M))  jika k ≠ j`}</Pseudocode>
      <InfoBox>
        Aksioma 2 menjamin bahwa <Mono>find</Mono> setelah <Mono>set</Mono>{" "}
        selalu mengembalikan value yang baru saja di-set. Aksioma 3 menjamin
        bahwa operasi pada key lain tidak berpengaruh pada key yang sedang
        dicari.
      </InfoBox>
      <Divider />

      {/* ── 9. Implementasi Map Array ────────────────────────────── */}
      <SectionHeading id='map-array'>
        Implementasi Map dengan Array
      </SectionHeading>
      <Pseudocode>{`KAMUS UMUM
constant CAPACITY: integer = 100
constant VAL_UNDEF: ElType = -1

type KeyType: integer
type ElType:  integer

type MapEntry:
    < key:   KeyType,
      value: ElType >

type Map:
    < buffer: array [0..CAPACITY-1] of MapEntry,
      length: integer >`}</Pseudocode>
      <AsciiBox>{`Index:   0              1              2
Value:  <"nama","Budi"> <"nim","0001"> <"jur","IF">
                                        length = 3`}</AsciiBox>
      <NoteBox>
        Pada implementasi array biasa, <Mono>find</Mono> membutuhkan O(n) untuk
        mencari key. Untuk performa lebih baik, gunakan hash table yang
        memetakan key ke indeks array secara langsung.
      </NoteBox>
      <Divider />

      {/* ── 10. Fungsi Hash ──────────────────────────────────────── */}
      <SectionHeading id='hash-fungsi'>Fungsi Hash</SectionHeading>
      <P>
        <strong>Fungsi hash</strong> adalah fungsi yang memetakan data berukuran
        berapa pun menjadi nilai berukuran tetap (indeks array).
      </P>
      <AsciiBox>{`key (berukuran bebas) → fungsi hash → hash/indeks (berukuran tetap)`}</AsciiBox>
      <P>Contoh fungsi hash sederhana untuk bilangan bulat:</P>
      <Pseudocode>{`hash(k) = k mod CAPACITY`}</Pseudocode>
      <P>Fungsi hash yang baik memenuhi dua syarat:</P>
      <UL
        items={[
          "Komputasinya cepat (O(1))",
          "Meminimalisir collision — dua key berbeda menghasilkan hash yang sama",
        ]}
      />
      <Divider />

      {/* ── 11. Collision ────────────────────────────────────────── */}
      <SectionHeading id='hash-collision'>Collision</SectionHeading>
      <P>
        <strong>Collision</strong> terjadi ketika dua key berbeda menghasilkan
        nilai hash yang sama.
      </P>
      <AsciiBox>{`keys           hash function     hashes
John Smith  ─────────────────→   01
Lisa Smith  ─────────────────→   02
Sam Doe     ─────────────────→   04
Sandra Dee  ─────────────────→   02  ← collision dengan Lisa Smith!`}</AsciiBox>
      <P>
        Collision tidak bisa dihindari sepenuhnya (pigeonhole principle),
        sehingga perlu strategi penyelesaian.
      </P>
      <Divider />

      {/* ── 12. Hash Chaining ────────────────────────────────────── */}
      <SectionHeading id='hash-chaining'>
        Strategi 1: Hash Chaining
      </SectionHeading>
      <P>
        Setiap slot menyimpan sebuah <strong>linked list</strong>. Jika terjadi
        collision, elemen baru ditambahkan ke list pada slot yang sama.
      </P>
      <AsciiBox>{`Slot 001: → [Lisa Smith | 521-8976] → NULL
Slot 152: → [Sandra Dee | 521-9655] → [John Smith | 521-1234] → NULL
Slot 254: → [Sam Doe    | 521-5030] → NULL`}</AsciiBox>
      <UL
        items={[
          "Kelebihan: mudah diimplementasikan, tidak ada masalah jika tabel penuh",
          "Kekurangan: memerlukan alokasi memori dinamis untuk linked list",
        ]}
      />
      <Divider />

      {/* ── 13. Open Addressing ──────────────────────────────────── */}
      <SectionHeading id='hash-probing'>
        Strategi 2: Open Addressing
      </SectionHeading>
      <P>
        Jika slot terisi, cari slot lain yang kosong dalam array yang sama. Tiga
        metode pencarian slot alternatif:
      </P>
      <W3Table
        headers={["Metode", "Cara Mencari Slot Alternatif", "Masalah"]}
        rows={[
          [
            "Linear Probing",
            "+1, +2, +3, ... (modular)",
            "Clustering — slot bergerombol",
          ],
          [
            "Quadratic Probing",
            "+1, +4, +9, ... (modular)",
            "Secondary clustering",
          ],
          ["Double Hashing", "Gunakan fungsi hash kedua", "Lebih kompleks"],
        ]}
      />
      <P>
        Contoh linear probing dengan <Mono>hash(k) = k mod 7</Mono>:
      </P>
      <AsciiBox>{`hash("John") = 5 → slot 5 kosong → simpan di slot 5
hash("Lisa") = 5 → slot 5 terisi → cek slot 6 → kosong → simpan di slot 6
hash("Sam")  = 6 → slot 6 terisi → cek slot 0 → kosong → simpan di slot 0`}</AsciiBox>
      <Divider />

      {/* ── 14. Load Factor ──────────────────────────────────────── */}
      <SectionHeading id='hash-load'>Load Factor</SectionHeading>
      <P>
        <strong>Load factor</strong> adalah rasio slot terisi terhadap total
        slot:
      </P>
      <Pseudocode>{`load factor = jumlah slot terisi / total slot`}</Pseudocode>
      <P>Hash table bekerja baik saat load factor kecil:</P>
      <UL
        items={[
          "Idealnya load factor ≤ 0.7",
          "Jika terlalu tinggi: alokasikan tabel baru yang lebih besar, hash ulang semua elemen (rehashing)",
        ]}
      />
      <NoteBox>
        Semakin tinggi load factor, semakin besar kemungkinan collision dan
        semakin panjang probe sequence, sehingga kinerja mendekati O(n).
      </NoteBox>
      <Divider />

      {/* ── 15. Algoritma set & find ─────────────────────────────── */}
      <SectionHeading id='hash-algoritma'>
        Algoritma set & find pada Map dengan Hash
      </SectionHeading>
      <SubHeading>Algoritma set (linear probing)</SubHeading>
      <Pseudocode>{`procedure set(input/output m: Map, input k: KeyType, input v: ElType)
{ I.S. m terdefinisi, tidak penuh. }
{ F.S. Terdapat entri dengan key k pada m, dengan value = v. }

KAMUS LOKAL
  idx:   integer
  found: boolean

ALGORITMA
  found ← false
  idx   ← hash(k)

  while m.buffer[idx] ≠ NIL and not found do
      if m.buffer[idx].key = k then
          found ← true
      else
          idx ← (idx + 1) mod CAPACITY

  if found then
      m.buffer[idx].value ← v       { update existing }
  else
      m.buffer[idx] ← <k, v>        { insert new }
      m.length ← m.length + 1`}</Pseudocode>

      <SubHeading>Algoritma find</SubHeading>
      <Pseudocode>{`function find(m: Map, k: KeyType) → ElType
{ Mengembalikan value dengan key k, atau VAL_UNDEF jika tidak ada. }

KAMUS LOKAL
  idx:   integer
  found: boolean

ALGORITMA
  found ← false
  idx   ← hash(k)

  while m.buffer[idx] ≠ NIL and not found do
      if m.buffer[idx].key = k then
          found ← true
      else
          idx ← (idx + 1) mod CAPACITY

  if found then
      → m.buffer[idx].value
  else
      → VAL_UNDEF`}</Pseudocode>
      <Divider />

      {/* ── 16. Penghapusan ──────────────────────────────────────── */}
      <SectionHeading id='hash-delete'>
        Penghapusan Elemen pada Hash Table
      </SectionHeading>
      <P>
        Menghapus elemen di indeks <Mono>i</Mono> tidak bisa hanya mengosongkan
        slot tersebut.
      </P>
      <InfoBox>
        <strong>Masalahnya:</strong> Pencarian berhenti saat menemukan slot
        kosong. Jika ada elemen lain yang dipindah akibat collision ke slot
        setelah <Mono>i</Mono>, elemen tersebut tidak akan ditemukan lagi karena
        pencarian berhenti lebih awal di slot yang sudah dikosongkan.
      </InfoBox>
      <P>
        Solusinya: setelah menghapus elemen di indeks <Mono>i</Mono>, pindahkan
        elemen-elemen setelahnya yang hash aslinya ≤ <Mono>i</Mono> ke posisi
        yang lebih dekat dengan hash aslinya:
      </P>
      <Pseudocode>{`procedure unset(input k: KeyType, input/output m: Map)

ALGORITMA
  idx ← cari indeks elemen dengan key = k
  if tidak ditemukan then return

  m.buffer[idx] ← NIL
  m.length ← m.length - 1

  { Tata ulang elemen sesudahnya }
  j ← (idx + 1) mod CAPACITY
  while m.buffer[j] ≠ NIL do
      k2 ← m.buffer[j].key
      h2 ← hash(k2)
      if h2 ≠ j then   { elemen ini bukan di posisi aslinya }
          m.buffer[idx] ← m.buffer[j]
          m.buffer[j] ← NIL
          idx ← j
      j ← (j + 1) mod CAPACITY`}</Pseudocode>
      <Divider />

      {/* ── 17. Tabel Perbandingan ───────────────────────────────── */}
      <SectionHeading id='tabel-perbandingan'>
        Tabel Perbandingan Implementasi
      </SectionHeading>
      <W3Table
        headers={["Implementasi", "isIn / find", "add / set", "remove / unset"]}
        rows={[
          ["Array tidak terurut", "O(n)", "O(1)", "O(n)"],
          ["Array terurut", "O(log n)", "O(n)", "O(n)"],
          ["Hash table", "O(1) rata-rata", "O(1) rata-rata", "O(1) rata-rata"],
        ]}
      />
      <InfoBox>
        Hash table memberikan kinerja terbaik rata-rata untuk semua operasi,
        dengan syarat <strong>load factor dijaga rendah</strong> (idealnya ≤
        0.7) dan collision dikelola dengan baik.
      </InfoBox>

      {/* Summary card */}
      <div className='mt-10 mb-6 bg-teal-50 border border-teal-200 rounded-xl p-6'>
        <h3 className='font-bold text-teal-900 text-base mb-3'>
          Ringkasan Penting
        </h3>
        <ul className='space-y-1.5 text-sm text-teal-900'>
          {[
            "Set: kumpulan elemen unik tanpa urutan. Map: pasangan key-value dengan key unik.",
            "Axiomatic semantics mendefinisikan perilaku operasi secara formal dan independen dari implementasi.",
            "Array tidak terurut: add O(1), isIn O(n). Array terurut: add O(n), isIn O(log n).",
            "Hash table: rata-rata O(1) untuk semua operasi, tergantung load factor.",
            "Collision diselesaikan dengan chaining (linked list) atau open addressing (linear/quadratic probing).",
            "Penghapusan pada hash table memerlukan penataan ulang elemen yang collision-affected.",
          ].map((item, i) => (
            <li key={i} className='flex gap-2'>
              <span className='text-teal-500 font-bold'>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content — Hash Table Simulation
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
          <span className='bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-100'>
            Map
          </span>
          <span className='bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-100'>
            Hash Table
          </span>
          <span className='bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-100'>
            Linear Probing
          </span>
        </div>
        <h2 className='text-xl font-bold text-gray-900'>
          Simulasi Hash Table dengan Linear Probing
        </h2>
      </div>

      {/* Deskripsi */}
      <div className='mb-5'>
        <h3 className='text-sm font-bold text-gray-500 uppercase tracking-widest mb-2'>
          Deskripsi
        </h3>
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed'>
          <p>
            Diberikan Map berbasis hash table dengan{" "}
            <strong>CAPACITY = 7</strong> dan fungsi hash:{" "}
            <code className='font-mono bg-white border border-gray-200 text-teal-700 px-1.5 rounded text-[13px]'>
              hash(k) = k mod 7
            </code>
            . Semua slot awalnya kosong (NIL).
          </p>
          <p className='mt-2'>
            Simulasikan operasi{" "}
            <code className='font-mono text-teal-700'>set</code> berikut secara
            berurutan, gambarkan keadaan hash table setelah semua operasi
            selesai, dan tunjukkan langkah penanganan collision jika ada:
          </p>
          <pre className='mt-3 bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-800'>{`set(10, "A", M)
set(3,  "B", M)
set(17, "C", M)
set(14, "D", M)
set(6,  "E", M)`}</pre>
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
            <p className='mb-2'>Hitung hash setiap key terlebih dahulu:</p>
            <ul className='list-disc list-inside space-y-1 font-mono text-[13px]'>
              <li>hash(10) = 10 mod 7 = 3</li>
              <li>hash(3) = 3 mod 7 = 3</li>
              <li>hash(17) = 17 mod 7 = 3</li>
              <li>hash(14) = 14 mod 7 = 0</li>
              <li>hash(6) = 6 mod 7 = 6</li>
            </ul>
            <p className='mt-2'>
              Jika slot hash sudah terisi, geser +1 (linear probing) sampai
              menemukan slot kosong.
            </p>
          </div>
        )}
      </div>

      <hr className='my-6 border-gray-200' />

      {/* Pembahasan */}
      <div>
        <button
          onClick={() => setShowJawaban(!showJawaban)}
          className='flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5 hover:bg-teal-100 transition-colors w-full mb-4'
        >
          <span>{showJawaban ? "▾" : "▸"}</span>
          <span>Lihat Pembahasan</span>
        </button>

        {showJawaban && (
          <div className='space-y-6'>
            {/* Langkah per langkah */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-3'>
                Langkah demi Langkah
              </h3>
              <div className='space-y-3'>
                {[
                  {
                    op: 'set(10, "A")',
                    hash: "hash(10) = 3",
                    slot: "Slot 3 kosong → simpan di slot 3",
                    collision: false,
                  },
                  {
                    op: 'set(3, "B")',
                    hash: "hash(3) = 3",
                    slot: "Slot 3 terisi (10) → probe slot 4 → kosong → simpan di slot 4",
                    collision: true,
                  },
                  {
                    op: 'set(17, "C")',
                    hash: "hash(17) = 3",
                    slot: "Slot 3 terisi → slot 4 terisi → slot 5 kosong → simpan di slot 5",
                    collision: true,
                  },
                  {
                    op: 'set(14, "D")',
                    hash: "hash(14) = 0",
                    slot: "Slot 0 kosong → simpan di slot 0",
                    collision: false,
                  },
                  {
                    op: 'set(6, "E")',
                    hash: "hash(6) = 6",
                    slot: "Slot 6 kosong → simpan di slot 6",
                    collision: false,
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-3 ${step.collision ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}`}
                  >
                    <div className='flex items-start gap-2'>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${step.collision ? "bg-orange-200 text-orange-700" : "bg-green-200 text-green-700"}`}
                      >
                        {step.collision ? "Collision" : "OK"}
                      </span>
                      <div>
                        <code className='font-mono font-bold text-[13px] text-gray-800'>
                          {step.op}
                        </code>
                        <p className='text-xs text-gray-500 mt-0.5'>
                          <code className='font-mono'>{step.hash}</code>
                        </p>
                        <p className='text-sm text-gray-700 mt-0.5'>
                          {step.slot}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final table */}
            <div>
              <h3 className='text-base font-bold text-gray-800 mb-2'>
                Keadaan Akhir Hash Table
              </h3>
              <div className='overflow-x-auto rounded-lg border border-gray-200'>
                <table className='w-full border-collapse text-sm'>
                  <thead>
                    <tr>
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <th
                          key={i}
                          className='bg-gray-800 text-white px-4 py-2.5 text-center font-semibold border-r border-gray-600 last:border-r-0'
                        >
                          [{i}]
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='bg-gray-50'>
                      {[
                        { key: "14", val: '"D"', used: true },
                        { key: "NIL", val: "", used: false },
                        { key: "NIL", val: "", used: false },
                        { key: "10", val: '"A"', used: true },
                        { key: "3", val: '"B"', used: true, collision: true },
                        { key: "17", val: '"C"', used: true, collision: true },
                        { key: "6", val: '"E"', used: true },
                      ].map((cell, i) => (
                        <td
                          key={i}
                          className={`px-3 py-2.5 text-center border-t border-gray-100 border-r last:border-r-0 ${cell.collision ? "bg-orange-50" : ""}`}
                        >
                          {cell.used ? (
                            <>
                              <div className='font-mono font-bold text-teal-700 text-[13px]'>
                                {cell.key}
                              </div>
                              <div className='font-mono text-gray-600 text-[12px]'>
                                {cell.val}
                              </div>
                            </>
                          ) : (
                            <span className='text-gray-300 text-[12px] font-mono'>
                              NIL
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      {[
                        "hash=0",
                        "—",
                        "—",
                        "hash=3",
                        "hash=3*",
                        "hash=3*",
                        "hash=6",
                      ].map((note, i) => (
                        <td
                          key={i}
                          className='px-3 py-1.5 text-center border-t border-gray-100 border-r last:border-r-0'
                        >
                          <span
                            className={`text-[10px] font-mono ${note.includes("*") ? "text-orange-500" : "text-gray-400"}`}
                          >
                            {note}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='text-xs text-orange-600 mt-1.5'>
                * Elemen dipindah akibat collision dari slot 3
              </p>
            </div>

            {/* Analisis */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800'>
              <p className='font-semibold mb-1'>Analisis:</p>
              <ul className='list-disc list-inside space-y-0.5'>
                <li>
                  3 dari 5 key (10, 3, 17) memiliki hash = 3 → terjadi
                  clustering di slot 3–5
                </li>
                <li>
                  Load factor = 5/7 ≈ 0.71 — mendekati batas yang dianjurkan
                  (0.7)
                </li>
                <li>
                  Dengan chaining, semua key 10, 3, 17 akan tersimpan di linked
                  list slot 3
                </li>
              </ul>
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
// LATIHAN component — AI-generated questions for Set & Map
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

  const STORAGE_KEY = "asd_latihan_set_map_soal";

  const generateSoal = useCallback(async (kelemahan = []) => {
    setFase("loading");
    setGenError("");
    try {
      const res = await fetch("/api/latihan-set-map/generate", {
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
      const res = await fetch("/api/latihan-set-map/evaluasi", {
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
      const res = await fetch("/api/latihan-set-map/generate", {
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

  if (fase === "loading") {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
        <svg
          className='animate-spin w-8 h-8 mb-4 text-teal-500'
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
          className='px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700'
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
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Hasil Latihan</h2>
            <p className='text-sm text-gray-500'>Set dan Map</p>
          </div>
        </div>

        <div className='bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-5 text-white mb-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-teal-200 text-sm font-medium'>
                Nilai Rata-rata
              </p>
              <p className='text-4xl font-bold'>
                {avgSkor}
                <span className='text-xl text-teal-300'>/100</span>
              </p>
            </div>
            <div className='text-right'>
              <p className='text-teal-200 text-sm'>Soal dievaluasi</p>
              <p className='text-2xl font-bold'>
                {allFeedbacks.length}/{soalList.length}
              </p>
            </div>
          </div>
          <div className='mt-3 bg-teal-500 rounded-full h-2'>
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
                  ? "bg-white border-teal-600 text-teal-600"
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
              <div className='w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5'>
                {curSoal.id}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap mb-1'>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === "implementasi" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"}`}
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
                className='shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-teal-600 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5'
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

        <div className='border border-teal-200 rounded-xl p-4 text-center bg-teal-50'>
          <p className='text-sm font-semibold text-teal-800 mb-1'>
            {konsepLemah.length > 0
              ? "Latihan soal baru untuk perkuat kelemahanmu"
              : "Kerjakan soal latihan baru"}
          </p>
          <p className='text-xs text-teal-600 mb-3'>
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(", ")}${konsepLemah.length > 3 ? "..." : ""}`
              : "AI akan membuat soal baru dengan tingkat kesulitan serupa"}
          </p>
          <button
            onClick={handleGenerateBaru}
            className='px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors'
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
        <p className='text-sm text-gray-500 mt-0.5'>Set dan Map</p>
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
              ? "bg-teal-600 border-teal-600 text-white"
              : "bg-white border-teal-600 text-teal-600";
          else
            cls += jawaban[sq.id]?.trim()
              ? "bg-teal-100 border-teal-400 text-teal-700"
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
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${currentFeedback ? (currentFeedback.skor >= 70 ? "bg-green-500 text-white" : "bg-red-400 text-white") : currentJawaban.trim() ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            {currentJawaban.trim() && !currentFeedback ? "✓" : soal.id}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap mb-1.5'>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === "implementasi" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"}`}
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
            className='shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-teal-600 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5'
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
              className='text-xs text-teal-600 hover:underline font-medium flex items-center gap-1'
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
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-y transition ${soal.tipe === "implementasi" ? "font-mono bg-gray-900 text-green-300" : "bg-white text-gray-700"}`}
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
              className='flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors min-h-10'
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
              className='flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors min-h-10'
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
          Ringkasan — ADT Set dan Map
        </h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Set, Map, Hash Table, dan Collision Handling
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 mb-6'>
        {/* 1 — Set */}
        <div className='border border-teal-100 rounded-xl overflow-hidden'>
          <div className='bg-teal-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-teal-600 text-xs font-bold flex items-center justify-center shrink-0'>
              1
            </span>
            <span className='text-white font-bold text-sm'>ADT Set</span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]'>
              <div className='bg-teal-50 border border-teal-100 text-teal-800 rounded-lg px-3 py-2'>
                <div className='font-bold mb-1'>Ciri-ciri</div>
                <ul className='text-[12px] space-y-0.5 list-disc list-inside opacity-90'>
                  <li>Elemen bertipe sama</li>
                  <li>Tidak ada duplikat</li>
                  <li>Tidak ada urutan</li>
                </ul>
              </div>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='font-bold mb-1 text-gray-700'>
                  Operasi kunci
                </div>
                <code className='text-[11px] font-mono text-gray-600 leading-relaxed block'>{`add, remove, isIn
union, intersection
setDifference, isSubset`}</code>
              </div>
            </div>
            <div className='mt-2 grid grid-cols-3 gap-2 text-[12px]'>
              <div className='bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-lg px-2 py-1.5 text-center'>
                <div className='font-bold'>Tak Terurut</div>
                <div className='text-[11px] mt-0.5'>add O(1) | isIn O(n)</div>
              </div>
              <div className='bg-blue-50 border border-blue-100 text-blue-800 rounded-lg px-2 py-1.5 text-center'>
                <div className='font-bold'>Terurut</div>
                <div className='text-[11px] mt-0.5'>
                  add O(n) | isIn O(log n)
                </div>
              </div>
              <div className='bg-green-50 border border-green-100 text-green-800 rounded-lg px-2 py-1.5 text-center'>
                <div className='font-bold'>Hash</div>
                <div className='text-[11px] mt-0.5'>add O(1) | isIn O(1)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 — Map */}
        <div className='border border-indigo-100 rounded-xl overflow-hidden'>
          <div className='bg-indigo-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0'>
              2
            </span>
            <span className='text-white font-bold text-sm'>ADT Map</span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] mb-2'>
              <div className='bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-lg px-3 py-2'>
                <div className='font-bold mb-1'>Struktur</div>
                <code className='text-[12px] font-mono'>{`Map: <buffer, length>
Entry: <key, value>
Key unik | Value bebas`}</code>
              </div>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='font-bold mb-1 text-gray-700'>
                  Operasi kunci
                </div>
                <code className='text-[11px] font-mono text-gray-600 leading-relaxed block'>{`find(k, M) → value / UNDEF
set(k, v, M) → insert/update
unset(k, M) → hapus`}</code>
              </div>
            </div>
            <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12px]'>
              <span className='font-bold text-gray-600'>Alias:</span>
              <span className='text-gray-600 ml-1'>
                associative array, symbol table, dictionary
              </span>
            </div>
          </div>
        </div>

        {/* 3 — Hash Table */}
        <div className='border border-orange-100 rounded-xl overflow-hidden'>
          <div className='bg-orange-600 px-4 py-2.5 flex items-center gap-2'>
            <span className='w-6 h-6 rounded-full bg-white text-orange-600 text-xs font-bold flex items-center justify-center shrink-0'>
              3
            </span>
            <span className='text-white font-bold text-sm'>
              Hash Table & Collision
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]'>
              <div className='bg-orange-50 border border-orange-100 text-orange-800 rounded-lg px-3 py-2'>
                <div className='font-bold mb-1'>Hash Chaining</div>
                <div className='text-[12px] opacity-90'>
                  Setiap slot = linked list. Collision → tambah ke list slot
                  yang sama.
                </div>
              </div>
              <div className='bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-lg px-3 py-2'>
                <div className='font-bold mb-1'>Open Addressing</div>
                <div className='text-[12px] opacity-90'>
                  Collision → cari slot kosong berikutnya. Linear: +1.
                  Quadratic: +1,+4,+9.
                </div>
              </div>
            </div>
            <div className='mt-2 grid grid-cols-2 gap-2 text-[12px]'>
              <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                <div className='font-bold text-gray-700 mb-0.5'>
                  Load Factor
                </div>
                <code className='font-mono text-gray-600'>
                  terisi / total ≤ 0.7
                </code>
              </div>
              <div className='bg-red-50 border border-red-100 rounded-lg px-3 py-2'>
                <div className='font-bold text-red-700 mb-0.5'>
                  Hapus ≠ kosongkan slot
                </div>
                <div className='text-red-700 text-[11px]'>
                  Perlu tata ulang elemen collision-chain
                </div>
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
              Perbandingan Kinerja
            </span>
          </div>
          <div className='px-4 py-3'>
            <div className='grid grid-cols-1 gap-2 text-[13px]'>
              {[
                {
                  impl: "Array tak terurut",
                  isIn: "O(n)",
                  add: "O(1)",
                  del: "O(n)",
                  color: "bg-red-50 border-red-100 text-red-800",
                },
                {
                  impl: "Array terurut",
                  isIn: "O(log n)",
                  add: "O(n)",
                  del: "O(n)",
                  color: "bg-yellow-50 border-yellow-100 text-yellow-800",
                },
                {
                  impl: "Hash table",
                  isIn: "O(1) avg",
                  add: "O(1) avg",
                  del: "O(1) avg",
                  color: "bg-green-50 border-green-100 text-green-800",
                },
              ].map((row) => (
                <div
                  key={row.impl}
                  className={`border rounded-lg px-3 py-2 flex items-center gap-3 ${row.color}`}
                >
                  <span className='font-bold text-[12px] w-36 shrink-0'>
                    {row.impl}
                  </span>
                  <span className='font-mono text-[11px]'>
                    isIn: {row.isIn}
                  </span>
                  <span className='font-mono text-[11px]'>add: {row.add}</span>
                  <span className='font-mono text-[11px]'>del: {row.del}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick ref */}
      <div className='bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6'>
        <p className='text-sm font-bold text-teal-800 mb-2'>
          Axiomatic Semantics — Aturan Paling Penting
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]'>
          <div>
            <div className='text-[11px] font-bold text-teal-600 uppercase tracking-widest mb-1'>
              Set
            </div>
            <pre className='bg-white border border-teal-100 rounded-lg px-3 py-2 font-mono text-gray-800 leading-relaxed'>{`isIn(v, new())       = false
isIn(v, add(v, S))  = true
isEmpty(new())       = true
isEmpty(add(v, S))  = false`}</pre>
          </div>
          <div>
            <div className='text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1'>
              Map
            </div>
            <pre className='bg-white border border-indigo-100 rounded-lg px-3 py-2 font-mono text-gray-800 leading-relaxed'>{`find(k, set(k,v,M)) = v
find(k, set(j,v,M)) = find(k,M)  k≠j
unset(k, new())      = new()`}</pre>
          </div>
        </div>
      </div>

      <div className='border border-gray-200 rounded-xl p-4 bg-gray-50'>
        <p className='text-sm font-bold text-gray-700 mb-3'>
          Hal-hal yang Perlu Diingat
        </p>
        <div className='grid grid-cols-1 gap-2 text-[13px]'>
          {[
            {
              tip: "Set vs Map",
              detail: "Set: elemen unik. Map: key unik, tiap key punya value.",
              color: "bg-teal-50 border-teal-100 text-teal-800",
            },
            {
              tip: "Remove di Set tak terurut",
              detail:
                "Pindahkan elemen terakhir ke posisi yang dihapus → O(1) extra work",
              color: "bg-blue-50 border-blue-100 text-blue-800",
            },
            {
              tip: "set() di Map",
              detail:
                "Jika key sudah ada → update value. Jika belum → insert baru.",
              color: "bg-indigo-50 border-indigo-100 text-indigo-800",
            },
            {
              tip: "Hapus di Hash Table",
              detail:
                "Tidak bisa langsung kosongkan slot — harus tata ulang elemen chain.",
              color: "bg-red-50 border-red-100 text-red-800",
            },
          ].map((item) => (
            <div
              key={item.tip}
              className={`border rounded-lg px-3 py-2 ${item.color}`}
            >
              <div className='font-bold mb-0.5'>{item.tip}</div>
              <div className='text-[12px] opacity-80'>{item.detail}</div>
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
const PROGRESS_KEY = "asd_progress_set_map";
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
export default function SetMapPage() {
  const [activeTab, setActiveTab] = useState("MATERI");
  const [activeSection, setActiveSection] = useState("set-definisi");
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
      let current = "set-definisi";
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
            Set dan Map
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${
                s.level === 1 ? "pl-7" : ""
              } ${
                activeSection === s.id
                  ? "bg-teal-50 text-teal-700 font-semibold border-r-2 border-teal-600"
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
                      ? "bg-teal-700 text-white"
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
                        ? "bg-teal-50 text-teal-700 font-semibold"
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
                  className='w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors'
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
