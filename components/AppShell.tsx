import Link from "next/link";
import { Bell, ClipboardCheck, FileText, Home, Landmark, MapPin, Search, ShieldCheck, Sparkles, Wrench, Users } from "lucide-react";
import { nav } from "@/lib/mock";

const icons:any = { home:Home, landmark:Landmark, wrench:Wrench, mapPin:MapPin, clipboard:ClipboardCheck, shield:ShieldCheck, file:FileText, sparkles:Sparkles, users:Users };

export function Brand(){
  return <div className="brandLockup" aria-label="Iphan"><span className="brandSymbol">⌂</span><span className="brandWord">IPHAN</span><span className="brandFull">INSTITUTO DO<br/>PATRIMÔNIO HISTÓRICO E<br/>ARTÍSTICO NACIONAL</span></div>;
}

export default function AppShell({ children, active }: { children: React.ReactNode; active: string }){
  return <div className="appShell">
    <aside className="sidebar">
      <Brand/>
      <nav className="sideNav">
        {nav.map(item=>{ const Icon=icons[item.icon]; return <Link href={item.href} key={item.href} className={active===item.href?"sideLink active":"sideLink"}><Icon size={18}/><span>{item.label}</span></Link> })}
      </nav>
      <div className="sidebarArt">
        <div className="lineArt"/>
        <strong>Pernambuco</strong><span>Território, memória<br/>e futuro.</span>
      </div>
    </aside>
    <div className="mainArea">
      <header className="topHeader">
        <div className="searchBox"><Search size={18}/><span>Buscar bens, intervenções, documentos...</span></div>
        <div className="profile"><button className="iconBtn"><Bell size={19}/><i/></button><div className="avatar">AR</div><div><strong>Alex Ribeiro</strong><span>Coordenador</span></div></div>
      </header>
      {children}
    </div>
  </div>
}
