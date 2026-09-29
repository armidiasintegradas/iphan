import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

const publicPaths = ["/login", "/cadastro", "/recuperar-senha", "/redefinir-senha", "/auth/callback", "/api/health"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  let profileActive=true;
  if(user){
    const {data:profile}=await supabase
      .from("perfis")
      .select("ativo")
      .eq("id",user.id)
      .maybeSingle();
    profileActive=profile?.ativo===true;
  }

  if ((!user || !profileActive) && !isPublic) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    if(user && !profileActive) login.searchParams.set("erro","inativo");
    else login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  if (
    user &&
    profileActive &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/cadastro")
  ) {
    const home = request.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
