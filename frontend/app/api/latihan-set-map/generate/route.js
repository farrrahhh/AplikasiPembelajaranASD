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
  'ADT Set — definisi (elemen unik, bertipe sama, tidak terurut), operasi (CreateSet/isEmpty/length/add/remove/isIn/isEqual/union/intersection/setDifference/isSubset/copy), ' +
  'axiomatic semantics (9 aksioma untuk new/isIn/add/remove/isEmpty), ' +
  'implementasi array tidak terurut (add O(1) di akhir, isIn O(n) linear search, remove: pindah elemen terakhir ke posisi yang dihapus), ' +
  'implementasi array terurut (isIn O(log n) binary search, add O(n) cari posisi+geser), ' +
  'perbandingan kinerja (tidak terurut vs terurut), ' +
  'implementasi hash table (isIn O(1) rata-rata, add O(1) rata-rata), ' +
  'ADT Map — definisi (pasangan key-value, key unik, juga disebut associative array/symbol table/dictionary), ' +
  'operasi (CreateMap/isEmpty/find/set/unset), ' +
  'axiomatic semantics Map (6 aksioma), ' +
  'implementasi array (MapEntry <key,value>, Map <buffer,length>), ' +
  'set() pada Map: jika key ada→update, jika belum→insert; unset(): hapus entri, geser elemen terakhir ke posisi yang dihapus, ' +
  'Hash Table — fungsi hash (memetakan key ke indeks), collision (dua key berbeda → hash sama), ' +
  'strategi chaining (setiap slot = linked list), ' +
  'open addressing: linear probing (+1), quadratic probing (+1,+4,+9), double hashing, ' +
  'load factor (jumlah_terisi/total ≤ 0.7), rehashing, ' +
  'algoritma set pada Map dengan linear probing (probe sampai NIL atau key=k), ' +
  'algoritma find dengan linear probing, ' +
  'masalah penghapusan (tidak bisa langsung kosongkan slot) dan solusinya (tata ulang elemen chain).';

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
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "ADT Set dan Map".\n' +
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
      'Buatkan ' + jumlah + ' soal latihan untuk topik "ADT Set dan Map" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan implementasi, analisis kinerja, atau aksioma)\n' +
      '- 3 soal bertipe "implementasi" (tulis notasi algoritmik + kode, atau simulasi hash table)\n\n' +
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
