import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEPATOXAI | Multimodal Liver Cancer Decision Support",
  description:
    "Professional research platform for explainable, uncertainty-aware liver cancer decision support with doctor-in-the-loop review, audit, and model governance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
