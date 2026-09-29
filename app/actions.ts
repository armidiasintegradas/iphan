"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function createHeritage(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/patrimonio/novo?demo=1");

  const nome = value(formData, "nome");
  const municipio = value(formData, "municipio");
  const uf = value(formData, "uf") || "PE";
  const tipologia = value(formData, "tipologia");
  const nivel_protecao = value(formData, "nivel_protecao");

  const { data: unidade } = await supabase.from("unidades").select("id").limit(1).maybeSingle();
  if (!unidade?.id) redirect("/patrimonio/novo?erro=unidade");

  const { data, error } = await supabase.from("bens_culturais").insert({
    unidade_id: unidade.id,
    nome,
    municipio,
    uf,
    tipologia,
    nivel_protecao,
  }).select("id").single();

  if (error || !data?.id) redirect("/patrimonio/novo?erro=salvar");
  redirect("/patrimonio/" + data.id);
}

export async function createIntervention(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/intervencoes/nova?demo=1");

  const bem_id = value(formData, "bem_id");
  const titulo = value(formData, "titulo");
  const descricao = value(formData, "descricao");
  const inicio_previsto = value(formData, "inicio_previsto") || null;
  const fim_previsto = value(formData, "fim_previsto") || null;

  const { data, error } = await supabase.from("intervencoes").insert({
    bem_id,
    titulo,
    descricao,
    inicio_previsto,
    fim_previsto,
    status: "em_andamento",
  }).select("id").single();

  if (error || !data?.id) redirect("/intervencoes/nova?erro=salvar");
  redirect("/intervencoes/" + data.id);
}

export async function createOccurrence(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/campo/ocorrencia?demo=1");

  const intervencao_id = value(formData, "intervencao_id");
  const titulo = value(formData, "titulo");
  const descricao = value(formData, "descricao");
  const categoria = value(formData, "categoria");
  const prazo = value(formData, "prazo") || null;

  const { error } = await supabase.from("ocorrencias").insert({
    intervencao_id,
    titulo,
    descricao,
    categoria,
    prazo,
    status: "aberto",
    risco: "atencao",
  });

  if (error) redirect("/campo/ocorrencia?erro=salvar");
  redirect("/campo?ocorrencia=criada");
}
