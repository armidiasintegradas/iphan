import { createClient } from "@/lib/supabase/server";

export async function getHeritage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bens_culturais")
    .select("id,nome,municipio,uf,tipologia,risco,latitude,longitude")
    .order("nome");

  if (error) return { data: [], source: "supabase" as const, error: true };

  return {
    source: "supabase" as const,
    error: false,
    data: (data || []).map((item) => ({
      id: item.id,
      name: item.nome,
      city: [item.municipio, item.uf].filter(Boolean).join(", "),
      type: item.tipologia || "Não informado",
      status: "Acompanhado",
      risk: item.risco || "regular",
      lat: item.latitude ? Number(item.latitude) : null,
      lng: item.longitude ? Number(item.longitude) : null,
      image: "/placeholder-patrimonio.jpg",
    })),
  };
}

export async function getHeritageOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bens_culturais")
    .select("id,nome,municipio,uf")
    .order("nome");

  if (error) return [];
  return (data || []).map((item) => ({
    id: item.id,
    label: item.nome + (item.municipio ? ` — ${item.municipio}, ${item.uf || "PE"}` : ""),
  }));
}

export async function getInterventionOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intervencoes")
    .select("id,titulo,bem_id,bens_culturais(nome)")
    .in("status", ["aberto","em_andamento","aguardando"])
    .order("titulo");

  if (error) return [];
  return (data || []).map((item:any) => ({
    id: item.id,
    bemId: item.bem_id,
    label: item.titulo + (item.bens_culturais?.nome ? ` — ${item.bens_culturais.nome}` : ""),
  }));
}

export async function getMeasurementOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medicoes")
    .select("id,numero,referencia,intervencao_id,intervencoes(titulo)")
    .in("status", ["rascunho","aberto","aguardando","em_andamento"])
    .order("created_at", {ascending:false});

  if (error) return [];
  return (data || []).map((item:any)=>({
    id:item.id,
    interventionId:item.intervencao_id,
    label:`Medição ${item.numero}${item.referencia ? " · "+item.referencia : ""}${item.intervencoes?.titulo ? " — "+item.intervencoes.titulo : ""}`,
  }));
}

export async function getInterventionsPortfolio() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("intervencoes")
    .select("id,titulo,status,risco,avanco_planejado,avanco_real,inicio_previsto,fim_previsto,bens_culturais(id,nome,municipio,uf)")
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: [], source: "supabase" as const, error: true };
  }

  const rows = (data || []).map((item:any) => ({
    id: item.id,
    title: item.titulo,
    status: item.status,
    risk: item.risco,
    planned: Number(item.avanco_planejado || 0),
    actual: Number(item.avanco_real || 0),
    start: item.inicio_previsto,
    end: item.fim_previsto,
    heritageId: item.bens_culturais?.id || null,
    heritageName: item.bens_culturais?.nome || "Bem cultural",
    city: [item.bens_culturais?.municipio, item.bens_culturais?.uf].filter(Boolean).join(", "),
  }));

  return { data: rows, source: "supabase" as const, error: false };
}

export async function getHeritageById(id:string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bens_culturais")
    .select("id,nome,municipio,uf,tipologia,nivel_protecao,descricao,risco,latitude,longitude,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const [{ data: interventions }, { data: inspections }, { data: documents }] = await Promise.all([
    supabase.from("intervencoes").select("id,titulo,status,risco,avanco_real").eq("bem_id", id).order("updated_at",{ascending:false}).limit(5),
    supabase.from("inspecoes_conservacao").select("id,categoria,estado,observacoes,inspecionada_em,proxima_inspecao").eq("bem_id", id).order("inspecionada_em",{ascending:false}).limit(8),
    supabase.from("documentos").select("id,titulo,contexto,sistema_origem,created_at").eq("bem_id", id).order("created_at",{ascending:false}).limit(5),
  ]);

  return {
    id:data.id,
    name:data.nome,
    city:[data.municipio,data.uf].filter(Boolean).join(", "),
    municipality:data.municipio,
    uf:data.uf,
    type:data.tipologia || "Não informado",
    protection:data.nivel_protecao || "Não informado",
    description:data.descricao || "",
    risk:data.risco || "regular",
    lat:data.latitude ? Number(data.latitude) : null,
    lng:data.longitude ? Number(data.longitude) : null,
    interventions:interventions || [],
    inspections:inspections || [],
    documents:documents || [],
  };
}

export async function getInterventionById(id:string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intervencoes")
    .select("id,titulo,descricao,status,risco,inicio_previsto,fim_previsto,inicio_real,fim_real,avanco_planejado,avanco_real,bens_culturais(id,nome,municipio,uf,nivel_protecao)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const [{ data: restrictions }, { data: decisions }, { data: measurements }, { data: audits }] = await Promise.all([
    supabase.from("restricoes").select("id,titulo,status,risco,prazo,impacto").eq("intervencao_id",id).neq("status","concluido").order("prazo").limit(5),
    supabase.from("decisoes").select("id,titulo,status,prazo").eq("intervencao_id",id).neq("status","concluido").order("prazo").limit(5),
    supabase.from("medicoes").select("id,numero,valor,percentual,status").eq("intervencao_id",id).order("numero",{ascending:false}).limit(1),
    supabase.from("audit_log").select("id,acao,entidade,created_at").eq("entidade_id",id).order("created_at",{ascending:false}).limit(5),
  ]);

  const heritage:any=data.bens_culturais || null;
  return {
    id:data.id,
    title:data.titulo,
    description:data.descricao || "",
    status:data.status,
    risk:data.risco,
    planned:Number(data.avanco_planejado || 0),
    actual:Number(data.avanco_real || 0),
    start:data.inicio_previsto,
    end:data.fim_previsto,
    heritage,
    restrictions:restrictions || [],
    decisions:decisions || [],
    latestMeasurement:(measurements || [])[0] || null,
    audits:audits || [],
  };
}

export async function getDashboardSummary() {
  const supabase = await createClient();

  const [bens, intervencoes, ocorrencias, decisoes, fiscalizacoes] = await Promise.all([
    supabase.from("bens_culturais").select("*", { count: "exact", head: true }),
    supabase.from("intervencoes").select("*", { count: "exact", head: true }).eq("status", "em_andamento"),
    supabase.from("ocorrencias").select("*", { count: "exact", head: true }).in("status", ["aberto", "aguardando"]),
    supabase.from("decisoes").select("*", { count: "exact", head: true }).in("status", ["aberto", "aguardando"]),
    supabase.from("fiscalizacoes").select("*", { count: "exact", head: true }).in("status", ["aberto", "em_andamento"]),
  ]);

  return {
    bens: bens.count || 0,
    intervencoes: intervencoes.count || 0,
    ocorrencias: ocorrencias.count || 0,
    decisoes: decisoes.count || 0,
    fiscalizacoes: fiscalizacoes.count || 0,
  };
}
