import AppShell from "@/components/AppShell";
import {Metric,Status} from "@/components/UI";
import {getInterventionById} from "@/lib/data";
import {notFound} from "next/navigation";
import Link from "next/link";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

function label(status:string){
  const map:Record<string,string>={
    rascunho:"Rascunho",
    aberto:"Aberta",
    em_andamento:"Em execução",
    aguardando:"Aguardando",
    concluido:"Concluída",
    cancelado:"Cancelada",
  };
  return map[status]||status;
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const item=await getInterventionById(id);
  if(!item) notFound();

  const deviation=item.actual-item.planned;
  const finance=item.latestMeasurement?.valor ? Number(item.latestMeasurement.valor) : 0;

  return <AppShell active="/intervencoes"><main className="pageWrap detailPage">
    <div className="pageHead">
      <div>
        <Link href="/intervencoes">← Voltar para intervenções</Link>
        <h1>{item.title}</h1>
        <p>⌖ {item.heritage?.nome || "Bem cultural"}{item.heritage?.municipio ? " · "+item.heritage.municipio+", "+(item.heritage.uf||"PE") : ""}</p>
      </div>
      <Status tone={tone(item.risk)}>{label(item.status)}</Status>
    </div>

    <div className="tabs">
      <b>Visão geral</b>
      <Link href={"/intervencoes/"+id+"/cronograma"}>Cronograma</Link>
      <Link href={"/intervencoes/"+id+"/medicoes"}>Medições</Link>
      <Link href={"/intervencoes/"+id+"/evidencias"}>Evidências</Link>
      <Link href="/fiscalizacoes">Fiscalizações</Link>
      <Link href="/documentos">Documentos</Link>
    </div>

    <div className="detailHero intervention neutralHero"/>

    <div className="metricsRow">
      <Metric value={item.actual+"%"} label="Executado"/>
      <Metric value={item.planned+"%"} label="Planejado"/>
      <Metric value={(deviation>0?"+":"")+deviation+" p.p."} label="Desvio físico" tone={deviation<0?"danger":undefined}/>
      <Metric value={item.end ? new Date(item.end+"T12:00:00").toLocaleDateString("pt-BR") : "—"} label="Fim previsto"/>
      <Metric value={finance ? new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(finance) : "—"} label="Última medição"/>
    </div>

    <div className="twoCols">
      <section className="panel">
        <div className="sectionTitle"><h2>Pendências e restrições</h2><Link href="/controle/restricao/nova">+ Restrição</Link></div>
        {item.restrictions.length ? item.restrictions.map((r:any)=><div className="taskRow" key={r.id}><i className={tone(r.risk)}>!</i><div><strong>{r.titulo}</strong><span>{r.impacto || label(r.status)}{r.prazo ? " · prazo "+new Date(r.prazo).toLocaleDateString("pt-BR") : ""}</span></div></div>) : <div className="emptyState">Nenhuma restrição aberta.</div>}
      </section>

      <section className="panel">
        <div className="sectionTitle"><h2>Decisões pendentes</h2><Link href="/controle/decisao/nova">+ Decisão</Link></div>
        {item.decisions.length ? item.decisions.map((d:any)=><div className="updateRow" key={d.id}><strong>{d.titulo}</strong><span>{label(d.status)}{d.prazo ? " · prazo "+new Date(d.prazo).toLocaleDateString("pt-BR") : ""}</span></div>) : <div className="emptyState">Nenhuma decisão pendente.</div>}
      </section>
    </div>
  </main></AppShell>
}