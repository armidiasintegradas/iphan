import { createClient } from "@/lib/supabase/server";
export async function getEvidence(intervencaoId:string) {
  const supabase = await createClient();
  const {data,error} = await supabase.from("evidencias")
    .select("id,etapa,legenda,captured_at,storage_path,metadata")
    .eq("intervencao_id",intervencaoId)
    .order("captured_at",{ascending:false});

  if (error) return {data:[], source:"supabase" as const};

  const rows = await Promise.all(data.map(async (item)=>{
    const signed = await supabase.storage.from("evidencias").createSignedUrl(item.storage_path,3600);
    return {
      id:item.id,
      etapa:item.etapa || "durante",
      ambiente:item.metadata?.ambiente || "Não informado",
      elemento:item.metadata?.elemento || "Não informado",
      legenda:item.legenda || "",
      captured_at:item.captured_at || "",
      url:signed.data?.signedUrl || "",
    };
  }));
  return {data:rows, source:"supabase" as const};
}

export async function getSchedule(intervencaoId:string) {
  const supabase=await createClient();
  const {data,error}=await supabase.from("cronograma_itens")
    .select("id,titulo,inicio_previsto,fim_previsto,percentual_planejado,percentual_executado")
    .eq("intervencao_id",intervencaoId).order("ordem");
  if(error) return {data:[],source:"supabase" as const};
  return {source:"supabase" as const,data:data.map(i=>({
    id:i.id,titulo:i.titulo,previsto:Number(i.percentual_planejado),executado:Number(i.percentual_executado),
    inicio:i.inicio_previsto||"",fim:i.fim_previsto||"",
    status:Number(i.percentual_executado)+10<Number(i.percentual_planejado)?"risco":Number(i.percentual_executado)<Number(i.percentual_planejado)?"atencao":"regular"
  }))};
}

export async function getMeasurements(intervencaoId:string) {
  const supabase=await createClient();
  const {data,error}=await supabase.from("medicoes")
    .select("id,numero,referencia,valor,percentual,status")
    .eq("intervencao_id",intervencaoId).order("numero");
  if(error) return {data:[],source:"supabase" as const};

  const ids=(data||[]).map(i=>i.id);
  const counts=new Map<string,number>();
  if(ids.length){
    const {data:evidenceRows,error:evidenceError}=await supabase.from("evidencias")
      .select("medicao_id")
      .in("medicao_id",ids);
    if(!evidenceError){
      (evidenceRows||[]).forEach((row:any)=>{
        if(row.medicao_id) counts.set(row.medicao_id,(counts.get(row.medicao_id)||0)+1);
      });
    }
  }

  return {source:"supabase" as const,data:(data||[]).map(i=>({
    ...i,
    valor:Number(i.valor||0),
    percentual:Number(i.percentual||0),
    evidencias:counts.get(i.id)||0,
  }))};
}
