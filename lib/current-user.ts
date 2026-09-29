import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/permissions";

export type CurrentUser = {
  id: string | null;
  name: string;
  email: string | null;
  role: Role;
  roleLabel: string;
  isDemo: boolean;
};

const roleLabels: Record<Role,string> = {
  admin:"Administrador institucional",
  gestor:"Superintendente / Gestor",
  coordenador:"Coordenador",
  fiscal:"Fiscal",
  tecnico:"Técnico",
  executor:"Executor / Contratada",
  consulta:"Consulta",
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      id:null,
      name:"Alex Ribeiro",
      email:null,
      role:"coordenador",
      roleLabel:"Coordenador",
      isDemo:true,
    };
  }

  const {data:{user}} = await supabase.auth.getUser();
  if (!user) {
    return {
      id:null,
      name:"Usuário",
      email:null,
      role:"consulta",
      roleLabel:"Consulta",
      isDemo:false,
    };
  }

  const {data:profile} = await supabase
    .from("perfis")
    .select("nome,role")
    .eq("id",user.id)
    .maybeSingle();

  const role=(profile?.role || "consulta") as Role;

  return {
    id:user.id,
    name:profile?.nome || user.email?.split("@")[0] || "Usuário",
    email:user.email || null,
    role,
    roleLabel:roleLabels[role],
    isDemo:false,
  };
}
