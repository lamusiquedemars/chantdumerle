import type { AttributeKey } from "./attributes";
import type { ProductAttribute } from "./formatProductAttribute";

export type SourceProductAttribute = {
  name: string;
  options?: string[] | null;
};

function isAttributeKey(value: string): value is AttributeKey {
  return [
    "brand",
    "model",
    "instrument",
    "string",
    "size",
    "tension",
    "end",
    "core",
    "winding",
  ].includes(value);
}

export function mapProductAttributes(
  attributes: SourceProductAttribute[] = []
): ProductAttribute[] {
  return attributes
    .filter(
      (attribute): attribute is { name: string; options: string[] } =>
        !!attribute &&
        typeof attribute.name === "string" &&
        Array.isArray(attribute.options) &&
        attribute.options.length > 0
    )
    .filter(
      (
        attribute
      ): attribute is { name: AttributeKey; options: string[] } =>
        isAttributeKey(attribute.name)
    )
    .map((attribute) => ({
      key: attribute.name,
      values: attribute.options.filter(
        (option): option is string =>
          typeof option === "string" && option.trim().length > 0
      ),
    }));
}
