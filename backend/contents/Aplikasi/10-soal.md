# Soal Latihan: Aplikasi Struktur Data
**IF2110/IF2111 – Algoritma dan Struktur Data**

---

## Bagian A — Polinom: Representasi Kontigu

**A1.** Diketahui polinom berikut dimasukkan sebagai pasangan ⟨degree, coef⟩:
```
⟨3, 2⟩, ⟨0, 5⟩, ⟨7, −4⟩, ⟨1, 3⟩, ⟨−999, 0⟩
```
a. Gambarkan tabel `arrSuku[0..10]` beserta nilai `Degree` setelah pembentukan polinom.
b. Tuliskan polinom tersebut dalam notasi matematis (dari derajat tertinggi ke terendah).

---

**A2.** Diberikan dua polinom dengan representasi kontigu:
- P1: `arrSuku = [1, 0, 3, −2, 0, 5]`, `Degree = 5`
- P2: `arrSuku = [0, 4, −3, 2, 0, −5]`, `Degree = 5`

a. Tentukan P3 = P1 + P2. Tunjukkan isi `arrSuku` dan nilai `Degree` hasil.
b. Apakah perlu memanggil `adjustDegree` pada hasil penjumlahan ini? Jelaskan.
c. Tentukan P4 = P1 − P2.

---

**A3.** Diberikan polinom:
```
P(x) = 4x⁴ − 6x³ + 0x² + 2x − 8
```
a. Gambarkan tabel `arrSuku[0..5]` dan nilai `Degree` untuk P(x).
b. Tentukan P′(x) (turunan pertama P) dan gambarkan tabel representasinya.
c. Berapa nilai `Degree` dari P′?

---

**A4.** Jelaskan mengapa prosedur `adjustDegree` diperlukan setelah operasi penjumlahan, tetapi tidak diperlukan setelah pembentukan polinom pertama kali.

---

**A5.** Misalkan `nMax = 100` dan terdapat polinom P5(x) = x¹⁰⁰⁰. Apakah polinom ini dapat direpresentasikan dengan representasi kontigu? Jelaskan keterbatasannya.

---

## Bagian B — Polinom: Representasi Berkait

**B1.** Diberikan input berikut untuk membentuk polinom dengan representasi berkait:
```
⟨4, 3⟩, ⟨1, −5⟩, ⟨6, 2⟩, ⟨3, 7⟩, ⟨−999, 0⟩
```
a. Gambarkan urutan penyisipan elemen ke dalam list polinom step by step.
b. Gambarkan struktur list akhir (node-node dengan panah).

---

**B2.** Diberikan dua polinom berkait:
- P1: ⟨9,4⟩ → ⟨7,4⟩ → ⟨5,5⟩ → ⟨4,−9⟩ → ⟨0,10⟩
- P2: ⟨9,2⟩ → ⟨7,3⟩ → ⟨4,1⟩ → ⟨1,2⟩

Tunjukkan langkah-langkah pembentukan P3 = P1 + P2 menggunakan teknik merging, sertakan operasi yang dilakukan pada setiap langkah (InsertLast, Next).

---

**B3.** Diberikan polinom berkait:
```
P: ⟨5,3⟩ → ⟨3,−6⟩ → ⟨1,2⟩
```
a. Tentukan P′ (turunan) dan tuliskan node-node list hasil.
b. Mengapa untuk operasi turunan pada representasi berkait, penyisipan selalu dilakukan di akhir list (InsertLast)?

---

**B4.** Bandingkan representasi **kontigu** dan **berkait** untuk polinom dalam hal:

| Kriteria | Kontigu | Berkait |
|---|---|---|
| Penggunaan memori untuk polinom jarang (sparse) | ? | ? |
| Kemudahan akses suku ke-i langsung | ? | ? |
| Kemudahan pembentukan awal | ? | ? |
| Penanganan polinom dengan derajat sangat tinggi | ? | ? |

Isi tabel di atas dan berikan alasan singkat untuk masing-masing sel.

---

**B5.** Pada representasi berkait, terdapat tiga representasi fisik: pointer, tabel dengan array. Jelaskan perbedaan utama keduanya dalam hal: (a) cara mengakses field `next`, dan (b) cara alokasi/dealokasi node.

---

## Bagian C — Pengelolaan Memori

**C1.** Diberikan memori dengan NB = 20 blok dan status awal:
```
T T F F F T T T F F F F T T F F T T T F
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
```
a. Identifikasi semua zone bebas dalam format ⟨Aw, Nb⟩.
b. Berapa total blok kosong?

---

**C2.** Dengan memori pada soal C1, lakukan alokasi `AlokBlok(3, IAw)` menggunakan strategi **First Fit**.
a. Zone mana yang dipilih? Berapa nilai IAw?
b. Gambarkan status memori setelah alokasi.
c. Apakah hasilnya berbeda jika menggunakan strategi **Best Fit**? Jelaskan.

---

**C3.** Masih dengan memori pada soal C1 (sebelum alokasi), lakukan `AlokBlok(4, IAw)`:
a. Tentukan IAw dengan strategi **First Fit**.
b. Tentukan IAw dengan strategi **Best Fit**.
c. Zone mana yang lebih "hemat" dari sisi sisa fragmentasi? Jelaskan.

---

**C4.** Diberikan memori (NB = 15):
```
T T F T F F T T T F T T F F F
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
```
Lakukan `DeAlokBlok(3, 7)` (bebaskan 3 blok mulai indeks 7).
Gambarkan status memori setelah dealokasi.

---

**C5.** Prosedur `GarbageCollection` dapat diimplementasikan dengan **dua pass** atau **satu pass**.
a. Jelaskan langkah-langkah pendekatan dua pass.
b. Apa keuntungan pendekatan satu pass?
c. Pada representasi berkait blok kosong, bagaimana `GarbageCollection` bekerja? Mengapa lebih sederhana?

---

**C6.** Pada representasi berkait blok kosong, prosedur `DeAlokBlok` jauh lebih kompleks dibandingkan representasi kontigu. Sebutkan **minimal 4 kasus** yang harus ditangani dan jelaskan tindakan untuk masing-masing kasus.

---

## Bagian D — Multi-List

**D1.** Diketahui data pegawai dan anak sebagai berikut:
- Pegawai A (NIP: 001): anak → X, Y
- Pegawai B (NIP: 002): tidak punya anak
- Pegawai C (NIP: 003): anak → U, W, Z

a. Gambarkan struktur data dengan **Alternatif 1** (list anak per pegawai).
b. Gambarkan struktur data dengan **Alternatif 2** (list anak global + pointer father).

---

**D2.** Untuk fitur **"Daftar anak yang umurnya < 18 tahun"**:
a. Tuliskan sketsa algoritma menggunakan **Alternatif 1**.
b. Tuliskan sketsa algoritma menggunakan **Alternatif 2**.
c. Alternatif mana yang lebih efisien? Mengapa?

---

**D3.** Untuk fitur **"Cari orang tua dari nama anak"**:
a. Jelaskan pendekatan pada Alternatif 1 (kompleksitas pencarian).
b. Jelaskan pendekatan pada Alternatif 2 (kompleksitas pencarian).
c. Alternatif mana yang lebih cepat? Berikan alasannya.

---

**D4.** Pada prosedur `AddAnak` (Alternatif 1):
```
PtrAnak ← Alokasi(NamaAnak, TglLahirAnak)
if (PtrAnak ≠ NIL) then
    NextAnak(PtrAnak) ← FirstAnak(PtrPeg)
    FirstAnak(PtrPeg) ← PtrAnak
```
a. Ke mana anak baru disisipkan (awal atau akhir list anak)? Apakah ada perbedaan semantis jika disisipkan di akhir?
b. Apa yang terjadi jika `Alokasi` gagal (PtrAnak = NIL)?
c. Apa yang terjadi jika NIPPeg tidak ditemukan?

---

**D5.** Rancang sketsa algoritma untuk fitur **"Daftar pegawai yang memiliki lebih dari 3 anak"** menggunakan Alternatif 2. Pastikan menangani kasus list pegawai kosong.

---

## Bagian E — Representasi Relasi M-N

**E1.** Jelaskan perbedaan mendasar antara ketiga alternatif representasi relasi M-N (Mengajar, Diajar Oleh, List Terpisah) dalam satu paragraf singkat masing-masing.

---

**E2.** Misalkan terdapat data:
- Dosen: A, B, C
- MataKuliah: MK1, MK2, MK3
- Relasi: A→MK1, A→MK2, B→MK2, B→MK3, C→MK1, C→MK3

Untuk masing-masing **Alternatif 1, 2, dan 3**, gambarkan (secara skematis) struktur data yang terbentuk.

---

**E3.** Bandingkan efisiensi ketiga alternatif untuk query berikut. Gunakan notasi O (jumlah traversal relatif terhadap jumlah dosen *D* dan mata kuliah *M*):

| Query | Alt. 1 | Alt. 2 | Alt. 3 |
|---|---|---|---|
| MK yang diajar dosen X | ? | ? | ? |
| Dosen yang mengajar MK Y | ? | ? | ? |
| Jumlah MK per dosen (semua dosen) | ? | ? | ? |

---

**E4.** Pada prosedur `AddRel(D, MK)` untuk Alternatif 3:
a. Tuliskan langkah-langkah algoritmanya secara berurutan.
b. Mengapa perlu dicek apakah pasangan ⟨D, MK⟩ sudah ada sebelum insert?
c. Apa yang terjadi jika D belum ada di list Dosen?

---

**E5.** (Soal Pengembangan) Misalkan mata kuliah dapat memiliki **prerequisite** (relasi M-N dalam satu list MataKuliah). Rancang tipe data dan struktur list yang diperlukan untuk merepresentasikan relasi prerequisite ini menggunakan pendekatan list terpisah (serupa Alternatif 3). Gambarkan ilustrasinya.

---

## Bagian F — Soal Integrasi

**F1.** Sebuah program membutuhkan operasi berikut terhadap polinom:
1. Input polinom dengan banyak suku nol (misal: x¹⁰⁰⁰ + x⁵⁰⁰ + 1)
2. Penjumlahan dan pengurangan polinom
3. Pencetakan polinom

Representasi mana (kontigu atau berkait) yang lebih cocok? Berikan justifikasi berdasarkan penggunaan memori dan efisiensi operasi.

---

**F2.** Pada pengelolaan memori, mengapa strategi **Best Fit** tidak selalu lebih baik dari **First Fit** meski secara intuitif tampak lebih hemat? Berikan contoh skenario di mana First Fit menghasilkan lebih sedikit fragmentasi.

---

**F3.** Pada studi kasus Multi-List, jika ditambahkan fitur baru: **"Hapus semua data anak dari seorang pegawai"**, tuliskan sketsa algoritmanya untuk:
a. Alternatif 1
b. Alternatif 2
Manakah yang lebih mudah diimplementasikan?

---

**F4.** Pada representasi relasi M-N dengan list terpisah (Alternatif 3), jika seorang dosen dihapus dari list Dosen, langkah-langkah apa yang harus dilakukan agar konsistensi data tetap terjaga?

---

*Kerjakan soal-soal di atas dengan mengacu pada notasi algoritma yang digunakan dalam kuliah IF2110/IF2111.*