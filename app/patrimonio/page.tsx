import AppShell from "@/components/AppShell";
import HeritageMap from "@/components/HeritageMap";
import {Status} from "@/components/UI";
import DemoBadge from "@/components/DemoBadge";
import {getHeritage} from "@/lib/data";
import Link from "next/link";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

export default async function Page(){
  const result=await getHeritage();
  const heritage=result.data;
  const mapPoints=heritage.filter((h:any)=>typeof h.lat==="number"&&typeof h.lng==="number");

  return <AppShell active="/patrimonio"><main className="pageWrap">
    <div className="pageHead"><div><h1>Patrimônio</h1><p>Mapa e lista de bens culturais de Pernambuco</p></div><div className="headActions"><DemoBadge source={result.source}/><Link href="/patrimonio/novo" className="primaryAction">+ Novo bem cultural</Link></div></div>
    <div className="filterRow">{["Município","Tipologia","Nível de proteção","Estado de conservação","Intervenção","Risco"].map(x=><button key={x}>{x}<span>Todos</span></button>)}</div>

    <section className="mapList">
      {mapPoints.length ? <HeritageMap points={mapPoints}/> : <div className="emptyMapState">Ainda não há bens com coordenadas cadastradas.</div>}
      <div className="heritageList">
        <h3>{heritage.length} {heritage.length===1?"bem cadastrado":"bens cadastrados"}</h3>
        {heritage.length ? heritage.slice(0,5).map((h:any)=><Link href={"/patrimonio/"+h.id} key={h.id} className="miniAsset"><img src={h.image}/><div><strong>{h.name}</strong><span>{h.city}</span><Status tone={tone(h.risk)}>{h.status}</Status></div></Link>) : <div className="emptyState">Nenhum bem cultural cadastrado.</div>}
      </div>
    </section>

    <div className="sectionTitle"><h2>Bens culturais em Pernambuco</h2></div>
    {heritage.length ? <div className="assetGrid">{heritage.map((h:any)=><Link href={"/patrimonio/"+h.id} className="assetCard" key={h.id}><img src={h.image}/><div><h3>{h.name}</h3><p>{h.city}</p><Status tone={tone(h.risk)}>{h.status}</Status><p className="assetDesc">{h.type}</p><b>Ver detalhes →</b></div></Link>)}</div> : <div className="emptyState panel">Comece cadastrando o primeiro bem cultural.</div>}
  </main></AppShell>
}
