const PANDUAN =
  'Panduan kualitas soal:\n' +
  '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n' +
  '- Soal implementasi: WAJIB sertakan notasi algoritmik lengkap (I.S./F.S., KAMUS LOKAL, ALGORITMA). Minta mahasiswa menulis notasi algoritmik ATAU mengimplementasikan ke bahasa C.\n' +
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
  '      "notasiAlgoritma": string notasi algoritmik lengkap sebagai referensi (untuk tipe implementasi), atau null jika tipe pengetahuan\n' +
  '    }\n' +
  '  ]\n' +
  '}';

const CAKUPAN_MATERI =
  'Cakupan materi: konsep mesin abstrak, komponen mesin karakter (pita, CC/current character, EOP/end of pita, MARK=\'.\', tombol start/adv), primitif start dan adv (I.S./F.S.), pola pemrosesan pita karakter (first elmt/next elmt/while cc≠MARK), studi kasus mesin karakter (CountCharacters, CountA, Hitung-LE), konsep mesin kata (kata = deretan karakter non-blank, type Kata dengan buffer dan length), primitif bersama ignoreBlank dan salinKata, tiga versi model akuisisi kata (Versi 1 dengan endKata boolean, Versi 2 dengan length=0 sebagai sentinel, Versi 3 dengan cc=MARK langsung dan initAkses), pola penggunaan dan perbedaan ketiga versi, implementasi di C (mesinkar.h, mesinkar.c, mesinkata1.h, mesinkata1.c), studi kasus mesin kata (panjang rata-rata kata, hitung kemunculan kata WHILE, fungsi isKataEqual), kompilasi multi-file dengan cc/gcc.';

export async function POST(request) {
  const { jumlah = 5, kelemahan = [], tipe_paksa = null, topik_referensi = [] } = await request.json();

  let systemPrompt;

  if (tipe_paksa && jumlah === 1) {
    const tipeLabel =
      tipe_paksa === 'implementasi'
        ? '"implementasi" (wajib sertakan notasi algoritmik lengkap sebagai referensi)'
        : '"pengetahuan" (esai konsep mendalam)';

    const topikCtx =
      topik_referensi.length > 0
        ? '\nReferensi topik dari soal sebelumnya: ' +
          topik_referensi.join(', ') +
          '. Buat soal yang menguji konsep yang sama atau sangat berkaitan, namun dengan pertanyaan yang berbeda dan sudut pandang berbeda — jangan duplikasi pertanyaan yang ada.'
        : '';

    systemPrompt =
      'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n' +
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "Mesin Karakter dan Mesin Kata".\n' +
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
      'Buatkan ' + jumlah + ' soal latihan untuk topik "Mesin Karakter dan Mesin Kata" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (esai konsep, perbandingan, atau analisis)\n' +
      '- 3 soal bertipe "implementasi" (tulis notasi algoritmik + kode)\n\n' +
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
