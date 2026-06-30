import { NextResponse, type NextRequest } from "next/server";
import { loginWooAccount } from "@/integrations/woocommerce/accountApi";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "1";
  const cookieHeader = request.headers.get("cookie") ?? undefined;

  if (!username || !password) {
    return NextResponse.redirect(
      new URL("/fr/mon-compte?erreur=champs", request.url),
      303
    );
  }

  const login = await loginWooAccount({
    username,
    password,
    remember,
    cookieHeader,
  });

  if (!login.ok || !login.data?.isLoggedIn) {
    return NextResponse.redirect(
      new URL("/fr/mon-compte?erreur=identifiants", request.url),
      303
    );
  }

  const response = NextResponse.redirect(
    new URL("/fr/mon-compte?connexion=ok", request.url),
    303
  );

  for (const cookie of login.setCookie) {
    response.headers.append("Set-Cookie", cookie);
  }

  return response;
}
