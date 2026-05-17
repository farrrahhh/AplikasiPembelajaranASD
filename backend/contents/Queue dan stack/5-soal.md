# Latihan Soal: Queue dan Stack

---

## Bagian 1 — ADT Queue

### Soal 1: Circular Buffer

Diberikan queue bertipe `ElType` yang terdiri atas `<id: integer, cost: integer>`.

**a.** Definisikan struktur data yang merepresentasikan queue tersebut dalam bentuk **circular buffer**, dengan:
- Alokasi statik maksimum **100 elemen**
- Menyimpan informasi **indeks head** dan **count** (banyaknya elemen dalam queue)

**b.** Buatlah `function isFull`:

```
function isFull (q: queue) → boolean
{ Mengirim true jika q penuh }
```

**c.** Buatlah `procedure enqueue`:

```
procedure enqueue (input/output q: queue, input val: ElType)
{ Proses: menambahkan val pada q sebagai Tail baru }
{ IS: q mungkin kosong, q tidak penuh }
{ FS: val menjadi Tail baru dengan mekanisme circular buffer }
```

**d.** Buatlah `procedure dequeue`:

```
procedure dequeue (input/output q: queue, output val: ElType)
{ Proses: menyimpan nilai Head q ke val dan menghapus Head q }
{ IS: q tidak kosong }
{ FS: val adalah nilai elemen Head, Head "bergerak" dengan mekanisme
      circular buffer. q mungkin kosong }
```

---

### Soal 2: Round Robin

Pandanglah queue pada Soal 1 sebagai antrian pekerjaan, di mana:
- `id` adalah nomor identifikasi pekerjaan
- `cost` adalah waktu yang dibutuhkan untuk menyelesaikan pekerjaan

Dengan memanfaatkan queue pada Soal 1, buatlah `procedure roundRobin` yang memproses
queue secara **Round Robin** dengan waktu terbatas `T`:

```
procedure roundRobin (input/output q: queue, input t: integer)
{ Proses: memproses elemen antrian q secara round robin }
{ IS: q tidak kosong, t adalah waktu yang tersedia untuk memproses setiap elemen }
{ FS: elemen e pada posisi HEAD dihapus dari q.
      Jika cost e ≤ t → tampilkan "<id> telah selesai diproses".
      Jika cost e > t → e disisipkan kembali sebagai tail q
                        dengan cost berkurang sebesar t }
```

Aturan pemrosesan:

```
Jika HEAD.cost ≤ T  → hapus elemen dari queue (pekerjaan selesai)
Jika HEAD.cost > T  → hapus dari HEAD, kurangi cost sebesar T,
                       sisipkan kembali sebagai TAIL baru
```

---

### Soal 3: Priority Queue

**a.** Dengan memodifikasi queue alternatif 2, definisikan (dalam notasi algoritmik)
struktur data yang merepresentasi **priority queue** untuk antrian pekerjaan, di mana:
- Setiap elemen bertipe `ElType` yang terdiri atas `<id: integer, cost: integer>`
- `id` adalah nomor identifikasi unik pekerjaan
- Elemen queue **terurut membesar** berdasarkan `cost`

**b.** Buatlah `procedure enqueue` untuk priority queue:

```
procedure enqueue (input/output q: queue, input val: ElType)
{ Proses: menambahkan val sebagai elemen baru di q,
          dengan memperhatikan urutan cost.
          Pekerjaan dengan cost lebih besar diletakkan lebih belakang.
          Jika dua pekerjaan memiliki cost sama,
          pekerjaan yang baru datang disisipkan lebih belakang. }
{ IS: q mungkin kosong, q tidak penuh }
{ FS: val menjadi elemen q yang baru dengan urutan cost membesar }
```

**c.** Buatlah `procedure dequeue` untuk priority queue:

```
procedure dequeue (input/output q: queue, output val: ElType)
{ Proses: menyimpan nilai head q pada val dan menghapus head dari q }
{ IS: q tidak kosong }
{ FS: elemen pada HEAD dihapus dan disimpan nilainya pada val }
```

---

## Bagian 2 — ADT Stack

### Soal 4: Operasi Dasar Stack

Dengan menggunakan ADT Stack yang direpresentasikan sebagai **array statik-eksplisit**
seperti yang dibahas di materi kuliah, realisasikan prosedur dan fungsi berikut.

**a.** Buatlah `procedure copyStack`:

```
procedure copyStack (input sIn: Stack, output sOut: Stack)
{ Membuat salinan sOut dari sIn }
{ IS: sIn terdefinisi, sOut sembarang }
{ FS: sOut berisi salinan sIn yang identik }
```

Ilustrasi:

```
sIn (sebelum):   sIn (sesudah):   sOut (sesudah):
  +---+            +---+            +---+
  | 3 | ← TOP      | 3 | ← TOP      | 3 | ← TOP
  +---+            +---+            +---+
  | 2 |            | 2 |            | 2 |
  +---+            +---+            +---+
  | 1 |            | 1 |            | 1 |
  +---+            +---+            +---+
```

**b.** Buatlah `procedure inverseStack`:

```
procedure inverseStack (input/output s: Stack)
{ Membalik isi suatu stack }
{ IS: s terdefinisi }
{ FS: isi s terbalik dari posisi semula }
```

Ilustrasi:

```
Sebelum:         Sesudah:
  +---+            +---+
  | 3 | ← TOP      | 1 | ← TOP
  +---+            +---+
  | 2 |            | 2 |
  +---+            +---+
  | 1 |            | 3 |
  +---+            +---+
```

**c.** Buatlah `function mergeStack`:

```
function mergeStack (s1, s2: Stack) → Stack
{ Menghasilkan sebuah stack hasil penggabungan s1 dengan s2,
  dengan s1 berada di posisi lebih "bawah".
  Urutan kedua stack harus sama seperti aslinya. }
{ Stack baru diisi sampai seluruh elemen s1 dan s2 masuk,
  atau jika stack baru sudah penuh, diisi secukupnya. }
```

Ilustrasi:

```
s1:              s2:              Merge(s1, s2):
  +---+            +---+            +---+
  | 2 | ← TOP      | 4 | ← TOP      | 4 | ← TOP
  +---+            +---+            +---+
  | 1 |            | 3 |            | 3 |
  +---+            +---+            +---+
                                    | 2 |
                                    +---+
                                    | 1 |
                                    +---+
```

---

### Soal 5: Evaluasi Ekspresi Postfix

Dengan memanfaatkan **mesin kata**, modifikasi dan lengkapi program Evaluasi Ekspresi
Aritmatika.

Ketentuan:
- Pita karakter berisi ekspresi aritmatika postfix
- Setiap "kata" dipisahkan oleh satu atau lebih `BLANK`
- Kata yang merupakan operan merepresentasikan bilangan bulat non-negatif
- Contoh isi pita: `123 3 *`

Hal-hal yang perlu dibuat:

```
1. ADT Stack of Kata
   (gunakan representasi array statik-eksplisit)

2. Fungsi untuk mengubah Kata yang merepresentasikan
   operan menjadi integer

3. Program evaluasi ekspresi lengkap
```

Contoh penelusuran untuk ekspresi `A B C ^ / D E * + A C * −`:

```
Token  | Aksi              | Stack (bawah → atas)
-------|-------------------|-------------------------------
A      | push              | [A]
B      | push              | [A, B]
C      | push              | [A, B, C]
^      | pop C, pop B,     | [A, B^C]
       | push B^C          |
/      | pop B^C, pop A,   | [A/(B^C)]
       | push A/(B^C)      |
D      | push              | [A/(B^C), D]
E      | push              | [A/(B^C), D, E]
*      | pop E, pop D,     | [A/(B^C), D*E]
       | push D*E          |
+      | pop D*E,          | [(A/(B^C))+(D*E)]
       | pop A/(B^C),      |
       | push hasilnya     |
A      | push              | [(A/(B^C))+(D*E), A]
C      | push              | [(A/(B^C))+(D*E), A, C]
*      | pop C, pop A,     | [(A/(B^C))+(D*E), A*C]
       | push A*C          |
−      | pop A*C,          | [(A/(B^C))+(D*E)−(A*C)]
       | pop hasil,        |
       | push hasilnya     |

Output: (A/(B^C))+(D*E)−(A*C)
```

---

## Referensi Cepat

### Operasi Queue

```
CreateQueue → membuat queue kosong
enqueue     → tambah elemen ke TAIL
dequeue     → hapus elemen dari HEAD
head        → lihat elemen HEAD
isEmpty     → cek apakah kosong
isFull      → cek apakah penuh
length      → jumlah elemen saat ini
```

### Operasi Stack

```
CreateStack → membuat stack kosong
push        → tambah elemen ke TOP
pop         → hapus dan ambil elemen TOP
top         → lihat elemen TOP
isEmpty     → cek apakah kosong
isFull      → cek apakah penuh
length      → jumlah elemen saat ini
```