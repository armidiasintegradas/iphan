import Link from "next/link";

const screens=[
  ["login","Login","Referência aprovada · em revisão"],
  ["hoje","Hoje","Estrutura global + dashboard"],
  ["patrimonio","Patrimônio","Mapa + lista + cards"],
  ["intervencao","Cockpit","Detalhe da intervenção"],
  ["fiscalizacoes","Fiscalizações","Tabela + agenda"],
  ["conservacao","Conservação","Panorama preventivo"],
  ["documentos","Documentos","Biblioteca e filtros"],
  ["campo","Campo","Mobile action-first"],
  ["inteligencia","Inteligência","Mobile assistente"],
];

export default function Page(){
  return <main className="previewIndex">
    <div className="previewIndexHead">
      <span className="previewEyebrow">IPHAN · BETA 01</span>
      <h1>Revisão visual</h1>
      <p>Ambiente local estático para comparar as telas aprovadas sem login, Supabase ou deploy.</p>
    </div>
    <div className="previewScreenGrid">
      {screens.map(([slug,title,desc],i)=><Link href={"/preview/"+slug} key={slug} className="previewScreenCard">
        <span>{String(i+1).padStart(2,"0")}</span>
        <strong>{title}</strong>
        <small>{desc}</small>
        <b>Revisar →</b>
      </Link>)}
    </div>
    <div className="previewHowTo"><strong>Local:</strong><code>npm run dev</code><span>→</span><code>http://localhost:3000/preview</code></div>
  </main>;
}
