

# Algoritma & Struktur Data

**Algoritma** adalah langkah-langkah terurut untuk menyelesaikan masalah.

**Struktur data** adalah cara menyimpan dan mengatur data agar mudah digunakan oleh program.

Sederhananya:

```
Algoritma + Struktur Data = Program
```

Contoh:

```
Masalah:
Mencari nilai terbesar dari 5 angka.

Algoritma:
1. Ambil angka pertama sebagai nilai terbesar sementara.
2. Bandingkan dengan angka kedua.
3. Jika angka kedua lebih besar, jadikan angka kedua sebagai nilai terbesar.
4. Ulangi sampai semua angka dicek.
5. Tampilkan nilai terbesar.
```

---

## Paradigma Prosedural

Paradigma prosedural adalah cara membuat program berdasarkan urutan instruksi, fungsi, dan prosedur.

Contoh alur program prosedural:

```
Input data
↓
Proses data
↓
Output hasil
```

Dalam paradigma prosedural, program biasanya dibagi menjadi:

```
Program utama
Fungsi
Prosedur
```

Contoh fungsi dalam C:

```c
int square(int x) {
    return x * x;
}
```

Contoh prosedur dalam C:

```c
void printHello() {
    printf("Hello");
}
```

Perbedaan utama:

| Konsep | Mengembalikan Nilai? | Contoh |
| --- | --- | --- |
| Fungsi | Ya | `square()` |
| Prosedur | Tidak | `printHello()` |

---

## Abstract Data Type atau ADT

**ADT** adalah tipe data yang didefinisikan berdasarkan data yang disimpan dan operasi yang bisa dilakukan.

ADT tidak hanya memikirkan “datanya apa”, tetapi juga “operasinya apa”.

Contoh ADT `Time`:

```
Data:
- hours
- minutes
- seconds

Operasi:
- CreateTime
- getHours
- getMinutes
- getSeconds
- difference
```

Ilustrasi:

```
+----------------------+
|       ADT Time       |
+----------------------+
| Data                 |
| - hours              |
| - minutes            |
| - seconds            |
+----------------------+
| Operasi              |
| - CreateTime         |
| - getHours           |
| - difference         |
+----------------------+
```

Contoh penggunaan ADT:

```
CreateTime(t1, 13, 45, 0)
CreateTime(t2, 14, 30, 0)

difference(t1, t2)
```

Dengan ADT, kita tidak perlu menulis ulang detail perhitungan setiap kali memakai data waktu.

---

## Kenapa ADT Penting?

Tanpa ADT:

```
h1 ← 13
m1 ← 45
s1 ← 0

h2 ← 14
m2 ← 30
s2 ← 0

ss1 ← h1*3600 + m1*60 + s1
ss2 ← h2*3600 + m2*60 + s2

selisih ← ss2 - ss1
```

Dengan ADT:

```
CreateTime(t1, 13, 45, 0)
CreateTime(t2, 14, 30, 0)

selisih ← difference(t1, t2)
```

ADT membuat program:

```
Lebih rapi
Lebih mudah digunakan ulang
Lebih mudah diuji
Lebih aman dari kesalahan logika
```

---

## Struktur Data Dasar

### Record atau Tuple

Record adalah struktur data yang berisi beberapa nilai dengan nama tertentu.

Contoh:

```
Point = <x, y>
Time = <hours, minutes, seconds>
```

Dalam C:

```c
typedef struct Point {
    int x;
    int y;
} point;
```

Ilustrasi:

```
Point
+-----+-----+
|  x  |  y  |
+-----+-----+
```

Cocok untuk data yang terdiri dari beberapa atribut.

Contoh:

```
Mahasiswa:
- nama
- nim
- jurusan
```

---

### Array

Array adalah kumpulan data bertipe sama yang disimpan berurutan.

Contoh:

```c
int angka[5] = {10, 20, 30, 40, 50};
```

Ilustrasi:

```
Index:   0    1    2    3    4
Value:  10   20   30   40   50
```

Kelebihan array:

```
Akses data cepat menggunakan indeks.
```

Kekurangan array:

```
Ukuran biasanya tetap.
Menambah atau menghapus elemen di tengah perlu menggeser elemen lain.
```

Contoh akses:

```c
printf("%d", angka[0]);
```

Output:

```
10
```

---

### Struktur Berkait atau Linked Structure

Struktur berkait menyimpan data dalam bentuk node.

Setiap node biasanya memiliki:

```
Data
Pointer ke node berikutnya
```

Ilustrasi:

```
+------+-------+     +------+-------+     +------+------+
|  10  | next  | --> |  20  | next  | --> |  30  | NULL |
+------+-------+     +------+-------+     +------+------+
```

Kelebihan:

```
Mudah menambah dan menghapus elemen di tengah.
```

Kekurangan:

```
Tidak bisa langsung mengakses elemen tertentu seperti array.
Harus menelusuri dari node awal.
```

---

## ADT Umum yang Sering Dipakai

| ADT | Konsep | Contoh Penggunaan |
| --- | --- | --- |
| List | Data berurutan | Daftar mahasiswa |
| Matrix | Data 2 dimensi | Tabel, grid |
| Stack | Last In First Out | Undo, call stack |
| Queue | First In First Out | Antrian printer |
| Set | Kumpulan elemen unik | ID unik |
| Map | Key-value | Kamus, dictionary |
| Tree | Data hierarkis | Folder file |
| Binary Search Tree | Tree untuk pencarian | Data terurut |
| Graph | Node dan edge | Peta jalan, social network |

---

## Stack

Stack adalah struktur data dengan prinsip:

```
Last In, First Out
```

Artinya, data yang terakhir masuk akan keluar lebih dulu.

Ilustrasi:

```
Push 10
Push 20
Push 30

Stack:
+----+
| 30 | ← keluar duluan
+----+
| 20 |
+----+
| 10 |
+----+
```

Operasi umum:

```
push   → menambah data
pop    → mengambil data paling atas
top    → melihat data paling atas
isEmpty → mengecek apakah stack kosong
```

Contoh penggunaan stack:

```
Undo di text editor
Riwayat browser
Call stack dalam program
```

---

## Queue

Queue adalah struktur data dengan prinsip:

```
First In, First Out
```

Artinya, data yang masuk pertama akan keluar pertama.

Ilustrasi:

```
Masuk dari belakang
        ↓
[10] [20] [30]
 ↑
Keluar dari depan
```

Operasi umum:

```
enqueue → menambah data ke belakang
dequeue → mengambil data dari depan
front   → melihat data paling depan
isEmpty → mengecek apakah queue kosong
```

Contoh penggunaan queue:

```
Antrian printer
Antrian customer service
Task scheduler
```

---

## Tree

Tree adalah struktur data hierarkis.

Tree memiliki:

```
Root
Node
Child
Parent
Leaf
```

Ilustrasi:

```
        A
       / \
      B   C
     / \
    D   E
```

Penjelasan:

```
A adalah root.
B dan C adalah child dari A.
D dan E adalah child dari B.
C, D, dan E adalah leaf karena tidak punya child.
```

Contoh penggunaan tree:

```
Struktur folder
HTML DOM
Struktur organisasi
```

---

## Binary Tree dan Binary Search Tree

**Binary Tree** adalah tree yang setiap node memiliki maksimal dua child.

```
        8
       / \
      3   10
```

**Binary Search Tree** adalah binary tree dengan aturan:

```
Nilai kiri < root
Nilai kanan > root
```

Contoh:

```
        8
       / \
      3   10
     / \    \
    1   6    14
```

BST berguna untuk pencarian data karena pencarian bisa diarahkan ke kiri atau kanan.

---

## Graph

Graph adalah struktur data yang terdiri dari:

```
Vertex atau node
Edge atau hubungan antar node
```

Ilustrasi:

```
A ----- B
|       |
|       |
C ----- D
```

Contoh penggunaan graph:

```
Peta jalan
Social network
Jaringan komputer
Relasi antar kota
```

Jika ada arah, disebut directed graph:

```
A → B → C
```

Jika tidak ada arah, disebut undirected graph:

```
A — B — C
```

---

## Notasi Algoritmik

Notasi algoritmik adalah cara menulis algoritma tanpa bergantung pada bahasa pemrograman tertentu.

Struktur umum:

```
Program NamaProgram
{ Spesifikasi program }

KAMUS
{ Deklarasi variabel }

ALGORITMA
{ Langkah-langkah penyelesaian }
```

Contoh:

```
Program Penjumlahan
{ Menghitung hasil penjumlahan a dan b }

KAMUS
a, b, hasil: integer

ALGORITMA
input(a)
input(b)
hasil ← a + b
output(hasil)
```

---

## Translasi Notasi Algoritmik ke C

Notasi algoritmik:

```
input(nilai)
nilai ← nilai + 10
output(nilai)
```

Bahasa C:

```c
scanf("%d", &nilai);
nilai = nilai + 10;
printf("%d", nilai);
```

Perbandingan:

| Notasi Algoritmik | Bahasa C |
| --- | --- |
| `input(x)` | `scanf("%d", &x);` |
| `output(x)` | `printf("%d", x);` |
| `x ← 5` | `x = 5;` |
| `x ← x + 1` | `x = x + 1;` atau `x++;` |

---

## Dasar Bahasa C

### Variabel dan Konstanta

Variabel digunakan untuk menyimpan nilai.

```c
int umur;
float nilai;
char huruf;
```

Konstanta digunakan untuk nilai tetap.

```c
const float PI = 3.14;
```

Atau:

```c
#define PI 3.14
```

---

### Tipe Data Dasar

| Tipe | Fungsi | Contoh |
| --- | --- | --- |
| `int` | Bilangan bulat | `10` |
| `float` | Bilangan desimal | `3.14` |
| `double` | Desimal lebih presisi | `3.14159` |
| `char` | Karakter | `'A'` |
| `char[]` | String | `"Halo"` |

---

### Assignment

Assignment berarti memberi nilai ke variabel.

```c
x = 10;
x = x + 5;
x += 5;
x++;
```

Contoh:

```c
int x = 10;
x = x + 5;

printf("%d", x);
```

Output:

```
15
```

---

### Input dan Output

Input menggunakan `scanf`.

```c
int x;
scanf("%d", &x);
```

Output menggunakan `printf`.

```c
printf("%d", x);
```

Format umum:

| Format | Tipe |
| --- | --- |
| `%d` | integer |
| `%f` | float |
| `%c` | char |
| `%s` | string |

---

### Percabangan

Percabangan digunakan ketika program harus memilih aksi berdasarkan kondisi.

### If

```c
if (nilai >= 75) {
    printf("Lulus");
}
```

### If Else

```c
if (nilai >= 75) {
    printf("Lulus");
} else {
    printf("Tidak lulus");
}
```

### Else If

```c
if (nilai >= 85) {
    printf("A");
} else if (nilai >= 75) {
    printf("B");
} else {
    printf("C");
}
```

### Switch

```c
switch (hari) {
    case 1:
        printf("Senin");
        break;
    case 2:
        printf("Selasa");
        break;
    default:
        printf("Hari tidak valid");
        break;
}
```

---

### Pengulangan

Pengulangan digunakan untuk menjalankan aksi berkali-kali.

### While

```c
while (kondisi) {
    aksi;
}
```

Contoh:

```c
int i = 1;

while (i <= 5) {
    printf("%d\n", i);
    i++;
}
```

---

### Do While

```c
do {
    aksi;
} while (kondisi);
```

`do while` menjalankan aksi minimal satu kali.

---

### For

```c
for (int i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
```

Output:

```
1
2
3
4
5
```

---

### Fungsi dan Prosedur di C

### Fungsi

Fungsi mengembalikan nilai.

```c
int tambah(int a, int b) {
    return a + b;
}
```

Pemanggilan:

```c
int hasil = tambah(3, 4);
printf("%d", hasil);
```

Output:

```
7
```

---

### Prosedur

Prosedur tidak mengembalikan nilai.

```c
void cetakHalo() {
    printf("Halo");
}
```

Pemanggilan:

```c
cetakHalo();
```

---

### Pointer Singkat untuk Prosedur

Pointer menyimpan alamat memori.

Dalam prosedur, pointer sering digunakan agar fungsi bisa mengubah nilai asli variabel.

Contoh:

```c
void tambahSatu(int *x) {
    *x = *x + 1;
}
```

Pemanggilan:

```c
int angka = 5;
tambahSatu(&angka);

printf("%d", angka);
```

Output:

```
6
```

Penjelasan:

```
&angka  → alamat dari angka
*x      → nilai yang ada di alamat tersebut
```

---

## Modularitas Program C

Program yang besar sebaiknya dibagi menjadi beberapa file.

Struktur sederhana:

```
project/
├── src/
│   ├── time.h
│   ├── time.c
│   └── main.c
└── tests/
    └── check_time.c
```

### File `.h`

Berisi deklarasi tipe dan prototype fungsi.

```c
#ifndef TIME_H
#define TIME_H

typedef struct Time {
    int hours;
    int minutes;
    int seconds;
} time;

void CreateTime(time *t, int h, int m, int s);
int difference(time start, time end);

#endif
```

### File `.c`

Berisi implementasi fungsi.

```c
#include "time.h"

void CreateTime(time *t, int h, int m, int s) {
    t->hours = h;
    t->minutes = m;
    t->seconds = s;
}
```

### File `main.c`

Berisi program utama.

```c
#include <stdio.h>
#include "time.h"

int main() {
    time t;

    CreateTime(&t, 10, 30, 0);

    return 0;
}
```

