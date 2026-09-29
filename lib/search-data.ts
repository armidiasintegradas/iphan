import {createClient} from "@/lib/supabase/server";

function clean(q:string){
  return q.trim().replace(/[%_]/g," ").replace(/\s+/g," ").slice(0,120);
}

export async function globalSearch(query:string){
  const q=clean(query);
  if(q.length<2) return {query:q,heritage:[],interventions:[],documents:[]};

  const supabase=await createClient();
  const pattern=`%${q}%`;

  const [heritage,interventions,documents]=await Promise.all([
    supabase.from("bens_culturais")
      .select("id,nome,municipio,uf,tipologia,risco")
      .or(`nome.ilike.${pattern},municipio.ilike.${pattern},tipologia.ilike.${pattern}`)
      .order("nome")
      .limit(12),
    supabase.from("intervencoes")
      .select("id,titulo,status,risco,bens_culturais(nome,municipio,uf)")
      .ilike("titulo",pattern)
      .order("updated_at",{ascending:false})
      .limit(12),
    supabase.from("documentos")
      .select("id,titulo,contexto,sistema_origem,bem_id,intervencao_id,created_at")
      .ilike("titulo",pattern)
      .order("created_at",{ascending:false})
      .limit(12),
  ]);

  return {
    query:q,
    heritage:heritage.data||[],
    interventions:interventions.data||[],
    documents:documents.data||[],
  };
}
