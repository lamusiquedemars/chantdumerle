import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { WooStoreProduct } from "@/integrations/woocommerce/storeApi";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";

export type GraphQLProductNode = {
  __typename: "SimpleProduct" | "VariableProduct" | string;
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;
  productCategories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaMarque?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaInstrument?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaModele?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaCorde?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaTaille?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaTension?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaTypeProduit?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaProfilSonore?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  allPaUsage?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
};

const PRODUCT_DETAIL_BASE_PATH = "produits";

export function normalizeLocale(locale?: string | null): string {
  if (!locale || locale === "undefined" || locale === "null") {
    return "fr";
  }
  return locale;
}

function firstTermName(
  connection?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null
): string | undefined {
  return connection?.nodes[0]?.name;
}

function makeCardMetadataItem(label: string, value?: string) {
  if (!value) {
    return undefined;
  }

  return {
    label,
    value,
  };
}

function mapStringProductMetadata(product: GraphQLProductNode) {
  return [
    makeCardMetadataItem("Instrument", firstTermName(product.allPaInstrument)),
    makeCardMetadataItem("Corde", firstTermName(product.allPaCorde)),
    makeCardMetadataItem("Taille", firstTermName(product.allPaTaille)),
    makeCardMetadataItem("Tension", firstTermName(product.allPaTension)),
  ].filter((item): item is { label: string; value: string } => Boolean(item));
}

export function isStringProductCard(product: GraphQLProductNode): boolean {
  return !product.allPaTypeProduit?.nodes.some(
    (term) => term.slug === "colophane"
  );
}

/*
 * Mapper WooGraphQL -> ProductCardItem.
 * Utilise les champs GraphQL historiques encore presents sur certaines requetes.
 */
export function mapProductToCard(
  product: GraphQLProductNode,
  locale: string = "fr",
  options: {
    includeStringMetadata?: boolean;
  } = {}
): ProductCardItem {
  const brand = product.allPaMarque?.nodes[0]?.name;
  const safeLocale = normalizeLocale(locale);
  const metadata = options.includeStringMetadata
    ? mapStringProductMetadata(product)
    : undefined;

  return {
    title: product.name,
    href: `/${safeLocale}/${PRODUCT_DETAIL_BASE_PATH}/${product.slug}`,
    description: options.includeStringMetadata
      ? undefined
      : htmlToPlainText(product.shortDescription),
    price: htmlToPlainText(product.price ?? product.regularPrice),
    image: product.image?.sourceUrl ?? undefined,
    brand,
    metadata,
  };
}

export function getStoreAttributeValues(
  product: WooStoreProduct,
  taxonomy: string
): string[] {
  return (
    product.attributes
      ?.find((attribute) => attribute.taxonomy === taxonomy)
      ?.terms.map((term) => term.name)
      .filter(Boolean) ?? []
  );
}

function getStoreAttribute(product: WooStoreProduct, taxonomy: string) {
  return product.attributes?.find(
    (attribute) => attribute.taxonomy === taxonomy
  );
}

function getCardAttributeValue(
  product: WooStoreProduct,
  taxonomy: string
): string | undefined {
  const attribute = getStoreAttribute(product, taxonomy);
  const values = attribute?.terms.map((term) => term.name).filter(Boolean) ?? [];

  if (values.length === 0) {
    return undefined;
  }

  if (attribute?.has_variations && values.length > 1) {
    return "Plusieurs";
  }

  return values[0];
}

function formatStoreAmount(
  product: WooStoreProduct,
  locale: string,
  amount?: string
): string | undefined {
  if (!amount) {
    return undefined;
  }

  const minorUnit = product.prices?.currency_minor_unit ?? 2;
  const numericAmount = Number(amount) / 10 ** minorUnit;

  if (!Number.isFinite(numericAmount)) {
    return undefined;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: product.prices?.currency_code ?? "EUR",
  }).format(numericAmount);
}

function formatStoreProductPrice(
  product: WooStoreProduct,
  locale: string
): string | undefined {
  const minAmount = product.prices?.price_range?.min_amount;
  const maxAmount = product.prices?.price_range?.max_amount;
  const minPrice = formatStoreAmount(product, locale, minAmount);
  const maxPrice = formatStoreAmount(product, locale, maxAmount);

  if (minPrice && maxPrice && minAmount !== maxAmount) {
    return `${minPrice} à ${maxPrice}`;
  }

  return (
    minPrice ??
    formatStoreAmount(product, locale, product.prices?.price) ??
    htmlToPlainText(product.price_html)
  );
}

export function getStoreProductPrimaryBrand(product: WooStoreProduct):
  | {
      name: string;
      slug: string;
    }
  | undefined {
  const brand = product.brands?.[0];

  if (brand) {
    return {
      name: brand.name,
      slug: brand.slug,
    };
  }

  const legacyBrand = product.attributes
    ?.find((attribute) => attribute.taxonomy === "pa_marque")
    ?.terms[0];

  return legacyBrand
    ? {
        name: legacyBrand.name,
        slug: legacyBrand.slug,
      }
    : undefined;
}

export function getStoreAttributeTermSlugs(
  product: WooStoreProduct,
  taxonomy: string
): string[] {
  return (
    product.attributes
      ?.find((attribute) => attribute.taxonomy === taxonomy)
      ?.terms.map((term) => term.slug) ?? []
  );
}

/*
 * Mapper Store API -> ProductCardItem.
 * Utilise les produits bruts de /wc/store/v1/products pour listings et packs.
 */
export function mapStoreProductToCard(
  product: WooStoreProduct,
  locale: string
): ProductCardItem {
  const safeLocale = normalizeLocale(locale);

  return {
    title: product.name,
    href: `/${safeLocale}/${PRODUCT_DETAIL_BASE_PATH}/${product.slug}`,
    description: undefined,
    price: formatStoreProductPrice(product, safeLocale),
    image: product.images?.[0]?.thumbnail ?? product.images?.[0]?.src,
    brand: getStoreProductPrimaryBrand(product)?.name,
    metadata: [
      makeCardMetadataItem(
        "Instrument",
        getCardAttributeValue(product, "pa_instrument")
      ),
      makeCardMetadataItem("Corde", getCardAttributeValue(product, "pa_corde")),
      makeCardMetadataItem("Taille", getCardAttributeValue(product, "pa_taille")),
      makeCardMetadataItem(
        "Tension",
        getCardAttributeValue(product, "pa_tension")
      ),
    ].filter((item): item is { label: string; value: string } => Boolean(item)),
  };
}

export function mapAccessoryStoreProductToCard(
  product: WooStoreProduct,
  locale: string
): ProductCardItem {
  const safeLocale = normalizeLocale(locale);

  return {
    title: product.name,
    href: `/${safeLocale}/${PRODUCT_DETAIL_BASE_PATH}/${product.slug}`,
    description: undefined,
    price: formatStoreProductPrice(product, safeLocale),
    image: product.images?.[0]?.thumbnail ?? product.images?.[0]?.src,
    brand: getStoreProductPrimaryBrand(product)?.name,
    metadata: [
      makeCardMetadataItem(
        "Type",
        getStoreAttributeValues(product, "pa_type_produit")[0]
      ),
      makeCardMetadataItem(
        "Instrument",
        getStoreAttributeValues(product, "pa_instrument").join(", ")
      ),
    ].filter((item): item is { label: string; value: string } => Boolean(item)),
  };
}

export function mapPackStoreProductToCard(
  product: WooStoreProduct,
  locale: string
): ProductCardItem {
  const safeLocale = normalizeLocale(locale);

  return {
    title: product.name,
    href: `/${safeLocale}/${PRODUCT_DETAIL_BASE_PATH}/${product.slug}`,
    description: htmlToPlainText(product.short_description),
    price: formatStoreProductPrice(product, safeLocale),
    image: product.images?.[0]?.thumbnail ?? product.images?.[0]?.src,
    brand: getStoreAttributeValues(product, "pa_type_pack")[0],
    metadata: [
      makeCardMetadataItem(
        "Instrument",
        getStoreAttributeValues(product, "pa_instrument").join(", ")
      ),
      makeCardMetadataItem(
        "Usage",
        getStoreAttributeValues(product, "pa_usage").join(", ")
      ),
      makeCardMetadataItem(
        "Son",
        getStoreAttributeValues(product, "pa_profil_sonore").join(", ")
      ),
    ].filter((item): item is { label: string; value: string } => Boolean(item)),
  };
}
