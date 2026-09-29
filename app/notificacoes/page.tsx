import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getNotifications} from "@/lib/control-data";
import Link from "next/link";
import { Bell, CheckCircle2, AlertTriangle, Clock3 } from "lucide-react";

export default async function Page(){
 const {data,source}=await getNotifications();
 const critical=data.filter((n:any)=>n.tone==="danger").length;
 const warning=data.filter((n:any)=>n.tone==="warning").length;
 return <AppShell active=""><main className="pageWrap approvedNotifications">
  <div className="pageHead"><div><h1>Notificações</h1><p>O que exige ação, acompanhamento ou ciência.</p></div><DemoBadge source={source}/></div>
  <section className="notificationMetrics">
    <article><Bell/><strong>{data.length}</strong><span>Total</span></article>
    <article><AlertTriangle/><strong>{critical}</strong><span>Críticas</span></article>
    <article><Clock3/><strong>{warning}</strong><span>Atenção</span></article>
    <article><CheckCircle2/><strong>{Math.max(0,data.length-critical-warning)}</strong><span>Informativas</span></article>
  </section>
  <div className="notificationTabs"><button className="active">Todas</button><button>Críticas</button><button>Atenção</button><button>Informativas</button></div>
  <section className="panel approvedNotificationList">{data.map((n:any)=><Link href={n.href} className="approvedNotificationItem" key={n.id}>
    <i className={n.tone}/><div><strong>{n.title}</strong><span>{n.detail}</span></div><small>{n.when}</small><b>→</b>
  </Link>)}{!data.length&&<div className="emptyState">Nenhuma notificação.</div>}</section>
 </main></AppShell>
}