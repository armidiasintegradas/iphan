import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/permissions";

export type CurrentUser = {
  id: string | null;
  name: string;
  email: string | null;
  role: Role;
  roleLabel: string;
  isDemo: boolean;
  unitId: string | null;
  active: boolean;
};

const roleLabels: Record<Role,string> = {
  admin:"Superadministrador",
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
      unitId:null,
      active:true,
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
      unitId:null,
      active:false,
    };
  }

  const {data:profile} = await supabase
    .from("perfis")
    .select("nome,role,unidade_id,ativo")
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
    unitId:profile?.unidade_id || null,
    active:profile?.ativo !== false,
  };
}


export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfis")
    .select("id,nome,role,ativo,created_at,updated_at,unidades(nome,uf)")
    .order("nome");

  if (error) return [];

  return (data || []).map((item:any) => ({
    id: item.id,
    name: item.nome,
    role: item.role as Role,
    active: item.ativo,
    unit: item.unidades?.nome || "Unidade não informada",
    uf: item.unidades?.uf || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}
