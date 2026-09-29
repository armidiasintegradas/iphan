"use server";

import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

const value=(fd:FormData,key:string)=>String(fd.get(key)||"").trim();
const allowedStates=["regular","atencao","risco","critico"];

export async function createConservationInspection(fd:FormData){
  const supabase=await createClient();
  if(!supabase) redirect("/conservacao/nova?demo=1");

  const bem_id=value(fd,"bem_id");
  const categoria=value(fd,"categoria");
  const estado=value(fd,"estado")||"regular";
  const observacoes=value(fd,"observacoes");
  const inspecionada_em=value(fd,"inspecionada_em")||new Date().toISOString();
  const proxima_inspecao=value(fd,"proxima_inspecao")||null;

  if(!bem_id||!categoria||!allowedStates.includes(estado)){
    redirect("/conservacao/nova?erro=dados");
  }
  if(proxima_inspecao && proxima_inspecao < inspecionada_em.slice(0,10)){
    redirect("/conservacao/nova?erro=periodo");
  }

  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");

  const {data:heritage,error:heritageError}=await supabase
    .from("bens_culturais").select("id").eq("id",bem_id).maybeSingle();
  if(heritageError||!heritage) redirect("/conservacao/nova?erro=bem");

  const {error}=await supabase.from("inspecoes_conservacao").insert({
    bem_id,
    categoria,
    estado,
    observacoes,
    inspecionada_em,
    proxima_inspecao,
    responsavel_id:user.id,
  });
  if(error) redirect("/conservacao/nova?erro=salvar");

  await supabase.from("bens_culturais").update({
    risco:estado,
    updated_at:new Date().toISOString(),
  }).eq("id",bem_id);

  redirect("/conservacao?inspecao=criada");
}
