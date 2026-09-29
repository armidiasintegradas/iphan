import PreviewShell from "@/components/PreviewShell";
import Link from "next/link";
import {AlertCircle,CalendarClock,ClipboardCheck,SearchCheck} from "lucide-react";

const priorities=[
  ["Decisão pendente","Igreja Matriz de Olinda · aprovação de material","Vence hoje","danger",AlertCircle,"priority-decisao.webp"],
  ["Intervenção com desvio","Forte das Cinco Pontas · avanço abaixo do planejado","-8 p.p.","warning",CalendarClock,"priority-intervencao.webp"],
  ["Medição aguardando","Medição 04 · Igreja do Carmo","Aguardando análise","regular",ClipboardCheck,"priority-medicao.webp"],
  ["Fiscalização programada","Vistoria técnica · fachada principal","Hoje · 16:30","regular",SearchCheck,"priority-fiscalizacao.webp"],
];

export default function Page(){
  return <PreviewShell active="/preview/hoje">
    <main className="pageWrap approvedHome previewStaticPage">
      <div className="welcome">
        <div><h1>Boa tarde, Alex.</h1><p>O patrimônio de Pernambuco em movimento.</p></div>
        <div className="dateCard"><strong>29</strong><span>SET 2026</span><small>TERÇA-FEIRA</small></div>
      </div>

      <div className="sectionTitle priorityHeading"><h2>PRIORIDADES DO DIA</h2><span>Ver todas →</span></div>
      <section className="priorityGrid approvedPriorities">
        {priorities.map(([title,detail,when,tone,Icon,img]:any)=><article className="priorityCard approvedPriority" key={title}>
          <div className="priorityApprovedImage" style={{backgroundImage:`url("/visual/${img}")`}}/>
          <div className="priorityBody">
            <div className={"priorityIcon "+tone}><Icon size={14}/></div>
            <div><strong>{title}</strong><span>{detail}</span><b className={tone}>{when}</b></div>
          </div>
        </article>)}
      </section>

      <section className="metricsRow approvedMetrics">
        <article><strong>124</strong><span>bens acompanhados</span><small>↗ visão consolidada</small></article>
        <article><strong>18</strong><span>intervenções em execução</span><small className="dangerText">acompanhamento ativo</small></article>
        <article><strong>7</strong><span>decisões pendentes</span><small className="dangerText">requerem acompanhamento</small></article>
        <article><strong>11</strong><span>fiscalizações abertas</span><small>agenda operacional</small></article>
      </section>

      <section className="homeBottom approvedBottom">
        <div className="panel mapPanel previewMap">
          <div className="sectionTitle"><h2>Intervenções em Pernambuco</h2><span>Ver todas →</span></div>
          <div className="previewMapCanvas">
            <div className="previewMapShape">PE</div>
            <i style={{left:"29%",top:"42%"}}/><i style={{left:"47%",top:"56%"}}/><i style={{left:"62%",top:"35%"}}/><i style={{left:"72%",top:"67%"}}/>
          </div>
        </div>
        <aside className="panel agenda approvedAgenda">
          <div className="sectionTitle"><h2>Sua agenda</h2><span>Ver agenda completa →</span></div>
          {[["09:00","Reunião técnica","Igreja Matriz de Olinda"],["11:30","Análise de medição","Intervenção · Carmo"],["14:00","Decisão de projeto","Forte das Cinco Pontas"],["16:30","Fiscalização","Fachada principal"]].map(([time,title,detail],i)=><div className="agendaRow" key={time}>
            <b>{time}</b><i className={i===2?"danger":i===1?"warning":""}/><div><strong>{title}</strong><span>{detail}</span></div>
          </div>)}
        </aside>
      </section>

      <Link href="/preview" className="previewFloatingBack">← Índice</Link>
    </main>
  </PreviewShell>;
}
