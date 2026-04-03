import "./globals.css";

export const metadata = {
  title: {
    default: "Aplikasi Pembelajaran ASD",
    template: "%s | Aplikasi Pembelajaran ASD",
  },
  description: "Platform belajar Algoritma dan Struktur Data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
