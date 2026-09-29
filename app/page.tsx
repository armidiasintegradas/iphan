import AppShell from "@/components/AppShell";
import HeritageMap from "@/components/HeritageMap";
import {Metric,Status} from "@/components/UI";
import {getDashboardSummary,getHeritage} from "@/lib/data";
import {getNotifications} from "@/lib/control-data";
import {getCurrentUser} from "@/lib/current-user";
import Link from "next/link";

export default async function Page(){
  const [summary,heritageResult,notifications,current]=await Promise.all([
    getDashboardSummary(),
    getHeritage(),
    getNotifications(),
    getCurrentUser(),
  ]);

  const now=new Date();
  const dateParts=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Recife",day:"2-digit",month:"short",year:"numeric",weekday:"long"}).formatToParts(now);
  const day=dateParts.find(x=>x.type==="day")?.value||"";
  const month=(dateParts.find(x=>x.type==="month")?.value||"").replace(".","").toUpperCase();
  const year=dateParts.find(x=>x.type==="year")?.value||"";
  const weekday=(dateParts.find(x=>x.type==="weekday")?.value||"").toUpperCase();
  const firstName=current.name.split(" ")[0]||"Usuário";
  const mapPoints=heritageResult.data.filter((h:any)=>typeof h.lat==="number"&&typeof h.lng==="number");
  const topNotifications=notifications.data.slice(0,4);

  return <AppShell active="/">
    <main className="pageWrap">
      <div className="welcome">
        <div><h1>Olá, {firstName}.</h1><p>O patrimônio de Pernambuco em movimento.</p></div>
        <div className="dateCard"><strong>{day}</strong><span>{month} {year}</span><small>{weekday}</small></div>
      </div>

      <div className="sectionTitle"><h2>Prioridades do dia</h2><Link href="/notificacoes">Ver todas →</Link></div>
      <section className="priorityGrid">
        {topNotifications.length ? topNotifications.map((p:any)=><article className="priorityCard" key={p.id}><div><Status tone={p.tone}>{p.title}</Status><span>{p.detail}</span><b className={p.tone}>{p.when}</b></div></article>) : <div className="emptyState">Nenhuma prioridade registrada para hoje.</div>}
      </section>

      <section className="metricsRow">
        <Metric value={String(summary.bens)} label="bens acompanhados"/>
        <Metric value={String(summary.intervencoes)} label="intervenções em execução"/>
        <Metric value={String(summary.decisoes)} label="decisões pendentes" tone={summary.decisoes?"warning":undefined}/>
        <Metric value={String(summary.fiscalizacoes)} label="fiscalizações abertas"/>
      </section>

      <section className="homeBottom">
        <div className="panel">
          <div className="sectionTitle"><h2>Patrimônio em Pernambuco</h2><Link href="/patrimonio">Ver mapa completo →</Link></div>
          {mapPoints.length ? <HeritageMap points={mapPoints} compact /> : <div className="emptyMapState">Cadastre coordenadas nos bens culturais para visualizar o mapa.</div>}
        </div>
        <aside className="panel agenda">
          <div className="sectionTitle"><h2>Acompanhamento</h2><Link href="/controle">Ver controle →</Link></div>
          {topNotifications.length ? topNotifications.slice(0,3).map((n:any,i:number)=><div className="agendaRow" key={n.id}><b>{String(i+1).padStart(2,"0")}</b><i className={n.tone==="danger"?"danger":""}/><div><strong>{n.title}</strong><span>{n.detail}</span></div></div>) : <div className="emptyState">Sem pendências registradas.</div>}
        </aside>
      </section>
    </main>
  </AppShell>
}
