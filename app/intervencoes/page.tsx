import AppShell from "@/components/AppShell";
import Link from "next/link";
import {Status,Metric} from "@/components/UI";
import {getInterventionsPortfolio} from "@/lib/data";

function tone(risk:string){
  if(risk==="critico"||risk==="risco") return "danger";
  if(risk==="atencao") return "warning";
  return "regular";
}

function label(status:string){
  const map:Record<string,string>={
    rascunho:"Rascunho",
    aberto:"Aberta",
    em_andamento:"Em execução",
    aguardando:"Aguardando",
    concluido:"Concluída",
    cancelado:"Cancelada",
  };
  return map[status]||status;
}

export default async function Page(){
  const result=await getInterventionsPortfolio();
  const rows=result.data;
  const running=rows.filter((x:any)=>x.status==="em_andamento").length;
  const delayed=rows.filter((x:any)=>x.actual<x.planned).length;
  const risks=rows.filter((x:any)=>x.risk==="risco"||x.risk==="critico").length;
  const completed=rows.filter((x:any)=>x.status==="concluido").length;

  return <AppShell active="/intervencoes"><main className="pageWrap">
    <div className="pageHead"><div><h1>Intervenções</h1><p>Acompanhamento integrado das obras e ações de preservação.</p></div><Link href="/intervencoes/nova" className="primaryAction">+ Nova intervenção</Link></div>

    <div className="metricsRow">
      <Metric value={String(running)} label="Em execução"/>
      <Metric value={String(delayed)} label="Com desvio físico" tone={delayed?"danger":undefined}/>
      <Metric value={String(risks)} label="Situações de risco" tone={risks?"danger":undefined}/>
      <Metric value={String(completed)} label="Concluídas"/>
    </div>

    {rows.length ? <div className="workGrid">{rows.map((item:any)=><Link href={"/intervencoes/"+item.id} className="workCard" key={item.id}>
      <div className="workCardPlaceholder"/>
      <div>
        <Status tone={tone(item.risk)}>{label(item.status)}</Status>
        <h2>{item.title}</h2>
        <p>{item.heritageName}{item.city?" · "+item.city:""}</p>
        <div className="progress"><i style={{width:Math.max(0,Math.min(100,item.actual))+"%"}}/></div>
        <small>{item.actual}% executado · {item.planned}% planejado</small>
      </div>
    </Link>)}</div> : <div className="emptyState panel">Nenhuma intervenção cadastrada. Crie uma intervenção após cadastrar o primeiro bem cultural.</div>}
  </main></AppShell>
}
