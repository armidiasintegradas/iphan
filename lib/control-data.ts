import { createClient } from "@/lib/supabase/server";

export const demoDecisions = [
  {id:"dec-041",titulo:"Definição de solução para impermeabilização",intervencao:"Igreja Matriz de Olinda",responsavel:"Carlos Mendes",prazo:"2026-09-26",status:"aberto",risco:"critico"},
  {id:"dec-042",titulo:"Compatibilização da instalação elétrica",intervencao:"Igreja Matriz de Olinda",responsavel:"Mariana Souza",prazo:"2026-10-02",status:"aguardando",risco:"atencao"},
  {id:"dec-043",titulo:"Tratamento de peça estrutural",intervencao:"Conjunto do Carmo",responsavel:"Equipe Técnica",prazo:"2026-10-05",status:"aberto",risco:"atencao"},
];

export const demoRestrictions = [
  {id:"rest-027",titulo:"Reforço da estrutura da torre",intervencao:"Igreja Matriz de Olinda",responsavel:"Carlos Mendes",prazo:"2026-10-03",impacto:"3 serviços · 11 dias potenciais",status:"aberto",risco:"critico"},
  {id:"rest-028",titulo:"Compatibilização das instalações",intervencao:"Igreja Matriz de Olinda",responsavel:"Mariana Souza",prazo:"2026-10-08",impacto:"2 serviços · 5 dias potenciais",status:"aguardando",risco:"atencao"},
];

export const demoNotifications = [
  {id:"n1",title:"Decisão técnica vencida",detail:"DEC-041 · Impermeabilização",when:"Vencida há 3 dias",tone:"danger",href:"/controle"},
  {id:"n2",title:"Medição aguardando conferência",detail:"Medição 03 · Igreja Matriz",when:"Há 4 dias",tone:"warning",href:"/intervencoes/restauro-matriz/medicoes"},
  {id:"n3",title:"Fiscalização programada",detail:"Igreja Matriz de Olinda",when:"Amanhã · 09:00",tone:"info",href:"/fiscalizacoes"},
  {id:"n4",title:"Restrição com impacto em prazo",detail:"REST-027 · Estrutura da torre",when:"Prazo em 5 dias",tone:"danger",href:"/controle"},
];

export const demoAudit = [
  {id:1,actor:"Alex Ribeiro",acao:"Atualizou intervenção",entidade:"intervencoes",detail:"Avanço executado: 61% → 64%",created_at:"2026-09-28T18:42:00"},
  {id:2,actor:"Mariana Souza",acao:"Registrou evidência",entidade:"evidencias",detail:"Fachada oeste · Durante",created_at:"2026-09-28T16:22:00"},
  {id:3,actor:"Carlos Mendes",acao:"Criou decisão",entidade:"decisoes",detail:"DEC-041 · Impermeabilização",created_at:"2026-09-28T14:08:00"},
  {id:4,actor:"Sistema",acao:"Sinalizou prazo vencido",entidade:"decisoes",detail:"DEC-041",created_at:"2026-09-28T08:00:00"},
];

export async function getControlData(){
  const supabase=await createClient();
  if(!supabase) return {decisions:demoDecisions,restrictions:demoRestrictions,source:"demo" as const};

  const [d,r]=await Promise.all([
    supabase.from("decisoes").select("id,titulo,status,prazo,responsavel_id,intervencao_id").order("prazo"),
    supabase.from("restricoes").select("id,titulo,status,risco,prazo,impacto,responsavel_id,intervencao_id").order("prazo"),
  ]);
  if(d.error||r.error) return {decisions:demoDecisions,restrictions:demoRestrictions,source:"demo" as const};

  return {
    source:"supabase" as const,
    decisions:(d.data||[]).map(x=>({id:x.id,titulo:x.titulo,intervencao:String(x.intervencao_id),responsavel:String(x.responsavel_id||"—"),prazo:x.prazo||"",status:x.status,risco:"atencao"})),
    restrictions:(r.data||[]).map(x=>({id:x.id,titulo:x.titulo,intervencao:String(x.intervencao_id),responsavel:String(x.responsavel_id||"—"),prazo:x.prazo||"",impacto:x.impacto||"—",status:x.status,risco:x.risco})),
  };
}

export async function getNotifications(){
  const supabase=await createClient();
  if(!supabase) return {data:demoNotifications,source:"demo" as const};

  const now=new Date().toISOString();
  const [decisions,restrictions,measurements,inspections]=await Promise.all([
    supabase.from("decisoes").select("id,titulo,prazo,status").lt("prazo",now).neq("status","concluido").limit(10),
    supabase.from("restricoes").select("id,titulo,prazo,status,risco").neq("status","concluido").order("prazo").limit(10),
    supabase.from("medicoes").select("id,numero,status,created_at").eq("status","aguardando").limit(10),
    supabase.from("fiscalizacoes").select("id,titulo,agendada_para,status").gte("agendada_para",now).limit(10),
  ]);

  const data:any[]=[];
  (decisions.data||[]).forEach(x=>data.push({id:"d-"+x.id,title:"Decisão técnica vencida",detail:x.titulo,when:"Prazo vencido",tone:"danger",href:"/controle"}));
  (restrictions.data||[]).forEach(x=>data.push({id:"r-"+x.id,title:"Restrição em acompanhamento",detail:x.titulo,when:x.prazo?"Prazo "+new Date(x.prazo).toLocaleDateString("pt-BR"):"Sem prazo",tone:x.risco==="critico"?"danger":"warning",href:"/controle"}));
  (measurements.data||[]).forEach(x=>data.push({id:"m-"+x.id,title:"Medição aguardando conferência",detail:"Medição "+x.numero,when:"Aguardando análise",tone:"warning",href:"/intervencoes"}));
  (inspections.data||[]).forEach(x=>data.push({id:"f-"+x.id,title:"Fiscalização programada",detail:x.titulo,when:x.agendada_para?new Date(x.agendada_para).toLocaleString("pt-BR"):"Programada",tone:"info",href:"/fiscalizacoes"}));

  return {data:data.length?data:demoNotifications,source:data.length?"supabase" as const:"demo" as const};
}

export async function getAudit(){
  const supabase=await createClient();
  if(!supabase) return {data:demoAudit,source:"demo" as const};

  const {data,error}=await supabase.from("audit_log").select("id,actor_id,entidade,entidade_id,acao,antes,depois,created_at").order("created_at",{ascending:false}).limit(100);
  if(error||!data?.length) return {data:demoAudit,source:"demo" as const};
  return {source:"supabase" as const,data:data.map(x=>({
    id:x.id,actor:String(x.actor_id||"Sistema"),acao:x.acao,entidade:x.entidade,
    detail:x.entidade_id?String(x.entidade_id):"Registro alterado",created_at:x.created_at
  }))};
}
