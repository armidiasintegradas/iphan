import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getMeasurements} from "@/lib/operational-data";
import Link from "next/link";

const money=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);

export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const {data,source}=await getMeasurements(id);
 const total=data.reduce((s,m)=>s+m.valor,0);
 return <AppShell active="/intervencoes"><main className="pageWrap detailPage">
  <div className="pageHead"><div><small>Intervenção / Medições</small><h1>Medições</h1><p>Conferência física, financeira e documental.</p></div><div className="headActions"><DemoBadge source={source}/><button className="primaryAction">+ Nova medição</button></div></div>
  <div className="tabs"><Link href={"/intervencoes/"+id}>Visão geral</Link><Link href={"/intervencoes/"+id+"/cronograma"}>Cronograma</Link><b>Medições</b><Link href={"/intervencoes/"+id+"/evidencias"}>Evidências</Link></div>
  <div className="metricsRow"><div className="metricCard"><strong>{money(total)}</strong><span>Total medido</span></div><div className="metricCard"><strong>{data.length}</strong><span>Medições registradas</span></div><div className="metricCard"><strong>{data.filter(m=>m.status==="aguardando").length}</strong><span>Aguardando conferência</span></div><div className="metricCard"><strong>{data.reduce((s,m)=>s+m.evidencias,0)}</strong><span>Evidências vinculadas</span></div></div>
  <section className="panel"><div className="dataTable measurementTable"><div className="tr head"><span>Nº</span><span>Referência</span><span>Valor</span><span>% físico</span><span>Evidências</span><span>Status</span></div>{data.map(m=><div className="tr" key={m.id}><span>{String(m.numero).padStart(2,"0")}</span><span>{m.referencia}</span><span>{money(m.valor)}</span><span>{m.percentual}%</span><span>{m.evidencias}</span><span className={"status "+(m.status==="concluido"?"regular":m.status==="aguardando"?"warning":"neutral")}><i/>{m.status}</span></div>)}</div></section>
 </main></AppShell>
}
