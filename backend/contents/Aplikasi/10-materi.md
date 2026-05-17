# Materi: Aplikasi Struktur Data

---

## 1. Studi Kasus: Polinom

### Definisi Polinom
Polinom berderajat *n* didefinisikan sebagai:

```
P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x¹ + a₀
```

> Catatan: indeks koefisien dimulai dari **a₀** (konstanta) hingga **aₙ** (derajat tertinggi), berbeda dengan notasi matematika konvensional — ini mempermudah pemrosesan berbasis indeks array.

**Contoh polinom:**
- P1(x) = 4x⁵ + 2x⁴ + 7x² + 10
- P2(x) = 23x¹⁰⁰ + 9x⁹ + 2x⁷ + 4x⁵ + 2x⁴ + 3x² + 1
- P5(x) = x¹⁰⁰⁰

### Proses Dasar Polinom
1. **Membentuk** polinom dari pasangan ⟨degree, coefficient⟩, diakhiri sentinel ⟨−999, 0⟩
2. **Menuliskan** polinom dari derajat terbesar ke terkecil (hanya suku berkoefisien ≠ 0)
3. **Menjumlahkan** dua polinom P1 + P2 → P3
4. **Mengurangi** dua polinom P1 − P2 → P3
5. **Menurunkan** polinom P → P′ (turunan pertama)

---

## 2. Representasi Kontigu (Array)

### Struktur Data
```
constant nMax: integer = 100
type Polinom: ⟨ degree: integer,
                arrSuku: array [0..nMax] of integer ⟩
```
- `arrSuku[i]` = koefisien suku berderajat *i*
- **Degree** menyimpan derajat tertinggi polinom
- Polinom "kosong": `Degree = −999`

### Operasi-Operasi

**Membentuk Polinom** — proses sekuensial dengan mark:
- Baca pasangan ⟨degree, coef⟩ satu per satu
- Simpan `coef` ke `arrSuku[degree]`
- Hentikan saat degree = −999
- Update `Degree` dengan nilai maksimum

**Menuliskan Polinom** — traversal `i` dari `Degree` turun ke `0`:
- Cetak suku hanya jika `arrSuku[i] ≠ 0`

**Menjumlahkan / Mengurangi** — traversal indeks:
```
for i = maxDegree downto 0:
    arrSuku3[i] = arrSuku1[i] + arrSuku2[i]   { atau − }
Degree3 = max(Degree1, Degree2)
```
- Perlu `adjustDegree` jika derajat hasil "turun" (koefisien tertinggi = 0)

**Menurunkan Polinom** — traversal `i` dari `Degree` turun ke `1`:
```
for i = Degree downto 1:
    arrSuku1[i−1] = i * arrSuku[i]
Degree1 = Degree − 1
```

### Kamus Program
```
procedure CreatePolinom (output p: Polinom)
procedure adjustDegree (input/output p: Polinom)
procedure populatePol (output p: Polinom)
procedure displayPol (input p: Polinom)
procedure addPol (input p1, p2: Polinom; output p3: Polinom)
procedure subPol (input p1, p2: Polinom; output p3: Polinom)
procedure derivPol (input p: Polinom; output p1: Polinom)
```

---

## 3. Representasi Berkait (Linked List)

### Motivasi
- Hanya menyimpan suku yang **muncul** (koefisien ≠ 0)
- Hemat memori jika banyak suku bernilai 0 (misal P5(x) = x¹⁰⁰⁰)
- Derajat disimpan **eksplisit** di setiap node
- List diurutkan **menurun** berdasarkan degree

### Struktur Data
```
type Address: pointer to Suku
type Suku: ⟨ degree: integer,
              coef:   integer,
              next:   Address ⟩
type Polinom: Address  { alamat elemen pertama list }
```
- Polinom "kosong": `p = NIL`

### Representasi Fisik
| | Dengan Pointer | Dengan Tabel |
|---|---|---|
| Address | `pointer to Suku` | `integer [0..NMAX]` |
| Akses next | `pt↑.next` | `arrSuku[pt].next` |
| Alokasi | `malloc/free` (sistem) | `initialize`, `newSuku`, `deallocSuku` |

### Operasi-Operasi

**Membentuk Polinom** — baca ⟨degree, coef⟩, sisipkan ke list terurut menurun:

Contoh input ⟨1,4⟩, ⟨2,5⟩, ⟨5,7⟩, ⟨8,9⟩, ⟨3,4⟩:
```
⟨1,4⟩
⟨2,5⟩ → ⟨1,4⟩
⟨5,7⟩ → ⟨2,5⟩ → ⟨1,4⟩
⟨8,9⟩ → ⟨5,7⟩ → ⟨2,5⟩ → ⟨1,4⟩
⟨8,9⟩ → ⟨5,7⟩ → ⟨3,4⟩ → ⟨2,5⟩ → ⟨1,4⟩
```

**Menuliskan Polinom** — traversal dasar list, semua node otomatis berkoefisien ≠ 0.

**Menjumlahkan** — teknik **merging** dua list terurut:
- `degree P1 = degree P2` → jumlahkan, sisipkan ke P3 (jika hasil ≠ 0)
- `degree P1 > degree P2` → salin suku P1 ke P3, maju P1
- `degree P1 < degree P2` → salin suku P2 ke P3, maju P2

**Mengurangi** — sama dengan penjumlahan, operasi diganti pengurangan.

**Menurunkan** — traversal list P, untuk setiap suku ⟨i, aᵢ⟩ dengan i > 0:
- InsertLast ke P1 dengan suku ⟨i−1, i×aᵢ⟩

---

## 4. Studi Kasus: Pengelolaan Memori

### Deskripsi
Memori dinyatakan sebagai **NB** blok kontigu, setiap blok berstatus:
- **F (false)** = KOSONG
- **T (true)** = ISI

**Zone bebas**: rangkaian blok KOSONG yang berurutan, dinyatakan sebagai ⟨indeks_awal, ukuran⟩.

### Prosedur yang Diimplementasikan
| Prosedur | Fungsi |
|---|---|
| `InitMem` | Set semua blok menjadi KOSONG |
| `AlokBlok(X, IAw)` | Alokasi X blok, hasilkan indeks awal IAw |
| `DeAlokBlok(X, IAw)` | Bebaskan X blok mulai IAw |
| `GarbageCollection` | Kompaksi: semua KOSONG ke kiri, ISI ke kanan |

---

## 5. Pengelolaan Memori – Representasi Kontigu

### Struktur Data
```
constant NB: integer = 100
STATMEM: array [1..NB] of boolean
{ true = ISI, false = KOSONG }
```

### Strategi Alokasi

**First Fit** — alokasi pada zone kosong **pertama** yang cukup:
```
Cari zone kosong dengan Nb ≥ X (berhenti saat pertama kali ditemukan)
Jika ada:
    Ubah status blok [IAw .. IAw+X−1] menjadi ISI
Jika tidak: IAw ← 0
```

**Best Fit** — alokasi pada zone kosong **terkecil** yang cukup:
```
Periksa SEMUA zone kosong, tandai yang minimum (Nb ≥ X)
Ubah status blok pada zone minimum tersebut
```

**Perbandingan:**
- First Fit lebih cepat, tapi bisa meninggalkan fragmen besar tak terpakai
- Best Fit meminimalkan fragmentasi internal

### GarbageCollection (Representasi Kontigu)
- **Dua pass**: (1) hitung NKosong, (2) set [1..NKosong]=KOSONG, [NKosong+1..NB]=ISI
- **Satu pass**: tukar elemen KOSONG ke kiri dengan ISI ke kanan

---

## 6. Pengelolaan Memori – Representasi Berkait Blok Kosong

### Struktur Data
```
type ZB: ⟨ Aw:   integer,   { indeks awal zone kosong }
            Nb:   integer,   { ukuran zone kosong }
            Next: Address ⟩
FIRSTZB: Address  { alamat zone kosong pertama, terurut menurut Aw }
```

### InitMem
Buat list dengan **satu elemen** ⟨1, NB⟩ (seluruh memori kosong).

### AlokBlok – First Fit
```
Sequential search list FirstZB dengan kondisi berhenti Nb(P) ≥ X
Jika Nb(P) = X  → Delete elemen P dari list
Jika Nb(P) > X  → Update Aw(P) dan Nb(P)
IAw ← Aw(P)
```

### AlokBlok – Best Fit
```
Traversal seluruh list, catat elemen minimum (Nb ≥ X)
Proses elemen minimum (hapus/update sama seperti First Fit)
```

### DeAlokBlok
Lebih kompleks karena perlu mempertimbangkan penggabungan zone tetangga:
- Zone baru **bergabung** dengan elemen kiri atau kanan → delete satu, update lainnya
- Zone baru **tidak bergabung** → insert elemen baru di posisi yang tepat (terurut)
- Terletak di awal atau akhir list → penanganan khusus insert first / insert last

### GarbageCollection (Representasi Berkait)
```
Jika list tidak kosong:
    Hitung total blok kosong (iterasi list lama)
    Jadikan satu elemen tunggal: ⟨1, totalKosong⟩
```

---

## 7. Studi Kasus: Multi-List

### Deskripsi
Mengelola data **Pegawai** beserta **Anak**-anaknya.

**Informasi pegawai:** nip, nama, jabatan, gajiPokok
**Informasi anak:** nama, tglLahir

### Dua Alternatif Representasi

**Alternatif 1** — Setiap elemen list Pegawai memiliki list Anak sendiri:
```
type Pegawai: ⟨ nip, nama, jabatan, gajiPokok, firstAnak, nextPeg ⟩
type Anak:    ⟨ nama, tglLahir, nextAnak ⟩
```

**Alternatif 2** — List Anak global, setiap Anak menyimpan pointer ke Bapaknya:
```
type Pegawai: ⟨ nip, nama, jabatan, gajiPokok, nextPeg ⟩
type Anak:    ⟨ nama, tglLahir, nextAnak, father: AdrPeg ⟩
FirstPeg: ListPeg
FirstAnak: ListAnak
```

### Perbandingan Operasi

| Fitur | Alternatif 1 | Alternatif 2 |
|---|---|---|
| Daftar anak tiap pegawai | Efisien (langsung traversal list anak pegawai) | Kurang efisien (scan seluruh list anak) |
| Daftar anak < 18 th | Butuh traversal pegawai + anak | Cukup traversal list anak saja |
| Daftar pegawai anak > 3 | Traversal list anak tiap pegawai | Traversal list anak global per pegawai |
| Cari orang tua dari nama anak | Butuh search berlapis (pegawai → anak) | Langsung via `father` pointer |
| Insert anak baru | Search pegawai, insert ke list anaknya | Search pegawai, insert ke list global |

---

## 8. Studi Kasus: Representasi Relasi M-N

### Deskripsi
**Dosen** dan **MataKuliah** memiliki relasi many-to-many (M-N):
- Satu dosen dapat mengajar banyak mata kuliah
- Satu mata kuliah dapat diajar oleh banyak dosen

### Tiga Alternatif Representasi

**Alternatif 1 — Relasi "Mengajar" (dari sudut Dosen):**
Setiap elemen list Dosen memiliki list MataKuliah yang diajarnya.
- Mudah untuk query: *"MK apa yang diajar dosen X?"*
- Kurang efisien untuk query: *"Siapa saja yang mengajar MK Y?"*

**Alternatif 2 — Relasi "Diajar Oleh" (dari sudut MataKuliah):**
Setiap elemen list MataKuliah memiliki list Dosen pengajarnya.
- Mudah untuk query: *"Siapa yang mengajar MK Y?"*
- Kurang efisien untuk query: *"MK apa yang diajar dosen X?"*

**Alternatif 3 — Relasi sebagai List Terpisah (MK_DOS):**
List terpisah berisi pasangan ⟨Dosen, MataKuliah⟩, setiap elemen menunjuk ke node di list Dosen dan list MataKuliah.
- Fleksibel untuk kedua arah query
- Mudah menambah/menghapus relasi tanpa mengubah struktur Dosen atau MataKuliah

### Procedure AddRel
Menambahkan relasi ⟨D, MK⟩:
1. Jika D belum ada di list Dosen → tambahkan dulu
2. Jika MK belum ada di list MataKuliah → tambahkan dulu
3. Pastikan pasangan ⟨D, MK⟩ belum ada (harus unik)
4. Insert elemen relasi baru

### Pengembangan Lebih Lanjut
- **Relasi pada list yang sama**: misal prerequisite antar MataKuliah (relasi M-N dalam satu list)
- **Satu objek, banyak relasi**: misal MataKuliah terlibat dalam relasi pengajaran sekaligus prerequisite → perlu struktur relasi terpisah untuk masing-masing

---
# Materi: Aplikasi Struktur Data
**IF2110/IF2111 – Algoritma dan Struktur Data**
STEI – Institut Teknologi Bandung

---

## 1. Studi Kasus: Polinom

### Definisi Polinom
Polinom berderajat *n* didefinisikan sebagai:

```
P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x¹ + a₀
```

> Catatan: indeks koefisien dimulai dari **a₀** (konstanta) hingga **aₙ** (derajat tertinggi), berbeda dengan notasi matematika konvensional — ini mempermudah pemrosesan berbasis indeks array.

**Contoh polinom:**
- P1(x) = 4x⁵ + 2x⁴ + 7x² + 10
- P2(x) = 23x¹⁰⁰ + 9x⁹ + 2x⁷ + 4x⁵ + 2x⁴ + 3x² + 1
- P5(x) = x¹⁰⁰⁰

### Proses Dasar Polinom
1. **Membentuk** polinom dari pasangan ⟨degree, coefficient⟩, diakhiri sentinel ⟨−999, 0⟩
2. **Menuliskan** polinom dari derajat terbesar ke terkecil (hanya suku berkoefisien ≠ 0)
3. **Menjumlahkan** dua polinom P1 + P2 → P3
4. **Mengurangi** dua polinom P1 − P2 → P3
5. **Menurunkan** polinom P → P′ (turunan pertama)

---

## 2. Representasi Kontigu (Array)

### Struktur Data
```
constant nMax: integer = 100
type Polinom: ⟨ degree: integer,
                arrSuku: array [0..nMax] of integer ⟩
```
- `arrSuku[i]` = koefisien suku berderajat *i*
- **Degree** menyimpan derajat tertinggi polinom
- Polinom "kosong": `Degree = −999`

### Operasi-Operasi

**Membentuk Polinom** — proses sekuensial dengan mark:
- Baca pasangan ⟨degree, coef⟩ satu per satu
- Simpan `coef` ke `arrSuku[degree]`
- Hentikan saat degree = −999
- Update `Degree` dengan nilai maksimum

**Menuliskan Polinom** — traversal `i` dari `Degree` turun ke `0`:
- Cetak suku hanya jika `arrSuku[i] ≠ 0`

**Menjumlahkan / Mengurangi** — traversal indeks:
```
for i = maxDegree downto 0:
    arrSuku3[i] = arrSuku1[i] + arrSuku2[i]   { atau − }
Degree3 = max(Degree1, Degree2)
```
- Perlu `adjustDegree` jika derajat hasil "turun" (koefisien tertinggi = 0)

**Menurunkan Polinom** — traversal `i` dari `Degree` turun ke `1`:
```
for i = Degree downto 1:
    arrSuku1[i−1] = i * arrSuku[i]
Degree1 = Degree − 1
```

### Kamus Program
```
procedure CreatePolinom (output p: Polinom)
procedure adjustDegree (input/output p: Polinom)
procedure populatePol (output p: Polinom)
procedure displayPol (input p: Polinom)
procedure addPol (input p1, p2: Polinom; output p3: Polinom)
procedure subPol (input p1, p2: Polinom; output p3: Polinom)
procedure derivPol (input p: Polinom; output p1: Polinom)
```

---

## 3. Representasi Berkait (Linked List)

### Motivasi
- Hanya menyimpan suku yang **muncul** (koefisien ≠ 0)
- Hemat memori jika banyak suku bernilai 0 (misal P5(x) = x¹⁰⁰⁰)
- Derajat disimpan **eksplisit** di setiap node
- List diurutkan **menurun** berdasarkan degree

### Struktur Data
```
type Address: pointer to Suku
type Suku: ⟨ degree: integer,
              coef:   integer,
              next:   Address ⟩
type Polinom: Address  { alamat elemen pertama list }
```
- Polinom "kosong": `p = NIL`

### Representasi Fisik
| | Dengan Pointer | Dengan Tabel |
|---|---|---|
| Address | `pointer to Suku` | `integer [0..NMAX]` |
| Akses next | `pt↑.next` | `arrSuku[pt].next` |
| Alokasi | `malloc/free` (sistem) | `initialize`, `newSuku`, `deallocSuku` |

### Operasi-Operasi

**Membentuk Polinom** — baca ⟨degree, coef⟩, sisipkan ke list terurut menurun:

Contoh input ⟨1,4⟩, ⟨2,5⟩, ⟨5,7⟩, ⟨8,9⟩, ⟨3,4⟩:
```
⟨1,4⟩
⟨2,5⟩ → ⟨1,4⟩
⟨5,7⟩ → ⟨2,5⟩ → ⟨1,4⟩
⟨8,9⟩ → ⟨5,7⟩ → ⟨2,5⟩ → ⟨1,4⟩
⟨8,9⟩ → ⟨5,7⟩ → ⟨3,4⟩ → ⟨2,5⟩ → ⟨1,4⟩
```

**Menuliskan Polinom** — traversal dasar list, semua node otomatis berkoefisien ≠ 0.

**Menjumlahkan** — teknik **merging** dua list terurut:
- `degree P1 = degree P2` → jumlahkan, sisipkan ke P3 (jika hasil ≠ 0)
- `degree P1 > degree P2` → salin suku P1 ke P3, maju P1
- `degree P1 < degree P2` → salin suku P2 ke P3, maju P2

**Mengurangi** — sama dengan penjumlahan, operasi diganti pengurangan.

**Menurunkan** — traversal list P, untuk setiap suku ⟨i, aᵢ⟩ dengan i > 0:
- InsertLast ke P1 dengan suku ⟨i−1, i×aᵢ⟩

---

## 4. Studi Kasus: Pengelolaan Memori

### Deskripsi
Memori dinyatakan sebagai **NB** blok kontigu, setiap blok berstatus:
- **F (false)** = KOSONG
- **T (true)** = ISI

**Zone bebas**: rangkaian blok KOSONG yang berurutan, dinyatakan sebagai ⟨indeks_awal, ukuran⟩.

### Prosedur yang Diimplementasikan
| Prosedur | Fungsi |
|---|---|
| `InitMem` | Set semua blok menjadi KOSONG |
| `AlokBlok(X, IAw)` | Alokasi X blok, hasilkan indeks awal IAw |
| `DeAlokBlok(X, IAw)` | Bebaskan X blok mulai IAw |
| `GarbageCollection` | Kompaksi: semua KOSONG ke kiri, ISI ke kanan |

---

## 5. Pengelolaan Memori – Representasi Kontigu

### Struktur Data
```
constant NB: integer = 100
STATMEM: array [1..NB] of boolean
{ true = ISI, false = KOSONG }
```

### Strategi Alokasi

**First Fit** — alokasi pada zone kosong **pertama** yang cukup:
```
Cari zone kosong dengan Nb ≥ X (berhenti saat pertama kali ditemukan)
Jika ada:
    Ubah status blok [IAw .. IAw+X−1] menjadi ISI
Jika tidak: IAw ← 0
```

**Best Fit** — alokasi pada zone kosong **terkecil** yang cukup:
```
Periksa SEMUA zone kosong, tandai yang minimum (Nb ≥ X)
Ubah status blok pada zone minimum tersebut
```

**Perbandingan:**
- First Fit lebih cepat, tapi bisa meninggalkan fragmen besar tak terpakai
- Best Fit meminimalkan fragmentasi internal

### GarbageCollection (Representasi Kontigu)
- **Dua pass**: (1) hitung NKosong, (2) set [1..NKosong]=KOSONG, [NKosong+1..NB]=ISI
- **Satu pass**: tukar elemen KOSONG ke kiri dengan ISI ke kanan

---

## 6. Pengelolaan Memori – Representasi Berkait Blok Kosong

### Struktur Data
```
type ZB: ⟨ Aw:   integer,   { indeks awal zone kosong }
            Nb:   integer,   { ukuran zone kosong }
            Next: Address ⟩
FIRSTZB: Address  { alamat zone kosong pertama, terurut menurut Aw }
```

### InitMem
Buat list dengan **satu elemen** ⟨1, NB⟩ (seluruh memori kosong).

### AlokBlok – First Fit
```
Sequential search list FirstZB dengan kondisi berhenti Nb(P) ≥ X
Jika Nb(P) = X  → Delete elemen P dari list
Jika Nb(P) > X  → Update Aw(P) dan Nb(P)
IAw ← Aw(P)
```

### AlokBlok – Best Fit
```
Traversal seluruh list, catat elemen minimum (Nb ≥ X)
Proses elemen minimum (hapus/update sama seperti First Fit)
```

### DeAlokBlok
Lebih kompleks karena perlu mempertimbangkan penggabungan zone tetangga:
- Zone baru **bergabung** dengan elemen kiri atau kanan → delete satu, update lainnya
- Zone baru **tidak bergabung** → insert elemen baru di posisi yang tepat (terurut)
- Terletak di awal atau akhir list → penanganan khusus insert first / insert last

### GarbageCollection (Representasi Berkait)
```
Jika list tidak kosong:
    Hitung total blok kosong (iterasi list lama)
    Jadikan satu elemen tunggal: ⟨1, totalKosong⟩
```

---

## 7. Studi Kasus: Multi-List

### Deskripsi
Mengelola data **Pegawai** beserta **Anak**-anaknya.

**Informasi pegawai:** nip, nama, jabatan, gajiPokok
**Informasi anak:** nama, tglLahir

### Dua Alternatif Representasi

**Alternatif 1** — Setiap elemen list Pegawai memiliki list Anak sendiri:
```
type Pegawai: ⟨ nip, nama, jabatan, gajiPokok, firstAnak, nextPeg ⟩
type Anak:    ⟨ nama, tglLahir, nextAnak ⟩
```

**Alternatif 2** — List Anak global, setiap Anak menyimpan pointer ke Bapaknya:
```
type Pegawai: ⟨ nip, nama, jabatan, gajiPokok, nextPeg ⟩
type Anak:    ⟨ nama, tglLahir, nextAnak, father: AdrPeg ⟩
FirstPeg: ListPeg
FirstAnak: ListAnak
```

### Perbandingan Operasi

| Fitur | Alternatif 1 | Alternatif 2 |
|---|---|---|
| Daftar anak tiap pegawai | Efisien (langsung traversal list anak pegawai) | Kurang efisien (scan seluruh list anak) |
| Daftar anak < 18 th | Butuh traversal pegawai + anak | Cukup traversal list anak saja |
| Daftar pegawai anak > 3 | Traversal list anak tiap pegawai | Traversal list anak global per pegawai |
| Cari orang tua dari nama anak | Butuh search berlapis (pegawai → anak) | Langsung via `father` pointer |
| Insert anak baru | Search pegawai, insert ke list anaknya | Search pegawai, insert ke list global |

---

## 8. Studi Kasus: Representasi Relasi M-N

### Deskripsi
**Dosen** dan **MataKuliah** memiliki relasi many-to-many (M-N):
- Satu dosen dapat mengajar banyak mata kuliah
- Satu mata kuliah dapat diajar oleh banyak dosen

### Tiga Alternatif Representasi

**Alternatif 1 — Relasi "Mengajar" (dari sudut Dosen):**
Setiap elemen list Dosen memiliki list MataKuliah yang diajarnya.
- Mudah untuk query: *"MK apa yang diajar dosen X?"*
- Kurang efisien untuk query: *"Siapa saja yang mengajar MK Y?"*

**Alternatif 2 — Relasi "Diajar Oleh" (dari sudut MataKuliah):**
Setiap elemen list MataKuliah memiliki list Dosen pengajarnya.
- Mudah untuk query: *"Siapa yang mengajar MK Y?"*
- Kurang efisien untuk query: *"MK apa yang diajar dosen X?"*

**Alternatif 3 — Relasi sebagai List Terpisah (MK_DOS):**
List terpisah berisi pasangan ⟨Dosen, MataKuliah⟩, setiap elemen menunjuk ke node di list Dosen dan list MataKuliah.
- Fleksibel untuk kedua arah query
- Mudah menambah/menghapus relasi tanpa mengubah struktur Dosen atau MataKuliah

### Procedure AddRel
Menambahkan relasi ⟨D, MK⟩:
1. Jika D belum ada di list Dosen → tambahkan dulu
2. Jika MK belum ada di list MataKuliah → tambahkan dulu
3. Pastikan pasangan ⟨D, MK⟩ belum ada (harus unik)
4. Insert elemen relasi baru

### Pengembangan Lebih Lanjut
- **Relasi pada list yang sama**: misal prerequisite antar MataKuliah (relasi M-N dalam satu list)
- **Satu objek, banyak relasi**: misal MataKuliah terlibat dalam relasi pengajaran sekaligus prerequisite → perlu struktur relasi terpisah untuk masing-masing

---

*Referensi: Diktat IF2110/IF2111 Algoritma dan Struktur Data, STEI-ITB*