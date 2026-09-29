import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getSchedule} from "@/lib/operational-data";
import Link from "next/link";

export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const {data,source}=await getSchedule(id);
 return <AppShell active="/intervencoes"><main className="pageWrap detailPage">
  <div className="pageHead"><div><small>Intervenção / Cronograma</small><h1>Cronograma</h1><p>Planejado × executado por frente de serviço</p></div><div className="headActions"><DemoBadge source={source}/><Link href={"/intervencoes/"+id+"/cronograma/novo"} className="primaryAction">+ Novo item</Link></div></div>
  <div className="tabs"><Link href={"/intervencoes/"+id}>Visão geral</Link><b>Cronograma</b><Link href={"/intervencoes/"+id+"/medicoes"}>Medições</Link><Link href={"/intervencoes/"+id+"/evidencias"}>Evidências</Link></div>
  <section className="panel schedulePanel">{data.map(item=><div className="scheduleItem" key={item.id}><div><strong>{item.titulo}</strong><span>{item.inicio} → {item.fim}</span></div><div className="scheduleBars"><label><span>Planejado</span><i><b style={{width:item.previsto+"%"}}/></i><em>{item.previsto}%</em></label><label><span>Executado</span><i><b className={item.status} style={{width:item.executado+"%"}}/></i><em>{item.executado}%</em></label></div><span className={"status "+(item.status==="risco"?"danger":item.status==="atencao"?"warning":"regular")}><i/>{item.status}</span></div>)}</section>
 </main></AppShell>
}
