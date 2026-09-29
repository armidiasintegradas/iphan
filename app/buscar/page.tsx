import Link from "next/link";
import AppShell from "@/components/AppShell";
import {globalSearch} from "@/lib/search-data";
import {FileText, Landmark, Search, Wrench} from "lucide-react";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  const result=await globalSearch(q.q||"");
  const total=result.heritage.length+result.interventions.length+result.documents.length;

  return <AppShell active=""><main className="pageWrap approvedSearchPage">
    <div className="pageHead">
      <div><small>Busca global</small><h1>Resultados</h1><p>{result.query ? `${total} resultado(s) para “${result.query}”` : "Busque por bem cultural, intervenção ou documento."}</p></div>
    </div>

    {!result.query&&<div className="panel searchEmpty"><Search/><strong>Digite pelo menos 2 caracteres na busca do topo.</strong></div>}

    {result.query&&<>
      <section className="searchGroup">
        <div className="sectionTitle"><h2><Landmark/> Patrimônio</h2><span>{result.heritage.length}</span></div>
        <div className="searchResultList">{result.heritage.length?result.heritage.map((item:any)=><Link href={"/patrimonio/"+item.id} className="searchResult" key={item.id}><Landmark/><div><strong>{item.nome}</strong><span>{[item.municipio,item.uf].filter(Boolean).join(", ")} · {item.tipologia||"Tipologia não informada"}</span></div><small>{item.risco||"regular"}</small></Link>):<div className="emptyState">Nenhum bem cultural encontrado.</div>}</div>
      </section>

      <section className="searchGroup">
        <div className="sectionTitle"><h2><Wrench/> Intervenções</h2><span>{result.interventions.length}</span></div>
        <div className="searchResultList">{result.interventions.length?result.interventions.map((item:any)=><Link href={"/intervencoes/"+item.id} className="searchResult" key={item.id}><Wrench/><div><strong>{item.titulo}</strong><span>{item.bens_culturais?.nome||"Bem cultural"}{item.bens_culturais?.municipio?" · "+item.bens_culturais.municipio:""}</span></div><small>{item.status}</small></Link>):<div className="emptyState">Nenhuma intervenção encontrada.</div>}</div>
      </section>

      <section className="searchGroup">
        <div className="sectionTitle"><h2><FileText/> Documentos</h2><span>{result.documents.length}</span></div>
        <div className="searchResultList">{result.documents.length?result.documents.map((item:any)=><Link href="/documentos" className="searchResult" key={item.id}><FileText/><div><strong>{item.titulo}</strong><span>{item.contexto||"Documento"} · {item.sistema_origem||"Sistema"}</span></div><small>{new Date(item.created_at).toLocaleDateString("pt-BR")}</small></Link>):<div className="emptyState">Nenhum documento encontrado.</div>}</div>
      </section>
    </>}
  </main></AppShell>;
}
