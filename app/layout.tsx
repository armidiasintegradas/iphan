import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Gestão da Preservação — Beta 01",
  description: "Plataforma operacional para gestão do patrimônio cultural e das intervenções.",
  applicationName: "Sistema de Gestão da Preservação",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Preservação",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
