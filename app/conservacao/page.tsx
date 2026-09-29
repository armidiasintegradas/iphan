import AppShell from "@/components/AppShell";
import {Metric,Status} from "@/components/UI";
import {getConservationOverview} from "@/lib/overview-data";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

export default async function Page(){
  const {heritage,inspections,metrics}=await getConservationOverview();

  return <AppShell active="/conservacao"><main className="pageWrap">
    <div className="pageHead"><div><h1>Conservação</h1><p>Acompanhamento preventivo dos bens culturais.</p></div></div>

    <div className="metricsRow">
      <Metric value={String(metrics.regular)} label="Regular"/>
      <Metric value={String(metrics.atencao)} label="Atenção" tone={metrics.atencao?"warning":undefined}/>
      <Metric value={String(metrics.risco)} label="Risco" tone={metrics.risco?"danger":undefined}/>
      <Metric value={String(metrics.critico)} label="Crítico" tone={metrics.critico?"danger":undefined}/>
    </div>

    <div className="controlGrid">
      <section className="panel">
        <h2>Bens culturais ({heritage.length})</h2>
        {heritage.length ? heritage.map((h:any)=><div className="conservationRow" key={h.id}>
          <div><strong>{h.nome}</strong><span>{[h.municipio,h.uf].filter(Boolean).join(", ")}</span></div>
          <Status tone={tone(h.risco)}>{h.risco}</Status>
        </div>) : <div className="emptyState">Nenhum bem cultural cadastrado.</div>}
      </section>

      <aside className="panel">
        <h2>Próximas inspeções</h2>
        {inspections.filter((i:any)=>i.proxima_inspecao).slice(0,8).map((i:any)=><div className="inspectionRow" key={i.id}>
          <b>{new Date(i.proxima_inspecao+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}).toUpperCase()}</b>
          <div>
            <strong>{i.categoria}</strong>
            <span>{i.bens_culturais?.nome||"Bem cultural"}</span>
          </div>
          <Status tone={tone(i.estado)}>{i.estado}</Status>
        </div>)}
        {!inspections.some((i:any)=>i.proxima_inspecao)&&<div className="emptyState">Nenhuma inspeção futura agendada.</div>}
      </aside>
    </div>
  </main></AppShell>
}