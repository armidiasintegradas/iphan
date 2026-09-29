"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { can } from "@/lib/permissions";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
function numberValue(formData:FormData,key:string){
  const raw=text(formData,key).replace(",",".");
  return raw==="" ? NaN : Number(raw);
}
function validPercent(value:number){
  return Number.isFinite(value) && value>=0 && value<=100;
}

export async function createScheduleItem(formData: FormData) {
  const supabase = await createClient();
  const intervencao_id = text(formData, "intervencao_id");
  if (!intervencao_id) redirect("/intervencoes?erro=intervencao");
  if (!supabase) redirect(`/intervencoes/${intervencao_id}/cronograma/novo?demo=1`);

  const titulo=text(formData,"titulo");
  const inicio_previsto=text(formData,"inicio_previsto")||null;
  const fim_previsto=text(formData,"fim_previsto")||null;
  const percentual_planejado=numberValue(formData,"percentual_planejado");
  const percentual_executado=numberValue(formData,"percentual_executado");

  if(!titulo) redirect(`/intervencoes/${intervencao_id}/cronograma/novo?erro=titulo`);
  if(!validPercent(percentual_planejado)||!validPercent(percentual_executado)){
    redirect(`/intervencoes/${intervencao_id}/cronograma/novo?erro=percentual`);
  }
  if(inicio_previsto&&fim_previsto&&fim_previsto<inicio_previsto){
    redirect(`/intervencoes/${intervencao_id}/cronograma/novo?erro=periodo`);
  }

  const {error:interventionError}=await supabase.from("intervencoes").select("id").eq("id",intervencao_id).maybeSingle();
  if(interventionError) redirect(`/intervencoes/${intervencao_id}/cronograma/novo?erro=intervencao`);

  const { error } = await supabase.from("cronograma_itens").insert({
    intervencao_id,
    titulo,
    inicio_previsto,
    fim_previsto,
    percentual_planejado,
    percentual_executado,
  });

  if (error) redirect(`/intervencoes/${intervencao_id}/cronograma/novo?erro=salvar`);
  redirect(`/intervencoes/${intervencao_id}/cronograma?criado=1`);
}

export async function createMeasurement(formData: FormData) {
  const supabase = await createClient();
  const intervencao_id = text(formData, "intervencao_id");
  if(!intervencao_id) redirect("/intervencoes?erro=intervencao");
  if (!supabase) redirect(`/intervencoes/${intervencao_id}/medicoes/nova?demo=1`);

  const numero=numberValue(formData,"numero");
  const referencia=text(formData,"referencia");
  const valor=numberValue(formData,"valor");
  const percentual=numberValue(formData,"percentual");

  if(!Number.isInteger(numero)||numero<1||!referencia||!Number.isFinite(valor)||valor<0||!validPercent(percentual)){
    redirect(`/intervencoes/${intervencao_id}/medicoes/nova?erro=dados`);
  }

  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");

  const { error } = await supabase.from("medicoes").insert({
    intervencao_id,
    numero,
    referencia,
    valor,
    percentual,
    status: "aguardando",
    created_by:user.id,
  });

  if (error?.code==="23505") redirect(`/intervencoes/${intervencao_id}/medicoes/nova?erro=duplicada`);
  if (error) redirect(`/intervencoes/${intervencao_id}/medicoes/nova?erro=salvar`);
  redirect(`/intervencoes/${intervencao_id}/medicoes?criada=1`);
}


export async function reviewMeasurement(formData:FormData){
  const current=await getCurrentUser();
  const intervencao_id=text(formData,"intervencao_id");
  const medicao_id=text(formData,"medicao_id");
  const decision=text(formData,"decision");

  if(!current.id || !can(current.role,"measurement.approve")) {
    redirect(`/intervencoes/${intervencao_id}/medicoes?erro=permissao`);
  }
  if(!intervencao_id||!medicao_id||!["approve","reject"].includes(decision)){
    redirect(`/intervencoes/${intervencao_id}/medicoes?erro=dados`);
  }

  const supabase=await createClient();
  const {data:measurement,error:findError}=await supabase
    .from("medicoes")
    .select("id,status,intervencao_id,intervencoes(bens_culturais(unidade_id))")
    .eq("id",medicao_id)
    .maybeSingle();

  if(findError||!measurement||measurement.intervencao_id!==intervencao_id||
    (measurement as any).intervencoes?.bens_culturais?.unidade_id!==current.unitId){
    redirect(`/intervencoes/${intervencao_id}/medicoes?erro=medicao`);
  }
  if(measurement.status==="concluido"){
    redirect(`/intervencoes/${intervencao_id}/medicoes?erro=concluida`);
  }

  const status=decision==="approve" ? "concluido" : "cancelado";
  const {error}=await supabase.from("medicoes").update({
    status,
    conferida_por:current.id,
    conferida_em:new Date().toISOString(),
    updated_at:new Date().toISOString(),
  }).eq("id",medicao_id);

  if(error) redirect(`/intervencoes/${intervencao_id}/medicoes?erro=salvar`);
  redirect(`/intervencoes/${intervencao_id}/medicoes?${decision==="approve"?"aprovada":"rejeitada"}=1`);
}
