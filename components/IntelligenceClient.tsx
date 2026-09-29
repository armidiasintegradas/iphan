"use client";

import { useState } from "react";
import { Mic, Send, Sparkles, ChevronRight } from "lucide-react";

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
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.text || "Não foi possível responder agora.",
          source: data.source,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Não foi possível consultar os dados agora." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="intelligenceHeader">
        <Sparkles className="aiMark" />
        <div>
          <h1>Inteligência</h1>
          <p>Pergunte ao sistema</p>
        </div>
      </header>

      <div className="aiInput">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(question);
          }}
          placeholder="Como posso ajudar?"
          aria-label="Pergunta para a inteligência"
        />
        <button onClick={() => ask(question)} aria-label="Enviar pergunta">
          {loading ? "…" : <Send size={20} />}
        </button>
      </div>

      {messages.length > 0 && (
        <section className="conversation">
          {messages.map((m, i) => (
            <div key={i} className={"message " + m.role}>
              <span>{m.text}</span>
              {m.role === "assistant" && m.source === "demo" && (
                <small>Dados demonstrativos</small>
              )}
              {m.role === "assistant" && m.source === "supabase" && (
                <small>Dados operacionais do sistema</small>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="questionList">
        {suggestions.map((q) => (
          <button key={q} onClick={() => ask(q)}>
            {q}
            <ChevronRight />
          </button>
        ))}
      </section>

      <p className="aiNote">
        ⓘ As respostas são baseadas nos dados disponíveis no sistema e não substituem a análise técnica do Iphan.
      </p>
    </>
  );
}
