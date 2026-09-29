import AppShell from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import { getHeritageOptions, getInterventionOptions } from "@/lib/data";
import { uploadDocument } from "@/app/documentos/actions";

export default async function Page({
  searchParams,
}:{
  searchParams:Promise<Record<string,string|undefined>>;
}){
  const q=await searchParams;
  const [heritage,interventions]=await Promise.all([
    getHeritageOptions(),
    getInterventionOptions(),
  ]);

  return <AppShell active="/documentos"><main className="pageWrap formPage">
    <div className="pageHead">
      <div><small>Documentos / Novo</small><h1>Novo documento</h1><p>Registre referência externa ou envie um arquivo privado.</p></div>
    </div>

    <FormNotice error={q.erro}/>

    <form action={uploadDocument} className="panel formGrid">
      <label>Contexto
        <select name="contexto" required defaultValue="Intervenção">
          <option>Bem cultural</option>
          <option>Intervenção</option>
          <option>Fiscalização</option>
          <option>Medição</option>
          <option>Decisão</option>
          <option>Conservação</option>
          <option>Outro</option>
        </select>
      </label>

      <label>Título
        <input name="titulo" required placeholder="Ex.: Parecer técnico"/>
      </label>

      <label>Bem cultural
        <select name="bem_id" defaultValue="">
          <option value="">Nenhum</option>
          {heritage.map(h=><option key={h.id} value={h.id}>{h.label}</option>)}
        </select>
      </label>

      <label>Intervenção
        <select name="intervencao_id" defaultValue="">
          <option value="">Nenhuma</option>
          {interventions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
      </label>

      <label>Sistema de origem
        <select name="sistema_origem" defaultValue="Interno">
          <option>Interno</option>
          <option>SEI</option>
          <option>SICG</option>
          <option>Fiscalis</option>
          <option>Transferegov</option>
          <option>Outro</option>
        </select>
      </label>

      <label>Referência externa
        <input name="referencia_externa" placeholder="Processo, protocolo, URL ou código"/>
      </label>

      <label className="span2">Arquivo
        <input type="file" name="arquivo" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"/>
      </label>

      <div className="formActions span2">
        <a href="/documentos">Cancelar</a>
        <button type="submit">Salvar documento</button>
      </div>
    </form>
  </main></AppShell>
}
