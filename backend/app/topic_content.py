TOPIC_CONTENT_BLUEPRINTS = {
    "Linked List": {
        "materials": [
            {
                "title": "Konsep dasar Linked List",
                "content": (
                    "Linked List adalah struktur data linear yang tersusun dari node. "
                    "Setiap node menyimpan data dan referensi ke node berikutnya.\n\n"
                    "## Apa yang dimaksud dengan node\n"
                    "Node adalah satu unit kecil di dalam Linked List. Di dalamnya biasanya ada dua bagian: nilai data dan pointer/referensi.\n"
                    "- Bagian data menyimpan isi node, misalnya angka atau objek.\n"
                    "- Bagian referensi menyimpan alamat node berikutnya.\n\n"
                    "## Mengapa tidak harus bersebelahan di memori\n"
                    "Berbeda dari array, node pada Linked List tidak wajib disimpan berdampingan di memori. Hubungan antar elemen dijaga oleh pointer.\n"
                    "- Karena itu, struktur ini fleksibel saat menambah atau menghapus elemen.\n"
                    "- Namun, untuk mencapai elemen tertentu kita harus menelusuri node satu per satu dari head.\n\n"
                    "## Istilah penting\n"
                    "- Head adalah node pertama.\n"
                    "- Tail adalah node terakhir.\n"
                    "- Null berarti tidak ada node berikutnya."
                ),
            },
            {
                "title": "Kapan Linked List digunakan",
                "content": (
                    "Linked List cocok saat kita sering melakukan penyisipan atau penghapusan "
                    "elemen di awal atau tengah struktur data.\n\n"
                    "## Situasi yang cocok\n"
                    "Linked List berguna saat ukuran data sering berubah dan kita tidak ingin menggeser banyak elemen seperti pada array.\n"
                    "- Insert di awal bisa sangat cepat.\n"
                    "- Delete setelah node tertentu juga efisien jika referensinya sudah ada.\n\n"
                    "## Kelebihan utama\n"
                    "Biaya tambah dan hapus bisa O(1) jika posisi node yang ingin dimanipulasi sudah diketahui.\n"
                    "- Tidak perlu memindahkan seluruh elemen.\n"
                    "- Struktur lebih fleksibel untuk data dinamis.\n\n"
                    "## Keterbatasan\n"
                    "Linked List tidak unggul untuk akses acak.\n"
                    "- Untuk mengambil elemen ke-i, kita tetap harus traversal dari head.\n"
                    "- Tiap node juga butuh ruang tambahan untuk menyimpan pointer."
                ),
            },
        ],
        "examples": [
            {
                "title": "Traversal Linked List",
                "description": (
                    "Traversal dilakukan mulai dari head lalu berpindah ke node berikutnya "
                    "sampai mencapai null."
                ),
                "code": (
                    "current = head\n"
                    "while current is not None:\n"
                    "    print(current.value)\n"
                    "    current = current.next"
                ),
            },
            {
                "title": "Insert di awal",
                "description": (
                    "Node baru cukup diarahkan ke head lama, lalu head dipindahkan ke node baru."
                ),
                "code": (
                    "new_node.next = head\n"
                    "head = new_node"
                ),
            },
        ],
        "summary": (
            "Linked List menekankan hubungan antar node melalui pointer/referensi. "
            "Kekuatan utamanya ada pada fleksibilitas insert dan delete, sedangkan "
            "kelemahannya ada pada akses acak yang tidak secepat array."
        ),
        "adaptive_focus": {
            "high": "Fokus pada hubungan antar node, pointer head, dan alur traversal langkah demi langkah.",
            "medium": "Perkuat pemahaman manipulasi pointer saat insert dan delete.",
            "low": "Coba kasus lanjutan seperti reverse list dan detect cycle.",
        },
        "exercises": [
            {
                "question": "Mengapa operasi insert di awal Linked List dapat dilakukan dalam O(1)?",
                "reference_answer": (
                    "Karena kita hanya perlu membuat node baru menunjuk ke head lama lalu "
                    "memindahkan head ke node baru tanpa menggeser elemen lain."
                ),
                "keywords": ["head", "node baru", "tanpa menggeser", "o(1)"],
                "explanation": (
                    "Insert di awal hanya memodifikasi pointer head dan next pada node baru, "
                    "sehingga jumlah langkahnya konstan."
                ),
            },
            {
                "question": "Apa kelemahan utama Linked List dibanding array saat mengakses elemen ke-i?",
                "reference_answer": (
                    "Linked List tidak mendukung akses acak langsung sehingga harus traversal "
                    "dari head sampai elemen ke-i, biasanya O(n)."
                ),
                "keywords": ["traversal", "head", "o(n)", "akses acak"],
                "explanation": (
                    "Array dapat langsung menghitung alamat elemen, sedangkan Linked List harus "
                    "menelusuri node satu per satu dari head."
                ),
            },
        ],
    },
    "Stack": {
        "materials": [
            {
                "title": "Prinsip LIFO",
                "content": (
                    "Stack mengikuti prinsip Last In First Out. Elemen terakhir yang masuk "
                    "akan menjadi elemen pertama yang keluar.\n\n"
                    "## Cara membayangkan Stack\n"
                    "Bayangkan tumpukan piring di dapur. Piring yang terakhir kamu taruh di atas adalah piring pertama yang akan kamu ambil lagi.\n"
                    "- Elemen baru selalu masuk ke bagian atas atau top.\n"
                    "- Elemen yang keluar juga selalu diambil dari top.\n\n"
                    "## Mengapa urutan ini penting\n"
                    "Banyak masalah komputasi butuh memproses hal yang paling baru terlebih dahulu.\n"
                    "- Undo pada editor teks bekerja dengan pola ini.\n"
                    "- Pemanggilan fungsi rekursif juga disimpan dalam call stack.\n\n"
                    "## Istilah penting\n"
                    "- Top adalah posisi elemen paling atas.\n"
                    "- LIFO berarti Last In, First Out."
                ),
            },
            {
                "title": "Operasi utama Stack",
                "content": (
                    "Operasi inti Stack adalah push, pop, dan peek.\n\n"
                    "## Push\n"
                    "Push menambahkan elemen baru ke posisi paling atas.\n"
                    "- Setelah push, top berpindah ke elemen yang baru dimasukkan.\n\n"
                    "## Pop\n"
                    "Pop menghapus elemen paling atas dari Stack.\n"
                    "- Operasi ini mengembalikan elemen yang dihapus.\n"
                    "- Jika Stack kosong, pop tidak bisa dilakukan tanpa pengecekan.\n\n"
                    "## Peek atau Top\n"
                    "Peek melihat elemen paling atas tanpa menghapusnya.\n"
                    "- Cocok saat kita hanya ingin memeriksa isi teratas.\n"
                    "- Isi Stack tetap sama setelah operasi ini."
                ),
            },
        ],
        "examples": [
            {
                "title": "Undo action",
                "description": (
                    "Fitur undo pada editor biasanya menyimpan aksi ke Stack. Aksi terakhir "
                    "bisa dibatalkan lebih dulu."
                ),
                "code": (
                    "history.push(action)\n"
                    "last_action = history.pop()"
                ),
            },
            {
                "title": "Validasi tanda kurung",
                "description": (
                    "Setiap tanda buka didorong ke Stack, lalu dicocokkan saat tanda tutup muncul."
                ),
                "code": (
                    "for char in text:\n"
                    "    if char in '([{': stack.append(char)\n"
                    "    elif char in ')]}': stack.pop()"
                ),
            },
        ],
        "summary": (
            "Stack ideal untuk masalah yang membutuhkan urutan balik, seperti undo, "
            "pemrosesan ekspresi, dan traversal rekursif."
        ),
        "adaptive_focus": {
            "high": "Ulangi konsep elemen top dan bedakan jelas antara push, pop, dan peek.",
            "medium": "Latih penerapan Stack pada validasi simbol dan undo history.",
            "low": "Eksplorasi implementasi Stack berbasis array dan linked list.",
        },
        "exercises": [
            {
                "question": "Mengapa fungsi undo sangat cocok diimplementasikan dengan Stack?",
                "reference_answer": (
                    "Karena aksi terakhir harus dibatalkan lebih dulu sehingga sesuai dengan "
                    "prinsip LIFO pada Stack."
                ),
                "keywords": ["aksi terakhir", "lifo", "undo", "stack"],
                "explanation": (
                    "Undo selalu memproses aksi paling baru terlebih dahulu, sama seperti pop "
                    "mengambil elemen paling atas pada Stack."
                ),
            },
            {
                "question": "Sebutkan perbedaan push, pop, dan peek pada Stack.",
                "reference_answer": (
                    "Push menambah elemen ke atas Stack, pop menghapus elemen teratas, "
                    "dan peek melihat elemen teratas tanpa menghapusnya."
                ),
                "keywords": ["push", "pop", "peek", "teratas"],
                "explanation": (
                    "Ketiga operasi bekerja pada elemen top, tetapi efeknya terhadap isi "
                    "Stack berbeda."
                ),
            },
        ],
    },
    "Queue": {
        "materials": [
            {
                "title": "Prinsip FIFO",
                "content": (
                    "Queue menggunakan prinsip First In First Out. Elemen yang masuk lebih dulu "
                    "akan keluar lebih dulu.\n\n"
                    "## Cara membayangkan Queue\n"
                    "Bayangkan antrean di kasir. Orang yang datang lebih dulu berdiri di depan dan dilayani terlebih dahulu.\n"
                    "- Elemen baru masuk dari belakang.\n"
                    "- Elemen lama keluar dari depan.\n\n"
                    "## Mengapa Queue berbeda dari Stack\n"
                    "Pada Stack, elemen terakhir justru keluar lebih dulu. Queue kebalikannya: urutan kedatangan harus dijaga.\n"
                    "- Queue cocok untuk sistem antrean.\n"
                    "- Queue sering dipakai saat keadilan urutan proses penting."
                ),
            },
            {
                "title": "Front dan Rear",
                "content": (
                    "Queue punya dua ujung penting: front dan rear.\n\n"
                    "## Front\n"
                    "Front menunjuk elemen paling depan yang siap diambil.\n"
                    "- Dequeue selalu mengambil elemen dari front.\n\n"
                    "## Rear atau Tail\n"
                    "Rear adalah sisi belakang tempat elemen baru dimasukkan.\n"
                    "- Enqueue selalu menambah elemen ke rear.\n\n"
                    "## Alur kerja dasar\n"
                    "- Enqueue: tambah elemen di belakang.\n"
                    "- Dequeue: keluarkan elemen di depan.\n"
                    "- Pola ini menjaga FIFO tetap berjalan."
                ),
            },
        ],
        "examples": [
            {
                "title": "Antrian pelanggan",
                "description": (
                    "Pelanggan yang datang lebih awal dilayani lebih dulu, sesuai konsep Queue."
                ),
                "code": (
                    "queue.enqueue(customer)\n"
                    "next_customer = queue.dequeue()"
                ),
            },
            {
                "title": "Job scheduling",
                "description": (
                    "Sistem antrean tugas memproses pekerjaan berdasarkan urutan kedatangan."
                ),
                "code": (
                    "jobs.append(task)\n"
                    "current = jobs.pop(0)"
                ),
            },
        ],
        "summary": (
            "Queue cocok untuk sistem antrean, scheduling, dan breadth-first traversal "
            "yang memerlukan urutan kedatangan."
        ),
        "adaptive_focus": {
            "high": "Perjelas perbedaan front dan rear serta urutan enqueue-dequeue.",
            "medium": "Latih contoh dunia nyata seperti antrean layanan dan BFS.",
            "low": "Pelajari variasi queue seperti circular queue dan priority queue.",
        },
        "exercises": [
            {
                "question": "Mengapa Queue cocok untuk simulasi antrean pelanggan?",
                "reference_answer": (
                    "Karena pelanggan yang datang lebih dulu harus dilayani lebih dulu, "
                    "sesuai prinsip FIFO pada Queue."
                ),
                "keywords": ["fifo", "lebih dulu", "antrian", "pelanggan"],
                "explanation": (
                    "Queue mempertahankan urutan kedatangan sehingga perilakunya sesuai "
                    "dengan antrean nyata."
                ),
            },
            {
                "question": "Apa perbedaan enqueue dan dequeue?",
                "reference_answer": (
                    "Enqueue menambah elemen di rear/tail, sedangkan dequeue menghapus "
                    "elemen dari front/head."
                ),
                "keywords": ["enqueue", "dequeue", "rear", "front"],
                "explanation": (
                    "Dua operasi utama Queue selalu bekerja pada dua sisi yang berbeda."
                ),
            },
        ],
    },
    "Tree": {
        "materials": [
            {
                "title": "Struktur hierarkis",
                "content": (
                    "Tree menyimpan data secara hierarkis dengan konsep root, parent, child, "
                    "dan leaf.\n\n"
                    "## Bagian utama Tree\n"
                    "Tree tidak berjalan lurus seperti Linked List. Struktur ini bercabang.\n"
                    "- Root adalah node paling atas.\n"
                    "- Parent adalah node yang punya anak.\n"
                    "- Child adalah node turunan.\n"
                    "- Leaf adalah node yang tidak punya child.\n\n"
                    "## Kapan Tree dipakai\n"
                    "Tree cocok saat data punya hubungan bertingkat.\n"
                    "- Struktur folder komputer.\n"
                    "- Pohon keputusan.\n"
                    "- Struktur DOM pada halaman web."
                ),
            },
            {
                "title": "Traversal Tree",
                "content": (
                    "Traversal adalah proses mengunjungi node dalam urutan tertentu.\n\n"
                    "## Pre-order\n"
                    "Kunjungi root terlebih dahulu, lalu anak kiri, kemudian anak kanan.\n"
                    "- Cocok saat root harus diproses lebih dulu.\n\n"
                    "## In-order\n"
                    "Kunjungi anak kiri, lalu root, kemudian anak kanan.\n"
                    "- Pada Binary Search Tree, traversal ini memberi urutan menaik.\n\n"
                    "## Post-order\n"
                    "Kunjungi anak kiri, lalu anak kanan, dan root paling akhir.\n"
                    "- Cocok saat child harus selesai diproses sebelum parent."
                ),
            },
        ],
        "examples": [
            {
                "title": "Representasi folder",
                "description": (
                    "Struktur folder komputer adalah contoh Tree karena setiap folder dapat "
                    "berisi subfolder."
                ),
                "code": (
                    "Root\n"
                    "├── Documents\n"
                    "└── Photos"
                ),
            },
            {
                "title": "Pre-order traversal",
                "description": (
                    "Kunjungi root terlebih dahulu, lalu subtree kiri, kemudian subtree kanan."
                ),
                "code": (
                    "visit(node)\n"
                    "preorder(node.left)\n"
                    "preorder(node.right)"
                ),
            },
        ],
        "summary": (
            "Tree membantu merepresentasikan data hierarkis dan menjadi dasar banyak "
            "algoritma pencarian, parsing, serta indeks."
        ),
        "adaptive_focus": {
            "high": "Perkuat pemahaman root, parent-child, dan urutan traversal dasar.",
            "medium": "Bandingkan pre-order, in-order, dan post-order lewat contoh kecil.",
            "low": "Mulai pelajari binary search tree dan heap sebagai pengembangan Tree.",
        },
        "exercises": [
            {
                "question": "Apa perbedaan utama struktur Tree dengan Linked List?",
                "reference_answer": (
                    "Tree bersifat hierarkis dan satu node dapat memiliki beberapa child, "
                    "sedangkan Linked List linear dan tiap node biasanya menunjuk ke satu node berikutnya."
                ),
                "keywords": ["hierarkis", "child", "linear", "node berikutnya"],
                "explanation": (
                    "Perbedaan utama ada pada hubungan antar node: Tree bercabang, "
                    "Linked List berurutan linear."
                ),
            },
            {
                "question": "Jelaskan urutan kunjungan pada pre-order traversal.",
                "reference_answer": (
                    "Pre-order mengunjungi root terlebih dahulu, lalu subtree kiri, "
                    "kemudian subtree kanan."
                ),
                "keywords": ["root", "subtree kiri", "subtree kanan", "pre-order"],
                "explanation": (
                    "Pre-order selalu mendahulukan node saat ini sebelum turun ke anak-anaknya."
                ),
            },
        ],
    },
    "Graph": {
        "materials": [
            {
                "title": "Node dan edge",
                "content": (
                    "Graph terdiri dari vertex atau node dan edge atau sisi penghubung.\n\n"
                    "## Komponen utama\n"
                    "Node mewakili entitas, sedangkan edge mewakili hubungan antar entitas.\n"
                    "- Node bisa berupa orang, kota, atau halaman web.\n"
                    "- Edge bisa berarti pertemanan, jalur, atau tautan.\n\n"
                    "## Mengapa Graph penting\n"
                    "Graph sangat cocok untuk hubungan banyak-ke-banyak yang sulit direpresentasikan dengan struktur linear.\n"
                    "- Jaringan sosial.\n"
                    "- Peta jalan.\n"
                    "- Relasi antar dependensi sistem."
                ),
            },
            {
                "title": "Representasi Graph",
                "content": (
                    "Graph dapat direpresentasikan dengan adjacency list atau adjacency matrix.\n\n"
                    "## Adjacency List\n"
                    "Setiap node menyimpan daftar tetangga yang terhubung langsung dengannya.\n"
                    "- Hemat memori untuk graph yang jarang edge.\n"
                    "- Nyaman untuk traversal seperti BFS dan DFS.\n\n"
                    "## Adjacency Matrix\n"
                    "Hubungan antar node disimpan dalam tabel dua dimensi.\n"
                    "- Mudah mengecek apakah dua node terhubung.\n"
                    "- Kurang hemat untuk graph besar yang sparse."
                ),
            },
        ],
        "examples": [
            {
                "title": "Jaringan sosial",
                "description": (
                    "Pengguna sebagai node dan hubungan pertemanan sebagai edge."
                ),
                "code": (
                    "A -- B\n"
                    "|    |\n"
                    "C -- D"
                ),
            },
            {
                "title": "Adjacency list",
                "description": (
                    "Setiap node menyimpan daftar node yang terhubung dengannya."
                ),
                "code": (
                    "graph = {\n"
                    "  'A': ['B', 'C'],\n"
                    "  'B': ['A', 'D']\n"
                    "}"
                ),
            },
        ],
        "summary": (
            "Graph berguna untuk memodelkan jaringan, rute, dependensi, dan relasi kompleks. "
            "Traversal umumnya menggunakan BFS atau DFS."
        ),
        "adaptive_focus": {
            "high": "Mulai dari konsep vertex, edge, dan adjacency list sebelum masuk traversal.",
            "medium": "Latih BFS dan DFS dengan graph kecil agar pola penelusuran terasa jelas.",
            "low": "Lanjutkan ke shortest path dan weighted graph setelah traversal dasar dikuasai.",
        },
        "exercises": [
            {
                "question": "Mengapa Graph cocok untuk memodelkan jaringan sosial?",
                "reference_answer": (
                    "Karena setiap pengguna dapat direpresentasikan sebagai node dan hubungan "
                    "antar pengguna sebagai edge."
                ),
                "keywords": ["node", "edge", "hubungan", "pengguna"],
                "explanation": (
                    "Graph sangat kuat untuk merepresentasikan koneksi antarelemen yang kompleks."
                ),
            },
            {
                "question": "Apa keuntungan adjacency list dibanding adjacency matrix pada graph yang jarang edge?",
                "reference_answer": (
                    "Adjacency list lebih hemat memori karena hanya menyimpan edge yang ada, "
                    "sementara adjacency matrix menyimpan seluruh kemungkinan koneksi."
                ),
                "keywords": ["hemat memori", "edge yang ada", "adjacency list", "matrix"],
                "explanation": (
                    "Pada graph sparse, adjacency list jauh lebih efisien karena tidak "
                    "menyimpan banyak nilai kosong."
                ),
            },
        ],
    },
    "Sorting Algorithms": {
        "materials": [
            {
                "title": "Tujuan sorting",
                "content": (
                    "Sorting adalah proses mengurutkan data agar lebih mudah dibaca dan diproses.\n\n"
                    "## Mengapa data perlu diurutkan\n"
                    "Data yang sudah rapi akan lebih mudah dicari, dibandingkan, dan dianalisis.\n"
                    "- Mempercepat pencarian tertentu.\n"
                    "- Membantu menampilkan laporan secara teratur.\n"
                    "- Memudahkan proses algoritma lanjutan.\n\n"
                    "## Contoh urutan\n"
                    "Data bisa diurutkan menaik, menurun, berdasarkan nama, tanggal, atau prioritas."
                ),
            },
            {
                "title": "Perbandingan algoritma sorting",
                "content": (
                    "Setiap algoritma sorting punya kekuatan dan kelemahan yang berbeda.\n\n"
                    "## Bubble Sort\n"
                    "Bubble Sort mudah dipahami karena hanya membandingkan elemen bersebelahan.\n"
                    "- Cocok untuk belajar konsep dasar.\n"
                    "- Kurang efisien untuk data besar.\n\n"
                    "## Merge Sort\n"
                    "Merge Sort memakai pendekatan divide and conquer.\n"
                    "- Stabil dan punya performa baik.\n"
                    "- Butuh ruang tambahan saat proses merge.\n\n"
                    "## Quick Sort\n"
                    "Quick Sort sering sangat cepat dalam praktik.\n"
                    "- Sangat populer untuk banyak kasus nyata.\n"
                    "- Performanya bisa turun pada kondisi tertentu jika pivot buruk."
                ),
            },
        ],
        "examples": [
            {
                "title": "Bubble Sort sederhana",
                "description": (
                    "Membandingkan pasangan elemen bersebelahan lalu menukarnya bila urutannya salah."
                ),
                "code": (
                    "for i in range(n):\n"
                    "    for j in range(0, n-i-1):\n"
                    "        if arr[j] > arr[j+1]:\n"
                    "            arr[j], arr[j+1] = arr[j+1], arr[j]"
                ),
            },
            {
                "title": "Merge Sort divide and conquer",
                "description": (
                    "Data dibagi menjadi dua bagian, diurutkan secara rekursif, lalu digabungkan kembali."
                ),
                "code": (
                    "left = merge_sort(arr[:mid])\n"
                    "right = merge_sort(arr[mid:])\n"
                    "return merge(left, right)"
                ),
            },
        ],
        "summary": (
            "Pemilihan algoritma sorting bergantung pada ukuran data, kebutuhan stabilitas, "
            "dan batasan memori."
        ),
        "adaptive_focus": {
            "high": "Mulai dari konsep pertukaran elemen dan perbandingan sederhana pada Bubble Sort.",
            "medium": "Bandingkan kompleksitas O(n^2) dan O(n log n) lewat contoh nyata.",
            "low": "Eksplorasi kapan Quick Sort, Merge Sort, atau Heap Sort lebih tepat digunakan.",
        },
        "exercises": [
            {
                "question": "Mengapa Bubble Sort kurang efisien untuk data besar?",
                "reference_answer": (
                    "Karena kompleksitas waktunya cenderung O(n^2) sehingga jumlah "
                    "perbandingan dan pertukarannya besar pada data besar."
                ),
                "keywords": ["o(n^2)", "perbandingan", "data besar", "bubble sort"],
                "explanation": (
                    "Bubble Sort melakukan banyak iterasi berulang sehingga performanya turun "
                    "saat jumlah elemen membesar."
                ),
            },
            {
                "question": "Apa ide utama pada Merge Sort?",
                "reference_answer": (
                    "Merge Sort membagi data menjadi bagian kecil, mengurutkannya, lalu "
                    "menggabungkan kembali hasil yang sudah terurut."
                ),
                "keywords": ["membagi", "menggabungkan", "merge sort", "terurut"],
                "explanation": (
                    "Ini adalah pola divide and conquer: pecah masalah, selesaikan bagian kecil, lalu gabungkan."
                ),
            },
        ],
    },
}
