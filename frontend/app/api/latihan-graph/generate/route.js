const PANDUAN =
  'Panduan kualitas soal:\n' +
  '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n' +
  '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (KAMUS, ALGORITMA) sebagai referensi jika relevan. Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n' +
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
  'Graph — definisi G=(V,E), V=simpul (vertices/nodes) tidak boleh kosong, E=busur (edges) boleh kosong, ' +
  'terminologi: bertetangga/adjacent (dua simpul dihubungkan busur), berhubungan/incident (simpul terhubung dengan busur), derajat/degree (jumlah busur yang terhubung ke simpul), ' +
  'variasi graph: weighted (busur berbobot), directed/berarah (a→b ≠ b→a), undirected/tak-berarah (a—b = b—a), simple (undirected tanpa loop tanpa multi-edge), regular (semua simpul berderajat sama), complete (setiap pasang simpul terhubung), empty (tanpa busur), ' +
  'aplikasi: jaringan komunikasi, struktur molekul, jaringan sosial, peta jalan, ' +
  'representasi graph: ' +
  '(1) Adjacency Matrix — matriks n×n, M[i][j]=jumlah busur antara i dan j, cek tetangga O(1), memori O(V²), cocok untuk dense graph; ' +
  '(2) Adjacency List — setiap simpul menyimpan list tetangganya, memori O(V+E), cocok untuk sparse graph; ' +
  '(3) Incidence Matrix — baris=simpul, kolom=busur, M[i][j]=true jika simpul i terhubung busur j; ' +
  '(4) Incidence List — setiap simpul menyimpan list busurnya; ' +
  '(5) Edge List — tabel pasangan simpul per busur; ' +
  'directed graph: predecessor (asal busur), successor (tujuan busur), ' +
  'implementasi multilist directed graph: ' +
  'type Node = <id, nPred, trail: AdrSuccNode, next: AdrNode>, ' +
  'type SuccNode = <succ: AdrNode, next: AdrSuccNode>, ' +
  'type Graph = <first: AdrNode>, ' +
  'leader list (list simpul terurut berdasarkan id), trailer list (list successor per simpul), ' +
  'nPred = jumlah busur masuk ke simpul, ' +
  'primitif: searchNode(g,x)→AdrNode (linear search berdasarkan id), ' +
  'searchEdge(g,prec,succ)→AdrSuccNode (cari di trailer list simpul prec), ' +
  'insertNode(g,x,pn) — sisipkan ke posisi terurut di leader list, ' +
  'insertEdge(g,prec,succ) — cek duplikat dengan searchEdge, tambah SuccNode di trailer prec, increment nPred succ, ' +
  'deleteNode(g,x) — 4 langkah: hapus trailer list simpul x, hapus SuccNode yang menuju x dari semua simpul lain + update nPred, hapus x dari leader list, dealokasi.';

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
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "Graph".\n' +
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
      'Buatkan ' + jumlah + ' soal latihan untuk topik "Graph" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan representasi, analisis, terminologi)\n' +
      '- 3 soal bertipe "implementasi" (tulis notasi algoritmik, simulasi adjacency matrix, atau trace primitif multilist)\n\n' +
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
