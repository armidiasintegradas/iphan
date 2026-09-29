import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {getInterventionById} from "@/lib/data";
import {updateIntervention} from "@/app/actions";
import {notFound} from "next/navigation";
import {Wrench, Pencil} from "lucide-react";
import {requirePermission} from "@/lib/authorization";

export default async function Page({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string|undefined>>}){
  const [{id},q]=await Promise.all([params,searchParams]);
  await requirePermission("intervention.write","/intervencoes");
  const item=await getInterventionById(id);
  if(!item) notFound();

  return <AppShell active="/intervencoes"><main className="pageWrap formPage approvedDesktopFormPage">
    <div className="pageHead"><div><small>Intervenções / Editar</small><h1>Editar intervenção</h1><p>Atualize escopo, prazo e avanço físico.</p></div></div>
    <FormNotice error={q.erro}/>
    <div className="formContextStrip"><Wrench/><div><strong>{item.title}</strong><span>{item.heritage?.nome||"Bem cultural"}</span></div><Pencil/></div>
    <form action={updateIntervention} className="panel formGrid approvedFormGrid">
      <input type="hidden" name="id" value={id}/>
      <label className="span2">Título<input name="titulo" required defaultValue={item.title}/></label>
      <label>Início previsto<input type="date" name="inicio_previsto" defaultValue={item.start||""}/></label>
      <label>Fim previsto<input type="date" name="fim_previsto" defaultValue={item.end||""}/></label>
      <label>Avanço planejado (%)<input type="number" min="0" max="100" step="0.1" name="avanco_planejado" defaultValue={item.planned}/></label>
      <label>Avanço executado (%)<input type="number" min="0" max="100" step="0.1" name="avanco_real" defaultValue={item.actual}/></label>
      <label className="span2">Descrição<textarea name="descricao" rows={6} defaultValue={item.description||""}/></label>
      <div className="formActions span2"><a href={"/intervencoes/"+id}>Cancelar</a><button type="submit">Salvar alterações</button></div>
    </form>
  </main></AppShell>;
}
