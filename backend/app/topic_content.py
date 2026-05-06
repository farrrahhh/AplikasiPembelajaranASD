TOPIC_CONTENT_BLUEPRINTS = {
    "Linked List": {
        "materials": [
            {
                "title": "Apa Itu Linked List?",
                "content": (
                    "Linked List adalah struktur data linear yang terdiri dari node-node yang "
                    "saling terhubung. Setiap node menyimpan data dan pointer ke node berikutnya.\n\n"
                    "Pada bahasa C, Linked List biasanya dibuat sendiri dengan `struct`, jadi kita "
                    "benar-benar melihat bagaimana data dan pointer bekerja di memori.\n\n"
                    "## Bagian node\n"
                    "Satu node pada Linked List biasanya punya dua bagian utama.\n"
                    "- `data` untuk menyimpan nilai.\n"
                    "- `next` untuk menyimpan alamat node berikutnya.\n\n"
                    "## Cara node terhubung\n"
                    "Node tidak harus disimpan berdampingan seperti elemen array.\n"
                    "- `head` menunjuk node pertama.\n"
                    "- Node terakhir punya `next` bernilai `NULL`.\n"
                    "- Traversal dilakukan dengan mengikuti pointer dari satu node ke node berikutnya.\n\n"
                    "## Kenapa penting di C\n"
                    "Linked List di C membantu memahami pointer secara nyata.\n"
                    "- Kita membangun node dengan `malloc`.\n"
                    "- Kita melepas node dengan `free`.\n"
                    "- Kita harus hati-hati agar pointer tidak putus atau salah arah."
                ),
            },
            {
                "title": "Linked List vs Array",
                "content": (
                    "Cara paling mudah memahami Linked List adalah membandingkannya dengan array. "
                    "Keduanya sama-sama menyimpan data berurutan, tetapi cara penyimpanannya berbeda.\n\n"
                    "## Kelebihan Linked List\n"
                    "Linked List cocok ketika data sering bertambah atau berkurang.\n"
                    "- Insert di awal bisa O(1).\n"
                    "- Delete setelah node tertentu juga efisien.\n"
                    "- Node tidak perlu digeser seperti pada array.\n\n"
                    "## Kelemahan Linked List\n"
                    "Linked List tidak secepat array untuk akses posisi tertentu.\n"
                    "- Tidak ada random access langsung.\n"
                    "- Untuk mengambil node ke-i, program harus traversal dari `head`.\n"
                    "- Setiap node butuh memori tambahan untuk pointer `next`.\n\n"
                    "## Kapan dipakai\n"
                    "Gunakan Linked List saat perubahan struktur data lebih sering daripada akses indeks.\n"
                    "- Cocok untuk implementasi Stack atau Queue berbasis node.\n"
                    "- Cocok saat ukuran data dinamis.\n"
                    "- Kurang cocok jika program sering mengambil elemen berdasarkan indeks seperti array.\n\n"
                    "## Hubungannya dengan implementasi C\n"
                    "Di C, perbedaan ini terasa jelas karena kita sendiri yang mengatur pointer dan memori.\n"
                    "- Array mudah diakses dengan indeks.\n"
                    "- Linked List lebih fleksibel saat insert/delete.\n"
                    "- Programmer harus menjaga alokasi dan pelepasan memori dengan benar."
                ),
            },
        ],
        "examples": [
            {
                "title": "Traversal Linked List dalam C",
                "description": (
                    "Traversal dilakukan dari `head` sampai pointer `current` bernilai `NULL`."
                ),
                "code": (
                    "struct Node *current = head;\n"
                    "while (current != NULL) {\n"
                    "    printf(\"%d\\n\", current->data);\n"
                    "    current = current->next;\n"
                    "}"
                ),
            },
            {
                "title": "Insert node di awal list",
                "description": (
                    "Node baru dialokasikan dengan `malloc`, lalu disambungkan ke `head` lama."
                ),
                "code": (
                    "struct Node *new_node = malloc(sizeof(struct Node));\n"
                    "if (new_node != NULL) {\n"
                    "    new_node->data = value;\n"
                    "    new_node->next = head;\n"
                    "    head = new_node;\n"
                    "}"
                ),
            },
        ],
        "summary": (
            "Implementasi Linked List di bahasa C sangat bergantung pada `struct`, "
            "pointer, `malloc`, dan `free`. Kelebihannya ada pada operasi insert/delete "
            "yang fleksibel, sementara akses ke posisi tertentu tetap memerlukan traversal."
        ),
        "adaptive_focus": {
            "high": "Fokus pada hubungan `head`, `next`, dan cara pointer berpindah saat traversal di C.",
            "medium": "Perkuat latihan insert/delete sambil membiasakan diri mengecek hasil `malloc`.",
            "low": "Lanjutkan ke operasi lanjutan seperti reverse list, delete tail, dan deteksi cycle di C.",
        },
        "exercises": [
            {
                "question": "Dalam implementasi Linked List di bahasa C, mengapa insert di awal dapat dilakukan dalam O(1)?",
                "reference_answer": (
                    "Karena program hanya perlu mengatur `new_node->next` ke `head` lama "
                    "lalu memindahkan `head` ke node baru tanpa menelusuri seluruh list."
                ),
                "keywords": ["head", "new_node", "next", "o(1)", "pointer"],
                "explanation": (
                    "Jumlah langkahnya konstan karena hanya ada beberapa perubahan pointer "
                    "dan tidak ada elemen yang digeser seperti pada array."
                ),
            },
            {
                "question": "Pada Linked List di bahasa C, mengapa mengakses node ke-i tetap O(n)?",
                "reference_answer": (
                    "Karena C harus menelusuri pointer dari `head` ke node berikutnya satu per satu "
                    "sampai mencapai posisi ke-i dan tidak bisa langsung melompat seperti array."
                ),
                "keywords": ["traversal", "head", "pointer", "o(n)", "array"],
                "explanation": (
                    "Setiap node hanya mengetahui alamat node sesudahnya, jadi akses posisi tertentu "
                    "harus dilakukan secara berurutan."
                ),
            },
        ],
    },
    "Stack": {
        "materials": [
            {
                "title": "Prinsip LIFO dalam implementasi C",
                "content": (
                    "Stack mengikuti prinsip Last In First Out. Pada bahasa C, Stack sering "
                    "diimplementasikan dengan array dan variabel `top`.\n\n"
                    "## Makna `top`\n"
                    "Variabel `top` menandai indeks elemen paling atas pada Stack.\n"
                    "- Saat Stack kosong, `top` sering bernilai `-1`.\n"
                    "- Saat `push`, `top` dinaikkan lalu nilai baru disimpan.\n"
                    "- Saat `pop`, nilai pada `top` diambil lalu `top` diturunkan.\n\n"
                    "## Kapan Stack berguna\n"
                    "Stack banyak dipakai untuk kebutuhan yang memproses data terbaru lebih dulu.\n"
                    "- Undo sederhana.\n"
                    "- Evaluasi ekspresi.\n"
                    "- Penyimpanan state pemanggilan fungsi secara konseptual."
                ),
            },
            {
                "title": "Push, pop, dan penanganan error",
                "content": (
                    "Di C, operasi Stack harus disertai pengecekan batas agar tidak terjadi "
                    "overflow atau underflow.\n\n"
                    "## Push\n"
                    "Push menambah data ke atas Stack selama masih ada ruang.\n"
                    "- Cek `top == MAX - 1` untuk mendeteksi overflow.\n"
                    "- Jika aman, naikkan `top` lalu isi elemen baru.\n\n"
                    "## Pop\n"
                    "Pop mengambil elemen teratas selama Stack tidak kosong.\n"
                    "- Cek `top == -1` untuk mendeteksi underflow.\n"
                    "- Setelah nilai diambil, `top` dikurangi.\n\n"
                    "## Mengapa pengecekan penting\n"
                    "C tidak otomatis melindungi akses memori di luar batas array.\n"
                    "- Tanpa validasi, data bisa rusak.\n"
                    "- Program juga dapat menghasilkan perilaku tak terduga."
                ),
            },
        ],
        "examples": [
            {
                "title": "Fungsi push pada Stack array",
                "description": (
                    "Contoh dasar `push` di C dengan pengecekan overflow sebelum memasukkan data."
                ),
                "code": (
                    "if (top == MAX - 1) {\n"
                    "    printf(\"Stack overflow\\n\");\n"
                    "} else {\n"
                    "    stack[++top] = value;\n"
                    "}"
                ),
            },
            {
                "title": "Fungsi pop pada Stack array",
                "description": (
                    "Elemen teratas diambil hanya jika Stack tidak kosong."
                ),
                "code": (
                    "if (top == -1) {\n"
                    "    printf(\"Stack underflow\\n\");\n"
                    "} else {\n"
                    "    int item = stack[top--];\n"
                    "    printf(\"%d\\n\", item);\n"
                    "}"
                ),
            },
        ],
        "summary": (
            "Pada bahasa C, Stack paling mudah dipahami lewat array dan variabel `top`. "
            "Kunci utamanya adalah menjaga urutan LIFO dan selalu mengecek overflow serta underflow."
        ),
        "adaptive_focus": {
            "high": "Bedakan dengan jelas kapan `top` berubah pada `push` dan kapan berubah pada `pop` di C.",
            "medium": "Latih implementasi Stack array lengkap dengan fungsi `isEmpty` dan `isFull`.",
            "low": "Eksplorasi Stack berbasis Linked List di C agar tidak dibatasi ukuran array tetap.",
        },
        "exercises": [
            {
                "question": "Dalam program C, mengapa fitur undo sederhana cocok memakai Stack?",
                "reference_answer": (
                    "Karena aksi terakhir harus dibatalkan lebih dulu, sehingga pola kerjanya "
                    "sesuai prinsip LIFO pada Stack."
                ),
                "keywords": ["undo", "lifo", "aksi terakhir", "stack", "c"],
                "explanation": (
                    "Saat user meminta undo, program cukup mengambil aksi paling baru dari puncak Stack."
                ),
            },
            {
                "question": "Pada implementasi Stack array di bahasa C, apa perbedaan efek `push`, `pop`, dan `peek` terhadap variabel `top`?",
                "reference_answer": (
                    "`Push` menaikkan `top` lalu menyimpan data, `pop` mengambil data lalu "
                    "menurunkan `top`, sedangkan `peek` hanya membaca elemen teratas tanpa mengubah `top`."
                ),
                "keywords": ["push", "pop", "peek", "top", "array"],
                "explanation": (
                    "Memahami perubahan `top` sangat penting karena indeks inilah yang menentukan elemen aktif pada Stack."
                ),
            },
        ],
    },
    "Queue": {
        "materials": [
            {
                "title": "Prinsip FIFO dalam C",
                "content": (
                    "Queue mengikuti prinsip First In First Out. Pada bahasa C, Queue sering "
                    "diimplementasikan dengan array serta dua indeks: `front` dan `rear`.\n\n"
                    "## Peran `front` dan `rear`\n"
                    "Dua indeks ini menjaga urutan elemen yang masuk dan keluar.\n"
                    "- `front` menunjuk elemen paling depan yang siap diambil.\n"
                    "- `rear` menunjuk posisi elemen paling belakang.\n"
                    "- Enqueue menambah data dari sisi belakang, dequeue mengambil dari sisi depan.\n\n"
                    "## Kasus penggunaan\n"
                    "Queue cocok saat urutan kedatangan harus dipertahankan.\n"
                    "- Antrean pelanggan.\n"
                    "- Buffer tugas.\n"
                    "- Simulasi proses yang dilayani bergiliran."
                ),
            },
            {
                "title": "Circular Queue dan validasi batas",
                "content": (
                    "Jika Queue array biasa terus melakukan dequeue, ruang kosong di depan "
                    "bisa terbuang. Karena itu implementasi C sering memakai Circular Queue.\n\n"
                    "## Ide Circular Queue\n"
                    "Saat `rear` mencapai akhir array, indeks bisa kembali ke awal dengan operasi modulo.\n"
                    "- Ruang array dipakai ulang dengan lebih efisien.\n"
                    "- Cocok untuk buffer berukuran tetap.\n\n"
                    "## Pengecekan penuh dan kosong\n"
                    "Queue tetap harus memeriksa kondisi penuh dan kosong.\n"
                    "- Empty sering ditandai `front == -1`.\n"
                    "- Full pada Circular Queue bisa dicek dengan `(rear + 1) % MAX == front`.\n\n"
                    "## Mengapa penting di C\n"
                    "Tanpa validasi, enqueue atau dequeue dapat mengakses indeks yang salah dan merusak data."
                ),
            },
        ],
        "examples": [
            {
                "title": "Enqueue pada Circular Queue",
                "description": (
                    "Data baru ditambahkan di `rear` dan indeks digeser memakai modulo."
                ),
                "code": (
                    "rear = (rear + 1) % MAX;\n"
                    "queue[rear] = value;\n"
                    "if (front == -1) {\n"
                    "    front = 0;\n"
                    "}"
                ),
            },
            {
                "title": "Dequeue pada Circular Queue",
                "description": (
                    "Elemen depan diambil lalu `front` digeser ke posisi berikutnya."
                ),
                "code": (
                    "int item = queue[front];\n"
                    "if (front == rear) {\n"
                    "    front = rear = -1;\n"
                    "} else {\n"
                    "    front = (front + 1) % MAX;\n"
                    "}"
                ),
            },
        ],
        "summary": (
            "Queue di bahasa C berfokus pada pengelolaan indeks `front` dan `rear`. "
            "Circular Queue membantu memakai array secara efisien sambil tetap menjaga prinsip FIFO."
        ),
        "adaptive_focus": {
            "high": "Perjelas kapan `front` berubah, kapan `rear` berubah, dan apa arti Queue kosong di C.",
            "medium": "Latih enqueue/dequeue pada Circular Queue agar nyaman dengan operasi modulo.",
            "low": "Lanjutkan ke variasi Queue lain seperti deque dan priority queue setelah dasar FIFO kuat.",
        },
        "exercises": [
            {
                "question": "Dalam implementasi Queue di bahasa C, mengapa antrean pelanggan cocok dimodelkan dengan FIFO?",
                "reference_answer": (
                    "Karena pelanggan yang datang lebih dulu harus dilayani lebih dulu, "
                    "sama seperti Queue yang mengeluarkan elemen dari `front` sesuai urutan kedatangan."
                ),
                "keywords": ["fifo", "front", "pelanggan", "urutan", "queue"],
                "explanation": (
                    "FIFO menjaga keadilan urutan layanan sehingga perilakunya sesuai dengan antrean nyata."
                ),
            },
            {
                "question": "Pada Circular Queue di bahasa C, apa perbedaan tugas `enqueue` dan `dequeue` terhadap indeks `rear` dan `front`?",
                "reference_answer": (
                    "`Enqueue` menaruh data baru di `rear` lalu memajukan `rear`, sedangkan "
                    "`dequeue` mengambil data dari `front` lalu memajukan `front`."
                ),
                "keywords": ["enqueue", "dequeue", "rear", "front", "circular queue"],
                "explanation": (
                    "Kedua operasi bekerja di sisi berbeda agar urutan data yang keluar tetap sama dengan urutan masuknya."
                ),
            },
        ],
    },
    "Tree": {
        "materials": [
            {
                "title": "Struktur Tree dengan `struct` dan pointer",
                "content": (
                    "Dalam bahasa C, Tree biasanya direpresentasikan dengan `struct` node "
                    "yang memiliki data serta pointer ke child kiri dan kanan.\n\n"
                    "## Komponen penting\n"
                    "Binary Tree paling dasar memiliki tiga bagian dalam satu node.\n"
                    "- `data` menyimpan nilai.\n"
                    "- `left` menunjuk child kiri.\n"
                    "- `right` menunjuk child kanan.\n\n"
                    "## Hubungan hierarkis\n"
                    "Berbeda dari Linked List, satu node Tree dapat bercabang ke lebih dari satu arah.\n"
                    "- Root adalah node paling atas.\n"
                    "- Parent adalah node yang punya child.\n"
                    "- Leaf adalah node tanpa child.\n\n"
                    "## Dampak ke implementasi C\n"
                    "Karena ada lebih dari satu pointer, kita harus teliti saat membuat, menghubungkan, dan membebaskan node."
                ),
            },
            {
                "title": "Traversal rekursif pada Tree di C",
                "content": (
                    "Traversal Tree di C sering ditulis dengan fungsi rekursif karena bentuk "
                    "pohon sangat cocok dengan pola pemanggilan berulang.\n\n"
                    "## Pre-order\n"
                    "Kunjungi root lebih dulu, lalu subtree kiri, kemudian subtree kanan.\n"
                    "- Cocok ketika node saat ini harus diproses sebelum child.\n\n"
                    "## In-order\n"
                    "Kunjungi kiri, root, lalu kanan.\n"
                    "- Pada Binary Search Tree, hasilnya akan terurut menaik.\n\n"
                    "## Post-order\n"
                    "Kunjungi kiri, kanan, lalu root.\n"
                    "- Berguna saat child harus selesai diproses sebelum parent, misalnya saat membebaskan node."
                ),
            },
        ],
        "examples": [
            {
                "title": "Definisi node Binary Tree di C",
                "description": (
                    "Setiap node menyimpan data dan dua pointer child."
                ),
                "code": (
                    "struct TreeNode {\n"
                    "    int data;\n"
                    "    struct TreeNode *left;\n"
                    "    struct TreeNode *right;\n"
                    "};"
                ),
            },
            {
                "title": "Pre-order traversal rekursif",
                "description": (
                    "Fungsi ini memproses root lebih dulu sebelum turun ke child kiri dan kanan."
                ),
                "code": (
                    "void preorder(struct TreeNode *node) {\n"
                    "    if (node == NULL) {\n"
                    "        return;\n"
                    "    }\n"
                    "    printf(\"%d \", node->data);\n"
                    "    preorder(node->left);\n"
                    "    preorder(node->right);\n"
                    "}"
                ),
            },
        ],
        "summary": (
            "Tree di bahasa C mengandalkan `struct` dengan beberapa pointer child. "
            "Traversal rekursif membantu menelusuri node sesuai urutan pre-order, in-order, atau post-order."
        ),
        "adaptive_focus": {
            "high": "Mulai dari memahami root, child, dan arti pointer `left` serta `right` pada node C.",
            "medium": "Bandingkan hasil pre-order, in-order, dan post-order memakai contoh Binary Tree kecil.",
            "low": "Lanjutkan ke Binary Search Tree, heap, dan operasi insert/search berbasis Tree di C.",
        },
        "exercises": [
            {
                "question": "Dalam implementasi Tree di bahasa C, apa perbedaan utama struktur node Tree dibanding node Linked List?",
                "reference_answer": (
                    "Node Tree biasanya punya lebih dari satu pointer child seperti `left` dan `right`, "
                    "sedangkan node Linked List umumnya hanya punya satu pointer `next` ke node berikutnya."
                ),
                "keywords": ["left", "right", "next", "tree", "linked list"],
                "explanation": (
                    "Perbedaan jumlah pointer ini membuat Tree bersifat hierarkis dan bercabang, bukan linear."
                ),
            },
            {
                "question": "Pada fungsi pre-order traversal di bahasa C, urutan kunjungan node seperti apa yang harus terjadi?",
                "reference_answer": (
                    "Program harus memproses root terlebih dahulu, lalu subtree kiri, "
                    "kemudian subtree kanan."
                ),
                "keywords": ["pre-order", "root", "subtree kiri", "subtree kanan", "c"],
                "explanation": (
                    "Pre-order selalu mendahulukan node saat ini sebelum memanggil fungsi rekursif ke anak-anaknya."
                ),
            },
        ],
    },
    "Graph": {
        "materials": [
            {
                "title": "Graph dalam representasi C",
                "content": (
                    "Graph terdiri dari vertex dan edge. Dalam bahasa C, Graph bisa direpresentasikan "
                    "dengan adjacency list atau adjacency matrix tergantung kebutuhan.\n\n"
                    "## Komponen utama\n"
                    "Vertex mewakili entitas dan edge mewakili hubungan.\n"
                    "- Vertex bisa berupa kota, user, atau simpul jaringan.\n"
                    "- Edge bisa berupa jalan, pertemanan, atau koneksi sistem.\n\n"
                    "## Mengapa Graph penting\n"
                    "Banyak masalah nyata punya hubungan banyak-ke-banyak yang tidak cocok jika dipaksa ke struktur linear.\n"
                    "- Peta rute.\n"
                    "- Jaringan sosial.\n"
                    "- Relasi dependensi modul."
                ),
            },
            {
                "title": "Adjacency list dan adjacency matrix di C",
                "content": (
                    "Pilihan representasi Graph di C berpengaruh langsung pada memori dan kemudahan operasi.\n\n"
                    "## Adjacency list\n"
                    "Setiap vertex menyimpan daftar tetangga yang terhubung.\n"
                    "- Lebih hemat memori untuk graph sparse.\n"
                    "- Nyaman dipakai untuk BFS dan DFS.\n\n"
                    "## Adjacency matrix\n"
                    "Koneksi disimpan dalam array dua dimensi.\n"
                    "- Mudah mengecek apakah dua vertex terhubung.\n"
                    "- Memori yang dipakai tetap besar walaupun edge sedikit.\n\n"
                    "## Implikasi implementasi C\n"
                    "Adjacency list sering membutuhkan `struct` node tambahan, sedangkan matrix cukup memakai array 2D."
                ),
            },
        ],
        "examples": [
            {
                "title": "Adjacency matrix sederhana",
                "description": (
                    "Contoh Graph kecil di C dengan matriks 4x4 untuk menyimpan koneksi antarsimpul."
                ),
                "code": (
                    "int graph[4][4] = {\n"
                    "    {0, 1, 1, 0},\n"
                    "    {1, 0, 0, 1},\n"
                    "    {1, 0, 0, 1},\n"
                    "    {0, 1, 1, 0}\n"
                    "};"
                ),
            },
            {
                "title": "Iterasi tetangga dari adjacency matrix",
                "description": (
                    "Loop ini memeriksa semua vertex yang terhubung langsung dengan vertex `v`."
                ),
                "code": (
                    "for (int i = 0; i < vertices; i++) {\n"
                    "    if (graph[v][i] == 1) {\n"
                    "        printf(\"%d \", i);\n"
                    "    }\n"
                    "}"
                ),
            },
        ],
        "summary": (
            "Graph di bahasa C dapat dibuat dengan adjacency list maupun adjacency matrix. "
            "Pemilihan representasi harus menyesuaikan kepadatan edge, kebutuhan memori, dan jenis algoritma traversal."
        ),
        "adaptive_focus": {
            "high": "Mulai dari memahami arti vertex, edge, dan bagaimana array 2D menyimpan koneksi di C.",
            "medium": "Latih membaca adjacency matrix lalu bandingkan dengan adjacency list untuk graph kecil.",
            "low": "Lanjutkan ke BFS, DFS, dan shortest path setelah representasi Graph di C terasa nyaman.",
        },
        "exercises": [
            {
                "question": "Dalam model Graph di bahasa C, mengapa jaringan sosial mudah direpresentasikan dengan vertex dan edge?",
                "reference_answer": (
                    "Karena setiap pengguna bisa menjadi vertex dan setiap hubungan pertemanan "
                    "atau follow bisa menjadi edge yang menghubungkan dua vertex."
                ),
                "keywords": ["vertex", "edge", "pengguna", "hubungan", "graph"],
                "explanation": (
                    "Graph memang dirancang untuk menggambarkan hubungan antarelemen yang saling terhubung secara kompleks."
                ),
            },
            {
                "question": "Pada implementasi Graph di bahasa C, apa keuntungan adjacency list dibanding adjacency matrix untuk graph yang jarang edge?",
                "reference_answer": (
                    "Adjacency list lebih hemat memori karena hanya menyimpan edge yang benar-benar ada, "
                    "sedangkan adjacency matrix tetap menyediakan ruang untuk semua pasangan vertex."
                ),
                "keywords": ["adjacency list", "adjacency matrix", "hemat memori", "sparse", "edge"],
                "explanation": (
                    "Untuk graph sparse, banyak sel pada matrix akan bernilai nol sehingga adjacency list biasanya lebih efisien."
                ),
            },
        ],
    },
    "Sorting Algorithms": {
        "materials": [
            {
                "title": "Tujuan sorting dalam program C",
                "content": (
                    "Sorting adalah proses mengurutkan data agar lebih mudah dicari, dibandingkan, "
                    "dan diproses. Dalam bahasa C, sorting biasanya diterapkan pada array.\n\n"
                    "## Mengapa array perlu diurutkan\n"
                    "Data yang teratur membuat banyak operasi lanjutan menjadi lebih sederhana.\n"
                    "- Pencarian tertentu bisa lebih cepat.\n"
                    "- Laporan lebih mudah dibaca.\n"
                    "- Data lebih mudah diproses tahap berikutnya.\n\n"
                    "## Bentuk data umum\n"
                    "Contoh yang sering diurutkan di C adalah array bilangan, array `struct`, atau data hasil input pengguna."
                ),
            },
            {
                "title": "Membandingkan Bubble Sort dan Merge Sort di C",
                "content": (
                    "Dua algoritma sorting yang sering dipelajari di awal adalah Bubble Sort "
                    "dan Merge Sort karena pendekatannya sangat berbeda.\n\n"
                    "## Bubble Sort\n"
                    "Bubble Sort berulang kali membandingkan elemen yang bersebelahan.\n"
                    "- Mudah diimplementasikan dengan dua loop `for` di C.\n"
                    "- Kurang efisien untuk data besar karena kompleksitasnya O(n^2).\n\n"
                    "## Merge Sort\n"
                    "Merge Sort membagi array menjadi bagian kecil lalu menggabungkannya kembali.\n"
                    "- Performa umumnya O(n log n).\n"
                    "- Implementasinya lebih kompleks dan sering butuh array bantu.\n\n"
                    "## Pilihan algoritma\n"
                    "Tidak semua kasus cocok memakai algoritma yang sama, jadi programmer C harus mempertimbangkan ukuran data dan memori."
                ),
            },
        ],
        "examples": [
            {
                "title": "Bubble Sort sederhana dalam C",
                "description": (
                    "Dua loop `for` dipakai untuk membandingkan dan menukar elemen yang posisinya salah."
                ),
                "code": (
                    "for (int i = 0; i < n - 1; i++) {\n"
                    "    for (int j = 0; j < n - i - 1; j++) {\n"
                    "        if (arr[j] > arr[j + 1]) {\n"
                    "            int temp = arr[j];\n"
                    "            arr[j] = arr[j + 1];\n"
                    "            arr[j + 1] = temp;\n"
                    "        }\n"
                    "    }\n"
                    "}"
                ),
            },
            {
                "title": "Membagi array pada Merge Sort",
                "description": (
                    "Potongan ini menunjukkan langkah awal rekursi sebelum proses merge dilakukan."
                ),
                "code": (
                    "int mid = left + (right - left) / 2;\n"
                    "merge_sort(arr, left, mid);\n"
                    "merge_sort(arr, mid + 1, right);\n"
                    "merge(arr, left, mid, right);"
                ),
            },
        ],
        "summary": (
            "Sorting pada bahasa C umumnya berpusat pada array. Bubble Sort cocok untuk belajar logika dasar, "
            "sedangkan Merge Sort memberi gambaran pendekatan divide and conquer yang lebih efisien."
        ),
        "adaptive_focus": {
            "high": "Mulai dari memahami perbandingan elemen dan proses swap pada Bubble Sort dalam C.",
            "medium": "Bandingkan jumlah iterasi Bubble Sort dengan langkah pecah-gabung pada Merge Sort.",
            "low": "Eksplorasi Quick Sort, selection sort, dan pengaruh kompleksitas waktu pada data besar di C.",
        },
        "exercises": [
            {
                "question": "Dalam implementasi sorting di bahasa C, mengapa Bubble Sort kurang efisien untuk array besar?",
                "reference_answer": (
                    "Karena Bubble Sort melakukan banyak perbandingan dan pertukaran berulang "
                    "dengan kompleksitas waktu O(n^2), sehingga lambat saat jumlah elemen besar."
                ),
                "keywords": ["bubble sort", "o(n^2)", "array besar", "perbandingan", "swap"],
                "explanation": (
                    "Semakin besar array, semakin banyak iterasi loop bersarang yang harus dijalankan oleh program C."
                ),
            },
            {
                "question": "Pada Merge Sort di bahasa C, apa ide utama dari langkah `divide and conquer`?",
                "reference_answer": (
                    "Array dibagi menjadi bagian-bagian kecil, tiap bagian diurutkan secara rekursif, "
                    "lalu hasil yang sudah terurut digabungkan kembali."
                ),
                "keywords": ["merge sort", "divide and conquer", "rekursif", "gabung", "array"],
                "explanation": (
                    "Strategi ini memecah masalah besar menjadi submasalah yang lebih mudah diselesaikan sebelum hasilnya digabungkan."
                ),
            },
        ],
    },
}
