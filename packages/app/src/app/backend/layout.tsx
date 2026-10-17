import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@devmentor/ui/globals.css";

export const metadata: Metadata = {
  title: "DevMentor — panel",
};

export default function BackendLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body className="min-h-svh antialiased">
        <div className="mx-auto max-w-5xl p-6">{children}</div>
      </body>
    </html>
  );
}
