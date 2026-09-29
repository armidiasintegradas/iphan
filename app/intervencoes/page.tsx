import AppShell from "@/components/AppShell";
import Link from "next/link";
import {Status} from "@/components/UI";
import {getInterventionsPortfolio} from "@/lib/data";
import { ArrowUpRight, CalendarDays, AlertTriangle, CheckCircle2, Wrench } from "lucide-react";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}
function label(status:string){
  const map:Record<string,string>={rascunho:"Rascunho",aberto:"Aberta",em_andamento:"Em execução",aguardando:"Aguardando",concluido:"Concluída",cancelado:"Cancelada"};
  return map[status]||status;
}

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  const result=await getInterventionsPortfolio();
  const allRows=result.data;
  const status=q.status||"todas";
  const rows=status==="todas" ? allRows : allRows.filter((x:any)=>x.status===status);
  const running=allRows.filter((x:any)=>x.status==="em_andamento").length;
  const delayed=allRows.filter((x:any)=>x.actual<x.planned).length;
  const risks=allRows.filter((x:any)=>x.risk==="risco"||x.risk==="critico").length;
  const completed=allRows.filter((x:any)=>x.status==="concluido").length;

  return <AppShell active="/intervencoes"><main className="pageWrap approvedInterventions">
    <div className="pageHead">
      <div><h1>Intervenções</h1><p>Acompanhamento integrado das obras e ações de preservação.</p></div>
      <Link href="/intervencoes/nova" className="primaryAction">+ Nova intervenção</Link>
    </div>

    <section className="portfolioMetrics">
      <article><Wrench/><strong>{running}</strong><span>Em execução</span><small>portfólio ativo</small></article>
      <article><AlertTriangle/><strong>{delayed}</strong><span>Com desvio físico</span><small className={delayed?"dangerText":""}>planejado × executado</small></article>
      <article><AlertTriangle/><strong>{risks}</strong><span>Situações de risco</span><small className={risks?"dangerText":""}>requerem atenção</small></article>
      <article><CheckCircle2/><strong>{completed}</strong><span>Concluídas</span><small>histórico consolidado</small></article>
    </section>

    <div className="interventionToolbar">
      <div>
        <Link className={status==="todas"?"active":""} href="/intervencoes">Todas</Link>
        <Link className={status==="em_andamento"?"active":""} href="/intervencoes?status=em_andamento">Em execução</Link>
        <Link className={status==="aguardando"?"active":""} href="/intervencoes?status=aguardando">Aguardando</Link>
        <Link className={status==="concluido"?"active":""} href="/intervencoes?status=concluido">Concluídas</Link>
      </div>
      <span>{rows.length} intervenções</span>
    </div>

    {rows.length ? <div className="approvedInterventionGrid">{rows.map((item:any,index:number)=>{
      const deviation=item.actual-item.planned;
      return <Link href={"/intervencoes/"+item.id} className="approvedInterventionCard" key={item.id}>
        <div className="interventionCardVisual" style={{backgroundImage:`url("/visual/intervention-progress.webp"),linear-gradient(135deg,#dfe6e2,#f5f1e8)`}}>
          <Status tone={tone(item.risk)}>{label(item.status)}</Status>
        </div>
        <div className="interventionCardBody">
          <p>{item.heritageName}{item.city?" · "+item.city:""}</p>
          <h2>{item.title}</h2>
          <div className="cardProgressLabels"><span>Executado <b>{item.actual}%</b></span><span>Planejado <b>{item.planned}%</b></span></div>
          <div className="dualProgress"><i><b style={{width:Math.max(0,Math.min(100,item.actual))+"%"}}/></i><i className="planned"><b style={{width:Math.max(0,Math.min(100,item.planned))+"%"}}/></i></div>
          <footer><span className={deviation<0?"negative":""}>{deviation>0?"+":""}{deviation} p.p. de desvio</span><ArrowUpRight size={16}/></footer>
        </div>
      </Link>
    })}</div> : <div className="emptyState panel">Nenhuma intervenção cadastrada. Crie uma intervenção após cadastrar o primeiro bem cultural.</div>}
  </main></AppShell>
}
