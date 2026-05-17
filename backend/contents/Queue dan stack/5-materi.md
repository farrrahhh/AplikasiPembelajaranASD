# Queue dan Stack

## Queue (Antrian)

**Queue** adalah struktur data dengan prinsip:

```
First In, First Out
```

Artinya, data yang masuk pertama akan keluar pertama — seperti antrian di dunia nyata.

---

### Struktur Queue

Queue dikenali dari dua ujungnya:

```
HEAD → elemen paling depan (keluar duluan)
TAIL → elemen paling belakang (masuk paling baru)
```

Aturan operasinya:

```
Penyisipan  → selalu dilakukan setelah TAIL
Penghapusan → selalu dilakukan pada HEAD
```

Ilustrasi:

```
Masuk dari belakang
        ↓
[w] [x] [y] [z]
 ↑
Keluar dari depan (HEAD)
```

Tiga kondisi queue yang mungkin:

```
Queue dengan 4 elemen:    HEAD → [w][x][y][z] ← TAIL
Queue dengan 1 elemen:    HEAD → [w] ← TAIL
Queue kosong:             HEAD dan TAIL = IDX_UNDEF
```

---

### Contoh Pemakaian Queue

```
Antrian printer
Antrian customer service
Job scheduling di sistem operasi
```

---

### Definisi Operasi Queue

| Operasi | Fungsi |
| --- | --- |
| `CreateQueue` | Membuat antrian kosong |
| `head` | Mengirimkan elemen terdepan saat ini |
| `length` | Mengirimkan banyaknya elemen saat ini |
| `enqueue` | Menambahkan elemen setelah TAIL |
| `dequeue` | Menghapus HEAD, queue mungkin jadi kosong |
| `isEmpty` | Mengecek apakah queue kosong |

---

### ADT Queue dengan Array

Struktur data queue dalam notasi algoritmik:

```
KAMUS UMUM
constant IDX_UNDEF: integer = -1
constant CAPACITY: integer = 10

type ElType: integer  { elemen Queue }

type Queue: < buffer: array [0..CAPACITY-1] of ElType,
               idxHead: integer,
               idxTail: integer >
```

Ciri queue kosong:

```
idxHead = IDX_UNDEF
idxTail = IDX_UNDEF
```

---

### Implementasi Queue: Alt-1

HEAD selalu di indeks 0. Saat dequeue, semua elemen digeser ke kiri.

```
Sebelum dequeue:
HEAD                    TAIL
 ↓                       ↓
[x][y][z][a][b][ ][ ][ ][ ][ ]
 0  1  2  3  4  5  6  7  8  9

Setelah dequeue(x):
HEAD                TAIL
 ↓                   ↓
[y][z][a][b][ ][ ][ ][ ][ ][ ]
 0  1  2  3  4  5  6  7  8  9
```

Algoritma **penghapusan** (naif):

```
Ambil nilai HEAD
Geser semua elemen dari idxHead+1 sampai idxTail ke kiri
Geser TAIL ke kiri
Kasus khusus (berelemen 1): idxHead dan idxTail = IDX_UNDEF
```

Kelebihan: sederhana. Kekurangan: tidak efisien karena perlu menggeser semua elemen.

---

### Implementasi Queue: Alt-2

HEAD bergeser ke kanan saat dequeue. Tidak perlu menggeser elemen tiap hapus.

```
Setelah beberapa dequeue:
       HEAD            TAIL
        ↓               ↓
[ ][ ][z][a][b][c][d][ ][ ][ ]
 0  1  2  3  4  5  6  7  8  9
```

Algoritma **penghapusan** (efisien):

```
Ambil nilai HEAD
Geser HEAD ke kanan (idxHead++)
Kasus khusus (berelemen 1): idxHead dan idxTail = IDX_UNDEF
```

Masalah **penuh semu**: ketika idxTail sudah mencapai CAPACITY-1 tapi masih ada
ruang kosong di kiri. Solusinya: geser semua elemen ke indeks 0 saat akan enqueue
dan idxTail = CAPACITY-1.

---

### Implementasi Queue: Alt-3 (Circular Buffer)

HEAD dan TAIL berputar mengelilingi array dari awal sampai akhir, kemudian kembali ke awal.
Tidak perlu pergeseran apapun — paling efisien.

```
Visualisasi melingkar (kapasitas 10):

         9   0
       8       1
      7         2
       6       3
         5   4

HEAD dan TAIL bergerak searah jarum jam saat enqueue,
dan HEAD bergerak saat dequeue.
```

Rumus suksesor indeks:

```
Jika idxTail < CAPACITY-1 → idxTail baru = idxTail + 1
Jika idxTail = CAPACITY-1 → idxTail baru = 0
```

Strategi ini disebut **circular buffer**. Variasi lain: mengganti `idxTail` dengan `count`
(jumlah elemen saat ini).

---

### Implementasi Queue dalam Bahasa C (Alt-2)

**File `queue.h`:**

```c
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
```

**Implementasi fungsi-fungsi dasar:**

```c
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
```

**Implementasi `enqueue` (Alt-2 — geser jika mentok kanan):**

```c
void enqueue(Queue *q, ElType val) {
    if (isEmpty(*q)) {
        IDX_HEAD(*q) = 0;
        IDX_TAIL(*q) = 0;
    } else {
        if (IDX_TAIL(*q) == (CAPACITY - 1)) {  /* mentok kanan, geser dulu */
            for (int i = IDX_HEAD(*q); i <= IDX_TAIL(*q); i++) {
                (*q).buffer[i - IDX_HEAD(*q)] = (*q).buffer[i];
            }
            IDX_TAIL(*q) -= IDX_HEAD(*q);
            IDX_HEAD(*q) = 0;
        }
        IDX_TAIL(*q)++;
    }
    TAIL(*q) = val;
}
```

**Implementasi `dequeue`:**

```c
void dequeue(Queue *q, ElType *val) {
    *val = HEAD(*q);
    if (IDX_HEAD(*q) == IDX_TAIL(*q)) {
        IDX_HEAD(*q) = IDX_UNDEF;
        IDX_TAIL(*q) = IDX_UNDEF;
    } else {
        IDX_HEAD(*q)++;
    }
}
```

---

## Stack (Tumpukan)

**Stack** adalah struktur data dengan prinsip:

```
Last In, First Out
```

Artinya, data yang terakhir masuk akan keluar paling pertama — seperti tumpukan piring.

---

### Struktur Stack

Stack hanya dikenali dari satu ujung, yaitu **TOP**:

```
Penyisipan (push) → dilakukan di atas TOP
Penghapusan (pop) → dilakukan pada TOP
```

Ilustrasi:

```
push(30)   push(20)   push(10)
   ↓
+----+
| 30 |  ← TOP (keluar duluan)
+----+
| 20 |
+----+
| 10 |
+----+
```

---

### Perbedaan Stack dan Queue

| Konsep | Urutan | Operasi aktif di |
| --- | --- | --- |
| Stack | LIFO | Satu ujung (TOP) |
| Queue | FIFO | Dua ujung (HEAD dan TAIL) |
| List | Bebas | Di mana saja |

---

### Contoh Pemakaian Stack

```
Undo di text editor
Riwayat browser (back/forward)
Call stack dalam program
Evaluasi ekspresi aritmatika
Rekursivitas
Backtracking
```

---

### Definisi Operasi Stack

| Operasi | Fungsi |
| --- | --- |
| `CreateStack` | Membuat tumpukan kosong |
| `top` | Mengirimkan elemen teratas saat ini |
| `length` | Mengirimkan banyaknya elemen saat ini |
| `push` | Menambahkan elemen sebagai TOP baru |
| `pop` | Mengambil nilai TOP, TOP berkurang 1 |
| `isEmpty` | Mengecek apakah stack kosong |

---

### ADT Stack dengan Array

Struktur data stack dalam notasi algoritmik:

```
KAMUS UMUM
constant IDX_UNDEF: integer = -1
constant CAPACITY: integer = 10

type ElType: integer  { elemen Stack }

type Stack: < buffer: array [0..CAPACITY-1] of ElType,
               idxTop: integer >
```

Ciri stack kosong:

```
idxTop = IDX_UNDEF
```

Stack tidak memerlukan idxHead karena hanya beroperasi di satu ujung.

---

### Implementasi Stack dengan Array

Ilustrasi stack tidak kosong (5 elemen):

```
Index:   0    1    2    3    4    5    6    7    8    9
Value:  [x]  [y]  [z]  [a]  [b]  [ ]  [ ]  [ ]  [ ]  [ ]
                              ↑
                             TOP (idxTop = 4)
```

Ilustrasi stack kosong:

```
Index:   0    1    2    3    4    5    6    7    8    9
Value:  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]
  ↑
TOP = IDX_UNDEF
```

---

### Algoritma Push dan Pop

Algoritma **push** (notasi algoritmik):

```
s.idxTop ← s.idxTop + 1
s.buffer[s.idxTop] ← val
```

Algoritma **pop** (notasi algoritmik):

```
val ← top(s)
s.idxTop ← s.idxTop - 1
```

Jauh lebih sederhana dari queue karena tidak ada pergeseran dan hanya satu ujung yang aktif.

---

### Implementasi Stack dalam Bahasa C

**File `stack.h`:**

```c
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
```

**Implementasi fungsi-fungsi:**

```c
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
```

---

## Contoh Aplikasi: Evaluasi Ekspresi Aritmatika

Stack sering dipakai untuk mengevaluasi ekspresi **postfix** (Reverse Polish Notation).

Perbandingan notasi:

| Postfix | Infix |
| --- | --- |
| `A B * C /` | `(A*B)/C` |
| `A B C ^ / D E * + A C * −` | `(A/(B^C))+(D*E)−(A*C)` |

Algoritma evaluasi:

```
Baca token satu per satu:
  Jika token bukan operator → push ke stack
  Jika token operator       → pop dua operan, hitung, push hasilnya

Setelah semua token selesai → top(stack) adalah hasil akhir
```

Contoh langkah untuk `A B * C /`:

```
Token 'A' → push → Stack: [A]
Token 'B' → push → Stack: [A, B]
Token '*' → pop B, pop A, push A*B → Stack: [A×B]
Token 'C' → push → Stack: [A×B, C]
Token '/' → pop C, pop A×B, push (A×B)/C → Stack: [(A×B)/C]

Selesai → output: (A×B)/C
```

---

## Ringkasan Perbandingan

| Aspek | Queue | Stack |
| --- | --- | --- |
| Prinsip | FIFO | LIFO |
| Ujung aktif | HEAD (keluar) dan TAIL (masuk) | TOP (masuk dan keluar) |
| Operasi tambah | `enqueue` ke TAIL | `push` ke TOP |
| Operasi hapus | `dequeue` dari HEAD | `pop` dari TOP |
| Implementasi array | Perlu lacak HEAD dan TAIL | Cukup lacak TOP |
| Contoh penggunaan | Antrian printer, job scheduling | Undo, call stack, ekspresi |

---

## Pertanyaan untuk Direnungkan

Contoh-contoh di atas menggunakan buffer yang **terbatas dan statis** (kapasitas tetap).
Apa yang perlu diubah jika:

```
Buffer menjadi dinamis
(q1 dan q2 bisa memiliki kapasitas berbeda)?

Queue atau Stack tidak boleh memiliki batas length
(length bisa tak terhingga secara teoretis)?
```

Konsekuensinya: `buffer` perlu diganti dari array statis menjadi pointer `ElType*`,
lalu `malloc()` dipanggil saat konstruktor, dan perlu ada destruktor seperti
`DestroyQueue()` atau `DestroyStack()` yang memanggil `free(buffer)`.