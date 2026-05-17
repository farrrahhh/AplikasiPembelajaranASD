# Soal Latihan — ADT List dengan Array

---

## Soal 1 — Pengetahuan

Jelaskan perbedaan antara representasi **implisit (alt-1)** dan **eksplisit (alt-2)** dalam implementasi ADT List menggunakan array. Tinjau dari sisi:

- Cara menandai elemen kosong
- Cara kerja operasi `length`
- Cara kerja traversal

**Topik:** ADT List, Representasi Array

---

### Kunci Jawaban Soal 1

**Implisit (alt-1):**

Elemen kosong ditandai dengan nilai khusus yang disebut **mark** (misal `MARK = -9999`). Array harus diinisialisasi seluruhnya dengan mark saat list dibuat.

Operasi `length` dilakukan dengan traversal dari indeks 0 hingga menemukan mark:

```
i ← 0
while l.contents[i] ≠ MARK AND i < CAPACITY do
    i ← i + 1
→ i
```

Traversal menggunakan pola *while belum ketemu mark*.

**Eksplisit (alt-2):**

Jumlah elemen efektif disimpan dalam field tambahan `nEff`. Tidak perlu nilai khusus untuk elemen kosong.

Operasi `length` langsung mengembalikan `l.nEff` tanpa perlu traversal — jauh lebih efisien.

Traversal menggunakan pola *for i dari 0 sampai nEff-1*.

**Perbandingan:**

| Aspek | Implisit (alt-1) | Eksplisit (alt-2) |
| --- | --- | --- |
| Penanda elemen kosong | Nilai mark | Field `nEff` |
| `length` | O(n) traversal | O(1) langsung |
| Traversal | while ≠ mark | for 0..nEff-1 |
| Inisialisasi | Semua elemen diisi mark | nEff ← 0 |

---

## Soal 2 — Pengetahuan

Jelaskan perbedaan antara layout **rata kiri (alt-a)** dan **tidak rata kiri (alt-b)** dalam implementasi ADT List. Untuk masing-masing layout, jelaskan apa yang terjadi saat operasi `insertFirst` dan `deleteFirst` dilakukan, serta apa kelebihan dan kekurangannya.

**Topik:** ADT List, Insert, Delete, Efisiensi

---

### Kunci Jawaban Soal 2

**Rata kiri (alt-a):**

Elemen selalu dimulai dari indeks 0. `insertFirst` membutuhkan penggeseran semua elemen ke kanan satu posisi (O(n)). `deleteFirst` membutuhkan penggeseran semua elemen ke kiri satu posisi (O(n)).

```
insertFirst: geser nEff elemen → O(n)
deleteFirst: geser nEff-1 elemen → O(n)
```

Kelebihan: akses indeks lojik langsung sama dengan indeks fisik. Tidak perlu fungsi antara.

Kekurangan: insert dan delete di ujung kiri mahal karena harus geser banyak elemen.

**Tidak rata kiri (alt-b):**

Elemen boleh dimulai dari indeks mana saja. Ada ruang kosong di depan maupun belakang.

```
insertFirst: tulis di indeks firstIdx-1 (jika ada ruang) → O(1)
deleteFirst: geser firstIdx maju satu posisi → O(1)
```

Kelebihan: `insertFirst` dan `deleteFirst` sangat efisien (O(1)) selama ada ruang.

Kekurangan: perlu menyimpan informasi indeks pertama (`firstIdx`). Diperlukan fungsi antara seperti `firstIdx`, `lastIdx`, `isIdxEff`.

---

## Soal 3 — Implementasi

Diberikan definisi ADT List dengan representasi **eksplisit, rata kiri** (alt-2a):

```
constant CAPACITY  : integer = 100
constant IDX_UNDEF : integer = -1

type ElType : integer
type List   : < contents : array [0..CAPACITY-1] of ElType
                nEff     : integer ≥ 0 >
```

Buatlah algoritma untuk fungsi berikut dalam **notasi algoritmik**:

```
function isSimetris(l: List) → boolean
{ Menghasilkan true jika List l simetrik.
  List disebut simetrik jika:
  - elemen pertama = elemen terakhir,
  - elemen kedua = elemen sebelum terakhir,
  - dan seterusnya.
  List kosong adalah List simetris. }
```

**Contoh:**

```
l = [1, 2, 3, 2, 1] → true
l = [1, 2, 3, 4, 5] → false
l = [5]             → true
l = []              → true
```

**Topik:** ADT List, Traversal, Predikat

---

### Kunci Jawaban Soal 3

```
function isSimetris(l: List) → boolean
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
    → simetris
```

Penjelasan:

```
Cukup membandingkan separuh elemen dari kiri dengan pasangannya dari kanan.
Jika length = 5, maka cukup periksa indeks 0 vs 4, dan indeks 1 vs 3.
Indeks 2 (tengah) tidak perlu diperiksa.
```

---

## Soal 4 — Implementasi

Masih dengan definisi ADT List alt-2a yang sama, buatlah algoritma untuk fungsi:

```
function plusTab(l1, l2: List) → List
{ Prekondisi: l1 dan l2 berukuran sama dan tidak kosong. }
{ Mengirimkan l1 + l2, yaitu penjumlahan setiap elemen
  l1 dan l2 pada indeks yang sama
  (seperti penjumlahan vektor dalam matematika). }
```

**Contoh:**

```
l1 = [1, 2, 3]
l2 = [4, 5, 6]
plusTab(l1, l2) = [5, 7, 9]
```

**Topik:** ADT List, Traversal, Operasi Elemen

---

### Kunci Jawaban Soal 4

```
function plusTab(l1, l2: List) → List
KAMUS LOKAL
    i    : integer
    hasil : List

ALGORITMA
    CreateList(hasil)
    i traversal [0..length(l1)-1]
        insertLast(hasil, getElmt(l1, i) + getElmt(l2, i))
    → hasil
```

Penjelasan:

```
Karena prekondisi menyatakan l1 dan l2 berukuran sama,
kita cukup traversal satu kali dari 0 sampai length(l1)-1.
Setiap iterasi menjumlahkan elemen pada indeks yang sama
lalu menambahkannya ke list hasil.
```

---

## Soal 5 — Implementasi

Buatlah algoritma untuk fungsi berikut:

```
function countOccurence(l: List, x: ElType) → integer
{ Menghasilkan berapa banyak kemunculan elemen bernilai x di List l.
  Jika l kosong, menghasilkan 0. }
```

**Contoh:**

```
l = [3, 1, 4, 1, 5, 9, 2, 1]
countOccurence(l, 1) = 3
countOccurence(l, 7) = 0

l = []
countOccurence(l, 5) = 0
```

**Topik:** ADT List, Traversal, Pencacahan

---

### Kunci Jawaban Soal 5

```
function countOccurence(l: List, x: ElType) → integer
KAMUS LOKAL
    i, ctr : integer

ALGORITMA
    ctr ← 0
    i traversal [0..length(l)-1]
        if getElmt(l, i) = x then
            ctr ← ctr + 1
    → ctr
```

Penjelasan:

```
Jika list kosong, length(l) = 0 sehingga traversal tidak dieksekusi
dan fungsi langsung mengembalikan 0. Tidak perlu pengecekan isEmpty terpisah.
```

---

## Soal 6 — Implementasi

Buatlah algoritma untuk fungsi berikut menggunakan **skema searching tanpa boolean**:

```
function indexOf(l: List, x: ElType) → integer
{ Mencari apakah ada elemen List l yang bernilai x.
  Jika ada, menghasilkan indeks i terkecil, di mana getElmt(l, i) = x.
  Jika tidak ada, mengirimkan IDX_UNDEF.
  Jika list kosong, menghasilkan IDX_UNDEF.
  Memakai skema searching tanpa boolean. }
```

**Contoh:**

```
l = [10, 20, 30, 20, 50]
indexOf(l, 20)  = 1
indexOf(l, 99)  = -1 (IDX_UNDEF)
indexOf(l, 10)  = 0

l = []
indexOf(l, 5)   = -1 (IDX_UNDEF)
```

**Topik:** ADT List, Sequential Search, Searching Tanpa Boolean

---

### Kunci Jawaban Soal 6

```
function indexOf(l: List, x: ElType) → integer
KAMUS LOKAL
    i : integer

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

Penjelasan skema searching tanpa boolean:

```
Tidak menggunakan variabel boolean tambahan seperti "found".
Loop berhenti saat dua kondisi: habis (i = length(l)) ATAU ketemu (elemen = x).
Setelah loop, cek kondisi mana yang menyebabkan loop berhenti.
```

---

## Soal 7 — Implementasi

Buatlah algoritma untuk fungsi berikut:

```
function isEqual(l1, l2: List) → boolean
{ Mengirimkan true jika l1 setara dengan l2, yaitu jika:
  - ukuran l1 sama dengan ukuran l2, DAN
  - semua elemen l1 dan l2 pada indeks yang sama bernilai sama.
  l1 dan l2 tidak kosong. }
```

**Contoh:**

```
l1 = [1, 2, 3]
l2 = [1, 2, 3]
isEqual(l1, l2) = true

l1 = [1, 2, 3]
l2 = [1, 2, 4]
isEqual(l1, l2) = false

l1 = [1, 2, 3]
l2 = [1, 2]
isEqual(l1, l2) = false
```

**Topik:** ADT List, Traversal, Perbandingan

---

### Kunci Jawaban Soal 7

```
function isEqual(l1, l2: List) → boolean
KAMUS LOKAL
    i   : integer
    sama : boolean

ALGORITMA
    if length(l1) ≠ length(l2) then
        → false
    else
        sama ← true
        i ← 0
        while i < length(l1) AND sama do
            if getElmt(l1, i) ≠ getElmt(l2, i) then
                sama ← false
            i ← i + 1
        → sama
```

Penjelasan:

```
Periksa ukuran terlebih dahulu. Jika berbeda, langsung false — tidak perlu
membandingkan elemen satu per satu.
Jika ukuran sama, traversal sambil memeriksa setiap pasang elemen.
Loop berhenti lebih awal jika ditemukan elemen yang tidak sama.
```

---

## Soal 8 — Implementasi

Buatlah algoritma untuk prosedur berikut:

```
procedure insertUnique(input/output l: List, input x: ElType)
{ Menambahkan x sebagai elemen terakhir list l,
  pada list dengan elemen unik.
  I.S. List l boleh kosong, tetapi tidak penuh,
       dan semua elemennya bernilai unik, tidak terurut.
  F.S. Menambahkan x sebagai elemen terakhir l jika belum ada
       elemen yang bernilai x.
       Jika sudah ada elemen list yang bernilai x,
       maka I.S. = F.S. dan dituliskan pesan "nilai sudah ada".
  Proses: Cek apakah x ada dengan sequential search dengan sentinel,
          kemudian tambahkan jika belum ada. }
```

**Contoh:**

```
l = [3, 7, 1, 9]
insertUnique(l, 5) → l = [3, 7, 1, 9, 5]
insertUnique(l, 7) → l = [3, 7, 1, 9, 5]  dan cetak "nilai sudah ada"
```

**Topik:** ADT List, Insert, Sequential Search dengan Sentinel

---

### Kunci Jawaban Soal 8

```
procedure insertUnique(input/output l: List, input x: ElType)
KAMUS LOKAL
    i : integer

ALGORITMA
    { Sequential search dengan sentinel }
    { Sementara tambahkan x di akhir sebagai sentinel }
    l.contents[length(l)] ← x
    i ← 0
    while getElmt(l, i) ≠ x do
        i ← i + 1
    { i = length(l) berarti x tidak ada di list asli (ketemu sentinel) }
    { i < length(l) berarti x sudah ada di list asli }
    if i = length(l) then
        { x belum ada, tambahkan secara resmi }
        insertLast(l, x)
    else
        output("nilai sudah ada")
```

Penjelasan sentinel:

```
Sentinel adalah teknik menempatkan nilai yang dicari di luar batas efektif
(di indeks length(l)) agar loop selalu berhenti tanpa perlu cek batas indeks.
Loop dijamin berhenti karena pasti menemukan nilai x (yang asli atau sentinel).
Setelah loop, kita tahu apakah yang ditemukan adalah data asli atau sentinel.
```

---

## Soal 9 — Implementasi

Buatlah algoritma untuk prosedur berikut:

```
procedure closestPair(input l: List, output p1, p2: ElType)
{ I.S.: l terdefinisi, mungkin kosong, p1 dan p2 sembarang.
  F.S.:
    Jika l tidak kosong dan panjang ≥ 2:
    p1 dan p2 berisi 2 elemen l pada posisi berurutan yang memiliki
    selisih (selalu positif) terkecil.
    Jika kedua elemen nilainya berbeda, p1 adalah elemen yang lebih kecil.
    Jika ada beberapa pasang dengan selisih terkecil, diambil yang pertama.
    Jika l kosong atau hanya 1 elemen, p1 dan p2 bernilai -999. }
```

**Contoh:**

```
l = [5, 3, 10, 11, 20, 19]   → p1 = 10, p2 = 11  (selisih 1)
l = [-2, 10, 7, 30, 40, 43, 9] → p1 = 7, p2 = 10  (selisih 3)
l = [-2, 10, 10, 40, 40]     → p1 = 10, p2 = 10  (selisih 0)
l = []                        → p1 = -999, p2 = -999
```

**Topik:** ADT List, Traversal, Pencarian Minimum

---

### Kunci Jawaban Soal 9

```
procedure closestPair(input l: List, output p1, p2: ElType)
KAMUS LOKAL
    i, selisihMin, selisihSaat : integer
    a, b : ElType

ALGORITMA
    if length(l) < 2 then
        p1 ← -999
        p2 ← -999
    else
        { Inisialisasi dengan pasangan pertama }
        selisihMin ← abs(getElmt(l, 1) - getElmt(l, 0))
        if getElmt(l, 0) < getElmt(l, 1) then
            p1 ← getElmt(l, 0)
            p2 ← getElmt(l, 1)
        else
            p1 ← getElmt(l, 1)
            p2 ← getElmt(l, 0)

        i traversal [1..length(l)-2]
            a ← getElmt(l, i)
            b ← getElmt(l, i+1)
            selisihSaat ← abs(b - a)
            if selisihSaat < selisihMin then
                selisihMin ← selisihSaat
                if a < b then
                    p1 ← a
                    p2 ← b
                else
                    p1 ← b
                    p2 ← a
```

Penjelasan:

```
Inisialisasi dengan pasangan elemen pertama dan kedua.
Traversal dari indeks 1 sampai length-2 untuk membandingkan pasangan (i, i+1).
Jika ditemukan selisih yang lebih kecil, perbarui p1 dan p2.
Jika selisih sama, tidak diperbarui (diambil yang pertama muncul).
```

---

## Soal 10 — Implementasi

Buatlah algoritma untuk fungsi berikut:

```
function isFront(l1, l2: List) → boolean
{ Mengembalikan true jika elemen-elemen l1 merupakan bagian awal dari l2. }
```

**Contoh:**

```
isFront([2, 3, 4], [2, 3, 4, 5, 6]) = true
isFront([2, 3, 4], [3, 4, 5, 6])    = false
isFront([], [2, 3, 4, 5, 6])        = true
isFront([2, 3, 4], [2, 3])          = false
isFront([2, 3, 4], [])              = false
```

**Topik:** ADT List, Traversal, Perbandingan Prefix

---

### Kunci Jawaban Soal 10

```
function isFront(l1, l2: List) → boolean
KAMUS LOKAL
    i   : integer
    sama : boolean

ALGORITMA
    { l1 tidak bisa jadi prefix dari l2 jika l1 lebih panjang }
    if length(l1) > length(l2) then
        → false
    else
        { Termasuk kasus l1 kosong: langsung true }
        sama ← true
        i ← 0
        while i < length(l1) AND sama do
            if getElmt(l1, i) ≠ getElmt(l2, i) then
                sama ← false
            i ← i + 1
        → sama
```

Penjelasan kasus-kasus khusus:

```
isFront([], l2)     → length(l1) = 0, loop tidak dieksekusi, langsung true.
isFront(l1, [])     → length(l1) > length([]) = 0, langsung false
                       (kecuali l1 juga kosong, ditangani baris pertama).
isFront([2,3,4], [2,3]) → length(l1) = 3 > length(l2) = 2, langsung false.
```

---

## Soal 11 — Analisis

Bandingkan efisiensi waktu operasi `insertFirst` dan `deleteFirst` untuk kelima alternatif implementasi ADT List berikut. Berikan analisis best case, worst case, dan rata-rata.

```
alt-1a: implisit, rata kiri
alt-2a: eksplisit, rata kiri
alt-1b: implisit, tidak rata kiri
alt-2b: eksplisit, tidak rata kiri
alt-3 : implisit, tersebar
```

**Topik:** ADT List, Analisis Efisiensi, Kompleksitas Waktu

---

### Kunci Jawaban Soal 11

**insertFirst:**

| Alternatif | Best Case | Worst Case | Rata-rata | Keterangan |
| --- | --- | --- | --- | --- |
| alt-1a | O(n) | O(n) | O(n) | Selalu geser n elemen ke kanan |
| alt-2a | O(n) | O(n) | O(n) | Selalu geser nEff elemen ke kanan |
| alt-1b | O(1) | O(n) | O(1)* | O(1) jika ada ruang di depan; O(n) jika harus geser |
| alt-2b | O(1) | O(n) | O(1)* | Sama dengan alt-1b |
| alt-3 | O(n) | O(n) | O(n) | Harus defragmen dulu sebelum insert |

**deleteFirst:**

| Alternatif | Best Case | Worst Case | Rata-rata | Keterangan |
| --- | --- | --- | --- | --- |
| alt-1a | O(n) | O(n) | O(n) | Selalu geser n-1 elemen ke kiri |
| alt-2a | O(n) | O(n) | O(n) | Selalu geser nEff-1 elemen ke kiri |
| alt-1b | O(1) | O(1) | O(1) | Cukup geser pointer firstIdx maju |
| alt-2b | O(1) | O(1) | O(1) | Sama dengan alt-1b |
| alt-3 | O(1) | O(1) | O(1) | Cukup set elemen menjadi MARK |

Kesimpulan:

```
Untuk operasi di ujung kiri (insertFirst/deleteFirst):
  alt-b dan alt-3 jauh lebih efisien karena tidak perlu geser elemen.
  alt-a selalu O(n) karena harus menjaga kekontiguan mulai indeks 0.

Untuk operasi di ujung kanan (insertLast/deleteLast):
  alt-a lebih efisien (O(1)) karena langsung tahu posisi akhir via nEff.
  alt-1a perlu traversal dulu untuk mencari akhir list → O(n).
```