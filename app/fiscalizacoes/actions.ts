"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { can } from "@/lib/permissions";

const value=(fd:FormData,key:string)=>String(fd.get(key)||"").trim();

export async function createInspection(fd:FormData){
  const supabase=await createClient();
  if(!supabase) redirect("/fiscalizacoes/nova?demo=1");

  const checklist={
    estrutura:fd.get("estrutura")==="on",
    cobertura:fd.get("cobertura")==="on",
    instalacoes:fd.get("instalacoes")==="on",
    incendio:fd.get("incendio")==="on",
    acessibilidade:fd.get("acessibilidade")==="on",
    conservacao:fd.get("conservacao")==="on",
  };

  const {error}=await supabase.from("fiscalizacoes").insert({
    intervencao_id:value(fd,"intervencao_id")||null,
    bem_id:value(fd,"bem_id")||null,
    titulo:value(fd,"titulo"),
    tipo:value(fd,"tipo"),
    status:"aberto",
    agendada_para:value(fd,"agendada_para")||null,
    observacoes:value(fd,"observacoes"),
    checklist,
  });

  if(error) redirect("/fiscalizacoes/nova?erro=salvar");
  redirect("/fiscalizacoes?criada=1");
}

export async function createDecision(fd:FormData){
  const supabase=await createClient();
  if(!supabase) redirect("/controle/decisao/nova?demo=1");

  const {error}=await supabase.from("decisoes").insert({
    intervencao_id:value(fd,"intervencao_id"),
    titulo:value(fd,"titulo"),
    contexto:value(fd,"contexto"),
    status:"aberto",
    prazo:value(fd,"prazo")||null,
  });
  if(error) redirect("/controle/decisao/nova?erro=salvar");
  redirect("/controle?decisao=criada");
}

export async function createRestriction(fd:FormData){
  const supabase=await createClient();
  if(!supabase) redirect("/controle/restricao/nova?demo=1");

  const {error}=await supabase.from("restricoes").insert({
    intervencao_id:value(fd,"intervencao_id"),
    titulo:value(fd,"titulo"),
    descricao:value(fd,"descricao"),
    impacto:value(fd,"impacto"),
    status:"aberto",
    risco:value(fd,"risco")||"atencao",
    prazo:value(fd,"prazo")||null,
  });
  if(error) redirect("/controle/restricao/nova?erro=salvar");
  redirect("/controle?restricao=criada");
}


export async function completeInspection(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id || !can(current.role,"inspection.write")) redirect("/fiscalizacoes?erro=permissao");

  const id=value(fd,"fiscalizacao_id");
  if(!id) redirect("/fiscalizacoes?erro=dados");

  const supabase=await createClient();
  const {error}=await supabase.from("fiscalizacoes").update({
    status:"concluido",
    realizada_em:new Date().toISOString(),
    responsavel_id:current.id,
    updated_at:new Date().toISOString(),
  }).eq("id",id).neq("status","cancelado");

  if(error) redirect("/fiscalizacoes?erro=salvar");
  redirect("/fiscalizacoes?concluida=1");
}
