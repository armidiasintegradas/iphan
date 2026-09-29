import AppShell from "@/components/AppShell";
import {Metric,Status} from "@/components/UI";
import {heritage,priorities} from "@/lib/mock";
import Link from "next/link";

export default function Page(){
  return <AppShell active="/">
    <main className="pageWrap">
      <div className="welcome">
        <div><h1>Boa tarde, Alex.</h1><p>O patrimônio de Pernambuco em movimento.</p></div>
        <div className="dateCard"><strong>28</strong><span>SET 2026</span><small>SEGUNDA-FEIRA</small></div>
      </div>

      <div className="sectionTitle"><h2>Prioridades do dia</h2><Link href="/fiscalizacoes">Ver todas →</Link></div>
      <section className="priorityGrid">
        {priorities.map(p=><article className="priorityCard" key={p.title}><img src={p.image}/><div><Status tone={p.tone}>{p.title}</Status><span>{p.meta}</span><b className={p.tone}>{p.note}</b></div></article>)}
      </section>

      <section className="metricsRow">
        <Metric value="42" label="bens acompanhados" detail="+12% vs. mês anterior"/>
        <Metric value="18" label="intervenções em execução" detail="3 com desvio físico" tone="danger"/>
        <Metric value="7" label="decisões pendentes" detail="4 vencidas" tone="warning"/>
        <Metric value="3" label="fiscalizações no prazo" detail="1 crítica | 2 em atenção" tone="danger"/>
      </section>

      <section className="homeBottom">
        <div className="panel">
          <div className="sectionTitle"><h2>Intervenções em Pernambuco</h2><Link href="/patrimonio">Ver mapa completo →</Link></div>
          <div className="mapHero compact"><div className="mapPins">{[1,2,3,4,5,6,7].map((n,i)=><i key={n} style={{left:`${14+i*11}%`,top:`${24+(i%3)*20}%`}} className={i===1||i===5?"warning":i===3?"danger":""}>{n}</i>)}</div></div>
        </div>
        <aside className="panel agenda">
          <div className="sectionTitle"><h2>Sua agenda</h2><a>Ver agenda completa →</a></div>
          {[
            ["09:00","Fiscalização — Igreja Matriz","Olinda, PE"],
            ["14:00","Reunião de obra","São Bento, Olinda"],
            ["18:07","Vencimento de decisão","IPHE-PE-2024-017"]
          ].map(([t,a,b],i)=><div className="agendaRow" key={t}><b>{t}</b><i className={i===2?"danger":""}/><div><strong>{a}</strong><span>{b}</span></div></div>)}
        </aside>
      </section>
    </main>
  </AppShell>
}
