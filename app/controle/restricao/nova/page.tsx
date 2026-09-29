import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {createRestriction} from "@/app/fiscalizacoes/actions";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const q=await searchParams;
 return <AppShell active="/controle"><main className="pageWrap formPage"><div className="pageHead"><div><small>Controle / Restrições</small><h1>Nova restrição</h1><p>Registre impedimentos e impactos no andamento da intervenção.</p></div></div><FormNotice demo={q.demo} error={q.erro}/>
 <form action={createRestriction} className="panel formGrid"><input type="hidden" name="intervencao_id" value="restauro-matriz"/><label className="span2">Título<input name="titulo" required/></label><label className="span2">Descrição<textarea name="descricao" rows={5}/></label><label>Impacto<input name="impacto" placeholder="Ex.: 3 serviços · 11 dias potenciais"/></label><label>Risco<select name="risco"><option value="atencao">Atenção</option><option value="risco">Risco</option><option value="critico">Crítico</option></select></label><label>Prazo<input type="datetime-local" name="prazo"/></label><div className="formActions span2"><a href="/controle">Cancelar</a><button type="submit">Criar restrição</button></div></form>
 </main></AppShell>
}
