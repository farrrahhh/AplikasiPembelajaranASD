# Latihan Soal – Mesin Karakter dan Mesin Kata

---

## Bagian A: Mesin Karakter

### Soal A-1: CountCharacters

Diberikan sebuah mesin karakter dengan pita berisi karakter (mungkin kosong). Buatlah algoritma untuk **menghitung banyaknya huruf** yang ada pada pita tersebut. Banyaknya karakter pada pita kosong adalah nol.

**Petunjuk**: Gunakan skema pemrosesan dengan MARK.

---

### Soal A-2: Hitung-A

Diberikan sebuah mesin karakter dengan pita berisi karakter (mungkin kosong). Buatlah algoritma untuk **menghitung banyaknya huruf 'A'** yang ada pada pita tersebut. Banyaknya huruf 'A' pada pita kosong adalah nol.

---

### Soal A-3: Hitung-LE ⭐

Diberikan sebuah mesin karakter dengan pita berisi karakter (mungkin kosong). Buatlah algoritma untuk **menghitung banyaknya pasangan huruf 'L' dan 'E'** yang ada pada pita tersebut.

Contoh:

```
Pita  : "HELLO WORLD LEVEL."
Output: 2   { pasangan LE pada "HELLO" dan "LEVEL" }
```

Banyaknya pasangan 'L' dan 'E' pada pita kosong adalah nol.

---

## Bagian B: Mesin Kata – Studi Kasus

### Soal B-1: Panjang Rata-Rata Kata

Diberikan pita berisi karakter (mungkin kosong) yang diakhiri titik. **Hitunglah panjang rata-rata kata** yang ada pada pita tersebut.

Panjang rata-rata tidak terdefinisi jika pita kosong atau tidak mengandung kata (hanya berisi blank dan titik).

Contoh:

```
Pita  : "aku pergi ke pasar."
Kata  : ["aku", "pergi", "ke", "pasar"]  → 4 kata
Total : 3 + 5 + 2 + 5 = 15
Rata  : 15 / 4 = 3.75
```

**Kerjakan menggunakan ketiga versi model akuisisi kata (Versi 1, 2, dan 3). Bandingkan perbedaannya.**

---

### Soal B-2: Hitung WHILE

Diberikan suatu pita karakter yang mengandung abjad, blank, dan diakhiri titik. **Hitunglah banyaknya kemunculan kata 'WHILE'** pada pita tersebut.

Contoh:

```
Pita  : "WHILE i WHILE j do WHILE."
Output: 3
```

**Petunjuk**: Gunakan fungsi pembantu berikut:

```
function isKataEqual(k1, k2: Kata) → boolean
{ Menghasilkan true jika k1 = k2 }
```

Sebagai latihan tambahan, **realisasikan fungsi `isKataEqual`** tersebut.

---

## Bagian C: Latihan Lanjutan

### Soal C-1: Frekuensi Kata Pertama

Dibaca sebuah pita karakter yang diakhiri titik. **Hitunglah frekuensi kemunculan kata pertama** dalam pita tersebut. Frekuensi dinyatakan sebagai `jumlah_kemunculan / total_kata`.

Asumsikan teks dalam bahasa Indonesia dan kata terpanjang terdiri dari 50 karakter.

Contoh:

```
Pita  : "aku pergi ke pasar kemudian aku pulang ke rumah supaya aku dapat mandi."
Output: frekuensi 'aku' = 3/13
```

Jika pita karakter kosong, tampilkan pesan bahwa pita karakter kosong.

---

### Soal C-2: Anagram

Buatlah program yang membaca sebuah pita karakter, lalu **menuliskan berapa banyak kata yang merupakan anagram dari kata pertama** pada pita (tidak termasuk kata pertama).

Dua kata disebut **anagram** jika:
- Memiliki panjang yang sama
- Terdiri atas huruf yang sama
- Masing-masing huruf memiliki jumlah yang sama

Contoh:

```
SEBAB  ↔  BEBAS   (anagram)
BAGUS  ↔  GABUS   (anagram)
SUPER  ↔  PUSER   (anagram)
```

Tuliskan sebuah fungsi:

```
function isAnagram(k1, k2: Kata) → boolean
{ Menghasilkan true jika k1 dan k2 adalah anagram }
```

---

### Soal C-3: Mesin Token

Sebuah pita karakter berisi **ekspresi matematika dalam notasi postfix**, diakhiri dengan karakter titik `'.'`.

Setiap rangkaian karakter yang membentuk angka (operan) atau operator (`*`, `/`, `+`, `-`, `^`) disebut **token**. Setiap token dipisahkan oleh satu atau lebih BLANK.

Contoh:

```
Pita        : 12 3 * 4 8 + -.
Notasi infix: (12 * 3) – (4 + 8)
Token       : ["12", "3", "*", "4", "8", "+", "-"]
```

**Tugas**:
1. Buatlah **Mesin Token** dengan memodifikasi Mesin Kata (pilih salah satu versi model akuisisi).
2. Buatlah sebuah **driver** Mesin Token yang menuliskan setiap token ke layar, satu token per baris.

---

## Ringkasan Primitif yang Tersedia

Saat mengerjakan soal-soal di atas, kamu dapat menggunakan primitif berikut sesuai versi yang dipilih.

**Mesin Karakter**:

```
start   → memposisikan cc ke karakter pertama pita
adv     → memajukan pita satu karakter
cc      → current character
eop     → boolean, true jika cc = MARK
```

**Mesin Kata (semua versi)**:

```
ignoreBlank  → melewati satu atau beberapa BLANK
salinKata    → menyalin karakter ke currentKata hingga BLANK atau MARK
```

**Mesin Kata Versi 1**:

```
startKata    → inisialisasi; endKata = true jika pita kosong
advKata      → akuisisi kata berikutnya
endKata      → boolean, true jika semua kata sudah diproses
currentKata  → Kata yang baru saja diakuisisi
```

**Mesin Kata Versi 2**:

```
startKata    → inisialisasi; currentKata.length = 0 jika pita kosong
advKata      → akuisisi kata berikutnya
currentKata  → Kata yang baru saja diakuisisi (length = 0 → selesai)
```

**Mesin Kata Versi 3**:

```
initAkses    → inisialisasi; melewati blank di awal pita
advKata      → akuisisi kata berikutnya
cc           → digunakan langsung sebagai kondisi (cc ≠ MARK → masih ada kata)
currentKata  → Kata yang baru saja diakuisisi
```