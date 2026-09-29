import AppShell from "@/components/AppShell";
import DemoBadge from "@/components/DemoBadge";
import {getControlData} from "@/lib/control-data";
import Link from "next/link";
import { AlertTriangle, Gavel, Clock3, SlidersHorizontal } from "lucide-react";
import {closeControlItem} from "@/app/controle/actions";
import {getCurrentUser} from "@/lib/current-user";
import {can} from "@/lib/permissions";

const tone=(r:string)=>r==="critico"?"danger":r==="atencao"?"warning":"regular";

export default async function Page(){
  const [{decisions,restrictions,source},current]=await Promise.all([getControlData(),getCurrentUser()]);
  const canClose=can(current.role,"decision.write");
  const critical=decisions.filter(x=>x.risco==="critico").length+restrictions.filter(x=>x.risco==="critico").length;
  return <AppShell active="/controle"><main className="pageWrap approvedControl">
    <div className="pageHead">
      <div><h1>Controle</h1><p>Decisões, restrições, responsáveis e prazos em um único fluxo.</p></div>
      <div className="headActions"><DemoBadge source={source}/><Link href="/controle/decisao/nova" className="primaryAction">+ Decisão</Link><Link href="/controle/restricao/nova" className="secondaryAction">+ Restrição</Link></div>
    </div>

    <section className="controlMetricRow">
      <article><Gavel/><strong>{decisions.length}</strong><span>Decisões abertas</span><small>em análise</small></article>
      <article><Clock3/><strong>{restrictions.length}</strong><span>Restrições abertas</span><small>impacto operacional</small></article>
      <article><AlertTriangle/><strong>{critical}</strong><span>Itens críticos</span><small className={critical?"dangerText":""}>ação prioritária</small></article>
      <article><SlidersHorizontal/><strong>{decisions.length+restrictions.length}</strong><span>Total em controle</span><small>visão consolidada</small></article>
    </section>

    <div className="controlTabs"><button className="active">Todos</button><button>Decisões</button><button>Restrições</button><button>Vencidos</button></div>

    <section className="panel approvedControlTable">
      <div className="controlTableHead withActions"><span>ID</span><span>Item</span><span>Tipo</span><span>Responsável</span><span>Prazo</span><span>Status</span><span>Ações</span></div>
      {[...decisions.map(d=>({...d,kind:"Decisão"})),...restrictions.map(r=>({...r,kind:"Restrição"}))].map((item:any)=><article className="controlTableRow" key={item.kind+item.id}>
        <span className="controlId">{item.id}</span>
        <div><strong>{item.titulo}</strong><small>{item.intervencao}</small>{item.impacto&&<em>{item.impacto}</em>}</div>
        <span>{item.kind}</span>
        <span>{item.responsavel}</span>
        <span>{item.prazo?new Date(item.prazo).toLocaleDateString("pt-BR"):"—"}</span>
        <span className={"status "+tone(item.risco)}><i/>{item.status==="concluido"?"concluído":item.risco}</span>
        <div className="rowActions">{canClose&&item.status!=="concluido" ? <form action={closeControlItem}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="kind" value={item.kind==="Decisão"?"decision":"restriction"}/><button className="rowAction success" type="submit">Concluir</button></form> : <span className="rowActionMuted">{item.status==="concluido"?"Encerrado":"—"}</span>}</div>
      </article>)}
      {!decisions.length&&!restrictions.length&&<div className="emptyState">Nenhum item aberto no controle.</div>}
    </section>
  </main></AppShell>
}
