import { NextRequest, NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/data";

const demo = {
  bens: 42,
  intervencoes: 18,
  ocorrencias: 7,
  decisoes: 7,
};

function answer(question: string, summary: typeof demo, source: "demo" | "supabase") {
  const q = question.toLowerCase();

  if (q.includes("atenção") || q.includes("atencao")) {
    return {
      text: `Há quatro frentes principais de atenção: decisões pendentes, intervenções com desvio físico, ocorrências abertas e fiscalizações próximas. No recorte atual há ${summary.decisoes} decisões pendentes e ${summary.ocorrencias} ocorrências que exigem acompanhamento.`,
      source,
    };
  }

  if (q.includes("atrasad") || q.includes("desvio")) {
    return {
      text: "A intervenção demonstrativa da Igreja Matriz apresenta execução de 64% frente a 72% planejados, um desvio de -8 p.p. As principais restrições cadastradas estão relacionadas a estrutura, instalações e proteção de elementos artísticos.",
      source,
    };
  }

  if (q.includes("decis") && q.includes("venc")) {
    return {
      text: `O painel registra ${summary.decisoes} decisões pendentes. Na demonstração, quatro estão vencidas e devem ser priorizadas pela coordenação responsável.`,
      source,
    };
  }

  if (q.includes("resumo") || q.includes("reuni")) {
    return {
      text: `Resumo executivo: ${summary.bens} bens acompanhados, ${summary.intervencoes} intervenções em execução, ${summary.decisoes} decisões pendentes e ${summary.ocorrencias} ocorrências em acompanhamento. Recomenda-se abrir a intervenção com maior desvio e revisar as decisões vencidas antes da reunião.`,
      source,
    };
  }

  if (q.includes("quant") || q.includes("bens") || q.includes("interven")) {
    return {
      text: `O recorte atual contém ${summary.bens} bens acompanhados e ${summary.intervencoes} intervenções em execução.`,
      source,
    };
  }

  return {
    text: "Posso consultar bens culturais, intervenções, pendências, decisões, fiscalizações e resumos operacionais. Reformule a pergunta indicando o patrimônio, a intervenção ou o tipo de informação desejado.",
    source,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const question = String(body?.question || "").trim();

  if (!question) {
    return NextResponse.json({ error: "Pergunta obrigatória." }, { status: 400 });
  }

  const realSummary = await getDashboardSummary();
  const source = realSummary ? "supabase" : "demo";
  const summary = realSummary || demo;

  return NextResponse.json(answer(question, summary, source));
}
