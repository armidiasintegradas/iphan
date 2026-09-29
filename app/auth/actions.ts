"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?erro=credenciais");

  redirect("/");
}

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 8) {
    redirect("/cadastro?erro=dados");
  }

  const allowedDomains=(process.env.IPHAN_ALLOWED_EMAIL_DOMAINS || "iphan.gov.br")
    .split(",")
    .map((domain)=>domain.trim().toLowerCase())
    .filter(Boolean);
  const emailDomain=email.split("@").pop()?.toLowerCase() || "";

  if(!allowedDomains.includes(emailDomain)){
    redirect("/cadastro?erro=dominio");
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) redirect("/cadastro?erro=cadastro");

  if (data.session) redirect("/");
  redirect("/login?cadastro=confirmar-email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}


export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) redirect("/recuperar-senha?erro=email");

  const supabase = await createClient();
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
  });

  if (error) redirect("/recuperar-senha?erro=envio");
  redirect("/recuperar-senha?enviado=1");
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (password.length < 8 || password !== confirmPassword) {
    redirect("/redefinir-senha?erro=dados");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) redirect("/redefinir-senha?erro=salvar");

  await supabase.auth.signOut();
  redirect("/login?senha=alterada");
}
