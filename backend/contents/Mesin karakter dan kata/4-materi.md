# Mesin Karakter dan Mesin Kata
---

## Mesin Abstrak

**Mesin** adalah mekanisme yang terdefinisi dan mampu mengeksekusi aksi-aksi primitif yang terdefinisi untuknya.

**Mesin abstrak** adalah mesin yang *dianggap ada* dan diasumsikan mampu melakukan mekanisme yang didefinisikan. Mesin abstrak memodelkan suatu semesta (*universe*) tertentu.

Mesin abstrak mendefinisikan:

```
Sekumpulan state yang mungkin
Sekumpulan aksi primitif yang dapat dimengerti dan dieksekusi mesin tersebut
```

Contoh mesin abstrak:

```
mesin gambar
mesin integer
mesin rekam
mesin karakter
```

---

## Mesin Karakter

### Komponen Mesin Karakter

Mesin karakter terdiri atas:

- **Pita** berisi deret karakter, diakhiri dengan MARK berupa `'.'` (titik). Pita yang hanya berisi MARK disebut **pita kosong**.
- **Tombol** `start` dan `adv`
- **Jendela** berukuran satu karakter → **CC** (*Current Character*): karakter yang sedang tampak di jendela
- **Lampu EOP** (*End of Pita*)

State mesin karakter ditentukan oleh **CC** dan **EOP**.

```
Ilustrasi pita:
Index:  I  T  B  A  D  A  D  I  .
                   ↑
                   CC = 'D', EOP tidak menyala

Ketika CC = '.', lampu EOP menyala.
```

EOP diwakili oleh boolean: `true` jika menyala, `false` jika tidak. Jika EOP menyala, mesin sudah tidak dapat dioperasikan lagi.

### Primitif Mesin Karakter

```
procedure start
{ Mesin siap dioperasikan. Pita disiapkan untuk dibaca.
  I.S.: sembarang
  F.S.: cc adalah karakter pertama pada pita
        Jika cc ≠ MARK maka eop = false
        Jika cc = MARK maka eop = true }

procedure adv
{ Pita dimajukan satu karakter.
  I.S.: Karakter pada jendela = cc, cc ≠ MARK
  F.S.: cc adalah karakter berikutnya dari cc yang lama,
        cc mungkin = MARK
        Jika cc = MARK maka eop = true }
```

### Implementasi di C

**mesinkar.h**:

```c
#ifndef __MESIN_KAR__
#define __MESIN_KAR__

#include "boolean.h"
#define MARK '.'

/* State Mesin */
extern char cc;
extern boolean eop;

void start();
void adv();

#endif
```

**mesinkar.c**:

```c
#include <stdio.h>
#include "mesinkar.h"

char cc;
boolean eop;
static FILE *pita;

void start() {
    pita = fopen("pitakar.txt", "r");
    adv();
}

void adv() {
    fscanf(pita, "%c", &cc);
    eop = (cc == MARK);
    if (eop) {
        fclose(pita);
    }
}
```

---

## Studi Kasus Mesin Karakter

### CountCharacters – Menghitung Banyak Huruf

```
Program CountCharacters
{ Menghitung banyaknya huruf pada pita karakter }

KAMUS
    ctr: integer

ALGORITMA
    ctr ← 0             { Inisialisasi }
    start               { First Elmt }
    while (cc ≠ MARK) do
        ctr ← ctr + 1   { Proses }
        adv             { Next Elmt }
    { cc = MARK }
    output(ctr)         { Terminasi }
```

### CountA – Menghitung Huruf 'A'

```
Program CountA
{ Menghitung banyaknya huruf 'A' pada pita karakter }

KAMUS
    ctr: integer

ALGORITMA
    ctr ← 0
    start
    while (cc ≠ MARK) do
        if cc = 'A' then
            ctr ← ctr + 1
        adv
    output(ctr)
```

### Latihan: Hitung-LE

Buatlah algoritma untuk menghitung banyaknya **pasangan huruf 'L' dan 'E'** yang ada pada pita. Banyaknya pasangan huruf 'L' dan 'E' pada pita kosong adalah nol.

---

## Mesin Kata

### Konsep Dasar

**Mesin Kata** adalah mesin abstrak yang bekerja memproses kata *berdasarkan mesin karakter*. Kata didefinisikan sebagai:

> sederetan karakter suksesif pada pita yang merupakan karakter **bukan blank**

**Definisi type Kata**:

```
type Kata: < buffer: array [0..N_MAX-1] of character,
             length: integer >
{ buffer adalah tempat penampung kata,
  length menyatakan panjang kata }
{ Kata kosong: K.length = 0 }
```

Dalam C:

```c
#define N_MAX 50
#define BLANK ' '

typedef struct {
    char buffer[N_MAX];
    int length;
} Kata;
```

### Model Akuisisi Kata

Ada tiga versi model akuisisi kata, tergantung bagaimana blank dan akhir pita ditangani:

| Versi | Penanda Akhir | Keterangan |
| --- | --- | --- |
| Versi 1 | `endKata = true` (boolean) | Akhir proses ditandai boolean `endKata` |
| Versi 2 | `currentKata.length = 0` | Akhir proses ditandai kata kosong |
| Versi 3 | `cc = MARK` langsung | Tanpa mark khusus, ada `initAkses` |

---

## Model Akuisisi Kata Versi 1

### State Mesin Kata Versi 1

```
endKata     : boolean  { penanda akhir akuisisi kata }
currentKata : Kata     { kata yang sudah diakuisisi dan akan diproses }
```

### Primitif Versi 1

```
procedure ignoreBlank
{ Mengabaikan satu atau beberapa BLANK }
{ I.S.: cc sembarang }
{ F.S.: cc ≠ BLANK atau cc = MARK }

procedure startKata
{ I.S.: cc sembarang }
{ F.S.: endKata = true dan cc = MARK;
        atau endKata = false, currentKata adalah kata yang sudah
        diakuisisi, cc = karakter pertama sesudah karakter terakhir kata }

procedure advKata
{ I.S.: cc = karakter pertama kata yang akan diakuisisi }
{ F.S.: currentKata = kata terakhir yang sudah diakuisisi,
        cc = karakter pertama sesudah karakter terakhir kata }

procedure salinKata
{ I.S.: cc = karakter pertama dari kata }
{ F.S.: currentKata berisi kata yang sudah diakuisisi;
        cc = BLANK atau cc = MARK }
```

### Algoritma Versi 1

**ignoreBlank**:

```
ALGORITMA
    while (cc = BLANK) do
        adv
    { cc ≠ BLANK }
```

**startKata**:

```
ALGORITMA
    start
    ignoreBlank
    if (cc = MARK) then
        endKata ← true
    else
        endKata ← false
        salinKata
```

**advKata**:

```
ALGORITMA
    ignoreBlank
    if (cc = MARK) then
        endKata ← true
    else
        salinKata
```

**salinKata**:

```
KAMUS LOKAL
    i: integer

ALGORITMA
    i ← 0
    repeat
        currentKata.buffer[i] ← cc
        adv
        i ← i + 1
    until (cc = MARK) or (cc = BLANK)
    currentKata.length ← i
```

### Implementasi di C (Versi 1)

**mesinkata1.c**:

```c
#include "mesinkata1.h"

boolean endKata;
Kata currentKata;

void ignoreBlank() {
    while (cc == BLANK) {
        adv();
    }
}

void startKata() {
    start();
    ignoreBlank();
    if (cc == MARK) {
        endKata = true;
    } else {
        endKata = false;
        salinKata();
    }
}

void advKata() {
    ignoreBlank();
    if (cc == MARK) {
        endKata = true;
    } else {
        salinKata();
    }
}

void salinKata() {
    int i = 0;
    while ((cc != MARK) && (cc != BLANK)) {
        currentKata.buffer[i] = cc;
        adv();
        i++;
    }
    currentKata.length = i;
}
```

**Pola penggunaan versi 1**:

```c
startKata();
while (!endKata) {
    /* proses currentKata */
    advKata();
}
```

---

## Model Akuisisi Kata Versi 2

Seperti versi 1, tetapi **akhir proses ditandai oleh kata kosong** (`currentKata.length = 0`), bukan boolean `endKata`.

### Perbedaan Utama

| Aspek | Versi 1 | Versi 2 |
| --- | --- | --- |
| Penanda akhir | `endKata = true` | `currentKata.length = 0` |
| State tambahan | `endKata: boolean` | tidak ada |

**startKata versi 2**:

```
ALGORITMA
    start
    ignoreBlank
    salinKata
{ salinKata langsung dipanggil; jika cc = MARK, length = 0 }
```

**advKata versi 2**:

```
ALGORITMA
    ignoreBlank
    salinKata
```

**Pola penggunaan versi 2**:

```
startKata
while currentKata.length ≠ 0 do
    { proses currentKata }
    advKata
```

---

## Model Akuisisi Kata Versi 3

Versi 3 mengabaikan BLANK pada **awal pita** kemudian memproses sisanya. Model ini disebut **akuisisi tanpa mark**, artinya kata yang diakuisisi tidak pernah kosong.

Versi ini mengharuskan adanya prosedur **`initAkses`** yang memposisikan `cc` pada karakter pertama kata pertama.

### Primitif Versi 3

```
procedure initAkses
{ Mengabaikan blank pada awal pita }
{ I.S.: cc sembarang }
{ F.S.: cc = MARK; atau cc = karakter pertama dari kata yang akan diakuisisi }

procedure advKata
{ I.S.: cc = karakter pertama kata yang akan diakuisisi }
{ F.S.: currentKata = kata terakhir yang sudah diakuisisi,
        cc = karakter pertama dari kata berikutnya, mungkin MARK }
```

**initAkses**:

```
ALGORITMA
    start
    ignoreBlank
```

**advKata versi 3**:

```
ALGORITMA
    salinKata
    ignoreBlank
```

**Pola penggunaan versi 3**:

```
initAkses
while cc ≠ MARK do
    advKata
    { proses currentKata }
```

### Perbandingan Tiga Versi

| | Versi 1 | Versi 2 | Versi 3 |
| --- | --- | --- | --- |
| Penanda akhir | `endKata` (boolean) | `length = 0` | `cc = MARK` |
| Prosedur inisialisasi | `startKata` | `startKata` | `initAkses` |
| Prosedur lanjut | `advKata` | `advKata` | `advKata` |
| Kata kosong mungkin? | Tidak | Ya (sebagai sentinel) | Tidak |

---

## Studi Kasus Mesin Kata

### Panjang Rata-Rata Kata

Hitung panjang rata-rata dari semua kata dalam pita. Jika pita kosong atau tidak mengandung kata (hanya blank dan titik), panjang rata-rata tidak terdefinisi.

**Menggunakan Versi 1**:

```
ALGORITMA
    lengthTotal ← 0
    nbKata ← 0
    startKata
    while not endKata do
        lengthTotal ← lengthTotal + currentKata.length
        nbKata ← nbKata + 1
        advKata
    if (nbKata ≠ 0) then
        output(lengthTotal / nbKata)
    else
        output("Pita tidak mengandung kata")
```

**Menggunakan Versi 3**:

```
ALGORITMA
    initAkses
    lengthTotal ← 0
    nbKata ← 0
    while cc ≠ MARK do
        advKata
        lengthTotal ← lengthTotal + currentKata.length
        nbKata ← nbKata + 1
    if (nbKata ≠ 0) then
        output(lengthTotal / nbKata)
    else
        output("Pita tidak mengandung kata")
```

### Hitung WHILE

Hitung berapa kali kata `'WHILE'` muncul dalam pita karakter.

Diperlukan fungsi pembantu:

```
function isKataEqual(k1, k2: Kata) → boolean
{ Menghasilkan true jika k1 = k2 }
```

**Algoritma (Versi 1)**:

```
ALGORITMA
    { Inisialisasi kataWHILE }
    kataWHILE.buffer[0] ← 'W'
    kataWHILE.buffer[1] ← 'H'
    kataWHILE.buffer[2] ← 'I'
    kataWHILE.buffer[3] ← 'L'
    kataWHILE.buffer[4] ← 'E'
    kataWHILE.length ← 5

    nWHILE ← 0
    startKata
    while not endKata do
        if isKataEqual(kataWHILE, currentKata) then
            nWHILE ← nWHILE + 1
        advKata
    output(nWHILE)
```

---

## Cara Kompilasi

```bash
# Cara 1: kompilasi terpisah lalu link
$ cc -c mesinkar.c
$ cc -c mesinkata1.c
$ cc -c mainkata.c
$ cc -o mainkata mesinkar.o mesinkata1.o mainkata.o

# Cara 2: kompilasi sekaligus
$ cc -o mainkata mesinkar.c mesinkata1.c mainkata.c
```

---

## Latihan Soal

### Soal 1: Frekuensi Kata Pertama

Dibaca sebuah pita karakter yang diakhiri titik. Hitunglah **frekuensi kemunculan kata pertama** dalam pita tersebut.

Contoh:

```
Input : "aku pergi ke pasar kemudian aku pulang ke rumah supaya aku dapat mandi."
Output: frekuensi 'aku' = 3/13
```

Jika pita kosong, tampilkan pesan bahwa pita karakter kosong.

### Soal 2: Anagram

Buatlah program yang membaca pita karakter, lalu menuliskan berapa banyak kata yang merupakan **anagram dari kata pertama** (tidak termasuk kata pertama sendiri).

Dua kata disebut anagram jika memiliki panjang yang sama, terdiri atas huruf yang sama, dan masing-masing huruf memiliki jumlah yang sama.

Contoh:

```
SEBAB  ↔  BEBAS   (anagram)
BAGUS  ↔  GABUS   (anagram)
SUPER  ↔  PUSER   (anagram)
```

Tuliskan fungsi:

```
function isAnagram(k1, k2: Kata) → boolean
{ Menghasilkan true jika k1 dan k2 adalah anagram }
```

### Soal 3: Mesin Token

Sebuah pita karakter berisi ekspresi matematika dalam **notasi postfix**, diakhiri titik.

```
Contoh pita  : 12 3 * 4 8 + -.
Notasi infix : (12 * 3) – (4 + 8)
```

Setiap rangkaian karakter yang membentuk angka (operan) atau operator (`*`, `/`, `+`, `-`, `^`) disebut **token**, dipisahkan oleh satu atau lebih BLANK.

Buatlah Mesin Token dengan memodifikasi Mesin Kata (pilih salah satu versi akuisisi), lalu buat driver yang menuliskan setiap token ke layar.