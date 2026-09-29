import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getHeritageById} from "@/lib/data";
import {notFound} from "next/navigation";
import Link from "next/link";
import { MapPin, Share2, Bookmark, MoreHorizontal, Pencil } from "lucide-react";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const h=await getHeritageById(id);
  if(!h) notFound();

  return <AppShell active="/patrimonio"><main className="pageWrap detailPage approvedHeritageDetail">
    <div className="detailHero approvedDetailHero" style={{backgroundImage:`url("/visual/heritage-hero.webp")`}}>
      <div className="heroActions">
        <button><MapPin size={16}/> Ver no mapa</button>
        <button aria-label="Compartilhar"><Share2 size={16}/></button>
        <button aria-label="Salvar"><Bookmark size={16}/></button>
        <button aria-label="Mais opções"><MoreHorizontal size={16}/></button>
      </div>
      <span className="photoCount">1 / 12</span>
    </div>

    <div className="detailTitle approvedDetailTitle">
      <div>
        <h1>{h.name}</h1>
        <p>⌖ {h.city || "Localização não informada"} &nbsp; · &nbsp; {h.protection}</p>
      </div>
      <Status tone={tone(h.risk)}>{h.risk}</Status>
    </div>

    <div className="tabs approvedTabs">
      <b>Visão geral</b>
      <span>Histórico</span>
      <span>Elementos</span>
      <span>Intervenções</span>
      <span>Fiscalizações</span>
      <span>Documentos</span>
      <span>Conservação</span>
      <button><Pencil size={15}/> Editar bem</button>
    </div>

    <div className="threeCols approvedThreeCols">
      <section className="panel editorialPanel">
        <h2>Sobre o bem</h2>
        <p>{h.description || "Descrição histórica e técnica ainda não cadastrada."}</p>
        <p>O prontuário reúne intervenções, fiscalizações, documentos e registros de conservação vinculados ao bem.</p>
        <Link href="/intervencoes/nova">Ver mais informações →</Link>
      </section>

      <section className="panel infoTable approvedInfoTable">
        <h2>Informações principais</h2>
        <p><span>Tipologia</span><b>{h.type}</b></p>
        <p><span>Nível de proteção</span><b>{h.protection}</b></p>
        <p><span>Intervenções</span><b>{h.interventions.length}</b></p>
        <p><span>Documentos recentes</span><b>{h.documents.length}</b></p>
      </section>

      <section className="panel conservationPanel">
        <h2>Estado de conservação</h2>
        {h.inspections.length ? h.inspections.map((item:any)=><div className="stateRow" key={item.id}><span>{item.categoria}</span><Status tone={tone(item.estado)}>{item.estado}</Status></div>) : <div className="emptyState">Nenhuma inspeção de conservação registrada.</div>}
      </section>
    </div>
  </main></AppShell>
}
