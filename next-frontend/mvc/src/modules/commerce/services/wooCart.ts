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

export const WOO_SESSION_COOKIE = "cdm_woo_session";

type GraphQLError = {
  message: string;
};

type AddToCartVariables = {
  productId: number;
  quantity: number;
};

type AddToCartResponse = {
  data?: {
    addToCart: unknown;
  };
  errors?: GraphQLError[];
};

type AddWooProductToCartInput = AddToCartVariables & {
  endpoint: string;
  wooSession?: string;
};

export function cleanWooSessionHeader(value: string) {
  return value.replace(/^Session\s+/i, "");
}

// Appelle WooGraphQL et renvoie le panier ainsi que la session éventuelle.
export async function addWooProductToCart({
  endpoint,
  productId,
  quantity,
  wooSession,
}: AddWooProductToCartInput) {
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

  const json = (await res.json()) as AddToCartResponse;

  if (json.errors) {
    throw new Error(json.errors.map((error) => error.message).join(" | "));
  }

  return {
    cart: json.data?.addToCart,
    nextWooSession: res.headers.get("woocommerce-session"),
  };
}
