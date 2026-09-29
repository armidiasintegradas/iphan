import {Mail,LockKeyhole,Eye} from "lucide-react";
import Link from "next/link";

export default function Page(){
  return <main className="loginPage approvedLogin previewLogin">
    <figure className="loginPhoto approvedLoginPhoto"><img src="/visual/login-hero.webp" alt=""/></figure>
    <section className="loginPanel approvedLoginPanel">
      <div className="loginPanelInner">
        <div className="iphanBrand" aria-label="Iphan"><span className="iphanBrandExact"/></div>
        <h1>Sistema de Gestão<br/>da Preservação</h1>
        <div className="loginSubtitle"><span>Superintendência de Pernambuco</span><span className="pill">Beta 01</span></div>
        <div className="approvedLoginForm">
          <label className="approvedLoginField"><Mail/><input readOnly placeholder="E-mail institucional"/></label>
          <label className="approvedLoginField"><LockKeyhole/><input readOnly type="password" value="************"/><button type="button" className="loginEye"><Eye/></button></label>
          <label className="approvedRemember"><input type="checkbox" defaultChecked/><span>Manter conectado</span></label>
          <button type="button" className="approvedLoginSubmit">Entrar <span>→</span></button>
        </div>
        <div className="loginLinks approvedLoginLinks"><span>Esqueci minha senha</span></div>
        <div className="loginQuote approvedLoginQuote"><i/>Patrimônio que conecta<br/>pessoas e futuros.</div>
        <Link href="/preview" className="previewBack">← Voltar às telas</Link>
      </div>
    </section>
  </main>;
}
