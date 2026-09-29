"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(fd:FormData,key:string){
  return String(fd.get(key)||"").trim();
}

function cleanFileName(name:string){
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
}

export async function uploadDocument(fd:FormData){
  const supabase=await createClient();
  const file=fd.get("arquivo");

  const contexto=value(fd,"contexto");
  const titulo=value(fd,"titulo");
  const sistema_origem=value(fd,"sistema_origem")||null;
  const referencia_externa=value(fd,"referencia_externa")||null;
  const bem_id=value(fd,"bem_id")||null;
  const intervencao_id=value(fd,"intervencao_id")||null;

  if(!contexto || !titulo || (!bem_id && !intervencao_id)){
    redirect("/documentos/novo?erro=dados");
  }

  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");

  let storage_path:string|null=null;
  let metadata:any={};

  if(file instanceof File && file.size){
    const scope=intervencao_id || bem_id || "geral";
    const path=[scope,Date.now()+"-"+cleanFileName(file.name)].join("/");

    const {error:uploadError}=await supabase.storage.from("documentos").upload(path,file,{
      contentType:file.type || "application/octet-stream",
      upsert:false,
    });

    if(uploadError) redirect("/documentos/novo?erro=upload");

    storage_path=path;
    metadata={
      original_name:file.name,
      size:file.size,
      mime:file.type,
    };
  }

  const {error}=await supabase.from("documentos").insert({
    contexto,
    titulo,
    sistema_origem,
    referencia_externa,
    bem_id,
    intervencao_id,
    storage_path,
    metadata,
    created_by:user.id,
  });

  if(error){
    if(storage_path){
      await supabase.storage.from("documentos").remove([storage_path]);
    }
    redirect("/documentos/novo?erro=salvar");
  }

  redirect("/documentos?criado=1");
}
