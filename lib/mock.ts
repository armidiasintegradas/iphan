export const heritage = [
  { id:"matriz-olinda", name:"Igreja Matriz de Olinda", city:"Olinda, PE", type:"Arquitetura Religiosa", status:"Em intervenção", risk:"Atenção", image:"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80" },
  { id:"cinco-pontas", name:"Forte das Cinco Pontas", city:"Recife, PE", type:"Arquitetura Militar", status:"Regular", risk:"Regular", image:"https://images.unsplash.com/photo-1520637836862-4d197d17c80a?auto=format&fit=crop&w=1200&q=80" },
  { id:"carmo", name:"Conjunto do Carmo", city:"Olinda, PE", type:"Conjunto Urbano", status:"Em intervenção", risk:"Risco", image:"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80" },
  { id:"sao-bento", name:"Igreja de São Bento", city:"Olinda, PE", type:"Arquitetura Religiosa", status:"Regular", risk:"Atenção", image:"https://images.unsplash.com/photo-1461696114087-397271a7aedc?auto=format&fit=crop&w=1200&q=80" },
];

export const priorities = [
  { title:"Decisão técnica vencida", meta:"IPHE-PE-2024-017", note:"Vencida há 3 dias", tone:"danger", image:heritage[0].image },
  { title:"Intervenção com desvio físico", meta:"Obra Igreja Matriz", note:"-8 p.p. do planejado", tone:"warning", image:heritage[2].image },
  { title:"Medição aguardando conferência", meta:"3ª medição", note:"Prazo em 5 dias", tone:"neutral", image:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80" },
  { title:"Fiscalização programada", meta:"Forte das Cinco Pontas", note:"Amanhã, 09:00", tone:"info", image:heritage[1].image },
];

export const nav = [
  { href:"/", label:"Hoje", icon:"home" },
  { href:"/patrimonio", label:"Patrimônio", icon:"landmark" },
  { href:"/intervencoes", label:"Intervenções", icon:"wrench" },
  { href:"/campo", label:"Campo", icon:"mapPin" },
  { href:"/fiscalizacoes", label:"Fiscalizações", icon:"clipboard" },
  { href:"/conservacao", label:"Conservação", icon:"shield" },
  { href:"/documentos", label:"Documentos", icon:"file" },
  { href:"/inteligencia", label:"Inteligência", icon:"sparkles" },
];
