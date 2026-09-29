import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getAudit} from "@/lib/control-data";

export default async function Page(){
 const {data,source}=await getAudit();
 return <AppShell active="/administracao/usuarios"><main className="pageWrap"><div className="pageHead"><div><small>Administração</small><h1>Auditoria</h1><p>Histórico de alterações, responsáveis e eventos do sistema.</p></div><DemoBadge source={source}/></div>
 <section className="panel auditList">{data.map(a=><article className="auditItem" key={a.id}><div className="auditDot"/><div><strong>{a.acao}</strong><span>{a.detail}</span><small>{a.entidade} · {a.actor}</small></div><time>{new Date(a.created_at).toLocaleString("pt-BR")}</time></article>)}</section>
 </main></AppShell>
}
