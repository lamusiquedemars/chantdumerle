export const WOO_CART_TOKEN_COOKIE = "cdm_woo_cart_token";

const WOO_STORE_TIMEOUT_MS = 12_000;

type WooStoreRequestInput = {
  baseUrl: string;
  cartToken?: string;
};

type AddWooProductToCartInput = WooStoreRequestInput & {
  productId: number;
  quantity: number;
};

type WooStoreError = {
  message?: string;
  code?: string;
};

function makeWooStoreUrl(baseUrl: string, path: string) {
  return new URL(`/wp-json/wc/store/v1${path}`, baseUrl).toString();
}

async function readWooStoreJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`Woo Store API returned invalid JSON (${response.status})`);
  }
}

function readWooStoreError(json: unknown, fallback: string) {
  if (typeof json === "object" && json !== null) {
    const message = (json as WooStoreError).message;

    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }
  }

  return fallback;
}

async function fetchWooStore(
  url: string,
  init: RequestInit,
  fallbackError: string
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WOO_STORE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
    const json = await readWooStoreJson(response);

    if (!response.ok) {
      throw new Error(
        readWooStoreError(json, `${fallbackError} (${response.status})`)
      );
    }

    return {
      json,
      cartToken: response.headers.get("Cart-Token") ?? undefined,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("WooCommerce ne répond pas assez vite pour le panier.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getWooCart({ baseUrl, cartToken }: WooStoreRequestInput) {
  return fetchWooStore(
    makeWooStoreUrl(baseUrl, "/cart"),
    {
      method: "GET",
      headers: {
        ...(cartToken ? { "Cart-Token": cartToken } : {}),
      },
    },
    "Impossible de charger le panier WooCommerce"
  );
}

export async function addWooProductToCart({
  baseUrl,
  productId,
  quantity,
  cartToken,
}: AddWooProductToCartInput) {
  return fetchWooStore(
    makeWooStoreUrl(baseUrl, "/cart/add-item"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cartToken ? { "Cart-Token": cartToken } : {}),
      },
      body: JSON.stringify({
        id: productId,
        quantity,
      }),
    },
    "Impossible d’ajouter ce produit au panier WooCommerce"
  );
}

export function getCartItemCount(cartLike: unknown) {
  if (typeof cartLike !== "object" || cartLike === null) {
    return 0;
  }

  if ("items_count" in cartLike) {
    const itemsCount = Number((cartLike as { items_count?: unknown }).items_count);

    if (Number.isFinite(itemsCount)) {
      return itemsCount;
    }
  }

  if ("items" in cartLike && Array.isArray((cartLike as { items?: unknown }).items)) {
    return (cartLike as { items: unknown[] }).items.reduce<number>((total, item) => {
      if (typeof item !== "object" || item === null || !("quantity" in item)) {
        return total;
      }

      const quantity = Number((item as { quantity?: unknown }).quantity);

      return total + (Number.isFinite(quantity) ? quantity : 0);
    }, 0);
  }

  return 0;
}
