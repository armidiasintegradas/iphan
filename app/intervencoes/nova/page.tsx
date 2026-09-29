import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import { createIntervention } from "@/app/actions";
import { heritage } from "@/lib/mock";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  return <AppShell active="/intervencoes"><main className="pageWrap formPage">
    <div className="pageHead"><div><small>Intervenções / Nova</small><h1>Nova intervenção</h1><p>Crie uma intervenção vinculada a um bem cultural.</p></div></div>
    <FormNotice demo={q.demo} error={q.erro}/>
    <form action={createIntervention} className="panel formGrid">
      <label className="span2">Bem cultural<select name="bem_id" required>{heritage.map(h=><option key={h.id} value={h.id}>{h.name} — {h.city}</option>)}</select></label>
      <label className="span2">Título<input name="titulo" required placeholder="Ex.: Restauração da cobertura e fachadas"/></label>
      <label>Início previsto<input type="date" name="inicio_previsto"/></label>
      <label>Fim previsto<input type="date" name="fim_previsto"/></label>
      <label className="span2">Descrição<textarea name="descricao" rows={5} placeholder="Escopo resumido da intervenção..."/></label>
      <div className="formActions span2"><a href="/intervencoes">Cancelar</a><button type="submit">Criar intervenção</button></div>
    </form>
  </main></AppShell>;
}
