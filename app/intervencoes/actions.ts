"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createScheduleItem(formData: FormData) {
  const supabase = await createClient();
  const intervencao_id = text(formData, "intervencao_id");
  if (!supabase) redirect(`/intervencoes/${intervencao_id}/cronograma?demo=1`);

  const { error } = await supabase.from("cronograma_itens").insert({
    intervencao_id,
    titulo: text(formData, "titulo"),
    inicio_previsto: text(formData, "inicio_previsto") || null,
    fim_previsto: text(formData, "fim_previsto") || null,
    percentual_planejado: Number(text(formData, "percentual_planejado") || 0),
    percentual_executado: Number(text(formData, "percentual_executado") || 0),
  });

  if (error) redirect(`/intervencoes/${intervencao_id}/cronograma?erro=salvar`);
  redirect(`/intervencoes/${intervencao_id}/cronograma?criado=1`);
}

export async function createMeasurement(formData: FormData) {
  const supabase = await createClient();
  const intervencao_id = text(formData, "intervencao_id");
  if (!supabase) redirect(`/intervencoes/${intervencao_id}/medicoes/nova?demo=1`);

  const { error } = await supabase.from("medicoes").insert({
    intervencao_id,
    numero: Number(text(formData, "numero")),
    referencia: text(formData, "referencia"),
    valor: Number(text(formData, "valor").replace(",", ".")),
    percentual: Number(text(formData, "percentual").replace(",", ".")),
    status: "aguardando",
  });

  if (error) redirect(`/intervencoes/${intervencao_id}/medicoes/nova?erro=salvar`);
  redirect(`/intervencoes/${intervencao_id}/medicoes?criada=1`);
}
