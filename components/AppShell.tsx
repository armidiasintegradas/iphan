import Link from "next/link";
import { Bell, ClipboardCheck, FileText, Home, Landmark, MapPin, Search, ShieldCheck, Sparkles, Wrench, Users, SlidersHorizontal, LogOut } from "lucide-react";
import { nav } from "@/lib/mock";
import { getCurrentUser } from "@/lib/current-user";
import { signOut } from "@/app/auth/actions";

const icons:any = { home:Home, landmark:Landmark, wrench:Wrench, mapPin:MapPin, clipboard:ClipboardCheck, shield:ShieldCheck, file:FileText, sparkles:Sparkles, users:Users, sliders:SlidersHorizontal };

export function Brand(){
  return <div className="brandLockup neutralBrand" aria-label="Sistema de Gestão da Preservação">
    <span className="brandWord">Sistema de Gestão</span>
    <span className="brandFull">DA PRESERVAÇÃO<br/><small>Iphan · Pernambuco</small></span>
  </div>;
}

export default async function AppShell({ children, active }: { children: React.ReactNode; active: string }){
  const user=await getCurrentUser();
  const visibleNav=nav.filter(item=>item.href!=="/administracao/usuarios" || ["admin","gestor"].includes(user.role));
  const initials=user.name.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase();

  return <div className="appShell">
    <aside className="sidebar">
      <Brand/>
      <nav className="sideNav">
        {visibleNav.map(item=>{ const Icon=icons[item.icon]; return <Link href={item.href} key={item.href} className={active===item.href?"sideLink active":"sideLink"}><Icon size={18}/><span>{item.label}</span></Link> })}
      </nav>
      <div className="sidebarArt">
        <div className="lineArt"/>
        <strong>Pernambuco</strong><span>Território, memória<br/>e futuro.</span>
      </div>
    </aside>
    <div className="mainArea">
      <header className="topHeader">
        <div className="searchBox"><Search size={18}/><span>Buscar bens, intervenções, documentos...</span></div>
        <div className="profile">
          <Link href="/notificacoes" className="iconBtn" aria-label="Notificações"><Bell size={19}/><i/></Link>
          <div className="avatar">{initials || "US"}</div>
          <div><strong>{user.name}</strong><span>{user.roleLabel}</span></div>
          <form action={signOut}><button type="submit" className="logoutBtn" aria-label="Sair" title="Sair"><LogOut size={17}/></button></form>
        </div>
      </header>
      {children}
    </div>
  </div>
}
