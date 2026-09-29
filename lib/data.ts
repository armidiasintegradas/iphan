import { createClient } from "@/lib/supabase/server";
import { heritage as mockHeritage } from "@/lib/mock";

export async function getHeritage() {
  const supabase = await createClient();
  if (!supabase) return { data: mockHeritage, source: "demo" as const };

  const { data, error } = await supabase
    .from("bens_culturais")
    .select("id,nome,municipio,uf,tipologia,risco")
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
      image: "/placeholder-patrimonio.jpg",
    })),
  };
}

export async function getDashboardSummary() {
  const supabase = await createClient();
  if (!supabase) return null;

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
