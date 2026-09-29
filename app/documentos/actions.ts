"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { can } from "@/lib/permissions";

function value(fd:FormData,key:string){
  return String(fd.get(key)||"").trim();
}
function cleanFileName(name:string){
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-").replace(/^-+|-+$/g,"");
}

export async function uploadDocument(fd:FormData){
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId || !can(current.role,"document.write")) redirect("/documentos/novo?erro=permissao");

  const supabase=await createClient();
  const file=fd.get("arquivo");

  const contexto=value(fd,"contexto");
  const titulo=value(fd,"titulo");
  const sistema_origem=value(fd,"sistema_origem")||"Interno";
  const referencia_externa=value(fd,"referencia_externa")||null;
  const bem_id=value(fd,"bem_id")||null;
  const intervencao_id=value(fd,"intervencao_id")||null;

  if(!contexto || !titulo || (!bem_id && !intervencao_id)){
    redirect("/documentos/novo?erro=dados");
  }
  if(!(file instanceof File) || !file.size){
    redirect("/documentos/novo?erro=arquivo");
  }

  if(bem_id){
    const {data:heritage}=await supabase.from("bens_culturais")
      .select("id,unidade_id").eq("id",bem_id).maybeSingle();
    if(!heritage || heritage.unidade_id!==current.unitId){
      redirect("/documentos/novo?erro=bem");
    }
  }

  if(intervencao_id){
    const {data:intervention}=await supabase.from("intervencoes")
      .select("id,bem_id,bens_culturais(unidade_id)")
      .eq("id",intervencao_id).maybeSingle();
    if(!intervention || (intervention as any).bens_culturais?.unidade_id!==current.unitId){
      redirect("/documentos/novo?erro=intervencao");
    }
  }

  const storage_path=[current.unitId,"documentos",Date.now()+"-"+cleanFileName(file.name||"arquivo")].join("/");
  const {error:uploadError}=await supabase.storage.from("documentos").upload(storage_path,file,{
    contentType:file.type || "application/octet-stream",
    upsert:false,
  });
  if(uploadError) redirect("/documentos/novo?erro=upload");

  const {error}=await supabase.from("documentos").insert({
    contexto,
    titulo,
    sistema_origem,
    referencia_externa,
    bem_id,
    intervencao_id,
    storage_path,
    metadata:{
      original_name:file.name,
      size:file.size,
      mime:file.type,
    },
    created_by:current.id,
  });

  if(error){
    await supabase.storage.from("documentos").remove([storage_path]);
    redirect("/documentos/novo?erro=salvar");
  }

  redirect("/documentos?criado=1");
}
