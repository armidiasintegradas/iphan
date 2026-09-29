import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { createOccurrence } from "@/app/actions";
import { AlertTriangle } from "lucide-react";
import { getInterventionOptions } from "@/lib/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  const interventions = await getInterventionOptions();

  return <main className="mobileApp occurrenceForm">
    <header><Link href="/campo">←</Link><div><h1>Nova ocorrência</h1><p>Registre uma situação identificada em campo</p></div></header>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="occurrenceIntro"><AlertTriangle/><div><strong>Registro de campo</strong><span>Vincule a uma intervenção ativa</span></div></div>
    <form action={createOccurrence} className="mobileForm">
      <label>Intervenção<select name="intervencao_id" required defaultValue=""><option value="" disabled>Selecione a intervenção</option>{interventions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</select></label>
      <label>Título<input name="titulo" required placeholder="Ex.: Infiltração na capela lateral"/></label>
      <label>Categoria<select name="categoria"><option>Umidade / Infiltração</option><option>Estrutura</option><option>Cobertura</option><option>Instalações</option><option>Elementos artísticos</option><option>Segurança</option><option>Outro</option></select></label>
      <label>Descrição<textarea name="descricao" rows={6} placeholder="Descreva o que foi identificado e a providência imediata..."/></label>
      <label>Prazo para retorno<input type="datetime-local" name="prazo"/></label>
      <button type="submit" disabled={!interventions.length}>Registrar ocorrência</button>
    </form>
  </main>;
}