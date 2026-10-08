import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQL for Finance",
  description: "Learn SQL from first principles to junior financial analyst standard, through realistic banking and markets scenarios.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-950 text-[#e6e9ef] antialiased">{children}</body>
    </html>
  );
}
