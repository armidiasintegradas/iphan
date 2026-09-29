import {redirect} from "next/navigation";
import {getCurrentUser} from "@/lib/current-user";
import {can, type Permission} from "@/lib/permissions";

export async function requirePermission(permission:Permission,fallback="/"){
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId) redirect("/?erro=unidade");
  if(!can(current.role,permission)) redirect(fallback+(fallback.includes("?")?"&":"?")+"erro=permissao");
  return current;
}
