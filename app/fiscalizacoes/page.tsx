import AppShell from "@/components/AppShell";
import {Metric,Status} from "@/components/UI";
import {getFiscalizationsOverview} from "@/lib/overview-data";
import Link from "next/link";

function tone(status:string){
  if(status==="cancelado") return "danger";
  if(status==="aguardando") return "warning";
  if(status==="concluido") return "regular";
  return "info";
}

function label(status:string){
  const map:Record<string,string>={
    aberto:"Aberta",
    em_andamento:"Em execução",
    aguardando:"Aguardando",
    concluido:"Concluída",
    cancelado:"Cancelada",
    rascunho:"Rascunho",
  };
  return map[status]||status;
}

export default async function Page(){
  const {rows,metrics}=await getFiscalizationsOverview();

  return <AppShell active="/fiscalizacoes"><main className="pageWrap">
    <div className="pageHead">
      <div><h1>Fiscalizações</h1><p>Acompanhe vistorias, checklists e providências do patrimônio cultural.</p></div>
      <Link href="/fiscalizacoes/nova" className="primaryAction">+ Nova fiscalização</Link>
    </div>

    <div className="tabs">
      <b>Fiscalizações</b>
      <Link href="/controle">Pendências e decisões</Link>
      <Link href="/controle">Restrições</Link>
    </div>

    <div className="metricsRow">
      <Metric value={String(metrics.abertas)} label="Em acompanhamento"/>
      <Metric value={String(metrics.planejadas)} label="Planejadas"/>
      <Metric value={String(metrics.realizadas)} label="Realizadas"/>
      <Metric value={String(metrics.vencidas)} label="Atrasadas" tone={metrics.vencidas?"danger":undefined}/>
    </div>

    <div className="controlGrid">
      <section className="panel tablePanel">
        <h2>Fiscalizações</h2>
        {rows.length ? <div className="dataTable">
          <div className="tr head"><span>Título</span><span>Tipo</span><span>Data</span><span>Status</span><span>Observações</span></div>
          {rows.map((r:any)=><div className="tr" key={r.id}>
            <span>{r.titulo}</span>
            <span>{r.tipo||"—"}</span>
            <span>{r.agendada_para?new Date(r.agendada_para).toLocaleString("pt-BR"):"—"}</span>
            <span><Status tone={tone(r.status)}>{label(r.status)}</Status></span>
            <span>{r.observacoes||"—"}</span>
          </div>)}
        </div> : <div className="emptyState">Nenhuma fiscalização cadastrada.</div>}
      </section>

      <aside className="panel sideSchedule">
        <h2>Próximas vistorias</h2>
        {rows.filter((r:any)=>r.agendada_para&&!r.realizada_em).slice(0,5).map((r:any)=><div className="scheduleRow" key={r.id}>
          <b>{new Date(r.agendada_para).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}</b>
          <div><strong>{r.titulo}</strong><span>{r.tipo||"Fiscalização"}</span></div>
        </div>)}
        {!rows.some((r:any)=>r.agendada_para&&!r.realizada_em)&&<div className="emptyState">Sem vistorias programadas.</div>}
      </aside>
    </div>
  </main></AppShell>
}