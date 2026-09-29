import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getInterventionById} from "@/lib/data";
import {notFound} from "next/navigation";
import Link from "next/link";
import { CalendarDays, Database, AlertTriangle, FileText, MapPin, MoreHorizontal } from "lucide-react";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}
function label(status:string){
  const map:Record<string,string>={rascunho:"Rascunho",aberto:"Aberta",em_andamento:"Em execução",aguardando:"Aguardando",concluido:"Concluída",cancelado:"Cancelada"};
  return map[status]||status;
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const item=await getInterventionById(id);
  if(!item) notFound();

  const deviation=item.actual-item.planned;
  const finance=item.latestMeasurement?.valor ? Number(item.latestMeasurement.valor) : 0;
  const hero='/visual/intervention-progress.webp';
  const heroFallback='https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85';

  return <AppShell active="/intervencoes"><main className="pageWrap detailPage approvedIntervention">
    <div className="pageHead interventionHead">
      <div>
        <Link href="/intervencoes">← Voltar para intervenções</Link>
        <h1>{item.title}</h1>
        <p>⌖ {item.heritage?.nome || "Bem cultural"}{item.heritage?.municipio ? " · "+item.heritage.municipio+", "+(item.heritage.uf||"PE") : ""}</p>
      </div>
      <div className="headActions"><Status tone={tone(item.risk)}>{label(item.status)}</Status><button className="iconButton"><MoreHorizontal size={17}/></button><button className="secondaryAction"><MapPin size={15}/> Ver no mapa</button></div>
    </div>

    <div className="tabs approvedTabs">
      <b>Visão geral</b>
      <Link href={"/intervencoes/"+id+"/cronograma"}>Cronograma</Link>
      <Link href={"/intervencoes/"+id+"/medicoes"}>Medições</Link>
      <Link href="/controle">Ocorrências</Link>
      <Link href="/documentos">Documentos</Link>
    </div>

    <div className="detailHero intervention approvedInterventionHero" style={{backgroundImage:`url("${hero}"),url("${heroFallback}")`}}/>

    <section className="interventionMetrics">
      <div className="progressMetric"><strong>{item.actual}%</strong><span>Executado</span><i><b style={{width:Math.max(0,Math.min(100,item.actual))+"%"}}/></i></div>
      <div className="progressMetric planned"><strong>{item.planned}%</strong><span>Planejado</span><i><b style={{width:Math.max(0,Math.min(100,item.planned))+"%"}}/></i></div>
      <div className="progressMetric deviation"><strong>{deviation>0?"+":""}{deviation} p.p.</strong><span>Desvio físico</span><i><b style={{width:Math.min(100,Math.abs(deviation)*8)+"%"}}/></i></div>
      <div className="factMetric"><CalendarDays/><span>Prazo</span><strong>{item.end ? new Date(item.end+"T12:00:00").toLocaleDateString("pt-BR") : "—"}</strong></div>
      <div className="factMetric"><Database/><span>Financeiro</span><strong>{finance ? new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:1}).format(finance) : "—"}</strong></div>
      <div className="factMetric critical"><AlertTriangle/><span>Pendências</span><strong>{item.restrictions.length} itens</strong></div>
      <div className="factMetric"><FileText/><span>Decisões</span><strong>{item.decisions.length} pendentes</strong></div>
    </section>

    <div className="interventionLower">
      <section className="panel photoPanel">
        <div className="sectionTitle"><h2>Progresso da intervenção</h2><Link href={"/intervencoes/"+id+"/cronograma"}>Ver mais →</Link></div>
        <div className="approvedProgressImage" style={{backgroundImage:`url("${hero}"),url("${heroFallback}")`}} aria-hidden="true"/>
      </section>

      <section className="panel">
        <div className="sectionTitle"><h2>Principais pendências</h2><Link href="/controle">Ver todas →</Link></div>
        {item.restrictions.length ? item.restrictions.slice(0,4).map((r:any)=><div className="taskRow" key={r.id}><i className={tone(r.risk)}>!</i><div><strong>{r.titulo}</strong><span>{r.impacto || label(r.status)}{r.prazo ? " · prazo "+new Date(r.prazo).toLocaleDateString("pt-BR") : ""}</span></div></div>) : <div className="emptyState">Nenhuma restrição aberta.</div>}
      </section>

      <section className="panel">
        <div className="sectionTitle"><h2>Últimas atualizações</h2><Link href="/documentos">Ver todas →</Link></div>
        {item.decisions.length ? item.decisions.slice(0,4).map((d:any)=><div className="updateRow" key={d.id}><strong>{d.titulo}</strong><span>{label(d.status)}{d.prazo ? " · prazo "+new Date(d.prazo).toLocaleDateString("pt-BR") : ""}</span></div>) : <div className="emptyState">Nenhuma atualização recente.</div>}
      </section>
    </div>
  </main></AppShell>
}
