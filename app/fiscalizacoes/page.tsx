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

export default async function Page(){
  const [{rows,metrics},current]=await Promise.all([getFiscalizationsOverview(),getCurrentUser()]);
  const canComplete=can(current.role,"inspection.write");
  return <AppShell active="/fiscalizacoes"><main className="pageWrap approvedFiscal">
    <div className="pageHead"><div><h1>Fiscalizações e Controle</h1><p>Acompanhe vistorias, pendências, decisões e restrições do patrimônio cultural.</p></div><Link href="/fiscalizacoes/nova" className="primaryAction">+ Nova fiscalização</Link></div>
    <div className="tabs approvedTabs"><b>Fiscalizações</b><Link href="/controle">Pendências</Link><Link href="/controle">Decisões</Link><Link href="/controle">Restrições</Link></div>

    <section className="controlMetricRow">
      <article><CalendarDays/><strong>{metrics.abertas}</strong><span>Vistorias previstas</span><small>acompanhamento ativo</small></article>
      <article><Clock3/><strong>{metrics.vencidas}</strong><span>Pendências vencidas</span><small className="dangerText">requerem atenção</small></article>
      <article><Gavel/><strong>{metrics.planejadas}</strong><span>Decisões abertas</span><small>fluxo em análise</small></article>
      <article><AlertTriangle/><strong>{metrics.realizadas}</strong><span>Restrições críticas</span><small className="dangerText">ação imediata</small></article>
    </section>

    <div className="controlGrid approvedControlGrid">
      <section className="panel tablePanel">
        <div className="tableToolbar"><h2>Fiscalizações em andamento</h2><div><span>Buscar por bem, município, responsável...</span><button><Download size={15}/> Exportar</button></div></div>
        {rows.length ? <div className="dataTable approvedDataTable">
          <div className="tr head fiscalWithActions"><span>ID</span><span>Bem</span><span>Responsável</span><span>Prazo</span><span>Status</span><span>Ações</span></div>
          {rows.map((r:any)=><div className="tr" key={r.id}>
            <span>{String(r.id).slice(0,12)}</span>
            <span className="withThumb"><div className="tableThumb"/><b>{r.titulo}</b></span>
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
        <section className="panel calendarMock"><h2>Agenda do mês</h2><div className="calendarGrid">{Array.from({length:31},(_,i)=><span className={[7,16,22].includes(i)?"marked":""} key={i}>{i+1}</span>)}</div></section>
      </aside>
    </div>
  </main></AppShell>
}
