import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getConservationOverview} from "@/lib/overview-data";
import Link from "next/link";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

export default async function Page(){
  const {heritage,inspections,metrics}=await getConservationOverview();
  const total=Math.max(1,heritage.length);
  return <AppShell active="/conservacao"><main className="pageWrap approvedConservation">
    <div className="pageHead"><div><h1>Conservação</h1><p>Acompanhamento preventivo dos bens culturais.</p></div><Link href="/conservacao/nova" className="primaryAction">+ Nova inspeção</Link></div>

    <section className="conservationMetrics">
      <article className="regular"><i/><strong>{metrics.regular}</strong><span>Regular</span><small>{Math.round(metrics.regular/total*100)}% do total</small></article>
      <article className="warning"><i/><strong>{metrics.atencao}</strong><span>Atenção</span><small>{Math.round(metrics.atencao/total*100)}% do total</small></article>
      <article className="risk"><i/><strong>{metrics.risco}</strong><span>Risco</span><small>{Math.round(metrics.risco/total*100)}% do total</small></article>
      <article className="danger"><i/><strong>{metrics.critico}</strong><span>Crítico</span><small>{Math.round(metrics.critico/total*100)}% do total</small></article>
    </section>

    <div className="controlGrid approvedConservationGrid">
      <section className="panel">
        <div className="sectionTitle"><h2>Bens culturais ({heritage.length})</h2><Link href="/patrimonio">Ver todos →</Link></div>
        <div className="inlineFilters"><span>Buscar por nome, município ou tipologia...</span><button>Todos os estados</button><button>Todas as tipologias</button></div>
        {heritage.length ? heritage.map((h:any)=><div className="conservationAsset" key={h.id}>
          {h.image?<img src={h.image} alt=""/>:<div className="tableThumb"/>}
          <div><strong>{h.nome}</strong><span>{[h.municipio,h.uf].filter(Boolean).join(", ")}</span></div>
          <Status tone={tone(h.risco)}>{h.risco}</Status>
        </div>) : <div className="emptyState">Nenhum bem cultural cadastrado.</div>}
      </section>

      <aside className="sideColumnStack">
        <section className="panel panoramaCard">
          <div className="sectionTitle"><h2>Panorama da conservação</h2><span/></div>
          <div className="donut" style={{background:`conic-gradient(#007350 0 ${metrics.regular/total*100}%,#e5a923 0 ${(metrics.regular+metrics.atencao)/total*100}%,#f06a2a 0 ${(metrics.regular+metrics.atencao+metrics.risco)/total*100}%,#d92d20 0 100%)`}}><div><strong>{heritage.length}</strong><span>bens culturais</span></div></div>
        </section>
        <section className="panel">
          <div className="sectionTitle"><h2>Próximas inspeções</h2><Link href="/fiscalizacoes">Ver agenda completa →</Link></div>
          {inspections.filter((i:any)=>i.proxima_inspecao).slice(0,6).map((i:any)=><div className="inspectionRow" key={i.id}>
            <b>{new Date(i.proxima_inspecao+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}).toUpperCase()}</b>
            <div><strong>{i.categoria}</strong><span>{i.bens_culturais?.nome||"Bem cultural"}</span></div>
            <Status tone={tone(i.estado)}>{i.estado}</Status>
          </div>)}
        </section>
      </aside>
    </div>
  </main></AppShell>
}
