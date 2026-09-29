import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {createScheduleItem} from "@/app/intervencoes/actions";

export default async function Page({
  params,
  searchParams,
}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|undefined>>}){
  const {id}=await params; const q=await searchParams;
  return <AppShell active="/intervencoes"><main className="pageWrap formPage">
    <div className="pageHead"><div><small>Intervenção / Cronograma</small><h1>Novo item de cronograma</h1><p>Cadastre uma frente ou etapa de serviço.</p></div></div>
    <FormNotice demo={q.demo} error={q.erro}/>
    <form action={createScheduleItem} className="panel formGrid">
      <input type="hidden" name="intervencao_id" value={id}/>
      <label className="span2">Título<input name="titulo" required placeholder="Ex.: Restauração da cobertura"/></label>
      <label>Início previsto<input type="date" name="inicio_previsto"/></label>
      <label>Fim previsto<input type="date" name="fim_previsto"/></label>
      <label>% planejado<input type="number" min="0" max="100" step="0.1" name="percentual_planejado" defaultValue="0"/></label>
      <label>% executado<input type="number" min="0" max="100" step="0.1" name="percentual_executado" defaultValue="0"/></label>
      <div className="formActions span2"><a href={`/intervencoes/${id}/cronograma`}>Cancelar</a><button type="submit">Salvar item</button></div>
    </form>
  </main></AppShell>
}
