import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getCartItemCount,
  getWooCart,
  WOO_CART_TOKEN_COOKIE,
} from "@/modules/commerce/services/wooCart";

const wooBaseUrl =
  process.env.WOO_BASE_URL ??
  process.env.NEXT_PUBLIC_WP_URL ??
  process.env.WP_GRAPHQL_URL?.replace(/\/graphql\/?$/, "");

export async function GET() {
  if (!wooBaseUrl) {
    return NextResponse.json(
      { error: "WooCommerce URL is not defined" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const cartToken = cookieStore.get(WOO_CART_TOKEN_COOKIE)?.value;

  try {
    const { json: cart, cartToken: nextCartToken } = await getWooCart({
      baseUrl: wooBaseUrl,
      cartToken,
    });

    const response = NextResponse.json({
      cart,
      itemCount: getCartItemCount(cart),
    });

    if (nextCartToken) {
      response.cookies.set(WOO_CART_TOKEN_COOKIE, nextCartToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown cart error" },
      { status: 500 }
    );
  }
}
