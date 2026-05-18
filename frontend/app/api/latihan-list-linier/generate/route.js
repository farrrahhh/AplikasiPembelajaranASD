const PANDUAN =
  'Panduan kualitas soal:\n' +
  '- Soal pengetahuan: tanyakan konsep mendalam, minta perbandingan atau penjelasan disertai contoh konkret. Hindari soal trivial ya/tidak.\n' +
  '- Soal implementasi: WAJIB sertakan deklarasi tipe dan signature fungsi yang relevan sebagai referensi. Minta mahasiswa menulis kode C lengkap.\n' +
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
  '      "notasiAlgoritma": string deklarasi tipe + signature + komentar IS/FS sebagai referensi (untuk implementasi), atau null untuk pengetahuan\n' +
  '    }\n' +
  '  ]\n' +
  '}';

const CAKUPAN_MATERI =
  'Cakupan materi: List Linier (Struktur Berkait) — ' +

  'Definisi: node = ⟨info: ElType, next: Address⟩, Address = pointer to Node, ' +
  'newNode(val) mengalokasi dan mengisi node baru; ' +

  'Representasi implisit: type List = Address (L=NIL jika kosong), cocok untuk rekursi; ' +
  'Representasi eksplisit: type List = ⟨first: Address⟩ atau type Queue = ⟨head, tail: Address⟩, cocok untuk Queue; ' +
  'Masalah rekursi pada eksplisit: l.first↑.next bertipe Address bukan List, tidak bisa di-pass langsung ke fungsi rekursif; ' +

  'Array of Node: next = indeks bukan alamat fisik, alokasi massal, node kosong membentuk stack internal (free list); ' +

  'Variasi list: list biasa (First=NIL), list+First&Last, list elemen terakhir→diri sendiri, ' +
  'list dummy akhir+Last (kosong: First=Last=dummy@, search dengan sentinel), ' +
  'list pointer ganda (DLL), list sirkuler (Next(last)=First); ' +

  'List dengan Dummy (sentinel): ' +
  'type List = ⟨first, last: Address⟩, kosong: First=Last=dummy@, ' +
  'indexOf dengan sentinel: simpan x ke INFO(LAST(l)), loop tanpa cek NIL, cek p≠LAST untuk bedakan found vs not found, ' +
  'insertFirst: NEXT(p)=FIRST, FIRST=p; ' +
  'insertLast versi 1 (dummy tetap): sisip node baru sebelum dummy via traversal, ' +
  'insertLast versi 2 (dummy berubah): isi dummy dengan x, alokasi dummy baru, update LAST; ' +
  'deleteFirst: simpan p=FIRST, FIRST=NEXT(FIRST), free(p); ' +
  'deleteLast: traversal untuk cari precLast, perbarui NEXT(precLast)=LAST, free(elemen terakhir nyata); ' +

  'Doubly Linked List (DLL): node = ⟨prev, info, next⟩, type List = ⟨first, last⟩, ' +
  'insertFirst: NEXT(p)=FIRST, PREV(p)=NIL, jika tidak kosong PREV(FIRST)=p else LAST=p, FIRST=p; ' +
  'insertLast: PREV(p)=LAST, NEXT(p)=NIL, jika tidak kosong NEXT(LAST)=p else FIRST=p, LAST=p; ' +
  'deleteFirst: jika 1 elemen LAST=NIL else PREV(NEXT(FIRST))=NIL, FIRST=NEXT(FIRST), free(p); ' +
  'deleteLast: jika 1 elemen FIRST=NIL else NEXT(PREV(LAST))=NIL, LAST=PREV(LAST), free(p); ' +
  'keunggulan: deleteLast O(1) tanpa traversal; ' +

  'List Sirkuler: Next(last)=First, kosong: First=NIL, ' +
  'insertFirst: jika kosong NEXT(p)=p, else traversal ke last, NEXT(p)=FIRST, NEXT(last)=p, FIRST=p; ' +
  'insertLast: jika kosong pakai insertFirst, else traversal ke last, NEXT(last)=p, NEXT(p)=FIRST; ' +
  'deleteFirst: jika 1 elemen FIRST=NIL, else traversal ke last, FIRST=NEXT(FIRST), NEXT(last)=FIRST, free(p); ' +
  'deleteLast: traversal dengan precLast, jika 1 elemen FIRST=NIL, else NEXT(precLast)=FIRST, free(last); ' +
  'displayList: do-while karena harus proses First sebelum cek kondisi; ' +
  'addrSearch: traversal sampai NEXT(pt)=First atau pt=p; ' +

  'Stack berkait: type Stack = ⟨addrTop: Address⟩, push≡insertFirst O(1), pop≡deleteFirst O(1); ' +
  'Queue berkait: type Queue = ⟨addrHead, addrTail: Address⟩, enqueue≡insertLast O(1), dequeue≡deleteFirst O(1); ' +
  'Priority Queue: node = ⟨info, prio, next⟩, enqueue = sortedInsert O(n), dequeue = deleteFirst O(1); ' +
  'sortedInsert: traversal Prec+P sampai INFO(P)≥x, NEXT(baru)=P dulu lalu NEXT(Prec)=baru, jika Prec=NIL update First; ' +

  'Operasi umum list: countPos (hitung elemen>0), max (nilai terbesar), searchPos (address elemen positif pertama), ' +
  'deleteNeg (hapus semua <0 dengan dealokasi), copyPos (salin elemen>0 ke list baru), updateList (ganti kemunculan pertama x dengan y).';

export async function POST(request) {
  const { jumlah = 5, kelemahan = [], tipe_paksa = null, topik_referensi = [] } = await request.json();

  let systemPrompt;

  if (tipe_paksa && jumlah === 1) {
    const tipeLabel =
      tipe_paksa === 'implementasi'
        ? '"implementasi" (sertakan deklarasi tipe dan signature fungsi sebagai referensi)'
        : '"pengetahuan" (esai konsep mendalam)';

    const topikCtx =
      topik_referensi.length > 0
        ? '\nReferensi topik dari soal sebelumnya: ' +
          topik_referensi.join(', ') +
          '. Buat soal yang menguji konsep yang sama atau sangat berkaitan, namun dengan pertanyaan yang berbeda dan sudut pandang berbeda — jangan duplikasi pertanyaan yang ada.'
        : '';

    systemPrompt =
      'Kamu adalah dosen mata kuliah Algoritma dan Struktur Data (ASD) ITB.\n' +
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "List Linier (Struktur Berkait)".\n' +
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
      'Buatkan ' + jumlah + ' soal latihan untuk topik "List Linier (Struktur Berkait)" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (perbandingan variasi list, analisis kompleksitas, kelebihan/kekurangan, pertanyaan konsep mendalam)\n' +
      '- 3 soal bertipe "implementasi" (tulis fungsi C lengkap: operasi list biasa, DLL, list sirkuler, stack, queue, priority queue, atau sortedInsert)\n\n' +
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
