# ADT List

**List** (atau *sequence*) adalah sekumpulan elemen bertipe sama yang memiliki keterurutan tertentu (*ordered*, tidak harus *sorted*).

Ada konsep elemen pertama, elemen kedua, hingga elemen ke-n.

Contoh list dalam kehidupan sehari-hari:

```
Daftar belanjaan         → terurut berdasarkan urutan penulisan
Daftar kota road trip    → terurut berdasarkan rute perjalanan
Instagram feed           → terurut berdasarkan waktu publikasi
String                   → list of characters!
```

---

## Istilah-istilah

```
head     → elemen pertama list
length   → jumlah elemen dalam list
empty list → list yang tidak mempunyai elemen
traversal  → mengunjungi elemen list satu per satu dari ujung ke ujung
```

Ilustrasi sebuah list dengan 5 elemen:

```
Index:   0    1    2    3    4
Value:   9    5   12    7    1

head     = 9
length   = 5
```

---

## Operasi ADT List

### Operasi Dasar

```
isEmpty   → memeriksa apakah list kosong
length    → menghitung jumlah elemen efektif
getElmt   → melihat nilai pada posisi/indeks tertentu
setElmt   → mengubah nilai pada posisi/indeks tertentu
indexOf   → mencari indeks elemen pertama yang bernilai x
concat    → menggabungkan dua list
```

### Operasi Insert

```
insertFirst  → menambah elemen di awal list
insertAt     → menambah elemen pada indeks tertentu
insertLast   → menambah elemen di akhir list
```

### Operasi Delete

```
deleteFirst  → menghapus elemen di awal list
deleteAt     → menghapus elemen pada indeks tertentu
deleteLast   → menghapus elemen di akhir list
```

### Traversal

```
Mengunjungi setiap elemen list satu per satu dari awal sampai akhir.
```

---

## Ilustrasi Insert dan Delete

Insert 6 di awal:

```
Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [6] [9] [5] [12] [7] [1]
```

Insert 6 setelah indeks 1 (setelah angka 5):

```
Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [6] [12] [7] [1]
```

Insert 6 di akhir:

```
Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [12] [7] [1] [6]
```

Delete elemen pertama:

```
Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [5] [12] [7] [1]
```

Delete elemen di indeks 2 (angka 12):

```
Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [7] [1]
```

Delete elemen terakhir:

```
Sebelum:  [9] [5] [12] [7] [1]
Sesudah:  [9] [5] [12] [7]
```

---

## Struktur Data untuk ADT List

ADT List dapat diimplementasikan dengan dua cara:

```
Array    → elemen disimpan dalam array statik atau dinamis
Berkait  → elemen disimpan dalam node-node yang saling terhubung
```

Materi ini fokus pada implementasi dengan **array**.

---

## Implementasi dengan Array: Dua Pendekatan

### Cara Menandai Elemen Terisi

Ada dua alternatif untuk mengetahui elemen mana saja yang terisi:

**Implisit (alt-1)**

```
Elemen kosong diisi dengan nilai khusus yang disebut mark.
Contoh mark: MARK = -9999

Array kosong:    [?] [?] [?] [?] [?] [?] [?] [?]
Array sebagian:  [9] [5] [12] [7] [1] [?] [?] [?]

Traversal menggunakan pola:
while elemen ≠ MARK do ...
```

**Eksplisit (alt-2)**

```
Jumlah elemen efektif disimpan dalam variabel nEff.
Elemen valid hanya pada indeks 0 sampai nEff-1.

Array kosong:    [9] [5] [?] [?] [?]   nEff = 0
Array sebagian:  [9] [5] [12] [7] [1]  nEff = 5
Array penuh:     [9] [5] [12] [7] [1] [6] [71] [4]  nEff = 8

Traversal menggunakan pola:
for i = 0 to nEff-1 do ...
```

### Posisi Elemen: Rata Kiri vs Tidak Rata Kiri

**Rata kiri (alt-a)**

```
Elemen selalu dimulai dari indeks 0.
Insert first → perlu menggeser semua elemen ke kanan.
Delete first → perlu menggeser semua elemen ke kiri.
```

**Tidak rata kiri (alt-b)**

```
Elemen boleh dimulai dari indeks mana saja.
Insert first/last → tidak perlu geser elemen jika masih ada ruang.
Delete first/last → tidak perlu geser elemen.
Perlu menyimpan informasi indeks pertama (firstIdx).
```

### Ringkasan 4 Alternatif

| Alternatif | Representasi | Posisi |
| --- | --- | --- |
| alt-1a | Implisit (mark) | Rata kiri |
| alt-2a | Eksplisit (nEff) | Rata kiri |
| alt-1b | Implisit (mark) | Tidak rata kiri |
| alt-2b | Eksplisit (nEff) | Tidak rata kiri |

---

## Notasi Algoritmik: alt-1a (Implisit, Rata Kiri)

```
constant CAPACITY  : integer = 100
constant IDX_UNDEF : integer = -1
constant MARK      : integer = -9999

type ElType : integer
type List   : < contents: array [0..CAPACITY-1] of ElType >

{ Konstruktor }
procedure CreateList(output l: List)
{ Membentuk List kosong. Semua elemen diinisialisasi dengan MARK. }
```

---

## Notasi Algoritmik: alt-2a (Eksplisit, Rata Kiri)

```
constant CAPACITY  : integer = 100
constant IDX_UNDEF : integer = -1

type ElType : integer
type List   : < contents : array [0..CAPACITY-1] of ElType
                nEff     : integer ≥ 0 >

{ Konstruktor }
procedure CreateList(output l: List)
{ Membentuk List kosong. nEff diinisialisasi dengan 0. }
```

---

## Deklarasi Selektor

```
function isEmpty(l: List) → boolean
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
```

---

## Deklarasi Operasi

```
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
{ Mengembalikan list hasil penggabungan l1 dan l2 (l2 di belakang l1). }
```

---

## Contoh Algoritma: `length`

**alt-1a (implisit):**

```
KAMUS LOKAL
i: integer

ALGORITMA
i ← 0
while l.contents[i] ≠ MARK AND i < CAPACITY do
    i ← i + 1
{ berhenti saat ketemu MARK atau habis }
→ i
```

**alt-2a (eksplisit):**

```
ALGORITMA
→ l.nEff
```

Perbedaannya signifikan: alt-2a jauh lebih efisien karena langsung mengembalikan `nEff` tanpa perlu traversal.

---

## Contoh Algoritma: `insertAt`

Proses: geser semua elemen dari indeks `idx` ke kanan satu posisi, lalu isi posisi `idx` dengan `x`.

**alt-1a:**

```
KAMUS LOKAL
i: integer

ALGORITMA
if length(l) < CAPACITY then
    i traversal [length(l)..idx+1]
        l.contents[i] ← l.contents[i-1]
    l.contents[idx] ← x
```

**alt-2a:**

```
ALGORITMA
if length(l) < CAPACITY then
    i traversal [length(l)..idx+1]
        l.contents[i] ← l.contents[i-1]
    l.contents[idx] ← x
    l.nEff ← l.nEff + 1
```

Perbedaan utama: alt-2a perlu memperbarui `nEff` setiap kali ada insert atau delete.

---

## Elemen Tidak Rata Kiri (alt-b)

Pada alt-b, elemen tidak harus dimulai dari indeks 0. Ini memungkinkan `insertFirst` dan `deleteFirst` tanpa penggeseran.

Diperlukan fungsi-fungsi antara:

```
function firstIdx(l: List) → integer
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
{ true jika i adalah indeks efektif (firstIdx..lastIdx). }
```

---

## Implementasi Array Dinamis

Array statik memiliki keterbatasan kapasitas tetap. Pada array dinamis, kapasitas bisa berubah saat runtime.

Definisi tipe list dengan array dinamis (alt-2a dinamis):

```
constant INITIAL_CAP : integer = 100

type List : < contents : array of ElType
              capacity : integer
              nEff     : integer >
```

Konstruktor:

```
procedure CreateList(output l: List)
ALGORITMA
    l.capacity ← INITIAL_CAP
    alokasi(l.contents, l.capacity)
    l.nEff ← 0
```

### Strategi Resize

Saat array **penuh** dan perlu insert:

```
Alokasikan array baru berukuran 2× kapasitas lama.
Salin semua elemen ke array baru.
Lanjutkan insert.
```

Saat array **terlalu kosong** (≤ 25% terisi) setelah delete:

```
Alokasikan array baru berukuran 0.5× kapasitas lama.
Salin semua elemen ke array baru.
```

Dalam bahasa C, resize bisa menggunakan `realloc()`:

```c
int *baru = realloc(l.contents, newCapacity * sizeof(int));
if (baru != NULL) {
    l.contents = baru;
    l.capacity = newCapacity;
}
```

> Catatan: `realloc()` bisa gagal. Selalu periksa apakah hasilnya `NULL`.

---

## Elemen Tersebar (alt-3)

Pada alt-3, elemen list boleh berada di sembarang indeks dalam array (tidak harus kontigu).

```
Array kosong:    [?] [?] [?] [?] [?] [?] [?] [?]
Array sebagian:  [?] [9] [?] [5] [12] [?] [?] [7]
                     ↑        ↑   ↑              ↑
                 elemen list tersebar di berbagai indeks
```

Karakteristik operasi alt-3:

```
isEmpty  → true jika semua elemen bernilai MARK
indexOf  → skip elemen yang bernilai MARK
length   → traversal, cacah yang bukan MARK
getElmt  → hitung indeks lojik mulai dari fisik = 0, skip MARK
delete   → set elemen yang dihapus menjadi MARK (cepat!)
insert   → lakukan "defragmen" dulu sebelum insert
```

Proses defragmen (memampatkan):

```
Sebelum:  [?] [9] [?] [5] [12] [?] [?] [7]
Sesudah:  [?] [?] [9] [5] [12] [7] [?] [?]

Elemen digeser ke kiri agar kembali kontigu.
```

---

## Perbandingan Efisiensi 5 Alternatif

| Operasi | alt-1a | alt-2a | alt-1b | alt-2b | alt-3 |
| --- | --- | --- | --- | --- | --- |
| `insertFirst` | O(n) geser | O(n) geser | O(1) jika ada ruang | O(1) jika ada ruang | O(n) defragmen |
| `insertLast` | O(1)* | O(1) | O(1) jika ada ruang | O(1) jika ada ruang | O(n) defragmen |
| `deleteFirst` | O(n) geser | O(n) geser | O(1) | O(1) | O(1) set MARK |
| `deleteLast` | O(1)* | O(1) | O(1) | O(1) | O(1) set MARK |

> *alt-1a perlu traversal untuk mencari akhir list terlebih dahulu.

Dari segi penggunaan memori, semua alternatif sama (sesuai ukuran alokasi di awal).

---

## Contoh Latihan Soal

### `isSimetris`

```
function isSimetris(l: List) → boolean
{ true jika l simetrik:
  elemen pertama = elemen terakhir,
  elemen kedua = elemen sebelum terakhir,
  dan seterusnya.
  List kosong dianggap simetris. }

KAMUS LOKAL
i: integer
simetris: boolean

ALGORITMA
simetris ← true
i ← 0
while i < length(l) div 2 AND simetris do
    if getElmt(l, i) ≠ getElmt(l, length(l)-1-i) then
        simetris ← false
    i ← i + 1
→ simetris
```

### `countOccurence`

```
function countOccurence(l: List, x: ElType) → integer
{ Menghasilkan berapa banyak elemen bernilai x di l.
  Jika l kosong, menghasilkan 0. }

KAMUS LOKAL
i, ctr: integer

ALGORITMA
ctr ← 0
i traversal [0..length(l)-1]
    if getElmt(l, i) = x then
        ctr ← ctr + 1
→ ctr
```

### `indexOf` (tanpa boolean)

```
function indexOf(l: List, x: ElType) → integer
{ Mengembalikan indeks terkecil elemen bernilai x,
  atau IDX_UNDEF jika tidak ada atau list kosong. }

KAMUS LOKAL
i: integer

ALGORITMA
i ← 0
while i < length(l) AND getElmt(l, i) ≠ x do
    i ← i + 1
{ i = length(l) OR getElmt(l, i) = x }
if i < length(l) then
    → i
else
    → IDX_UNDEF
```

### `plusTab`

```
function plusTab(l1, l2: List) → List
{ Mengirimkan penjumlahan elemen l1 dan l2 pada indeks yang sama.
  Prekondisi: l1 dan l2 berukuran sama dan tidak kosong. }

KAMUS LOKAL
i: integer
hasil: List

ALGORITMA
CreateList(hasil)
i traversal [0..length(l1)-1]
    insertLast(hasil, getElmt(l1, i) + getElmt(l2, i))
→ hasil
```

---

## Ringkasan Pola Traversal

**Alt-1 (implisit):**

```
i ← 0
while l.contents[i] ≠ MARK AND i < CAPACITY do
    { proses l.contents[i] }
    i ← i + 1
```

**Alt-2 (eksplisit):**

```
i traversal [0..l.nEff-1]
    { proses l.contents[i] }
```

**Alt-3 (tersebar):**

```
i traversal [0..CAPACITY-1]
    if l.contents[i] ≠ MARK then
        { proses l.contents[i] }
```