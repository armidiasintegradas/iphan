import { createClient } from "@/lib/supabase/server";
import { heritage as mockHeritage } from "@/lib/mock";

export async function getHeritage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bens_culturais")
    .select("id,nome,municipio,uf,tipologia,risco,latitude,longitude")
    .order("nome");

  if (error || !data?.length) return { data: mockHeritage, source: "demo" as const };

  return {
    source: "supabase" as const,
    data: data.map((item) => ({
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

export async function getDashboardSummary() {
  const supabase = await createClient();

  const [bens, intervencoes, ocorrencias, decisoes] = await Promise.all([
    supabase.from("bens_culturais").select("*", { count: "exact", head: true }),
    supabase.from("intervencoes").select("*", { count: "exact", head: true }).eq("status", "em_andamento"),
    supabase.from("ocorrencias").select("*", { count: "exact", head: true }).in("status", ["aberto", "aguardando"]),
    supabase.from("decisoes").select("*", { count: "exact", head: true }).in("status", ["aberto", "aguardando"]),
  ]);

  return {
    bens: bens.count || 0,
    intervencoes: intervencoes.count || 0,
    ocorrencias: ocorrencias.count || 0,
    decisoes: decisoes.count || 0,
  };
}
