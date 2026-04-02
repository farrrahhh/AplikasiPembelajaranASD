TOPIC_CONTENT_BLUEPRINTS = {
    "Linked List": {
        "materials": [
            {
                "title": "Konsep dasar Linked List",
                "content": (
                    "Linked List adalah struktur data linear yang tersusun dari node. "
                    "Setiap node menyimpan data dan referensi ke node berikutnya, sehingga "
                    "elemen tidak harus berada pada blok memori yang bersebelahan."
                ),
            },
            {
                "title": "Kapan Linked List digunakan",
                "content": (
                    "Linked List cocok saat kita sering melakukan penyisipan atau penghapusan "
                    "elemen di tengah atau awal struktur data. Biaya tambah/hapus bisa O(1) "
                    "jika referensi node terkait sudah diketahui."
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
                    "akan menjadi elemen pertama yang keluar."
                ),
            },
            {
                "title": "Operasi utama Stack",
                "content": (
                    "Operasi inti Stack adalah push untuk menambah elemen, pop untuk "
                    "menghapus elemen teratas, dan peek/top untuk melihat elemen paling atas."
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
                    "akan keluar lebih dulu."
                ),
            },
            {
                "title": "Front dan Rear",
                "content": (
                    "Front menunjuk elemen paling depan untuk dequeue, sedangkan rear/tail "
                    "digunakan saat enqueue elemen baru."
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
                    "dan leaf. Setiap node dapat memiliki anak."
                ),
            },
            {
                "title": "Traversal Tree",
                "content": (
                    "Traversal umum pada Tree meliputi pre-order, in-order, dan post-order. "
                    "Masing-masing memiliki urutan kunjungan node yang berbeda."
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
                    "Graph terdiri dari vertex/node dan edge. Struktur ini cocok untuk "
                    "merepresentasikan hubungan banyak-ke-banyak."
                ),
            },
            {
                "title": "Representasi Graph",
                "content": (
                    "Graph dapat direpresentasikan menggunakan adjacency list atau adjacency matrix, "
                    "tergantung kebutuhan efisiensi."
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
                    "Sorting mengurutkan data sehingga pencarian, analisis, dan presentasi "
                    "informasi menjadi lebih mudah."
                ),
            },
            {
                "title": "Perbandingan algoritma sorting",
                "content": (
                    "Bubble Sort mudah dipahami tetapi lambat, Merge Sort stabil dan efisien, "
                    "sedangkan Quick Sort sering sangat cepat pada praktik."
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
