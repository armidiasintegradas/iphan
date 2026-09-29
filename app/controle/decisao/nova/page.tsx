import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {createDecision} from "@/app/fiscalizacoes/actions";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const q=await searchParams;
 return <AppShell active="/controle"><main className="pageWrap formPage"><div className="pageHead"><div><small>Controle / Decisões</small><h1>Nova decisão</h1><p>Formalize uma decisão técnica com contexto e prazo.</p></div></div><FormNotice demo={q.demo} error={q.erro}/>
 <form action={createDecision} className="panel formGrid"><input type="hidden" name="intervencao_id" value="restauro-matriz"/><label className="span2">Título<input name="titulo" required/></label><label className="span2">Contexto<textarea name="contexto" rows={6} required placeholder="Descreva a situação que exige decisão."/></label><label>Prazo<input type="datetime-local" name="prazo"/></label><div className="formActions span2"><a href="/controle">Cancelar</a><button type="submit">Criar decisão</button></div></form>
 </main></AppShell>
}
