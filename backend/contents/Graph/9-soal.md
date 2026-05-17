## Menghitung Derajat Simpul

**Topik:** Graph, adjacency matrix, operasi dasar graph

**Level:** Easy

### Deskripsi

Diberikan sebuah graph tidak berarah yang direpresentasikan dengan adjacency matrix berukuran N×N. Hitung derajat dari simpul ke-K (1-indexed).

Derajat simpul adalah jumlah busur yang terhubung dengan simpul tersebut. Pada adjacency matrix undirected graph, baris ke-i menyatakan koneksi simpul i dengan simpul lainnya.

### Input

Baris pertama berisi dua bilangan bulat `N` dan `K`.

Baris berikutnya berisi N baris, masing-masing N bilangan bulat (0 atau 1) yang menyatakan adjacency matrix.

### Output

Sebuah bilangan bulat yang menyatakan derajat simpul ke-K.

### Constraint

```
1 <= N <= 100
1 <= K <= N
```

### Contoh

Input:

```
4 2
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
```

Output:

```
2
```

### Hint

Derajat simpul K dihitung dengan menjumlahkan semua nilai pada baris ke-K di adjacency matrix:

```
degree = jumlah nilai 1 pada baris K
```

---

## Jawaban

### Algoritma

1. Input N dan K
2. Input adjacency matrix A berukuran N×N
3. Hitung derajat:

```
degree ← 0
for j ← 1 to N do
    degree ← degree + A[K][j]
```

4. Output `degree`

---

## Notasi Algoritmik

```
Program DerajatSimpul

KAMUS
N, K, i, j, degree : integer
A : array [1..100][1..100] of integer

ALGORITMA
input(N, K)

for i ← 1 to N do
    for j ← 1 to N do
        input(A[i][j])

degree ← 0
for j ← 1 to N do
    degree ← degree + A[K][j]

output(degree)
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>

int main() {
    int N, K;
    int A[101][101];
    int degree = 0;

    scanf("%d %d", &N, &K);

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            scanf("%d", &A[i][j]);
        }
    }

    for (int j = 1; j <= N; j++) {
        degree += A[K][j];
    }

    printf("%d\n", degree);

    return 0;
}
```

---

## Apakah Dua Simpul Bertetangga?

**Topik:** Graph, adjacency matrix, fungsi boolean

**Level:** Easy

### Deskripsi

Diberikan graph tidak berarah dengan adjacency matrix berukuran N×N. Tentukan apakah simpul U dan simpul V bertetangga (adjacent).

### Input

Baris pertama berisi tiga bilangan bulat `N`, `U`, dan `V`.

Baris berikutnya berisi N baris adjacency matrix.

### Output

Cetak `YA` jika U dan V bertetangga, cetak `TIDAK` jika tidak.

### Constraint

```
1 <= N <= 100
1 <= U, V <= N
```

### Contoh

Input:

```
4 1 3
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
```

Output:

```
YA
```

---

## Jawaban

### Algoritma

1. Input N, U, V
2. Input adjacency matrix A
3. Cek nilai A[U][V]:

```
if A[U][V] = 1 then
    output("YA")
else
    output("TIDAK")
```

---

## Notasi Algoritmik

```
Program CekTetangga

KAMUS
N, U, V, i, j : integer
A : array [1..100][1..100] of integer

ALGORITMA
input(N, U, V)

for i ← 1 to N do
    for j ← 1 to N do
        input(A[i][j])

if A[U][V] = 1 then
    output("YA")
else
    output("TIDAK")
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>

int main() {
    int N, U, V;
    int A[101][101];

    scanf("%d %d %d", &N, &U, &V);

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            scanf("%d", &A[i][j]);
        }
    }

    if (A[U][V] == 1) {
        printf("YA\n");
    } else {
        printf("TIDAK\n");
    }

    return 0;
}
```

---

## Menghitung Jumlah Busur Graph

**Topik:** Graph, adjacency matrix, operasi dasar

**Level:** Easy

### Deskripsi

Diberikan adjacency matrix dari sebuah graph tidak berarah berukuran N×N. Hitung total jumlah busur pada graph tersebut.

Ingat: pada undirected graph, busur (u, v) dan (v, u) adalah busur yang sama. Maka total busur adalah setengah dari jumlah semua nilai 1 pada adjacency matrix (tidak termasuk diagonal).

### Input

Baris pertama berisi bilangan bulat `N`.

Baris berikutnya berisi N baris adjacency matrix.

### Output

Sebuah bilangan bulat yang menyatakan jumlah busur pada graph.

### Constraint

```
1 <= N <= 100
```

### Contoh

Input:

```
4
0 1 1 0
1 0 0 1
1 0 0 1
0 1 1 0
```

Output:

```
4
```

### Hint

Hitung hanya setengah matriks (bagian atas diagonal) untuk menghindari penghitungan ganda:

```
for i ← 1 to N do
    for j ← i+1 to N do
        if A[i][j] = 1 then
            totalBusur ← totalBusur + 1
```

---

## Jawaban

### Algoritma

1. Input N
2. Input adjacency matrix A
3. Hitung total busur dengan hanya melihat bagian atas diagonal:

```
totalBusur ← 0
for i ← 1 to N do
    for j ← i+1 to N do
        totalBusur ← totalBusur + A[i][j]
```

4. Output `totalBusur`

---

## Notasi Algoritmik

```
Program JumlahBusur

KAMUS
N, i, j, totalBusur : integer
A : array [1..100][1..100] of integer

ALGORITMA
input(N)

for i ← 1 to N do
    for j ← 1 to N do
        input(A[i][j])

totalBusur ← 0
for i ← 1 to N do
    for j ← i+1 to N do
        totalBusur ← totalBusur + A[i][j]

output(totalBusur)
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>

int main() {
    int N;
    int A[101][101];
    int totalBusur = 0;

    scanf("%d", &N);

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            scanf("%d", &A[i][j]);
        }
    }

    for (int i = 1; i <= N; i++) {
        for (int j = i + 1; j <= N; j++) {
            totalBusur += A[i][j];
        }
    }

    printf("%d\n", totalBusur);

    return 0;
}
```