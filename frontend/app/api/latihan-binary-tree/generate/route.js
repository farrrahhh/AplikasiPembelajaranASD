const PANDUAN =
  'Panduan kualitas soal:\n' +
  '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n' +
  '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (I.S./F.S., KAMUS LOKAL, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n' +
  '- Soal harus bervariasi dan menguji pemahaman yang mendalam.\n' +
  '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.';

const SOAL_SCHEMA =
  '{\n' +
  '  "soal": [\n' +
  '    {\n' +
  '      "id": integer mulai dari 1,\n' +
  '      "tipe": "pengetahuan" atau "implementasi",\n' +
  '      "topik": [array string konsep],\n' +
  '      "pertanyaan": string pertanyaan lengkap dan jelas,\n' +
  '      "notasiAlgoritma": string notasi algoritmik lengkap sebagai referensi (untuk tipe implementasi, jika relevan), atau null jika tipe pengetahuan\n' +
  '    }\n' +
  '  ]\n' +
  '}';

const CAKUPAN_MATERI =
  'Cakupan materi: ' +
  'Pohon Biner — definisi rekursif (mungkin kosong ATAU akar + subpohon kiri + subpohon kanan yang disjoint), ' +
  'istilah (akar/root, ayah/parent, anak/child, saudara/sibling, daun/leaf, jalan/path, derajat/degree, tingkat/level, kedalaman/depth, lebar/breadth), ' +
  'jenis khusus (pohon condong kiri/left skewed, pohon condong kanan/right skewed), ' +
  'ADT representasi berkait: type BinTree = Address, type TreeNode = <info: ElType, left: BinTree, right: BinTree>, C struct treeNode, pohon kosong = NIL, ' +
  'selektor: p↑.info, p↑.left, p↑.right, ' +
  'konstruktor: NewTree(akar,l,r)→BinTree, CreateTree(akar,l,r,p), ' +
  'memory management: newTreeNode(x)→Address (alokasi+inisialisasi left/right=NIL), deallocTreeNode(p), ' +
  'predikat: isTreeEmpty(p) = p=NIL, isOneElmt(p) = left=NIL AND right=NIL, isUnerLeft(p), isUnerRight(p), isBiner(p), ' +
  'pemrosesan rekursif Basis-0 (isTreeEmpty sebagai basis) vs Basis-1 (isOneElmt sebagai basis, depend on isUnerLeft/isUnerRight/isBiner), ' +
  'traversal Pre-order (akar→kiri→kanan), In-order (kiri→akar→kanan), Post-order (kiri→kanan→akar), ' +
  'fungsi nbElmt dengan basis-0: if isTreeEmpty → 0 else → 1+nbElmt(left)+nbElmt(right), ' +
  'fungsi nbElmt dengan basis-1: depend on isOneElmt/isUnerLeft/isUnerRight/isBiner, ' +
  'fungsi nbLeaf (daun = isOneElmt): nbLeaf + nbLeaf1 dengan basis-1, ' +
  'fungsi depth: if isTreeEmpty → 0 else → 1+max(depth(left),depth(right)), ' +
  'prosedur addLeft: tambah daun terkiri rekursif, ' +
  'prosedur delLeft: hapus daun terkiri rekursif, ' +
  'Pohon Biner Seimbang (Balanced Binary Tree): selisih tinggi subpohon ≤1, selisih jumlah simpul ≤1, buildBalancedTree(n), ' +
  'BST (Binary Search Tree): semua node kiri < akar ≤ semua node kanan, ' +
  'insSearchTree: jika kosong buat node, jika key sama tambah count, jika lebih kecil masuk kiri, jika lebih besar masuk kanan, ' +
  'delete di BST: 4 kasus (isOneElmt→NIL, isUnerLeft→ambil kiri, isUnerRight→ambil kanan, isBiner→ganti dengan daun terkanan subpohon kiri), ' +
  'delNode: cari daun terkanan subpohon kiri, salin nilai, hapus daun, ' +
  'membangun pohon dari pita karakter: format (akar(left)(right)), pohon kosong=(), BuildTree dengan mesin karakter (adv/cc), BuildTreeFromString(t,st,idx) dengan indeks string.';

export async function POST(request) {
  const { jumlah = 5, kelemahan = [], tipe_paksa = null, topik_referensi = [] } = await request.json();

  let systemPrompt;

  if (tipe_paksa && jumlah === 1) {
    const tipeLabel =
      tipe_paksa === 'implementasi'
        ? '"implementasi" (sertakan notasi algoritmik lengkap sebagai referensi jika relevan)'
        : '"pengetahuan" (esai konsep mendalam)';

    const topikCtx =
      topik_referensi.length > 0
        ? '\nReferensi topik dari soal sebelumnya: ' +
          topik_referensi.join(', ') +
          '. Buat soal yang menguji konsep yang sama atau sangat berkaitan, namun dengan pertanyaan yang berbeda dan sudut pandang berbeda — jangan duplikasi pertanyaan yang ada.'
        : '';

    systemPrompt =
      'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n' +
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "Pohon Biner (Binary Tree)".\n' +
      topikCtx + '\n\n' +
      CAKUPAN_MATERI + '\n\n' +
      PANDUAN + '\n\n' +
      'Respons HARUS berupa JSON valid (array "soal" berisi tepat 1 elemen, id selalu 1):\n' +
      SOAL_SCHEMA;
  } else {
    const kelemahanCtx =
      kelemahan.length > 0
        ? '\n\nPenting: Mahasiswa memiliki kelemahan di konsep berikut — ' +
          kelemahan.join(', ') +
          '. Buat minimal 60% soal yang langsung menargetkan konsep-konsep tersebut.'
        : '';

    systemPrompt =
      'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n' +
      'Buatkan ' + jumlah + ' soal latihan untuk topik "Pohon Biner (Binary Tree)" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan, analisis, traversal trace, atau istilah)\n' +
      '- 3 soal bertipe "implementasi" (tulis notasi algoritmik, implementasi C, atau trace eksekusi)\n\n' +
      CAKUPAN_MATERI +
      kelemahanCtx + '\n\n' +
      PANDUAN + '\n\n' +
      'Respons HARUS berupa JSON valid:\n' +
      SOAL_SCHEMA;
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: systemPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.85,
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.json().catch(() => ({}));
    return Response.json({ error: err.error?.message ?? 'OpenAI API error' }, { status: 500 });
  }

  const data = await openaiRes.json();
  const content = JSON.parse(data.choices[0].message.content);
  return Response.json(content);
}
