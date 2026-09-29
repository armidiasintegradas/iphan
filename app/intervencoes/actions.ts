"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
