"use server";

import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {getCurrentUser} from "@/lib/current-user";
import {can} from "@/lib/permissions";

const value=(fd:FormData,key:string)=>String(fd.get(key)||"").trim();

export async function closeControlItem(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id || !can(current.role,"decision.write")) redirect("/controle?erro=permissao");

  const id=value(fd,"id");
  const kind=value(fd,"kind");
  if(!id || !["decision","restriction"].includes(kind)) redirect("/controle?erro=dados");

  const supabase=await createClient();
  if(kind==="decision"){
    const {error}=await supabase.from("decisoes").update({
      status:"concluido",
      responsavel_id:current.id,
      decidido_em:new Date().toISOString(),
      updated_at:new Date().toISOString(),
    }).eq("id",id);
    if(error) redirect("/controle?erro=salvar");
    redirect("/controle?decisao=concluida");
  }

  const {error}=await supabase.from("restricoes").update({
    status:"concluido",
    responsavel_id:current.id,
    encerrada_em:new Date().toISOString(),
    updated_at:new Date().toISOString(),
  }).eq("id",id);
  if(error) redirect("/controle?erro=salvar");
  redirect("/controle?restricao=concluida");
}
