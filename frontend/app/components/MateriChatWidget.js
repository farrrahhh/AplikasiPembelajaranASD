'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const SUGGESTIONS = [
  'Jelaskan konsep ini dengan contoh sederhana',
  'Apa perbedaan antara...?',
  'Kenapa kita butuh ini?',
  'Saya bingung dengan bagian ini, tolong dijelaskan',
];

export default function MateriChatWidget({ topicSlug }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  const handleSend = useCallback(async (pesan) => {
    const text = (pesan ?? input).trim();
    if (!text || loading) return;
    setInput('');

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/${topicSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesan: text, riwayat: history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal memuat jawaban');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.balasan }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Maaf, terjadi kesalahan: ${e.message}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, messages, topicSlug]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isOpen ? 'bg-gray-700 hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
        title='Tanya AI tentang materi ini'
      >
        {isOpen ? (
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
          </svg>
        ) : (
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8}
              d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
          </svg>
        )}
        {/* Unread badge when closed and has messages */}
        {!isOpen && messages.length > 0 && (
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center'>
            {messages.filter((m) => m.role === 'assistant').length}
          </span>
        )}
      </button>

      {/* ── Chat panel ──────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className='fixed bottom-24 right-6 z-40 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-80 sm:w-96'
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className='bg-blue-600 px-4 py-3 flex items-center gap-3 shrink-0'>
            <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0'>
              <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-white font-semibold text-sm leading-none'>AI Tutor</p>
              <p className='text-blue-200 text-xs mt-0.5'>Tanya apa saja tentang materi ini</p>
            </div>
            <div className='flex items-center gap-2'>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  title='Hapus riwayat chat'
                  className='text-blue-200 hover:text-white text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-blue-500'
                >
                  Hapus
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className='text-blue-200 hover:text-white transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className='flex-1 overflow-y-auto p-3 space-y-3'>
            {messages.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center text-center px-2'>
                <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8}
                      d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                  </svg>
                </div>
                <p className='text-sm font-semibold text-gray-800 mb-1'>Ada yang kurang jelas?</p>
                <p className='text-xs text-gray-500 mb-4 leading-relaxed'>
                  Tanya AI tentang konsep, contoh, atau bagian materi yang membingungkan
                </p>
                <div className='flex flex-col gap-2 w-full'>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className='w-full text-left text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-3 py-2 transition-colors leading-relaxed'
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className='flex justify-start'>
                    <div className='bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3'>
                      <div className='flex gap-1 items-center'>
                        <span className='w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '0ms' }} />
                        <span className='w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '150ms' }} />
                        <span className='w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className='border-t border-gray-100 p-3 flex gap-2 shrink-0'>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ketik pertanyaan... (Enter untuk kirim)'
              rows={1}
              disabled={loading}
              className='flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 max-h-24 overflow-y-auto leading-relaxed'
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className='w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors self-end'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 12h14M12 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
