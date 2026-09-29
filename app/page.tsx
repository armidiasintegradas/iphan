import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileClock,
  Landmark,
  Map,
  Mic,
  Search,
  ShieldCheck,
} from "lucide-react";

const attention = [
  {
    title: "Decisões técnicas vencidas",
    detail: "2 decisões aguardam análise há mais de 5 dias.",
    tone: "critical",
    icon: FileClock,
  },
  {
    title: "Intervenção com desvio físico",
    detail: "Execução 64% · Planejado 72% · Desvio −8 p.p.",
    tone: "warning",
    icon: AlertTriangle,
  },
  {
    title: "Medição aguardando conferência",
    detail: "Medição 08 está há 4 dias sem validação.",
    tone: "neutral",
    icon: ClipboardCheck,
  },
];

const metrics = [
  ["18", "ações acompanhadas"],
  ["7", "intervenções em execução"],
  ["3", "decisões pendentes"],
  ["2", "situações de risco"],
];

const nav = [
  ["Hoje", CalendarDays],
  ["Patrimônio", Landmark],
  ["Intervenções", Building2],
  ["Campo", ClipboardCheck],
  ["Controle", ShieldCheck],
  ["Conservação", CheckCircle2],
  ["Documentos", FileClock],
];

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">I</div>
          <div>
            <strong>IPHAN OS</strong>
            <span>Beta 01 · Pernambuco</span>
          </div>
        </div>

        <nav className="nav">
          {nav.map(([label, Icon], index) => (
            <button className={index === 0 ? "navItem active" : "navItem"} key={label as string}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label as string}</span>
            </button>
          ))}
        </nav>

        <div className="intelligence">
          <div className="intelligenceIcon"><Mic size={18} /></div>
          <div>
            <strong>Intelligence</strong>
            <span>Pergunte sobre o patrimônio</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div className="crumb">Superintendência de Pernambuco</div>
          <div className="topActions">
            <button className="iconButton" aria-label="Pesquisar"><Search size={19} /></button>
            <button className="iconButton" aria-label="Notificações"><Bell size={19} /></button>
            <div className="avatar">AR</div>
          </div>
        </header>

        <div className="page">
          <section className="hero">
            <p className="eyebrow">HOJE · VISÃO EXECUTIVA</p>
            <h1>Boa noite.</h1>
            <p className="subtitle">Há <strong>4 situações</strong> que precisam da sua atenção.</p>
          </section>

          <section className="metrics">
            {metrics.map(([value, label]) => (
              <article className="metric" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </section>

          <section className="grid">
            <div className="mainColumn">
              <div className="sectionHeading">
                <div>
                  <p className="eyebrow">PRIORIDADES</p>
                  <h2>Precisa de atenção</h2>
                </div>
                <button className="textButton">Ver tudo <ChevronRight size={16} /></button>
              </div>

              <div className="attentionList">
                {attention.map(({ title, detail, tone, icon: Icon }) => (
                  <article className="attentionCard" key={title}>
                    <div className={`statusIcon ${tone}`}><Icon size={19} /></div>
                    <div className="attentionText">
                      <strong>{title}</strong>
                      <span>{detail}</span>
                    </div>
                    <ChevronRight className="chevron" size={18} />
                  </article>
                ))}
              </div>
            </div>

            <aside className="sideColumn">
              <div className="mapCard">
                <div className="cardTitle">
                  <div>
                    <p className="eyebrow">TERRITÓRIO</p>
                    <h3>Pernambuco</h3>
                  </div>
                  <Map size={20} />
                </div>
                <div className="mapPlaceholder">
                  <div className="mapDot d1" />
                  <div className="mapDot d2" />
                  <div className="mapDot d3" />
                  <div className="mapDot d4" />
                  <span>Mapa operacional</span>
                </div>
                <div className="mapLegend">
                  <span><i className="ok" /> Regular</span>
                  <span><i className="warn" /> Atenção</span>
                  <span><i className="risk" /> Crítico</span>
                </div>
              </div>

              <div className="agendaCard">
                <p className="eyebrow">AGENDA</p>
                <h3>Próximas ações</h3>
                <div className="agendaItem">
                  <span className="time">09:00</span>
                  <div><strong>Fiscalização</strong><span>Centro histórico</span></div>
                </div>
                <div className="agendaItem">
                  <span className="time">14:00</span>
                  <div><strong>Reunião de obra</strong><span>Intervenção em andamento</span></div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
