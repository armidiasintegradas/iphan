import { createClient } from "@/lib/supabase/server";
import { heritage } from "@/lib/mock";

export const demoEvidence = [
  { id:"ev-01", etapa:"antes", ambiente:"Fachada oeste", elemento:"Revestimento", legenda:"Fissuras e perda de revestimento antes da intervenção.", captured_at:"2026-09-20T09:12:00", url:heritage[0].image },
  { id:"ev-02", etapa:"durante", ambiente:"Fachada oeste", elemento:"Revestimento", legenda:"Remoção controlada das áreas deterioradas.", captured_at:"2026-09-24T14:30:00", url:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80" },
  { id:"ev-03", etapa:"depois", ambiente:"Fachada oeste", elemento:"Revestimento", legenda:"Trecho concluído após recomposição.", captured_at:"2026-09-27T16:45:00", url:heritage[1].image },
  { id:"ev-04", etapa:"durante", ambiente:"Cobertura", elemento:"Estrutura de madeira", legenda:"Inspeção das peças estruturais.", captured_at:"2026-09-25T10:20:00", url:heritage[3].image },
];

export const demoSchedule = [
  { id:"cr-1", titulo:"Mobilização e proteção", previsto:100, executado:100, inicio:"02/06", fim:"14/06", status:"concluido" },
  { id:"cr-2", titulo:"Cobertura", previsto:82, executado:68, inicio:"15/06", fim:"30/09", status:"atencao" },
  { id:"cr-3", titulo:"Fachadas", previsto:70, executado:63, inicio:"01/07", fim:"20/10", status:"atencao" },
  { id:"cr-4", titulo:"Instalações", previsto:48, executado:41, inicio:"10/08", fim:"28/11", status:"regular" },
  { id:"cr-5", titulo:"Elementos artísticos", previsto:35, executado:26, inicio:"02/09", fim:"18/12", status:"risco" },
];

export const demoMeasurements = [
  { id:"m-01", numero:1, referencia:"Jun/2026", valor:380000, percentual:9.0, status:"concluido", evidencias:12 },
  { id:"m-02", numero:2, referencia:"Jul/2026", valor:515000, percentual:12.3, status:"concluido", evidencias:18 },
  { id:"m-03", numero:3, referencia:"Ago/2026", valor:472000, percentual:11.2, status:"aguardando", evidencias:9 },
  { id:"m-04", numero:4, referencia:"Set/2026", valor:398000, percentual:9.5, status:"rascunho", evidencias:5 },
];

export async function getEvidence(intervencaoId:string) {
  const supabase = await createClient();
  if (!supabase) return {data:demoEvidence, source:"demo" as const};

  const {data,error} = await supabase.from("evidencias")
    .select("id,etapa,legenda,captured_at,storage_path,metadata")
    .eq("intervencao_id",intervencaoId)
    .order("captured_at",{ascending:false});

  if (error || !data?.length) return {data:demoEvidence, source:"demo" as const};

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
  if(!supabase) return {data:demoSchedule,source:"demo" as const};
  const {data,error}=await supabase.from("cronograma_itens")
    .select("id,titulo,inicio_previsto,fim_previsto,percentual_planejado,percentual_executado")
    .eq("intervencao_id",intervencaoId).order("ordem");
  if(error||!data?.length) return {data:demoSchedule,source:"demo" as const};
  return {source:"supabase" as const,data:data.map(i=>({
    id:i.id,titulo:i.titulo,previsto:Number(i.percentual_planejado),executado:Number(i.percentual_executado),
    inicio:i.inicio_previsto||"",fim:i.fim_previsto||"",
    status:Number(i.percentual_executado)+10<Number(i.percentual_planejado)?"risco":Number(i.percentual_executado)<Number(i.percentual_planejado)?"atencao":"regular"
  }))};
}

export async function getMeasurements(intervencaoId:string) {
  const supabase=await createClient();
  if(!supabase) return {data:demoMeasurements,source:"demo" as const};
  const {data,error}=await supabase.from("medicoes")
    .select("id,numero,referencia,valor,percentual,status")
    .eq("intervencao_id",intervencaoId).order("numero");
  if(error||!data?.length) return {data:demoMeasurements,source:"demo" as const};
  return {source:"supabase" as const,data:data.map(i=>({...i,valor:Number(i.valor||0),percentual:Number(i.percentual||0),evidencias:0}))};
}
