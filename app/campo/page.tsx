import Link from "next/link";
import { Camera, CheckCircle2, FileText, Mic, ChevronRight, Home, MapPin, MoreHorizontal, Wifi } from "lucide-react";
import { getFieldOverview } from "@/lib/overview-data";
import { getInterventionsPortfolio } from "@/lib/data";

export default async function Page() {
  const [{rows},portfolio]=await Promise.all([getFieldOverview(),getInterventionsPortfolio()]);
  const active=portfolio.data.find((item:any)=>item.status==="em_andamento") || portfolio.data[0] || null;

  return (
    <main className="mobileApp approvedFieldApp">
      <header className="fieldTopbar">
        <Link href="/" className="mobileBack">←</Link>
        <div className="mobileBrandMini" aria-label="Iphan"/>
        <span className="fieldOnline"><Wifi size={13}/> Online</span>
      </header>

      <section className="fieldHero">
        <p>CAMPO</p>
        <div className="fieldAssetContext">
          <div>
            <h1>{active?.heritageName || "Registro em campo"}</h1>
            <span>{active?.city || "Selecione uma intervenção ativa"}</span>
          </div>
          {active&&<b className="fieldStatus">Em execução</b>}
        </div>
      </section>

      <section className="quickGrid approvedQuickGrid">
        <Link href="/campo/evidencia"><Camera /><strong>Tirar foto</strong><span>Registrar evidência</span></Link>
        <Link href="/campo/ocorrencia?voice=1"><Mic /><strong>Falar</strong><span>Ditado técnico</span></Link>
        <Link href="/campo/ocorrencia"><FileText /><strong>Escrever</strong><span>Nova observação</span></Link>
        <Link href="/fiscalizacoes/nova"><CheckCircle2 /><strong>Checklist</strong><span>Iniciar vistoria</span></Link>
      </section>

      <div className="sectionTitle fieldSectionTitle"><h2>Últimos registros</h2><Link href="/documentos">Ver todos →</Link></div>
      <section className="fieldRecords">
        {rows.length ? rows.slice(0,6).map((item:any,index:number)=>(
          <Link href="/documentos" className="mobileRecord approvedMobileRecord" key={item.id}>
            <span className="fieldRecordThumb" style={{backgroundImage:`url("/visual/field-thumb-${String((index%3)+1).padStart(2,"0")}.webp")`}} aria-hidden="true"/>
            <div>
              <strong>{item.title}</strong>
              <span>{item.kind} · {item.subtitle}</span>
              <small>{item.createdAt ? new Date(item.createdAt).toLocaleString("pt-BR") : "—"}</small>
            </div>
            <ChevronRight/>
          </Link>
        )) : <div className="emptyState">Nenhum registro de campo ainda.</div>}
      </section>

      <nav className="bottomNav approvedBottomNav">
        <Link className="active" href="/"><Home/><span>Início</span></Link>
        <Link href="/campo/ocorrencia"><MapPin/><span>Ocorrências</span></Link>
        <Link href="/campo/evidencia"><FileText/><span>Evidências</span></Link>
        <Link href="/inteligencia"><MoreHorizontal/><span>Mais</span></Link>
      </nav>
    </main>
  );
}
