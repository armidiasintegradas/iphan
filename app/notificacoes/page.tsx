import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getNotifications} from "@/lib/control-data";
import Link from "next/link";

export default async function Page(){
 const {data,source}=await getNotifications();
 return <AppShell active=""><main className="pageWrap"><div className="pageHead"><div><h1>Notificações</h1><p>O que exige ação, acompanhamento ou ciência.</p></div><DemoBadge source={source}/></div>
 <section className="panel notificationList">{data.map(n=><Link href={n.href} className="notificationItem" key={n.id}><i className={n.tone}/><div><strong>{n.title}</strong><span>{n.detail}</span></div><small>{n.when}</small><b>→</b></Link>)}</section>
 </main></AppShell>
}
