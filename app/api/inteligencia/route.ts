import {NextRequest,NextResponse} from "next/server";
import {getIntelligenceContext} from "@/lib/intelligence-data";

const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

function overdue(date:string|null|undefined,now:string){
  return !!date && new Date(date).getTime()<new Date(now).getTime();
}
function datePt(value:string|null|undefined){
  if(!value) return "sem prazo";
  return new Date(value).toLocaleDateString("pt-BR");
}
function interventionMatch(question:string,items:any[]){
  const q=normalize(question);
  const candidates=items.map(item=>{
    const hay=normalize([item.title,item.heritage,item.city].filter(Boolean).join(" "));
    const tokens=q.split(/\s+/).filter(t=>t.length>=4);
    const score=tokens.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
    return {item,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  return candidates[0]?.item||null;
}

function answer(question:string,ctx:any){
  const q=normalize(question);
  const activeInterventions=ctx.interventions.filter((x:any)=>["aberto","em_andamento","aguardando"].includes(x.status));
  const delayed=activeInterventions.filter((x:any)=>x.actual<x.planned);
  const overdueDecisions=ctx.decisions.filter((x:any)=>overdue(x.prazo,ctx.now));
  const overdueRestrictions=ctx.restrictions.filter((x:any)=>overdue(x.prazo,ctx.now));
  const awaitingMeasurements=ctx.measurements.filter((x:any)=>x.status==="aguardando");
  const upcomingFiscalizations=ctx.fiscalizations.filter((x:any)=>x.agendada_para&&!x.realizada_em&&new Date(x.agendada_para)>=new Date(ctx.now));
  const riskyHeritage=ctx.heritage.filter((x:any)=>["risco","critico"].includes(x.risco));
  const openOccurrences=ctx.occurrences.length;

  if(q.includes("porque") && (q.includes("atras")||q.includes("desvio"))){
    const item=interventionMatch(question,ctx.interventions);
    if(!item) return {text:"Não consegui identificar uma intervenção específica nos registros atuais. Informe o nome da obra ou do bem cultural.",source:"supabase"};

    const restrictions=ctx.restrictions.filter((x:any)=>x.intervencao_id===item.id);
    const decisions=ctx.decisions.filter((x:any)=>x.intervencao_id===item.id);
    const gap=Math.max(0,item.planned-item.actual);
    const parts=[
      `${item.title}: ${item.actual}% executado / ${item.planned}% planejado${gap? ` — desvio de ${gap.toFixed(1).replace(".",",")} p.p.` : "."}`
    ];
    if(restrictions.length) parts.push("Restrições associadas: "+restrictions.slice(0,3).map((x:any)=>x.titulo+(x.impacto?` (${x.impacto})`:"")).join("; ")+".");
    if(decisions.length) parts.push("Decisões pendentes associadas: "+decisions.slice(0,3).map((x:any)=>x.titulo+(x.prazo?` — prazo ${datePt(x.prazo)}`:"")).join("; ")+".");
    if(!restrictions.length&&!decisions.length) parts.push("Os registros atuais não trazem restrição ou decisão pendente que permita atribuir uma causa. O sistema identifica o desvio, mas não deve inferir o motivo sem evidência operacional.");
    return {text:parts.join(" "),source:"supabase"};
  }

  if(q.includes("atencao")||q.includes("prioridade")||q.includes("hoje")){
    const parts=[
      `${overdueDecisions.length} decisão(ões) vencida(s)`,
      `${overdueRestrictions.length} restrição(ões) vencida(s)`,
      `${delayed.length} intervenção(ões) abaixo do planejado`,
      `${awaitingMeasurements.length} medição(ões) aguardando conferência`,
      `${openOccurrences} ocorrência(s) aberta(s)`,
      `${upcomingFiscalizations.length} fiscalização(ões) futura(s)`,
    ];
    return {text:"Prioridades operacionais: "+parts.join("; ")+".",source:"supabase"};
  }

  if(q.includes("atras")||q.includes("desvio")){
    return {text:delayed.length
      ?"Intervenções abaixo do planejado: "+delayed.slice(0,8).map((x:any)=>`${x.title} — ${x.actual}% executado / ${x.planned}% planejado`).join("; ")+"."
      :"Não há intervenções abaixo do planejado nos registros atuais.",source:"supabase"};
  }

  if(q.includes("decis")&&q.includes("venc")){
    return {text:overdueDecisions.length
      ?`Há ${overdueDecisions.length} decisão(ões) vencida(s): `+overdueDecisions.slice(0,8).map((x:any)=>`${x.titulo} — prazo ${datePt(x.prazo)}`).join("; ")+"."
      :"Não há decisões vencidas nos registros atuais.",source:"supabase"};
  }

  if(q.includes("restric")){
    return {text:ctx.restrictions.length
      ?`Há ${ctx.restrictions.length} restrição(ões) em acompanhamento. `+ctx.restrictions.slice(0,6).map((x:any)=>`${x.titulo} — ${x.risco}${x.prazo?`, prazo ${datePt(x.prazo)}`:""}`).join("; ")+"."
      :"Não há restrições abertas nos registros atuais.",source:"supabase"};
  }

  if(q.includes("medic")){
    return {text:`O sistema registra ${ctx.measurements.length} medição(ões), das quais ${awaitingMeasurements.length} aguardam conferência.`,source:"supabase"};
  }

  if(q.includes("fiscal")||q.includes("vistoria")){
    return {text:upcomingFiscalizations.length
      ?`Há ${upcomingFiscalizations.length} fiscalização(ões) programada(s): `+upcomingFiscalizations.slice(0,6).map((x:any)=>`${x.titulo} — ${datePt(x.agendada_para)}`).join("; ")+"."
      :"Não há fiscalizações futuras registradas.",source:"supabase"};
  }

  if(q.includes("conserv")||q.includes("risco")||q.includes("critico")){
    return {text:`Há ${riskyHeritage.length} bem(ns) classificado(s) em risco ou crítico, de um total de ${ctx.heritage.length} bem(ns) cadastrados.`,source:"supabase"};
  }

  if(q.includes("document")){
    return {text:`Há ${ctx.documents.length} documento(s) registrado(s) no sistema, distribuídos entre contextos como bem cultural, intervenção, fiscalização, medição e decisão conforme o cadastro existente.`,source:"supabase"};
  }

  if(q.includes("resumo")||q.includes("reuni")){
    return {text:`Resumo executivo: ${ctx.heritage.length} bens acompanhados; ${activeInterventions.length} intervenções ativas; ${delayed.length} abaixo do planejado; ${ctx.decisions.length} decisões pendentes, sendo ${overdueDecisions.length} vencidas; ${ctx.restrictions.length} restrições em acompanhamento; ${awaitingMeasurements.length} medições aguardando conferência; ${upcomingFiscalizations.length} fiscalizações futuras; ${riskyHeritage.length} bens em risco ou crítico.`,source:"supabase"};
  }

  if(q.includes("quant")||q.includes("bens")||q.includes("interven")){
    return {text:`O recorte atual contém ${ctx.heritage.length} bens culturais e ${activeInterventions.length} intervenções ativas. ${delayed.length} intervenção(ões) estão abaixo do avanço planejado.`,source:"supabase"};
  }

  return {text:"Posso consultar bens culturais, intervenções, desvios, decisões, restrições, medições, fiscalizações, conservação, documentos e resumos operacionais. Indique o bem, a obra ou o tipo de informação desejado.",source:"supabase"};
}

export async function POST(request:NextRequest){
  const body=await request.json().catch(()=>({}));
  const question=String(body?.question||"").trim();
  if(!question) return NextResponse.json({error:"Pergunta obrigatória."},{status:400});

  const context=await getIntelligenceContext();
  return NextResponse.json(answer(question,context));
}
