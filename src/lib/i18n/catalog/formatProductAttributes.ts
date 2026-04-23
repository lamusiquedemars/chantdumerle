import type { Locale } from "./productAttributes";
import type {
  ProductAttribute,
  FormattedProductAttribute,
} from "./formatProductAttribute";
import { formatProductAttribute } from "./formatProductAttribute";
import { PRODUCT_ATTRIBUTE_ORDER } from "./productAttributeOrder";

export function formatProductAttributes(
  attributes: ProductAttribute[] = [],
  locale: Locale
): FormattedProductAttribute[] {
  const formatted: FormattedProductAttribute[] = attributes
    .filter(
      (attribute) =>
        attribute &&
        attribute.key &&
        Array.isArray(attribute.values) &&
        attribute.values.length > 0
    )
    .map((attribute) => formatProductAttribute(attribute, locale));

  return formatted.sort((a, b) => {
    const indexA = PRODUCT_ATTRIBUTE_ORDER.indexOf(a.key);
    const indexB = PRODUCT_ATTRIBUTE_ORDER.indexOf(b.key);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}