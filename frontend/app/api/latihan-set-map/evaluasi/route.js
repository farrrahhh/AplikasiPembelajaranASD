const RUBRIK = {
  pengetahuan: [
    {
      nama: 'Keakuratan Konsep',
      maks: 40,
      panduan: 'Apakah konsep yang dijelaskan benar dan tepat secara teknis (definisi Set/Map, aksioma, perbedaan implementasi, analisis kinerja hash table)?',
    },
    {
      nama: 'Kelengkapan Penjelasan',
      maks: 30,
      panduan: 'Apakah penjelasan mencakup semua aspek penting dari pertanyaan?',
    },
    {
      nama: 'Kualitas Contoh',
      maks: 30,
      panduan: 'Apakah contoh yang diberikan relevan, spesifik, dan tepat menggambarkan konsep yang diminta?',
    },
  ],
  implementasi: [
    {
      nama: 'Kebenaran Logika',
      maks: 40,
      panduan: 'Apakah logika/algoritma benar? Untuk Set: apakah uniqueness dijaga (cek sebelum add, trik pindah elemen terakhir saat remove)? Untuk Map: apakah set() menangani insert dan update, find() mengembalikan VAL_UNDEF jika tidak ada? Untuk Hash: apakah linear probing benar, loop berhenti di NIL, penghapusan ditata ulang?',
    },
    {
      nama: 'Kelengkapan Notasi / Kode',
      maks: 25,
      panduan: 'Apakah semua bagian yang diminta ada dan lengkap (KAMUS LOKAL, inisialisasi, kondisi loop, I.S./F.S. jika diminta, penanganan kosong)?',
    },
    {
      nama: 'Kesesuaian dengan Notasi Algoritmik',
      maks: 20,
      panduan: 'Apakah jawaban mengikuti notasi algoritmik IF2111 (atau sintaks C) yang diberikan sebagai referensi?',
    },
    {
      nama: 'Penanganan Kasus Tepi',
      maks: 15,
      panduan: 'Apakah kasus tepi ditangani dengan benar (Set/Map kosong, elemen tidak ditemukan, Set/Map penuh, duplikat pada add, key sudah ada pada set Map, collision di hash table, slot kosong saat probe)?',
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

Materi: ADT Set dan Map — Set (elemen unik, tidak terurut; operasi add/remove/isIn/union/intersection/setDifference/isSubset; axiomatic semantics; implementasi array tak terurut O(1) add, O(n) isIn; array terurut O(log n) isIn binary search, O(n) add; trik hapus: pindah elemen terakhir ke posisi terhapus), Map (pasangan key-value, key unik; operasi find/set/unset; axiomatic semantics; set() insert atau update; trik hapus sama dengan Set), Hash Table (fungsi hash k mod CAPACITY; collision; chaining vs open addressing/linear probing; load factor ≤ 0.7; rehashing; masalah penghapusan: tidak bisa langsung kosongkan slot, harus tata ulang chain).

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
