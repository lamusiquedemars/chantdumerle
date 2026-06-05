import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  addWooProductToCart,
  cleanWooSessionHeader,
  WOO_SESSION_COOKIE,
} from "../services/wooCart";

const endpoint = process.env.WP_GRAPHQL_URL;

function readPositiveInteger(value: unknown) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
}

// Handler Next.js fin : validation HTTP, session Woo et delegation au service.
export async function POST(request: Request) {
  if (!endpoint) {
    return NextResponse.json(
      { error: "WP_GRAPHQL_URL is not defined" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const productId = readPositiveInteger(body.productId);
  const quantity = readPositiveInteger(body.quantity ?? 1);

  if (!productId) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }

  if (!quantity) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const wooSession = cookieStore.get(WOO_SESSION_COOKIE)?.value;

  try {
    const { cart, nextWooSession } = await addWooProductToCart({
      endpoint,
      productId,
      quantity,
      wooSession,
    });

    const response = NextResponse.json(cart);

    if (nextWooSession) {
      response.cookies.set(
        WOO_SESSION_COOKIE,
        cleanWooSessionHeader(nextWooSession),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown cart error" },
      { status: 500 }
    );
  }
}
