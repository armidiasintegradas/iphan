import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import {getHeritageById} from "@/lib/data";
import {updateHeritage} from "@/app/actions";
import {notFound} from "next/navigation";
import {Landmark, Pencil} from "lucide-react";
import {requirePermission} from "@/lib/authorization";

export default async function Page({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string|undefined>>}){
  const [{id},q]=await Promise.all([params,searchParams]);
  await requirePermission("heritage.write","/patrimonio");
  const h=await getHeritageById(id);
  if(!h) notFound();

  return <AppShell active="/patrimonio"><main className="pageWrap formPage approvedDesktopFormPage">
    <div className="pageHead"><div><small>Patrimônio / Editar</small><h1>Editar bem cultural</h1><p>Atualize os dados básicos do prontuário.</p></div></div>
    <FormNotice error={q.erro}/>
    <div className="formContextStrip"><Landmark/><div><strong>{h.name}</strong><span>{h.city||"Localização não informada"}</span></div><Pencil/></div>
    <form action={updateHeritage} className="panel formGrid approvedFormGrid">
      <input type="hidden" name="id" value={id}/>
      <label className="span2">Nome do bem<input name="nome" required defaultValue={h.name}/></label>
      <label>Município<input name="municipio" required defaultValue={h.municipality||""}/></label>
      <label>UF<input name="uf" required maxLength={2} defaultValue={h.uf||"PE"}/></label>
      <label>Tipologia<input name="tipologia" required defaultValue={h.type||""}/></label>
      <label>Nível de proteção<input name="nivel_protecao" required defaultValue={h.protection||""}/></label>
      <label className="span2">Descrição<textarea name="descricao" rows={6} defaultValue={h.description||""}/></label>
      <div className="formActions span2"><a href={"/patrimonio/"+id}>Cancelar</a><button type="submit">Salvar alterações</button></div>
    </form>
  </main></AppShell>;
}
