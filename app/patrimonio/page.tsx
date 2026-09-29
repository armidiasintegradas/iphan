import AppShell from "@/components/AppShell";
import HeritageMap from "@/components/HeritageMap";
import {heritage} from "@/lib/mock";
import {Status} from "@/components/UI";
import Link from "next/link";

export default function Page(){
  return <AppShell active="/patrimonio"><main className="pageWrap">
    <div className="pageHead"><div><h1>Patrimônio</h1><p>Mapa e lista de bens culturais de Pernambuco</p></div><Link href="/patrimonio/novo" className="primaryAction">+ Novo bem cultural</Link></div>
    <div className="filterRow">{["Município","Tipologia","Nível de proteção","Estado de conservação","Intervenção","Risco"].map(x=><button key={x}>{x}<span>Todos</span></button>)}</div>

    <section className="mapList">
      <HeritageMap points={heritage}/>
      <div className="heritageList">
        <h3>{heritage.length} bens demonstrativos</h3>
        {heritage.slice(0,5).map(h=><Link href={"/patrimonio/"+h.id} key={h.id} className="miniAsset"><img src={h.image}/><div><strong>{h.name}</strong><span>{h.city}</span><Status tone={h.risk==="Regular"?"regular":h.risk==="Risco"?"danger":"warning"}>{h.status}</Status></div></Link>)}
      </div>
    </section>

    <div className="sectionTitle"><h2>Bens culturais em Pernambuco</h2></div>
    <div className="assetGrid">{heritage.slice(0,4).map(h=><Link href={"/patrimonio/"+h.id} className="assetCard" key={h.id}><img src={h.image}/><div><h3>{h.name}</h3><p>{h.city}</p><Status tone={h.risk==="Regular"?"regular":h.risk==="Risco"?"danger":"warning"}>{h.status}</Status><p className="assetDesc">Bem cultural acompanhado pelo Iphan com informações históricas, intervenções e estado de conservação.</p><b>Ver detalhes →</b></div></Link>)}</div>
  </main></AppShell>
}
