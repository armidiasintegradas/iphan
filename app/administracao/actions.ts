"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import type { Role } from "@/lib/permissions";

const allowedRoles:Role[]=["admin","gestor","coordenador","fiscal","tecnico","executor","consulta"];

export async function updateProfileRole(formData:FormData){
  const current=await getCurrentUser();
  if(!current.id || !["admin","gestor"].includes(current.role)) redirect("/");

  const profileId=String(formData.get("profile_id")||"");
  const role=String(formData.get("role")||"") as Role;

  if(!profileId || !allowedRoles.includes(role)) {
    redirect("/administracao/usuarios?erro=dados");
  }

  if(profileId===current.id && role!==current.role){
    redirect("/administracao/usuarios?erro=proprio-perfil");
  }

  const supabase=await createClient();
  const {error}=await supabase
    .from("perfis")
    .update({role,updated_at:new Date().toISOString()})
    .eq("id",profileId);

  if(error) redirect("/administracao/usuarios?erro=salvar");
  redirect("/administracao/usuarios?salvo=1");
}
