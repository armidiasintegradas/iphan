"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  CircleCheck,
  Clock3,
  Layers3,
  Map,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import styles from "./IntelligenceClient.module.css";

const suggestions = [
  "Quais bens precisam de atenção esta semana?",
  "Quais intervenções estão mais atrasadas?",
  "Onde estão concentradas as ocorrências críticas?",
  "Quais decisões estão próximas do prazo?",
];

const insights = [
  {
    tone: "danger" as const,
    kicker: "ATENÇÃO",
    icon: AlertTriangle,
    title: "Três intervenções combinam atraso físico e ocorrências críticas.",
    meta: "Intervenções · atualizado hoje",
    href: "/intervencoes",
  },
  {
    tone: "warning" as const,
    kicker: "PRAZO",
    icon: Clock3,
    title: "Quatro decisões técnicas vencem nos próximos 7 dias.",
    meta: "Controle · próximos vencimentos",
    href: "/controle",
  },
  {
    tone: "success" as const,
    kicker: "TENDÊNCIA POSITIVA",
    icon: TrendingDown,
    title: "Ocorrências críticas caíram 18% em relação ao período anterior.",
    meta: "Fiscalizações · últimos 30 dias",
    href: "/fiscalizacoes",
  },
];

const priorities = [
  { rank: "01", title: "Sé de Olinda", reason: "Decisão técnica vencida há 3 dias", tags: "Risco alto · decisão pendente · intervenção ativa", href: "/controle" },
  { rank: "02", title: "Forte das Cinco Pontas", reason: "Fiscalização pendente e risco acima da média", tags: "Fiscalização · conservação · Recife", href: "/fiscalizacoes" },
  { rank: "03", title: "Igreja Matriz do Corpo Santo", reason: "Atraso físico associado a ocorrência crítica", tags: "Intervenção · cronograma · atenção", href: "/intervencoes" },
  { rank: "04", title: "Conjunto Histórico de Igarassu", reason: "Tendência recente de deterioração", tags: "Conservação · inspeções · tendência", href: "/conservacao" },
];

type Message = {
  role: "user" | "assistant";
  text: string;
  source?: "demo" | "supabase";
};

export default function IntelligenceClient() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("/api/inteligencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.text || "Não foi possível responder agora.", source: data.source }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Não foi possível consultar os dados agora." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.eyebrow}><BrainCircuit size={15}/> INTELIGÊNCIA TERRITORIAL</div>
          <h1>Inteligência</h1>
          <p>Análises, padrões e sinais para apoiar decisões sobre o patrimônio de Pernambuco.</p>
        </div>
        <div className={styles.period}>
          <span>PERÍODO ANALISADO</span>
          <strong>Últimos 30 dias</strong>
          <small>Atualizado hoje</small>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overviewMain}>
          <div className={styles.sectionLabel}>SITUAÇÃO DA REDE PATRIMONIAL</div>
          <div className={styles.bigNumber}>124 <span>bens monitorados</span></div>
          <div className={styles.miniMetrics}>
            <div><strong>12</strong><span>exigem atenção</span></div>
            <div><strong>4</strong><span>situação crítica</span></div>
            <div><strong>8</strong><span>intervenções com desvio</span></div>
            <div><strong>6</strong><span>decisões próximas do prazo</span></div>
          </div>
        </div>
        <div className={styles.scoreCard}>
          <div className={styles.scoreHead}><span>ÍNDICE GERAL DE ATENÇÃO</span><TrendingUp size={16}/></div>
          <div className={styles.score}><strong>72</strong><span>/100</span></div>
          <div className={styles.scoreTrack}><i /></div>
          <div className={styles.scoreFooter}><b>Estável</b><span>+3 pontos nos últimos 30 dias</span></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><Sparkles size={17}/><h2>O sistema identificou</h2></div>
          <span>3 sinais relevantes</span>
        </div>
        <div className={styles.insights}>
          {insights.map((item) => {
            const Icon = item.icon;
            const toneClass = item.tone === "danger" ? styles.danger : item.tone === "warning" ? styles.warning : styles.success;
            return (
              <Link key={item.title} href={item.href} className={`${styles.insight} ${toneClass}`}>
                <div className={styles.insightIcon}><Icon size={18}/></div>
                <div>
                  <small>{item.kicker}</small>
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
                <ChevronRight size={17}/>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.mapPriorityGrid}>
        <article className={styles.mapCard}>
          <div className={styles.cardHead}>
            <div><Map size={18}/><div><h2>Mapa de inteligência territorial</h2><p>Concentração de sinais por município.</p></div></div>
            <button type="button">Risco</button>
          </div>
          <div className={styles.mapVisual}>
            <div className={styles.mapGlow} />
            <i className={styles.pin1}>5</i>
            <i className={styles.pin2}>3</i>
            <i className={styles.pin3}>2</i>
            <i className={styles.pin4}>4</i>
            <div className={styles.mapCallout}>
              <small>RECIFE</small>
              <strong>26 bens monitorados</strong>
              <span>5 exigem atenção · 2 intervenções atrasadas</span>
              <p>Principal sinal: concentração de ocorrências relacionadas à umidade na área central.</p>
            </div>
          </div>
          <div className={styles.mapLegend}><span><i/>Regular</span><span><i/>Atenção</span><span><i/>Crítico</span></div>
        </article>

        <article className={styles.priorityCard}>
          <div className={styles.cardHead}>
            <div><Layers3 size={18}/><div><h2>Onde agir primeiro</h2><p>Prioridades recomendadas agora.</p></div></div>
          </div>
          <div className={styles.priorityList}>
            {priorities.map((item) => (
              <Link href={item.href} key={item.rank} className={styles.priorityRow}>
                <b>{item.rank}</b>
                <div><strong>{item.title}</strong><span>{item.reason}</span><small>{item.tags}</small></div>
                <ArrowRight size={16}/>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><BarChart3 size={17}/><h2>Tendências</h2></div>
          <span>últimos 12 meses</span>
        </div>
        <div className={styles.trendGrid}>
          <article><span>ESTADO DE CONSERVAÇÃO</span><strong>+6%</strong><div className={styles.sparkBars}>{[32,40,37,46,52,49,57,61,65,63,70,74].map((v,i)=><i key={i} style={{height:v+"%"}}/>)}</div><small>melhora no índice médio</small></article>
          <article><span>INTERVENÇÕES</span><strong>84%</strong><div className={styles.dualLine}><i/><b/></div><small>execução real frente ao planejado</small></article>
          <article><span>OCORRÊNCIAS</span><strong>-18%</strong><div className={styles.sparkBars}>{[74,68,72,64,58,61,52,49,45,43,39,34].map((v,i)=><i key={i} style={{height:v+"%"}}/>)}</div><small>críticas no período</small></article>
        </div>
      </section>

      <section className={styles.patternGrid}>
        <article>
          <small>PADRÃO DETECTADO</small>
          <h3>Umidade e infiltração</h3>
          <p>Ocorrências relacionadas à umidade aumentam no período chuvoso e se concentram em bens da faixa litorânea.</p>
          <span>Base: 86 registros · últimos 12 meses</span>
        </article>
        <article>
          <small>PADRÃO DETECTADO</small>
          <h3>Cronograma e restrições</h3>
          <p>Intervenções com restrições abertas apresentam maior desvio entre avanço planejado e avanço real.</p>
          <span>Base: 17 intervenções · últimos 12 meses</span>
        </article>
        <article>
          <small>PADRÃO DETECTADO</small>
          <h3>Fiscalização preventiva</h3>
          <p>Bens fiscalizados nos últimos 90 dias apresentam menor volume de ocorrências críticas ainda abertas.</p>
          <span>Base: 41 fiscalizações · últimos 12 meses</span>
        </article>
      </section>

      <section className={styles.askSection}>
        <div className={styles.askHeader}>
          <div><Sparkles size={18}/><div><h2>Pergunte aos seus dados</h2><p>Consulte patrimônio, intervenções, fiscalizações, prazos e riscos em linguagem natural.</p></div></div>
          <div className={styles.trust}><ShieldCheck size={15}/> Respostas baseadas nos dados do sistema</div>
        </div>

        <div className={styles.askInput}>
          <Mic size={18}/>
          <input value={question} onChange={(e)=>setQuestion(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter") ask(question)}} placeholder="Pergunte sobre o patrimônio de Pernambuco..." />
          <button type="button" onClick={()=>ask(question)}>{loading ? "…" : <Send size={17}/>}</button>
        </div>

        <div className={styles.suggestions}>
          {suggestions.map((q)=><button type="button" key={q} onClick={()=>ask(q)}>{q}</button>)}
        </div>

        {messages.length > 0 && (
          <div className={styles.conversation}>
            {messages.map((m,i)=>(
              <div key={i} className={m.role==="user"?styles.userMessage:styles.aiMessage}>
                <span>{m.text}</span>
                {m.role==="assistant" && <small>{m.source==="supabase" ? "Dados operacionais do sistema" : "Resposta de apoio à análise técnica"}</small>}
              </div>
            ))}
          </div>
        )}

        <div className={styles.disclaimer}><CircleCheck size={14}/> A inteligência apoia a análise técnica e não substitui decisões institucionais.</div>
      </section>
    </div>
  );
}
