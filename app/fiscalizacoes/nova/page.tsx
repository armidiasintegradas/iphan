import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {createInspection} from "@/app/fiscalizacoes/actions";
import {getHeritageOptions,getInterventionOptions} from "@/lib/data";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  const [heritage,interventions]=await Promise.all([getHeritageOptions(),getInterventionOptions()]);

  return <AppShell active="/fiscalizacoes"><main className="pageWrap formPage">
    <div className="pageHead"><div><small>Fiscalizações / Nova</small><h1>Nova fiscalização</h1><p>Planeje a vistoria e defina o checklist técnico.</p></div></div>
    <FormNotice demo={q.demo} error={q.erro}/>
    <form action={createInspection} className="panel formGrid">
      <label>Bem cultural<select name="bem_id" defaultValue=""><option value="">Selecione</option>{heritage.map(h=><option key={h.id} value={h.id}>{h.label}</option>)}</select></label>
      <label>Intervenção<select name="intervencao_id" defaultValue=""><option value="">Sem intervenção específica</option>{interventions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</select></label>
      <label className="span2">Título<input name="titulo" required placeholder="Ex.: Fiscalização de acompanhamento — cobertura"/></label>
      <label>Tipo<select name="tipo"><option>Vistoria de obra</option><option>Fiscalização preventiva</option><option>Vistoria conjunta</option><option>Retorno de ocorrência</option></select></label>
      <label>Data e hora<input type="datetime-local" name="agendada_para" required/></label>
      <fieldset className="span2 checklistBox"><legend>Checklist técnico</legend>{["estrutura","cobertura","instalacoes","incendio","acessibilidade","conservacao"].map(x=><label key={x}><input type="checkbox" name={x}/><span>{x[0].toUpperCase()+x.slice(1)}</span></label>)}</fieldset>
      <label className="span2">Observações<textarea name="observacoes" rows={5}/></label>
      <div className="formActions span2"><a href="/fiscalizacoes">Cancelar</a><button type="submit">Programar fiscalização</button></div>
    </form>
  </main></AppShell>
}