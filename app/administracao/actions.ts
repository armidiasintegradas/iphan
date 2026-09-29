"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import type { Role } from "@/lib/permissions";

const allowedRoles:Role[]=["admin","gestor","coordenador","fiscal","tecnico","executor","consulta"];

async function targetProfile(profileId:string){
  const supabase=await createClient();
  const {data,error}=await supabase.from("perfis")
    .select("id,role,ativo,unidade_id")
    .eq("id",profileId)
    .maybeSingle();
  return {supabase,target:data,error};
}

export async function updateProfileRole(formData:FormData){
  const current=await getCurrentUser();
  if(!current.id || !current.active || !current.unitId || !["admin","gestor"].includes(current.role)) redirect("/");

  const profileId=String(formData.get("profile_id")||"");
  const role=String(formData.get("role")||"") as Role;
  if(!profileId || !allowedRoles.includes(role)) redirect("/administracao/usuarios?erro=dados");
  if(profileId===current.id && role!==current.role) redirect("/administracao/usuarios?erro=proprio-perfil");

  const {supabase,target,error:targetError}=await targetProfile(profileId);
  if(targetError || !target || target.unidade_id!==current.unitId) redirect("/administracao/usuarios?erro=escopo");

  if(current.role!=="admin" && (role==="admin" || target.role==="admin")){
    redirect("/administracao/usuarios?erro=admin");
  }

  const {error}=await supabase.from("perfis")
    .update({role,updated_at:new Date().toISOString()})
    .eq("id",profileId);

  if(error) redirect("/administracao/usuarios?erro=salvar");
  redirect("/administracao/usuarios?salvo=1");
}

export async function toggleProfileActive(formData:FormData){
  const current=await getCurrentUser();
  if(!current.id || !current.active || !current.unitId || !["admin","gestor"].includes(current.role)) redirect("/");

  const profileId=String(formData.get("profile_id")||"");
  const nextActive=String(formData.get("ativo")||"")==="true";
  if(!profileId) redirect("/administracao/usuarios?erro=dados");
  if(profileId===current.id && !nextActive) redirect("/administracao/usuarios?erro=proprio-status");

  const {supabase,target,error:targetError}=await targetProfile(profileId);
  if(targetError || !target || target.unidade_id!==current.unitId) redirect("/administracao/usuarios?erro=escopo");
  if(current.role!=="admin" && target.role==="admin") redirect("/administracao/usuarios?erro=admin");

  const {error}=await supabase.from("perfis")
    .update({ativo:nextActive,updated_at:new Date().toISOString()})
    .eq("id",profileId);

  if(error) redirect("/administracao/usuarios?erro=salvar");
  redirect("/administracao/usuarios?salvo=1");
}
