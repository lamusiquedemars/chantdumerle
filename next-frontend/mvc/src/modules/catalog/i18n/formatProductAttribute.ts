import type { Locale } from "./productAttributes";
import type { AttributeKey } from "./attributes";
import {
  getProductAttributeLabel,
  getProductAttributeValueLabel,
} from "./getProductAttributeLabel";

export type ProductAttribute = {
  key: AttributeKey;
  values: string[];
};

export type FormattedProductAttribute = {
  key: AttributeKey;
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
