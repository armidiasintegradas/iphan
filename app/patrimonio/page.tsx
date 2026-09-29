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

export default async function Page(){
  const result=await getHeritage();
  const heritage=result.data;
  const mapPoints=heritage.filter((h:any)=>h.lat!==null&&h.lng!==null).map((h:any)=>({...h,lat:Number(h.lat),lng:Number(h.lng)}));

  return <AppShell active="/patrimonio"><main className="pageWrap approvedPatrimonio">
    <div className="pageHead patrimonioHead">
      <div><h1>Patrimônio</h1><p>Mapa e lista de bens culturais de Pernambuco</p></div>
      <div className="headActions"><DemoBadge source={result.source}/></div>
    </div>

    <div className="heritageSearchBar">
      <input aria-label="Buscar patrimônio" placeholder="Buscar bem, cidade, tipologia, projeto..." />
    </div>

    <div className="filterRow approvedFilters">
      {[
        ["Município","Todos os municípios"],
        ["Tipologia","Todas as tipologias"],
        ["Nível de proteção","Todos os níveis"],
        ["Estado de conservação","Todos os estados"],
        ["Intervenção","Todos os status"],
        ["Risco","Todos os níveis"],
      ].map(([title,value])=><button key={title}><strong>{title}</strong><span>{value}</span></button>)}
      <button className="filterAction"><SlidersHorizontal size={16}/><strong>Filtros</strong></button>
    </div>

    <section className="mapList approvedMapList">
      <div className="approvedMapWrap">
        {mapPoints.length ? <HeritageMap points={mapPoints}/> : <div className="emptyMapState">Ainda não há bens com coordenadas cadastradas.</div>}
      </div>
      <div className="heritageList approvedHeritageList">
        <div className="listHeader"><h3>{heritage.length} bens culturais</h3><span>Mais relevantes</span></div>
        {heritage.length ? heritage.slice(0,5).map((h:any)=><Link href={"/patrimonio/"+h.id} key={h.id} className="miniAsset">
          <img src={h.image} alt="" />
          <div><strong>{h.name}</strong><span>{h.city} · {h.type}</span><Status tone={tone(h.risk)}>{h.status}</Status></div>
          <MoreHorizontal size={16}/>
        </Link>) : <div className="emptyState">Nenhum bem cultural cadastrado.</div>}
      </div>
    </section>

    <div className="sectionTitle heritageGridTitle">
      <h2>Bens culturais em Pernambuco</h2>
      <div className="viewActions"><span>Ordenar por</span><button>Mais relevantes</button><button className="active"><Grid2X2 size={16}/></button><button><List size={16}/></button></div>
    </div>

    {heritage.length ? <div className="assetGrid approvedAssetGrid">{heritage.map((h:any)=><article className="assetCard approvedAssetCard" key={h.id}>
      <Link href={"/patrimonio/"+h.id}><img src={h.image} alt="" /></Link>
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
