'use client';

import { useState, useRef, useCallback } from 'react';

const NILAI_COLOR = {
  'Sangat Baik':    'bg-green-100 text-green-700 border-green-300',
  'Baik':           'bg-blue-100 text-blue-700 border-blue-200',
  'Cukup':          'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Perlu Perbaikan':'bg-red-100 text-red-700 border-red-200',
  'Belum Dijawab':  'bg-gray-100 text-gray-500 border-gray-200',
};

const SKOR_BAR = (s) =>
  s >= 85 ? 'bg-green-500' : s >= 70 ? 'bg-blue-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-400';

const ACCEPTED_TYPES = ['.txt', '.md', '.text'];
const ACCEPTED_MIME  = ['text/plain', 'text/markdown', 'text/x-markdown'];

function isAccepted(file) {
  if (ACCEPTED_MIME.includes(file.type)) return true;
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  return ACCEPTED_TYPES.includes(ext);
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsText(file, 'UTF-8');
  });
}

export default function SoalSendiriPanel({ topicSlug, onGoToMateri }) {
  const [pertanyaan, setPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!isAccepted(file)) {
      setError('Format file tidak didukung. Gunakan .txt atau .md');
      return;
    }
    setError('');
    try {
      const text = await readFileAsText(file);
      setPertanyaan(text);
      setFileName(file.name);
    } catch {
      setError('Gagal membaca file. Coba paste teks secara manual.');
    }
  }, []);

  const onDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleEvaluasi = async () => {
    if (!pertanyaan.trim()) {
      setError('Masukkan soal/pertanyaan terlebih dahulu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/soal-sendiri/${topicSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pertanyaan: pertanyaan.trim(), jawaban: jawaban.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Evaluasi gagal');
      setHasil(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPertanyaan('');
    setJawaban('');
    setHasil(null);
    setError('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
        <svg className='animate-spin w-8 h-8 mb-4 text-blue-500' viewBox='0 0 24 24' fill='none'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
        </svg>
        <p className='text-sm font-medium'>AI sedang mengevaluasi jawabanmu...</p>
        <p className='text-xs text-gray-400 mt-1'>Biasanya membutuhkan 5–15 detik</p>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  if (hasil) {
    return (
      <div className='text-[15px] text-gray-700'>
        {/* Score card */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white mb-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-200 text-sm font-medium'>Skor</p>
              <p className='text-4xl font-bold'>
                {hasil.skor}<span className='text-xl text-blue-300'>/100</span>
              </p>
              <span className={`mt-1 inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${NILAI_COLOR[hasil.nilai] ?? 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                {hasil.nilai}
              </span>
            </div>
            <div className='text-right'>
              <p className='text-blue-200 text-sm'>Tipe soal</p>
              <p className='text-sm font-semibold'>
                {hasil.tipe_soal === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
              </p>
            </div>
          </div>
          <div className='mt-3 bg-blue-500 rounded-full h-2'>
            <div className={`h-2 rounded-full ${SKOR_BAR(hasil.skor)}`} style={{ width: `${hasil.skor}%` }} />
          </div>
        </div>

        {/* Soal & jawaban recap */}
        <div className='border border-gray-200 rounded-xl overflow-hidden mb-4'>
          <div className='bg-gray-50 px-4 py-2.5 border-b border-gray-200'>
            <span className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Soal</span>
          </div>
          <p className='px-4 py-3 text-sm text-gray-800 whitespace-pre-line'>{pertanyaan}</p>
          {jawaban.trim() && (
            <>
              <div className='bg-gray-50 px-4 py-2 border-t border-gray-100'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Jawabanmu</span>
              </div>
              <pre className={`px-4 py-3 text-sm whitespace-pre-wrap overflow-x-auto ${hasil.tipe_soal === 'implementasi' ? 'font-mono bg-gray-900 text-green-300 text-[12px]' : 'bg-white text-gray-700 font-sans'}`}>
                {jawaban}
              </pre>
            </>
          )}
        </div>

        {/* Feedback */}
        <div className='border border-gray-200 rounded-xl overflow-hidden mb-4'>
          <div className='bg-gray-50 px-4 py-2.5 border-b border-gray-200'>
            <span className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Feedback AI</span>
          </div>
          <div className='px-4 py-4 space-y-3'>
            <p className='text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 leading-relaxed'>
              {hasil.komentar}
            </p>
            {hasil.yang_benar && (
              <div className='bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-sm text-green-800 leading-relaxed'>
                <span className='font-semibold'>✓ Yang sudah benar: </span>{hasil.yang_benar}
              </div>
            )}
            {hasil.yang_perlu_diperbaiki && (
              <div className='bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-800 leading-relaxed'>
                <span className='font-semibold'>✗ Perlu diperbaiki: </span>{hasil.yang_perlu_diperbaiki}
              </div>
            )}
          </div>
        </div>

        {/* Weaknesses + recommendations */}
        {(hasil.konsep_lemah?.length > 0 || hasil.rekomendasi_belajar?.length > 0) && (
          <div className='border border-orange-200 rounded-xl overflow-hidden mb-5'>
            <div className='bg-orange-50 px-4 py-2.5 border-b border-orange-200'>
              <span className='text-orange-700 font-bold text-sm'>Analisis & Rekomendasi Belajar</span>
            </div>
            <div className='px-4 py-3 space-y-3'>
              {hasil.konsep_lemah?.length > 0 && (
                <div>
                  <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5'>
                    Konsep yang perlu diperkuat
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {hasil.konsep_lemah.map((k) => (
                      <span key={k} className='text-[11px] bg-orange-50 border border-orange-300 text-orange-700 px-2.5 py-1 rounded-full font-medium'>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hasil.rekomendasi_belajar?.length > 0 && (
                <div>
                  <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5'>
                    Topik yang direkomendasikan
                  </p>
                  <ul className='space-y-1.5'>
                    {hasil.rekomendasi_belajar.map((r, i) => (
                      <li key={i} className='text-sm text-gray-700 flex items-start gap-2'>
                        <span className='text-orange-400 mt-0.5 shrink-0'>→</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {onGoToMateri && (
                <button
                  onClick={onGoToMateri}
                  className='text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors mt-1'
                >
                  ← Pelajari di tab Materi
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleReset}
          className='w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors'
        >
          Coba Soal Lain
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className='text-[15px] text-gray-700'>
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-gray-900 mb-1'>Soal Sendiri</h2>
        <p className='text-sm text-gray-500'>
          Upload file soal atau ketik langsung, lalu tulis jawabanmu untuk dievaluasi AI.
        </p>
      </div>

      <div className='space-y-4'>
        {/* ── File upload drop zone ── */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
            Soal / Pertanyaan <span className='text-red-500'>*</span>
          </label>

          {/* Drop zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mb-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 cursor-pointer transition-colors select-none ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <svg className={`w-7 h-7 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
            </svg>
            {fileName ? (
              <div className='text-center'>
                <p className='text-sm font-medium text-blue-700'>{fileName}</p>
                <p className='text-xs text-gray-400 mt-0.5'>Klik untuk ganti file</p>
              </div>
            ) : (
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600'>
                  {isDragging ? 'Lepas file di sini' : 'Drag & drop atau klik untuk upload'}
                </p>
                <p className='text-xs text-gray-400 mt-0.5'>.txt atau .md</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='.txt,.md,.text,text/plain,text/markdown'
            className='hidden'
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />

          {/* Divider */}
          <div className='flex items-center gap-2 mb-2'>
            <div className='flex-1 h-px bg-gray-200' />
            <span className='text-xs text-gray-400 font-medium'>atau ketik langsung</span>
            <div className='flex-1 h-px bg-gray-200' />
          </div>

          {/* Textarea */}
          <textarea
            value={pertanyaan}
            onChange={(e) => { setPertanyaan(e.target.value); if (e.target.value !== pertanyaan) setFileName(''); }}
            placeholder='Ketik atau paste soal di sini...'
            rows={5}
            className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y'
          />
        </div>

        {/* Jawaban */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
            Jawaban Kamu
            <span className='ml-1 text-xs text-gray-400 font-normal'>(boleh kosong)</span>
          </label>
          <textarea
            value={jawaban}
            onChange={(e) => setJawaban(e.target.value)}
            placeholder='Tulis jawabanmu di sini...'
            rows={6}
            className='w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono'
          />
        </div>

        {error && (
          <p className='text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2.5'>
            {error}
          </p>
        )}

        <button
          onClick={handleEvaluasi}
          disabled={!pertanyaan.trim()}
          className='w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors'
        >
          Evaluasi Jawaban
        </button>
      </div>

      <div className='mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl'>
        <p className='text-xs font-bold text-blue-600 uppercase tracking-widest mb-2'>Tips</p>
        <ul className='text-sm text-blue-800 space-y-1 list-disc list-inside'>
          <li>Upload file .txt berisi soal, atau ketik/paste langsung</li>
          <li>Soal bisa berupa esai, implementasi kode C, trace algoritma, atau analisis</li>
          <li>Jawaban boleh kosong, AI tetap memberikan penjelasan dan rekomendasi</li>
        </ul>
      </div>
    </div>
  );
}
