import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "DevMentor",
  description: "Mentoring for developers.",
};

export default function FrontendLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body className="min-h-svh bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
