export function TopicIcon({ kind, className = "h-12 w-12" }) {
  const classes = className;

  switch (kind) {
    case "linked-list":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <circle cx="18" cy="18" r="10" stroke="#1D4ED8" strokeWidth="4" />
          <circle cx="46" cy="46" r="10" stroke="#1D4ED8" strokeWidth="4" />
          <path d="M25 25L39 39" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
          <path d="M39 25L25 39" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <path d="M10 18L30 12L44 24L24 30L10 18Z" fill="#7CC35B" stroke="#417D2C" />
          <path d="M10 18V32L24 44V30L10 18Z" fill="#2F73C9" stroke="#1F5BA6" />
          <path d="M24 30L44 24V38L24 44V30Z" fill="#E85A4F" stroke="#AF352C" />
          <path d="M18 34L38 28L52 40L32 46L18 34Z" fill="#E9F2FF" stroke="#A4B7D4" />
        </svg>
      );
    case "queue":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <rect x="10" y="20" width="44" height="24" rx="4" fill="#FFF4B5" stroke="#D1A300" />
          <path d="M18 24V40" stroke="#111827" strokeDasharray="2 3" />
          <path d="M26 24V40" stroke="#111827" strokeDasharray="2 3" />
          <path d="M34 24V40" stroke="#111827" strokeDasharray="2 3" />
          <path d="M42 24V40" stroke="#111827" strokeDasharray="2 3" />
          <path d="M50 24V40" stroke="#111827" strokeDasharray="2 3" />
          <path d="M12 32H52" stroke="#111827" strokeWidth="2" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <circle cx="32" cy="22" r="14" fill="#87C95A" stroke="#4C8D31" />
          <circle cx="22" cy="28" r="12" fill="#9BD86D" />
          <circle cx="42" cy="30" r="12" fill="#7CC35B" />
          <rect x="28" y="36" width="8" height="18" rx="2" fill="#8B5A2B" />
        </svg>
      );
    case "graph":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <circle cx="16" cy="32" r="7" fill="#4D7DE0" />
          <circle cx="32" cy="16" r="7" fill="#4D7DE0" />
          <circle cx="48" cy="32" r="7" fill="#4D7DE0" />
          <circle cx="32" cy="48" r="7" fill="#4D7DE0" />
          <path d="M21 28L27 20" stroke="#4D7DE0" strokeWidth="3" />
          <path d="M37 20L43 28" stroke="#4D7DE0" strokeWidth="3" />
          <path d="M21 36L27 44" stroke="#4D7DE0" strokeWidth="3" />
          <path d="M37 44L43 36" stroke="#4D7DE0" strokeWidth="3" />
          <path d="M23 32H41" stroke="#4D7DE0" strokeWidth="3" />
        </svg>
      );
    case "sorting":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <path d="M26 8L16 28H28L20 56L48 24H36L46 8H26Z" fill="#F5B940" stroke="#D98C00" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <path d="M14 16H30C35 16 38 19 38 24V50H20C16 50 14 48 14 44V16Z" fill="#CFE3FF" stroke="#2F73C9" />
          <path d="M50 16H34C29 16 26 19 26 24V50H44C48 50 50 48 50 44V16Z" fill="#9FC8FF" stroke="#2F73C9" />
          <path d="M32 18V48" stroke="#2F73C9" strokeWidth="2" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <path d="M32 10L38 24H54L41 33L46 48L32 39L18 48L23 33L10 24H26L32 10Z" fill="#BFD8FF" stroke="#1D4ED8" strokeWidth="2" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <path d="M32 10L35 23L48 26L35 29L32 42L29 29L16 26L29 23L32 10Z" fill="#4D7DE0" />
          <path d="M48 36L50 43L57 45L50 47L48 54L46 47L39 45L46 43L48 36Z" fill="#7A55EC" />
          <path d="M18 34L20 42L28 44L20 46L18 54L16 46L8 44L16 42L18 34Z" fill="#2F73C9" />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 64 64" className={classes} fill="none">
          <circle cx="32" cy="32" r="22" stroke="#6C4CF6" strokeWidth="6" />
          <circle cx="32" cy="32" r="10" stroke="#9E89FF" strokeWidth="6" />
          <circle cx="32" cy="32" r="3" fill="#6C4CF6" />
        </svg>
      );
    default:
      return null;
  }
}

export function LinkedListCardVisual() {
  return (
    <div className="relative h-56 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#8ac0f4] to-[#9bcaef] p-5">
      <p className="text-[18px] font-bold text-[#111827]">Head</p>
      <div className="mt-6 flex items-center gap-3">
        {["13", "23", "33", "40"].map((value, index) => (
          <div key={value} className="flex items-center gap-3">
            <div className="flex h-10 w-16 items-center justify-center bg-[#d9ff84] text-[18px] font-bold text-[#111827] shadow-sm">
              {value}
            </div>
            {index < 3 ? <span className="text-3xl text-[#111827]">→</span> : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[16px] italic text-[#172554]">Data Next</p>
      <p className="absolute bottom-6 right-6 text-[18px] font-bold text-[#111827]">
        Tail
      </p>
      <div className="absolute bottom-0 left-0 right-0 bg-black/8 px-5 py-3 text-sm font-medium text-[#17345f]">
        Visual node: setiap kotak menyimpan data dan menunjuk ke node berikutnya.
      </div>
    </div>
  );
}

export function StackCardVisual() {
  return (
    <div className="relative h-56 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#6b4eff] to-[#7c4df0] p-5 text-white">
      <div className="grid h-full grid-cols-2 gap-6">
        <div>
          <p className="text-2xl font-bold">Push</p>
          <div className="mt-4 ml-14 flex w-16 flex-col-reverse border-2 border-white/80 p-1">
            {["A", "B", "C"].map((value, index) => (
              <div
                key={value}
                className={`mb-1 flex h-6 items-center justify-center text-sm font-bold ${
                  index === 0
                    ? "bg-[#d9ff84] text-[#111827]"
                    : index === 1
                      ? "bg-[#9ed0ff] text-[#111827]"
                      : "bg-[#f98dd4] text-[#111827]"
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold">Pop</p>
          <div className="mt-4 ml-6 flex w-16 flex-col-reverse border-2 border-white/80 p-1">
            {["A", "B", "C"].map((value, index) => (
              <div
                key={value}
                className={`mb-1 flex h-6 items-center justify-center text-sm font-bold ${
                  index === 0
                    ? "bg-[#d9ff84] text-[#111827]"
                    : index === 1
                      ? "bg-[#9ed0ff] text-[#111827]"
                      : "bg-[#fcd5ec] text-[#111827]"
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/10 px-5 py-3 text-sm font-medium text-white/90">
        Elemen baru selalu masuk dari atas, dan elemen teratas keluar lebih dulu.
      </div>
    </div>
  );
}

export function QueueCardVisual() {
  return (
    <div className="relative h-56 overflow-hidden rounded-[24px] bg-[#f7bde2] p-5">
      <div className="absolute right-7 top-4 flex h-10 w-14 items-center justify-center bg-[#ecf6d5] text-2xl font-bold text-[#111827]">
        7
      </div>
      <div className="mt-14 flex items-center justify-center gap-0">
        {[3, 4, 5, 6].map((value) => (
          <div
            key={value}
            className="flex h-10 w-14 items-center justify-center border border-white bg-[#c4f780] text-2xl font-bold text-[#111827]"
          >
            {value}
          </div>
        ))}
      </div>
      <div className="absolute left-7 bottom-4 flex h-10 w-14 items-center justify-center bg-[#ecf6d5] text-2xl font-bold text-[#111827]">
        2
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/8 px-5 py-3 text-sm font-medium text-[#5d3550]">
        Queue menjaga urutan datang: yang paling depan diproses lebih dulu.
      </div>
    </div>
  );
}

export function LinkedListLessonVisual() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#dbe6f6] bg-white shadow-[0_16px_32px_rgba(18,52,115,0.05)]">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-[linear-gradient(135deg,#9fcbf6_0%,#dcecff_100%)] px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1d4f91]">
            Diagram utama
          </p>
          <div className="mt-5">
            <LinkedListCardVisual />
          </div>
        </div>
        <div className="bg-[#fbfcfe] px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
            Intuisi cepat
          </p>
          <h4 className="mt-3 text-[26px] font-bold tracking-[-0.02em] text-[#111827]">
            Linked List vs Array
          </h4>
          <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e2e8f0]">
            <div className="grid grid-cols-3 bg-[#eef4ff] px-4 py-3 text-sm font-semibold text-[#17345f]">
              <span>Aspek</span>
              <span>Array</span>
              <span>Linked List</span>
            </div>
            {[
              ["Penyimpanan", "Bersebelahan", "Bisa terpisah"],
              ["Akses indeks", "Cepat", "Harus traversal"],
              ["Insert/Delete", "Perlu geser", "Lebih fleksibel"],
            ].map(([label, left, right]) => (
              <div key={label} className="grid grid-cols-3 border-t border-[#e2e8f0] px-4 py-3 text-sm text-[#475467]">
                <span className="font-semibold text-[#111827]">{label}</span>
                <span>{left}</span>
                <span>{right}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-7 text-[#667085]">
            Seperti pola belajar di halaman dokumentasi, visual ini membantu membedakan
            kapan linked list unggul dan kapan array lebih praktis.
          </p>
        </div>
      </div>
    </div>
  );
}

export function StackLessonVisual() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e2dafd] bg-white shadow-[0_16px_32px_rgba(18,52,115,0.05)]">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-[linear-gradient(135deg,#7c63ff_0%,#a889ff_100%)] px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/80">
            Diagram utama
          </p>
          <div className="mt-5">
            <StackCardVisual />
          </div>
        </div>
        <div className="bg-[#fbfcfe] px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
            Intuisi cepat
          </p>
          <h4 className="mt-3 text-[26px] font-bold tracking-[-0.02em] text-[#111827]">
            Cara kerja LIFO
          </h4>
          <ul className="mt-5 space-y-3 text-[15px] leading-7 text-[#475467]">
            <li className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#6f5ad8]" />
              <span>Push menambah elemen ke bagian paling atas.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#6f5ad8]" />
              <span>Pop menghapus elemen yang paling baru masuk.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#6f5ad8]" />
              <span>Peek membaca elemen teratas tanpa mengubah isi stack.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function QueueLessonVisual() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#f0d6e8] bg-white shadow-[0_16px_32px_rgba(18,52,115,0.05)]">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="bg-[linear-gradient(135deg,#ffc8e8_0%,#ffe6f4_100%)] px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6c3653]">
            Diagram utama
          </p>
          <div className="mt-5">
            <QueueCardVisual />
          </div>
        </div>
        <div className="bg-[#fbfcfe] px-6 py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#667085]">
            Intuisi cepat
          </p>
          <h4 className="mt-3 text-[26px] font-bold tracking-[-0.02em] text-[#111827]">
            Cara kerja FIFO
          </h4>
          <ul className="mt-5 space-y-3 text-[15px] leading-7 text-[#475467]">
            <li className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d08143]" />
              <span>Enqueue selalu menambah elemen ke bagian belakang.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d08143]" />
              <span>Dequeue selalu mengambil elemen dari bagian depan.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d08143]" />
              <span>Urutan kedatangan tetap terjaga dari awal sampai akhir.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
