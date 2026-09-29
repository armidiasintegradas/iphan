import { updatePassword } from "@/app/auth/actions";

export default async function Page({
  searchParams,
}:{
  searchParams:Promise<Record<string,string|undefined>>;
}){
  const q=await searchParams;

  return <main className="loginPage">
    <div className="loginPhoto"/>
    <section className="loginPanel">
      <h1>Definir nova senha</h1>
      <p>Use pelo menos 12 caracteres, com maiúscula, minúscula, número e símbolo.</p>

      {q.erro&&<div className="formNotice error">As senhas precisam coincidir e atender aos requisitos de segurança.</div>}

      <form action={updatePassword}>
        <label>Nova senha<input name="password" type="password" minLength={12} required/></label>
        <label>Confirmar nova senha<input name="confirm_password" type="password" minLength={12} required/></label>
        <button type="submit">Salvar nova senha →</button>
      </form>
    </section>
  </main>
}
