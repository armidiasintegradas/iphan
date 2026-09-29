import AppShell from "@/components/AppShell";
import HeritageMap from "@/components/HeritageMap";
import {Status} from "@/components/UI";
import DemoBadge from "@/components/DemoBadge";
import {getHeritage} from "@/lib/data";
import Link from "next/link";
import { SlidersHorizontal, Grid2X2, List, Bookmark, MoreHorizontal } from "lucide-react";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  const result=await getHeritage();
  const all=result.data;
  const search=(q.q||"").trim().toLowerCase();
  const municipality=q.municipio||"todos";
  const type=q.tipologia||"todos";
  const protection=q.protecao||"todos";
  const conservation=q.conservacao||"todos";
  const intervention=q.intervencao||"todos";
  const risk=q.risco||"todos";
  const heritage=all.filter((h:any)=>{
    if(search && ![h.name,h.city,h.type,h.protection].join(" ").toLowerCase().includes(search)) return false;
    if(municipality!=="todos" && h.municipality!==municipality) return false;
    if(type!=="todos" && h.type!==type) return false;
    if(protection!=="todos" && h.protection!==protection) return false;
    if(conservation!=="todos" && h.risk!==conservation) return false;
    if(risk!=="todos" && h.risk!==risk) return false;
    if(intervention!=="todos" && !h.interventionStatuses.includes(intervention)) return false;
    return true;
  });
  const municipalities=[...new Set(all.map((h:any)=>h.municipality).filter(Boolean))].sort();
  const types=[...new Set(all.map((h:any)=>h.type).filter(Boolean))].sort();
  const protections=[...new Set(all.map((h:any)=>h.protection).filter(Boolean))].sort();
  const mapPoints=heritage.filter((h:any)=>h.lat!==null&&h.lng!==null).map((h:any)=>({...h,lat:Number(h.lat),lng:Number(h.lng)}));

  return <AppShell active="/patrimonio"><main className="pageWrap approvedPatrimonio">
    <div className="pageHead patrimonioHead">
      <div><h1>Patrimônio</h1><p>Mapa e lista de bens culturais de Pernambuco</p></div>
      <div className="headActions"><DemoBadge source={result.source}/></div>
    </div>

    <form method="get" className="heritageFilterForm">
      <div className="heritageSearchBar">
        <input name="q" defaultValue={q.q||""} aria-label="Buscar patrimônio" placeholder="Buscar bem, cidade, tipologia, projeto..." />
      </div>

      <div className="filterRow approvedFilters realHeritageFilters">
        <label><strong>Município</strong><select name="municipio" defaultValue={municipality}><option value="todos">Todos os municípios</option>{municipalities.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
        <label><strong>Tipologia</strong><select name="tipologia" defaultValue={type}><option value="todos">Todas as tipologias</option>{types.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
        <label><strong>Nível de proteção</strong><select name="protecao" defaultValue={protection}><option value="todos">Todos os níveis</option>{protections.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
        <label><strong>Estado de conservação</strong><select name="conservacao" defaultValue={conservation}><option value="todos">Todos os estados</option><option value="regular">Regular</option><option value="atencao">Atenção</option><option value="risco">Risco</option><option value="critico">Crítico</option></select></label>
        <label><strong>Intervenção</strong><select name="intervencao" defaultValue={intervention}><option value="todos">Todos os status</option><option value="em_andamento">Em execução</option><option value="aguardando">Aguardando</option><option value="concluido">Concluída</option></select></label>
        <label><strong>Risco</strong><select name="risco" defaultValue={risk}><option value="todos">Todos os níveis</option><option value="regular">Regular</option><option value="atencao">Atenção</option><option value="risco">Risco</option><option value="critico">Crítico</option></select></label>
        <button type="submit" className="filterAction"><SlidersHorizontal size={16}/><strong>Aplicar</strong></button>
      </div>
    </form>

    <section className="mapList approvedMapList">
      <div className="approvedMapWrap">
        {mapPoints.length ? <HeritageMap points={mapPoints}/> : <div className="emptyMapState">Ainda não há bens com coordenadas cadastradas.</div>}
      </div>
      <div className="heritageList approvedHeritageList">
        <div className="listHeader"><h3>{heritage.length} bens culturais</h3><span>Mais relevantes</span></div>
        {heritage.length ? heritage.slice(0,5).map((h:any,index:number)=><Link href={"/patrimonio/"+h.id} key={h.id} className="miniAsset">
          <span className="approvedHeritageThumb" style={{backgroundImage:`url("/visual/heritage-thumb-${String((index%4)+1).padStart(2,"0")}.webp")`}} aria-hidden="true"/>
          <div><strong>{h.name}</strong><span>{h.city} · {h.type}</span><Status tone={tone(h.risk)}>{h.status}</Status></div>
          <MoreHorizontal size={16}/>
        </Link>) : <div className="emptyState">Nenhum bem cultural cadastrado.</div>}
      </div>
    </section>

    <div className="sectionTitle heritageGridTitle">
      <h2>Bens culturais em Pernambuco</h2>
      <div className="viewActions"><span>Ordenar por</span><button>Mais relevantes</button><button className="active"><Grid2X2 size={16}/></button><button><List size={16}/></button></div>
    </div>

    {heritage.length ? <div className="assetGrid approvedAssetGrid">{heritage.map((h:any,index:number)=><article className="assetCard approvedAssetCard" key={h.id}>
      <Link href={"/patrimonio/"+h.id} className="approvedAssetVisual"><span style={{backgroundImage:`url("/visual/heritage-thumb-${String((index%4)+1).padStart(2,"0")}.webp")`}} aria-hidden="true"/></Link>
      <div>
        <h3>{h.name}</h3>
        <p>{h.city}</p>
        <Status tone={tone(h.risk)}>{h.status}</Status>
        <p className="assetDesc">{h.type}</p>
        <div className="assetCardFooter"><Link href={"/patrimonio/"+h.id}>Ver detalhes →</Link><button aria-label="Salvar"><Bookmark size={16}/></button></div>
      </div>
    </article>)}</div> : <div className="emptyState panel">Comece cadastrando o primeiro bem cultural.</div>}
  </main></AppShell>
}
