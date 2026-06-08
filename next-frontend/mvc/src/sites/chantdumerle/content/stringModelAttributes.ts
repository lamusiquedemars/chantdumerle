import {
  chantDuMerleStringModelAttributes,
  type StringModelAttributeReference,
} from "@/sites/chantdumerle/content/stringModelAttributes.generated";

export type StringModelAttributeKey =
  | "soundProfile"
  | "complexity"
  | "power"
  | "response"
  | "musicianUsage"
  | "pricePositioning"
  | "durability"
  | "tuningStability"
  | "breakInTime";

function normalizeStringModelText(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’–—]/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return normalized
    .split(" ")
    .map((word) => {
      if (word === "chorme") return "chrome";
      if (word === "azul") return "bleu";
      if (word === "roja" || word === "rojo") return "rouge";
      return word;
    })
    .join(" ");
}

export function makeStringModelAttributeKey(
  brand: string,
  model: string
): string {
  return `${normalizeStringModelText(brand)}|${normalizeStringModelText(model)}`;
}

const attributesByKey = new Map(
  chantDuMerleStringModelAttributes.map((item) => [item.key, item])
);

export function getStringModelAttributes(
  brand?: string | null,
  model?: string | null
): StringModelAttributeReference | undefined {
  if (!brand || !model) {
    return undefined;
  }

  return attributesByKey.get(makeStringModelAttributeKey(brand, model));
}

export function getStringModelAttributeValues(
  attribute: StringModelAttributeKey
): string[] {
  const values = new Set<string>();

  for (const item of chantDuMerleStringModelAttributes) {
    const value = item[attribute];

    if (Array.isArray(value)) {
      for (const entry of value) {
        values.add(entry);
      }
      continue;
    }

    if (value) {
      values.add(value);
    }
  }

  return [...values].sort((left, right) => left.localeCompare(right, "fr"));
}

export function stringModelMatchesAttribute(
  item: StringModelAttributeReference | undefined,
  attribute: StringModelAttributeKey,
  expectedValue: string
): boolean {
  if (!item) {
    return false;
  }

  const value = item[attribute];

  if (Array.isArray(value)) {
    return value.includes(expectedValue);
  }

  return value === expectedValue;
}

export { chantDuMerleStringModelAttributes };
export type { StringModelAttributeReference };
