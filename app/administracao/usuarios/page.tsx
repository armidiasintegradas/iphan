import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { permissionMatrix, roleLabels, type Role } from "@/lib/permissions";
import { getCurrentUser, getProfiles } from "@/lib/current-user";
import { updateProfileRole } from "@/app/administracao/actions";

export default async function Page({
  searchParams,
}:{
  searchParams:Promise<Record<string,string|undefined>>;
}){
  const q=await searchParams;
  const current=await getCurrentUser();
  if(!["admin","gestor"].includes(current.role)) redirect("/");

  const users=await getProfiles();
  const roles=Object.keys(roleLabels) as Role[];

  return <AppShell active="/administracao/usuarios"><main className="pageWrap">
    <div className="pageHead">
      <div><small>Administração</small><h1>Usuários e permissões</h1><p>Controle de acesso por função e unidade institucional.</p></div>
      <div className="headActions"><a href="/administracao/auditoria" className="secondaryAction">Ver auditoria</a></div>
    </div>

    {q.salvo&&<div className="formNotice">Perfil atualizado com sucesso.</div>}
    {q.erro&&<div className="formNotice error">Não foi possível atualizar o perfil. {q.erro==="proprio-perfil"?"Seu próprio perfil não pode ser alterado por esta tela.":""}</div>}

    <section className="panel tablePanel">
      <div className="adminHint">Novos usuários entram pelo link público <b>/cadastro</b> e recebem o perfil Consulta até serem promovidos por um gestor.</div>
      <div className="dataTable usersTable">
        <div className="tr head"><span>Usuário</span><span>Perfil</span><span>Unidade / Escopo</span><span>Status</span></div>
        {users.length ? users.map((u:any)=><div className="tr" key={u.id}>
          <span><strong>{u.name}</strong><small>{u.id===current.id?"Você · "+(current.email||"usuário autenticado"):"Cadastrado no sistema"}</small></span>
          <span>
            {u.id===current.id
              ? <b>{roleLabels[u.role as Role]}</b>
              : <form action={updateProfileRole} className="roleForm">
                  <input type="hidden" name="profile_id" value={u.id}/>
                  <select name="role" defaultValue={u.role}>
                    {roles.map(role=><option value={role} key={role}>{roleLabels[role]}</option>)}
                  </select>
                  <button type="submit">Salvar</button>
                </form>
            }
          </span>
          <span>{u.unit}{u.uf?" · "+u.uf:""}</span>
          <span className={"status "+(u.active?"regular":"danger")}><i/>{u.active?"Ativo":"Inativo"}</span>
        </div>) : <div className="emptyState">Nenhum perfil cadastrado.</div>}
      </div>
    </section>

    <div className="sectionTitle"><h2>Matriz de permissões</h2></div>
    <div className="permissionGrid">{roles.map(role=><article className="panel permissionCard" key={role}><h3>{roleLabels[role]}</h3><p>{permissionMatrix[role].length} permissões habilitadas</p><div>{permissionMatrix[role].map(p=><span key={p}>✓ {p}</span>)}</div></article>)}</div>
  </main></AppShell>
}
