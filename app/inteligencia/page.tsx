import Link from "next/link";
import { Home, MapPin, FileText, Sparkles } from "lucide-react";
import IntelligenceClient from "@/components/IntelligenceClient";

export default function Page() {
  return (
    <main className="mobileApp intelligencePage">
      <IntelligenceClient />
      <nav className="bottomNav">
        <Link href="/"><Home/><span>Início</span></Link>
        <Link href="/campo"><MapPin/><span>Campo</span></Link>
        <Link href="/documentos"><FileText/><span>Registros</span></Link>
        <Link className="active" href="/inteligencia"><Sparkles/><span>Inteligência</span></Link>
      </nav>
    </main>
  );
}
