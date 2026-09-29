"use client";

import { useState } from "react";
import { Mic, Send, Sparkles, ChevronRight, ShieldCheck } from "lucide-react";

const suggestions = [
  "O que precisa da minha atenção hoje?",
  "Quais intervenções estão atrasadas?",
  "Por que a obra da igreja matriz está atrasada?",
  "Quais decisões estão vencidas?",
  "Prepare o resumo da reunião.",
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
    <div className="approvedIntelligence">
      <header className="intelligenceHeader approvedIntelligenceHeader">
        <div className="aiMark"><Sparkles size={20}/></div>
        <div>
          <p>INTELLIGENCE</p>
          <h1>Pergunte ao sistema</h1>
          <span>Contexto operacional do patrimônio, em linguagem natural.</span>
        </div>
      </header>

      <div className="aiInput approvedAiInput">
        <Mic size={19} className="aiMic"/>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") ask(question); }}
          placeholder="Pergunte sobre obras, bens, prazos ou decisões"
          aria-label="Pergunta para a inteligência"
        />
        <button onClick={() => ask(question)} aria-label="Enviar pergunta">{loading ? "…" : <Send size={18} />}</button>
      </div>

      {messages.length > 0 && (
        <section className="conversation approvedConversation">
          {messages.map((m, i) => (
            <div key={i} className={"message " + m.role}>
              <span>{m.text}</span>
              {m.role === "assistant" && m.source === "demo" && <small>Dados demonstrativos</small>}
              {m.role === "assistant" && m.source === "supabase" && <small>Dados operacionais do sistema</small>}
            </div>
          ))}
        </section>
      )}

      <section className="questionList approvedQuestionList">
        <p>SUGESTÕES</p>
        {suggestions.map((q) => (
          <button key={q} onClick={() => ask(q)}>
            <span>{q}</span>
            <ChevronRight />
          </button>
        ))}
      </section>

      <div className="aiTrustNote">
        <ShieldCheck size={17}/>
        <p>As respostas usam os dados disponíveis no sistema e apoiam a análise técnica — não substituem decisões institucionais.</p>
      </div>
    </div>
  );
}
