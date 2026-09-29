import Link from "next/link";
import { Mail } from "lucide-react";
import { Brand } from "@/components/AppShell";
import LoginPasswordField from "@/components/LoginPasswordField";
import FormNotice from "@/components/FormNotice";
import { signIn } from "@/app/auth/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;

  return (
    <main className="loginPage approvedLogin">
      <figure className="loginPhoto approvedLoginPhoto">
        <img src="/visual/login-hero.webp" alt="" aria-hidden="true"/>
      </figure>

      <section className="loginPanel approvedLoginPanel">
        <div className="loginPanelInner">
          <Brand />

          <h1>Sistema de Gestão<br/>da Preservação</h1>
          <div className="loginSubtitle">
            <span>Superintendência de Pernambuco</span>
            <span className="pill">Beta 01</span>
          </div>

          <FormNotice error={q.erro} />
          {q.senha === "alterada" && <div className="formNotice">Senha atualizada. Entre novamente com sua nova senha.</div>}
          {q.cadastro === "confirmar-email" && <div className="formNotice">Cadastro criado. Confirme o e-mail recebido para concluir o primeiro acesso.</div>}

          <form action={signIn} className="approvedLoginForm">
            <label className="approvedLoginField">
              <Mail aria-hidden="true"/>
              <input name="email" type="email" required placeholder="E-mail institucional" autoComplete="email"/>
            </label>

            <LoginPasswordField/>

            <label className="approvedRemember">
              <input type="checkbox" name="remember"/>
              <span>Manter conectado</span>
            </label>

            <button type="submit" className="approvedLoginSubmit">Entrar <span>→</span></button>
          </form>

          <div className="loginLinks approvedLoginLinks">
            <Link href="/recuperar-senha">Esqueci minha senha</Link>
          </div>

          <div className="loginQuote approvedLoginQuote">
            <i/>
            Patrimônio que conecta<br/>pessoas e futuros.
          </div>
        </div>
      </section>
    </main>
  );
}
