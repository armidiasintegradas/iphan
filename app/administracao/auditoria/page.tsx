import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getAudit} from "@/lib/control-data";
import {getCurrentUser} from "@/lib/current-user";
import { Activity, Clock3, UserCheck } from "lucide-react";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const q=await searchParams;
 const current=await getCurrentUser();
 if(!current.isDemo && !["admin","gestor","coordenador"].includes(current.role)) redirect("/");
 const filters={entidade:q.entidade||"todos",q:q.q||""};
 const {data,source}=await getAudit(filters);
 const actors=new Set(data.map((a:any)=>a.actor)).size;
 return <AppShell active="/administracao/usuarios"><main className="pageWrap approvedAudit">
   <div className="pageHead"><div><small>Administração</small><h1>Auditoria</h1><p>Histórico de alterações, responsáveis e eventos do sistema.</p></div><DemoBadge source={source}/></div>
   <form className="auditFilters" method="get">
     <input name="q" defaultValue={filters.q} placeholder="Buscar por usuário, ação ou registro..."/>
     <select name="entidade" defaultValue={filters.entidade}>
       <option value="todos">Todas as entidades</option>
       <option value="bens_culturais">Bens culturais</option>
       <option value="intervencoes">Intervenções</option>
       <option value="ocorrencias">Ocorrências</option>
       <option value="evidencias">Evidências</option>
       <option value="fiscalizacoes">Fiscalizações</option>
       <option value="medicoes">Medições</option>
       <option value="decisoes">Decisões</option>
       <option value="restricoes">Restrições</option>
       <option value="documentos">Documentos</option>
       <option value="inspecoes_conservacao">Conservação</option>
       <option value="perfis">Perfis</option>
     </select>
     <button type="submit">Filtrar</button>
   </form>
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