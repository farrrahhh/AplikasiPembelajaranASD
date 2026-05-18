# Soal Latihan: Struktur Data Berkait
**IF2110/IF2111 – Algoritma dan Struktur Data**  
Sekolah Teknik Elektro dan Informatika, Institut Teknologi Bandung

---

## Bagian A — ADT List dengan Struktur Berkait

Gunakan deklarasi berikut untuk soal-soal di bagian ini:

```c
typedef int ElType;
typedef struct node* Address;
typedef struct node {
    ElType  info;
    Address next;
} Node;
typedef Address List;

#define INFO(p) (p)->info
#define NEXT(p) (p)->next
```

---

### Soal A1 — `countPos`

Buatlah fungsi `countPos` yang menghitung banyaknya kemunculan bilangan positif (`> 0`) dari sebuah list of integer `l`.

```c
int countPos(List l);
/* I.S. l terdefinisi, mungkin kosong
   F.S. Mengembalikan banyaknya elemen bernilai > 0 pada l */
```

---

### Soal A2 — `max`

Buatlah fungsi `max` yang menghasilkan nilai maksimum dari suatu list of integer `l` yang **tidak kosong**.

```c
ElType max(List l);
/* I.S. l tidak kosong
   F.S. Mengembalikan nilai terbesar di antara semua elemen l */
```

---

### Soal A3 — `searchPos`

Buatlah fungsi `searchPos` yang menghasilkan address di mana nilai positif pertama kali ditemukan di list of integer `l`. Jika tidak ada, kembalikan `NIL`.

```c
Address searchPos(List l);
/* I.S. l terdefinisi, mungkin kosong
   F.S. Mengembalikan address elemen positif pertama pada l,
        atau NIL jika tidak ada elemen positif */
```

---

### Soal A4 — `deleteNeg`

Buatlah prosedur `deleteNeg` yang menghapus semua elemen bernilai negatif (`< 0`) pada sebuah list of integer `l`. List `l` boleh kosong. Setiap elemen yang dihapus **harus didealokasi**.

```c
void deleteNeg(List *l);
/* I.S. l terdefinisi, mungkin kosong
   F.S. Semua elemen bernilai < 0 dihapus dari l dan didealokasi */
```

---

### Soal A5 — `copyPos`

Buatlah prosedur `copyPos` yang menyalin semua elemen bernilai positif (`> 0`) dari list `l1` menjadi list baru `l2`. Urutan elemen pada `l2` harus sama dengan urutan kemunculannya di `l1`.

```c
void copyPos(List l1, List *l2);
/* I.S. l1 terdefinisi, mungkin kosong
   F.S. l2 berisi salinan semua elemen > 0 dari l1, urutan tetap */
```

---

### Soal A6 — `sortedInsert`

Buatlah prosedur `sortedInsert` yang menambahkan sebuah elemen `x` pada list of integer `l` yang **sudah terurut menaik**, sehingga `l` tetap terurut menaik setelah penambahan.

```c
void sortedInsert(List *l, ElType x);
/* I.S. l terurut menaik, mungkin kosong
   F.S. x disisipkan pada posisi yang tepat sehingga l tetap terurut menaik */
```

---

### Soal A7 — `updateList`

Buatlah prosedur `updateList` yang mengganti elemen **pertama** pada list `l` yang bernilai `x` dengan `y`. Jika `x` tidak ada di `l`, maka `l` tidak berubah.

```c
void updateList(ElType x, ElType y, List *l);
/* I.S. l terdefinisi, x dan y terdefinisi
   F.S. Elemen pertama bernilai x diganti menjadi y;
        jika x tidak ada, l tetap */
```

---

## Bagian B — Variasi List Linier

### Soal B1 — `insertFirst` pada List dengan First & Last

Buatlah prosedur `insertFirst` untuk list `l` yang mencatat elemen pertama (`First`) dan elemen terakhir (`Last`). List `l` mungkin kosong.

```c
/* Deklarasi:
   typedef struct { Address first; Address last; } List; */

void insertFirst(List *l, ElType x);
/* I.S. l terdefinisi, mungkin kosong
   F.S. x ditambahkan sebagai elemen pertama l;
        First dan Last diperbarui dengan benar */
```

---

### Soal B2 — `insertLast` pada List dengan First & Last

Buatlah prosedur `insertLast` untuk list `l` yang mencatat elemen pertama (`First`) dan elemen terakhir (`Last`). List `l` mungkin kosong.

```c
void insertLast(List *l, ElType x);
/* I.S. l terdefinisi, mungkin kosong
   F.S. x ditambahkan sebagai elemen terakhir l;
        First dan Last diperbarui dengan benar */
```

---

### Soal B3 — `search` pada List dengan Dummy di Akhir

Buatlah fungsi `search` untuk mengetahui apakah nilai `x` terdapat dalam list `l`. List `l` mencatat `First` dan `Last`, dan elemen terakhir adalah **dummy** (sentinel). List `l` mungkin kosong.

```c
/* Definisi list:
   - List kosong: First(l) = Last(l) = dummy@
   - Elemen terakhir nyata: Next(P) = dummy@ */

boolean search(List l, ElType x);
/* I.S. l terdefinisi, mungkin kosong
   F.S. Mengembalikan true jika x ditemukan di l (bukan di dummy),
        false jika tidak ditemukan */
```

---

## Bagian C — List Sirkuler

Gunakan deklarasi berikut:

```c
typedef struct { Address first; } List;
#define FIRST(l) ((l).first)
```

---

### Soal C1 — `deleteFirst` pada List Sirkuler

Buatlah prosedur `deleteFirst` pada list sirkuler. Perhatikan kasus list dengan satu elemen dan list dengan lebih dari satu elemen.

```c
void deleteFirst(List *l, ElType *x);
/* I.S. l tidak kosong
   F.S. x adalah nilai elemen pertama sebelum penghapusan;
        elemen pertama dihapus dan didealokasi;
        sifat sirkuler list tetap terjaga */
```

---

### Soal C2 — `deleteLast` pada List Sirkuler

Buatlah prosedur `deleteLast` pada list sirkuler. Elemen terakhir adalah node `p` di mana `Next(p) = First(l)`.

```c
void deleteLast(List *l, ElType *x);
/* I.S. l tidak kosong
   F.S. x adalah nilai elemen terakhir sebelum penghapusan;
        elemen terakhir dihapus dan didealokasi;
        sifat sirkuler list tetap terjaga */
```

---

### Soal C3 — `displayList` pada List Sirkuler

Buatlah prosedur `displayList` yang mencetak semua nilai elemen list sirkuler. Jika list kosong, cetak `"List Kosong"`.

```c
void displayList(List l);
/* I.S. l mungkin kosong
   F.S. Semua nilai info elemen list dicetak;
        jika kosong, mencetak "List Kosong" */
```

---

## Bagian D — List dengan Pointer Ganda (Doubly Linked List)

Gunakan deklarasi berikut:

```c
typedef struct node {
    ElType  info;
    Address prev;
    Address next;
} Node;

typedef struct { Address first; Address last; } List;

#define INFO(p)  (p)->info
#define PREV(p)  (p)->prev
#define NEXT(p)  (p)->next
#define FIRST(l) ((l).first)
#define LAST(l)  ((l).last)
```

---

### Soal D1 — `insertFirst` pada DLL

Buatlah prosedur `insertFirst` pada doubly linked list yang mencatat `First` dan `Last`. Pastikan semua pointer `prev` dan `next` diperbarui dengan benar.

```c
void insertFirst(List *l, ElType x);
/* I.S. l terdefinisi, mungkin kosong
   F.S. x ditambahkan sebagai elemen pertama;
        semua pointer prev dan next diperbarui */
```

---

### Soal D2 — `insertLast` pada DLL

Buatlah prosedur `insertLast` pada doubly linked list yang mencatat `First` dan `Last`.

```c
void insertLast(List *l, ElType x);
/* I.S. l terdefinisi, mungkin kosong
   F.S. x ditambahkan sebagai elemen terakhir;
        semua pointer prev dan next diperbarui */
```

---

### Soal D3 — `deleteFirst` pada DLL

Buatlah prosedur `deleteFirst` pada doubly linked list. Perhatikan kasus list dengan satu elemen.

```c
void deleteFirst(List *l, ElType *x);
/* I.S. l tidak kosong
   F.S. x adalah nilai elemen pertama sebelum penghapusan;
        elemen pertama dihapus dan didealokasi;
        pointer prev elemen kedua (jika ada) diperbarui */
```

---

### Soal D4 — `deleteLast` pada DLL

Buatlah prosedur `deleteLast` pada doubly linked list. Keuntungan DLL: tidak perlu traversal untuk menemukan predesesor.

```c
void deleteLast(List *l, ElType *x);
/* I.S. l tidak kosong
   F.S. x adalah nilai elemen terakhir sebelum penghapusan;
        elemen terakhir dihapus dan didealokasi;
        pointer next elemen kedua dari akhir diperbarui */
```

---

## Bagian E — Stack dan Queue dengan Struktur Berkait

### Soal E1 — Evaluasi Ekspresi dengan Stack

Diberikan sebuah ekspresi postfix (Reverse Polish Notation) dalam bentuk string, misalnya `"3 4 + 5 *"` yang berarti `(3 + 4) * 5 = 35`.

Buatlah fungsi `evalPostfix` yang mengevaluasi ekspresi postfix menggunakan **stack berbasis linked list**.

```c
int evalPostfix(char *expr);
/* I.S. expr adalah string ekspresi postfix yang valid,
        token dipisahkan spasi, operand adalah integer,
        operator adalah salah satu dari: +, -, *, /
   F.S. Mengembalikan hasil evaluasi ekspresi */
```

> **Petunjuk:** Baca token satu per satu. Jika token adalah angka, push ke stack. Jika token adalah operator, pop dua elemen, hitung, lalu push hasilnya kembali.

---

### Soal E2 — `enqueue` Priority Queue

Implementasikan prosedur `enqueue` pada **priority queue** berbasis linked list. Elemen dengan nilai `prio` **lebih kecil** memiliki prioritas lebih tinggi (berada lebih dekat ke HEAD). Jika dua elemen memiliki prioritas sama, elemen yang lebih dulu masuk berada lebih dekat ke HEAD.

```c
/* Deklarasi:
   typedef struct tNode { ElType info; int prio; Address next; } Node;
   typedef struct { Address addrHead; } PrioQueue; */

void enqueue(PrioQueue *q, ElType x, int pr);
/* I.S. q mungkin kosong
   F.S. Node baru (info=x, prio=pr) disisipkan pada posisi yang tepat
        sehingga queue tetap terurut berdasarkan prioritas */
```

---

### Soal E3 — `dequeue` Priority Queue

Implementasikan prosedur `dequeue` pada priority queue. Elemen yang dihapus adalah elemen di HEAD (prioritas tertinggi).

```c
void dequeue(PrioQueue *q, ElType *x, int *pr);
/* I.S. q tidak kosong
   F.S. x adalah info HEAD sebelum penghapusan,
        pr adalah prio HEAD sebelum penghapusan;
        HEAD dihapus dan didealokasi */
```

---

## Bagian F — Soal Analisis dan Pemahaman

### Soal F1

Perhatikan potongan kode berikut pada list sirkuler:

```c
Address pt = FIRST(l);
while ((NEXT(pt) != FIRST(l)) && (pt != p)) {
    pt = NEXT(pt);
}
return (pt == p);
```

a. Fungsi apa yang diimplementasikan kode di atas?  
b. Apa yang terjadi jika list hanya memiliki satu elemen?  
c. Mengapa kondisi `NEXT(pt) != FIRST(l)` diperiksa sebelum `pt != p`?

---

### Soal F2

Bandingkan kompleksitas waktu operasi `deleteLast` pada:

| Struktur | Kompleksitas `deleteLast` | Alasan |
|---|---|---|
| Singly Linked List (hanya First) | ? | ? |
| Singly Linked List (First + Last) | ? | ? |
| Doubly Linked List (First + Last) | ? | ? |

Isi tabel di atas dan jelaskan masing-masing.

---

### Soal F3

Jelaskan mengapa proses rekursif lebih cocok menggunakan **representasi implisit** dibandingkan **representasi eksplisit** pada list linier berkait. Berikan contoh masalah tipe yang muncul jika menggunakan representasi eksplisit.

---

### Soal F4

Pada implementasi **array of Node**, disebutkan bahwa indeks-indeks kosong membentuk sebuah **stack**.

a. Jelaskan mengapa demikian — operasi apa pada manajemen indeks kosong yang menyerupai push dan pop?  
b. Apa keuntungan menggunakan array of Node dibandingkan alokasi pointer satu per satu?  
c. Apa keterbatasan array of Node yang tidak dimiliki struktur berkait dengan pointer?

---

### Soal F5

Diberikan list dengan dummy element di akhir dan pencatatan `Last`. Pada fungsi `indexOf` dengan sentinel:

```c
INFO(LAST(l)) = x;   /* letakkan x di sentinel */
p = FIRST(l);
idx = 0;
while (INFO(p) != x) {
    p = NEXT(p);
    idx++;
}
if (p != LAST(l)) return idx;
else               return IDX_UNDEF;
```

a. Apa kegunaan menyimpan `x` ke dalam node dummy sebelum melakukan pencarian?  
b. Apa yang terjadi jika teknik sentinel ini **tidak** digunakan? Bagaimana bentuk loop-nya?  
c. Apakah teknik ini bisa diterapkan pada list sirkuler? Jelaskan.