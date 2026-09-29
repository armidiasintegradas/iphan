import AppShell from "@/components/AppShell";
import HeritageMap from "@/components/HeritageMap";
import { getDashboardSummary, getHeritage } from "@/lib/data";
import { getNotifications } from "@/lib/control-data";
import { getCurrentUser } from "@/lib/current-user";
import Link from "next/link";
import { AlertCircle, CalendarClock, ClipboardCheck, SearchCheck } from "lucide-react";

const priorityImages=[
  "/visual/priority-decisao.webp",
  "/visual/priority-intervencao.webp",
  "/visual/priority-medicao.webp",
  "/visual/priority-fiscalizacao.webp"
];

const priorityIcons=[AlertCircle,CalendarClock,ClipboardCheck,SearchCheck];

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
  const mapPoints=heritageResult.data.filter((h:any)=>h.lat!==null&&h.lng!==null).map((h:any)=>({...h,lat:Number(h.lat),lng:Number(h.lng)}));
  const topNotifications=notifications.data.slice(0,4);

  return <AppShell active="/">
    <main className="pageWrap approvedHome">
      <div className="welcome">
        <div>
          <h1>Boa tarde, {firstName}.</h1>
          <p>O patrimônio de Pernambuco em movimento.</p>
        </div>
        <div className="dateCard"><strong>{day}</strong><span>{month} {year}</span><small>{weekday}</small></div>
      </div>

      <div className="sectionTitle priorityHeading"><h2>PRIORIDADES DO DIA</h2><Link href="/notificacoes">Ver todas →</Link></div>
      <section className="priorityGrid approvedPriorities">
        {topNotifications.length ? topNotifications.map((p:any,index:number)=>{
          const Icon=priorityIcons[index%priorityIcons.length];
          return <article className="priorityCard approvedPriority" key={p.id}>
            <div className="priorityApprovedImage" style={{backgroundImage:`url("${priorityImages[index%priorityImages.length]}")`}} aria-hidden="true"/>
            <div className="priorityBody">
              <div className={"priorityIcon "+p.tone}><Icon size={14}/></div>
              <div>
                <strong>{p.title}</strong>
                <span>{p.detail}</span>
                <b className={p.tone}>{p.when}</b>
              </div>
            </div>
          </article>
        }) : <div className="emptyState">Nenhuma prioridade registrada para hoje.</div>}
      </section>

      <section className="metricsRow approvedMetrics">
        <article><strong>{summary.bens}</strong><span>bens acompanhados</span><small>↗ visão consolidada</small></article>
        <article><strong>{summary.intervencoes}</strong><span>intervenções em execução</span><small className="dangerText">acompanhamento ativo</small></article>
        <article><strong>{summary.decisoes}</strong><span>decisões pendentes</span><small className="dangerText">requerem acompanhamento</small></article>
        <article><strong>{summary.fiscalizacoes}</strong><span>fiscalizações abertas</span><small>agenda operacional</small></article>
      </section>

      <section className="homeBottom approvedBottom">
        <div className="panel mapPanel">
          <div className="sectionTitle"><h2>Intervenções em Pernambuco</h2><Link href="/patrimonio">Ver todas →</Link></div>
          {mapPoints.length ? <HeritageMap points={mapPoints} compact /> : <div className="emptyMapState">Cadastre coordenadas nos bens culturais para visualizar o mapa.</div>}
        </div>
        <aside className="panel agenda approvedAgenda">
          <div className="sectionTitle"><h2>Sua agenda</h2><Link href="/controle">Ver agenda completa →</Link></div>
          {topNotifications.length ? topNotifications.slice(0,4).map((n:any,i:number)=><div className="agendaRow" key={n.id}>
            <b>{["09:00","11:30","14:00","16:30"][i]||"--:--"}</b>
            <i className={n.tone==="danger"?"danger":n.tone==="warning"?"warning":""}/>
            <div><strong>{n.title}</strong><span>{n.detail}</span></div>
          </div>) : <div className="emptyState">Sem pendências registradas.</div>}
        </aside>
      </section>
    </main>
  </AppShell>
}
