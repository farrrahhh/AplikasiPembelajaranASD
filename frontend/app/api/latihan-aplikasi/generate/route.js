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
  'Cakupan materi: Aplikasi Struktur Data — empat studi kasus utama:\n\n' +

  '(1) POLINOM: definisi P(x) = aₙxⁿ + ... + a₀, indeks koefisien mulai a₀, ' +
  'sentinel ⟨−999, 0⟩ untuk akhir input, ' +
  'lima proses: membentuk/menuliskan/menjumlahkan/mengurangi/menurunkan, ' +
  'Representasi Kontigu: arrSuku[i]=koefisien suku ke-i, Degree=derajat tertinggi, Polinom kosong: Degree=−999, ' +
  'prosedur: CreatePolinom, adjustDegree (diperlukan jika koefisien tertinggi menjadi 0 setelah add/sub), populatePol, displayPol, addPol, subPol, derivPol, ' +
  'algoritma derivasi kontigu: for i=Degree downto 1: arrSuku1[i−1] = i×arrSuku[i]; Degree1=Degree−1, ' +
  'Representasi Berkait: type Suku=⟨degree, coef, next⟩, type Polinom=Address, list terurut menurun berdasarkan degree, ' +
  'penjumlahan berkait: teknik merging dua list terurut (degree sama→jumlahkan/jika 0 tidak sisipkan, beda→salin yang lebih besar), ' +
  'turunan berkait: InsertLast ke P1 untuk setiap suku berderajat >0 dengan ⟨degree−1, degree×coef⟩, ' +
  'representasi fisik berkait: dengan pointer (pt↑.next) atau tabel (arrSuku[pt].next, initialize/newSuku/deallocSuku), ' +

  '(2) PENGELOLAAN MEMORI: NB blok kontigu, status F=KOSONG/T=ISI, ' +
  'zone bebas=rangkaian blok KOSONG berurutan dinyatakan ⟨Aw, Nb⟩, ' +
  'prosedur: InitMem/AlokBlok(X,IAw)/DeAlokBlok(X,IAw)/GarbageCollection, ' +
  'Representasi Kontigu: STATMEM array[1..NB] of boolean, ' +
  'First Fit: zone kosong pertama yang cukup (stop early), Best Fit: zone terkecil yang cukup (scan semua), ' +
  'GarbageCollection kontigu: dua pass (hitung NKosong, set array) atau satu pass (tukar KOSONG-ISI), ' +
  'Representasi Berkait Blok Kosong: type ZB=⟨Aw, Nb, Next⟩, FIRSTZB terurut menurut Aw, ' +
  'InitMem berkait: buat satu elemen ⟨1, NB⟩, ' +
  'AlokBlok First Fit berkait: sequential search Nb(P)≥X, jika Nb(P)=X→delete, jika Nb(P)>X→update Aw+Nb, ' +
  'DeAlokBlok berkait: 4 kasus (gabung kiri/gabung kanan/gabung keduanya/tidak gabung→insert baru terurut), ' +
  'GarbageCollection berkait: hitung total, ganti list dengan satu elemen ⟨1, total⟩, ' +

  '(3) MULTI-LIST: data Pegawai (nip,nama,jabatan,gajiPokok) dan Anak (nama,tglLahir), ' +
  'Alternatif 1: Pegawai memiliki firstAnak→list Anak sendiri (type Pegawai=⟨...,firstAnak,nextPeg⟩, type Anak=⟨nama,tglLahir,nextAnak⟩), ' +
  'Alternatif 2: list Anak global dengan father pointer (type Anak=⟨nama,tglLahir,father:AdrPeg,nextAnak⟩, FirstPeg dan FirstAnak terpisah), ' +
  'perbandingan: Alt1 efisien untuk "daftar anak tiap pegawai", Alt2 efisien untuk "daftar anak <18th" dan "cari orang tua dari nama anak" (via father pointer O(1)), ' +

  '(4) RELASI M-N (Dosen-MataKuliah): ' +
  'Alternatif 1: list MK per dosen (mudah "MK yang diajar Dosen X", sulit "siapa mengajar MK Y"), ' +
  'Alternatif 2: list Dosen per MK (kebalikan Alt1), ' +
  'Alternatif 3: list relasi terpisah MK_DOS=⟨dosen:AdrDosen, mk:AdrMK, next⟩ (fleksibel kedua arah), ' +
  'AddRel(D,MK): (1) cek/tambah D di list Dosen, (2) cek/tambah MK di list MK, (3) cek duplikat ⟨D,MK⟩, (4) insert node relasi baru, ' +
  'pengembangan: relasi dalam list yang sama (prerequisite antar MK), satu objek banyak relasi.';

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
      'Buatkan tepat 1 soal baru bertipe ' + tipeLabel + ' untuk topik "Aplikasi Struktur Data".\n' +
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
      'Buatkan ' + jumlah + ' soal latihan untuk topik "Aplikasi Struktur Data" dengan distribusi:\n' +
      '- 2 soal bertipe "pengetahuan" (perbandingan representasi, analisis pilihan struktur data, kelemahan konsep)\n' +
      '- 3 soal bertipe "implementasi" (trace algoritma polinom, simulasi alokasi memori First/Best Fit, sketsa algoritma multi-list atau relasi M-N)\n\n' +
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
