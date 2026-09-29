import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import { getEvidence } from "@/lib/operational-data";
import Link from "next/link";
import { Images, SlidersHorizontal } from "lucide-react";

const groups=["antes","durante","depois"];

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const {data,source}=await getEvidence(id);
  return <AppShell active="/intervencoes"><main className="pageWrap detailPage approvedEvidence">
    <div className="pageHead">
      <div><small>Intervenção / Evidências</small><h1>Galeria técnica</h1><p>Registro documental Antes · Durante · Depois.</p></div>
      <div className="headActions"><DemoBadge source={source}/><Link href="/campo/evidencia" className="primaryAction">+ Nova evidência</Link></div>
    </div>
    <div className="tabs approvedTabs"><Link href={"/intervencoes/"+id}>Visão geral</Link><Link href={"/intervencoes/"+id+"/cronograma"}>Cronograma</Link><Link href={"/intervencoes/"+id+"/medicoes"}>Medições</Link><b>Evidências</b></div>

    <div className="evidenceToolbar"><div><button className="active">Todas</button><button>Antes</button><button>Durante</button><button>Depois</button></div><button><SlidersHorizontal size={15}/> Filtros</button></div>

    <div className="approvedEvidenceGrid">{data.map((e:any,index:number)=><article className="approvedEvidenceCard" key={e.id}>
      <div className="evidenceVisual" style={{backgroundImage:`url("${e.url}"),url("/visual/field-thumb-${String((index%3)+1).padStart(2,"0")}.webp")`}}>
        <span>{e.etapa}</span>
      </div>
      <div><strong>{e.ambiente||"Ambiente"}</strong><span>{e.elemento||"Elemento não informado"}</span><p>{e.legenda}</p><small>{e.captured_at ? new Date(e.captured_at).toLocaleString("pt-BR") : ""}</small></div>
    </article>)}</div>
    {!data.length&&<div className="emptyState panel">Nenhuma evidência registrada.</div>}

    <section className="comparePanel panel approvedComparePanel">
      <div className="sectionTitle"><h2><Images size={18}/> Comparação técnica</h2><span>Mesmo elemento em diferentes etapas</span></div>
      <div className="compareGrid">{groups.map((stage,index)=>{const e=data.find((x:any)=>x.etapa===stage);return <div key={stage}><b>{stage.toUpperCase()}</b>{e?<div className="compareVisual" style={{backgroundImage:`url("${e.url}"),url("/visual/field-thumb-${String((index%3)+1).padStart(2,"0")}.webp")`}}/>:<div className="emptyEvidence">Sem registro</div>}</div>})}</div>
    </section>
  </main></AppShell>
}