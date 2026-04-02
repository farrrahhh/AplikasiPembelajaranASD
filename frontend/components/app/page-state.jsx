export function PageLoadingState({ title = "Memuat data..." }) {
  return (
    <div className="rounded-[24px] border border-[#dbe2ef] bg-white px-6 py-10 shadow-[0_14px_28px_rgba(18,52,115,0.04)]">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d9e5ff] border-t-[#2f73c9]" />
        <div>
          <h2 className="text-[24px] font-bold text-[#111827]">{title}</h2>
          <p className="mt-1 text-lg text-[#667085]">
            Tunggu sebentar, kami sedang menyiapkan datamu.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PageErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[24px] border border-[#f3c9c6] bg-[#fff6f5] px-6 py-8 shadow-[0_14px_28px_rgba(217,45,32,0.06)]">
      <h2 className="text-[26px] font-bold text-[#7a271a]">
        Data belum berhasil dimuat
      </h2>
      <p className="mt-2 text-lg leading-8 text-[#b42318]">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#b42318] px-5 text-sm font-semibold text-white transition hover:bg-[#912018]"
      >
        Coba lagi
      </button>
    </div>
  );
}
