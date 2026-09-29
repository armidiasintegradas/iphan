import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getSchedule} from "@/lib/operational-data";
import Link from "next/link";
import { CalendarDays, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

function tone(status:string){
  if(status==="risco") return "danger";
  if(status==="atencao") return "warning";
  return "regular";
}

export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const {data,source}=await getSchedule(id);
 const avgPlanned=data.length?Math.round(data.reduce((s:any,x:any)=>s+x.previsto,0)/data.length):0;
 const avgActual=data.length?Math.round(data.reduce((s:any,x:any)=>s+x.executado,0)/data.length):0;
 const delayed=data.filter((x:any)=>x.executado<x.previsto).length;
 return <AppShell active="/intervencoes"><main className="pageWrap detailPage approvedSchedule">
  <div className="pageHead">
    <div><small>Intervenção / Cronograma</small><h1>Cronograma</h1><p>Planejado × executado por frente de serviço.</p></div>
    <div className="headActions"><DemoBadge source={source}/><Link href={"/intervencoes/"+id+"/cronograma/novo"} className="primaryAction">+ Novo item</Link></div>
  </div>
  <div className="tabs approvedTabs"><Link href={"/intervencoes/"+id}>Visão geral</Link><b>Cronograma</b><Link href={"/intervencoes/"+id+"/medicoes"}>Medições</Link><Link href={"/intervencoes/"+id+"/evidencias"}>Evidências</Link></div>

  <section className="scheduleMetrics">
    <article><CalendarDays/><strong>{data.length}</strong><span>frentes de serviço</span><small>cronograma ativo</small></article>
    <article><Clock3/><strong>{avgPlanned}%</strong><span>planejado médio</span><small>portfólio da intervenção</small></article>
    <article><CheckCircle2/><strong>{avgActual}%</strong><span>executado médio</span><small>progresso físico</small></article>
    <article><AlertTriangle/><strong>{delayed}</strong><span>frentes com desvio</span><small className={delayed?"dangerText":""}>requerem acompanhamento</small></article>
  </section>

  <section className="panel approvedSchedulePanel">
    <div className="scheduleTableHead"><span>Frente de serviço</span><span>Período</span><span>Planejado</span><span>Executado</span><span>Status</span></div>
    {data.map((item:any)=><article className="approvedScheduleRow" key={item.id}>
      <div><strong>{item.titulo}</strong><small>{item.inicio} → {item.fim}</small></div>
      <span>{item.inicio}<br/>{item.fim}</span>
      <div className="scheduleMini"><i><b style={{width:item.previsto+"%"}}/></i><em>{item.previsto}%</em></div>
      <div className="scheduleMini actual"><i><b className={item.status} style={{width:item.executado+"%"}}/></i><em>{item.executado}%</em></div>
      <span className={"status "+tone(item.status)}><i/>{item.status}</span>
    </article>)}
    {!data.length&&<div className="emptyState">Nenhum item de cronograma registrado.</div>}
  </section>
 </main></AppShell>
}