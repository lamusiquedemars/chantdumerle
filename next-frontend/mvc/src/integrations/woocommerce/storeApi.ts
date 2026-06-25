/*
 * Client minimal pour la WooCommerce Store API.
 * Cette couche ne connait pas les pages du site: elle expose seulement les
 * types bruts et le fetch JSON commun aux catalogues, packs et fiches produit.
 */
export type WooStoreProduct = {
  id: number;
  name: string;
  slug: string;
  parent?: number;
  type?: string;
  variation?: string;
  sku?: string;
  short_description?: string;
  price_html?: string;
  prices?: {
    price?: string;
    regular_price?: string;
    sale_price?: string;
    price_range?: {
      min_amount?: string;
      max_amount?: string;
    } | null;
    currency_code?: string;
    currency_symbol?: string;
    currency_minor_unit?: number;
    currency_decimal_separator?: string;
    currency_thousand_separator?: string;
    currency_prefix?: string;
    currency_suffix?: string;
  };
  images?: {
    id?: number;
    src?: string;
    thumbnail?: string;
    alt?: string;
  }[];
  brands?: {
    name: string;
    slug: string;
  }[];
  attributes?: WooStoreProductAttribute[];
  variations?: WooStoreProductVariation[];
  has_options?: boolean;
  is_in_stock?: boolean;
  stock_availability?: {
    text?: string;
    class?: string;
  };
};

export type WooStoreProductAttribute = {
  id: number;
  name: string;
  taxonomy: string | null;
  has_variations?: boolean;
  terms: {
    id: number;
    name: string;
    slug: string;
  }[];
};

export type WooStoreProductVariation = {
  id: number;
  attributes: {
    name: string;
    value: string;
  }[];
};

export type WooStoreAttributeTerm = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export type WooStoreCollectionData = {
  attribute_counts?: {
    term: number;
    count: number;
  }[];
};

const WOO_STORE_BASE_URL =
  process.env.WOO_BASE_URL ?? process.env.NEXT_PUBLIC_WP_URL;
const WOO_STORE_TIMEOUT_MS = 25000;

export async function fetchWooStore<T>(
  path: string,
  params: URLSearchParams
): Promise<{
  data: T;
  headers: Headers;
}> {
  if (!WOO_STORE_BASE_URL) {
    throw new Error("WOO_BASE_URL is not defined");
  }

  const url = new URL(`/wp-json/wc/store/v1/${path}`, WOO_STORE_BASE_URL);
  url.search = params.toString();

  // Les domaines MAMP en `.local` peuvent echouer via fetch natif selon DNS.
  // On garde donc un fallback HTTP direct vers 127.0.0.1 avec le Host original.
  if (url.hostname.endsWith(".local")) {
    return fetchWooStoreWithNodeHttp<T>(url);
  }

  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WOO_STORE_TIMEOUT_MS);

  try {
    response = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
  } catch (error) {
    if (!url.hostname.endsWith(".local")) {
      throw error;
    }

    return fetchWooStoreWithNodeHttp<T>(url);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Woo Store API HTTP ${response.status}`);
  }

  return {
    data: (await response.json().catch((error) => {
      throw new Error(`Woo Store API returned invalid JSON: ${error}`);
    })) as T,
    headers: response.headers,
  };
}

async function fetchWooStoreWithNodeHttp<T>(url: URL): Promise<{
  data: T;
  headers: Headers;
}> {
  const isHttps = url.protocol === "https:";
  const client = isHttps ? await import("node:https") : await import("node:http");
  const headers = new Headers();
  const body = await new Promise<string>((resolve, reject) => {
    const request = client.request(
      {
        hostname: url.hostname.endsWith(".local") ? "127.0.0.1" : url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: "GET",
        headers: url.hostname.endsWith(".local")
          ? {
              Host: url.host,
            }
          : undefined,
      },
      (response) => {
        const chunks: Buffer[] = [];

        for (const [name, value] of Object.entries(response.headers)) {
          if (Array.isArray(value)) {
            headers.set(name, value.join(", "));
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }

        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const statusCode = response.statusCode ?? 500;
          const text = Buffer.concat(chunks).toString("utf8");

          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Woo Store API HTTP ${statusCode}`));
            return;
          }

          resolve(text);
        });
      }
    );

    request.setTimeout(WOO_STORE_TIMEOUT_MS, () => {
      request.destroy(
        new Error(`Woo Store API timed out after ${WOO_STORE_TIMEOUT_MS}ms`)
      );
    });
    request.on("error", reject);
    request.end();
  });

  return {
    data: JSON.parse(body) as T,
    headers,
  };
}
