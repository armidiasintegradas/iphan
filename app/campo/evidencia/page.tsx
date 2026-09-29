import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { uploadEvidence } from "@/app/evidencias/actions";
import { Camera } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;

  return (
    <main className="mobileApp occurrenceForm">
      <header>
        <Link href="/campo">←</Link>
        <div>
          <h1>Nova evidência</h1>
          <p>Registre o estado do patrimônio em campo</p>
        </div>
      </header>

      <FormNotice demo={q.demo} error={q.erro} />

      <div className="occurrenceIntro">
        <Camera />
        <div>
          <strong>Igreja Matriz de Olinda</strong>
          <span>Restauração em execução</span>
        </div>
      </div>

      <form action={uploadEvidence} className="mobileForm">
        <input type="hidden" name="intervencao_id" value="restauro-matriz" />

        <label>
          Etapa
          <select name="etapa" defaultValue="durante">
            <option value="antes">Antes</option>
            <option value="durante">Durante</option>
            <option value="depois">Depois</option>
          </select>
        </label>

        <label>
          Foto ou arquivo
          <input
            type="file"
            name="arquivo"
            accept="image/*,.pdf"
            capture="environment"
            required
          />
        </label>

        <label>
          Legenda / observação
          <textarea
            name="legenda"
            rows={4}
            placeholder="Ex.: Fachada oeste após remoção do revestimento deteriorado."
          />
        </label>

        <button type="submit">Salvar evidência</button>
      </form>
    </main>
  );
}
