import { NextRequest, NextResponse } from "next/server";
import { getDashboardSummary, getInterventionsPortfolio } from "@/lib/data";

function answer(question: string, summary: any, delayed: any[]) {
  const q = question.toLowerCase();

  if (q.includes("atenção") || q.includes("atencao")) {
    return {
      text: `Há quatro frentes principais de atenção: decisões pendentes, intervenções com desvio físico, ocorrências abertas e fiscalizações próximas. No recorte atual há ${summary.decisoes} decisões pendentes e ${summary.ocorrencias} ocorrências que exigem acompanhamento.`,
      source: "supabase",
    };
  }

  if (q.includes("atrasad") || q.includes("desvio")) {
    return {
      text: delayed.length
        ? "Intervenções abaixo do planejado: " + delayed.slice(0,5).map((item:any) => item.title + " — " + item.actual + "% executado / " + item.planned + "% planejado").join("; ") + "."
        : "Não há intervenções com execução abaixo do planejado nos registros atuais.",
      source: "supabase",
    };
  }

  if (q.includes("decis") && q.includes("venc")) {
    return {
      text: `O sistema registra ${summary.decisoes} decisões pendentes. Consulte Controle para verificar prazos e responsáveis.`,
      source: "supabase",
    };
  }

  if (q.includes("resumo") || q.includes("reuni")) {
    return {
      text: `Resumo executivo: ${summary.bens} bens acompanhados, ${summary.intervencoes} intervenções em execução, ${summary.decisoes} decisões pendentes e ${summary.ocorrencias} ocorrências em acompanhamento.${delayed.length ? " Há " + delayed.length + " intervenção(ões) abaixo do planejado." : ""}`,
      source: "supabase",
    };
  }

  if (q.includes("quant") || q.includes("bens") || q.includes("interven")) {
    return {
      text: `O recorte atual contém ${summary.bens} bens acompanhados e ${summary.intervencoes} intervenções em execução.`,
      source: "supabase",
    };
  }

  return {
    text: "Posso consultar bens culturais, intervenções, pendências, decisões, fiscalizações e resumos operacionais. Reformule a pergunta indicando o patrimônio, a intervenção ou o tipo de informação desejado.",
    source: "supabase",
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const question = String(body?.question || "").trim();

  if (!question) {
    return NextResponse.json({ error: "Pergunta obrigatória." }, { status: 400 });
  }

  const [summary, portfolio] = await Promise.all([
    getDashboardSummary(),
    getInterventionsPortfolio(),
  ]);
  const delayed = portfolio.data.filter((item:any) => item.actual < item.planned);

  return NextResponse.json(answer(question, summary, delayed));
}
