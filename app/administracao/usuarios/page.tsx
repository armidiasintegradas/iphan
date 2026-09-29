import AppShell from "@/components/AppShell";
import { permissionMatrix, roleLabels, type Role } from "@/lib/permissions";

const users:{name:string;email:string;role:Role;unit:string;status:string}[]=[
  {name:"Alex Ribeiro",email:"alex@iphan.gov.br",role:"coordenador",unit:"Pernambuco",status:"Ativo"},
  {name:"Mariana Souza",email:"mariana@iphan.gov.br",role:"fiscal",unit:"Pernambuco",status:"Ativo"},
  {name:"Carlos Mendes",email:"carlos@iphan.gov.br",role:"tecnico",unit:"Pernambuco",status:"Ativo"},
  {name:"Equipe Executora",email:"obra@contratada.com.br",role:"executor",unit:"Intervenção autorizada",status:"Ativo"},
];

export default function Page(){
  const roles=Object.keys(roleLabels) as Role[];
  return <AppShell active=""><main className="pageWrap">
    <div className="pageHead"><div><small>Administração</small><h1>Usuários e permissões</h1><p>Controle de acesso por função e unidade institucional.</p></div><button className="primaryAction">+ Convidar usuário</button></div>
    <section className="panel tablePanel">
      <div className="dataTable usersTable">
        <div className="tr head"><span>Usuário</span><span>Perfil</span><span>Unidade / Escopo</span><span>Status</span></div>
        {users.map(u=><div className="tr" key={u.email}><span><strong>{u.name}</strong><small>{u.email}</small></span><span>{roleLabels[u.role]}</span><span>{u.unit}</span><span className="status regular"><i/>{u.status}</span></div>)}
      </div>
    </section>
    <div className="sectionTitle"><h2>Matriz de permissões</h2></div>
    <div className="permissionGrid">{roles.map(role=><article className="panel permissionCard" key={role}><h3>{roleLabels[role]}</h3><p>{permissionMatrix[role].length} permissões habilitadas</p><div>{permissionMatrix[role].map(p=><span key={p}>✓ {p}</span>)}</div></article>)}</div>
  </main></AppShell>
}
