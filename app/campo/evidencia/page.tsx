import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { uploadEvidence } from "@/app/evidencias/actions";
import { Camera } from "lucide-react";
import { getInterventionOptions } from "@/lib/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  const interventions = await getInterventionOptions();

  return <main className="mobileApp occurrenceForm">
    <header><Link href="/campo">←</Link><div><h1>Nova evidência</h1><p>Registre o estado do patrimônio em campo</p></div></header>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="occurrenceIntro"><Camera/><div><strong>Registro técnico</strong><span>Antes · Durante · Depois</span></div></div>
    <form action={uploadEvidence} className="mobileForm">
      <label>Intervenção<select name="intervencao_id" required defaultValue=""><option value="" disabled>Selecione a intervenção</option>{interventions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</select></label>
      <label>Etapa<select name="etapa" defaultValue="durante"><option value="antes">Antes</option><option value="durante">Durante</option><option value="depois">Depois</option></select></label>
      <label>Foto ou arquivo<input type="file" name="arquivo" accept="image/*,.pdf" required/></label>
      <label>Legenda / observação<textarea name="legenda" rows={4} placeholder="Ex.: Fachada oeste após remoção do revestimento deteriorado."/></label>
      <button type="submit" disabled={!interventions.length}>Salvar evidência</button>
    </form>
  </main>;
}