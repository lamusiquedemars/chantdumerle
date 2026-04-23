import type { ProductAttribute } from "@/lib/i18n/catalog/formatProductAttribute";

export type SourceProductAttribute = {
  name: string;
  options?: string[] | null;
};

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
    .map((attribute) => ({
      key: attribute.name,
      values: attribute.options.filter(
        (option): option is string => typeof option === "string" && option.length > 0
      ),
    }));
}