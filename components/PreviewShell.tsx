import Link from "next/link";
import {Home,Landmark,Wrench,ClipboardCheck,ShieldCheck,FileText,Sparkles,MapPin} from "lucide-react";

const items=[
  ["/preview/hoje","Hoje",Home],
  ["/preview/patrimonio","Patrimônio",Landmark],
  ["/preview/intervencao","Cockpit",Wrench],
  ["/preview/fiscalizacoes","Fiscalizações",ClipboardCheck],
  ["/preview/conservacao","Conservação",ShieldCheck],
  ["/preview/documentos","Documentos",FileText],
  ["/preview/campo","Campo",MapPin],
  ["/preview/inteligencia","Inteligência",Sparkles],
];

export default function PreviewShell({children,active}:{children:React.ReactNode;active?:string}){
  return <div className="previewShell">
    <aside className="previewSidebar">
      <Link href="/preview" className="previewBrand" aria-label="Voltar ao índice"><span/></Link>
      <nav>{items.map(([href,label,Icon]:any)=><Link key={href} href={href} className={active===href?"active":""}><Icon/><span>{label}</span></Link>)}</nav>
      <div className="previewModeBadge">PREVIEW LOCAL</div>
    </aside>
    <div className="previewMain">
      <header className="previewHeader"><span>Revisão visual · sem dados reais</span><Link href="/preview/login">Ver Login</Link></header>
      {children}
    </div>
  </div>;
}
