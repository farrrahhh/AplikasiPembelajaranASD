## Menghitung Jumlah Node Pohon Biner

**Topik:** Pohon biner, rekursi, traversal

**Level:** Easy

### Deskripsi

Diberikan sebuah pohon biner dalam format pita karakter. Hitung jumlah simpul yang ada di dalam pohon tersebut.

Format pita karakter: `(akar(subpohon_kiri)(subpohon_kanan))`. Pohon kosong ditulis `()`.

### Input

Sebuah string pita karakter yang merepresentasikan pohon biner.

### Output

Sebuah bilangan bulat yang menyatakan jumlah simpul pohon.

### Constraint

```
Panjang string <= 200
Setiap simpul berupa satu karakter huruf kapital
```

### Contoh

Input:

```
(A(B()())(C()()))
```

Output:

```
3
```

### Hint

Gunakan fungsi rekursif `nbElmt` dengan basis-0:

```
if pohon kosong then
    jumlah ← 0
else
    jumlah ← 1 + nbElmt(kiri) + nbElmt(kanan)
```

---

## Jawaban

### Algoritma

Pohon dari input: A sebagai akar, B sebagai anak kiri, C sebagai anak kanan.

```
        A
       / \
      B   C
```

Jumlah = 1 (A) + 1 (B) + 1 (C) = 3.

---

## Notasi Algoritmik

```
function nbElmt(p: BinTree) → integer
{ Pohon biner mungkin kosong. Mengirim jumlah elemen dari pohon }

KAMUS LOKAL
-

ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → 1 + nbElmt(p↑.left) + nbElmt(p↑.right)
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>
#include <stdlib.h>

#define NIL NULL

typedef char ElType;
typedef struct treeNode* Address;
typedef struct treeNode {
    ElType  info;
    Address left;
    Address right;
} TreeNode;
typedef Address BinTree;

Address newTreeNode(ElType x) {
    Address p = (Address) malloc(sizeof(TreeNode));
    if (p != NIL) {
        p->info  = x;
        p->left  = NIL;
        p->right = NIL;
    }
    return p;
}

void BuildTreeFromString(BinTree *t, char *st, int *idx) {
    (*idx)++;
    if (st[*idx] == ')') {
        (*t) = NIL;
    } else {
        *t = newTreeNode(st[*idx]);
        (*idx)++;
        BuildTreeFromString(&((*t)->left),  st, idx);
        BuildTreeFromString(&((*t)->right), st, idx);
    }
    (*idx)++;
}

int nbElmt(BinTree p) {
    if (p == NIL) {
        return 0;
    } else {
        return 1 + nbElmt(p->left) + nbElmt(p->right);
    }
}

int main() {
    BinTree t;
    char s[201];
    int idx = 0;

    scanf("%s", s);
    BuildTreeFromString(&t, s, &idx);
    printf("%d\n", nbElmt(t));

    return 0;
}
```

---

## Menentukan Traversal Pre-order

**Topik:** Pohon biner, traversal pre-order, rekursi

**Level:** Easy

### Deskripsi

Diberikan sebuah pohon biner dalam format pita karakter. Cetak semua simpul pohon tersebut dalam urutan pre-order (akar - kiri - kanan), dipisahkan spasi.

### Input

Sebuah string pita karakter yang merepresentasikan pohon biner.

### Output

Semua simpul pohon dalam urutan pre-order, dipisahkan spasi.

### Constraint

```
Panjang string <= 200
Setiap simpul berupa satu karakter huruf kapital
```

### Contoh

Input:

```
(A(B(C()())(D()()))(E(F()())(G()())))
```

Output:

```
A B C D E F G
```

### Hint

Pre-order berarti cetak akar lebih dulu, baru rekursi ke kiri, lalu ke kanan:

```
cetak(akar)
preOrder(kiri)
preOrder(kanan)
```

---

## Jawaban

### Algoritma

Pohon dari input:

```
        A
       / \
      B   E
     / \ / \
    C  D F  G
```

Pre-order mengunjungi: A → B → C → D → E → F → G.

---

## Notasi Algoritmik

```
procedure printPreOrder(input p: BinTree)
{ I.S. Pohon p terdefinisi }
{ F.S. Semua simpul dicetak dalam urutan pre-order }

KAMUS LOKAL
-

ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    output(p↑.info)
    printPreOrder(p↑.left)
    printPreOrder(p↑.right)
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>
#include <stdlib.h>

#define NIL NULL

typedef char ElType;
typedef struct treeNode* Address;
typedef struct treeNode {
    ElType  info;
    Address left;
    Address right;
} TreeNode;
typedef Address BinTree;

Address newTreeNode(ElType x) {
    Address p = (Address) malloc(sizeof(TreeNode));
    if (p != NIL) {
        p->info  = x;
        p->left  = NIL;
        p->right = NIL;
    }
    return p;
}

void BuildTreeFromString(BinTree *t, char *st, int *idx) {
    (*idx)++;
    if (st[*idx] == ')') {
        (*t) = NIL;
    } else {
        *t = newTreeNode(st[*idx]);
        (*idx)++;
        BuildTreeFromString(&((*t)->left),  st, idx);
        BuildTreeFromString(&((*t)->right), st, idx);
    }
    (*idx)++;
}

int isFirst = 1;

void printPreOrder(BinTree p) {
    if (p != NIL) {
        if (!isFirst) printf(" ");
        printf("%c", p->info);
        isFirst = 0;
        printPreOrder(p->left);
        printPreOrder(p->right);
    }
}

int main() {
    BinTree t;
    char s[201];
    int idx = 0;

    scanf("%s", s);
    BuildTreeFromString(&t, s, &idx);
    printPreOrder(t);
    printf("\n");

    return 0;
}
```

---

## Menghitung Tinggi Pohon Biner

**Topik:** Pohon biner, rekursi, depth

**Level:** Easy

### Deskripsi

Diberikan sebuah pohon biner dalam format pita karakter. Hitung tinggi (kedalaman) pohon tersebut. Tinggi pohon kosong adalah 0. Tinggi pohon dengan satu simpul adalah 1.

### Input

Sebuah string pita karakter yang merepresentasikan pohon biner.

### Output

Sebuah bilangan bulat yang menyatakan tinggi pohon.

### Constraint

```
Panjang string <= 200
Setiap simpul berupa satu karakter huruf kapital
```

### Contoh

Input:

```
(A(B(C()())())(D()()))
```

Output:

```
3
```

### Hint

Tinggi pohon = 1 + maksimum tinggi antara subpohon kiri dan kanan:

```
pohon:     A
          / \
         B   D
        /
       C

Tinggi = 1 + max(tinggi(B), tinggi(D))
       = 1 + max(1 + max(tinggi(C), 0), 1)
       = 1 + max(2, 1) = 3
```

---

## Jawaban

### Algoritma

1. Jika pohon kosong, tinggi = 0.
2. Jika tidak kosong, tinggi = 1 + max(depth(kiri), depth(kanan)).

---

## Notasi Algoritmik

```
function depth(p: BinTree) → integer
{ Pohon biner mungkin kosong. Mengirim tinggi dari pohon }

KAMUS LOKAL
-

ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → 1 + max(depth(p↑.left), depth(p↑.right))
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>
#include <stdlib.h>

#define NIL NULL

typedef char ElType;
typedef struct treeNode* Address;
typedef struct treeNode {
    ElType  info;
    Address left;
    Address right;
} TreeNode;
typedef Address BinTree;

Address newTreeNode(ElType x) {
    Address p = (Address) malloc(sizeof(TreeNode));
    if (p != NIL) {
        p->info  = x;
        p->left  = NIL;
        p->right = NIL;
    }
    return p;
}

void BuildTreeFromString(BinTree *t, char *st, int *idx) {
    (*idx)++;
    if (st[*idx] == ')') {
        (*t) = NIL;
    } else {
        *t = newTreeNode(st[*idx]);
        (*idx)++;
        BuildTreeFromString(&((*t)->left),  st, idx);
        BuildTreeFromString(&((*t)->right), st, idx);
    }
    (*idx)++;
}

int depth(BinTree p) {
    if (p == NIL) {
        return 0;
    } else {
        int dLeft  = depth(p->left);
        int dRight = depth(p->right);
        return 1 + (dLeft > dRight ? dLeft : dRight);
    }
}

int main() {
    BinTree t;
    char s[201];
    int idx = 0;

    scanf("%s", s);
    BuildTreeFromString(&t, s, &idx);
    printf("%d\n", depth(t));

    return 0;
}
```