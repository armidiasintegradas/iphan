import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getMeasurements} from "@/lib/operational-data";
import Link from "next/link";
import { Banknote, ClipboardCheck, Image, TimerReset } from "lucide-react";

const money=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const {data,source}=await getMeasurements(id);
 const total=data.reduce((s:any,m:any)=>s+m.valor,0);
 const awaiting=data.filter((m:any)=>m.status==="aguardando").length;
 const evidence=data.reduce((s:any,m:any)=>s+m.evidencias,0);
 return <AppShell active="/intervencoes"><main className="pageWrap detailPage approvedMeasurements">
  <div className="pageHead"><div><small>Intervenção / Medições</small><h1>Medições</h1><p>Conferência física, financeira e documental.</p></div><div className="headActions"><DemoBadge source={source}/><Link href={"/intervencoes/"+id+"/medicoes/nova"} className="primaryAction">+ Nova medição</Link></div></div>
  <div className="tabs approvedTabs"><Link href={"/intervencoes/"+id}>Visão geral</Link><Link href={"/intervencoes/"+id+"/cronograma"}>Cronograma</Link><b>Medições</b><Link href={"/intervencoes/"+id+"/evidencias"}>Evidências</Link></div>

  <section className="measurementMetrics">
    <article><Banknote/><strong>{money(total)}</strong><span>Total medido</span><small>acumulado da intervenção</small></article>
    <article><ClipboardCheck/><strong>{data.length}</strong><span>Medições registradas</span><small>histórico consolidado</small></article>
    <article><TimerReset/><strong>{awaiting}</strong><span>Aguardando conferência</span><small className={awaiting?"dangerText":""}>fluxo pendente</small></article>
    <article><Image/><strong>{evidence}</strong><span>Evidências vinculadas</span><small>suporte documental</small></article>
  </section>

  <section className="panel approvedMeasurementTable">
    <div className="measurementHead"><span>Nº</span><span>Referência</span><span>Valor</span><span>% físico</span><span>Evidências</span><span>Status</span></div>
    {data.map((m:any)=><article className="measurementRow" key={m.id}>
      <span className="measurementNumber">{String(m.numero).padStart(2,"0")}</span>
      <div><strong>{m.referencia}</strong><small>Medição vinculada à intervenção</small></div>
      <span>{money(m.valor)}</span>
      <div className="measurementPhysical"><i><b style={{width:Math.max(0,Math.min(100,m.percentual))+"%"}}/></i><em>{m.percentual}%</em></div>
      <span>{m.evidencias}</span>
      <span className={"status "+(m.status==="concluido"?"regular":m.status==="aguardando"?"warning":"neutral")}><i/>{m.status}</span>
    </article>)}
    {!data.length&&<div className="emptyState">Nenhuma medição registrada.</div>}
  </section>
 </main></AppShell>
}