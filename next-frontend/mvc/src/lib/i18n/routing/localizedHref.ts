export function localizedHref(locale: string, path: string = ""): string {
  const safeLocale = locale.replace(/^\/+|\/+$/g, "");
  const safePath = path && path.startsWith("/") ? path : `/${path}`;

  if (!safeLocale) {
    return safePath || "/";
  }

  return `/${safeLocale}${path ? safePath : ""}`;
}
