"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { can } from "@/lib/permissions";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}
function ensureCurrent(current:Awaited<ReturnType<typeof getCurrentUser>>,permission:"heritage.write"|"intervention.write"|"field.write",fallback:string){
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId) redirect(fallback+"?erro=unidade");
  if(!can(current.role,permission)) redirect(fallback+"?erro=permissao");
}

export async function createHeritage(formData: FormData) {
  const current=await getCurrentUser();
  ensureCurrent(current,"heritage.write","/patrimonio/novo");

  const supabase = await createClient();
  if (!supabase) redirect("/patrimonio/novo?demo=1");

  const nome = value(formData, "nome");
  const municipio = value(formData, "municipio");
  const uf = (value(formData, "uf") || "PE").toUpperCase();
  const tipologia = value(formData, "tipologia");
  const nivel_protecao = value(formData, "nivel_protecao");

  if(!nome||!municipio||uf.length!==2||!tipologia||!nivel_protecao){
    redirect("/patrimonio/novo?erro=dados");
  }

  const { data, error } = await supabase.from("bens_culturais").insert({
    unidade_id: current.unitId,
    nome,
    municipio,
    uf,
    tipologia,
    nivel_protecao,
    created_by:current.id,
  }).select("id").single();

  if (error || !data?.id) redirect("/patrimonio/novo?erro=salvar");
  redirect("/patrimonio/" + data.id);
}

export async function createIntervention(formData: FormData) {
  const current=await getCurrentUser();
  ensureCurrent(current,"intervention.write","/intervencoes/nova");

  const supabase = await createClient();
  if (!supabase) redirect("/intervencoes/nova?demo=1");

  const bem_id = value(formData, "bem_id");
  const titulo = value(formData, "titulo");
  const descricao = value(formData, "descricao");
  const inicio_previsto = value(formData, "inicio_previsto") || null;
  const fim_previsto = value(formData, "fim_previsto") || null;

  if(!bem_id||!titulo) redirect("/intervencoes/nova?erro=dados");
  if(inicio_previsto&&fim_previsto&&fim_previsto<inicio_previsto) redirect("/intervencoes/nova?erro=periodo");

  const {data:heritage,error:heritageError}=await supabase
    .from("bens_culturais")
    .select("id,unidade_id")
    .eq("id",bem_id)
    .maybeSingle();

  if(heritageError||!heritage||heritage.unidade_id!==current.unitId){
    redirect("/intervencoes/nova?erro=bem");
  }

  const { data, error } = await supabase.from("intervencoes").insert({
    bem_id,
    titulo,
    descricao,
    inicio_previsto,
    fim_previsto,
    status: "em_andamento",
    created_by:current.id,
  }).select("id").single();

  if (error || !data?.id) redirect("/intervencoes/nova?erro=salvar");
  redirect("/intervencoes/" + data.id);
}

export async function createOccurrence(formData: FormData) {
  const current=await getCurrentUser();
  ensureCurrent(current,"field.write","/campo/ocorrencia");

  const supabase = await createClient();
  if (!supabase) redirect("/campo/ocorrencia?demo=1");

  const intervencao_id = value(formData, "intervencao_id");
  const titulo = value(formData, "titulo");
  const descricao = value(formData, "descricao");
  const categoria = value(formData, "categoria");
  const prazo = value(formData, "prazo") || null;

  if(!intervencao_id||!titulo||!categoria) redirect("/campo/ocorrencia?erro=dados");

  const {data:intervention,error:interventionError}=await supabase
    .from("intervencoes")
    .select("id,bens_culturais(unidade_id)")
    .eq("id",intervencao_id)
    .maybeSingle();

  if(interventionError||!intervention||(intervention as any).bens_culturais?.unidade_id!==current.unitId){
    redirect("/campo/ocorrencia?erro=intervencao");
  }

  const { error } = await supabase.from("ocorrencias").insert({
    intervencao_id,
    titulo,
    descricao,
    categoria,
    prazo,
    status: "aberto",
    risco: "atencao",
    created_by:current.id,
  });

  if (error) redirect("/campo/ocorrencia?erro=salvar");
  redirect("/campo?ocorrencia=criada");
}
