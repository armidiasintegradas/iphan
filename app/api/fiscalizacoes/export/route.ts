import {getFiscalizationsOverview} from "@/lib/overview-data";

const qv=(value:unknown)=>'"'+String(value??"").replace(/"/g,'""')+'"';

export async function GET(request:Request){
  const url=new URL(request.url);
  const q=url.searchParams.get("q")||"";
  const {rows}=await getFiscalizationsOverview({q});
  const lines=[
    ["ID","Bem cultural","Local","Fiscalização","Tipo","Data prevista","Data realizada","Status"].map(qv).join(","),
    ...(rows as any[]).map(r=>[
      r.id,r.bemNome,r.local,r.titulo,r.tipo||"",r.agendada_para||"",r.realizada_em||"",r.status
    ].map(qv).join(","))
  ];
  return new Response(lines.join("\n"),{
    headers:{"content-type":"text/csv; charset=utf-8"}
  });
}
