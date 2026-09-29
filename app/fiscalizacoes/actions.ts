"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { can } from "@/lib/permissions";

const value=(fd:FormData,key:string)=>String(fd.get(key)||"").trim();

export async function createInspection(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId || !can(current.role,"inspection.write")) redirect("/fiscalizacoes/nova?erro=permissao");
  const supabase=await createClient();
  if(!supabase) redirect("/fiscalizacoes/nova?demo=1");

  const intervencao_id=value(fd,"intervencao_id")||null;
  const bem_id=value(fd,"bem_id")||null;
  const titulo=value(fd,"titulo");
  const tipo=value(fd,"tipo");
  if(!titulo||!tipo||(!intervencao_id&&!bem_id)) redirect("/fiscalizacoes/nova?erro=dados");

  if(bem_id){
    const {data:heritage}=await supabase.from("bens_culturais").select("id,unidade_id").eq("id",bem_id).maybeSingle();
    if(!heritage||heritage.unidade_id!==current.unitId) redirect("/fiscalizacoes/nova?erro=bem");
  }
  if(intervencao_id){
    const {data:intervention}=await supabase.from("intervencoes").select("id,bens_culturais(unidade_id)").eq("id",intervencao_id).maybeSingle();
    if(!intervention||(intervention as any).bens_culturais?.unidade_id!==current.unitId) redirect("/fiscalizacoes/nova?erro=intervencao");
  }

  const checklist={
    estrutura:fd.get("estrutura")==="on",
    cobertura:fd.get("cobertura")==="on",
    instalacoes:fd.get("instalacoes")==="on",
    incendio:fd.get("incendio")==="on",
    acessibilidade:fd.get("acessibilidade")==="on",
    conservacao:fd.get("conservacao")==="on",
  };

  const {error}=await supabase.from("fiscalizacoes").insert({
    intervencao_id,
    bem_id,
    titulo,
    tipo,
    status:"aberto",
    agendada_para:value(fd,"agendada_para")||null,
    observacoes:value(fd,"observacoes"),
    checklist,
    created_by:current.id,
  });

  if(error) redirect("/fiscalizacoes/nova?erro=salvar");
  redirect("/fiscalizacoes?criada=1");
}

export async function createDecision(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId || !can(current.role,"decision.write")) redirect("/controle/decisao/nova?erro=permissao");
  const supabase=await createClient();
  if(!supabase) redirect("/controle/decisao/nova?demo=1");

  const intervencao_id=value(fd,"intervencao_id");
  const titulo=value(fd,"titulo");
  if(!intervencao_id||!titulo) redirect("/controle/decisao/nova?erro=dados");
  const {data:intervention}=await supabase.from("intervencoes").select("id,bens_culturais(unidade_id)").eq("id",intervencao_id).maybeSingle();
  if(!intervention||(intervention as any).bens_culturais?.unidade_id!==current.unitId) redirect("/controle/decisao/nova?erro=intervencao");

  const {error}=await supabase.from("decisoes").insert({
    intervencao_id,
    titulo,
    contexto:value(fd,"contexto"),
    status:"aberto",
    prazo:value(fd,"prazo")||null,
    created_by:current.id,
  });
  if(error) redirect("/controle/decisao/nova?erro=salvar");
  redirect("/controle?decisao=criada");
}

export async function createRestriction(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId || !can(current.role,"decision.write")) redirect("/controle/restricao/nova?erro=permissao");
  const supabase=await createClient();
  if(!supabase) redirect("/controle/restricao/nova?demo=1");

  const intervencao_id=value(fd,"intervencao_id");
  const titulo=value(fd,"titulo");
  if(!intervencao_id||!titulo) redirect("/controle/restricao/nova?erro=dados");
  const {data:intervention}=await supabase.from("intervencoes").select("id,bens_culturais(unidade_id)").eq("id",intervencao_id).maybeSingle();
  if(!intervention||(intervention as any).bens_culturais?.unidade_id!==current.unitId) redirect("/controle/restricao/nova?erro=intervencao");

  const {error}=await supabase.from("restricoes").insert({
    intervencao_id,
    titulo,
    descricao:value(fd,"descricao"),
    impacto:value(fd,"impacto"),
    status:"aberto",
    risco:value(fd,"risco")||"atencao",
    prazo:value(fd,"prazo")||null,
    created_by:current.id,
  });
  if(error) redirect("/controle/restricao/nova?erro=salvar");
  redirect("/controle?restricao=criada");
}


export async function completeInspection(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active || !current.unitId || !can(current.role,"inspection.write")) redirect("/fiscalizacoes?erro=permissao");

  const id=value(fd,"fiscalizacao_id");
  if(!id) redirect("/fiscalizacoes?erro=dados");

  const supabase=await createClient();
  const {data:inspection,error:inspectionError}=await supabase
    .from("fiscalizacoes")
    .select("id,bem_id,intervencao_id,bens_culturais(unidade_id),intervencoes(bens_culturais(unidade_id))")
    .eq("id",id)
    .maybeSingle();
  const unit=(inspection as any)?.bens_culturais?.unidade_id || (inspection as any)?.intervencoes?.bens_culturais?.unidade_id;
  if(inspectionError||!inspection||unit!==current.unitId) redirect("/fiscalizacoes?erro=registro");

  const {error}=await supabase.from("fiscalizacoes").update({
    status:"concluido",
    realizada_em:new Date().toISOString(),
    responsavel_id:current.id,
    updated_at:new Date().toISOString(),
  }).eq("id",id).neq("status","cancelado");

  if(error) redirect("/fiscalizacoes?erro=salvar");
  redirect("/fiscalizacoes?concluida=1");
}
