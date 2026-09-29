import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getDocumentsOverview} from "@/lib/overview-data";
import Link from "next/link";
import { FileText, Star, Clock3 } from "lucide-react";
import {getCurrentUser} from "@/lib/current-user";
import {can} from "@/lib/permissions";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  const filters={contexto:q.contexto||"todos",sistema:q.sistema||"todos",status:q.status||"todos",periodo:q.periodo||"365"};
  const [{rows,groups},current]=await Promise.all([getDocumentsOverview(filters),getCurrentUser()]);
  const canWrite=can(current.role,"document.write");

  return <AppShell active="/documentos"><main className="pageWrap approvedDocs">
    <div className="pageHead"><div><h1>Documentos</h1><p>Organize e acesse documentos do patrimônio cultural.</p></div>{canWrite&&<Link href="/documentos/novo" className="primaryAction">+ Novo documento</Link>}</div>
    <form className="filterRow docFilters realDocFilters" method="get">
      <label><strong>Contexto</strong><select name="contexto" defaultValue={filters.contexto}><option value="todos">Todos os contextos</option><option>Bem cultural</option><option>Intervenção</option><option>Fiscalização</option><option>Medição</option><option>Decisão</option><option>Conservação</option><option>Outro</option></select></label>
      <label><strong>Sistema</strong><select name="sistema" defaultValue={filters.sistema}><option value="todos">Todos os sistemas</option><option>Interno</option><option>SEI</option><option>SICG</option><option>Fiscalis</option><option>Transferegov</option><option>Outro</option></select></label>
      <label><strong>Status</strong><select name="status" defaultValue={filters.status}><option value="todos">Todos os status</option><option value="arquivo">Com arquivo</option><option value="referencia">Somente referência</option></select></label>
      <label><strong>Data</strong><select name="periodo" defaultValue={filters.periodo}><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="365">Últimos 12 meses</option><option value="todos">Todo o período</option></select></label>
      <button type="submit">Aplicar</button>
    </form>

    <div className="docsGrid approvedDocsGrid">
      <section>
        {Object.keys(groups).length ? Object.entries(groups).map(([g,documents]:any)=><div className="docGroup approvedDocGroup" key={g}>
          <div className="docGroupTitle"><h2>{g}<small>{documents.length} documentos</small></h2><Link href="/documentos">Ver todos →</Link></div>
          {documents.map((d:any)=><div className="docRow approvedDocRow" key={d.id}>
            <Star size={16} className="docStar"/>
            <span className="docIcon"><FileText size={15}/></span>
            <div><strong>{d.titulo}</strong><span>{d.referencia_externa||"Sem referência externa"}</span></div>
            <span>{new Date(d.created_at).toLocaleDateString("pt-BR")}</span>
            <Status tone="info">{d.sistema_origem||"Interno"}</Status>
            {d.signedUrl ? <a href={d.signedUrl} target="_blank" rel="noreferrer">Abrir</a> : <b>⋮</b>}
          </div>)}
        </div>) : <div className="emptyState panel">Nenhum documento cadastrado.</div>}
      </section>

      <aside className="sideColumnStack">
        <section className="panel recentDocs">
          <div className="sectionTitle"><h2><Clock3 size={17}/> Documentos recentes</h2><Link href="/documentos">Ver todos →</Link></div>
          {rows.slice(0,6).map((d:any)=><div className="recentDoc" key={d.id}><FileText size={20}/><div><strong>{d.titulo}</strong><span>{new Date(d.created_at).toLocaleDateString("pt-BR")}</span></div><Status tone="info">{d.sistema_origem||"Interno"}</Status></div>)}
        </section>
        <section className="panel recentDocs">
          <div className="sectionTitle"><h2><Star size={17}/> Favoritos</h2><span/></div>
          {rows.slice(0,4).map((d:any)=><div className="recentDoc" key={d.id}><Star size={18}/><div><strong>{d.titulo}</strong><span>{d.sistema_origem||"Interno"}</span></div></div>)}
        </section>
      </aside>
    </div>
  </main></AppShell>
}
