import json

import httpx

from app.config import settings

SOAL_SCHEMA_NOTASI = (
    '{\n'
    '  "soal": [\n'
    '    {\n'
    '      "id": integer mulai dari 1,\n'
    '      "tipe": "pengetahuan" atau "implementasi",\n'
    '      "topik": [array string konsep],\n'
    '      "pertanyaan": string pertanyaan lengkap dan jelas,\n'
    '      "notasiAlgoritma": string notasi algoritmik lengkap, atau null jika tipe pengetahuan\n'
    '    }\n'
    '  ]\n'
    '}'
)

SOAL_SCHEMA_NOTASI_REFERENSI = (
    '{\n'
    '  "soal": [\n'
    '    {\n'
    '      "id": integer mulai dari 1,\n'
    '      "tipe": "pengetahuan" atau "implementasi",\n'
    '      "topik": [array string konsep],\n'
    '      "pertanyaan": string pertanyaan lengkap dan jelas,\n'
    '      "notasiAlgoritma": string notasi algoritmik lengkap sebagai referensi (untuk tipe implementasi, jika relevan), atau null jika tipe pengetahuan\n'
    '    }\n'
    '  ]\n'
    '}'
)

SOAL_SCHEMA_DEKLARASI = (
    '{\n'
    '  "soal": [\n'
    '    {\n'
    '      "id": integer mulai dari 1,\n'
    '      "tipe": "pengetahuan" atau "implementasi",\n'
    '      "topik": [array string konsep],\n'
    '      "pertanyaan": string pertanyaan lengkap dan jelas,\n'
    '      "notasiAlgoritma": string deklarasi tipe + signature + komentar IS/FS sebagai referensi (untuk implementasi), atau null untuk pengetahuan\n'
    '    }\n'
    '  ]\n'
    '}'
)

TOPIC_CONFIGS: dict[str, dict] = {
    "pengantar": {
        "nama": "Pengantar ASD",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (spesifikasi I.S./F.S. untuk prosedur, KAMUS LOKAL, ALGORITMA). Minta mahasiswa mengimplementasikan ke bahasa C.\n'
            '- Soal harus berbeda dari soal-soal yang umum/biasa dan menguji pemahaman yang lebih dalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI,
        "cakupan": 'algoritma dasar, paradigma prosedural, ADT (Abstract Data Type), fungsi & prosedur, rekursi, pointer & pass-by-reference, modularitas C (.h/.c/main.c), notasi algoritmik IF2111.',
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep)\n'
            '- 3 soal bertipe "implementasi" (kode C + notasi algoritmik)'
        ),
        "tipe_label_impl": '"implementasi" (wajib sertakan notasi algoritmik lengkap + implementasi bahasa C)',
    },
    "adt-sederhana": {
        "nama": "ADT Sederhana",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (spesifikasi I.S./F.S. untuk prosedur, KAMUS LOKAL, ALGORITMA). Minta mahasiswa mengimplementasikan ke bahasa C.\n'
            '- Soal harus berbeda dari soal-soal yang umum/biasa dan menguji pemahaman yang lebih dalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI,
        "cakupan": (
            'definisi dan konsep ADT, komponen ADT (konstruktor, selektor, predikat, operasi I/O, operasi lain), '
            'implementasi ADT POINT dalam bahasa C, penggunaan macro preprocessor sebagai selektor (#define ABSIS(p) (p).x), '
            'notasi algoritmik IF2111, file header .h dan file implementasi .c, include guard (#ifndef/#define/#endif), '
            'tipe boolean yang dibuat sendiri, kompilasi multi-file dengan gcc.'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep)\n'
            '- 3 soal bertipe "implementasi" (kode C + notasi algoritmik)'
        ),
        "tipe_label_impl": '"implementasi" (wajib sertakan notasi algoritmik lengkap + implementasi bahasa C)',
    },
    "aplikasi": {
        "nama": "Aplikasi Struktur Data",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (KAMUS, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'Cakupan materi: Aplikasi Struktur Data — empat studi kasus utama:\n\n'

            '(1) POLINOM: definisi P(x) = aₙxⁿ + ... + a₀, indeks koefisien mulai a₀, '
            'sentinel ⟨−999, 0⟩ untuk akhir input, '
            'lima proses: membentuk/menuliskan/menjumlahkan/mengurangi/menurunkan, '
            'Representasi Kontigu: arrSuku[i]=koefisien suku ke-i, Degree=derajat tertinggi, Polinom kosong: Degree=−999, '
            'prosedur: CreatePolinom, adjustDegree (diperlukan jika koefisien tertinggi menjadi 0 setelah add/sub), populatePol, displayPol, addPol, subPol, derivPol, '
            'algoritma derivasi kontigu: for i=Degree downto 1: arrSuku1[i−1] = i×arrSuku[i]; Degree1=Degree−1, '
            'Representasi Berkait: type Suku=⟨degree, coef, next⟩, type Polinom=Address, list terurut menurun berdasarkan degree, '
            'penjumlahan berkait: teknik merging dua list terurut (degree sama→jumlahkan/jika 0 tidak sisipkan, beda→salin yang lebih besar), '
            'turunan berkait: InsertLast ke P1 untuk setiap suku berderajat >0 dengan ⟨degree−1, degree×coef⟩, '
            'representasi fisik berkait: dengan pointer (pt↑.next) atau tabel (arrSuku[pt].next, initialize/newSuku/deallocSuku), '

            '(2) PENGELOLAAN MEMORI: NB blok kontigu, status F=KOSONG/T=ISI, '
            'zone bebas=rangkaian blok KOSONG berurutan dinyatakan ⟨Aw, Nb⟩, '
            'prosedur: InitMem/AlokBlok(X,IAw)/DeAlokBlok(X,IAw)/GarbageCollection, '
            'Representasi Kontigu: STATMEM array[1..NB] of boolean, '
            'First Fit: zone kosong pertama yang cukup (stop early), Best Fit: zone terkecil yang cukup (scan semua), '
            'GarbageCollection kontigu: dua pass (hitung NKosong, set array) atau satu pass (tukar KOSONG-ISI), '
            'Representasi Berkait Blok Kosong: type ZB=⟨Aw, Nb, Next⟩, FIRSTZB terurut menurut Aw, '
            'InitMem berkait: buat satu elemen ⟨1, NB⟩, '
            'AlokBlok First Fit berkait: sequential search Nb(P)≥X, jika Nb(P)=X→delete, jika Nb(P)>X→update Aw+Nb, '
            'DeAlokBlok berkait: 4 kasus (gabung kiri/gabung kanan/gabung keduanya/tidak gabung→insert baru terurut), '
            'GarbageCollection berkait: hitung total, ganti list dengan satu elemen ⟨1, total⟩, '

            '(3) MULTI-LIST: data Pegawai (nip,nama,jabatan,gajiPokok) dan Anak (nama,tglLahir), '
            'Alternatif 1: Pegawai memiliki firstAnak→list Anak sendiri (type Pegawai=⟨...,firstAnak,nextPeg⟩, type Anak=⟨nama,tglLahir,nextAnak⟩), '
            'Alternatif 2: list Anak global dengan father pointer (type Anak=⟨nama,tglLahir,father:AdrPeg,nextAnak⟩, FirstPeg dan FirstAnak terpisah), '
            'perbandingan: Alt1 efisien untuk "daftar anak tiap pegawai", Alt2 efisien untuk "daftar anak <18th" dan "cari orang tua dari nama anak" (via father pointer O(1)), '

            '(4) RELASI M-N (Dosen-MataKuliah): '
            'Alternatif 1: list MK per dosen (mudah "MK yang diajar Dosen X", sulit "siapa mengajar MK Y"), '
            'Alternatif 2: list Dosen per MK (kebalikan Alt1), '
            'Alternatif 3: list relasi terpisah MK_DOS=⟨dosen:AdrDosen, mk:AdrMK, next⟩ (fleksibel kedua arah), '
            'AddRel(D,MK): (1) cek/tambah D di list Dosen, (2) cek/tambah MK di list MK, (3) cek duplikat ⟨D,MK⟩, (4) insert node relasi baru, '
            'pengembangan: relasi dalam list yang sama (prerequisite antar MK), satu objek banyak relasi.'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (perbandingan representasi, analisis pilihan struktur data, kelemahan konsep)\n'
            '- 3 soal bertipe "implementasi" (trace algoritma polinom, simulasi alokasi memori First/Best Fit, sketsa algoritma multi-list atau relasi M-N)'
        ),
        "tipe_label_impl": '"implementasi" (sertakan notasi algoritmik lengkap sebagai referensi jika relevan)',
    },
    "binary-tree": {
        "nama": "Pohon Biner (Binary Tree)",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (I.S./F.S., KAMUS LOKAL, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'Cakupan materi: '
            'Pohon Biner — definisi rekursif (mungkin kosong ATAU akar + subpohon kiri + subpohon kanan yang disjoint), '
            'istilah (akar/root, ayah/parent, anak/child, saudara/sibling, daun/leaf, jalan/path, derajat/degree, tingkat/level, kedalaman/depth, lebar/breadth), '
            'jenis khusus (pohon condong kiri/left skewed, pohon condong kanan/right skewed), '
            'ADT representasi berkait: type BinTree = Address, type TreeNode = <info: ElType, left: BinTree, right: BinTree>, C struct treeNode, pohon kosong = NIL, '
            'selektor: p↑.info, p↑.left, p↑.right, '
            'konstruktor: NewTree(akar,l,r)→BinTree, CreateTree(akar,l,r,p), '
            'memory management: newTreeNode(x)→Address (alokasi+inisialisasi left/right=NIL), deallocTreeNode(p), '
            'predikat: isTreeEmpty(p) = p=NIL, isOneElmt(p) = left=NIL AND right=NIL, isUnerLeft(p), isUnerRight(p), isBiner(p), '
            'pemrosesan rekursif Basis-0 (isTreeEmpty sebagai basis) vs Basis-1 (isOneElmt sebagai basis, depend on isUnerLeft/isUnerRight/isBiner), '
            'traversal Pre-order (akar→kiri→kanan), In-order (kiri→akar→kanan), Post-order (kiri→kanan→akar), '
            'fungsi nbElmt dengan basis-0: if isTreeEmpty → 0 else → 1+nbElmt(left)+nbElmt(right), '
            'fungsi nbElmt dengan basis-1: depend on isOneElmt/isUnerLeft/isUnerRight/isBiner, '
            'fungsi nbLeaf (daun = isOneElmt): nbLeaf + nbLeaf1 dengan basis-1, '
            'fungsi depth: if isTreeEmpty → 0 else → 1+max(depth(left),depth(right)), '
            'prosedur addLeft: tambah daun terkiri rekursif, '
            'prosedur delLeft: hapus daun terkiri rekursif, '
            'Pohon Biner Seimbang (Balanced Binary Tree): selisih tinggi subpohon ≤1, selisih jumlah simpul ≤1, buildBalancedTree(n), '
            'BST (Binary Search Tree): semua node kiri < akar ≤ semua node kanan, '
            'insSearchTree: jika kosong buat node, jika key sama tambah count, jika lebih kecil masuk kiri, jika lebih besar masuk kanan, '
            'delete di BST: 4 kasus (isOneElmt→NIL, isUnerLeft→ambil kiri, isUnerRight→ambil kanan, isBiner→ganti dengan daun terkanan subpohon kiri), '
            'delNode: cari daun terkanan subpohon kiri, salin nilai, hapus daun, '
            'membangun pohon dari pita karakter: format (akar(left)(right)), pohon kosong=(), BuildTree dengan mesin karakter (adv/cc), BuildTreeFromString(t,st,idx) dengan indeks string.'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan, analisis, traversal trace, atau istilah)\n'
            '- 3 soal bertipe "implementasi" (tulis notasi algoritmik, implementasi C, atau trace eksekusi)'
        ),
        "tipe_label_impl": '"implementasi" (sertakan notasi algoritmik lengkap sebagai referensi jika relevan)',
    },
    "graph": {
        "nama": "Graph",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (KAMUS, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'Cakupan materi: '
            'Graph — definisi G=(V,E), V=simpul (vertices/nodes) tidak boleh kosong, E=busur (edges) boleh kosong, '
            'terminologi: bertetangga/adjacent (dua simpul dihubungkan busur), berhubungan/incident (simpul terhubung dengan busur), derajat/degree (jumlah busur yang terhubung ke simpul), '
            'variasi graph: weighted (busur berbobot), directed/berarah (a→b ≠ b→a), undirected/tak-berarah (a—b = b—a), simple (undirected tanpa loop tanpa multi-edge), regular (semua simpul berderajat sama), complete (setiap pasang simpul terhubung), empty (tanpa busur), '
            'aplikasi: jaringan komunikasi, struktur molekul, jaringan sosial, peta jalan, '
            'representasi graph: '
            '(1) Adjacency Matrix — matriks n×n, M[i][j]=jumlah busur antara i dan j, cek tetangga O(1), memori O(V²), cocok untuk dense graph; '
            '(2) Adjacency List — setiap simpul menyimpan list tetangganya, memori O(V+E), cocok untuk sparse graph; '
            '(3) Incidence Matrix — baris=simpul, kolom=busur, M[i][j]=true jika simpul i terhubung busur j; '
            '(4) Incidence List — setiap simpul menyimpan list busurnya; '
            '(5) Edge List — tabel pasangan simpul per busur; '
            'directed graph: predecessor (asal busur), successor (tujuan busur), '
            'implementasi multilist directed graph: '
            'type Node = <id, nPred, trail: AdrSuccNode, next: AdrNode>, '
            'type SuccNode = <succ: AdrNode, next: AdrSuccNode>, '
            'type Graph = <first: AdrNode>, '
            'leader list (list simpul terurut berdasarkan id), trailer list (list successor per simpul), '
            'nPred = jumlah busur masuk ke simpul, '
            'primitif: searchNode(g,x)→AdrNode (linear search berdasarkan id), '
            'searchEdge(g,prec,succ)→AdrSuccNode (cari di trailer list simpul prec), '
            'insertNode(g,x,pn) — sisipkan ke posisi terurut di leader list, '
            'insertEdge(g,prec,succ) — cek duplikat dengan searchEdge, tambah SuccNode di trailer prec, increment nPred succ, '
            'deleteNode(g,x) — 4 langkah: hapus trailer list simpul x, hapus SuccNode yang menuju x dari semua simpul lain + update nPred, hapus x dari leader list, dealokasi.'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan representasi, analisis, terminologi)\n'
            '- 3 soal bertipe "implementasi" (tulis notasi algoritmik, simulasi adjacency matrix, atau trace primitif multilist)'
        ),
        "tipe_label_impl": '"implementasi" (sertakan notasi algoritmik lengkap sebagai referensi jika relevan)',
    },
    "list": {
        "nama": "ADT List",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (spesifikasi I.S./F.S. untuk prosedur, KAMUS LOKAL, ALGORITMA). Minta mahasiswa menulis notasi algoritmik lengkap atau mengimplementasikan ke bahasa C.\n'
            '- Soal harus berbeda dari soal-soal yang umum/biasa dan menguji pemahaman yang lebih dalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'definisi ADT List (ordered, head, length, traversal), operasi dasar List (isEmpty, length, getElmt, setElmt, indexOf, concat), '
            'operasi insert (insertFirst, insertAt, insertLast), operasi delete (deleteFirst, deleteAt, deleteLast), '
            'implementasi dengan array (implisit/mark vs eksplisit/nEff, rata kiri vs tidak rata kiri), '
            '5 alternatif implementasi (alt-1a, alt-2a, alt-1b, alt-2b, alt-3), notasi algoritmik IF2111 untuk List, '
            'fungsi antara firstIdx/lastIdx/isIdxEff, implementasi array dinamis (strategi resize 2× dan 0.5×, realloc), '
            'elemen tersebar (alt-3 dengan defragmen), perbandingan efisiensi O(1) vs O(n) untuk tiap alternatif, pola traversal per alternatif.'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep)\n'
            '- 3 soal bertipe "implementasi" (notasi algoritmik + kode)'
        ),
        "tipe_label_impl": '"implementasi" (wajib sertakan notasi algoritmik lengkap sebagai referensi)',
    },
    "list-linier": {
        "nama": "List Linier (Struktur Berkait)",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan deklarasi tipe dan signature fungsi yang relevan sebagai referensi. Minta mahasiswa menulis kode C lengkap.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_DEKLARASI,
        "cakupan": (
            'Cakupan materi: List Linier (Struktur Berkait) — '
            'Definisi: node = ⟨info: ElType, next: Address⟩, Address = pointer to Node, '
            'newNode(val) mengalokasi dan mengisi node baru; '

            'Representasi implisit: type List = Address (L=NIL jika kosong), cocok untuk rekursi; '
            'Representasi eksplisit: type List = ⟨first: Address⟩ atau type Queue = ⟨head, tail: Address⟩, cocok untuk Queue; '
            'Masalah rekursi pada eksplisit: l.first↑.next bertipe Address bukan List, tidak bisa di-pass langsung ke fungsi rekursif; '

            'Array of Node: next = indeks bukan alamat fisik, alokasi massal, node kosong membentuk stack internal (free list); '

            'Variasi list: list biasa (First=NIL), list+First&Last, list elemen terakhir→diri sendiri, '
            'list dummy akhir+Last (kosong: First=Last=dummy@, search dengan sentinel), '
            'list pointer ganda (DLL), list sirkuler (Next(last)=First); '

            'List dengan Dummy (sentinel): '
            'type List = ⟨first, last: Address⟩, kosong: First=Last=dummy@, '
            'indexOf dengan sentinel: simpan x ke INFO(LAST(l)), loop tanpa cek NIL, cek p≠LAST untuk bedakan found vs not found, '
            'insertFirst: NEXT(p)=FIRST, FIRST=p; '
            'insertLast versi 1 (dummy tetap): sisip node baru sebelum dummy via traversal, '
            'insertLast versi 2 (dummy berubah): isi dummy dengan x, alokasi dummy baru, update LAST; '
            'deleteFirst: simpan p=FIRST, FIRST=NEXT(FIRST), free(p); '
            'deleteLast: traversal untuk cari precLast, perbarui NEXT(precLast)=LAST, free(elemen terakhir nyata); '

            'Doubly Linked List (DLL): node = ⟨prev, info, next⟩, type List = ⟨first, last⟩, '
            'insertFirst: NEXT(p)=FIRST, PREV(p)=NIL, jika tidak kosong PREV(FIRST)=p else LAST=p, FIRST=p; '
            'insertLast: PREV(p)=LAST, NEXT(p)=NIL, jika tidak kosong NEXT(LAST)=p else FIRST=p, LAST=p; '
            'deleteFirst: jika 1 elemen LAST=NIL else PREV(NEXT(FIRST))=NIL, FIRST=NEXT(FIRST), free(p); '
            'deleteLast: jika 1 elemen FIRST=NIL else NEXT(PREV(LAST))=NIL, LAST=PREV(LAST), free(p); '
            'keunggulan: deleteLast O(1) tanpa traversal; '

            'List Sirkuler: Next(last)=First, kosong: First=NIL, '
            'insertFirst: jika kosong NEXT(p)=p, else traversal ke last, NEXT(p)=FIRST, NEXT(last)=p, FIRST=p; '
            'insertLast: jika kosong pakai insertFirst, else traversal ke last, NEXT(last)=p, NEXT(p)=FIRST; '
            'deleteFirst: jika 1 elemen FIRST=NIL, else traversal ke last, FIRST=NEXT(FIRST), NEXT(last)=FIRST, free(p); '
            'deleteLast: traversal dengan precLast, jika 1 elemen FIRST=NIL, else NEXT(precLast)=FIRST, free(last); '
            'displayList: do-while karena harus proses First sebelum cek kondisi; '
            'addrSearch: traversal sampai NEXT(pt)=First atau pt=p; '

            'Stack berkait: type Stack = ⟨addrTop: Address⟩, push≡insertFirst O(1), pop≡deleteFirst O(1); '
            'Queue berkait: type Queue = ⟨addrHead, addrTail: Address⟩, enqueue≡insertLast O(1), dequeue≡deleteFirst O(1); '
            'Priority Queue: node = ⟨info, prio, next⟩, enqueue = sortedInsert O(n), dequeue = deleteFirst O(1); '
            'sortedInsert: traversal Prec+P sampai INFO(P)≥x, NEXT(baru)=P dulu lalu NEXT(Prec)=baru, jika Prec=NIL update First; '

            'Operasi umum list: countPos (hitung elemen>0), max (nilai terbesar), searchPos (address elemen positif pertama), '
            'deleteNeg (hapus semua <0 dengan dealokasi), copyPos (salin elemen>0 ke list baru), updateList (ganti kemunculan pertama x dengan y).'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (perbandingan variasi list, analisis kompleksitas, kelebihan/kekurangan, pertanyaan konsep mendalam)\n'
            '- 3 soal bertipe "implementasi" (tulis fungsi C lengkap: operasi list biasa, DLL, list sirkuler, stack, queue, priority queue, atau sortedInsert)'
        ),
        "tipe_label_impl": '"implementasi" (sertakan deklarasi tipe dan signature fungsi sebagai referensi)',
    },
    "mesin-karakter": {
        "nama": "Mesin Karakter dan Mesin Kata",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (I.S./F.S., KAMUS LOKAL, ALGORITMA). Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'konsep mesin abstrak, komponen mesin karakter (pita, CC/current character, EOP/end of pita, MARK=\'.\', tombol start/adv), '
            'primitif start dan adv (I.S./F.S.), pola pemrosesan pita karakter (first elmt/next elmt/while cc≠MARK), '
            'studi kasus mesin karakter (CountCharacters, CountA, Hitung-LE), '
            'konsep mesin kata (kata = deretan karakter non-blank, type Kata dengan buffer dan length), '
            'primitif bersama ignoreBlank dan salinKata, '
            'tiga versi model akuisisi kata (Versi 1 dengan endKata boolean, Versi 2 dengan length=0 sebagai sentinel, Versi 3 dengan cc=MARK langsung dan initAkses), '
            'pola penggunaan dan perbedaan ketiga versi, '
            'implementasi di C (mesinkar.h, mesinkar.c, mesinkata1.h, mesinkata1.c), '
            'studi kasus mesin kata (panjang rata-rata kata, hitung kemunculan kata WHILE, fungsi isKataEqual), '
            'kompilasi multi-file dengan cc/gcc.'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan, atau analisis)\n'
            '- 3 soal bertipe "implementasi" (tulis notasi algoritmik + kode)'
        ),
        "tipe_label_impl": '"implementasi" (wajib sertakan notasi algoritmik lengkap sebagai referensi)',
    },
    "set-map": {
        "nama": "ADT Set dan Map",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (I.S./F.S., KAMUS LOKAL, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'Cakupan materi: '
            'ADT Set — definisi (elemen unik, bertipe sama, tidak terurut), operasi (CreateSet/isEmpty/length/add/remove/isIn/isEqual/union/intersection/setDifference/isSubset/copy), '
            'axiomatic semantics (9 aksioma untuk new/isIn/add/remove/isEmpty), '
            'implementasi array tidak terurut (add O(1) di akhir, isIn O(n) linear search, remove: pindah elemen terakhir ke posisi yang dihapus), '
            'implementasi array terurut (isIn O(log n) binary search, add O(n) cari posisi+geser), '
            'perbandingan kinerja (tidak terurut vs terurut), '
            'implementasi hash table (isIn O(1) rata-rata, add O(1) rata-rata), '
            'ADT Map — definisi (pasangan key-value, key unik, juga disebut associative array/symbol table/dictionary), '
            'operasi (CreateMap/isEmpty/find/set/unset), '
            'axiomatic semantics Map (6 aksioma), '
            'implementasi array (MapEntry <key,value>, Map <buffer,length>), '
            'set() pada Map: jika key ada→update, jika belum→insert; unset(): hapus entri, geser elemen terakhir ke posisi yang dihapus, '
            'Hash Table — fungsi hash (memetakan key ke indeks), collision (dua key berbeda → hash sama), '
            'strategi chaining (setiap slot = linked list), '
            'open addressing: linear probing (+1), quadratic probing (+1,+4,+9), double hashing, '
            'load factor (jumlah_terisi/total ≤ 0.7), rehashing, '
            'algoritma set pada Map dengan linear probing (probe sampai NIL atau key=k), '
            'algoritma find dengan linear probing, '
            'masalah penghapusan (tidak bisa langsung kosongkan slot) dan solusinya (tata ulang elemen chain).'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan implementasi, analisis kinerja, atau aksioma)\n'
            '- 3 soal bertipe "implementasi" (tulis notasi algoritmik + kode, atau simulasi hash table)'
        ),
        "tipe_label_impl": '"implementasi" (sertakan notasi algoritmik lengkap sebagai referensi jika relevan)',
    },
    "stack-queue": {
        "nama": "Queue dan Stack",
        "panduan": (
            'Panduan kualitas soal:\n'
            '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n'
            '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (I.S./F.S., KAMUS LOKAL, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n'
            '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n'
            '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.'
        ),
        "soal_schema": SOAL_SCHEMA_NOTASI_REFERENSI,
        "cakupan": (
            'Cakupan materi: '
            'Queue (FIFO) — definisi, struktur (HEAD/TAIL/IDX_UNDEF), kondisi kosong/penuh, operasi (CreateQueue/enqueue/dequeue/isEmpty/isFull/length/head), '
            'tiga implementasi array (Alt-1: HEAD tetap di 0 geser semua O(n), Alt-2: HEAD geser kanan masalah semi-full, Alt-3: circular buffer modular O(1)), '
            'implementasi C multi-file (queue.h dengan macro IDX_HEAD/IDX_TAIL/HEAD/TAIL, enqueue Alt-2 dengan geser balik, dequeue), '
            'Stack (LIFO) — definisi, struktur (TOP/IDX_UNDEF), operasi (CreateStack/push/pop/isEmpty/isFull/length/top), '
            'algoritma push (idxTop++; buffer[idxTop]=val) dan pop (val=buffer[idxTop]; idxTop--), '
            'implementasi C (stack.h dengan macro IDX_TOP/TOP), '
            'perbandingan Queue vs Stack vs List, '
            'aplikasi postfix evaluation — algoritma (baca token: operan→push, operator→pop dua operan→hitung→push), trace langkah, perhatian urutan pop, '
            'prosedur copyStack/inverseStack, fungsi mergeStack, '
            'round robin scheduling dengan queue, priority queue (enqueue terurut berdasarkan cost).'
        ),
        "distribusi": (
            '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan antar alternatif, atau analisis)\n'
            '- 3 soal bertipe "implementasi" (tulis notasi algoritmik + kode C)'
        ),
        "tipe_label_impl": '"implementasi" (sertakan notasi algoritmik lengkap sebagai referensi jika relevan)',
    },
}


def build_prompt(
    topic_slug: str,
    jumlah: int,
    kelemahan: list[str],
    tipe_paksa: str | None,
    topik_referensi: list[str],
) -> str:
    cfg = TOPIC_CONFIGS[topic_slug]
    nama = cfg["nama"]
    panduan = cfg["panduan"]
    soal_schema = cfg["soal_schema"]
    cakupan = cfg["cakupan"]

    if tipe_paksa and jumlah == 1:
        tipe_label = (
            cfg["tipe_label_impl"]
            if tipe_paksa == "implementasi"
            else '"pengetahuan" (esai konsep mendalam)'
        )
        topik_ctx = (
            (
                '\nReferensi topik dari soal sebelumnya: '
                + ', '.join(topik_referensi)
                + '. Buat soal yang menguji konsep yang sama atau sangat berkaitan, namun dengan pertanyaan yang berbeda dan sudut pandang berbeda — jangan duplikasi pertanyaan yang ada.'
            )
            if topik_referensi
            else ''
        )
        return (
            f'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n'
            f'Buatkan tepat 1 soal baru bertipe {tipe_label} untuk topik "{nama}".\n'
            f'{topik_ctx}\n\n'
            f'{cakupan}\n\n'
            f'{panduan}\n\n'
            f'Respons HARUS berupa JSON valid (array "soal" berisi tepat 1 elemen, id selalu 1):\n'
            f'{soal_schema}'
        )

    kelemahan_ctx = (
        (
            '\n\nPenting: Mahasiswa memiliki kelemahan di konsep berikut — '
            + ', '.join(kelemahan)
            + '. Buat minimal 60% soal yang langsung menargetkan konsep-konsep tersebut.'
        )
        if kelemahan
        else ''
    )
    distribusi = cfg["distribusi"]
    return (
        f'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n'
        f'Buatkan {jumlah} soal latihan untuk topik "{nama}" dengan distribusi:\n'
        f'{distribusi}\n\n'
        f'{cakupan}'
        f'{kelemahan_ctx}\n\n'
        f'{panduan}\n\n'
        f'Respons HARUS berupa JSON valid:\n'
        f'{soal_schema}'
    )


async def generate_soal(
    topic_slug: str,
    jumlah: int = 5,
    kelemahan: list[str] | None = None,
    tipe_paksa: str | None = None,
    topik_referensi: list[str] | None = None,
) -> dict:
    prompt = build_prompt(
        topic_slug,
        jumlah,
        kelemahan or [],
        tipe_paksa,
        topik_referensi or [],
    )

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {settings.openai_api_key}',
            },
            json={
                'model': settings.openai_model,
                'messages': [{'role': 'user', 'content': prompt}],
                'response_format': {'type': 'json_object'},
                'temperature': 0.85,
            },
        )

    response.raise_for_status()
    data = response.json()
    return json.loads(data['choices'][0]['message']['content'])
