# Struktur Data Berkait
**IF2110/IF2111 – Algoritma dan Struktur Data**  
Sekolah Teknik Elektro dan Informatika, Institut Teknologi Bandung

---

## 1. Definisi Struktur Berkait

**Struktur berkait** terdiri atas node-node yang saling terkait satu sama lain. Setiap node adalah sebuah tuple yang terdiri atas dua bagian:

1. **info** – sebuah nilai dengan tipe tertentu
2. **next** – penunjuk (pointer) ke node lain; bisa bernilai NIL jika tidak menunjuk ke mana pun

Struktur ini memungkinkan penyimpanan elemen-elemen tanpa harus berada di lokasi memori yang bersebelahan (kontigu). Disebut juga **struktur node-based**, **linked list**, atau **linear list**.

### Memori Fisik: Array vs. Node-Based

| Aspek | Array | Node-Based |
|---|---|---|
| Lokasi memori | Bersebelahan (kontigu) | Tersebar, dihubungkan pointer |
| Alokasi memori | Ditetapkan di awal (misal: 100 slot) | Dialokasi sesuai kebutuhan |
| Memori per elemen | Ukuran elemen saja | Ukuran elemen + ukuran pointer |

> **Karakteristik utama:** Secara umum struktur berkait mengorbankan efisiensi ruang (memori) demi efisiensi waktu untuk operasi tertentu seperti insert/delete di tengah list.

---

## 2. Deklarasi Node

### Notasi Algoritmik

```
type ElType  : integer
type Address : pointer to Node
type Node    : < info : ElType, next : Address >

{ Contoh penggunaan }
p1 ← alokasi(9)   { p1 → Node(info=9, next=NIL) }
p2 ← alokasi(5)   { p2 → Node(info=5, next=NIL) }
p1↑.next ← p2     { next pada p1 menunjuk ke node p2 }
```

### Bahasa C

```c
/* node.h */
typedef int ElType;
typedef struct node* Address;
typedef struct node {
    ElType  info;
    Address next;
} Node;

#define INFO(p) (p)->info
#define NEXT(p) (p)->next

Address newNode(ElType val);
```

```c
/* node.c */
Address newNode(ElType val) {
    Address p = (Address) malloc(sizeof(Node));
    if (p != NULL) {
        INFO(p) = val;
        NEXT(p) = NULL;
    }
    return p;
}
```

---

## 3. Representasi Fisik List Linier: Struktur Berkait dengan Pointer

### 3.1 Representasi Implisit vs. Eksplisit

**Representasi Implisit** — menunjuk ke list sama dengan menunjuk ke elemen pertamanya:

```
type List : Address
```

Mewakili definisi rekursif:
- List kosong adalah list.
- List tidak kosong terdiri atas satu elemen yang diikuti list.

Karena `Next` dari elemen pertama juga harus bertipe `List`, maka `type List : Address`.

**Representasi Eksplisit** — elemen pertama merupakan bagian dari struktur data list:

```
type List : < first : Address >
```

Akses ke elemen pertama: `l.first`. Berguna untuk implementasi Queue:

```
type Queue : < head : Address, tail : Address >
```

### 3.2 Masalah Rekursi pada Representasi Eksplisit

Pada representasi eksplisit, proses rekursif menghadapi ketidakcocokan tipe:
- `l` tidak memiliki `info` maupun `next` secara langsung.
- `l.first↑.next` bertipe `Address`, bukan `List`, sehingga tidak bisa di-pass ke fungsi yang menerima `List`.
- `p` bertipe `Address`, tidak bisa di-pass ke `isEmpty` yang menerima `List`.

**Kesimpulan:** Proses rekursif lebih alami menggunakan **representasi implisit**.

---

## 4. Representasi Fisik List Linier: Struktur Berkait dengan Array

### 4.1 Motivasi

Kekurangan struktur berkait dengan pointer:
- Alokasi dan dealokasi memori satu per satu adalah operasi yang "mahal" pada sistem operasi.
- Beberapa bahasa pemrograman tidak mendukung pointer.

**Solusi:** Gunakan **array of Node** — banyak node dialokasi sekaligus dalam satu pemanggilan ke sistem operasi.

### 4.2 Konsep Array of Node

- Bagian `next` setiap node bukan lagi alamat fisik memori, melainkan **indeks array**.
- Saat inisialisasi: `nodeArray[i].next = i + 1` untuk setiap node.
- Node terakhir diisi indeks tidak valid (konstanta, misal `-1`).
- Diperlukan pencatat **node pertama yang kosong** (awalnya indeks `0`).
- Array of Node dapat dideklarasikan **global** untuk digunakan oleh beberapa list sekaligus.

> **Catatan menarik:** Indeks-indeks kosong yang saling terhubung membentuk sebuah **Stack!**

---

## 5. Variasi List Linier

### 5.1 Ringkasan Variasi

| Variasi | Elemen Pertama | Elemen Terakhir | List Kosong |
|---|---|---|---|
| List biasa | `First` | `Next(P) = NIL` | `First = NIL` |
| List + First & Last | `First` | `Last` | `First = Last = NIL` |
| List elemen terakhir → diri sendiri | `First` | `Next(last) = last` | `First = NIL` |
| List dummy di akhir | `First` | `Next(P) = dummy@` | `First = dummy@` |
| List dummy akhir + Last | `First` | `Last` (adalah dummy) | `First = Last = dummy@` |
| List dummy awal & akhir | Setelah dummy awal | Sebelum dummy akhir | Hanya 2 dummy terhubung |
| **List sirkuler** | `First` | `Next(last) = First` | `First = NIL` |
| **List pointer ganda** | `First` | `Next(P) = NIL` | `First = NIL` |
| DLL + Last | `First` | `Last` | `First = Last = NIL` |
| List pointer sirkuler ganda | `First` | `Prev(First) = last` | `First = NIL` |

---

## 6. List dengan Dummy Element

### 6.1 Dummy di Akhir + Pencatatan Last

```
type List : < first : Address, last : Address >
```

- **Elemen pertama:** `l` (First = l secara implisit)
- **Elemen terakhir:** address `p` di mana `Next(p) = dummy@`
- **List kosong:** `First(l) = Last(l) = dummy@`

### 6.2 Kapan Dipakai?

Berguna jika dummy digunakan sebagai **sentinel** dan pencarian diperlukan sebelum penambahan elemen:
- Nilai yang dicari disimpan sementara di dummy, lalu dilakukan search.
- Jika search gagal dan elemen ditambahkan, dialokasi dummy baru dan `Last` berubah.

### 6.3 Implementasi (Bahasa C)

```c
typedef struct {
    Address first;
    Address last;
} List;

#define FIRST(L) ((L).first)
#define LAST(L)  ((L).last)
```

**`isEmpty`:**
```c
boolean isEmpty(List l) {
    return (FIRST(l) == LAST(l));
}
```

**`CreateList`:**
```c
void CreateList(List *l) {
    Address pDummy = alokasi(0);
    if (pDummy != NIL) {
        FIRST(*l) = pDummy;
        LAST(*l)  = pDummy;
    } else {
        FIRST(*l) = NIL;
        LAST(*l)  = NIL;
    }
}
```

**`indexOf` (dengan sentinel):**
```c
int indexOf(List l, ElType x) {
    Address p;
    int idx;
    INFO(LAST(l)) = x;   /* letakkan x di sentinel */
    p = FIRST(l);
    idx = 0;
    while (INFO(p) != x) {
        p = NEXT(p);
        idx++;
    }
    if (p != LAST(l)) return idx;
    else               return IDX_UNDEF;
}
```

**`insertFirst`:**
```c
void insertFirst(List *l, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        NEXT(p)   = FIRST(*l);
        FIRST(*l) = p;
    }
}
```

**`insertLast` (alamat dummy tetap):**
```c
void insertLast(List *l, ElType x) {
    Address p, last;
    if (isEmpty(*l)) {
        insertFirst(l, x);
    } else {
        p = newNode(x);
        if (p != NIL) {
            last = FIRST(*l);
            while (NEXT(last) != LAST(*l))
                last = NEXT(last);
            NEXT(last) = p;
            NEXT(p)    = LAST(*l);
        }
    }
}
```

**`insertLast` (alamat dummy boleh berubah):**
```c
void insertLast(List *l, ElType x) {
    Address p;
    if (isEmpty(*l)) {
        insertFirst(l, x);
    } else {
        INFO(LAST(*l)) = x;
        p = newNode(x);          /* dummy baru */
        if (p != NIL) {
            NEXT(LAST(*l)) = p;
            LAST(*l)       = p;
        }
    }
}
```

**`deleteFirst`:**
```c
void deleteFirst(List *l, ElType *x) {
    Address p = FIRST(*l);
    *x        = INFO(p);
    FIRST(*l) = NEXT(FIRST(*l));
    free(p);
}
```

**`deleteLast`:**
```c
void deleteLast(List *l, ElType *x) {
    Address last, precLast;
    last = FIRST(*l); precLast = NIL;
    while (NEXT(last) != LAST(*l)) {
        precLast = last;
        last     = NEXT(last);
    }
    *x = INFO(last);
    if (precLast == NIL)
        FIRST(*l) = LAST(*l);
    else
        NEXT(precLast) = LAST(*l);
    free(last);
}
```

---

## 7. List dengan Pointer Ganda (Doubly Linked List)

### 7.1 Konsep

Setiap node memiliki **dua pointer**:
- `prev` → menunjuk ke node sebelumnya (predesesor)
- `next` → menunjuk ke node berikutnya (suksesor)

```
┌──────┬──────┬──────┐
│ prev │ info │ next │
└──────┴──────┴──────┘
```

**Ilustrasi:**
```
          First                               Last
            │                                  │
            ▼                                  ▼
NIL ←── [A] ←──► [B] ←──► [C] ──► NIL
```

Definisi:
- **Elemen pertama:** `First(L)`
- **Elemen terakhir:** `Last(L)`; `Next(Last(L)) = NIL`
- **List kosong:** `First(L) = Last(L) = NIL`

### 7.2 Kapan Digunakan?

- Dibutuhkan saat banyak operasi melibatkan suksesor **dan** predesesor sekaligus.
- Adanya pointer `prev` menghilangkan kebutuhan menyimpan variabel `Prec` secara manual saat traversal.
- Konsekuensi: operasi dasar lebih banyak dan memori per node lebih besar.

### 7.3 Implementasi (Bahasa C)

```c
typedef int ElType;
typedef struct node *Address;

typedef struct node {
    ElType  info;
    Address prev;
    Address next;
} Node;

typedef struct {
    Address first;
    Address last;
} List;

#define INFO(p)  (p)->info
#define PREV(p)  (p)->prev
#define NEXT(p)  (p)->next
#define FIRST(l) ((l).first)
#define LAST(l)  ((l).last)
```

**`insertFirst`:**
```c
void insertFirst(List *l, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        NEXT(p) = FIRST(*l);
        PREV(p) = NIL;
        if (!isEmpty(*l))
            PREV(FIRST(*l)) = p;
        else
            LAST(*l) = p;
        FIRST(*l) = p;
    }
}
```

**`insertLast`:**
```c
void insertLast(List *l, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        PREV(p) = LAST(*l);
        NEXT(p) = NIL;
        if (!isEmpty(*l))
            NEXT(LAST(*l)) = p;
        else
            FIRST(*l) = p;
        LAST(*l) = p;
    }
}
```

**`deleteFirst`:**
```c
void deleteFirst(List *l, ElType *x) {
    Address p = FIRST(*l);
    *x = INFO(p);
    if (FIRST(*l) == LAST(*l)) {   /* 1 elemen */
        LAST(*l) = NIL;
    } else {
        PREV(NEXT(FIRST(*l))) = NIL;
    }
    FIRST(*l) = NEXT(FIRST(*l));
    free(p);
}
```

**`deleteLast`:**
```c
void deleteLast(List *l, ElType *x) {
    Address p = LAST(*l);
    *x = INFO(p);
    if (FIRST(*l) == LAST(*l)) {   /* 1 elemen */
        FIRST(*l) = NIL;
    } else {
        NEXT(PREV(LAST(*l))) = NIL;
    }
    LAST(*l) = PREV(LAST(*l));
    free(p);
}
```

---

## 8. List Sirkuler

### 8.1 Konsep

Elemen terakhir pada list sirkuler **menunjuk kembali ke elemen pertama** (bukan NIL).

```
First ──► [A] ──► [B] ──► [C] ──┐
  ▲                               │
  └───────────────────────────────┘
```

Definisi:
- **Elemen pertama:** `First(L)`
- **Elemen terakhir:** address `p` di mana `Next(p) = First(L)`
- **List kosong:** `First(L) = NIL`

### 8.2 Kapan Digunakan?

- Tidak ada "First" yang sesungguhnya; `First` adalah *current pointer*.
- Dipakai untuk proses yang berjalan terus-menerus (contoh: **round-robin scheduling** pada sistem operasi).
- Kelemahan: penambahan/penghapusan elemen pertama mengharuskan traversal untuk mengubah `Next` dari elemen terakhir.

### 8.3 Implementasi (Bahasa C)

```c
typedef struct {
    Address first;
} List;

#define FIRST(l) ((l).first)
```

**`addrSearch`** — mencari apakah ada elemen beralamat `p`:
```c
boolean addrSearch(List l, Address p) {
    Address pt;
    if (isEmpty(l)) return false;
    pt = FIRST(l);
    while ((NEXT(pt) != FIRST(l)) && (pt != p))
        pt = NEXT(pt);
    return (pt == p);
}
```

**`insertFirst`:**
```c
void insertFirst(List *l, ElType x) {
    Address p, last;
    p = newNode(x);
    if (p != NIL) {
        if (isEmpty(*l)) {
            NEXT(p) = p;
        } else {
            last = FIRST(*l);
            while (NEXT(last) != FIRST(*l))
                last = NEXT(last);
            NEXT(p)    = FIRST(*l);
            NEXT(last) = p;
        }
        FIRST(*l) = p;
    }
}
```

**`insertLast`:**
```c
void insertLast(List *l, ElType x) {
    Address p, last;
    if (isEmpty(*l)) {
        insertFirst(l, x);
    } else {
        p = newNode(x);
        if (p != NIL) {
            last = FIRST(*l);
            while (NEXT(last) != FIRST(*l))
                last = NEXT(last);
            NEXT(last) = p;
            NEXT(p)    = FIRST(*l);
        }
    }
}
```

**`deleteFirst`:**
```c
void deleteFirst(List *l, ElType *x) {
    Address p, last;
    p  = FIRST(*l);
    *x = INFO(p);
    if (NEXT(FIRST(*l)) == FIRST(*l)) {   /* 1 elemen */
        FIRST(*l) = NIL;
    } else {
        last = FIRST(*l);
        while (NEXT(last) != FIRST(*l))
            last = NEXT(last);
        FIRST(*l)  = NEXT(FIRST(*l));
        NEXT(last) = FIRST(*l);
    }
    free(p);
}
```

**`deleteLast`:**
```c
void deleteLast(List *l, ElType *x) {
    Address last, precLast;
    last = FIRST(*l); precLast = NIL;
    while (NEXT(last) != FIRST(*l)) {
        precLast = last;
        last     = NEXT(last);
    }
    if (precLast == NIL) {
        FIRST(*l) = NIL;
    } else {
        NEXT(precLast) = FIRST(*l);
    }
    *x = INFO(last);
    free(last);
}
```

**`displayList`:**
```c
void displayList(List l) {
    Address p;
    if (isEmpty(l)) {
        printf("List Kosong\n");
    } else {
        p = FIRST(l);
        printf("List:\n");
        do {
            printf("%d\n", INFO(p));
            p = NEXT(p);
        } while (p != FIRST(l));
    }
}
```

---

## 9. Stack dengan Struktur Berkait

### 9.1 Konsep Stack

Stack adalah sederetan elemen dengan aturan **LIFO (Last In First Out)**:
- Dikenali elemen puncaknya (**Top**)
- Penambahan selalu dilakukan "di atas" Top
- Penghapusan selalu dilakukan pada Top

**Operasi dasar:**

| Operasi | Deskripsi |
|---|---|
| `CreateStack` | Membuat stack kosong |
| `push(x, S)` | Menambahkan x sebagai Top baru |
| `pop(S)` | Mengambil nilai Top; Top berubah |
| `top(S)` | Mengembalikan nilai Top saat ini |
| `isEmpty(S)` | True jika stack kosong |

### 9.2 Kesesuaian dengan List Linier

Stack sangat cocok direpresentasikan sebagai list linier biasa:

| Operasi Stack | Operasi List Setara |
|---|---|
| `CreateStack` | `CreateList` |
| `push` | `insertFirst` |
| `pop` | `deleteFirst` |
| `isEmpty` | `isEmpty` |

### 9.3 Implementasi (Bahasa C)

```c
typedef struct {
    Address addrTop;
} Stack;

#define ADDR_TOP(s) (s).addrTop
#define TOP(s)      (s).addrTop->info
```

**`push`:**
```c
void push(Stack *s, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        NEXT(p)      = ADDR_TOP(*s);
        ADDR_TOP(*s) = p;
    }
}
```

**`pop`:**
```c
void pop(Stack *s, ElType *x) {
    Address p;
    *x           = TOP(*s);
    p            = ADDR_TOP(*s);
    ADDR_TOP(*s) = NEXT(ADDR_TOP(*s));
    NEXT(p)      = NIL;
    free(p);
}
```

---

## 10. Queue dengan Struktur Berkait

### 10.1 Konsep Queue

Queue adalah sederetan elemen dengan aturan **FIFO (First In First Out)**:
- Dikenali elemen pertama (**HEAD**) dan terakhir (**TAIL**)
- Penambahan selalu dilakukan **setelah elemen terakhir**
- Penghapusan selalu dilakukan **pada elemen pertama**

**Operasi dasar:**

| Operasi | Deskripsi |
|---|---|
| `CreateQueue` | Membuat queue kosong |
| `enqueue(x, Q)` | Menambahkan x setelah elemen terakhir |
| `dequeue(Q)` | Menghapus HEAD; HEAD "mundur" |
| `head(Q)` | Mengembalikan nilai HEAD |
| `isEmpty(Q)` | True jika queue kosong |

### 10.2 Kesesuaian dengan List Linier

Queue cocok direpresentasikan sebagai list yang mencatat First dan Last:

| Operasi Queue | Operasi List Setara |
|---|---|
| `CreateQueue` | `CreateList` |
| `enqueue` | `insertLast` |
| `dequeue` | `deleteFirst` |
| `isEmpty` | `isEmpty` |

### 10.3 Implementasi (Bahasa C)

```c
typedef struct {
    Address addrHead;
    Address addrTail;
} Queue;

#define ADDR_HEAD(q) (q).addrHead
#define ADDR_TAIL(q) (q).addrTail
#define HEAD(q)      (q).addrHead->info
```

**`enqueue`:**
```c
void enqueue(Queue *q, ElType x) {
    Address p = newNode(x);
    if (p != NIL) {
        if (isEmpty(*q))
            ADDR_HEAD(*q) = p;
        else
            NEXT(ADDR_TAIL(*q)) = p;
        ADDR_TAIL(*q) = p;
    }
}
```

**`dequeue`:**
```c
void dequeue(Queue *q, ElType *x) {
    Address p;
    *x            = HEAD(*q);
    p             = ADDR_HEAD(*q);
    ADDR_HEAD(*q) = NEXT(ADDR_HEAD(*q));
    if (ADDR_HEAD(*q) == NIL)
        ADDR_TAIL(*q) = NIL;
    NEXT(p) = NIL;
    free(p);
}
```

---

## 11. Priority Queue

### 11.1 Konsep

Priority Queue adalah queue di mana elemennya **terurut menurut prioritas**:
- Penambahan dilakukan sesuai urutan prioritas (pada dasarnya `sortedInsert`)
- Penghapusan dilakukan pada elemen dengan prioritas tertinggi (di HEAD), sama dengan `deleteFirst`

### 11.2 Struktur Node

```c
typedef struct tNode {
    ElType  info;
    int     prio;
    Address next;
} Node;
```

### 11.3 Deklarasi Tipe

```c
typedef struct {
    Address addrHead;
} PrioQueue;

#define ADDR_HEAD(q) (q).addrHead
#define HEAD(q)      (q).addrHead->info
#define PRIO(p)      (p)->prio
```

---

## Ringkasan: Kesesuaian Struktur Data dengan List Linier

| Struktur | Representasi List yang Cocok | Pemetaan Operasi Utama |
|---|---|---|
| **Stack** | List biasa (implisit) | push ≡ insertFirst, pop ≡ deleteFirst |
| **Queue** | List + First & Last | enqueue ≡ insertLast, dequeue ≡ deleteFirst |
| **Priority Queue** | List terurut | enqueue ≡ sortedInsert, dequeue ≡ deleteFirst |
| **List Sirkuler** | List + pointer balik ke First | Cocok untuk proses round-robin |
| **Doubly Linked List** | List + pointer prev & next | deleteFirst/Last tanpa perlu traversal Prec |