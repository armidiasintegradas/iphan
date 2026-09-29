import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { uploadEvidence } from "@/app/evidencias/actions";
import { Camera, ImagePlus, ChevronLeft } from "lucide-react";
import { getInterventionOptions, getMeasurementOptions } from "@/lib/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  const q = await searchParams;
  const [interventions, measurements] = await Promise.all([getInterventionOptions(), getMeasurementOptions()]);

  return <main className="mobileApp occurrenceForm approvedMobileFormPage">
    <header className="mobileFormHeader"><Link href="/campo"><ChevronLeft/></Link><div><p>CAMPO</p><h1>Nova evidência</h1><span>Registre o estado do patrimônio em campo.</span></div></header>
    <FormNotice demo={q.demo} error={q.erro}/>
    <div className="mobileContextCard"><Camera/><div><strong>Registro técnico</strong><span>Antes · Durante · Depois</span></div></div>
    <form action={uploadEvidence} className="mobileForm approvedMobileForm">
      <label>Intervenção<select name="intervencao_id" required defaultValue=""><option value="" disabled>Selecione a intervenção</option>{interventions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</select></label>
      <label>Medição vinculada <small className="fieldHint">Opcional · use quando a evidência comprovar uma medição</small><select name="medicao_id" defaultValue=""><option value="">Sem vínculo com medição</option>{measurements.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
      <label>Etapa<select name="etapa" defaultValue="durante"><option value="antes">Antes</option><option value="durante">Durante</option><option value="depois">Depois</option></select></label>
      <label className="fileDrop"><ImagePlus/><strong>Adicionar foto ou arquivo</strong><span>Imagem ou PDF</span><input type="file" name="arquivo" accept="image/*,.pdf" required/></label>
      <label>Legenda / observação<textarea name="legenda" rows={4} placeholder="Ex.: Fachada oeste após remoção do revestimento deteriorado."/></label>
      <button type="submit" disabled={!interventions.length}>Salvar evidência</button>
    </form>
  </main>;
}