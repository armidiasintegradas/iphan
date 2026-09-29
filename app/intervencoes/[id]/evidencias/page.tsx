import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import { getEvidence } from "@/lib/operational-data";
import Link from "next/link";

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const {data,source}=await getEvidence(id);
  const groups=["antes","durante","depois"];
  return <AppShell active="/intervencoes"><main className="pageWrap detailPage">
    <div className="pageHead"><div><small>Intervenção / Evidências</small><h1>Galeria técnica</h1><p>Registro documental Antes · Durante · Depois</p></div><div><DemoBadge source={source}/></div></div>
    <div className="tabs"><Link href={"/intervencoes/"+id}>Visão geral</Link><Link href={"/intervencoes/"+id+"/cronograma"}>Cronograma</Link><Link href={"/intervencoes/"+id+"/medicoes"}>Medições</Link><b>Evidências</b></div>
    <div className="evidenceColumns">{groups.map(stage=><section key={stage}><div className="evidenceStage"><h2>{stage}</h2><span>{data.filter(e=>e.etapa===stage).length} registros</span></div>{data.filter(e=>e.etapa===stage).map(e=><article className="evidenceCard" key={e.id}><img src={e.url}/><div><strong>{e.ambiente}</strong><span>{e.elemento}</span><p>{e.legenda}</p><small>{e.captured_at ? new Date(e.captured_at).toLocaleString("pt-BR") : ""}</small></div></article>)}</section>)}</div>
    <section className="comparePanel panel"><div className="sectionTitle"><h2>Comparação técnica</h2><span>Mesmo elemento em diferentes etapas</span></div><div className="compareGrid">{groups.map(stage=>{const e=data.find(x=>x.etapa===stage);return <div key={stage}><b>{stage.toUpperCase()}</b>{e?<img src={e.url}/>:<div className="emptyEvidence">Sem registro</div>}</div>})}</div></section>
  </main></AppShell>
}
