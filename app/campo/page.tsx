import Link from "next/link";
import { Camera, CheckCircle2, FileText, Mic, ChevronRight, Home, MapPin, MoreHorizontal } from "lucide-react";
import { getFieldOverview } from "@/lib/overview-data";

export default async function Page() {
  const {rows}=await getFieldOverview();

  return (
    <main className="mobileApp">
      <header>
        <Link href="/">←</Link>
        <div>
          <h1>Campo</h1>
          <p>Registros técnicos em campo</p>
        </div>
        <span className="status regular"><i />Online</span>
      </header>

      <section className="quickGrid">
        <Link href="/campo/evidencia"><Camera /><span>Tirar foto</span></Link>
        <Link href="/campo/ocorrencia"><Mic /><span>Falar</span></Link>
        <Link href="/campo/ocorrencia"><FileText /><span>Escrever</span></Link>
        <Link href="/fiscalizacoes/nova"><CheckCircle2 /><span>Checklist</span></Link>
      </section>

      <div className="sectionTitle"><h2>Últimos registros</h2><Link href="/documentos">Ver registros →</Link></div>
      {rows.length ? rows.map((item:any)=>(
        <div className="mobileRecord" key={item.id}>
          {item.image ? <img src={item.image}/> : <div className="recordPlaceholder"><FileText/></div>}
          <div>
            <strong>{item.title}</strong>
            <span>{item.kind} · {item.subtitle}</span>
            <small>{item.createdAt ? new Date(item.createdAt).toLocaleString("pt-BR") : "—"}</small>
          </div>
          <ChevronRight/>
        </div>
      )) : <div className="emptyState">Nenhum registro de campo ainda.</div>}

      <nav className="bottomNav">
        <Link href="/"><Home/><span>Início</span></Link>
        <Link className="active" href="/campo"><MapPin/><span>Campo</span></Link>
        <Link href="/documentos"><FileText/><span>Registros</span></Link>
        <Link href="/inteligencia"><MoreHorizontal/><span>Mais</span></Link>
      </nav>
    </main>
  );
}
