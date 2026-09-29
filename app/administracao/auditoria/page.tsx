import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getAudit} from "@/lib/control-data";
import {getCurrentUser} from "@/lib/current-user";
import { Activity, Clock3, UserCheck } from "lucide-react";

export default async function Page(){
 const current=await getCurrentUser();
 if(!current.isDemo && !["admin","gestor","coordenador"].includes(current.role)) redirect("/");
 const {data,source}=await getAudit();
 const actors=new Set(data.map((a:any)=>a.actor)).size;
 return <AppShell active="/administracao/usuarios"><main className="pageWrap approvedAudit">
   <div className="pageHead"><div><small>Administração</small><h1>Auditoria</h1><p>Histórico de alterações, responsáveis e eventos do sistema.</p></div><DemoBadge source={source}/></div>
   <section className="adminMetrics">
     <article><Activity/><strong>{data.length}</strong><span>Eventos registrados</span></article>
     <article><UserCheck/><strong>{actors}</strong><span>Atores identificados</span></article>
     <article><Clock3/><strong>{data.length?new Date(data[0].created_at).toLocaleDateString("pt-BR"):"—"}</strong><span>Último evento</span></article>
   </section>
   <section className="panel approvedAuditList">{data.map((a:any)=><article className="approvedAuditItem" key={a.id}>
     <div className="auditDot"/><div><strong>{a.acao}</strong><span>{a.detail}</span><small>{a.entidade} · {a.actor}</small></div><time>{new Date(a.created_at).toLocaleString("pt-BR")}</time>
   </article>)}{!data.length&&<div className="emptyState">Nenhum evento de auditoria registrado.</div>}</section>
 </main></AppShell>
}