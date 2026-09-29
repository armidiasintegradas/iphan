import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IPHAN OS — Beta 01",
  description: "Sistema Operacional da Preservação",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
