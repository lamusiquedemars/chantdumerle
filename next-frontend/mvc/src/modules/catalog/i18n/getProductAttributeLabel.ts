import type {
  Locale,
  ProductAttributesDictionary,
} from "./productAttributes";
import { productAttributesDictionary } from "./productAttributes";
import type { AttributeKey } from "./attributes";

/**
 * Label d’attribut
 */
export function getProductAttributeLabel(
  attributeKey: AttributeKey,
  locale: Locale,
  dictionary: ProductAttributesDictionary = productAttributesDictionary
): string {
  return dictionary[attributeKey]?.label?.[locale] ?? attributeKey;
}

/**
 * Label de valeur
 */
export function getProductAttributeValueLabel(
  attributeKey: AttributeKey,
  valueKey: string,
  locale: Locale,
  dictionary: ProductAttributesDictionary = productAttributesDictionary
): string {
  return dictionary[attributeKey]?.values?.[valueKey]?.[locale] ?? valueKey;
}
