import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sistema de Gestão da Preservação",
    short_name: "Preservação",
    description: "Plataforma operacional para gestão do patrimônio cultural e das intervenções.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f2",
    theme_color: "#007350",
    lang: "pt-BR",
    orientation: "portrait-primary",
  };
}
