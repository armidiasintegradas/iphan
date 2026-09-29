import AppShell from "@/components/AppShell";
import {Status} from "@/components/UI";
import {getDocumentsOverview} from "@/lib/overview-data";

export default async function Page(){
  const {rows,groups}=await getDocumentsOverview();

  return <AppShell active="/documentos"><main className="pageWrap">
    <div className="pageHead"><div><h1>Documentos</h1><p>Organize e acesse documentos do patrimônio cultural.</p></div></div>

    <div className="filterRow">
      {["Contexto","Sistema","Status","Data"].map(x=><button key={x}>{x}<span>Todos</span></button>)}
    </div>

    <div className="docsGrid">
      <section>
        {Object.keys(groups).length ? Object.entries(groups).map(([g,docs]:any)=><div className="docGroup" key={g}>
          <h2>{g}<small>{docs.length} documentos</small></h2>
          {docs.map((d:any)=><div className="docRow" key={d.id}>
            <span className="docIcon">DOC</span>
            <div><strong>{d.titulo}</strong><span>{d.referencia_externa||"Sem referência externa"}</span></div>
            <span>{new Date(d.created_at).toLocaleDateString("pt-BR")}</span>
            <Status tone="info">{d.sistema_origem||"Interno"}</Status>
            <b>⋮</b>
          </div>)}
        </div>) : <div className="emptyState panel">Nenhum documento cadastrado.</div>}
      </section>

      <aside className="panel recentDocs">
        <h2>Documentos recentes</h2>
        {rows.slice(0,6).map((d:any)=><div className="updateRow" key={d.id}>
          <strong>{d.titulo}</strong>
          <span>{d.sistema_origem||"Interno"} · {new Date(d.created_at).toLocaleDateString("pt-BR")}</span>
        </div>)}
        {!rows.length&&<div className="emptyState">Nenhum documento recente.</div>}
      </aside>
    </div>
  </main></AppShell>
}