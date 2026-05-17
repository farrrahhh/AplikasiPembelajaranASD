# Latihan Soal: Set dan Map

---

## Bagian 1 — ADT Set

### Soal 1: Operasi Dasar Set

Dengan menggunakan ADT Set yang direpresentasikan sebagai **array statik-eksplisit tidak terurut**
dengan deklarasi berikut:

```
constant CAPACITY: integer = 100
type ElType: integer
type Set:
    < buffer: array [0..CAPACITY-1] of ElType,
      length: integer >
```

Realisasikan prosedur dan fungsi berikut.

**a.** Buatlah `function isIn`:

```
function isIn (elmt: ElType, S: Set) → boolean
{ Mengembalikan true jika elmt ada di dalam S }
{ IS: S terdefinisi }
```

**b.** Buatlah `procedure add`:

```
procedure add (input elmt: ElType, input/output S: Set)
{ Menambahkan elmt ke S jika elmt belum ada di S }
{ IS: S terdefinisi, S tidak penuh }
{ FS: Jika elmt belum ada, elmt menjadi elemen baru S.
      Jika elmt sudah ada, S tidak berubah. }
```

**c.** Buatlah `procedure remove`:

```
procedure remove (input elmt: ElType, input/output S: Set)
{ Menghapus elmt dari S jika elmt ada di S }
{ IS: S terdefinisi }
{ FS: Jika elmt ada, elmt dihapus dari S. S mungkin kosong.
      Jika elmt tidak ada, S tidak berubah. }
```

Ilustrasi `remove(26, S)`:

```
Sebelum:                        Sesudah:
Index:  0   1   2   3   4       Index:  0   1   2   3
Value: 12  26   7  47  32       Value: 12  32   7  47
       length = 5                      length = 4

Catatan: elemen terakhir dipindah ke posisi elemen yang dihapus.
```

---

### Soal 2: Operasi Himpunan

Dengan menggunakan ADT Set pada Soal 1, realisasikan fungsi-fungsi berikut.

**a.** Buatlah `function union`:

```
function union (S1: Set, S2: Set) → Set
{ Mengembalikan gabungan S1 dan S2 }
{ IS: S1, S2 terdefinisi }
{ FS: Menghasilkan Set baru yang berisi semua elemen S1 dan S2
      tanpa duplikat }
```

Ilustrasi:

```
S1 = {12, 26, 7}    S2 = {7, 5, 26, 33}

union(S1, S2) = {12, 26, 7, 5, 33}
                ^-- dari S1 --^  ^-- dari S2 yang belum ada --^
```

**b.** Buatlah `function intersection`:

```
function intersection (S1: Set, S2: Set) → Set
{ Mengembalikan irisan S1 dan S2 }
{ IS: S1, S2 terdefinisi }
{ FS: Menghasilkan Set baru yang hanya berisi elemen
      yang ada di S1 sekaligus ada di S2 }
```

Ilustrasi:

```
S1 = {12, 26, 7}    S2 = {7, 5, 26, 33}

intersection(S1, S2) = {26, 7}
```

**c.** Buatlah `function setDifference`:

```
function setDifference (S1: Set, S2: Set) → Set
{ Mengembalikan S1 dikurangi S2 }
{ IS: S1, S2 terdefinisi }
{ FS: Menghasilkan Set baru yang berisi elemen S1
      yang tidak ada di S2 }
```

Ilustrasi:

```
S1 = {12, 26, 7}    S2 = {7, 5, 26, 33}

setDifference(S1, S2) = {12}
setDifference(S2, S1) = {5, 33}
```

---

### Soal 3: Set Terurut

Sekarang elemen-elemen Set disimpan secara **terurut membesar** berdasarkan nilainya.

```
constant CAPACITY: integer = 100
type ElType: integer
type Set:
    < buffer: array [0..CAPACITY-1] of ElType,
      length: integer >
```

**a.** Buatlah `function isIn` yang memanfaatkan **binary search**:

```
function isIn (elmt: ElType, S: Set) → boolean
{ Mengembalikan true jika elmt ada di dalam S }
{ IS: S terdefinisi, elemen S tersimpan terurut membesar }
```

**b.** Buatlah `procedure add` untuk Set terurut:

```
procedure add (input elmt: ElType, input/output S: Set)
{ Menambahkan elmt ke S dengan tetap menjaga urutan }
{ IS: S terdefinisi, tidak penuh, elemen S terurut membesar }
{ FS: Jika elmt belum ada, elmt disisipkan pada posisi yang tepat.
      Elemen-elemen setelahnya digeser satu posisi ke kanan.
      Jika elmt sudah ada, S tidak berubah. }
```

Ilustrasi `add(22, S)`:

```
Sebelum:                              Sesudah:
Index:  0   1   2   3   4             Index:  0   1   2   3   4   5
Value:  7  12  26  32  47             Value:  7  12  22  26  32  47
        length = 5                            length = 6

Posisi sisip = 2 (antara 12 dan 26). Elemen 26, 32, 47 digeser kanan.
```

**c.** Analisis dan bandingkan kompleksitas operasi `isIn` dan `add` antara
Set **tidak terurut** (Soal 1) dan Set **terurut** (Soal 3):

```
| Operasi | Tidak Terurut | Terurut |
|---------|---------------|---------|
| isIn    |               |         |
| add     |               |         |
```

Implementasi mana yang lebih baik jika operasi `isIn` jauh lebih sering
dipanggil dibanding `add`? Jelaskan.

---

## Bagian 2 — ADT Map

### Soal 4: Operasi Dasar Map

Dengan menggunakan ADT Map yang direpresentasikan sebagai **array statik-eksplisit**
dengan deklarasi berikut:

```
constant CAPACITY: integer = 100
constant VAL_UNDEF: ElType = -1

type KeyType: integer
type ElType:  integer

type MapEntry:
    < key:   KeyType,
      value: ElType >

type Map:
    < buffer: array [0..CAPACITY-1] of MapEntry,
      length: integer >
```

Realisasikan prosedur dan fungsi berikut.

**a.** Buatlah `function find`:

```
function find (k: KeyType, M: Map) → ElType
{ Mengembalikan value yang terasosiasi dengan key k,
  atau VAL_UNDEF jika key k tidak ada di M }
{ IS: M terdefinisi }
```

**b.** Buatlah `procedure set`:

```
procedure set (input k: KeyType, input v: ElType, input/output M: Map)
{ Menambahkan pasangan (k, v) ke M jika k belum ada,
  atau mengubah value dari key k menjadi v jika k sudah ada }
{ IS: M terdefinisi, M tidak penuh }
{ FS: Terdapat tepat satu entri dengan key k dan value v di M }
```

Ilustrasi:

```
M sebelum:
Index:  0          1          2
Value: <1,"Andi"> <2,"Budi"> <3,"Cici">   length = 3

set(2, "Bagas", M):
Index:  0          1            2
Value: <1,"Andi"> <2,"Bagas"> <3,"Cici">  length = 3
                   ^--- value diupdate

set(4, "Dodi", M):
Index:  0          1            2          3
Value: <1,"Andi"> <2,"Bagas"> <3,"Cici"> <4,"Dodi">  length = 4
                                           ^--- entri baru
```

**c.** Buatlah `procedure unset`:

```
procedure unset (input k: KeyType, input/output M: Map)
{ Menghapus pasangan dengan key k dari M }
{ IS: M terdefinisi }
{ FS: Jika key k ada, pasangan tersebut dihapus. M mungkin kosong.
      Jika key k tidak ada, M tidak berubah. }
```

Ilustrasi `unset(2, M)`:

```
Sebelum:                                      Sesudah:
Index:  0          1          2               Index:  0          1
Value: <1,"Andi"> <2,"Budi"> <3,"Cici">       Value: <1,"Andi"> <3,"Cici">
       length = 3                                     length = 2

Catatan: entri terakhir dipindah ke posisi entri yang dihapus.
```

---

### Soal 5: Map dengan Hash Table

Dengan menggunakan ADT Map berbasis **hash table** dan **linear probing**:

```
constant CAPACITY: integer = 7   { ukuran tabel }
constant NIL: MapEntry = <-1, -1>

type KeyType: integer
type ElType:  integer
type MapEntry: < key: KeyType, value: ElType >

type Map:
    < buffer: array [0..CAPACITY-1] of MapEntry,
      length: integer >

{ Fungsi hash: hash(k) = k mod CAPACITY }
```

**a.** Simulasikan operasi `set` berikut secara berurutan dan gambarkan
keadaan hash table setelah semua operasi selesai:

```
set(10, "A", M)
set(3,  "B", M)
set(17, "C", M)
set(14, "D", M)
set(6,  "E", M)
```

Tunjukkan langkah penanganan collision jika ada. Format tabel:

```
Index:  0    1    2    3    4    5    6
Key:
Value:
```

**b.** Dari keadaan hash table pada poin (a), simulasikan `unset(3, M)`.
Jelaskan mengapa slot tidak bisa langsung dikosongkan begitu saja,
dan gambarkan langkah pemindahan elemen yang diperlukan.

**c.** Buatlah `procedure unset` lengkap untuk Map dengan hash table
menggunakan linear probing:

```
procedure unset (input k: KeyType, input/output M: Map)
{ Menghapus pasangan dengan key k dari M }
{ IS: M terdefinisi }
{ FS: Jika key k ada, pasangan tersebut dihapus dan elemen-elemen
      setelahnya ditata ulang agar pencarian tetap benar. }
```

---

## Referensi Cepat

### Operasi Set

```
CreateSet     → membuat set kosong
isEmpty       → cek apakah set kosong
length        → jumlah elemen saat ini
isIn          → cek apakah elemen ada di set
add           → tambah elemen (jika belum ada)
remove        → hapus elemen
union         → gabungan dua set
intersection  → irisan dua set
setDifference → selisih dua set
isSubset      → cek apakah S1 ⊆ S2
isEqual       → cek apakah S1 = S2
```

### Operasi Map

```
CreateMap → membuat map kosong
isEmpty   → cek apakah map kosong
find      → cari value berdasarkan key
set       → tambah atau update pasangan (key, value)
unset     → hapus pasangan berdasarkan key
```