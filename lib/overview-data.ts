import { createClient } from "@/lib/supabase/server";

export async function getFiscalizationsOverview(filters?:{q?:string}) {
  const supabase=await createClient();
  const {data,error}=await supabase
    .from("fiscalizacoes")
    .select("id,titulo,tipo,status,agendada_para,realizada_em,observacoes,bem_id,intervencao_id,bens_culturais(nome,municipio,uf),intervencoes(titulo,bens_culturais(nome,municipio,uf))")
    .order("agendada_para",{ascending:true});

  if(error) return {rows:[],metrics:{abertas:0,planejadas:0,realizadas:0,vencidas:0},source:"supabase" as const};

  const all=(data||[]).map((x:any)=>({
    ...x,
    bemNome:x.bens_culturais?.nome || x.intervencoes?.bens_culturais?.nome || "Bem cultural",
    local:[x.bens_culturais?.municipio || x.intervencoes?.bens_culturais?.municipio,x.bens_culturais?.uf || x.intervencoes?.bens_culturais?.uf].filter(Boolean).join(", "),
  }));
  const search=(filters?.q||"").trim().toLowerCase();
  const rows=search ? all.filter((x:any)=>[x.titulo,x.tipo,x.bemNome,x.local].join(" ").toLowerCase().includes(search)) : all;

  const metrics={
    abertas:all.filter((x:any)=>["aberto","em_andamento","aguardando"].includes(x.status)).length,
    planejadas:all.filter((x:any)=>x.agendada_para&&!x.realizada_em&&x.status!=="concluido").length,
    realizadas:all.filter((x:any)=>!!x.realizada_em||x.status==="concluido").length,
    vencidas:all.filter((x:any)=>x.agendada_para&&new Date(x.agendada_para)<new Date()&&!x.realizada_em&&x.status!=="concluido").length,
  };

  return {rows,metrics,source:"supabase" as const};
}

export async function getConservationOverview() {
  const supabase=await createClient();

  const [{data:inspections,error},{data:heritage}] = await Promise.all([
    supabase.from("inspecoes_conservacao")
      .select("id,bem_id,categoria,estado,observacoes,inspecionada_em,proxima_inspecao,bens_culturais(nome,municipio,uf)")
      .order("proxima_inspecao",{ascending:true}),
    supabase.from("bens_culturais").select("id,nome,municipio,uf,risco").order("nome"),
  ]);

  if(error) return {inspections:[],heritage:heritage||[],metrics:{regular:0,atencao:0,risco:0,critico:0},source:"supabase" as const};

  const all=heritage||[];
  const metrics={
    regular:all.filter((x:any)=>x.risco==="regular").length,
    atencao:all.filter((x:any)=>x.risco==="atencao").length,
    risco:all.filter((x:any)=>x.risco==="risco").length,
    critico:all.filter((x:any)=>x.risco==="critico").length,
  };

  return {inspections:inspections||[],heritage:all,metrics,source:"supabase" as const};
}

export async function getDocumentsOverview(filters?:{
  contexto?:string;
  sistema?:string;
  status?:string;
  periodo?:string;
}) {
  const supabase=await createClient();
  let query=supabase
    .from("documentos")
    .select("id,contexto,titulo,sistema_origem,referencia_externa,storage_path,created_at,bem_id,intervencao_id")
    .order("created_at",{ascending:false});

  if(filters?.contexto && filters.contexto!=="todos") query=query.eq("contexto",filters.contexto);
  if(filters?.sistema && filters.sistema!=="todos") query=query.eq("sistema_origem",filters.sistema);
  if(filters?.periodo && filters.periodo!=="todos"){
    const days=filters.periodo==="30" ? 30 : filters.periodo==="90" ? 90 : 365;
    const since=new Date(Date.now()-days*24*60*60*1000).toISOString();
    query=query.gte("created_at",since);
  }

  const {data,error}=await query;
  if(error) return {rows:[],groups:{},source:"supabase" as const};

  let base=data||[];
  if(filters?.status==="arquivo") base=base.filter((item:any)=>!!item.storage_path);
  if(filters?.status==="referencia") base=base.filter((item:any)=>!item.storage_path && !!item.referencia_externa);

  const rows=await Promise.all(base.map(async (item:any)=>{
    let signedUrl:string|null=null;
    if(item.storage_path){
      const signed=await supabase.storage.from("documentos").createSignedUrl(item.storage_path,900);
      signedUrl=signed.data?.signedUrl||null;
    }
    return {...item,signedUrl};
  }));
  const groups=rows.reduce((acc:Record<string,any[]>,item:any)=>{
    const key=item.contexto||"Outros";
    if(!acc[key]) acc[key]=[];
    acc[key].push(item);
    return acc;
  },{});

  return {rows,groups,source:"supabase" as const};
}

export async function getFieldOverview() {
  const supabase=await createClient();

  const [{data:evidence},{data:occurrences}]=await Promise.all([
    supabase.from("evidencias")
      .select("id,etapa,legenda,captured_at,storage_path,intervencao_id")
      .order("captured_at",{ascending:false})
      .limit(8),
    supabase.from("ocorrencias")
      .select("id,titulo,descricao,categoria,created_at,intervencao_id,risco")
      .order("created_at",{ascending:false})
      .limit(8),
  ]);

  const evidenceRows=await Promise.all((evidence||[]).map(async (item:any)=>{
    const signed=await supabase.storage.from("evidencias").createSignedUrl(item.storage_path,900);
    return {
      id:"e-"+item.id,
      kind:"Evidência",
      title:item.legenda||"Registro fotográfico",
      subtitle:item.etapa||"durante",
      createdAt:item.captured_at,
      image:signed.data?.signedUrl||null,
      interventionId:item.intervencao_id,
    };
  }));

  const occurrenceRows=(occurrences||[]).map((item:any)=>({
    id:"o-"+item.id,
    kind:"Ocorrência",
    title:item.titulo,
    subtitle:item.categoria||"Registro de campo",
    createdAt:item.created_at,
    image:null,
    interventionId:item.intervencao_id,
  }));

  const rows=[...evidenceRows,...occurrenceRows]
    .sort((a:any,b:any)=>new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime())
    .slice(0,8);

  return {rows,source:"supabase" as const};
}
