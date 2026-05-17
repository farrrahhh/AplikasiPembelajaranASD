const RUBRIK = {
  pengetahuan: [
    {
      nama: 'Keakuratan Konsep',
      maks: 40,
      panduan: 'Apakah konsep yang dijelaskan benar dan tepat secara teknis (definisi graph G=(V,E), terminologi adjacent/incident/degree, perbedaan directed vs undirected, perbedaan representasi adjacency matrix vs list, struktur multilist, kompleksitas memori)?',
    },
    {
      nama: 'Kelengkapan Penjelasan',
      maks: 30,
      panduan: 'Apakah penjelasan mencakup semua aspek penting dari pertanyaan (misalnya semua representasi yang diminta, semua kasus pada operasi, semua jenis graph)?',
    },
    {
      nama: 'Kualitas Contoh',
      maks: 30,
      panduan: 'Apakah contoh yang diberikan relevan, spesifik, dan tepat menggambarkan konsep yang diminta (contoh adjacency matrix konkret, contoh directed graph dengan predecessor/successor, trace insertEdge)?',
    },
  ],
  implementasi: [
    {
      nama: 'Kebenaran Logika',
      maks: 40,
      panduan: 'Apakah logika/algoritma benar? Untuk searchNode: apakah loop berhenti di NIL atau id=x? Untuk insertNode: apakah posisi terurut dijaga? Untuk insertEdge: apakah cek duplikat dengan searchEdge, menambahkan SuccNode ke trailer prec, dan mengincrementasi nPred succ? Untuk deleteNode: apakah semua 4 langkah ditangani (hapus trailer x, hapus SuccNode yang menuju x dari semua simpul lain + update nPred, hapus dari leader list, dealokasi)?',
    },
    {
      nama: 'Kelengkapan Notasi / Kode',
      maks: 25,
      panduan: 'Apakah semua bagian yang diminta ada dan lengkap (KAMUS, inisialisasi, kondisi loop, penanganan NIL, update nPred, dealokasi)?',
    },
    {
      nama: 'Kesesuaian dengan Notasi Algoritmik',
      maks: 20,
      panduan: 'Apakah jawaban mengikuti notasi algoritmik IF2111 (atau sintaks C) yang diberikan sebagai referensi? Misalnya penggunaan p↑.id, p↑.next, p↑.trail, pt↑.succ, ←, do-while/while.',
    },
    {
      nama: 'Penanganan Kasus Tepi',
      maks: 15,
      panduan: 'Apakah kasus tepi ditangani dengan benar (graph kosong, simpul tidak ditemukan = NIL, busur duplikat tidak ditambahkan, insertNode di posisi awal leader list, deleteNode dari simpul yang tidak punya successor/predecessor)?',
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

Materi: Graph — definisi G=(V,E), terminologi (adjacent/incident/degree), variasi graph (weighted/directed/undirected/simple/regular/complete/empty), aplikasi, representasi (adjacency matrix O(V²)/adjacency list O(V+E)/incidence matrix/incidence list/edge list), directed graph (predecessor/successor), implementasi multilist (Node dengan id/nPred/trail/next, SuccNode dengan succ/next, Graph dengan first), leader list (simpul terurut), trailer list (successor per simpul), primitif: searchNode/searchEdge/insertNode/insertEdge/deleteNode.

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
Pertanyaan: ${soal.pertanyaan}${soal.notasiAlgoritma ? `\n\nNotasi Algoritma (referensi):\n${soal.notasiAlgoritma}` : ''}

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
