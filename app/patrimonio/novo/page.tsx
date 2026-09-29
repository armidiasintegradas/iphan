import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import { createHeritage } from "@/app/actions";
import { Landmark, MapPin } from "lucide-react";
import {requirePermission} from "@/lib/authorization";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  await requirePermission("heritage.write","/patrimonio");
  return <AppShell active="/patrimonio"><main className="pageWrap formPage approvedDesktopFormPage">
    <div className="pageHead"><div><small>Patrimônio / Novo bem</small><h1>Novo bem cultural</h1><p>Cadastre os dados básicos para iniciar o prontuário digital.</p></div></div>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="formContextStrip"><Landmark/><div><strong>Prontuário do patrimônio</strong><span>Este cadastro será a base para intervenções, fiscalizações, documentos e conservação.</span></div><MapPin/></div>
    <form action={createHeritage} className="panel formGrid approvedFormGrid">
      <label className="span2">Nome do bem<input name="nome" required placeholder="Ex.: Igreja de Nossa Senhora..."/></label>
      <label>Município<input name="municipio" required placeholder="Olinda"/></label>
      <label>UF<input name="uf" defaultValue="PE" maxLength={2}/></label>
      <label>Tipologia<select name="tipologia" defaultValue=""><option value="" disabled>Selecionar</option><option>Arquitetura Religiosa</option><option>Arquitetura Civil</option><option>Arquitetura Militar</option><option>Conjunto Urbano</option><option>Sítio Arqueológico</option><option>Paisagem Cultural</option></select></label>
      <label>Nível de proteção<select name="nivel_protecao"><option>Tombamento Federal</option><option>Em estudo</option><option>Outro</option></select></label>
      <div className="formActions span2"><a href="/patrimonio">Cancelar</a><button type="submit">Salvar bem cultural</button></div>
    </form>
  </main></AppShell>;
}