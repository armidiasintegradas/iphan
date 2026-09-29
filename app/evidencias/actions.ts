"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function cleanFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
}

export async function uploadEvidence(formData: FormData) {
  const file = formData.get("arquivo");
  const intervencaoId = String(formData.get("intervencao_id") || "");
  const etapa = String(formData.get("etapa") || "durante");
  const legenda = String(formData.get("legenda") || "").trim();

  if (!(file instanceof File) || !file.size) {
    redirect("/campo/evidencia?erro=arquivo");
  }

  const supabase = await createClient();
  if (!supabase) redirect("/campo/evidencia?demo=1");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = [
    intervencaoId || "sem-intervencao",
    etapa,
    Date.now() + "-" + cleanFileName(file.name),
  ].join("/");

  const { error: storageError } = await supabase.storage
    .from("evidencias")
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (storageError) redirect("/campo/evidencia?erro=upload");

  const { error } = await supabase.from("evidencias").insert({
    intervencao_id: intervencaoId || null,
    tipo: file.type.startsWith("image/") ? "imagem" : "arquivo",
    etapa,
    storage_path: path,
    legenda,
    captured_at: new Date().toISOString(),
    created_by: user?.id || null,
    metadata: {
      original_name: file.name,
      size: file.size,
      mime: file.type,
    },
  });

  if (error) redirect("/campo/evidencia?erro=registro");
  redirect("/campo?evidencia=criada");
}
