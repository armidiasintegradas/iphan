import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { createOccurrence } from "@/app/actions";
import { AlertTriangle, ChevronLeft, Mic } from "lucide-react";
import { getInterventionOptions } from "@/lib/data";
import {requirePermission} from "@/lib/authorization";
import VoiceDictationButton from "@/components/VoiceDictationButton";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  await requirePermission("field.write","/campo");
  const interventions = await getInterventionOptions();

  return <main className="mobileApp occurrenceForm approvedMobileFormPage">
    <header className="mobileFormHeader"><Link href="/campo"><ChevronLeft/></Link><div><p>CAMPO</p><h1>Nova ocorrência</h1><span>Registre uma situação identificada em campo.</span></div></header>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="mobileContextCard warning"><AlertTriangle/><div><strong>Registro de campo</strong><span>{q.voice?"Modo de voz · toque no microfone para ditar":"Vincule a uma intervenção ativa"}</span></div><Mic/></div>
    <form action={createOccurrence} className="mobileForm approvedMobileForm">
      <label>Intervenção<select name="intervencao_id" required defaultValue=""><option value="" disabled>Selecione a intervenção</option>{interventions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</select></label>
      <label>Título<input name="titulo" required placeholder="Ex.: Infiltração na capela lateral"/></label>
      <label>Categoria<select name="categoria"><option>Umidade / Infiltração</option><option>Estrutura</option><option>Cobertura</option><option>Instalações</option><option>Elementos artísticos</option><option>Segurança</option><option>Outro</option></select></label>
      <label>Descrição<textarea id="field-occurrence-description" name="descricao" rows={6} placeholder="Descreva o que foi identificado e a providência imediata..."/></label>
      <VoiceDictationButton targetId="field-occurrence-description"/>
      <label>Prazo para retorno<input type="datetime-local" name="prazo"/></label>
      <button type="submit" disabled={!interventions.length}>Registrar ocorrência</button>
    </form>
  </main>;
}