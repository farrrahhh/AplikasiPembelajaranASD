# Soal Latihan IF2111 — Algoritma dan Struktur Data STI

---

## Soal 1 — Pengetahuan

Jelaskan perbedaan antara **fungsi** dan **prosedur** dalam paradigma pemrograman prosedural. Berikan masing-masing satu contoh kasus nyata yang tepat untuk menggunakan fungsi dan satu kasus yang tepat untuk menggunakan prosedur, serta jelaskan alasannya!

**Topik:** Fungsi & Prosedur, Paradigma Prosedural

---

### Kunci Jawaban Soal 1

**Fungsi** adalah subprogram yang selalu mengembalikan tepat satu nilai melalui pernyataan `return`. Nilai kembaliannya dapat langsung digunakan dalam ekspresi.

**Prosedur** adalah subprogram yang tidak mengembalikan nilai secara langsung, melainkan menghasilkan efek samping melalui parameter output atau input/output.

**Perbedaan utama:**
- Fungsi memiliki nilai kembalian (`return type` bukan `void`); dipanggil dalam ekspresi
- Prosedur tidak memiliki nilai kembalian (`void` di C); dipanggil sebagai pernyataan tersendiri
- Parameter output pada prosedur menggunakan pointer (`*`) di bahasa C

**Contoh kasus fungsi:** Menghitung luas lingkaran dari jari-jari. Karena hasilnya satu nilai numerik yang ingin langsung dipakai dalam ekspresi, fungsi lebih tepat.

**Contoh kasus prosedur:** Membaca data nama dan umur dari pengguna lalu menyimpannya ke dua variabel berbeda. Karena ada dua output sekaligus, prosedur dengan dua parameter output lebih tepat.

---

## Soal 2 — Pengetahuan

Dalam pembuatan program modular bahasa C, sebuah program terdiri dari beberapa kelompok file. Jelaskan peran masing-masing file berikut dan mengapa pemisahan ini penting:

- `xxx.h` — file header
- `xxx.c` — file body
- `main.c` — program utama
- `check_xxx.c` — file unit test

Mengapa variabel **tidak boleh** dideklarasikan di dalam file header?

**Topik:** Modularitas, ADT, Reusability

---

### Kunci Jawaban Soal 2

- **`xxx.h`** — berisi deklarasi konstanta, tipe data, dan prototipe fungsi/prosedur. Tidak berisi implementasi. Digunakan oleh file lain melalui `#include`.
- **`xxx.c`** — berisi realisasi/implementasi dari seluruh prototipe yang didefinisikan di `xxx.h`. Dikompilasi terpisah menjadi object code.
- **`main.c`** — berisi program utama (`int main()`) dan prosedur/fungsi yang hanya dibutuhkan oleh main. Menginclude file header yang diperlukan.
- **`check_xxx.c`** — berisi test case untuk setiap prosedur/fungsi di header, menggunakan library seperti `check`. Tujuannya memastikan setiap primitif bekerja benar secara terisolasi.

**Mengapa variabel tidak boleh di header?**

Jika file header di-`#include` oleh beberapa file `.c`, maka deklarasi variabel di header akan menciptakan definisi variabel di setiap translation unit yang menginclude-nya. Saat linking, linker akan menemukan simbol yang terdefinisi ganda sehingga terjadi error *multiple definition*.

---

## Soal 3 — Implementasi

Buatlah sebuah **fungsi** yang menerima dua bilangan bulat dan mengembalikan nilai terbesarnya.

**Notasi Algoritma:**

```
function MAKS(input a: integer, input b: integer) → integer
{ Mengembalikan nilai terbesar antara a dan b }
KAMUS LOKAL
  hasil : integer
ALGORITMA
  if (a > b) then
    hasil ← a
  else
    hasil ← b
  return hasil
```

Implementasikan fungsi di atas dalam **bahasa C**, lalu buat program utama yang membaca dua bilangan dari input dan mencetak nilai terbesarnya menggunakan fungsi tersebut.

**Topik:** Fungsi, Seleksi, Bahasa C

---

### Kunci Jawaban Soal 3

```c
#include <stdio.h>

int MAKS(int a, int b) {
    /* Mengembalikan nilai terbesar antara a dan b */
    int hasil;
    if (a > b) {
        hasil = a;
    } else {
        hasil = b;
    }
    return hasil;
}

int main() {
    int x, y;
    printf("Masukkan dua bilangan: ");
    scanf("%d %d", &x, &y);
    printf("Nilai terbesar: %d\n", MAKS(x, y));
    return 0;
}
```

**Contoh output:**

```
Masukkan dua bilangan: 7 13
Nilai terbesar: 13
```

---

## Soal 4 — Implementasi

Buatlah sebuah **prosedur** yang menukar nilai dua variabel bertipe integer tanpa menggunakan variabel ketiga.

**Notasi Algoritma:**

```
procedure TUKAR(input/output a: integer, input/output b: integer)
{ I.S. : a dan b terdefinisi }
{ F.S. : nilai a dan b saling tertukar }
KAMUS LOKAL
  -
ALGORITMA
  a ← a + b
  b ← a - b
  a ← a - b
```

Implementasikan prosedur `TUKAR` dalam **bahasa C** menggunakan pointer, lalu demonstrasikan pemanggilannya dalam program utama. Cetak nilai sebelum dan sesudah pertukaran.

**Topik:** Prosedur, Pointer, Pass by reference

---

### Kunci Jawaban Soal 4

```c
#include <stdio.h>

void TUKAR(int *a, int *b) {
    /* I.S. : *a dan *b terdefinisi    */
    /* F.S. : nilai *a dan *b tertukar */
    *a = *a + *b;
    *b = *a - *b;
    *a = *a - *b;
}

int main() {
    int x, y;
    printf("Masukkan dua bilangan: ");
    scanf("%d %d", &x, &y);
    printf("Sebelum tukar: x = %d, y = %d\n", x, y);
    TUKAR(&x, &y);
    printf("Sesudah tukar: x = %d, y = %d\n", x, y);
    return 0;
}
```

**Catatan:** Parameter bertipe `int *` karena prosedur harus mengubah nilai asli variabel di pemanggil (pass by reference). Pemanggilan menggunakan operator `&` untuk meneruskan alamat variabel.

**Contoh output:**

```
Masukkan dua bilangan: 5 9
Sebelum tukar: x = 5, y = 9
Sesudah tukar: x = 9, y = 5
```

---

## Soal 5 — Implementasi

Buatlah sebuah **fungsi rekursif** yang menghitung faktorial dari bilangan bulat non-negatif *n*.

**Notasi Algoritma:**

```
function FAKTORIAL(input n: integer) → integer
{ Mengembalikan n! untuk n ≥ 0           }
{ Basis   : n = 0 → hasil = 1            }
{ Rekurens: n > 0 → hasil = n × (n-1)!  }
KAMUS LOKAL
  -
ALGORITMA
  if (n = 0) then
    return 1
  else
    return n * FAKTORIAL(n - 1)
```

1. Implementasikan fungsi `FAKTORIAL` secara rekursif dalam **bahasa C**.
2. Buat program utama yang membaca nilai *n* dari pengguna dan mencetak *n!*
3. Tambahkan validasi: jika *n* < 0, cetak pesan kesalahan.

**Topik:** Rekursi, Fungsi, Validasi input

---

### Kunci Jawaban Soal 5

```c
#include <stdio.h>

int FAKTORIAL(int n) {
    /* Mengembalikan n! untuk n >= 0          */
    /* Basis   : n = 0 -> return 1            */
    /* Rekurens: n > 0 -> return n * (n-1)!  */
    if (n == 0) {
        return 1;
    } else {
        return n * FAKTORIAL(n - 1);
    }
}

int main() {
    int n;
    printf("Masukkan nilai n: ");
    scanf("%d", &n);
    if (n < 0) {
        printf("Error: n harus bilangan non-negatif.\n");
    } else {
        printf("%d! = %d\n", n, FAKTORIAL(n));
    }
    return 0;
}
```

**Cara kerja rekursi untuk n = 4:**

```
FAKTORIAL(4)
  = 4 × FAKTORIAL(3)
  = 4 × 3 × FAKTORIAL(2)
  = 4 × 3 × 2 × FAKTORIAL(1)
  = 4 × 3 × 2 × 1 × FAKTORIAL(0)
  = 4 × 3 × 2 × 1 × 1
  = 24
```

**Contoh output:**

```
Masukkan nilai n: 5
5! = 120
```

```
Masukkan nilai n: -3
Error: n harus bilangan non-negatif.
```