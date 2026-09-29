import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {createMeasurement} from "@/app/intervencoes/actions";

export default async function Page({
  params,
  searchParams,
}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|undefined>>}){
  const {id}=await params; const q=await searchParams;
  return <AppShell active="/intervencoes"><main className="pageWrap formPage">
    <div className="pageHead"><div><small>Intervenção / Medições</small><h1>Nova medição</h1><p>Registre a medição física e financeira para conferência.</p></div></div>
    <FormNotice demo={q.demo} error={q.erro}/>
    <form action={createMeasurement} className="panel formGrid">
      <input type="hidden" name="intervencao_id" value={id}/>
      <label>Número<input name="numero" type="number" min="1" required/></label>
      <label>Referência<input name="referencia" placeholder="Ex.: Out/2026" required/></label>
      <label>Valor medido (R$)<input name="valor" type="number" min="0" step="0.01" required/></label>
      <label>Percentual físico (%)<input name="percentual" type="number" min="0" max="100" step="0.1" required/></label>
      <div className="formActions span2"><a href={`/intervencoes/${id}/medicoes`}>Cancelar</a><button type="submit">Enviar para conferência</button></div>
    </form>
  </main></AppShell>
}
