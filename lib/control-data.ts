import { createClient } from "@/lib/supabase/server";

export async function getControlData(){
  const supabase=await createClient();
  const [d,r]=await Promise.all([
    supabase.from("decisoes").select("id,titulo,status,prazo,responsavel_id,intervencao_id").order("prazo"),
    supabase.from("restricoes").select("id,titulo,status,risco,prazo,impacto,responsavel_id,intervencao_id").order("prazo"),
  ]);
  if(d.error||r.error) return {decisions:[],restrictions:[],source:"supabase" as const};

  return {
    source:"supabase" as const,
    decisions:(d.data||[]).map(x=>({id:x.id,titulo:x.titulo,intervencao:String(x.intervencao_id),responsavel:String(x.responsavel_id||"—"),prazo:x.prazo||"",status:x.status,risco:"atencao"})),
    restrictions:(r.data||[]).map(x=>({id:x.id,titulo:x.titulo,intervencao:String(x.intervencao_id),responsavel:String(x.responsavel_id||"—"),prazo:x.prazo||"",impacto:x.impacto||"—",status:x.status,risco:x.risco})),
  };
}

export async function getNotifications(){
  const supabase=await createClient();
  const now=new Date().toISOString();
  const [decisions,restrictions,measurements,inspections]=await Promise.all([
    supabase.from("decisoes").select("id,titulo,prazo,status").lt("prazo",now).neq("status","concluido").limit(10),
    supabase.from("restricoes").select("id,titulo,prazo,status,risco").neq("status","concluido").order("prazo").limit(10),
    supabase.from("medicoes").select("id,numero,status,created_at,intervencao_id").eq("status","aguardando").limit(10),
    supabase.from("fiscalizacoes").select("id,titulo,agendada_para,status").gte("agendada_para",now).limit(10),
  ]);

  const data:any[]=[];
  (decisions.data||[]).forEach(x=>data.push({id:"d-"+x.id,title:"Decisão técnica vencida",detail:x.titulo,when:"Prazo vencido",tone:"danger",href:"/controle"}));
  (restrictions.data||[]).forEach(x=>data.push({id:"r-"+x.id,title:"Restrição em acompanhamento",detail:x.titulo,when:x.prazo?"Prazo "+new Date(x.prazo).toLocaleDateString("pt-BR"):"Sem prazo",tone:x.risco==="critico"?"danger":"warning",href:"/controle"}));
  (measurements.data||[]).forEach(x=>data.push({id:"m-"+x.id,title:"Medição aguardando conferência",detail:"Medição "+x.numero,when:"Aguardando análise",tone:"warning",href:x.intervencao_id?"/intervencoes/"+x.intervencao_id+"/medicoes":"/intervencoes"}));
  (inspections.data||[]).forEach(x=>data.push({id:"f-"+x.id,title:"Fiscalização programada",detail:x.titulo,when:x.agendada_para?new Date(x.agendada_para).toLocaleString("pt-BR"):"Programada",tone:"info",href:"/fiscalizacoes"}));

  return {data,source:"supabase" as const};
}

export async function getAudit(filters?:{entidade?:string;q?:string}){
  const supabase=await createClient();
  let query=supabase.from("audit_log")
    .select("id,actor_id,entidade,entidade_id,acao,antes,depois,created_at")
    .order("created_at",{ascending:false})
    .limit(200);

  if(filters?.entidade && filters.entidade!=="todos") query=query.eq("entidade",filters.entidade);

  const {data,error}=await query;
  if(error) return {data:[],source:"supabase" as const};

  const actorIds=[...new Set((data||[]).map((x:any)=>x.actor_id).filter(Boolean))];
  const names=new Map<string,string>();
  if(actorIds.length){
    const {data:profiles}=await supabase.from("perfis").select("id,nome").in("id",actorIds);
    (profiles||[]).forEach((p:any)=>names.set(p.id,p.nome));
  }

  const mapped=(data||[]).map((x:any)=>({
    id:x.id,
    actor:x.actor_id ? (names.get(x.actor_id)||String(x.actor_id)) : "Sistema",
    actorId:x.actor_id||null,
    acao:x.acao,
    entidade:x.entidade,
    detail:x.entidade_id?String(x.entidade_id):"Registro alterado",
    created_at:x.created_at,
  }));

  const search=(filters?.q||"").trim().toLowerCase();
  const result=search ? mapped.filter((x:any)=>[
    x.actor,x.acao,x.entidade,x.detail
  ].join(" ").toLowerCase().includes(search)) : mapped;

  return {source:"supabase" as const,data:result};
}
