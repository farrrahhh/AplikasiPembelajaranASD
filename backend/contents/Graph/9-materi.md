# Graph

**Graph** (atau Graf) adalah struktur data yang terdiri dari sekumpulan simpul dan busur yang menghubungkan simpul-simpul tersebut.

Secara formal:

```
G = (V, E)

V = sekumpulan simpul (vertices / nodes), tidak boleh kosong
E = sekumpulan busur (edges), boleh kosong
```

Contoh graph sederhana:

```
A ----- B
|       |
|       |
C ----- D
```

---

## Terminologi Dasar

### Bertetangga (Adjacent)

Dua simpul disebut bertetangga jika dihubungkan oleh sebuah busur.

Contoh:

```
Simpul A dan B bertetangga jika ada busur (A, B).
```

### Berhubungan (Incident)

Sebuah simpul dinyatakan incident dengan semua busur yang menghubungkannya dengan simpul lain.

Contoh:

```
Simpul C incident dengan busur (B,C) dan (C,D).
```

### Derajat (Degree)

Derajat sebuah simpul adalah jumlah busur yang terhubung dengan simpul tersebut.

Contoh:

```
Simpul dengan 3 tetangga memiliki derajat 3.
```

---

## Variasi Graph

| Jenis Graph | Penjelasan |
| --- | --- |
| Weighted graph | Busur memiliki bobot atau nilai |
| Directed graph | Busur memiliki arah (a → b ≠ b → a) |
| Undirected graph | Busur tidak memiliki arah (a — b = b — a) |
| Simple graph | Undirected, tanpa loop, maks satu busur antara dua simpul |
| Regular graph | Semua simpul berderajat sama |
| Complete graph | Setiap pasang simpul dihubungkan busur |
| Empty graph | Graph tanpa busur |

Ilustrasi directed graph:

```
A → B → C
↑       |
└───────┘
```

Ilustrasi undirected graph:

```
A — B — C
```

---

## Aplikasi Graph

Graph digunakan di banyak bidang:

```
Computer science  → jaringan komunikasi, alur komputasi
Kimia             → struktur atom dan molekul
Sosiologi         → analisis jaringan sosial
Biologi           → jalur migrasi, penyebaran penyakit
```

Contoh nyata:

```
Peta jalan         → simpul = kota, busur = jalan
Social network     → simpul = pengguna, busur = pertemanan
Jaringan komputer  → simpul = perangkat, busur = koneksi
```

---

## Representasi Graph

Ada beberapa cara merepresentasikan graph dalam program.

---

### 1. Adjacency Matrix

Jika graph memiliki n simpul, adjacency matrix adalah matriks n×n. Nilai M[i][j] menyatakan jumlah busur antara simpul i dan simpul j.

Contoh graph:

```
    1
   / \
  2   3
   \ /
    4
```

Adjacency matrix-nya:

```
     1  2  3  4
1  [ 0  1  1  0 ]
2  [ 1  0  0  1 ]
3  [ 1  0  0  1 ]
4  [ 0  1  1  0 ]
```

Kelebihan:

```
Pengecekan apakah dua simpul bertetangga sangat cepat: O(1)
```

Kekurangan:

```
Boros memori jika graph jarang (sparse): O(V²)
```

---

### 2. Adjacency List

Setiap simpul menyimpan list dari semua simpul yang terhubung dengannya.

Ilustrasi:

```
1 → [2, 3]
2 → [1, 4]
3 → [1, 4]
4 → [2, 3]
```

Kelebihan:

```
Hemat memori untuk graph jarang: O(V + E)
```

Kekurangan:

```
Pengecekan tetangga lebih lambat dibanding adjacency matrix
```

---

### 3. Incidence Matrix

Matriks dengan simpul sebagai baris dan busur sebagai kolom. Nilai M[i][j] bernilai true jika simpul i terhubung dengan busur j.

Contoh:

```
       e1  e2  e3
simpul 1 [  1   1   0 ]
simpul 2 [  1   0   1 ]
simpul 3 [  0   1   1 ]
```

---

### 4. Incidence List

Setiap simpul menyimpan list dari busur-busur yang terhubung dengannya.

Ilustrasi:

```
simpul 1 → [e1, e2]
simpul 2 → [e1, e3]
simpul 3 → [e2, e3]
```

---

### 5. Edge List

Tabel yang berisi pasangan simpul yang membentuk setiap busur.

Contoh:

```
Busur   Simpul-1   Simpul-2
e1         1          2
e2         1          3
e3         2          3
```

---

## Graph Berarah (Directed Graph)

Pada directed graph, busur memiliki arah. Busur (a, k) berarti ada busur dari simpul a menuju simpul k.

Terminologi tambahan:

```
Predecessor  → simpul asal busur
Successor    → simpul tujuan busur
```

Ilustrasi:

```
1 → 2
3 → 5
4 → 5
3 → 2
```

---

## Implementasi Graph Berarah sebagai Multilist

Directed graph dapat diimplementasikan dengan variasi adjacency list berupa multilist yang terdiri dari dua list.

### Struktur Data

```
type Node:
  id    : integer         { identitas simpul }
  nPred : integer         { jumlah busur yang masuk ke simpul ini }
  trail : AdrSuccNode     { pointer ke list successor }
  next  : AdrNode         { pointer ke simpul berikutnya }

type SuccNode:
  succ  : AdrNode         { address simpul successor }
  next  : AdrSuccNode     { pointer ke successor berikutnya }

type Graph:
  first : AdrNode         { pointer ke simpul pertama }
```

### List Simpul (Leader List)

List berisi semua simpul dalam graph, terurut membesar berdasarkan id. Setiap elemen menyimpan id, nPred, dan pointer ke list successornya.

```
first → [1|nPred=0] → [2|nPred=1] → [3|nPred=1] → [4|nPred=0] → [5|nPred=3]
```

### List Successor (Trailer List)

Setiap simpul memiliki list yang menunjuk ke simpul-simpul successornya.

```
simpul 1 → succ: simpul 2
simpul 3 → succ: simpul 2 → succ: simpul 5
simpul 4 → succ: simpul 5
```

---

## Operasi Graph (Definisi Fungsional)

| Operasi | Keterangan |
| --- | --- |
| `CreateGraph(V, E)` | Membuat graph baru dengan simpul V dan busur E |
| `IsEmpty(G)` | Mengecek apakah graph kosong |
| `Adjacent(G, v1, v2)` | Mengecek apakah v1 dan v2 bertetangga |
| `Incident(G, v, e)` | Mengecek apakah simpul v berhubungan dengan busur e |
| `Neighbors(G, v)` | Mengembalikan daftar simpul yang bertetangga dengan v |
| `AddV(G, v)` | Menambahkan simpul v ke G |
| `DeleteV(G, v)` | Menghapus simpul v beserta semua busur yang terhubung |
| `AddE(G, v1, v2)` | Menambahkan busur (v1, v2) ke G |
| `DeleteE(G, v1, v2)` | Menghapus busur (v1, v2) dari G |

---

## Primitif Multilist Graph

### searchNode

Mencari simpul dengan id tertentu dalam graph.

```
function searchNode(g: Graph, x: integer) → AdrNode

Algoritma:
p ← g.first
while p ≠ NIL and p↑.id ≠ x do
    p ← p↑.next
searchNode ← p
```

---

### searchEdge

Mencari busur dari simpul prec menuju simpul succ.

```
function searchEdge(g: Graph, prec: integer, succ: integer) → AdrSuccNode

Algoritma:
pNode ← searchNode(g, prec)
if pNode = NIL then
    searchEdge ← NIL
else
    pt ← pNode↑.trail
    while pt ≠ NIL and pt↑.succ↑.id ≠ succ do
        pt ← pt↑.next
    searchEdge ← pt
```

---

### insertNode

Menambahkan simpul baru ke graph. Simpul disisipkan di posisi terurut berdasarkan id.

```
procedure insertNode(input/output g: Graph, input x: integer, output pn: AdrNode)

Algoritma:
pn ← newGraphNode(x)
if pn ≠ NIL then
    { sisipkan ke posisi terurut }
    if g.first = NIL or x < g.first↑.id then
        pn↑.next ← g.first
        g.first ← pn
    else
        p ← g.first
        while p↑.next ≠ NIL and p↑.next↑.id < x do
            p ← p↑.next
        pn↑.next ← p↑.next
        p↑.next ← pn
```

---

### insertEdge

Menambahkan busur dari prec menuju succ. Jika simpul belum ada, tambahkan terlebih dahulu.

```
procedure insertEdge(input/output g: Graph, input prec, succ: integer)

Algoritma:
if searchEdge(g, prec, succ) = NIL then
    pPrec ← searchNode(g, prec)
    if pPrec = NIL then
        insertNode(g, prec, pPrec)

    pSucc ← searchNode(g, succ)
    if pSucc = NIL then
        insertNode(g, succ, pSucc)

    pt ← newSuccNode(pSucc)
    if pt ≠ NIL then
        pt↑.next ← pPrec↑.trail
        pPrec↑.trail ← pt
        pSucc↑.nPred ← pSucc↑.nPred + 1
```

---

### deleteNode

Menghapus simpul beserta semua busur yang terhubung, baik yang keluar dari simpul maupun yang masuk.

```
procedure deleteNode(input/output g: Graph, input x: integer)

Langkah-langkah:
1. Hapus semua busur yang keluar dari simpul x (trailer list simpul x)
2. Hapus semua busur dari simpul lain yang menuju x
   (telusuri seluruh simpul, hapus SuccNode yang succ-nya = x, update nPred)
3. Hapus simpul x dari leader list
4. Dealokasi simpul x
```