import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const endpoint = process.env.WP_GRAPHQL_URL;

const WOO_SESSION_COOKIE = "cdm_woo_session";

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($productId: Int!, $quantity: Int) {
    addToCart(
      input: {
        productId: $productId
        quantity: $quantity
      }
    ) {
      cartItem {
        key
        quantity
        product {
          node {
            databaseId
            name
            slug
          }
        }
      }
      cart {
        contents {
          nodes {
            key
            quantity
            product {
              node {
                databaseId
                name
                slug
              }
            }
          }
        }
        subtotal
        total
      }
    }
  }
`;

function cleanWooSessionHeader(value: string) {
  return value.replace(/^Session\s+/i, "");
}

export async function POST(request: Request) {
  if (!endpoint) {
    return NextResponse.json(
      { error: "WP_GRAPHQL_URL is not defined" },
      { status: 500 }
    );
  }

  const body = await request.json();

  const productId = Number(body.productId);
  const quantity = Number(body.quantity ?? 1);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid productId" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return NextResponse.json(
      { error: "Invalid quantity" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const wooSession = cookieStore.get(WOO_SESSION_COOKIE)?.value;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(wooSession
        ? { "woocommerce-session": `Session ${wooSession}` }
        : {}),
    },
    body: JSON.stringify({
      query: ADD_TO_CART_MUTATION,
      variables: {
        productId,
        quantity,
      },
    }),
    cache: "no-store",
  });

  const json = await res.json();

  if (json.errors) {
    return NextResponse.json(
      {
        error: json.errors
          .map((error: { message: string }) => error.message)
          .join(" | "),
      },
      { status: 500 }
    );
  }

  const response = NextResponse.json(json.data.addToCart);

  const nextWooSession = res.headers.get("woocommerce-session");

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
}