'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'pengantar',       title: 'Aplikasi Struktur Data', level: 0 },
  { id: 'polinom',         title: 'Polinom',                level: 0 },
  { id: 'pol-definisi',    title: 'Definisi & Proses Dasar', level: 1 },
  { id: 'pol-kontigu',     title: 'Representasi Kontigu',   level: 1 },
  { id: 'pol-berkait',     title: 'Representasi Berkait',   level: 1 },
  { id: 'memori',          title: 'Pengelolaan Memori',     level: 0 },
  { id: 'mem-kontigu',     title: 'Representasi Kontigu',   level: 1 },
  { id: 'mem-first-best',  title: 'First Fit & Best Fit',   level: 1 },
  { id: 'mem-berkait',     title: 'Representasi Berkait',   level: 1 },
  { id: 'mem-gc',          title: 'Garbage Collection',     level: 1 },
  { id: 'multilist',       title: 'Multi-List',             level: 0 },
  { id: 'ml-alt1',         title: 'Alternatif 1',           level: 1 },
  { id: 'ml-alt2',         title: 'Alternatif 2',           level: 1 },
  { id: 'ml-perbandingan', title: 'Perbandingan',           level: 1 },
  { id: 'relasi-mn',       title: 'Relasi M-N',             level: 0 },
  { id: 'mn-alternatif',   title: 'Tiga Alternatif',        level: 1 },
  { id: 'mn-addrel',       title: 'Prosedur AddRel',        level: 1 },
];

const TABS = ['MATERI', 'CONTOH', 'LATIHAN', 'RINGKASAN'];
const PROGRESS_KEY = 'asd_progress_aplikasi';
const STORAGE_KEY  = 'asd_latihan_aplikasi_soal';
const TAB_KEYS = { MATERI: 'materi', CONTOH: 'contoh', LATIHAN: 'latihan', RINGKASAN: 'ringkasan' };

function readProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) ?? {}; }
  catch { return {}; }
}
function saveProgress(updates) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...readProgress(), ...updates }));
}

const noopSubscribe = () => () => {};
const emptyCompleted = { materi: false, contoh: false, latihan: false, ringkasan: false };

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
    <code className="bg-gray-100 text-orange-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200">
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
    <pre className="my-4 bg-orange-50 border border-orange-100 rounded-lg px-5 py-4 text-[13px] font-mono text-orange-900 overflow-x-auto leading-relaxed">
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
    <div className="my-4 bg-orange-50 border-l-4 border-orange-500 px-4 py-3 rounded-r-lg text-sm text-gray-700">
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

      <SectionHeading id="pengantar">Aplikasi Struktur Data</SectionHeading>
      <P>
        Setelah memahami struktur data dasar seperti array, linked list, dan tree, penting untuk mempelajari bagaimana
        struktur-struktur tersebut digunakan dalam menyelesaikan masalah nyata. Materi ini membahas empat studi kasus utama.
      </P>
      <W3Table
        headers={['Studi Kasus', 'Masalah yang Diselesaikan', 'Struktur Data yang Digunakan']}
        rows={[
          ['Polinom',              'Merepresentasikan dan mengoperasikan polinom matematika', 'Array kontigu / Linked list terurut'],
          ['Pengelolaan Memori',   'Alokasi dan dealokasi blok memori', 'Array boolean / Linked list zone kosong'],
          ['Multi-List',           'Mengelola data hierarkis (pegawai + anak)', 'Linked list berlapis'],
          ['Relasi M-N',           'Merepresentasikan relasi banyak-ke-banyak', 'Multi-linked list / list terpisah'],
        ]}
      />
      <Divider />

      <SectionHeading id="polinom">Studi Kasus: Polinom</SectionHeading>

      <SubHeading id="pol-definisi">Definisi &amp; Proses Dasar</SubHeading>
      <P>Polinom berderajat <em>n</em> didefinisikan sebagai:</P>
      <AsciiBox>{`P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x¹ + a₀

Catatan: indeks dimulai dari a₀ (konstanta) hingga aₙ (derajat tertinggi).
Ini berbeda dari notasi matematika biasa, tapi memudahkan pemrosesan berbasis indeks.`}</AsciiBox>
      <P>Contoh polinom:</P>
      <UL items={[
        'P1(x) = 4x⁵ + 2x⁴ + 7x² + 10',
        'P2(x) = 23x¹⁰⁰ + 9x⁹ + 2x⁷ + 4x⁵ + 2x⁴ + 3x² + 1',
        'P5(x) = x¹⁰⁰⁰ (polinom jarang / sparse)',
      ]} />
      <P>Lima proses dasar pada polinom:</P>
      <W3Table
        headers={['Proses', 'Keterangan']}
        rows={[
          ['Membentuk',   'Baca pasangan ⟨degree, coef⟩ satu per satu, diakhiri sentinel ⟨−999, 0⟩'],
          ['Menuliskan',  'Cetak polinom dari derajat tertinggi ke terendah (hanya suku ≠ 0)'],
          ['Menjumlahkan', 'P1 + P2 → P3'],
          ['Mengurangi',  'P1 − P2 → P3'],
          ['Menurunkan',  'P → P′ (turunan pertama)'],
        ]}
      />
      <Divider />

      <SectionHeading id="pol-kontigu">Representasi Kontigu (Array)</SectionHeading>
      <P>Gunakan array di mana <strong>indeks = derajat suku</strong> dan <strong>nilai = koefisien</strong>.</P>
      <AsciiBox>{`constant nMax: integer = 100
type Polinom: ⟨ degree:   integer,
                arrSuku:  array [0..nMax] of integer ⟩

arrSuku[i] = koefisien suku berderajat i
Degree     = derajat tertinggi polinom
Polinom kosong: Degree = −999`}</AsciiBox>
      <SubHeading>Membentuk Polinom</SubHeading>
      <Pseudocode>{`{ Baca pasangan ⟨degree, coef⟩ sampai degree = −999 }
input(d, c)
while d ≠ −999 do
    arrSuku[d] ← c
    if d > Degree then Degree ← d
    input(d, c)`}</Pseudocode>
      <SubHeading>Menuliskan Polinom</SubHeading>
      <Pseudocode>{`{ Traversal dari Degree turun ke 0, cetak yang ≠ 0 }
for i ← Degree downto 0 do
    if arrSuku[i] ≠ 0 then
        cetak(arrSuku[i], "x^", i)`}</Pseudocode>
      <SubHeading>Menjumlahkan / Mengurangi</SubHeading>
      <Pseudocode>{`{ Degree3 = max(Degree1, Degree2) }
for i ← maxDegree downto 0 do
    arrSuku3[i] ← arrSuku1[i] + arrSuku2[i]   { atau − }
{ Panggil adjustDegree jika koefisien tertinggi = 0 }`}</Pseudocode>
      <InfoBox>
        <strong>adjustDegree</strong> diperlukan setelah penjumlahan/pengurangan jika koefisien tertinggi menjadi 0.
        Misalnya P1 = 3x³ dan P2 = −3x³ + x → P3 = 0x³ + x, Degree seharusnya 1, bukan 3.
      </InfoBox>
      <SubHeading>Menurunkan Polinom</SubHeading>
      <Pseudocode>{`{ P' : suku ke-i menjadi suku ke-(i−1) dengan koef baru = i × koef lama }
for i ← Degree downto 1 do
    arrSuku1[i−1] ← i * arrSuku[i]
Degree1 ← Degree − 1`}</Pseudocode>
      <P>Kamus prosedur yang diimplementasikan:</P>
      <AsciiBox>{`procedure CreatePolinom (output p: Polinom)
procedure adjustDegree (input/output p: Polinom)
procedure populatePol  (output p: Polinom)
procedure displayPol   (input p: Polinom)
procedure addPol (input p1, p2: Polinom; output p3: Polinom)
procedure subPol (input p1, p2: Polinom; output p3: Polinom)
procedure derivPol (input p: Polinom; output p1: Polinom)`}</AsciiBox>
      <Divider />

      <SectionHeading id="pol-berkait">Representasi Berkait (Linked List)</SectionHeading>
      <P>
        Hanya menyimpan suku yang <strong>muncul</strong> (koefisien ≠ 0). Sangat hemat memori untuk polinom jarang
        seperti P5(x) = x¹⁰⁰⁰ yang hanya punya satu suku.
      </P>
      <AsciiBox>{`type Address: pointer to Suku
type Suku: ⟨ degree: integer,
              coef:   integer,
              next:   Address ⟩
type Polinom: Address  { alamat elemen pertama list }

List diurutkan MENURUN berdasarkan degree.
Polinom kosong: p = NIL`}</AsciiBox>
      <SubHeading>Membentuk Polinom (Sisipan Terurut)</SubHeading>
      <P>Setiap pasangan ⟨d, c⟩ disisipkan ke posisi yang tepat dalam list terurut menurun:</P>
      <AsciiBox>{`Input: ⟨1,4⟩, ⟨2,5⟩, ⟨5,7⟩, ⟨8,9⟩, ⟨3,4⟩

Langkah 1: ⟨1,4⟩
Langkah 2: ⟨2,5⟩ → ⟨1,4⟩
Langkah 3: ⟨5,7⟩ → ⟨2,5⟩ → ⟨1,4⟩
Langkah 4: ⟨8,9⟩ → ⟨5,7⟩ → ⟨2,5⟩ → ⟨1,4⟩
Langkah 5: ⟨8,9⟩ → ⟨5,7⟩ → ⟨3,4⟩ → ⟨2,5⟩ → ⟨1,4⟩`}</AsciiBox>
      <SubHeading>Menjumlahkan — Teknik Merging</SubHeading>
      <P>Karena kedua list sudah terurut, gunakan teknik <strong>merge</strong> dua list terurut:</P>
      <Pseudocode>{`while P1 ≠ NIL and P2 ≠ NIL do
    if degree(P1) = degree(P2) then
        sum ← coef(P1) + coef(P2)
        if sum ≠ 0 then InsertLast(P3, degree(P1), sum)
        P1 ← next(P1); P2 ← next(P2)
    else if degree(P1) > degree(P2) then
        InsertLast(P3, degree(P1), coef(P1)); P1 ← next(P1)
    else
        InsertLast(P3, degree(P2), coef(P2)); P2 ← next(P2)
{ Salin sisa P1 atau P2 yang belum habis }`}</Pseudocode>
      <SubHeading>Menurunkan Polinom</SubHeading>
      <Pseudocode>{`{ Traversal list P, untuk setiap suku ⟨i, aᵢ⟩ dengan i > 0 }
while P ≠ NIL do
    if degree(P) > 0 then
        InsertLast(P1, degree(P)−1, degree(P) × coef(P))
    P ← next(P)`}</Pseudocode>
      <NoteBox>
        Pada representasi berkait, penyisipan untuk turunan selalu dilakukan di akhir list (<Mono>InsertLast</Mono>)
        karena saat traversal dari derajat tinggi ke rendah, suku baru (derajat i−1) akan selalu lebih kecil dari suku sebelumnya.
      </NoteBox>
      <W3Table
        headers={['Kriteria', 'Kontigu (Array)', 'Berkait (Linked List)']}
        rows={[
          ['Memori untuk polinom jarang', 'Boros — seluruh array dialokasi', 'Hemat — hanya suku ≠ 0 disimpan'],
          ['Akses suku ke-i langsung', 'O(1) — langsung via arrSuku[i]', 'O(n) — harus traversal list'],
          ['Polinom derajat sangat tinggi', 'Dibatasi nMax', 'Tidak terbatas (selama memori cukup)'],
          ['Kompleksitas penjumlahan', 'O(max degree)', 'O(n₁ + n₂) — merging'],
        ]}
      />
      <Divider />

      <SectionHeading id="memori">Studi Kasus: Pengelolaan Memori</SectionHeading>
      <P>
        Memori dinyatakan sebagai <Mono>NB</Mono> blok kontigu, setiap blok berstatus <strong>F (false = KOSONG)</strong> atau{' '}
        <strong>T (true = ISI)</strong>. Rangkaian blok KOSONG yang berurutan disebut <em>zone bebas</em>,
        dinyatakan sebagai ⟨indeks_awal, ukuran⟩.
      </P>
      <AsciiBox>{`Contoh memori NB=10:
Status: T T F F F T T F F T
Blok:   1 2 3 4 5 6 7 8 9 10

Zone bebas: ⟨3,3⟩ dan ⟨8,2⟩
Total blok kosong: 5`}</AsciiBox>
      <W3Table
        headers={['Prosedur', 'Fungsi']}
        rows={[
          ['InitMem',           'Set semua blok menjadi KOSONG'],
          ['AlokBlok(X, IAw)',  'Alokasi X blok berurutan, hasilkan indeks awal IAw'],
          ['DeAlokBlok(X, IAw)','Bebaskan X blok mulai IAw'],
          ['GarbageCollection', 'Kompaksi: pindahkan semua blok KOSONG ke kiri (atau kanan)'],
        ]}
      />
      <Divider />

      <SectionHeading id="mem-kontigu">Representasi Kontigu (Array Boolean)</SectionHeading>
      <AsciiBox>{`constant NB: integer = 100
STATMEM: array [1..NB] of boolean
{ true = ISI, false = KOSONG }`}</AsciiBox>
      <P>
        Dengan representasi ini, zone bebas tidak disimpan secara eksplisit — harus di-scan setiap kali diperlukan.
        <Mono>AlokBlok</Mono> mencari rangkaian blok KOSONG sepanjang X, dan mengubah statusnya menjadi ISI.
      </P>
      <Divider />

      <SectionHeading id="mem-first-best">Strategi Alokasi: First Fit &amp; Best Fit</SectionHeading>
      <SubHeading>First Fit</SubHeading>
      <P>Alokasikan pada zone kosong <strong>pertama</strong> yang cukup besar:</P>
      <Pseudocode>{`Cari zone kosong dengan Nb ≥ X (berhenti segera saat ditemukan)
Jika ada:
    Ubah status blok [IAw .. IAw+X−1] menjadi ISI
Jika tidak: IAw ← 0  { alokasi gagal }`}</Pseudocode>
      <SubHeading>Best Fit</SubHeading>
      <P>Alokasikan pada zone kosong <strong>terkecil yang cukup</strong>:</P>
      <Pseudocode>{`Periksa SEMUA zone kosong, catat zone dengan Nb paling kecil yang ≥ X
Ubah status blok pada zone tersebut`}</Pseudocode>
      <W3Table
        headers={['', 'First Fit', 'Best Fit']}
        rows={[
          ['Kecepatan', 'Lebih cepat (stop early)', 'Lebih lambat (scan semua)'],
          ['Fragmentasi', 'Bisa meninggalkan fragmen besar', 'Meminimalkan sisa zone yang tak terpakai'],
          ['Pilihan terbaik', 'Kecepatan alokasi penting', 'Penghematan memori penting'],
        ]}
      />
      <Divider />

      <SectionHeading id="mem-berkait">Representasi Berkait Blok Kosong</SectionHeading>
      <P>
        Alih-alih menyimpan seluruh array, simpan saja <strong>list zone kosong</strong> yang terurut berdasarkan indeks awal.
      </P>
      <AsciiBox>{`type ZB: ⟨ Aw:   integer,   { indeks awal zone kosong }
             Nb:   integer,   { ukuran zone kosong }
             Next: Address ⟩
FIRSTZB: Address  { list zone kosong, terurut menurut Aw }`}</AsciiBox>
      <SubHeading>InitMem</SubHeading>
      <P>Buat list dengan satu elemen ⟨1, NB⟩ — seluruh memori kosong.</P>
      <SubHeading>AlokBlok — First Fit</SubHeading>
      <Pseudocode>{`Sequential search list FirstZB dengan kondisi berhenti Nb(P) ≥ X
Jika Nb(P) = X  → Delete elemen P dari list
Jika Nb(P) > X  → Update: Aw(P) ← Aw(P)+X, Nb(P) ← Nb(P)−X
IAw ← Aw(P)`}</Pseudocode>
      <SubHeading>DeAlokBlok</SubHeading>
      <P>Saat dealokasi, zone baru ⟨IAw, X⟩ perlu disisipkan ke list. Ada empat kasus:</P>
      <UL items={[
        'Zone baru bergabung dengan zone di kirinya → update Nb zone kiri',
        'Zone baru bergabung dengan zone di kanannya → update Aw dan Nb zone kanan',
        'Zone baru bergabung dengan kedua tetangganya → merge tiga zone menjadi satu',
        'Zone baru tidak bergabung dengan siapapun → insert elemen baru di posisi terurut',
      ]} />
      <Divider />

      <SectionHeading id="mem-gc">Garbage Collection</SectionHeading>
      <SubHeading>Representasi Kontigu — Dua Pass</SubHeading>
      <Pseudocode>{`Pass 1: Hitung NKosong (jumlah blok false)
Pass 2: Set STATMEM[1..NKosong] ← false
        Set STATMEM[NKosong+1..NB] ← true`}</Pseudocode>
      <SubHeading>Representasi Kontigu — Satu Pass</SubHeading>
      <Pseudocode>{`{ Tukar elemen KOSONG ke kiri dengan ISI ke kanan }
kiri ← 1; kanan ← NB
while kiri < kanan do
    while STATMEM[kiri] = false do kiri ← kiri + 1
    while STATMEM[kanan] = true  do kanan ← kanan − 1
    if kiri < kanan then
        tukar(STATMEM[kiri], STATMEM[kanan])`}</Pseudocode>
      <SubHeading>Representasi Berkait — Lebih Sederhana</SubHeading>
      <Pseudocode>{`{ Hitung total blok kosong, ganti seluruh list dengan satu elemen ⟨1, totalKosong⟩ }
total ← 0
P ← FirstZB
while P ≠ NIL do
    total ← total + Nb(P); P ← Next(P)
{ Bebaskan semua node lama, buat satu node baru ⟨1, total⟩ }`}</Pseudocode>
      <InfoBox>
        Pada representasi berkait, GarbageCollection lebih sederhana karena hanya perlu menghitung total zone kosong
        dan membuat satu elemen tunggal — tidak perlu manipulasi array.
      </InfoBox>
      <Divider />

      <SectionHeading id="multilist">Studi Kasus: Multi-List</SectionHeading>
      <P>
        Mengelola data <strong>Pegawai</strong> beserta <strong>Anak</strong>-anaknya.
        Setiap pegawai dapat memiliki nol atau lebih anak. Masalah ini membutuhkan struktur list yang saling terhubung.
      </P>
      <AsciiBox>{`Informasi pegawai: nip, nama, jabatan, gajiPokok
Informasi anak:    nama, tglLahir`}</AsciiBox>
      <Divider />

      <SectionHeading id="ml-alt1">Alternatif 1 — List Anak per Pegawai</SectionHeading>
      <P>Setiap elemen list Pegawai memiliki <strong>pointer ke list Anak sendiri</strong>:</P>
      <AsciiBox>{`type Pegawai: ⟨ nip, nama, jabatan, gajiPokok,
                  firstAnak: AdrAnak,
                  nextPeg:   AdrPeg ⟩
type Anak:    ⟨ nama, tglLahir,
                  nextAnak: AdrAnak ⟩
FirstPeg: AdrPeg

Visualisasi:
FirstPeg → [Peg A] → [Peg B] → [Peg C] → NIL
              |                    |
           [Anak X] → [Anak Y]  [Anak U] → [Anak V] → NIL`}</AsciiBox>
      <Divider />

      <SectionHeading id="ml-alt2">Alternatif 2 — List Anak Global dengan Pointer Father</SectionHeading>
      <P>Seluruh anak disimpan dalam <strong>satu list global</strong>, setiap anak menyimpan pointer ke pegawai bapaknya:</P>
      <AsciiBox>{`type Pegawai: ⟨ nip, nama, jabatan, gajiPokok,
                  nextPeg: AdrPeg ⟩
type Anak:    ⟨ nama, tglLahir,
                  father:   AdrPeg,    { pointer ke bapaknya }
                  nextAnak: AdrAnak ⟩
FirstPeg:  AdrPeg
FirstAnak: AdrAnak

Visualisasi:
FirstPeg  → [Peg A] → [Peg B] → NIL
                ↑         ↑
FirstAnak → [Anak X] → [Anak Y] → [Anak U] → NIL
            father=A  father=A  father=B`}</AsciiBox>
      <Divider />

      <SectionHeading id="ml-perbandingan">Perbandingan Alternatif 1 vs Alternatif 2</SectionHeading>
      <W3Table
        headers={['Fitur', 'Alternatif 1', 'Alternatif 2']}
        rows={[
          ['Daftar anak tiap pegawai', 'Efisien — langsung traversal list anak pegawai', 'Kurang efisien — scan seluruh list anak'],
          ['Daftar anak < 18 tahun', 'Traversal pegawai + anak berlapis', 'Cukup traversal satu list anak global'],
          ['Daftar pegawai anak > 3', 'Traversal list anak tiap pegawai', 'Traversal list anak global, hitung per father'],
          ['Cari orang tua dari anak', 'Pencarian berlapis O(P×A)', 'Langsung via pointer father O(1)'],
          ['Insert anak baru', 'Search pegawai, insert ke list anaknya', 'Search pegawai, insert ke list global'],
        ]}
      />
      <Divider />

      <SectionHeading id="relasi-mn">Studi Kasus: Representasi Relasi M-N</SectionHeading>
      <P>
        <strong>Dosen</strong> dan <strong>MataKuliah</strong> memiliki relasi many-to-many (M-N):
        satu dosen bisa mengajar banyak MK, dan satu MK bisa diajar oleh banyak dosen.
      </P>
      <Divider />

      <SectionHeading id="mn-alternatif">Tiga Alternatif Representasi</SectionHeading>
      <SubHeading>Alternatif 1 — Relasi "Mengajar" (dari sudut Dosen)</SubHeading>
      <AsciiBox>{`type Dosen: ⟨ ..., firstMK: AdrMK_Dos, nextDosen ⟩
{ Setiap dosen memiliki list MK yang diajarnya }

Query mudah: "MK apa yang diajar Dosen X?" → langsung traversal list MK dosen
Query sulit: "Siapa mengajar MK Y?" → harus scan semua dosen`}</AsciiBox>
      <SubHeading>Alternatif 2 — Relasi "Diajar Oleh" (dari sudut MataKuliah)</SubHeading>
      <AsciiBox>{`type MataKuliah: ⟨ ..., firstDosen: AdrDos_MK, nextMK ⟩
{ Setiap MK memiliki list Dosen pengajarnya }

Query mudah: "Siapa mengajar MK Y?" → langsung traversal list dosen MK
Query sulit: "MK apa yang diajar Dosen X?" → harus scan semua MK`}</AsciiBox>
      <SubHeading>Alternatif 3 — Relasi sebagai List Terpisah</SubHeading>
      <AsciiBox>{`type MK_DOS: ⟨ dosen: AdrDosen,   { pointer ke node di list Dosen }
               mk:    AdrMK,       { pointer ke node di list MK }
               next:  AdrMK_DOS ⟩
FirstMK_DOS: AdrMK_DOS

Query kedua arah: efisien dengan traversal list relasi
Insert/delete relasi: tidak perlu mengubah struktur Dosen atau MK`}</AsciiBox>
      <W3Table
        headers={['Query', 'Alt. 1', 'Alt. 2', 'Alt. 3']}
        rows={[
          ['MK yang diajar Dosen X', 'O(MK_X)', 'O(M)', 'O(R)'],
          ['Dosen yang mengajar MK Y', 'O(D)', 'O(Dos_Y)', 'O(R)'],
          ['Fleksibilitas', 'Satu arah', 'Satu arah', 'Dua arah'],
          ['Kompleksitas struktur', 'Sedang', 'Sedang', 'Lebih kompleks'],
        ]}
      />
      <NoteBox>
        D = jumlah dosen, M = jumlah MK, R = jumlah relasi, MK_X = MK yang diajar X, Dos_Y = dosen pengajar Y.
      </NoteBox>
      <Divider />

      <SectionHeading id="mn-addrel">Prosedur AddRel</SectionHeading>
      <P>Menambahkan relasi ⟨Dosen D, MataKuliah MK⟩ pada Alternatif 3:</P>
      <Pseudocode>{`procedure AddRel(D, MK):
1. Search D di list Dosen
   → Jika tidak ada: InsertDosen(D)
2. Search MK di list MataKuliah
   → Jika tidak ada: InsertMK(MK)
3. Search pasangan ⟨D, MK⟩ di list MK_DOS
   → Jika sudah ada: return (tidak duplikat)
4. Alokasi node MK_DOS baru dengan (dosen=ptr_D, mk=ptr_MK)
5. InsertFirst ke list MK_DOS (atau InsertLast jika urutan penting)`}</Pseudocode>
      <InfoBox>
        <strong>Mengapa perlu cek duplikat?</strong> Relasi M-N bersifat unik — satu dosen tidak boleh "mengajar"
        satu mata kuliah dua kali dalam list yang sama. Tanpa cek, list relasi bisa mengandung data redundan.
      </InfoBox>
      <P>Pengembangan lebih lanjut:</P>
      <UL items={[
        'Relasi pada list yang sama: misal prerequisite antar MataKuliah (M-N dalam satu list)',
        'Satu objek, banyak relasi: MataKuliah terlibat dalam relasi pengajaran sekaligus prerequisite → perlu list relasi terpisah untuk masing-masing',
      ]} />

      {/* Summary card */}
      <div className="mt-10 bg-orange-50 border border-orange-200 rounded-xl p-5">
        <p className="text-sm font-bold text-orange-900 mb-3">Ringkasan — Poin Kunci Materi Ini</p>
        <div className="grid grid-cols-1 gap-2 text-[13px]">
          {[
            { label: 'Polinom Kontigu', ket: 'arrSuku[i] = koefisien suku ke-i. Memori tetap O(nMax) meski polinom jarang.' },
            { label: 'Polinom Berkait', ket: 'Hanya simpan suku ≠ 0, terurut menurun. Penjumlahan dengan teknik merging.' },
            { label: 'First Fit vs Best Fit', ket: 'First Fit lebih cepat; Best Fit meminimalkan fragmentasi internal.' },
            { label: 'Zone Kosong Berkait', ket: 'DeAlokBlok harus tangani 4 kasus: gabung kiri, gabung kanan, gabung keduanya, tidak gabung.' },
            { label: 'Multi-List Alt 1', ket: 'List anak per pegawai: efisien untuk traversal anak tiap pegawai.' },
            { label: 'Multi-List Alt 2', ket: 'List anak global + father pointer: efisien untuk scan anak lintas pegawai.' },
            { label: 'Relasi M-N Alt 3', ket: 'List relasi terpisah: fleksibel untuk query kedua arah, mudah tambah/hapus relasi.' },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-orange-100 rounded-lg px-3 py-2">
              <span className="font-bold text-orange-800">{item.label}: </span>
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
  const [showHint, setShowHint]   = useState(false);
  const [showSolusi, setShowSolusi] = useState(false);

  return (
    <div className="text-[15px] text-gray-700">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">Contoh Soal</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200">Tingkat Sedang</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {['Polinom', 'Representasi Kontigu', 'Turunan Polinom', 'arrSuku'].map((t) => (
            <span key={t} className="text-[11px] bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-full">{t}</span>
          ))}
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Menurunkan Polinom dengan Representasi Kontigu</h2>
        <p className="mb-4 leading-relaxed">
          Diberikan polinom P(x) = 3x⁴ − 2x³ + 5x − 1 yang direpresentasikan dengan struktur kontigu.
          Tentukan representasi array untuk P(x), kemudian hitung P′(x) dan gambarkan representasi array hasilnya.
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
            <p><strong>Petunjuk 1:</strong> Struktur <code className="bg-yellow-100 px-1 rounded">Polinom</code> memiliki <code className="bg-yellow-100 px-1 rounded">arrSuku[0..nMax]</code>. Indeks <em>i</em> adalah derajat, nilai adalah koefisien. Suku dengan koefisien 0 tetap ada di array (nilainya 0).</p>
            <p><strong>Petunjuk 2:</strong> P(x) = 3x⁴ − 2x³ + 0x² + 5x − 1. Perhatikan suku x² tidak ada dalam ekspresi, artinya koefisiennya 0 — tetap simpan di <code className="bg-yellow-100 px-1 rounded">arrSuku[2] = 0</code>.</p>
            <p><strong>Petunjuk 3:</strong> Algoritma turunan: untuk i dari Degree downto 1, <code className="bg-yellow-100 px-1 rounded">arrSuku1[i−1] ← i × arrSuku[i]</code>. Iterasi mulai dari suku berderajat paling tinggi.</p>
          </div>
        )}
      </div>

      {/* Solution */}
      <div className="mb-6">
        <button
          onClick={() => setShowSolusi((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <span>{showSolusi ? '▾' : '▸'}</span>
          <span>{showSolusi ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan Lengkap'}</span>
        </button>
        {showSolusi && (
          <div className="mt-3 space-y-5">

            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-orange-600 px-4 py-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-orange-600 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-white font-semibold text-sm">Representasi Array untuk P(x)</span>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm mb-3">
                  P(x) = 3x⁴ − 2x³ + 0x² + 5x − 1. Isi <code className="bg-gray-100 px-1 rounded font-mono">arrSuku[i]</code> sesuai koefisien tiap derajat:
                </p>
                <pre className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-3 font-mono text-[13px] text-orange-900">{`Indeks i :  0    1    2    3    4
arrSuku  : [-1]  [5]  [0] [-2]  [3]

Degree = 4`}</pre>
                <p className="text-sm mt-3 text-gray-600">
                  Suku x² tidak ada dalam ekspresi, namun <code className="bg-gray-100 px-1 rounded font-mono">arrSuku[2] = 0</code> tetap harus ada karena representasi kontigu mengisi seluruh indeks.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-blue-600 px-4 py-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-white font-semibold text-sm">Eksekusi Algoritma Turunan</span>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm mb-3">Algoritma: <code className="bg-gray-100 px-1 rounded font-mono">for i ← Degree downto 1 do arrSuku1[i−1] ← i × arrSuku[i]</code></p>
                <pre className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 font-mono text-[13px] text-blue-900">{`i = 4 : arrSuku1[3] ← 4 × arrSuku[4] = 4 × 3  =  12
i = 3 : arrSuku1[2] ← 3 × arrSuku[3] = 3 × (−2) = −6
i = 2 : arrSuku1[1] ← 2 × arrSuku[2] = 2 × 0  =   0
i = 1 : arrSuku1[0] ← 1 × arrSuku[1] = 1 × 5  =   5

Degree1 ← Degree − 1 = 3`}</pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-green-600 px-4 py-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-green-600 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-white font-semibold text-sm">Representasi Array untuk P′(x)</span>
              </div>
              <div className="px-4 py-4">
                <pre className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 font-mono text-[13px] text-green-900">{`Indeks i :  0    1    2    3
arrSuku1 : [5]  [0] [-6] [12]

Degree1 = 3

P′(x) = 12x³ − 6x² + 0x + 5  =  12x³ − 6x² + 5`}</pre>
                <p className="text-sm mt-3 text-gray-600">
                  Perhatikan: koefisien untuk x (derajat 1) adalah 0 — tetap disimpan di <code className="bg-gray-100 px-1 rounded font-mono">arrSuku1[1] = 0</code>.
                  Penulisan polinom akan melewatinya karena nilai 0.
                </p>
              </div>
            </div>

            {/* Implementation */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Implementasi Bahasa C</h3>
              <CodeBlock language="c">{`
#include <stdio.h>
#define NMAX 100

typedef struct {
    int degree;
    int arrSuku[NMAX + 1];
} Polinom;

void derivPol(Polinom p, Polinom *p1) {
    p1->degree = p.degree - 1;
    for (int i = p.degree; i >= 1; i--)
        p1->arrSuku[i - 1] = i * p.arrSuku[i];
}

int main() {
    Polinom p = {4, {-1, 5, 0, -2, 3}};  /* P(x) = 3x^4 - 2x^3 + 5x - 1 */
    Polinom p1;
    derivPol(p, &p1);
    /* p1.arrSuku = {5, 0, -6, 12}, degree = 3 */
    /* P'(x) = 12x^3 - 6x^2 + 5 */
    return 0;
}
              `}</CodeBlock>
            </div>

            {/* Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">Analisis:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Kompleksitas waktu: O(Degree) — satu pass dari Degree hingga 1</li>
                <li>Kompleksitas memori: O(nMax) — tetap konstan, bukan O(Degree)</li>
                <li>Degree turunan = Degree − 1 (kecuali P adalah konstanta, lalu P′ = 0)</li>
                <li>Tidak perlu adjustDegree karena suku tertinggi selalu punya koefisien ≠ 0 setelah derivasi</li>
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
      const res = await fetch('/api/latihan-aplikasi/generate', {
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
      const res = await fetch('/api/latihan-aplikasi/evaluasi', {
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
      const res = await fetch('/api/latihan-aplikasi/generate', {
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
        <svg className="animate-spin w-8 h-8 mb-4 text-orange-500" viewBox="0 0 24 24" fill="none">
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
        <button onClick={() => generateSoal([])} className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700">Coba Lagi</button>
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
            <p className="text-sm text-gray-500">Aplikasi Struktur Data</p>
          </div>
        </div>
        <div className="bg-linear-to-r from-orange-600 to-orange-700 rounded-xl p-5 text-white mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm font-medium">Nilai Rata-rata</p>
              <p className="text-4xl font-bold">{avgSkor}<span className="text-xl text-orange-300">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-orange-200 text-sm">Soal dievaluasi</p>
              <p className="text-2xl font-bold">{allFeedbacks.length}/{soalList.length}</p>
            </div>
          </div>
          <div className="mt-3 bg-orange-500 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${avgSkor}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-5">
          {soalList.map((sq, i) => {
            const f = feedbackMap[sq.id];
            let cls = 'border-2 ';
            if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
            else cls += i === resultIdx ? 'bg-white border-orange-600 text-orange-600' : 'bg-gray-100 border-gray-300 text-gray-400';
            return (
              <button key={sq.id} onClick={() => setResultIdx(i)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>{sq.id}</button>
            );
          })}
        </div>
        {curSoal && curFb && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{curSoal.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === 'implementasi' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
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
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-orange-600 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
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
        <div className="border border-orange-200 rounded-xl p-4 text-center bg-orange-50">
          <p className="text-sm font-semibold text-orange-800 mb-1">
            {konsepLemah.length > 0 ? 'Latihan soal baru untuk perkuat kelemahanmu' : 'Kerjakan soal latihan baru'}
          </p>
          <p className="text-xs text-orange-600 mb-3">
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(', ')}${konsepLemah.length > 3 ? '...' : ''}`
              : 'AI akan membuat soal baru dengan tingkat kesulitan serupa'}
          </p>
          <button onClick={handleGenerateBaru} className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors">
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
        <p className="text-sm text-gray-500 mt-0.5">Aplikasi Struktur Data</p>
      </div>
      <div className="flex items-center gap-2 mb-5">
        {soalList.map((sq, i) => {
          const f = feedbackMap[sq.id];
          const isCur = i === idx;
          let cls = 'border-2 ';
          if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
          else if (isCur) cls += jawaban[sq.id]?.trim() ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-orange-600 text-orange-600';
          else cls += jawaban[sq.id]?.trim() ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-gray-100 border-gray-300 text-gray-400';
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
          <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{soal.id}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === 'implementasi' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
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
            className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-orange-600 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
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
                Referensi Notasi Algoritmik
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
            placeholder={soal.tipe === 'implementasi' ? 'Tuliskan notasi algoritmik atau kode C di sini...' : 'Tuliskan jawabanmu di sini...'}
            className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300 text-[13px]' : 'bg-white text-gray-800'}`}
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
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
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
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
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
      <p className="text-sm text-gray-500 mb-6">Aplikasi Struktur Data</p>

      <div className="space-y-4">

        {/* 1 — Polinom */}
        <div className="border border-orange-100 rounded-xl overflow-hidden">
          <div className="bg-orange-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-white font-bold text-sm">Polinom</span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-orange-50 border border-orange-100 text-orange-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Representasi Kontigu</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`arrSuku[i] = koefisien suku ke-i
Degree = derajat tertinggi
Kosong: Degree = −999`}</code>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="font-bold mb-1 text-gray-700">Representasi Berkait</div>
                <code className="text-[11px] font-mono text-gray-600 leading-relaxed block">{`Node: ⟨degree, coef, next⟩
Terurut menurun berdasarkan degree
Penjumlahan: teknik merging`}</code>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { op: 'Membentuk', ket: 'Baca ⟨d,c⟩ sampai sentinel −999, simpan ke arrSuku[d] atau sisip ke list terurut', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                { op: 'Menurunkan', ket: 'arrSuku1[i−1] ← i × arrSuku[i] untuk i dari Degree downto 1', color: 'bg-green-50 border-green-100 text-green-800' },
                { op: 'Menjumlahkan (berkait)', ket: 'Merge dua list terurut: degree sama → jumlahkan, berbeda → salin yang lebih besar', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
                { op: 'adjustDegree', ket: 'Perlu dipanggil setelah add/sub jika koefisien tertinggi menjadi 0', color: 'bg-red-50 border-red-100 text-red-800' },
              ].map((r) => (
                <div key={r.op} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <span className="font-bold">{r.op}: </span>
                  <span>{r.ket}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2 — Pengelolaan Memori */}
        <div className="border border-blue-100 rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-white font-bold text-sm">Pengelolaan Memori</span>
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">First Fit</div>
                <p className="text-[12px]">Zone kosong pertama yang cukup. Lebih cepat karena stop early.</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Best Fit</div>
                <p className="text-[12px]">Zone kosong terkecil yang cukup. Scan semua, meminimalkan sisa.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { label: 'Zone Kosong', ket: '⟨Aw, Nb⟩ — indeks awal dan ukuran. Representasi berkait: list ZB terurut menurut Aw.', color: 'bg-cyan-50 border-cyan-100 text-cyan-800' },
                { label: 'DeAlokBlok', ket: '4 kasus: gabung kiri, gabung kanan, gabung keduanya, tidak gabung → insert baru.', color: 'bg-teal-50 border-teal-100 text-teal-800' },
                { label: 'GarbageCollection', ket: 'Kontigu: 2 pass (hitung+set) atau 1 pass (tukar). Berkait: reset jadi ⟨1, total⟩.', color: 'bg-green-50 border-green-100 text-green-800' },
              ].map((r) => (
                <div key={r.label} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <span className="font-bold">{r.label}: </span>
                  <span>{r.ket}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 — Multi-List */}
        <div className="border border-green-100 rounded-xl overflow-hidden">
          <div className="bg-green-700 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-green-700 text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-white font-bold text-sm">Multi-List (Pegawai &amp; Anak)</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-green-50 border border-green-100 text-green-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Alternatif 1</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`Pegawai: firstAnak → list anak sendiri
Efisien: traversal anak tiap pegawai
Kurang: cari anak lintas pegawai`}</code>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Alternatif 2</div>
                <code className="text-[11px] font-mono leading-relaxed block">{`Anak: father → pointer ke pegawai
Efisien: scan anak < 18 th, father
Kurang: daftar anak tiap pegawai`}</code>
              </div>
            </div>
          </div>
        </div>

        {/* 4 — Relasi M-N */}
        <div className="border border-purple-100 rounded-xl overflow-hidden">
          <div className="bg-purple-700 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-white font-bold text-sm">Relasi M-N (Dosen &amp; MataKuliah)</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { alt: 'Alt 1 — Mengajar', ket: 'List MK per dosen. Mudah: "MK yang diajar Dosen X". Sulit: "Dosen yang mengajar MK Y".', color: 'bg-purple-50 border-purple-100 text-purple-800' },
                { alt: 'Alt 2 — Diajar Oleh', ket: 'List Dosen per MK. Mudah: "Dosen pengajar MK Y". Sulit: "MK yang diajar Dosen X".', color: 'bg-violet-50 border-violet-100 text-violet-800' },
                { alt: 'Alt 3 — List Terpisah', ket: 'Node MK_DOS ⟨dosen, mk, next⟩. Fleksibel kedua arah. AddRel: cek duplikat, insert node relasi.', color: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-800' },
              ].map((r) => (
                <div key={r.alt} className={`border rounded-lg px-3 py-2 ${r.color}`}>
                  <div className="font-bold mb-0.5">{r.alt}</div>
                  <div className="text-[12px] opacity-80">{r.ket}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-sm font-bold text-orange-800 mb-3">Hal-hal yang Perlu Diingat</p>
        <div className="grid grid-cols-1 gap-2 text-[13px]">
          {[
            { tip: 'adjustDegree setelah add/sub', detail: 'Jika koefisien suku tertinggi = 0 setelah operasi, Degree harus disesuaikan ke suku non-zero tertinggi.', color: 'bg-orange-50 border-orange-100 text-orange-800' },
            { tip: 'Merging untuk polinom berkait', detail: 'Dua list terurut → merge lebih efisien dari O(n²). Jika degree sama dan jumlah = 0, suku tidak dimasukkan ke P3.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
            { tip: 'DeAlokBlok — 4 kasus', detail: 'Selalu cek apakah zone baru dapat bergabung dengan tetangganya di kiri/kanan untuk menghindari fragmentasi.', color: 'bg-green-50 border-green-100 text-green-800' },
            { tip: 'AddRel — cek duplikat', detail: 'Sebelum insert node relasi baru, selalu cek apakah pasangan ⟨D, MK⟩ sudah ada di list MK_DOS.', color: 'bg-purple-50 border-purple-100 text-purple-800' },
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
export default function AplikasiPage() {
  const [activeTab, setActiveTab] = useState('MATERI');
  const [activeSection, setActiveSection] = useState('pengantar');
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

  const handleTabClick = (tab) => { setActiveTab(tab); setShowToc(false); };

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
          <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aplikasi</div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${s.level === 1 ? 'pl-7' : ''} ${activeSection === s.id ? 'bg-orange-50 text-orange-700 font-semibold border-r-2 border-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
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
                  className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${isActive ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                    className={`w-full text-left text-[13px] px-4 py-2 transition-colors ${s.level === 1 ? 'pl-8' : ''} ${activeSection === s.id ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
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
            {activeTab === 'LATIHAN'  && <LatihanContent onQuestionEvaluated={handleQuestionEvaluated} />}
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
                <button onClick={() => handleComplete(activeTab)} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-sm font-semibold rounded-lg transition-colors">
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
