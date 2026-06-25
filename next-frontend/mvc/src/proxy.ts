import { NextResponse, type NextRequest } from "next/server";

const wooProxyTarget =
  process.env.WOO_PROXY_TARGET ??
  process.env.WOO_BASE_URL ??
  process.env.NEXT_PUBLIC_WP_URL;
const normalizedWooProxyTarget = wooProxyTarget?.replace(/\/$/, "");

export function proxy(request: NextRequest) {
  const wcAjaxEndpoint = request.nextUrl.searchParams.get("wc-ajax");

  if (!wcAjaxEndpoint || !normalizedWooProxyTarget) {
    return NextResponse.next();
  }

  const destination = new URL("/", normalizedWooProxyTarget);

  request.nextUrl.searchParams.forEach((value, key) => {
    destination.searchParams.set(key, value);
  });

  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
