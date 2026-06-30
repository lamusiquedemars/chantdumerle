import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { ProductFilterGroup } from "@/modules/catalog/components/ProductFilters/ProductFilters";
import {
  fetchGraphQL,
  hasWordPressEndpoint,
} from "@/lib/wordpress/client";
import {
  fetchWooStore,
  type WooStoreProduct,
} from "@/integrations/woocommerce/storeApi";
import {
  STRING_FILTER_FALLBACKS,
  STRING_FILTER_GROUPS_FIELDS,
  appendAccessoryStoreFilters,
  appendStoreAttributeFilter,
  appendStoreSort,
  appendStringStoreFilters,
  buildProductTaxonomyFilter,
  getAccessoryStoreFilterGroups,
  getStoreFilterGroups,
  mapStringFilterGroups,
  storeProductMatchesStringFilters,
  withoutStringProductFilter,
  type AccessoryProductFilters,
  type AccessoryProductSortKey,
  type StringProductFilters,
  type StringProductSortKey,
  type StringProductTermsResponse,
} from "@/modules/catalog/services/catalogFilters";
import {
  getStoreAttributeTermSlugs,
  isStringProductCard,
  mapAccessoryStoreProductToCard,
  mapPackStoreProductToCard,
  mapProductToCard,
  mapStoreProductToCard,
  type GraphQLProductNode,
} from "@/modules/catalog/services/productMappers";

export type {
  AccessoryProductFilters,
  AccessoryProductSortKey,
  StringProductFilters,
  StringProductSortKey,
} from "@/modules/catalog/services/catalogFilters";

/*
 * Champs communs aux produits simples et variables.
 * On les injecte dans les fragments GraphQL, car products.nodes est un ProductUnion.
 */
const PRODUCT_CARD_CORE_FIELDS = `
  name
  slug
  sku
  shortDescription

  image {
    sourceUrl
    altText
  }

  productCategories {
    nodes {
      name
      slug
    }
  }

  allPaMarque {
    nodes {
      name
      slug
    }
  }

  allPaModele {
    nodes {
      name
      slug
    }
  }

  allPaInstrument {
    nodes {
      name
      slug
    }
  }

  allPaCorde {
    nodes {
      name
      slug
    }
  }

  allPaTaille {
    nodes {
      name
      slug
    }
  }

  allPaTension {
    nodes {
      name
      slug
    }
  }

  allPaTypeProduit {
    nodes {
      name
      slug
    }
  }

  allPaProfilSonore {
    nodes {
      name
      slug
    }
  }

  allPaUsage {
    nodes {
      name
      slug
    }
  }
`;

/*
 * Fragment utilisé pour les cartes produit classiques.
 */
const PRODUCT_CARD_FIELDS = `
  __typename

  ... on SimpleProduct {
    ${PRODUCT_CARD_CORE_FIELDS}
    price
    regularPrice
    salePrice
  }

  ... on VariableProduct {
    ${PRODUCT_CARD_CORE_FIELDS}
    price
    regularPrice
    salePrice
  }
`;

type ProductsResponse = {
  products: {
    nodes: GraphQLProductNode[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

export type StringProductsPageData = {
  products: ProductCardItem[];
  filters: ProductFilterGroup[];
  pagination: {
    page: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    resultCount: number;
  };
};

export type AccessoryProductsPageData = StringProductsPageData;

const WOO_STORE_PRODUCTS_PER_PAGE_MAX = 100;
const PACK_CATEGORY_ID = 544;

function logWordPressProductError(context: string, error: unknown) {
  console.error(
    error instanceof Error
      ? `${context}: ${error.message}`
      : context
  );
}

/*
 * Tous les produits.
 */
export async function getProducts(
  locale: string = "fr",
  first = 12
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetProducts($first: Int!) {
          products(first: $first) {
            nodes {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      `,
      { first }
    )) as ProductsResponse;

    return data.products.nodes.map((product) =>
      mapProductToCard(product, locale)
    );
  } catch (error) {
    logWordPressProductError("Unable to load WooCommerce products", error);
    return [];
  }
}

/*
 * Produits mis en avant, toutes catégories.
 */
export async function getFeaturedProducts(
  locale: string = "fr",
  first = 8
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetFeaturedProducts($first: Int!) {
          products(first: $first, where: { featured: true }) {
            nodes {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      `,
      { first }
    )) as ProductsResponse;

    return data.products.nodes.map((product) =>
      mapProductToCard(product, locale)
    );
  } catch (error) {
    logWordPressProductError(
      "Unable to load featured WooCommerce products",
      error
    );
    return [];
  }
}

/*
 * Produits d’une catégorie WooCommerce.
 */
export async function getProductsByCategory(
  locale: string = "fr",
  categorySlug: string,
  first = 12
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetProductsByCategory($first: Int!, $categorySlug: String!) {
          products(first: $first, where: { category: $categorySlug }) {
            nodes {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      `,
      { first, categorySlug }
    )) as ProductsResponse;

    return data.products.nodes.map((product) =>
      mapProductToCard(product, locale)
    );
  } catch (error) {
    logWordPressProductError(
      `Unable to load WooCommerce products for category "${categorySlug}"`,
      error
    );
    return [];
  }
}

export async function getPackProducts(
  locale: string = "fr",
  typePackSlug: string,
  instrument?: string,
  first = 48
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      per_page: String(first),
      orderby: "title",
      order: "asc",
    });

    appendStoreAttributeFilter(params, 0, "pa_type_produit", ["pack"]);
    appendStoreAttributeFilter(params, 1, "pa_type_pack", [typePackSlug]);

    if (instrument) {
      appendStoreAttributeFilter(params, 2, "pa_instrument", [instrument]);
    }

    const { data } = await fetchWooStore<WooStoreProduct[]>(
      "products",
      params
    );
    const products =
      data.length > 0
        ? data
        : await getPackProductsByCategoryFallback(typePackSlug, instrument);

    return products
      .slice(0, first)
      .map((product) => mapPackStoreProductToCard(product, locale));
  } catch (error) {
    logWordPressProductError(
      `Unable to load WooCommerce pack products for "${typePackSlug}"`,
      error
    );

    try {
      const products = await getPackProductsByCategoryFallback(
        typePackSlug,
        instrument
      );

      return products
        .slice(0, first)
        .map((product) => mapPackStoreProductToCard(product, locale));
    } catch (fallbackError) {
      logWordPressProductError(
        `Unable to load WooCommerce fallback pack products for "${typePackSlug}"`,
        fallbackError
      );
      return [];
    }
  }
}

async function getPackProductsByCategoryFallback(
  typePackSlug: string,
  instrument?: string
): Promise<WooStoreProduct[]> {
  const params = new URLSearchParams({
    category: String(PACK_CATEGORY_ID),
    per_page: String(WOO_STORE_PRODUCTS_PER_PAGE_MAX),
    orderby: "title",
    order: "asc",
  });
  const { data } = await fetchWooStore<WooStoreProduct[]>("products", params);

  return data.filter((product) => {
    const hasPackType = product.tags?.some(
      (tag) => tag.slug === typePackSlug
    );
    const hasInstrument =
      !instrument ||
      getStoreAttributeTermSlugs(product, "pa_instrument").includes(instrument);

    return hasPackType && hasInstrument;
  });
}

export async function getSelectionStringProducts(
  locale: string = "fr",
  facet: {
    kind: "usage" | "son";
    slug: string;
  },
  instrument?: string,
  first = 48
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      per_page: String(first),
      orderby: "title",
      order: "asc",
    });
    const facetTaxonomy =
      facet.kind === "usage" ? "pa_usage" : "pa_profil_sonore";

    // Les selections importees dans Woo sont des jeux complets/composes:
    // on part des produits avec pa_corde=jeu puis on applique le filtre metier.
    appendStoreAttributeFilter(params, 0, "pa_corde", ["jeu"]);
    appendStoreAttributeFilter(params, 1, facetTaxonomy, [facet.slug]);

    if (instrument) {
      appendStoreAttributeFilter(params, 2, "pa_instrument", [instrument]);
    }

    const { data } = await fetchWooStore<WooStoreProduct[]>(
      "products",
      params
    );

    return data.map((product) => mapPackStoreProductToCard(product, locale));
  } catch (error) {
    logWordPressProductError(
      `Unable to load WooCommerce selection products for "${facet.kind}:${facet.slug}"`,
      error
    );
    return [];
  }
}

/*
 * Produits mis en avant dans une catégorie WooCommerce.
 */
export async function getFeaturedProductsByCategory(
  locale: string = "fr",
  categorySlug: string,
  first = 8
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetFeaturedProductsByCategory(
          $first: Int!
          $categorySlug: String!
        ) {
          products(
            first: $first
            where: {
              featured: true
              category: $categorySlug
            }
          ) {
            nodes {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      `,
      { first, categorySlug }
    )) as ProductsResponse;

    return data.products.nodes.map((product) =>
      mapProductToCard(product, locale)
    );
  } catch (error) {
    logWordPressProductError(
      `Unable to load featured WooCommerce products for category "${categorySlug}"`,
      error
    );
    return [];
  }
}

/*
 * Cordes mises en avant.
 */
export async function getFeaturedStringProducts(
  locale: string = "fr",
  first = 8
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const taxonomyFilter = buildProductTaxonomyFilter();
    const data = (await fetchGraphQL(
      `
        query GetFeaturedStringProducts($first: Int!) {
          products(
            first: $first
            where: {
              featured: true
              ${taxonomyFilter}
            }
          ) {
            nodes {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      `,
      { first }
    )) as ProductsResponse;

    return data.products.nodes
      .filter(isStringProductCard)
      .map((product) =>
        mapProductToCard(product, locale, { includeStringMetadata: true })
      );
  } catch (error) {
    logWordPressProductError(
      "Unable to load featured WooCommerce string products",
      error
    );
    return [];
  }
}

/*
 * Toutes les cordes.
 */
export async function getStringProducts(
  locale: string = "fr",
  first = 24,
  filters: StringProductFilters = {}
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const taxonomyFilter = buildProductTaxonomyFilter(filters);
    const data = (await fetchGraphQL(
      `
        query GetStringProducts($first: Int!) {
          products(
            first: $first
            where: {
              ${taxonomyFilter}
            }
          ) {
            nodes {
              ${PRODUCT_CARD_FIELDS}
            }
          }
        }
      `,
      { first }
    )) as ProductsResponse;

    return data.products.nodes
      .filter(isStringProductCard)
      .map((product) =>
        mapProductToCard(product, locale, { includeStringMetadata: true })
      );
  } catch (error) {
    logWordPressProductError("Unable to load WooCommerce string products", error);
    return [];
  }
}

/*
 * Données complètes de la page cordes.
 * Les listings et les filtres dynamiques viennent de la Store API Woo. GraphQL
 * reste utilisé plus bas pour certaines fiches détaillées historiques.
 */
export async function getStringProductsPageData(
  locale: string = "fr",
  first = 48,
  filters: StringProductFilters = {},
  page = 1,
  sort?: StringProductSortKey,
  options: {
    completeSetsOnly?: boolean;
  } = {}
): Promise<StringProductsPageData> {
  const safePage = Math.max(1, page);

  if (!hasWordPressEndpoint) {
    return {
      products: [],
      filters: STRING_FILTER_FALLBACKS,
      pagination: {
        page: safePage,
        pageCount: safePage,
        hasPreviousPage: safePage > 1,
        hasNextPage: false,
        resultCount: 0,
      },
    };
  }

  try {
    const pageSize = Math.min(first, WOO_STORE_PRODUCTS_PER_PAGE_MAX);
    const shouldFilterLocally = Boolean(filters.marque);
    const params = new URLSearchParams({
      per_page: String(
        shouldFilterLocally ? WOO_STORE_PRODUCTS_PER_PAGE_MAX : pageSize
      ),
      page: String(shouldFilterLocally ? 1 : safePage),
    });

    appendStringStoreFilters(
      params,
      filters.marque
        ? withoutStringProductFilter(filters, "marque")
        : filters,
      options
    );
    appendStoreSort(params, sort);

    const { data: products, headers } = await fetchWooStore<WooStoreProduct[]>(
      "products",
      params
    );
    const allProducts = [...products];

    if (shouldFilterLocally) {
      const rawWooPageCount = Number(headers.get("x-wp-totalpages") ?? "1");
      const wooPageCount = Number.isFinite(rawWooPageCount)
        ? Math.max(1, rawWooPageCount)
        : 1;

      for (let nextPage = 2; nextPage <= wooPageCount; nextPage += 1) {
        const nextParams = new URLSearchParams(params);

        nextParams.set("page", String(nextPage));

        const { data: nextProducts } = await fetchWooStore<WooStoreProduct[]>(
          "products",
          nextParams
        );

        allProducts.push(...nextProducts);
      }
    }

    const visibleProducts = shouldFilterLocally
      ? allProducts.filter((product) =>
          storeProductMatchesStringFilters(product, filters)
        )
      : allProducts;
    const paginatedProducts = shouldFilterLocally
      ? visibleProducts.slice((safePage - 1) * pageSize, safePage * pageSize)
      : visibleProducts;
    const filterGroups = await getStoreFilterGroups(
      filters,
      paginatedProducts,
      options
    );
    const resultCount = shouldFilterLocally
      ? visibleProducts.length
      : Number(headers.get("x-wp-total") ?? "0");
    const rawPageCount = shouldFilterLocally
      ? Math.ceil(resultCount / pageSize)
      : Number(headers.get("x-wp-totalpages") ?? "1");
    const pageCount = Number.isFinite(rawPageCount)
      ? Math.max(1, rawPageCount)
      : 1;

    return {
      products: paginatedProducts.map((product) =>
        mapStoreProductToCard(product, locale)
      ),
      filters: filterGroups,
      pagination: {
        page: safePage,
        pageCount,
        hasPreviousPage: safePage > 1,
        hasNextPage: safePage < pageCount,
        resultCount,
      },
    };
  } catch (error) {
    logWordPressProductError(
      "Unable to load WooCommerce string products page data",
      error
    );

    return {
      products: [],
      filters: STRING_FILTER_FALLBACKS,
      pagination: {
        page: safePage,
        pageCount: safePage,
        hasPreviousPage: safePage > 1,
        hasNextPage: false,
        resultCount: 0,
      },
    };
  }
}

export async function getAccessoryProductsPageData(
  locale: string = "fr",
  first = 48,
  filters: AccessoryProductFilters = {},
  page = 1,
  sort?: AccessoryProductSortKey
): Promise<AccessoryProductsPageData> {
  const safePage = Math.max(1, page);

  if (!hasWordPressEndpoint) {
    return {
      products: [],
      filters: [],
      pagination: {
        page: safePage,
        pageCount: safePage,
        hasPreviousPage: safePage > 1,
        hasNextPage: false,
        resultCount: 0,
      },
    };
  }

  try {
    const pageSize = Math.min(first, WOO_STORE_PRODUCTS_PER_PAGE_MAX);
    const params = new URLSearchParams({
      per_page: String(pageSize),
      page: String(safePage),
    });

    appendAccessoryStoreFilters(params, filters);
    appendStoreSort(params, sort);

    const { data: products, headers } = await fetchWooStore<WooStoreProduct[]>(
      "products",
      params
    );
    const filterGroups = await getAccessoryStoreFilterGroups(filters);
    const resultCount = Number(headers.get("x-wp-total") ?? "0");
    const rawPageCount = Number(headers.get("x-wp-totalpages") ?? "1");
    const pageCount = Number.isFinite(rawPageCount)
      ? Math.max(1, rawPageCount)
      : 1;

    return {
      products: products.map((product) =>
        mapAccessoryStoreProductToCard(product, locale)
      ),
      filters: filterGroups,
      pagination: {
        page: safePage,
        pageCount,
        hasPreviousPage: safePage > 1,
        hasNextPage: safePage < pageCount,
        resultCount,
      },
    };
  } catch (error) {
    logWordPressProductError(
      "Unable to load WooCommerce accessory products page data",
      error
    );

    return {
      products: [],
      filters: [],
      pagination: {
        page: safePage,
        pageCount: safePage,
        hasPreviousPage: safePage > 1,
        hasNextPage: false,
        resultCount: 0,
      },
    };
  }
}

export async function getBowProductsPageData(
  locale: string = "fr",
  first = 12
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      per_page: String(Math.min(first, WOO_STORE_PRODUCTS_PER_PAGE_MAX)),
      orderby: "title",
      order: "asc",
    });

    appendStoreAttributeFilter(params, 0, "pa_type_produit", ["archet"]);

    const { data: products } = await fetchWooStore<WooStoreProduct[]>(
      "products",
      params
    );

    return products.map((product) =>
      mapAccessoryStoreProductToCard(product, locale)
    );
  } catch (error) {
    logWordPressProductError(
      "Unable to load WooCommerce bow products page data",
      error
    );
    return [];
  }
}

const STRING_INSTRUMENT_CATEGORY_SLUGS: Record<string, string> = {
  violon: "violon",
  alto: "alto",
  cello: "violoncelle",
  contrebasse: "contrebasse",
};

/*
 * Cordes filtrées par instrument.
 * Compatibilité avec les anciennes valeurs d'URL, puis filtre par pa_instrument.
 */
export async function getStringProductsByInstrument(
  locale: string = "fr",
  instrumentSlug: string,
  first = 48
): Promise<ProductCardItem[]> {
  const instrument = STRING_INSTRUMENT_CATEGORY_SLUGS[instrumentSlug];

  if (!instrument) {
    return [];
  }

  return getStringProducts(locale, first, { instrument });
}

/*
 * Options de filtres disponibles pour les pages cordes.
 * Elles viennent des termes Woo, donc elles suivent l'import.
 */
export async function getStringProductFilterGroups(): Promise<
  ProductFilterGroup[]
> {
  if (!hasWordPressEndpoint) {
    return STRING_FILTER_FALLBACKS;
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetStringProductFilterGroups {
          ${STRING_FILTER_GROUPS_FIELDS}
        }
      `
    )) as StringProductTermsResponse;

    return mapStringFilterGroups(data);
  } catch (error) {
    logWordPressProductError(
      "Unable to load WooCommerce string filter groups",
      error
    );
    return STRING_FILTER_FALLBACKS;
  }
}
