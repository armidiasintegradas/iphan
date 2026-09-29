import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getControlData} from "@/lib/control-data";
import Link from "next/link";

const tone=(r:string)=>r==="critico"?"danger":r==="atencao"?"warning":"regular";

export default async function Page(){
  const {decisions,restrictions,source}=await getControlData();
  return <AppShell active="/controle"><main className="pageWrap">
    <div className="pageHead"><div><h1>Controle</h1><p>Decisões, restrições, responsáveis e prazos em um único fluxo.</p></div><div className="headActions"><DemoBadge source={source}/><Link href="/controle/decisao/nova" className="primaryAction">+ Decisão</Link><Link href="/controle/restricao/nova" className="secondaryAction">+ Restrição</Link></div></div>
    <div className="controlSummary"><div><strong>{decisions.length}</strong><span>decisões abertas</span></div><div><strong>{restrictions.length}</strong><span>restrições abertas</span></div><div><strong>{decisions.filter(x=>x.risco==="critico").length+restrictions.filter(x=>x.risco==="critico").length}</strong><span>itens críticos</span></div></div>
    <div className="twoCols">
      <section className="panel"><div className="sectionTitle"><h2>Decisões</h2></div>{decisions.map(d=><article className="controlItem" key={d.id}><div><span className={"status "+tone(d.risco)}><i/>{d.id}</span><h3>{d.titulo}</h3><p>{d.intervencao}</p></div><dl><div><dt>Responsável</dt><dd>{d.responsavel}</dd></div><div><dt>Prazo</dt><dd>{d.prazo?new Date(d.prazo).toLocaleDateString("pt-BR"):"—"}</dd></div></dl></article>)}</section>
      <section className="panel"><div className="sectionTitle"><h2>Restrições</h2></div>{restrictions.map(r=><article className="controlItem" key={r.id}><div><span className={"status "+tone(r.risco)}><i/>{r.id}</span><h3>{r.titulo}</h3><p>{r.intervencao}</p><small>{r.impacto}</small></div><dl><div><dt>Responsável</dt><dd>{r.responsavel}</dd></div><div><dt>Prazo</dt><dd>{r.prazo?new Date(r.prazo).toLocaleDateString("pt-BR"):"—"}</dd></div></dl></article>)}</section>
    </div>
  </main></AppShell>
}
