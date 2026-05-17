const PANDUAN =
  'Panduan kualitas soal:\n' +
  '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n' +
  '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (spesifikasi I.S./F.S. untuk prosedur, KAMUS LOKAL, ALGORITMA). Minta mahasiswa mengimplementasikan ke bahasa C.\n' +
  '- Soal harus berbeda dari soal-soal yang umum/biasa dan menguji pemahaman yang lebih dalam.\n' +
  '- topik: array berisi 2-4 string nama konsep spesifik yang diuji soal tersebut.';

const SOAL_SCHEMA =
  '{\n' +
  '  "soal": [\n' +
  '    {\n' +
  '      "id": integer mulai dari 1,\n' +
  '      "tipe": "pengetahuan" atau "implementasi",\n' +
  '      "topik": [array string konsep],\n' +
  '      "pertanyaan": string pertanyaan lengkap dan jelas,\n' +
  '      "notasiAlgoritma": string notasi algoritmik lengkap, atau null jika tipe pengetahuan\n' +
  '    }\n' +
  '  ]\n' +
  '}';

export async function POST(request) {
  const { jumlah = 5, kelemahan = [], tipe_paksa = null, topik_referensi = [] } = await request.json();

  let systemPrompt;

  if (tipe_paksa && jumlah === 1) {
    const tipeLabel =
      tipe_paksa === 'implementasi'
        ? '"implementasi" (wajib sertakan notasi algoritmik lengkap + implementasi bahasa C)'
        : '"pengetahuan" (esai konsep mendalam)';

    const topikCtx =
      topik_referensi.length > 0
        ? '\nReferensi topik dari soal sebelumnya: ' +
          topik_referensi.join(', ') +
          '. Buat soal yang menguji konsep yang sama atau sangat berkaitan, namun dengan pertanyaan yang berbeda dan sudut pandang berbeda — jangan duplikasi pertanyaan yang ada.'
        : '';

    systemPrompt =
      'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n' +
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "ADT Sederhana".\n' +
      topikCtx + '\n\n' +
      'Cakupan materi: definisi dan konsep ADT, komponen ADT (konstruktor, selektor, predikat, operasi I/O, operasi lain), implementasi ADT POINT dalam bahasa C, penggunaan macro preprocessor sebagai selektor (#define ABSIS(p) (p).x), file .h dan .c, include guard (#ifndef), tipe boolean buatan sendiri, kompilasi multi-file.\n\n' +
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
      'Buatkan ' + jumlah + ' soal latihan untuk topik "ADT Sederhana" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (esai konsep)\n' +
      '- 3 soal bertipe "implementasi" (kode C + notasi algoritmik)\n\n' +
      'Cakupan materi: definisi dan konsep ADT, komponen ADT (konstruktor, selektor, predikat, operasi I/O, operasi lain), implementasi ADT POINT dalam bahasa C, penggunaan macro preprocessor sebagai selektor (#define ABSIS(p) (p).x), notasi algoritmik IF2111, file header .h dan file implementasi .c, include guard (#ifndef/#define/#endif), tipe boolean yang dibuat sendiri, kompilasi multi-file dengan gcc.' +
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
