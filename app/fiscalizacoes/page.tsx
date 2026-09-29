import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getFiscalizationsOverview} from "@/lib/overview-data";
import Link from "next/link";
import { CalendarDays, Clock3, Gavel, AlertTriangle, Download } from "lucide-react";
import {completeInspection} from "@/app/fiscalizacoes/actions";
import {getCurrentUser} from "@/lib/current-user";
import {can} from "@/lib/permissions";

function tone(status:string){
  if(status==="cancelado") return "danger";
  if(status==="aguardando") return "warning";
  if(status==="concluido") return "regular";
  return "info";
}
function label(status:string){
  const map:Record<string,string>={aberto:"Aberta",em_andamento:"Em execução",aguardando:"Pendente",concluido:"Concluída",cancelado:"Cancelada",rascunho:"Rascunho"};
  return map[status]||status;
}

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  const search=q.q||"";
  const [{rows,metrics},current]=await Promise.all([getFiscalizationsOverview({q:search}),getCurrentUser()]);
  const canComplete=can(current.role,"inspection.write");
  const now=new Date();
  const calendarLabel=now.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
  const markedDays=new Set(rows.filter((r:any)=>{
    if(!r.agendada_para) return false;
    const d=new Date(r.agendada_para);
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  }).map((r:any)=>new Date(r.agendada_para).getDate()));
  return <AppShell active="/fiscalizacoes"><main className="pageWrap approvedFiscal">
    <div className="pageHead"><div><h1>Fiscalizações e Controle</h1><p>Acompanhe vistorias, pendências, decisões e restrições do patrimônio cultural.</p></div><Link href="/fiscalizacoes/nova" className="primaryAction">+ Nova fiscalização</Link></div>
    <div className="tabs approvedTabs"><b>Fiscalizações</b><Link href="/controle">Pendências</Link><Link href="/controle">Decisões</Link><Link href="/controle">Restrições</Link></div>

    <section className="controlMetricRow">
      <article><CalendarDays/><strong>{metrics.abertas}</strong><span>Vistorias previstas</span><small>acompanhamento ativo</small></article>
      <article><Clock3/><strong>{metrics.vencidas}</strong><span>Vistorias vencidas</span><small className="dangerText">requerem atenção</small></article>
      <article><Gavel/><strong>{metrics.planejadas}</strong><span>Vistorias planejadas</span><small>agenda futura</small></article>
      <article><AlertTriangle/><strong>{metrics.realizadas}</strong><span>Vistorias realizadas</span><small>histórico concluído</small></article>
    </section>

    <div className="controlGrid approvedControlGrid">
      <section className="panel tablePanel">
        <div className="tableToolbar"><h2>Fiscalizações em andamento</h2><div>
          <form className="inlineTableSearch" method="get"><input name="q" defaultValue={search} placeholder="Buscar por bem, município, tipo..."/><button type="submit">Buscar</button></form>
          <a className="tableExportAction" href={"/api/fiscalizacoes/export"+(search?"?q="+encodeURIComponent(search):"")}><Download size={15}/> Exportar</a>
        </div></div>
        {rows.length ? <div className="dataTable approvedDataTable">
          <div className="tr head fiscalWithActions"><span>ID</span><span>Bem</span><span>Responsável</span><span>Prazo</span><span>Status</span><span>Ações</span></div>
          {rows.map((r:any)=><div className="tr" key={r.id}>
            <span>{String(r.id).slice(0,12)}</span>
            <span className="withThumb"><div className="tableThumb"/><b>{r.bemNome}<small>{r.titulo}{r.local?" · "+r.local:""}</small></b></span>
            <span>{r.tipo||"Fiscal técnico"}</span>
            <span>{r.agendada_para?new Date(r.agendada_para).toLocaleDateString("pt-BR"):"—"}</span>
            <span><Status tone={tone(r.status)}>{label(r.status)}</Status></span>
            <span>{canComplete&&r.status!=="concluido"&&r.status!=="cancelado" ? <form action={completeInspection}><input type="hidden" name="fiscalizacao_id" value={r.id}/><button className="rowAction success" type="submit">Concluir</button></form> : <span className="rowActionMuted">—</span>}</span>
          </div>)}
        </div> : <div className="emptyState">Nenhuma fiscalização cadastrada.</div>}
      </section>

      <aside className="sideColumnStack">
        <section className="panel sideSchedule">
          <div className="sectionTitle"><h2>Próximas vistorias</h2><Link href="/fiscalizacoes">Ver agenda completa →</Link></div>
          {rows.filter((r:any)=>r.agendada_para&&!r.realizada_em).slice(0,5).map((r:any)=><div className="inspectionRow" key={r.id}>
            <b>{new Date(r.agendada_para).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</b>
            <div><strong>{r.titulo}</strong><span>{r.tipo||"Fiscalização"}</span></div>
            <Status tone={tone(r.status)}>{label(r.status)}</Status>
          </div>)}
        </section>
        <section className="panel calendarMock"><h2>Agenda · {calendarLabel}</h2><div className="calendarGrid">{Array.from({length:new Date(now.getFullYear(),now.getMonth()+1,0).getDate()},(_,i)=><span className={markedDays.has(i+1)?"marked":""} key={i}>{i+1}</span>)}</div></section>
      </aside>
    </div>
  </main></AppShell>
}
