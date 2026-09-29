import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {getHeritageOptions} from "@/lib/data";
import {createConservationInspection} from "@/app/conservacao/actions";
import {ShieldCheck, CalendarDays} from "lucide-react";
import {requirePermission} from "@/lib/authorization";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  const q=await searchParams;
  await requirePermission("inspection.write","/conservacao");
  const heritage=await getHeritageOptions();
  const today=new Date().toISOString().slice(0,10);

  return <AppShell active="/conservacao"><main className="pageWrap formPage approvedDesktopFormPage">
    <div className="pageHead">
      <div><small>Conservação / Nova inspeção</small><h1>Inspeção preventiva</h1><p>Registre o estado de conservação e programe o próximo acompanhamento.</p></div>
    </div>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="formContextStrip"><ShieldCheck/><div><strong>Conservação preventiva</strong><span>O estado registrado também atualiza o nível de risco consolidado do bem cultural.</span></div><CalendarDays/></div>
    <form action={createConservationInspection} className="panel formGrid approvedFormGrid">
      <label className="span2">Bem cultural<select name="bem_id" required defaultValue=""><option value="" disabled>Selecione o bem</option>{heritage.map(h=><option key={h.id} value={h.id}>{h.label}</option>)}</select></label>
      <label>Categoria<select name="categoria" required defaultValue=""><option value="" disabled>Selecionar</option><option>Cobertura</option><option>Fachadas</option><option>Estrutura</option><option>Instalações</option><option>Esquadrias</option><option>Revestimentos</option><option>Entorno</option><option>Conservação geral</option></select></label>
      <label>Estado<select name="estado" defaultValue="regular"><option value="regular">Regular</option><option value="atencao">Atenção</option><option value="risco">Risco</option><option value="critico">Crítico</option></select></label>
      <label>Data da inspeção<input type="date" name="inspecionada_em" defaultValue={today}/></label>
      <label>Próxima inspeção<input type="date" name="proxima_inspecao"/></label>
      <label className="span2">Observações<textarea name="observacoes" rows={5} placeholder="Descreva sinais de degradação, manutenção necessária e recomendações."/></label>
      <div className="formActions span2"><a href="/conservacao">Cancelar</a><button type="submit" disabled={!heritage.length}>Salvar inspeção</button></div>
    </form>
  </main></AppShell>;
}
