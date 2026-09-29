"use server";

import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {getCurrentUser} from "@/lib/current-user";
import {can} from "@/lib/permissions";

const value=(fd:FormData,key:string)=>String(fd.get(key)||"").trim();
const allowedStates=["regular","atencao","risco","critico"];

export async function createConservationInspection(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id || !can(current.role,"inspection.write")) redirect("/conservacao/nova?erro=permissao");

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

  const {error}=await supabase.rpc("create_conservation_inspection",{
    p_bem_id:bem_id,
    p_categoria:categoria,
    p_estado:estado,
    p_observacoes:observacoes||null,
    p_inspecionada_em:inspecionada_em,
    p_proxima_inspecao:proxima_inspecao,
  });

  if(error) redirect("/conservacao/nova?erro=salvar");
  redirect("/conservacao?inspecao=criada");
}
