export async function POST(request) {
  const { soal, jawaban } = await request.json();

  if (!soal?.length) {
    return Response.json({ error: 'Tidak ada soal yang dikirim.' }, { status: 400 });
  }

  const soalDenganJawaban = soal.map((s) => ({
    ...s,
    jawaban: jawaban[s.id] ?? '',
  }));

  const systemPrompt = `Kamu adalah tutor mata kuliah Algoritma dan Struktur Data (ASD) untuk program studi STI ITB.
Tugasmu adalah menganalisis jawaban mahasiswa secara mendalam dan memberikan umpan balik yang konstruktif, spesifik, dan edukatif dalam Bahasa Indonesia.

Materi yang diuji: Pengantar ASD — algoritma, struktur data, paradigma prosedural, ADT, fungsi & prosedur, rekursi, pointer, modularitas program C (file .h, .c, main.c).

Panduan analisis:
- Untuk soal PENGETAHUAN: nilai keakuratan konsep, kelengkapan penjelasan, dan kualitas contoh.
- Untuk soal IMPLEMENTASI: nilai kebenaran logika, penggunaan pointer, tipe return, dan kesesuaian dengan notasi algoritma.
- Jika jawaban kosong, kosongkan atau nilai "Belum Dijawab" dengan skor 0.

Respons HARUS berupa JSON valid dengan struktur PERSIS sebagai berikut:
{
  "feedback": [
    {
      "id": <integer nomor soal>,
      "nilai": <"Sangat Baik" | "Baik" | "Cukup" | "Perlu Perbaikan" | "Belum Dijawab">,
      "skor": <integer 0–100>,
      "komentar": <string ringkasan umpan balik>,
      "yang_benar": <string apa yang sudah benar, null jika belum dijawab>,
      "yang_perlu_diperbaiki": <string apa yang perlu diperbaiki, null jika sudah sempurna atau belum dijawab>,
      "konsep_lemah": [<string nama konsep spesifik yang perlu diperdalam>]
    }
  ],
  "analisis_kelemahan": <string analisis komprehensif tentang pola kelemahan mahasiswa>,
  "area_fokus": [<string area topik yang disarankan untuk dipelajari ulang>],
  "soal_tambahan": [
    {
      "topik": <string topik soal>,
      "tipe": <"Pengetahuan" | "Implementasi">,
      "pertanyaan": <string pertanyaan lengkap dan jelas>,
      "hint": <string petunjuk singkat tanpa memberi jawaban langsung>
    }
  ]
}

Buat 2–3 soal tambahan yang langsung menargetkan kelemahan mahasiswa.`;

  const userPrompt = soalDenganJawaban
    .map(
      (s) =>
        `## Soal ${s.id} — ${s.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
Topik: ${s.topik.join(', ')}
Pertanyaan: ${s.pertanyaan}${s.notasiAlgoritma ? `\n\nNotasi Algoritma:\n${s.notasiAlgoritma}` : ''}

Jawaban Mahasiswa:
${s.jawaban.trim() || '(tidak dijawab)'}`
    )
    .join('\n\n---\n\n');

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
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    }),
  });

  if (!openaiRes.ok) {
    const err = await openaiRes.json().catch(() => ({}));
    return Response.json(
      { error: err.error?.message ?? 'OpenAI API error' },
      { status: 500 }
    );
  }

  const data = await openaiRes.json();
  const content = JSON.parse(data.choices[0].message.content);
  return Response.json(content);
}
