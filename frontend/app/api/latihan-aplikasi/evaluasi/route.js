const RUBRIK = {
  pengetahuan: [
    {
      nama: 'Keakuratan Konsep',
      maks: 40,
      panduan: 'Apakah konsep yang dijelaskan benar secara teknis? Misalnya: definisi zone bebas ⟨Aw,Nb⟩, perbedaan First Fit vs Best Fit, struktur node Suku/ZB/Pegawai/Anak/MK_DOS, teknik merging untuk penjumlahan polinom berkait, 4 kasus DeAlokBlok, kegunaan father pointer, perbedaan 3 alternatif relasi M-N?',
    },
    {
      nama: 'Kelengkapan Penjelasan',
      maks: 30,
      panduan: 'Apakah semua aspek pertanyaan dijawab? Misalnya semua prosedur/alternatif yang diminta, semua langkah algoritma yang relevan, semua kasus yang harus ditangani?',
    },
    {
      nama: 'Kualitas Contoh',
      maks: 30,
      panduan: 'Apakah contoh yang diberikan relevan, spesifik, dan tepat? Misalnya: contoh trace arrSuku sebelum/sesudah derivasi, contoh zone kosong dengan status memori konkret, contoh struktur multi-list dengan data nyata, contoh relasi M-N dengan dosen dan MK konkret?',
    },
  ],
  implementasi: [
    {
      nama: 'Kebenaran Logika',
      maks: 40,
      panduan: 'Apakah logika/algoritma benar? Untuk derivasi polinom: apakah loop dari Degree downto 1, arrSuku1[i−1]=i×arrSuku[i], Degree1=Degree−1? Untuk First/Best Fit: apakah kondisi penghentian benar, apakah update Aw/Nb tepat? Untuk DeAlokBlok: apakah 4 kasus ditangani (gabung kiri, gabung kanan, gabung keduanya, tidak gabung)? Untuk multi-list: apakah traversal benar, pointer father digunakan dengan tepat? Untuk AddRel: apakah 4 langkah dilakukan (cek/tambah Dosen, cek/tambah MK, cek duplikat, insert relasi)?',
    },
    {
      nama: 'Kelengkapan Notasi / Kode',
      maks: 25,
      panduan: 'Apakah semua bagian yang diminta ada dan lengkap (KAMUS, inisialisasi, kondisi loop, penanganan NIL, update pointer, dealokasi)?',
    },
    {
      nama: 'Kesesuaian dengan Notasi Algoritmik',
      maks: 20,
      panduan: 'Apakah jawaban mengikuti notasi algoritmik IF2111 (atau sintaks C) yang diberikan sebagai referensi? Misalnya penggunaan p↑.next, p↑.arrSuku, ←, for/while/do-while, penanganan kasus edge dengan IF-THEN-ELSE?',
    },
    {
      nama: 'Penanganan Kasus Tepi',
      maks: 15,
      panduan: 'Apakah kasus tepi ditangani? Misalnya: polinom kosong (Degree=−999), adjustDegree jika koefisien tertinggi=0 setelah operasi, alokasi gagal (IAw=0), zone tidak ditemukan, list kosong, anak baru yang bapaknya belum ada, duplikat relasi tidak diinsert?',
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

Materi: Aplikasi Struktur Data — Polinom (representasi kontigu dengan arrSuku/Degree, representasi berkait terurut menurun, 5 operasi termasuk derivasi dan merging untuk penjumlahan), Pengelolaan Memori (zone bebas ⟨Aw,Nb⟩, First Fit vs Best Fit, AlokBlok, DeAlokBlok 4 kasus, GarbageCollection 2 pendekatan), Multi-List Pegawai-Anak (Alt1: list anak per pegawai, Alt2: list global + father pointer), Relasi M-N Dosen-MataKuliah (Alt1: mengajar, Alt2: diajar oleh, Alt3: list terpisah MK_DOS, prosedur AddRel 4 langkah).

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
