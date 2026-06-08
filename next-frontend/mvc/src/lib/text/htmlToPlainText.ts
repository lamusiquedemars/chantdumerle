const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  copy: "(c)",
  euro: "€",
  gt: ">",
  laquo: "«",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  nbsp: " ",
  quot: '"',
  raquo: "»",
  rdquo: "”",
  rsquo: "’",
};

function decodeNumericHtmlEntity(
  value: string,
  radix: 10 | 16
): string | undefined {
  const codePoint = Number.parseInt(value, radix);

  if (!Number.isFinite(codePoint)) {
    return undefined;
  }

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return undefined;
  }
}

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi,
    (entity, code: string) => {
      if (code.startsWith("#x")) {
        return decodeNumericHtmlEntity(code.slice(2), 16) ?? entity;
      }

      if (code.startsWith("#")) {
        return decodeNumericHtmlEntity(code.slice(1), 10) ?? entity;
      }

      return HTML_ENTITIES[code.toLowerCase()] ?? entity;
    }
  );
}

function decodeHtmlEntitiesDeep(value: string): string {
  let decoded = value;

  for (let pass = 0; pass < 3; pass += 1) {
    const next = decodeHtmlEntities(decoded);

    if (next === decoded) {
      return decoded;
    }

    decoded = next;
  }

  return decoded;
}

export function htmlToPlainText(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const text = decodeHtmlEntitiesDeep(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || undefined;
}
