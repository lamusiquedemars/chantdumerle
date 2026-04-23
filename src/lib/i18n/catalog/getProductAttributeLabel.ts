import type {
  Locale,
  ProductAttributesDictionary,
} from "./productAttributes";
import { productAttributesDictionary } from "./productAttributes";

/**
 * Retourne le label traduit d'un attribut.
 * Fallback : la clé technique si introuvable.
 */
export function getProductAttributeLabel(
  attributeKey: string,
  locale: Locale,
  dictionary: ProductAttributesDictionary = productAttributesDictionary
): string {
  return dictionary[attributeKey]?.label?.[locale] ?? attributeKey;
}

/**
 * Retourne le label traduit d'une valeur d'attribut.
 * Fallback : la clé technique si introuvable.
 */
export function getProductAttributeValueLabel(
  attributeKey: string,
  valueKey: string,
  locale: Locale,
  dictionary: ProductAttributesDictionary = productAttributesDictionary
): string {
  return dictionary[attributeKey]?.values?.[valueKey]?.[locale] ?? valueKey;
}