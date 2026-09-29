import Link from "next/link";
import { Brand } from "@/components/AppShell";
import { requestPasswordReset } from "@/app/auth/actions";

export default async function Page({
  searchParams,
}:{
  searchParams:Promise<Record<string,string|undefined>>;
}){
  const q=await searchParams;

  return <main className="loginPage">
    <div className="loginPhoto"/>
    <section className="loginPanel">
      <Brand/>
      <h1>Recuperar acesso</h1>
      <p>Informe o e-mail cadastrado para receber o link de redefinição.</p>

      {q.enviado&&<div className="formNotice">Se o e-mail estiver cadastrado, você receberá as instruções para redefinir a senha.</div>}
      {q.erro&&<div className="formNotice error">Não foi possível iniciar a recuperação. Verifique o e-mail e tente novamente.</div>}

      <form action={requestPasswordReset}>
        <label>E-mail<input name="email" type="email" required placeholder="seu.nome@iphan.gov.br"/></label>
        <button type="submit">Enviar link de recuperação →</button>
      </form>

      <Link href="/login">Voltar para entrar</Link>
    </section>
  </main>
}
