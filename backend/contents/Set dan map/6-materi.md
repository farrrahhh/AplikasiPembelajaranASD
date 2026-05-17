# ADT Set dan Map

## ADT Set

### Definisi Set

**Set** adalah kumpulan objek yang:

```
Memiliki tipe yang sama
Setiap elemennya unik (tidak ada duplikat)
Tidak memiliki keterurutan (tidak ada istilah 'next' dan 'previous')
```

Contoh:

```
S = {7, 12, 26, 32, 47}

add(S, 22) → S = {7, 12, 22, 26, 32, 47}  ✓ (22 belum ada)
add(S, 26) → S = {7, 12, 22, 26, 32, 47}  ✗ (26 sudah ada, tidak ditambah)
```

---

### Operasi-operasi Set

Jika diberikan `S`, `S1`, `S2` adalah Set dengan elemen `ElmtS`:

| Operasi | Keterangan |
| --- | --- |
| `CreateSet` | Membuat sebuah set kosong |
| `isEmpty(S)` | True jika S kosong, false jika tidak |
| `length(S)` | Mengembalikan banyaknya elemen S |
| `add(ElmtS, S)` | Menambahkan ElmtS ke S, jika belum ada |
| `remove(ElmtS, S)` | Menghapus ElmtS dari S |
| `isIn(ElmtS, S)` | True jika ElmtS ada di dalam S |
| `isEqual(S1, S2)` | True jika S1 dan S2 memiliki elemen yang sama |
| `union(S1, S2)` | Menghasilkan gabungan S1 dan S2 |
| `intersection(S1, S2)` | Menghasilkan irisan S1 dan S2 |
| `setDifference(S1, S2)` | Menghasilkan S1 dikurangi S2 |
| `copy(S)` | Mengcopy set S ke set baru |
| `isSubset(S1, S2)` | True jika S1 adalah subset dari S2 |

Contoh penggunaan:

```
s = {12, 26, 7, 47, 32}
t = {5, 12}

add(s, 22)     → s = {12, 26, 7, 47, 32, 22}
remove(s, 47)  → s = {12, 26, 7, 32, 22}
isIn(s, 7)     = true
isIn(t, 7)     = false
union(s, t)    = {12, 26, 7, 32, 22, 5}
```

---

### Axiomatic Semantics Set

Aksioma mendeskripsikan perilaku operasi secara formal.

```
1) new() returns a set
2) isIn(v, new())        = false
3) isIn(v, add(v, S))   = true
4) isIn(v, add(u, S))   = isIn(v, S)          jika v ≠ u
5) remove(v, new())     = new()
6) remove(v, add(v, S)) = remove(v, S)
7) remove(v, add(u, S)) = add(u, remove(v, S)) jika v ≠ u
8) isEmpty(new())        = true
9) isEmpty(add(v, S))   = false
```

Dengan `S` adalah set dan `u`, `v` adalah elemen.

---

### Implementasi Set dengan Array

Set dapat diimplementasikan menggunakan array (eksplisit-statik).

Deklarasi tipe dalam notasi algoritmik:

```
KAMUS UMUM
constant CAPACITY: integer = ...   { Banyaknya elemen maksimum }

type ElType: integer               { tipe elemen set }

type Set:
    < buffer: array [0..CAPACITY-1] of ElType,   { penyimpan elemen }
      length: integer >                           { jumlah elemen }
```

Ilustrasi array:

```
S = {7, 12, 26, 32, 47}

Index:   0    1    2    3    4    5    6    7
Value:   7   12   26   32   47
         ^-------- terisi --------^
                              length = 5
```

Ada **dua cara** menyusun elemen di dalam array:

```
1. Terurut berdasarkan nilai
   → [7, 12, 26, 32, 47]

2. Berdasarkan urutan dilakukannya insert
   → [12, 26, 7, 47, 32]
```

#### Perbandingan Kinerja

| Operasi | Terurut | Tidak Terurut |
| --- | --- | --- |
| `isIn` | O(log n) – binary search | O(n) – linear search |
| `add` | O(n) – harus geser elemen | O(1) – tambah di akhir |
| `remove` | O(n) – harus geser elemen | O(n) – cari + hapus |
| `union` | O(n + m) – merge dua list | O(n × m) – cek satu per satu |

Kesimpulan:

```
Terurut     → isIn lebih cepat (binary search)
Tidak terurut → add lebih cepat (langsung di akhir)
```

---

### Implementasi Set dengan Hash Table

Untuk kinerja lebih baik, Set bisa diimplementasikan menggunakan hash table.

Prinsip:

```
1. Elemen di-hash → menghasilkan indeks
2. Elemen disimpan di slot sesuai indeks tersebut
3. Jika terjadi collision, gunakan strategi penyelesaian
```

Kelebihan:

```
isIn  → O(1) rata-rata
add   → O(1) rata-rata
```

Kekurangan:

```
Perlu menangani collision
Perlu mengatur load factor agar tabel tidak penuh
```

---

## ADT Map

### Definisi Map

**Map** adalah kumpulan pasangan `<key, value>`, dengan nilai `key` bersifat unik.

Dikenal juga sebagai:

```
Associative array
Symbol table
Dictionary
```

Ilustrasi:

```
+------------+-----------+
|    Key     |   Value   |
+------------+-----------+
| "nama"     | "Budi"    |
| "nim"      | "13523001"|
| "jurusan"  | "IF"      |
+------------+-----------+
```

Perbedaan utama Map vs Set:

| Konsep | Isi | Keunikan |
| --- | --- | --- |
| Set | Elemen tunggal | Elemen unik |
| Map | Pasangan key-value | Key unik |

---

### Operasi-operasi Map

Jika diberikan `M` adalah Map dengan elemen pasangan `<K, V>`:

| Operasi | Keterangan |
| --- | --- |
| `CreateMap` | Membuat sebuah Map kosong |
| `isEmpty(M)` | True jika M kosong |
| `set(K, V, M)` | Menambah pasangan (K,V), atau update value jika K sudah ada |
| `unset(K, M)` | Menghapus pasangan dengan key K |
| `find(K, M)` | Mengembalikan value dari key K |

Contoh penggunaan:

```
M = {}

set("nama", "Budi", M)    → M = {("nama", "Budi")}
set("nim", "13523001", M) → M = {("nama", "Budi"), ("nim", "13523001")}
set("nama", "Andi", M)    → M = {("nama", "Andi"), ("nim", "13523001")}

find("nama", M)   = "Andi"
find("nim", M)    = "13523001"
find("email", M)  = VAL_UNDEF

unset("nim", M)   → M = {("nama", "Andi")}
```

---

### Axiomatic Semantics Map

```
1) new() returns a map
2) find(k, set(k, v, M))    = v
3) find(k, set(j, v, M))    = find(k, M)              jika k ≠ j
4) unset(k, new())           = new()
5) unset(k, set(k, v, M))   = unset(k, M)
6) unset(k, set(j, v, M))   = set(j, v, unset(k, M))  jika k ≠ j
```

Dengan `k` dan `j` adalah key, `v` adalah value, dan `M` adalah map.

---

### Implementasi Map dengan Array

Deklarasi tipe dalam notasi algoritmik:

```
KAMUS UMUM
constant CAPACITY: integer = ...
constant VAL_UNDEF: ElType = ...

type KeyType: ...
type ElType:  ...

type MapEntry:
    < key:   KeyType,
      value: ElType >

type Map:
    < buffer: array [0..CAPACITY-1] of MapEntry,
      length: integer >
```

Ilustrasi array:

```
Index:   0              1              2
Value:   <"nama","Budi"> <"nim","0001"> <"jur","IF">
                                         length = 3
```

---

## Hash dan Hash Table

### Fungsi Hash

**Fungsi hash** adalah fungsi yang memetakan data berukuran berapa pun menjadi nilai berukuran tetap.

```
key (berukuran bebas) → fungsi hash → hash/digest (berukuran tetap)
```

Contoh sederhana (XOR):

```
1. Pecah key menjadi potongan 8-bit
2. Lakukan XOR semua potongan
3. Hasilnya adalah nilai hash (1 byte = 0..255)
```

Fungsi hash yang baik:

```
1. Komputasinya cepat
2. Meminimalisir collision (dua key berbeda menghasilkan hash sama)
```

---

### Collision

Collision terjadi ketika dua key berbeda menghasilkan nilai hash yang sama.

Ilustrasi:

```
keys           hash function     hashes
John Smith  ─────────────────→   01
Lisa Smith  ─────────────────→   02
Sam Doe     ─────────────────→   04
Sandra Dee  ─────────────────→   02  ← collision dengan Lisa Smith!
```

---

### Strategi Penyelesaian Collision

#### a. Hash Chaining

Setiap slot menyimpan sebuah linked list (association list).

```
Slot 001: → [Lisa Smith | 521-8976] → NULL
Slot 152: → [Sandra Dee | 521-9655] → [John Smith | 521-1234] → NULL
Slot 254: → [Sam Doe    | 521-5030] → NULL
```

Kelebihan:

```
Mudah diimplementasikan
Tidak ada masalah jika tabel penuh
```

#### b. Open Addressing (Linear Probing)

Jika slot terisi, cari slot berikutnya yang kosong.

```
hash("John") = 5 → slot 5 kosong → simpan di slot 5
hash("Lisa") = 5 → slot 5 terisi → cek slot 6 → kosong → simpan di slot 6
```

Metode pencarian slot alternatif:

```
1. Linear probing   → selalu geser +1
2. Quadratic probing → geser dengan fungsi kuadratik (+1, +4, +9, ...)
3. Double hashing   → gunakan fungsi hash kedua untuk menentukan interval
```

---

### Load Factor

**Load factor** adalah rasio slot terisi terhadap total slot.

```
load factor = jumlah slot terisi / total slot
```

Hash table bekerja baik saat:

```
load factor < 1 (idealnya ≤ 0.7)
```

Jika load factor terlalu tinggi:

```
Alokasikan tabel baru yang lebih besar
Hash ulang semua elemen ke tabel baru (rehashing)
```

---

### Algoritma set pada Map dengan Hash

```
procedure set(input/output m: Map, input k: KeyType, input v: ElType)
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
        idx ← idx + 1

if found then
    m.buffer[idx].value ← v
else
    m.buffer[idx] ← <k, v>
    m.length ← m.length + 1
```

Catatan: collision ditangani dengan linear probing. Slot kosong ditandai NIL.

---

### Algoritma find pada Map dengan Hash

```
function find(m: Map, k: KeyType) → ElType
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
        idx ← idx + 1

if found then
    → m.buffer[idx].value
else
    → VAL_UNDEF
```

---

### Penghapusan Elemen pada Hash Table

Menghapus elemen di indeks `i` tidak bisa hanya dikosongkan begitu saja.

Masalah:

```
Pencarian berhenti saat menemukan slot kosong.
Jika ada elemen lain yang dipindah akibat collision dan tersimpan di slot
setelah i, elemen tersebut tidak akan ditemukan.
```

Solusi:

```
Setelah menghapus elemen di indeks i,
cari & pindahkan elemen-elemen setelahnya yang hash-nya ≤ i
ke posisi yang lebih dekat dengan hash-nya.
```

---

## Ringkasan Perbandingan Implementasi

| Implementasi | isIn / find | add / set | remove / unset |
| --- | --- | --- | --- |
| Array tidak terurut | O(n) | O(1) | O(n) |
| Array terurut | O(log n) | O(n) | O(n) |
| Hash table | O(1) rata-rata | O(1) rata-rata | O(1) rata-rata |

Hash table memberikan kinerja terbaik rata-rata untuk semua operasi, dengan syarat load factor dijaga rendah dan collision dikelola dengan baik.