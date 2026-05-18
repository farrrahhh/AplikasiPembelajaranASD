const RUBRIK = {
  pengetahuan: [
    {
      nama: 'Keakuratan Konsep',
      maks: 40,
      panduan: 'Apakah konsep yang dijelaskan benar secara teknis? Misalnya: perbedaan implisit vs eksplisit, kapan DLL lebih efisien dari SLL, sifat sirkuler (Next(last)=First), kompleksitas operasi (deleteLast O(n) di SLL vs O(1) di DLL), fungsi dummy/sentinel, Array of Node (indeks bukan alamat), perbedaan Stack LIFO vs Queue FIFO, sortedInsert?',
    },
    {
      nama: 'Kelengkapan Penjelasan',
      maks: 30,
      panduan: 'Apakah semua aspek pertanyaan dijawab? Misalnya semua kasus yang diminta, semua variasi yang dibandingkan, semua langkah algoritma yang relevan?',
    },
    {
      nama: 'Kualitas Contoh',
      maks: 30,
      panduan: 'Apakah contoh yang diberikan relevan dan konkret? Misalnya: contoh trace pointer saat insert/delete, contoh list sirkuler dengan visualisasi chain, contoh evaluasi ekspresi postfix dengan stack, contoh sortedInsert dengan list terurut?',
    },
  ],
  implementasi: [
    {
      nama: 'Kebenaran Logika',
      maks: 40,
      panduan: 'Apakah logika/algoritma benar? Untuk insertFirst/insertLast: apakah semua pointer (next, prev jika DLL) diperbarui dengan benar? Untuk deleteFirst/deleteLast: apakah pointer predecessor diperbarui? Untuk sirkuler: apakah Next(last) diperbarui sehingga tetap melingkar? Untuk sortedInsert: apakah loop berhenti di INFO(P)≥x, NEXT(baru)=P sebelum NEXT(Prec)=baru, Prec=NIL→update First? Untuk DLL: apakah PREV dari elemen tetangga juga diperbarui? Untuk dequeue: apakah TAIL=NIL saat queue jadi kosong?',
    },
    {
      nama: 'Kelengkapan Kode',
      maks: 25,
      panduan: 'Apakah semua bagian yang diperlukan ada? Misalnya: newNode/alokasi node, penanganan alokasi gagal (p==NIL), inisialisasi pointer (PREV=NIL, NEXT=NIL di DLL), update First dan Last dengan benar, free(p) saat dealokasi?',
    },
    {
      nama: 'Kesesuaian Sintaks C',
      maks: 20,
      panduan: 'Apakah kode mengikuti sintaks C yang benar dan menggunakan makro yang diberikan (INFO(p), NEXT(p), PREV(p), FIRST(l), LAST(l), ADDR_TOP, ADDR_HEAD, ADDR_TAIL)? Apakah pointer parameter menggunakan *l atau *s dengan benar?',
    },
    {
      nama: 'Penanganan Kasus Tepi',
      maks: 15,
      panduan: 'Apakah kasus tepi ditangani? Misalnya: list kosong saat insert pertama, list 1 elemen saat delete (First=Last=NIL), sirkuler 1 elemen saat deleteFirst (FIRST=NIL), alokasi gagal (p==NIL → return tanpa crash), Prec=NIL saat sortedInsert di awal list, queue jadi kosong setelah dequeue?',
    },
  ],
};

export async function POST(request) {
  const { soal, jawaban } = await request.json();

  if (!soal) {
    return Response.json({ error: 'Tidak ada soal.' }, { status: 400 });
  }

  const tipe = soal.tipe === 'implementasi' ? 'implementasi' : 'pengetahuan';
  const rubrik = RUBRIK[tipe];
  const totalMaks = rubrik.reduce((a, r) => a + r.maks, 0);
  const rubrikText = rubrik.map((r) => `- ${r.nama} (0–${r.maks} poin): ${r.panduan}`).join('\n');

  const systemPrompt = `Kamu adalah tutor mata kuliah Algoritma dan Struktur Data (ASD) untuk program studi STI ITB.
Evaluasi jawaban mahasiswa secara objektif menggunakan rubrik penilaian yang ditentukan.

Materi: List Linier (Struktur Berkait) — deklarasi node ⟨info,next⟩, representasi implisit (type List=Address) vs eksplisit (type List=⟨first⟩), Array of Node (next=indeks), list dengan dummy/sentinel (indexOf efisien), Doubly Linked List (prev+info+next, deleteLast O(1)), List Sirkuler (Next(last)=First, do-while display), Stack berkait (push=insertFirst, pop=deleteFirst), Queue berkait (enqueue=insertLast O(1) dengan TAIL, dequeue=deleteFirst), Priority Queue (sortedInsert O(n)), operasi umum (countPos, max, searchPos, deleteNeg, copyPos, updateList, sortedInsert).

RUBRIK PENILAIAN (${tipe === 'implementasi' ? 'Soal Implementasi' : 'Soal Pengetahuan'}):
${rubrikText}

Total maksimum: ${totalMaks} poin.

Respons HARUS berupa JSON valid dengan struktur PERSIS:
{
  "nilai": <"Sangat Baik" | "Baik" | "Cukup" | "Perlu Perbaikan" | "Belum Dijawab">,
  "skor": <integer 0–100, proporsional dari total poin rubrik yang diperoleh>,
  "metrik": [
    {
      "nama": <string nama kriteria sesuai rubrik>,
      "skor": <integer 0 hingga nilai maks kriteria>,
      "maks": <integer nilai maks kriteria>,
      "keterangan": <string alasan singkat penilaian kriteria ini, 1–2 kalimat>
    }
  ],
  "komentar": <string ringkasan umpan balik keseluruhan>,
  "yang_benar": <string apa yang sudah benar, null jika belum dijawab>,
  "yang_perlu_diperbaiki": <string apa yang perlu diperbaiki, null jika sempurna atau belum dijawab>,
  "konsep_lemah": [<string nama konsep spesifik yang perlu diperdalam>]
}

Aturan:
- "skor" (0–100) = (jumlah poin metrik / ${totalMaks}) × 100, dibulatkan ke integer.
- Jika jawaban kosong: nilai "Belum Dijawab", skor 0, semua metrik skor 0.
- Konsistensi nilai: ≥85 = Sangat Baik, 70–84 = Baik, 50–69 = Cukup, <50 = Perlu Perbaikan.
- Urutan "metrik" harus sama persis dengan urutan rubrik yang diberikan.`;

  const soalText = `## Soal ${soal.id} — ${tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
Topik: ${soal.topik.join(', ')}
Pertanyaan: ${soal.pertanyaan}${soal.notasiAlgoritma ? `\n\nReferensi Kode:\n${soal.notasiAlgoritma}` : ''}

Jawaban Mahasiswa:
${jawaban?.trim() || '(tidak dijawab)'}`;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: soalText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.json().catch(() => ({}));
    return Response.json({ error: err.error?.message ?? 'OpenAI API error' }, { status: 500 });
  }

  const data = await openaiRes.json();
  const content = JSON.parse(data.choices[0].message.content);
  return Response.json({ id: soal.id, ...content });
}
