# Pohon Biner (Binary Tree)

**Pohon (Tree)** adalah struktur data hierarkis yang terdiri dari sekumpulan simpul yang saling terhubung. Pohon didefinisikan secara rekursif:

```
Pohon = Akar + kumpulan SubPohon yang disjoint
```

Contoh nyata penggunaan pohon:

```
Menu aplikasi      → Menu utama sebagai akar, submenu sebagai anak
Susunan bab buku   → Bab sebagai akar, subbab sebagai anak
Pohon keluarga     → Orang tua sebagai akar, anak sebagai child
```

---

## Istilah dalam Pohon

| Istilah | Penjelasan |
| --- | --- |
| Akar (Root) | Simpul paling atas, tidak punya parent |
| Ayah (Parent) | Simpul yang memiliki anak |
| Anak (Child) | Simpul yang memiliki parent |
| Saudara (Sibling) | Simpul yang memiliki parent yang sama |
| Daun (Leaf) | Simpul tanpa anak (simpul terminal) |
| Jalan (Path) | Urutan simpul dari satu simpul ke simpul lain |
| Derajat (Degree) | Jumlah anak sebuah simpul |
| Tingkat (Level) | Panjang jalan dari akar ke simpul tertentu |
| Kedalaman (Depth) | Tingkat terpanjang dalam pohon |
| Lebar (Breadth) | Jumlah maksimum simpul pada suatu tingkat |

Contoh pohon dengan tingkat (level):

```
        a          ← level 1 (akar)
       / \
      b   c        ← level 2
     / \ / \
    d  e g  h      ← level 3
           |
           i       ← level 4 (kedalaman = 4)
```

Penjelasan:

```
derajat(c) = 2  → c punya 2 anak: g dan h
derajat(h) = 1  → h punya 1 anak: i
derajat(g) = 0  → g tidak punya anak (daun)
tingkat(e) = 3
tingkat(i) = 4
kedalaman pohon = 4
```

---

## Definisi Rekursif Pohon

Pohon adalah himpunan terbatas, tidak kosong:

```
Basis    → sebuah simpul tunggal (akar)
Rekurens → akar + sekumpulan subpohon yang disjoint
```

Suffiks **-aire** menunjukkan berapa maksimum subpohon yang dimiliki:

```
Binary (Binaire) → maksimum 2 subpohon
N-aire           → maksimum N subpohon
```

---

## Pohon Biner

**Pohon biner** adalah himpunan terbatas yang:

```
- Mungkin kosong, atau
- Terdiri dari sebuah akar dan dua subpohon yang disjoint:
  subpohon kiri dan subpohon kanan
```

Ilustrasi:

```
        akar
       /    \
   kiri      kanan
  (subpohon) (subpohon)
```

Contoh pohon biner untuk ekspresi `3 + (4 * 5)`:

```
      +
     / \
    3   *
       / \
      4   5
```

### Jenis Pohon Biner Khusus

**Pohon condong kiri (left skewed tree):** semua simpul hanya punya anak kiri.

```
a
|
b (kiri)
|
c (kiri)
```

**Pohon condong kanan (right skewed tree):** semua simpul hanya punya anak kanan.

```
a
 \
  b (kanan)
   \
    c (kanan)
```

---

## ADT Pohon Biner dengan Representasi Berkait

Pohon biner diimplementasikan sebagai linked structure dengan setiap node memiliki tiga field.

### Struktur Data (Notasi Algoritmik)

```
type BinTree: Address

type TreeNode:
  info  : ElType    { nilai simpul / akar }
  left  : BinTree   { subpohon kiri }
  right : BinTree   { subpohon kanan }
```

Pohon biner kosong dinyatakan dengan `p = NIL`.

### Struktur Data dalam Bahasa C

```c
#define NIL NULL

typedef int ElType;
typedef struct treeNode* Address;
typedef struct treeNode {
    ElType  info;
    Address left;
    Address right;
} TreeNode;

typedef Address BinTree;
```

### Selektor

Jika `p` adalah BinTree, maka:

```
p↑.info  → akar dari p
p↑.left  → subpohon kiri p
p↑.right → subpohon kanan p
```

---

## Konstruktor dan Memory Management

### Konstruktor

```
function NewTree(akar: ElType, l: BinTree, r: BinTree) → BinTree
{ Menghasilkan pohon biner dari akar, l, dan r jika alokasi berhasil }
{ Menghasilkan NIL jika alokasi gagal }

procedure CreateTree(input akar: ElType,
                     input l: BinTree, input r: BinTree,
                     output p: BinTree)
{ I.S. Sembarang }
{ F.S. Menghasilkan pohon p dari akar, l, r }
```

### Memory Management

```
function newTreeNode(x: ElType) → Address
{ Mengalokasi sebuah node bernilai x }
{ Jika berhasil: p↑.info=x, p↑.left=NIL, p↑.right=NIL }
{ Jika gagal: mengembalikan NIL }

procedure deallocTreeNode(input/output p: Address)
{ I.S. p terdefinisi }
{ F.S. p dikembalikan ke sistem }
```

---

## Predikat Penting

### isTreeEmpty

Mengecek apakah pohon kosong.

```
function isTreeEmpty(p: BinTree) → boolean
ALGORITMA
→ (p = NIL)
```

### isOneElmt

Mengecek apakah pohon hanya punya satu simpul (akar saja).

```
function isOneElmt(p: BinTree) → boolean
ALGORITMA
if not(isTreeEmpty(p)) then
    → (p↑.left = NIL) and (p↑.right = NIL)
else
    → false
```

### isUnerLeft, isUnerRight, isBiner

```
function isUnerLeft(p: BinTree) → boolean
{ true jika p tidak kosong dan hanya punya subpohon kiri }

function isUnerRight(p: BinTree) → boolean
{ true jika p tidak kosong dan hanya punya subpohon kanan }

function isBiner(p: BinTree) → boolean
{ true jika p tidak kosong dan punya subpohon kiri dan kanan }
```

---

## Pemrosesan Rekursif Pohon Biner

Pohon biner diproses secara rekursif. Ada dua jenis basis:

**Basis-0:** pohon kosong sebagai basis (menggunakan `isTreeEmpty`).

```
if isTreeEmpty(p) then
    { basis: tidak ada yang diproses }
else
    { rekurens }
```

**Basis-1:** pohon satu elemen sebagai basis (menggunakan `isOneElmt`).

```
if isOneElmt(p) then
    { basis: proses akar saja }
else
    depend on p
        isUnerLeft(p) : { proses kiri saja }
        isUnerRight(p): { proses kanan saja }
        isBiner(p)    : { proses kiri dan kanan }
```

---

## Traversal Pohon Biner

Traversal adalah cara mengunjungi seluruh simpul pohon. Ada tiga urutan traversal.

### Pre-order (Akar - Kiri - Kanan)

```
procedure preOrder(input p: BinTree)
ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    proses(p)
    preOrder(p↑.left)
    preOrder(p↑.right)
```

Contoh pada pohon A-B(C,D)-E(F,G):

```
        A
       / \
      B   E
     / \ / \
    C  D F  G

Pre-order: A - B - C - D - E - F - G
```

### In-order (Kiri - Akar - Kanan)

```
procedure inOrder(input p: BinTree)
ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    inOrder(p↑.left)
    proses(p)
    inOrder(p↑.right)
```

```
In-order: C - B - D - A - F - E - G
```

### Post-order (Kiri - Kanan - Akar)

```
procedure postOrder(input p: BinTree)
ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    postOrder(p↑.left)
    postOrder(p↑.right)
    proses(p)
```

```
Post-order: C - D - B - F - G - E - A
```

---

## Fungsi-Fungsi Umum pada Pohon Biner

### Menghitung Jumlah Elemen (nbElmt)

**Basis-0:**

```
function nbElmt(p: BinTree) → integer
{ Pohon mungkin kosong }
ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → 1 + nbElmt(p↑.left) + nbElmt(p↑.right)
```

**Basis-1:**

```
function nbElmt(p: BinTree) → integer
{ Pohon tidak kosong }
ALGORITMA
if isOneElmt(p) then
    → 1
else
    depend on p
        isUnerLeft(p) : → 1 + nbElmt(p↑.left)
        isUnerRight(p): → 1 + nbElmt(p↑.right)
        isBiner(p)    : → 1 + nbElmt(p↑.left) + nbElmt(p↑.right)
```

---

### Menghitung Jumlah Daun (nbLeaf)

Daun adalah simpul tanpa anak. Untuk pohon mungkin kosong:

```
function nbLeaf(p: BinTree) → integer
ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → nbLeaf1(p)
```

`nbLeaf1` (basis-1, pohon tidak kosong):

```
function nbLeaf1(p: BinTree) → integer
ALGORITMA
if isOneElmt(p) then
    → 1
else
    depend on p
        isUnerLeft(p) : → nbLeaf1(p↑.left)
        isUnerRight(p): → nbLeaf1(p↑.right)
        isBiner(p)    : → nbLeaf1(p↑.left) + nbLeaf1(p↑.right)
```

---

### Tinggi/Kedalaman Pohon (depth)

```
function depth(p: BinTree) → integer
{ Pohon mungkin kosong }
ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → 1 + max(depth(p↑.left), depth(p↑.right))
```

---

### Menambah Daun Terkiri (addLeft)

```
procedure addLeft(input/output p: BinTree, input x: ElType)
{ I.S. p boleh kosong }
{ F.S. x ditambahkan sebagai daun terkiri }
ALGORITMA
if isTreeEmpty(p) then
    p ← newTreeNode(x)
else
    addLeft(p↑.left, x)
```

---

### Menghapus Daun Terkiri (delLeft)

```
procedure delLeft(input/output p: BinTree, output x: ElType)
{ I.S. p tidak kosong }
{ F.S. Daun terkiri dihapus, nilainya disimpan di x }
KAMUS LOKAL
n: Address
ALGORITMA
if isOneElmt(p) then
    x ← p↑.info
    n ← p
    p ← NIL
    deallocTreeNode(n)
else
    depend on p
        isUnerRight(p): delLeft(p↑.right, x)
        else           : delLeft(p↑.left, x)
```

---

## Pohon Biner Seimbang (Balanced Binary Tree)

Pohon biner seimbang adalah pohon yang memenuhi:

```
- Selisih tinggi subpohon kiri dan kanan maksimum 1
- Selisih jumlah simpul subpohon kiri dan kanan maksimum 1
- Subpohon kiri dan kanan juga pohon seimbang
```

Contoh pohon seimbang untuk N = 1 sampai 7:

```
N=1:  O

N=3:    O
       / \
      O   O

N=7:      O
         / \
        O   O
       / \ / \
      O  O O  O
```

Aplikasi: pengelolaan indeks dalam file system dan database system.

### Algoritma Membangun Pohon Seimbang

```
function buildBalancedTree(n: integer) → BinTree
{ Menghasilkan balanced tree dari n node }
ALGORITMA
if n = 0 then
    → NIL
else
    input(x)
    p ← newTreeNode(x)
    nL ← n div 2
    nR ← n - nL - 1
    p↑.left  ← buildBalancedTree(nL)
    p↑.right ← buildBalancedTree(nR)
    → p
```

---

## Binary Search Tree (BST)

**Binary Search Tree (BST)** atau pohon biner pencarian adalah pohon biner dengan aturan:

```
Semua simpul subpohon kiri < Akar
Semua simpul subpohon kanan >= Akar
```

Ilustrasi:

```
        8
       / \
      3   10
     / \    \
    1   6    14
```

Penjelasan:

```
1, 3, 6 < 8  → di subpohon kiri
10, 14 >= 8  → di subpohon kanan
```

Struktur data BST (key unik, count menyimpan kemunculan):

```
type ElType:
  key   : ...     { nilai unik }
  count : integer { jumlah kemunculan }
```

### Insert Node ke BST

```
procedure insSearchTree(input x: ElType, input/output p: BinTree)
ALGORITMA
if isTreeEmpty(p) then
    CreateTree(x, NIL, NIL, p)
else
    depend on x, p↑.info.key
        x.key = p↑.info.key : p↑.info.count ← p↑.info.count + 1
        x.key < p↑.info.key : insSearchTree(x, p↑.left)
        x.key > p↑.info.key : insSearchTree(x, p↑.right)
```

### Delete Node dari BST

Penghapusan node di BST memiliki beberapa kasus:

```
isOneElmt(q)  → p ← NIL
isUnerLeft(q) → p ← q↑.left
isUnerRight(q)→ p ← q↑.right
isBiner(q)    → ganti nilai q dengan daun terkanan subpohon kirinya,
                lalu hapus daun terkanan tersebut
```

Prosedur `delNode` mencari daun terkanan dari subpohon kiri untuk menggantikan node yang dihapus:

```
procedure delNode(input/output p: BinTree)
{ Mencari daun terkanan, salin nilainya ke q, lalu hapus }
ALGORITMA
depend on p
    p↑.right ≠ NIL: delNode(p↑.right)
    p↑.right = NIL:
        q↑.info.key   ← p↑.info.key
        q↑.info.count ← p↑.info.count
        q ← p
        p ← p↑.left
```

---

## Membangun Pohon dari Pita Karakter

Ekspresi pohon dalam bentuk linier ditulis dengan format:

```
(akar (subpohon_kiri) (subpohon_kanan))
```

Contoh:

```
(A()())          → pohon satu simpul A

(A(B()())(C()())) → pohon:
                        A
                       / \
                      B   C
```

Ada dua cara membangun pohon dari pita karakter:

```
Ide 1 → Iteratif (membutuhkan pointer ke parent)
Ide 2 → Rekursif (lebih sederhana, hanya perlu mesin karakter)
```

### Ide 2: Membangun Secara Rekursif (dalam C)

```c
void BuildTree(Tree *t) {
    adv();
    if (cc == ')') {     /* Basis: pohon kosong */
        (*t) = NIL;
    } else {             /* Rekurens */
        *t = newTreeNode(cc);
        adv();
        BuildTree(&(LEFT(*t)));
        BuildTree(&(RIGHT(*t)));
    }
    adv();
}
```

Pohon juga bisa dibangun dari string dengan mengganti mesin karakter menjadi indeks string:

```c
void BuildTreeFromString(Tree *t, char *st, int *idx) {
    (*idx)++;
    if (st[*idx] == ')') {
        (*t) = NIL;
    } else {
        *t = newTreeNode(st[*idx]);
        (*idx)++;
        BuildTreeFromString(&LEFT(*t), st, idx);
        BuildTreeFromString(&RIGHT(*t), st, idx);
    }
    (*idx)++;
}
```