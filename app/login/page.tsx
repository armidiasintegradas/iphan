import { Brand } from "@/components/AppShell";
import FormNotice from "@/components/FormNotice";
import { signIn } from "@/app/auth/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;

  return (
    <main className="loginPage">
      <div className="loginPhoto" />
      <section className="loginPanel">
        <Brand />
        <h1>
          Sistema de Gestão
          <br />
          da Preservação
        </h1>
        <p>
          Superintendência de Pernambuco <span className="pill">Beta 01</span>
        </p>

        <FormNotice demo={q.demo} error={q.erro} />

        <form action={signIn}>
          <label>
            E-mail institucional
            <input name="email" type="email" required placeholder="seu.nome@iphan.gov.br" />
          </label>
          <label>
            Senha
            <input name="password" type="password" required placeholder="••••••••" />
          </label>
          <label className="check">
            <input type="checkbox" name="remember" /> Manter conectado
          </label>
          <button type="submit">Entrar →</button>
        </form>

        <a href="#">Esqueci minha senha</a>
        <div className="loginQuote">
          Patrimônio que conecta
          <br />
          pessoas e futuros.
        </div>
      </section>
    </main>
  );
}
