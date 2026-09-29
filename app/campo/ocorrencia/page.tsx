import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { createOccurrence } from "@/app/actions";
import { AlertTriangle } from "lucide-react";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  return <main className="mobileApp occurrenceForm">
    <header><Link href="/campo">←</Link><div><h1>Nova ocorrência</h1><p>Registre uma situação identificada em campo</p></div></header>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="occurrenceIntro"><AlertTriangle/><div><strong>Igreja Matriz de Olinda</strong><span>Intervenção em execução</span></div></div>
    <form action={createOccurrence} className="mobileForm">
      <input type="hidden" name="intervencao_id" value="restauro-matriz"/>
      <label>Título<input name="titulo" required placeholder="Ex.: Infiltração na capela lateral"/></label>
      <label>Categoria<select name="categoria"><option>Umidade / Infiltração</option><option>Estrutura</option><option>Cobertura</option><option>Instalações</option><option>Elementos artísticos</option><option>Segurança</option><option>Outro</option></select></label>
      <label>Descrição<textarea name="descricao" rows={6} placeholder="Descreva o que foi identificado e a providência imediata..."/></label>
      <label>Prazo para retorno<input type="datetime-local" name="prazo"/></label>
      <button type="submit">Registrar ocorrência</button>
    </form>
  </main>;
}
