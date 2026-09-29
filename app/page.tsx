import AppShell from "@/components/AppShell";
import DashboardMap from "@/components/DashboardMap";
import { getDashboardSummary, getHeritage } from "@/lib/data";
import { getNotifications } from "@/lib/control-data";
import { getCurrentUser } from "@/lib/current-user";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CircleCheck,
  Clock3,
  Landmark,
  ShieldCheck,
  Sun,
  Wrench,
} from "lucide-react";

const priorityCards = [
  {
    image: "/visual/priority-decisao.webp",
    eyebrow: "URGÊNCIA MÁXIMA",
    tone: "critical",
    status: "Decisão técnica pendente",
    title: "Processo IPH-PE-2024-017",
    description: "Restauro de fachadas e estabilização de cornijas da Sé de Olinda.",
    deadline: "Vencida há 3 dias",
    action: "Emitir Despacho",
    href: "/controle",
  },
  {
    image: "/visual/field-thumb-01.webp",
    eyebrow: "DESVIO DE CRONOGRAMA",
    tone: "warning",
    status: "Intervenção com desvio",
    title: "Obra Igreja Matriz do Corpo Santo",
    description: "Atraso na entrega de madeiramento certificado para continuidade da obra.",
    deadline: "+ 3 p.p. do plano",
    action: "Ajustar RDO",
    href: "/intervencoes",
  },
  {
    image: "/visual/field-thumb-02.webp",
    eyebrow: "MEDIÇÃO TÉCNICA",
    tone: "neutral",
    status: "Conferência pendente",
    title: "3ª Medição Global de Obras",
    description: "Boletim físico-financeiro submetido pela construtora para análise.",
    deadline: "Prazo em 5 dias",
    action: "Validar Itens",
    href: "/intervencoes",
  },
  {
    image: "/visual/priority-fiscalizacao.webp",
    eyebrow: "VISTORIA IN LOCO",
    tone: "info",
    status: "Fiscalização programada",
    title: "Forte das Cinco Pontas",
    description: "Inspeção semestral de cantarias históricas e efeito de maresia.",
    deadline: "Amanhã, 08:00",
    action: "Ver Roteiro",
    href: "/fiscalizacoes",
  },
];


const fallbackMapPoints = [
  { id:"demo-olinda", name:"Igreja Matriz de Olinda", city:"Olinda, PE", municipality:"Olinda", lat:-7.9908, lng:-34.8416, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-recife-1", name:"Forte das Cinco Pontas", city:"Recife, PE", municipality:"Recife", lat:-8.0712, lng:-34.8804, risk:"Crítico", image:"/visual/priority-fiscalizacao.webp" },
  { id:"demo-recife-2", name:"Igreja da Várzea", city:"Recife, PE", municipality:"Recife", lat:-8.0507, lng:-34.9601, risk:"Atenção", image:"/visual/priority-decisao.webp" },
  { id:"demo-igarassu", name:"Conjunto Histórico de Igarassu", city:"Igarassu, PE", municipality:"Igarassu", lat:-7.8344, lng:-34.9064, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-goiana", name:"Centro Histórico de Goiana", city:"Goiana, PE", municipality:"Goiana", lat:-7.5606, lng:-35.0026, risk:"Atenção", image:"/visual/priority-decisao.webp" },
  { id:"demo-vitoria", name:"Patrimônio de Vitória", city:"Vitória de Santo Antão, PE", municipality:"Vitória de Santo Antão", lat:-8.1187, lng:-35.2914, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-gravata", name:"Patrimônio de Gravatá", city:"Gravatá, PE", municipality:"Gravatá", lat:-8.2011, lng:-35.5641, risk:"Sem dado", image:"/visual/priority-decisao.webp" },
  { id:"demo-caruaru", name:"Conjunto Cultural de Caruaru", city:"Caruaru, PE", municipality:"Caruaru", lat:-8.2846, lng:-35.9702, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-palmares", name:"Patrimônio de Palmares", city:"Palmares, PE", municipality:"Palmares", lat:-8.6842, lng:-35.5890, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-tamandare", name:"Patrimônio Costeiro", city:"Tamandaré, PE", municipality:"Tamandaré", lat:-8.7592, lng:-35.1047, risk:"Atenção", image:"/visual/priority-fiscalizacao.webp" },
  { id:"demo-garanhuns", name:"Patrimônio de Garanhuns", city:"Garanhuns, PE", municipality:"Garanhuns", lat:-8.8820, lng:-36.4960, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-arcoverde", name:"Patrimônio de Arcoverde", city:"Arcoverde, PE", municipality:"Arcoverde", lat:-8.4189, lng:-37.0538, risk:"Atenção", image:"/visual/priority-decisao.webp" },
  { id:"demo-afogados", name:"Patrimônio do Pajeú", city:"Afogados da Ingazeira, PE", municipality:"Afogados da Ingazeira", lat:-7.7507, lng:-37.6393, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-triunfo", name:"Conjunto Histórico de Triunfo", city:"Triunfo, PE", municipality:"Triunfo", lat:-7.8379, lng:-38.1035, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-serra", name:"Patrimônio de Serra Talhada", city:"Serra Talhada, PE", municipality:"Serra Talhada", lat:-7.9815, lng:-38.2893, risk:"Crítico", image:"/visual/priority-decisao.webp" },
  { id:"demo-salgueiro", name:"Patrimônio de Salgueiro", city:"Salgueiro, PE", municipality:"Salgueiro", lat:-8.0742, lng:-39.1247, risk:"Regular", image:"/visual/priority-decisao.webp" },
  { id:"demo-ouricuri", name:"Patrimônio de Ouricuri", city:"Ouricuri, PE", municipality:"Ouricuri", lat:-7.8792, lng:-40.0813, risk:"Sem dado", image:"/visual/priority-decisao.webp" },
  { id:"demo-petrolina", name:"Patrimônio de Petrolina", city:"Petrolina, PE", municipality:"Petrolina", lat:-9.3891, lng:-40.5031, risk:"Crítico", image:"/visual/priority-decisao.webp" },
];

function greeting(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function Page() {
  const [summary, heritageResult, notifications, current] = await Promise.all([
    getDashboardSummary(),
    getHeritage(),
    getNotifications(),
    getCurrentUser(),
  ]);

  const now = new Date();
  const localDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Recife" }),
  );
  const firstName = current.name.split(" ")[0] || "Usuário";

  const dateLong = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(now);

  const day = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    day: "2-digit",
  }).format(now);

  const month = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    month: "short",
  })
    .format(now)
    .replace(".", "")
    .toUpperCase();

  const mapPoints = heritageResult.data
    .filter((h: any) => h.lat !== null && h.lng !== null)
    .map((h: any) => ({
      ...h,
      lat: Number(h.lat),
      lng: Number(h.lng),
      image: undefined,
    }));

  const displayMapPoints = mapPoints.length ? mapPoints : fallbackMapPoints;
  const displayMapCount = summary.intervencoes || fallbackMapPoints.length;

  const notificationData = notifications.data.slice(0, 4);
  const agendaFallback = [
    {
      title: "Fiscalização – Igreja da Várzea",
      detail: "Recife, PE · Equipe Técnica 02",
      tone: "regular",
      href: "/fiscalizacoes",
    },
    {
      title: "Reunião de alinhamento de obra",
      detail: "Sítio Histórico de Olinda · Sala Virtual",
      tone: "regular",
      href: "/intervencoes",
    },
    {
      title: "Análise de documentação técnica",
      detail: "Processo IPH-PE-2024-112",
      tone: "neutral",
      href: "/documentos",
    },
    {
      title: "Vencimento de decisão técnica",
      detail: "Processo IPH-PE-2024-017",
      tone: "critical",
      href: "/controle",
    },
  ];

  const agenda = agendaFallback.map((fallback, index) => {
    const item = notificationData[index];
    return item
      ? {
          title: item.title,
          detail: item.detail,
          tone:
            item.tone === "danger"
              ? "critical"
              : item.tone === "warning"
                ? "warning"
                : item.tone === "info"
                  ? "info"
                  : "regular",
          href: item.href || fallback.href,
        }
      : fallback;
  });

  const critical = notificationData.find((item: any) => item.tone === "danger");

  return (
    <AppShell active="/">
      <main className="v12Dashboard">
        <section className="v12Hero">
          <div>
            <span className="v12Kicker">● SUPERINTENDÊNCIA DO IPHAN EM PERNAMBUCO</span>
            <h1>{greeting(localDate.getHours())}, {firstName}.</h1>
            <p>O patrimônio de Pernambuco em movimento.</p>
          </div>

          <div className="v12HeroTools">
            <div className="v12DateWidget">
              <CalendarDays size={17} />
              <div>
                <strong>{dateLong}</strong>
                <span>4 ações ativas hoje</span>
              </div>
              <b>{day}<small>{month}</small></b>
            </div>

            <div className="v12FieldWidget">
              <Sun size={18} />
              <div>
                <strong>Clima local</strong>
                <span>Recife / Olinda · apoio ao campo</span>
              </div>
            </div>
          </div>
        </section>

        <section className="v12MetricGrid">
          <article className="v12MetricCard green">
            <div className="v12MetricTop"><span>PATRIMÔNIO</span><i><Landmark size={15} /></i></div>
            <div className="v12MetricValue"><strong>{summary.bens}</strong><span>bens monitorados</span></div>
            <div className="v12MetricBottom"><b>↑ 12% vs. mês anterior</b><span>Meta: 100%</span></div>
          </article>

          <article className="v12MetricCard amber">
            <div className="v12MetricTop"><span>INTERVENÇÕES</span><i><Wrench size={15} /></i></div>
            <div className="v12MetricValue"><strong>{summary.intervencoes}</strong><span>em execução</span></div>
            <div className="v12MetricBottom"><b>3 com desvio físico</b><span>15 regulares</span></div>
          </article>

          <article className="v12MetricCard red">
            <div className="v12MetricTop"><span>DECISÕES</span><i><Clock3 size={15} /></i></div>
            <div className="v12MetricValue"><strong>{summary.decisoes}</strong><span>decisões pendentes</span></div>
            <div className="v12MetricBottom"><b>4 vencidas</b><span>3 a vencer</span></div>
          </article>

          <article className="v12MetricCard blue">
            <div className="v12MetricTop"><span>FISCALIZAÇÕES</span><i><ShieldCheck size={15} /></i></div>
            <div className="v12MetricValue"><strong>{summary.fiscalizacoes}</strong><span>no prazo estipulado</span></div>
            <div className="v12MetricBottom"><b>1 crítica</b><span>2 em atenção</span></div>
          </article>
        </section>

        <section className="v12PrioritySection">
          <div className="v12SectionHead">
            <div><h2>PRIORIDADES DO DIA</h2><span>4 itens de ação</span></div>
            <Link href="/notificacoes">Ver todas as prioridades →</Link>
          </div>

          <div className="v12PriorityGrid">
            {priorityCards.map((card) => (
              <article className={`v12PriorityCard ${card.tone}`} key={card.title}>
                <div
                  className="v12PriorityImage"
                  style={{ backgroundImage: `url("${card.image}")` }}
                >
                  <span>{card.eyebrow}</span>
                </div>
                <div className="v12PriorityContent">
                  <small>{card.status}</small>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className="v12PriorityAction">
                    <b>{card.deadline}</b>
                    <Link href={card.href}>{card.action}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="v12LowerGrid">
          <DashboardMap points={displayMapPoints} activeCount={displayMapCount} />

          <aside className="v12AgendaCard">
            <div className="v12AgendaHead">
              <div>
                <h2>Agenda Diária</h2>
                <p>Compromissos e prazos de salvaguarda de hoje.</p>
              </div>
              <Link href="/controle">Ver completa →</Link>
            </div>

            <div className="v12CriticalAlert">
              <AlertTriangle size={19} />
              <div>
                <strong>AVISO CRÍTICO DE PROCESSO</strong>
                <span>{critical?.detail || "Processo IPH-PE-2024-017 aguarda ratificação final para evitar paralisação preventiva."}</span>
              </div>
              <b>Hoje 16:30</b>
            </div>

            <div className="v12Timeline">
              {agenda.map((item, index) => {
                const time = ["09:00", "11:30", "14:00", "16:30"][index];
                const label =
                  index === 0 ? "Em campo" :
                  index === 1 ? "Online" :
                  index === 2 ? "Gabinete" : "Crítica";

                return (
                  <Link
                    href={item.href}
                    key={time + item.title}
                    className={`v12AgendaRow ${item.tone}`}
                  >
                    <time>{time}</time>
                    <i />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <em>{label}</em>
                  </Link>
                );
              })}
            </div>

            <footer className="v12AgendaFooter">
              <span><CircleCheck size={14} />Sincronizado com Microsoft Teams &amp; SEI</span>
              <Link href="/controle">+ Novo Agendamento</Link>
            </footer>
          </aside>
        </section>
      </main>
    </AppShell>
  );
}
