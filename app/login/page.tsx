import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import LoginPasswordField from "@/components/LoginPasswordField";
import FormNotice from "@/components/FormNotice";
import { signIn } from "@/app/auth/actions";

const HERO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA_oaN0zkut2qHvQdMo6vMkeaRVEOSYFRMmO9FGTICsOI3MkGa1jQcXCJrfPxRve4Ot3wE4Tqj3xoIuDVGONo7z72wGRScqlsn5cuZoN_THbU9WXbBV9n-fgJnQxBGyeOhvq8hedBJisKuF3Y8YnEbgc9xi48LHaIDTk_6s2HM1HEucsD4FLombccPHGfes1YUCquEwZXDpiKXuH4WQuKd27fgJsCGYLRn6TFdboXnV41i5HL8uzcTLoSWh5T1j49TeEOs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;

  return (
    <main className="stitchLogin">
      <section
        className="stitchLoginHero"
        aria-label="Fotografia do Patrimônio Histórico"
      >
        <img
          src={HERO_URL}
          alt="Igreja barroca histórica de Pernambuco com escadaria em pedra e céu azul"
        />
        <div className="stitchLoginHeroShade" aria-hidden="true" />

        <div className="stitchLoginLocation">
          <MapPin aria-hidden="true" />
          <span>Igreja da Sé / Matriz de Olinda • Patrimônio Mundial UNESCO</span>
        </div>
      </section>

      <section className="stitchLoginPanel">
        <div className="stitchLoginContours" aria-hidden="true" />

        <div className="stitchLoginInner">
          <header className="stitchLoginBrand">
            <img
              src="/brand/iphan-official.webp"
              alt="IPHAN — Instituto do Patrimônio Histórico e Artístico Nacional"
            />
          </header>

          <div className="stitchLoginTitle">
            <h1>
              Sistema de Gestão
              <br />
              da Preservação
            </h1>

            <div className="stitchLoginContext">
              <span>Superintendência de Pernambuco</span>
              <span className="stitchLoginBeta">
                <i />
                Beta 01
              </span>
            </div>
          </div>

          <FormNotice error={q.erro} />
          {q.senha === "alterada" && (
            <div className="formNotice">
              Senha atualizada. Entre novamente com sua nova senha.
            </div>
          )}
          {q.cadastro === "confirmar-email" && (
            <div className="formNotice">
              Cadastro criado. Confirme o e-mail recebido para concluir o primeiro acesso.
            </div>
          )}

          <form action={signIn} className="stitchLoginForm">
            <label className="stitchLoginField">
              <Mail aria-hidden="true" />
              <input
                name="email"
                type="email"
                required
                placeholder="E-mail institucional"
                autoComplete="email"
              />
            </label>

            <div className="stitchPasswordWrap">
              <LoginPasswordField />
            </div>

            <div className="stitchLoginOptions">
              <label className="stitchRemember">
                <input type="checkbox" name="remember" defaultChecked />
                <span>Manter conectado</span>
              </label>

              <Link href="/recuperar-senha">Esqueci minha senha</Link>
            </div>

            <button type="submit" className="stitchLoginSubmit">
              <span>Entrar</span>
              <ArrowRight aria-hidden="true" />
            </button>
          </form>

          <footer className="stitchLoginFooter">
            <i className="stitchLoginGoldLine" />
            <p>
              Patrimônio que conecta
              <br />
              pessoas e futuros.
            </p>

            <div className="stitchLoginCredentials">
              <span>
                <ShieldCheck aria-hidden="true" />
                Acesso seguro Gov.br
              </span>
              <i>•</i>
              <span>Certificação ICP-Brasil</span>
              <i>•</i>
              <span>IPHAN PE © 2024</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
