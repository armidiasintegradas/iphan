"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/current-user";
import { can } from "@/lib/permissions";

function cleanFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
}

export async function uploadEvidence(formData: FormData) {
  const current=await getCurrentUser();
  if(!current.id) redirect("/login");
  if(!current.active) redirect("/login?erro=inativo");
  if(!current.unitId || !can(current.role,"evidence.write")) redirect("/campo/evidencia?erro=permissao");

  const file = formData.get("arquivo");
  const intervencaoId = String(formData.get("intervencao_id") || "");
  const medicaoId = String(formData.get("medicao_id") || "");
  const etapa = String(formData.get("etapa") || "durante");
  const legenda = String(formData.get("legenda") || "").trim();

  if (!intervencaoId) redirect("/campo/evidencia?erro=intervencao");
  if (!["antes","durante","depois"].includes(etapa)) redirect("/campo/evidencia?erro=etapa");
  if (!(file instanceof File) || !file.size) redirect("/campo/evidencia?erro=arquivo");

  const supabase = await createClient();
  if (!supabase) redirect("/campo/evidencia?demo=1");

  const {data:intervention,error:interventionError}=await supabase
    .from("intervencoes")
    .select("id,bens_culturais(unidade_id)")
    .eq("id",intervencaoId)
    .maybeSingle();
  if(interventionError||!intervention||(intervention as any).bens_culturais?.unidade_id!==current.unitId){
    redirect("/campo/evidencia?erro=intervencao");
  }

  if(medicaoId){
    const {data:measurement,error:measurementError}=await supabase
      .from("medicoes")
      .select("id,intervencao_id")
      .eq("id",medicaoId)
      .maybeSingle();
    if(measurementError || !measurement || measurement.intervencao_id!==intervencaoId){
      redirect("/campo/evidencia?erro=medicao");
    }
  }

  const path = [
    intervencaoId,
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
    intervencao_id: intervencaoId,
    medicao_id: medicaoId || null,
    tipo: file.type.startsWith("image/") ? "imagem" : "arquivo",
    etapa,
    storage_path: path,
    legenda,
    captured_at: new Date().toISOString(),
    created_by: current.id,
    metadata: {
      original_name: file.name,
      size: file.size,
      mime: file.type,
    },
  });

  if (error) {
    await supabase.storage.from("evidencias").remove([path]);
    redirect("/campo/evidencia?erro=registro");
  }

  redirect("/campo?evidencia=criada");
}
