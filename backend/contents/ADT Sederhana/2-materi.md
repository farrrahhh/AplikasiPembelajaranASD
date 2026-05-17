# ADT dalam Bahasa C

**ADT (Abstract Data Type)** adalah tipe data yang didefinisikan berdasarkan data yang disimpan dan operasi yang bisa dilakukan terhadap data tersebut.

Dalam bahasa C, ADT diimplementasikan menggunakan modul program yang terdiri dari file header `.h` dan file implementasi `.c`.

---

## Komponen ADT dalam Bahasa C

Setiap ADT biasanya memiliki komponen-komponen berikut:

```
Konstruktor  → membentuk/menginisialisasi data
Selektor     → mengakses atau mengubah komponen data
Predikat     → mengecek kondisi data
Operasi I/O  → membaca dan menampilkan data
Operasi lain → fungsi tambahan terhadap data
```

---

## Contoh ADT: POINT

ADT `POINT` merepresentasikan sebuah titik dalam bidang dua dimensi.

### Definisi dalam Notasi Algoritmik

```
type Point: < x: real,   { absis }
              y: real >  { ordinat }
```

### Konstruktor

```
procedure CreatePoint(output p: Point, input x: real, input y: real)
{ membentuk sebuah Point p dari x dan y }
```

### Selektor

```
function getAbsis (p: Point) → real
{ mengirimkan komponen absis dari p }

function getOrdinat (p: Point) → real
{ mengirimkan komponen ordinat dari p }

procedure setAbsis (input/output p: Point, input newX: real)
{ mengubah nilai komponen absis dari p menjadi newX }

procedure setOrdinat (input/output p: Point, input newY: real)
{ mengubah nilai komponen ordinat dari p menjadi newY }
```

### Operasi Lain

```
function move (p1: Point, dx, dy: real) → Point
{ menghasilkan Point hasil penggeseran p1 sebesar dx dan dy }
```

### Predikat

```
function isOrigin (p: Point) → boolean
{ mengirimkan true jika p adalah titik origin <0,0> }
```

### Operasi I/O

```
procedure readPoint (output p: Point)
{ membentuk p dari x dan y yang dibaca }

procedure displayPoint (input p: Point)
{ menampilkan nilai p dalam format "(x,y)" }
```

---

## Catatan Khusus: Selektor ADT dalam Bahasa C

Selektor `get*` dan `set*` pada bahasa C dapat diganti dengan C preprocessor/macro berparameter.

Notasi algoritmik:

```
function getAbsis (p: Point) → real
function getOrdinat (p: Point) → real
procedure setAbsis (input/output p: Point, input newX: real)
procedure setOrdinat (input/output p: Point, input newY: real)
```

Dalam bahasa C, cukup ditulis:

```c
#define ABSIS(p)   (p).x
#define ORDINAT(p) (p).y
```

Kelebihan menggunakan macro:

```
Lebih ringkas
Tidak ada overhead pemanggilan fungsi
Akses langsung ke field struct
```

---

## Implementasi ADT POINT dalam Bahasa C

ADT POINT dibagi menjadi beberapa file.

Struktur file:

```
project/
├── boolean.h
├── point.h
├── point.c
└── main_point.c
```

---

## Type Boolean dalam Bahasa C

Bahasa C tidak memiliki tipe boolean bawaan. Kita mendefinisikannya secara manual.

File `boolean.h`:

```c
/* File: boolean.h */
/* Definisi type boolean */

#ifndef BOOLEAN_H
#define BOOLEAN_H

#define boolean unsigned char
#define TRUE    1
#define FALSE   0

#endif
```

File ini perlu diinclude di setiap file yang membutuhkan tipe `boolean`.

---

## File Header: `point.h`

File `.h` berisi definisi tipe dan deklarasi fungsi/prosedur.

```c
#ifndef POINT_H
#define POINT_H

#include "boolean.h"

/**** Definisi Abstract Data Type POINT ****/
typedef struct Point {
    float x; /* absis  */
    float y; /* ordinat */
} point;

/**** Selektor point ****/
#define ABSIS(p)   (p).x
#define ORDINAT(p) (p).y

/**** Konstruktor POINT ****/
void CreatePoint (point *p, float x, float y);
/* Membentuk sebuah point dari x dan y */

/**** Predikat ****/
boolean isOrigin (point p);
/* Mengirimkan nilai benar jika p adalah titik origin <0,0> */

/**** Prosedur - Interaksi dengan I/O device ****/
void readPoint    (point *p);
/* Membentuk p dari x dan y yang dibaca dari keyboard */

void displayPoint (point p);
/* Nilai p ditulis ke layar dengan format "(X,Y)" */

/**** Fungsi/Operasi lain terhadap point ****/
point move (point p, float dx, float dy);
/* Menghasilkan point hasil penggeseran p sebesar dx dan dy */

#endif
```

Catatan penting:

```
#ifndef dan #define di awal   → mencegah file diinclude lebih dari sekali
#include "boolean.h"          → agar tipe boolean dikenali
#define ABSIS(p) (p).x        → macro selektor menggantikan fungsi get/set
```

---

## File Implementasi: `point.c`

File `.c` berisi implementasi dari setiap fungsi dan prosedur yang dideklarasikan di `.h`.

```c
#include <stdio.h>
#include "point.h"
```

### Konstruktor

```c
void CreatePoint (point *p, float x, float y) {
    /* Membentuk sebuah point p dari x dan y */
    /* ALGORITMA */
    ABSIS(*p)   = x;
    ORDINAT(*p) = y;
}
```

Contoh penggunaan selektor:

```
ABSIS(*p) = x;
```

Sama artinya dengan:

```
(*p).x = x;
```

---

### Predikat

```c
boolean isOrigin (point p) {
    /* Mengirimkan nilai benar jika p adalah titik origin <0,0> */
    /* ALGORITMA */
    return ((ABSIS(p) == 0) && (ORDINAT(p) == 0));
}
```

Cara yang lebih baik menggunakan ekspresi langsung:

```c
return ((ABSIS(p) == 0) && (ORDINAT(p) == 0));
```

Hindari cara berikut karena tidak perlu:

```c
if ((ABSIS(p) == 0) && (ORDINAT(p) == 0)) {
    return true;
} else {
    return false;
}
```

---

### Operasi I/O

Prosedur `readPoint`:

```c
void readPoint (point *p) {
    /* Membentuk p dari x dan y yang dibaca dari keyboard */
    /* KAMUS */
    float x, y;
    /* ALGORITMA */
    scanf("%f %f", &x, &y);
    CreatePoint(p, x, y);
}
```

Prosedur `displayPoint`:

```c
void displayPoint (point p) {
    /* Nilai p ditulis ke layar dengan format "(X,Y)" */
    /* ALGORITMA */
    printf("(%.2f,%.2f)", ABSIS(p), ORDINAT(p));
}
```

---

### Operasi Lain

Fungsi `move`:

```c
point move (point p, float dx, float dy) {
    /* Menghasilkan point hasil penggeseran p sebesar dx dan dy */
    /* KAMUS */
    point pt;
    /* ALGORITMA */
    CreatePoint(&pt, ABSIS(p) + dx, ORDINAT(p) + dy);
    return (pt);
}
```

Penjelasan:

```
ABSIS(p) + dx    → absis baru = absis lama + pergeseran x
ORDINAT(p) + dy  → ordinat baru = ordinat lama + pergeseran y
```

---

## File Program Utama: `main_point.c`

File `main.c` berisi program utama yang menggunakan ADT.

```c
#include <stdio.h>
#include "point.h"

int main () {
    /* KAMUS */
    point p, p1;
    float dx, dy;

    /* ALGORITMA */

    /* Test Baca dan Tulis */
    printf("Masukkan nilai absis dan ordinat: ");
    readPoint(&p);
    printf("Titik yang dibaca ");
    displayPoint(p);

    /* Test isOrigin */
    if (isOrigin(p)) {
        printf(" adalah titik origin");
    }
    printf("\n");

    /* Test geser */
    printf("Geser sejajar sumbu x sebesar = ");
    scanf("%f", &dx);
    printf("Geser sejajar sumbu y sebesar = ");
    scanf("%f", &dy);
    printf("Setelah digeser = ");
    displayPoint(move(p, dx, dy));
    printf("\n");

    return 0;
}
```

---

## Cara Kompilasi

Untuk mengkompilasi program dengan beberapa file:

```bash
gcc main_point.c point.c -o main_point
```

Atau menggunakan Makefile:

```makefile
all: main_point

main_point: main_point.c point.c point.h boolean.h
    gcc main_point.c point.c -o main_point

clean:
    rm -f main_point
```

---

## Ringkasan Alur Implementasi ADT

```
1. Tentukan data dan operasi ADT
        ↓
2. Tulis notasi algoritmik
        ↓
3. Buat file .h (deklarasi tipe, macro, prototype)
        ↓
4. Buat file .c (implementasi fungsi dan prosedur)
        ↓
5. Buat file main.c (program pengguna ADT)
        ↓
6. Kompilasi semua file bersama
```

---

## Perbandingan Notasi Algoritmik vs Bahasa C

| Notasi Algoritmik | Bahasa C |
| --- | --- |
| `type Point: <x: real, y: real>` | `typedef struct Point { float x; float y; } point;` |
| `function getAbsis(p) → real` | `#define ABSIS(p) (p).x` |
| `procedure setAbsis(p, newX)` | `ABSIS(p) = newX;` |
| `procedure CreatePoint(p, x, y)` | `void CreatePoint(point *p, float x, float y)` |
| `function isOrigin(p) → boolean` | `boolean isOrigin(point p)` |
| `procedure readPoint(p)` | `void readPoint(point *p)` |
| `procedure displayPoint(p)` | `void displayPoint(point p)` |
| `function move(p, dx, dy) → Point` | `point move(point p, float dx, float dy)` |

---

## Tips Implementasi ADT

Gunakan macro untuk selektor:

```
Lebih efisien dari pemanggilan fungsi
Kode lebih mudah dibaca
Akses field struct tetap terkontrol melalui nama yang bermakna
```

Selalu gunakan include guard:

```c
#ifndef NAMA_FILE_H
#define NAMA_FILE_H

/* isi file */

#endif
```

Gunakan konstruktor untuk menginisialisasi data:

```
Jangan langsung mengakses field struct dari luar modul.
Gunakan selalu CreatePoint, bukan p.x = 3; p.y = 4;
```

Pisahkan file `.h` dan `.c`:

```
.h → antarmuka (apa yang bisa dilakukan)
.c → implementasi (bagaimana caranya)
```