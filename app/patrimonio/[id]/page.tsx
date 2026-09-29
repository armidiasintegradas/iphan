import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getHeritageById} from "@/lib/data";
import {notFound} from "next/navigation";
import Link from "next/link";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const h=await getHeritageById(id);
  if(!h) notFound();

  return <AppShell active="/patrimonio"><main className="pageWrap detailPage">
    <div className="detailHero neutralHero"/>
    <div className="detailTitle">
      <div>
        <h1>{h.name}</h1>
        <p>⌖ {h.city || "Localização não informada"} &nbsp; · &nbsp; {h.protection}</p>
      </div>
      <Status tone={tone(h.risk)}>{h.risk}</Status>
    </div>

    <div className="tabs">
      <b>Visão geral</b>
      <span>Histórico</span>
      <span>Elementos</span>
      <span>Intervenções</span>
      <span>Fiscalizações</span>
      <span>Documentos</span>
      <span>Conservação</span>
    </div>

    <div className="threeCols">
      <section className="panel">
        <h2>Sobre o bem</h2>
        <p>{h.description || "Descrição histórica e técnica ainda não cadastrada."}</p>
        <p>O prontuário reúne intervenções, fiscalizações, documentos e registros de conservação vinculados ao bem.</p>
        <Link href="/intervencoes/nova">Criar intervenção →</Link>
      </section>

      <section className="panel infoTable">
        <h2>Informações principais</h2>
        <p><span>Tipologia</span><b>{h.type}</b></p>
        <p><span>Nível de proteção</span><b>{h.protection}</b></p>
        <p><span>Intervenções</span><b>{h.interventions.length}</b></p>
        <p><span>Documentos recentes</span><b>{h.documents.length}</b></p>
      </section>

      <section className="panel">
        <h2>Estado de conservação</h2>
        {h.inspections.length ? h.inspections.map((item:any)=><div className="stateRow" key={item.id}><span>{item.categoria}</span><Status tone={tone(item.estado)}>{item.estado}</Status></div>) : <div className="emptyState">Nenhuma inspeção de conservação registrada.</div>}
      </section>
    </div>

    <div className="sectionTitle"><h2>Intervenções vinculadas</h2></div>
    <section className="panel">
      {h.interventions.length ? h.interventions.map((item:any)=><Link href={"/intervencoes/"+item.id} className="updateRow" key={item.id}><strong>{item.titulo}</strong><span>{item.avanco_real}% executado · {item.status}</span></Link>) : <div className="emptyState">Nenhuma intervenção vinculada a este bem.</div>}
    </section>
  </main></AppShell>
}