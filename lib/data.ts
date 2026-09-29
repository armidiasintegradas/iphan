import { createClient } from "@/lib/supabase/server";
import { heritage as mockHeritage } from "@/lib/mock";

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
