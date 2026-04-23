import type { Locale } from "./productAttributes";
import {
  getProductAttributeLabel,
  getProductAttributeValueLabel,
} from "./getProductAttributeLabel";

export type ProductAttribute = {
  key: string;
  values: string[];
};

export type FormattedProductAttribute = {
  key: string;
  label: string;
  values: string[];
};

export function formatProductAttribute(
  attribute: ProductAttribute,
  locale: Locale
): FormattedProductAttribute {
  return {
    key: attribute.key,
    label: getProductAttributeLabel(attribute.key, locale),
    values: attribute.values.map((value) =>
      getProductAttributeValueLabel(attribute.key, value, locale)
    ),
  };
}