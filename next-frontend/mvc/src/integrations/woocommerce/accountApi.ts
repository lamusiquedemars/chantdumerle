import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

export type WooAccountOrder = {
  id: number;
  number: string;
  date: string | null;
  status: string;
  totalHtml: string;
  viewUrl: string;
};

export type WooAccountPayload =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      user: {
        displayName: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
      recentOrders: WooAccountOrder[];
      links: {
        orders: string;
        addresses: string;
        details: string;
        logout: string;
      };
    };

type WooJsonResponse<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  setCookie: string[];
};

const WOO_ACCOUNT_BASE_URL =
  process.env.WOO_BASE_URL ?? process.env.NEXT_PUBLIC_WP_URL;
const WOO_ACCOUNT_READ_TIMEOUT_MS = 2500;
const WOO_ACCOUNT_WRITE_TIMEOUT_MS = 15000;

export async function fetchWooAccount(
  cookieHeader?: string
): Promise<WooAccountPayload> {
  const response = await requestWooJson<WooAccountPayload>("/account", {
    method: "GET",
    cookieHeader,
    timeoutMs: WOO_ACCOUNT_READ_TIMEOUT_MS,
  });

  if (!response.ok || !response.data) {
    return { isLoggedIn: false };
  }

  return response.data;
}

export async function loginWooAccount({
  username,
  password,
  remember,
  cookieHeader,
}: {
  username: string;
  password: string;
  remember: boolean;
  cookieHeader?: string;
}): Promise<WooJsonResponse<WooAccountPayload>> {
  const body = new URLSearchParams({
    username,
    password,
    remember: remember ? "1" : "0",
  });

  return requestWooJson<WooAccountPayload>("/account/login", {
    method: "POST",
    body: body.toString(),
    cookieHeader,
    timeoutMs: WOO_ACCOUNT_WRITE_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

async function requestWooJson<T>(
  endpoint: string,
  options: {
    method: "GET" | "POST";
    body?: string;
    cookieHeader?: string;
    headers?: Record<string, string>;
    timeoutMs: number;
  }
): Promise<WooJsonResponse<T>> {
  if (!WOO_ACCOUNT_BASE_URL) {
    return {
      ok: false,
      status: 503,
      data: null,
      setCookie: [],
    };
  }

  const url = new URL(
    `/wp-json/cdm/v1${endpoint}`,
    WOO_ACCOUNT_BASE_URL
  );

  if (url.hostname.endsWith(".local")) {
    return requestWooJsonWithNodeHttp<T>(url, options);
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs
  );

  try {
    const response = await fetch(url, {
      method: options.method,
      body: options.body,
      headers: {
        ...(options.headers ?? {}),
        ...(options.cookieHeader ? { Cookie: options.cookieHeader } : {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });
    const setCookie =
      (
        response.headers as Headers & {
          getSetCookie?: () => string[];
        }
      ).getSetCookie?.() ??
      splitCombinedSetCookie(response.headers.get("set-cookie"));

    return {
      ok: response.ok,
      status: response.status,
      data: (await response.json().catch(() => null)) as T | null,
      setCookie,
    };
  } catch {
    return {
      ok: false,
      status: 503,
      data: null,
      setCookie: [],
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function requestWooJsonWithNodeHttp<T>(
  url: URL,
  options: {
    method: "GET" | "POST";
    body?: string;
    cookieHeader?: string;
    headers?: Record<string, string>;
    timeoutMs: number;
  }
): Promise<WooJsonResponse<T>> {
  const isHttps = url.protocol === "https:";
  const requestClient = isHttps ? httpsRequest : httpRequest;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (response: WooJsonResponse<T>) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      resolve(response);
    };
    const timeout = setTimeout(() => {
      request.destroy();
      finish({
        ok: false,
        status: 503,
        data: null,
        setCookie: [],
      });
    }, options.timeoutMs);
    const request = requestClient(
      {
        hostname: url.hostname.endsWith(".local") ? "127.0.0.1" : url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: options.method,
        headers: {
          ...(options.headers ?? {}),
          ...(options.body ? { "Content-Length": Buffer.byteLength(options.body) } : {}),
          ...(options.cookieHeader ? { Cookie: options.cookieHeader } : {}),
          ...(url.hostname.endsWith(".local") ? { Host: url.host } : {}),
        },
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          const status = response.statusCode ?? 500;

          finish({
            ok: status >= 200 && status < 300,
            status,
            data: parseJson<T>(text),
            setCookie: Array.isArray(response.headers["set-cookie"])
              ? response.headers["set-cookie"]
              : [],
          });
        });
      }
    );

    request.setTimeout(options.timeoutMs, () => request.destroy());
    request.on("error", () => {
      finish({
        ok: false,
        status: 503,
        data: null,
        setCookie: [],
      });
    });

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });
}

function parseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function splitCombinedSetCookie(header: string | null): string[] {
  if (!header) {
    return [];
  }

  return header.split(/,(?=\s*[^;,]+=[^;,]+)/g).map((value) => value.trim());
}
