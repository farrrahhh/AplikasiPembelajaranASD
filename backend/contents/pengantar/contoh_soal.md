

## Total Tabungan Setelah Bonus

**Topik:** Algoritma dasar, input-output, operasi aritmatika

**Level:** Easy

### Deskripsi

Diberikan sebuah nilai tabungan awal `N`. Bank memberikan bonus sebesar 10% dari tabungan awal. Hitung total tabungan setelah bonus.

### Input

Sebuah bilangan bulat `N`.

### Output

Total tabungan setelah mendapat bonus.

### Constraint

```
0 <= N <= 1.000.000
```

### Contoh

Input:

```
100000
```

Output:

```
110000
```

### Hint

Bonus dihitung dengan rumus:

```
bonus = N * 10 / 100
```

---

## Jawaban

### Algoritma

1. Input nilai tabungan `N`
2. Hitung bonus:

```
bonus = N * 10 / 100
```

1. Hitung total tabungan:

```
total = N + bonus
```

1. Output `total`

---

## Notasi Algoritmik

```
Program TotalTabungan

KAMUS
N, bonus, total : integer

ALGORITMA
input(N)

bonus ← N * 10 / 100
total ← N + bonus

output(total)
```

---

## Implementasi Bahasa C

```c
#include <stdio.h>

int main() {
    int N, bonus, total;

    scanf("%d", &N);

    bonus = N * 10 / 100;
    total = N + bonus;

    printf("%d\n", total);

    return 0;
}
```