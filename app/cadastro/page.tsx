import Link from "next/link";
import FormNotice from "@/components/FormNotice";
import { Brand } from "@/components/AppShell";
import { signUp } from "@/app/auth/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string,string|undefined>>;
}) {
  const q = await searchParams;

  return (
    <main className="loginPage">
      <div className="loginPhoto" />
      <section className="loginPanel">
        <Brand />
        <h1>Primeiro acesso</h1>
        <p>
          Sistema de Gestão da Preservação <span className="pill">Beta 01</span>
        </p>

        {q.erro==="dominio" ? <div className="formNotice error">Este Beta aceita apenas e-mails institucionais autorizados.</div> : <FormNotice error={q.erro} />}

        <form action={signUp}>
          <label>
            Nome completo
            <input name="name" required placeholder="Seu nome" />
          </label>
          <label>
            E-mail institucional
            <input name="email" type="email" required placeholder="seu.nome@iphan.gov.br" />
          </label>
          <label>
            Senha
            <input name="password" type="password" minLength={12} required placeholder="12+ caracteres, maiúscula, número e símbolo" />
          </label>
          <button type="submit">Criar acesso →</button>
        </form>

        <Link href="/login">Já tenho acesso</Link>
        <div className="loginQuote">
          Novos usuários entram como Consulta.
          <br />
          A liberação de perfil é feita pela gestão.
        </div>
      </section>
    </main>
  );
}
