import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Home,
  Landmark,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { signOut } from "@/app/auth/actions";

const groupedNav = [
  {
    label: "PAINEL",
    items: [{ href: "/", label: "Hoje", icon: Home }],
  },
  {
    label: "GESTÃO",
    items: [
      { href: "/patrimonio", label: "Patrimônio", icon: Landmark },
      { href: "/intervencoes", label: "Intervenções", icon: Wrench, badge: "7" },
      { href: "/campo", label: "Campo", icon: MapPin },
      { href: "/fiscalizacoes", label: "Fiscalizações", icon: ClipboardCheck, badge: "3" },
      { href: "/conservacao", label: "Conservação", icon: ShieldCheck },
    ],
  },
  {
    label: "OPERAÇÕES",
    items: [
      { href: "/documentos", label: "Documentos", icon: FileText },
      { href: "/inteligencia", label: "Inteligência", icon: Sparkles },
    ],
  },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "iphanBrand compact" : "iphanBrand"} aria-label="Iphan — Instituto do Patrimônio Histórico e Artístico Nacional">
      <span className="iphanBrandExact" aria-hidden="true" />
    </div>
  );
}

export default async function AppShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: string;
}) {
  const user = await getCurrentUser();
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();

  return (
    <div className="v12Shell">
      <aside className="v12Sidebar">
        <div className="v12SidebarTop">
          <Brand />

          <div className="v12ContextRow">
            <MapPin size={15} />
            <strong>Superintendência PE</strong>
            <ChevronDown size={15} />
          </div>

          <div className="v12RegionChip">
            <Landmark size={15} />
            <span>Pernambuco</span>
            <ChevronDown size={14} />
          </div>
        </div>

        <nav className="v12Nav" aria-label="Navegação principal">
          {groupedNav.map((group) => (
            <div className="v12NavGroup" key={group.label}>
              <span className="v12NavLabel">{group.label}</span>
              <div className="v12NavItems">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={active === item.href ? "v12SideLink active" : "v12SideLink"}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                      {"badge" in item && item.badge ? <b>{item.badge}</b> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="v12SidebarFooter">
          <div className="v12TerritoryCopy">
            <strong>Pernambuco</strong>
            <span>Território, memória<br />e futuro.</span>
            <i />
          </div>
          <div className="v12FooterMeta">
            <span>SIPHAN&nbsp;&nbsp;|&nbsp;&nbsp;v2.4.0</span>
            <span><i />Online</span>
          </div>
        </div>
      </aside>

      <div className="v12Main">
        <header className="v12Topbar">
          <form className="v12Search" action="/buscar" method="get">
            <Search size={17} />
            <input
              name="q"
              type="search"
              minLength={2}
              aria-label="Buscar no sistema"
              placeholder="Buscar no acervo de PE: bens, processos, intervenções ou vistorias..."
            />
            <button type="submit" aria-label="Buscar">Buscar</button>
          </form>

          <div className="v12Profile">
            <Link href="/notificacoes" className="v12Bell" aria-label="Notificações">
              <Bell size={18} />
              <i />
            </Link>
            <div className="v12Avatar">{initials || "US"}</div>
            <div className="v12ProfileCopy">
              <strong>{user.name}</strong>
              <span>{user.roleLabel} · PE</span>
            </div>
            <form action={signOut}>
              <button type="submit" className="v12Logout" aria-label="Sair" title="Sair">
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
