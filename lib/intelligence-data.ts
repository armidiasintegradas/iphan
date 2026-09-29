import {createClient} from "@/lib/supabase/server";

export async function getIntelligenceContext(){
  const supabase=await createClient();
  const now=new Date().toISOString();

  const [
    heritage,
    interventions,
    decisions,
    restrictions,
    measurements,
    fiscalizations,
    conservation,
    documents,
    occurrences,
  ]=await Promise.all([
    supabase.from("bens_culturais").select("id,nome,municipio,uf,risco"),
    supabase.from("intervencoes").select("id,titulo,status,risco,avanco_planejado,avanco_real,fim_previsto,bens_culturais(nome,municipio,uf)").order("updated_at",{ascending:false}),
    supabase.from("decisoes").select("id,titulo,status,prazo,intervencao_id,intervencoes(titulo)").neq("status","concluido").order("prazo"),
    supabase.from("restricoes").select("id,titulo,status,risco,prazo,impacto,intervencao_id,intervencoes(titulo)").neq("status","concluido").order("prazo"),
    supabase.from("medicoes").select("id,numero,status,percentual,intervencao_id,intervencoes(titulo)").order("created_at",{ascending:false}),
    supabase.from("fiscalizacoes").select("id,titulo,status,agendada_para,realizada_em,bem_id,intervencao_id").order("agendada_para",{ascending:true}),
    supabase.from("inspecoes_conservacao").select("id,bem_id,categoria,estado,proxima_inspecao,bens_culturais(nome)").order("proxima_inspecao",{ascending:true}),
    supabase.from("documentos").select("id,contexto,titulo,sistema_origem,created_at"),
    supabase.from("ocorrencias").select("id,titulo,status,risco,prazo,intervencao_id").in("status",["aberto","aguardando","em_andamento"]).order("prazo"),
  ]);

  const interventionRows=(interventions.data||[]).map((x:any)=>({
    id:x.id,
    title:x.titulo,
    status:x.status,
    risk:x.risco,
    planned:Number(x.avanco_planejado||0),
    actual:Number(x.avanco_real||0),
    end:x.fim_previsto||null,
    heritage:x.bens_culturais?.nome||"",
    city:[x.bens_culturais?.municipio,x.bens_culturais?.uf].filter(Boolean).join(", "),
  }));

  return {
    now,
    heritage:heritage.data||[],
    interventions:interventionRows,
    decisions:decisions.data||[],
    restrictions:restrictions.data||[],
    measurements:measurements.data||[],
    fiscalizations:fiscalizations.data||[],
    conservation:conservation.data||[],
    documents:documents.data||[],
    occurrences:occurrences.data||[],
  };
}
