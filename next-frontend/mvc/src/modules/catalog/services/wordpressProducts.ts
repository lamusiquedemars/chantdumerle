import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { ProductFilterGroup } from "@/modules/catalog/components/ProductFilters/ProductFilters";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";
import {
  fetchGraphQL,
  hasWordPressEndpoint,
} from "@/lib/wordpress/client";
import {
  getExampleProductCards,
  getExampleProductPageBySlug,
} from "@/modules/catalog/content/exampleProducts";

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

type GraphQLProductNode = {
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

type GraphQLProductAttributeTerm = {
  name: string;
  slug: string;
  count?: number | null;
};

type ProductsResponse = {
  products: {
    nodes: GraphQLProductNode[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

type StringProductFilterKey =
  | "instrument"
  | "marque"
  | "son"
  | "usage"
  | "corde"
  | "taille"
  | "tension";

export type StringProductFilters = Partial<
  Record<StringProductFilterKey, string>
>;

export type StringProductSortKey =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

type AccessoryProductFilterKey = "type" | "instrument" | "marque";

export type AccessoryProductFilters = Partial<
  Record<AccessoryProductFilterKey, string>
>;

export type AccessoryProductSortKey = StringProductSortKey;

type StringProductTermsResponse = {
  allPaInstrument: { nodes: GraphQLProductAttributeTerm[] };
  allPaMarque: { nodes: GraphQLProductAttributeTerm[] };
  allPaCorde: { nodes: GraphQLProductAttributeTerm[] };
  allPaTaille: { nodes: GraphQLProductAttributeTerm[] };
  allPaTension: { nodes: GraphQLProductAttributeTerm[] };
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

type ProductTaxonomyFilter = {
  taxonomy: string;
  terms: string[];
  operator: "AND" | "EXISTS" | "IN" | "NOT_EXISTS" | "NOT_IN";
};

type WooStoreProduct = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  short_description?: string;
  price_html?: string;
  images?: {
    src?: string;
    thumbnail?: string;
    alt?: string;
  }[];
  brands?: {
    name: string;
    slug: string;
  }[];
  attributes?: WooStoreProductAttribute[];
};

type WooStoreProductAttribute = {
  id: number;
  name: string;
  taxonomy: string | null;
  terms: {
    id: number;
    name: string;
    slug: string;
  }[];
};

type WooStoreAttributeTerm = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

type WooStoreCollectionData = {
  attribute_counts?: {
    term: number;
    count: number;
  }[];
};

const PRODUCT_DETAIL_BASE_PATH = "produits";
const WOO_STORE_PRODUCTS_PER_PAGE_MAX = 100;
const WOO_STORE_BASE_URL =
  process.env.WOO_BASE_URL ?? process.env.NEXT_PUBLIC_WP_URL;

const STRING_PRODUCT_BASE_FILTERS: ProductTaxonomyFilter[] = [
  {
    taxonomy: "PA_INSTRUMENT",
    terms: ["violon", "alto", "violoncelle", "contrebasse"],
    operator: "IN",
  },
];

const STRING_CORDE_SLUGS = [
  "jeu",
  "mi",
  "la",
  "re",
  "sol",
  "do",
  "si",
  "fa",
  "fa-diese",
  "do-diese",
];

const STRING_PRODUCT_FILTER_TAXONOMIES: Record<
  StringProductFilterKey,
  string
> = {
  instrument: "PA_INSTRUMENT",
  marque: "PA_MARQUE",
  son: "PA_PROFIL_SONORE",
  usage: "PA_USAGE",
  corde: "PA_CORDE",
  taille: "PA_TAILLE",
  tension: "PA_TENSION",
};

const STRING_FILTER_FALLBACKS: ProductFilterGroup[] = [
  {
    name: "instrument",
    label: "Instrument",
    options: [
      { label: "Violon", value: "violon" },
      { label: "Alto", value: "alto" },
      { label: "Violoncelle", value: "violoncelle" },
      { label: "Contrebasse", value: "contrebasse" },
    ],
  },
  {
    name: "marque",
    label: "Marque",
    options: [],
  },
  {
    name: "son",
    label: "Son recherché",
    options: [
      { label: "Chaud", value: "chaud" },
      { label: "Équilibré", value: "equilibre" },
      { label: "Brillant", value: "brillant" },
    ],
  },
  {
    name: "usage",
    label: "Usage",
    options: [
      { label: "Étudiant", value: "etudiant" },
      { label: "Intermédiaire", value: "intermediaire" },
      { label: "Orchestre", value: "orchestre" },
      { label: "Soliste", value: "soliste" },
    ],
  },
  {
    name: "corde",
    label: "Corde",
    options: [
      { label: "jeu", value: "jeu" },
      { label: "Mi", value: "mi" },
      { label: "La", value: "la" },
      { label: "Ré", value: "re" },
      { label: "Sol", value: "sol" },
      { label: "Do", value: "do" },
    ],
  },
  {
    name: "taille",
    label: "Taille",
    options: [
      { label: "4/4", value: "4-4" },
      { label: "3/4", value: "3-4" },
      { label: "1/2", value: "1-2" },
      { label: "1/4", value: "1-4" },
    ],
  },
  {
    name: "tension",
    label: "Tension",
    options: [
      { label: "Light", value: "light" },
      { label: "Medium", value: "medium" },
      { label: "Heavy", value: "heavy" },
    ],
  },
];

function logWordPressProductError(context: string, error: unknown) {
  console.error(
    error instanceof Error
      ? `${context}: ${error.message}`
      : context
  );
}

function graphQLString(value: string): string {
  return JSON.stringify(value);
}

function buildProductTaxonomyFilter(
  filters: StringProductFilters = {},
  extraFilters: ProductTaxonomyFilter[] = []
): string {
  const baseFilters = filters.instrument
    ? STRING_PRODUCT_BASE_FILTERS.filter(
        (filter) => filter.taxonomy !== "PA_INSTRUMENT"
      )
    : STRING_PRODUCT_BASE_FILTERS;
  const productFilters = [...baseFilters, ...extraFilters];

  for (const [key, taxonomy] of Object.entries(
    STRING_PRODUCT_FILTER_TAXONOMIES
  ) as [StringProductFilterKey, string][]) {
    const value = filters[key];

    if (!value) {
      continue;
    }

    productFilters.push({
      taxonomy,
      terms: [value],
      operator: "IN",
    });
  }

  const filterText = productFilters
    .map(
      (filter) => `{
        taxonomy: ${filter.taxonomy}
        terms: [${filter.terms.map(graphQLString).join(", ")}]
        operator: ${filter.operator}
      }`
    )
    .join("\n");

  return `taxonomyFilter: { relation: AND, filters: [${filterText}] }`;
}

function termToFilterOption(term: GraphQLProductAttributeTerm) {
  return {
    label: term.name,
    value: term.slug,
  };
}

function termHasProducts(term: GraphQLProductAttributeTerm): boolean {
  return term.count === undefined || term.count === null || term.count > 0;
}

function sortTerms(
  terms: GraphQLProductAttributeTerm[],
  preferredOrder: string[] = []
): GraphQLProductAttributeTerm[] {
  const order = new Map(
    preferredOrder.map((slug, index) => [slug, index])
  );

  return [...terms]
    .filter(termHasProducts)
    .sort((left, right) => {
      const leftOrder = order.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = order.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.name.localeCompare(right.name, "fr");
    });
}

function mapStringFilterGroups(
  data: StringProductTermsResponse
): ProductFilterGroup[] {
  return [
    {
      name: "instrument",
      label: "Instrument",
      options: sortTerms(data.allPaInstrument.nodes, [
        "violon",
        "alto",
        "violoncelle",
        "contrebasse",
      ]).map(termToFilterOption),
    },
    {
      name: "marque",
      label: "Marque",
      options: sortTerms(data.allPaMarque.nodes).map(termToFilterOption),
    },
    {
      name: "son",
      label: "Son recherché",
      options: [],
    },
    {
      name: "usage",
      label: "Usage",
      options: [],
    },
    {
      name: "corde",
      label: "Corde",
      options: sortTerms(data.allPaCorde.nodes, [
        "jeu",
        "mi",
        "la",
        "re",
        "sol",
        "do",
        "si",
        "fa",
        "fa-diese",
        "do-diese",
      ]).map(termToFilterOption),
    },
    {
      name: "taille",
      label: "Taille",
      options: sortTerms(data.allPaTaille.nodes, [
        "4-4",
        "3-4",
        "1-2",
        "1-4",
        "1-8",
        "1-16",
      ]).map(termToFilterOption),
    },
    {
      name: "tension",
      label: "Tension",
      options: sortTerms(data.allPaTension.nodes, [
        "light",
        "medium-light",
        "medium",
        "medium-heavy",
        "heavy",
      ]).map(termToFilterOption),
    },
  ].filter((filter) => filter.options.length > 0);
}

const STRING_FILTER_LABELS: Record<StringProductFilterKey, string> = {
  instrument: "Instrument",
  marque: "Marque",
  son: "Son recherché",
  usage: "Usage",
  corde: "Corde",
  taille: "Taille",
  tension: "Tension",
};

const STRING_STORE_ATTRIBUTE_TAXONOMIES: Record<
  StringProductFilterKey,
  string
> = {
  instrument: "pa_instrument",
  marque: "pa_marque",
  son: "pa_profil_sonore",
  usage: "pa_usage",
  corde: "pa_corde",
  taille: "pa_taille",
  tension: "pa_tension",
};

const STRING_STORE_ATTRIBUTE_TERMS: Record<
  StringProductFilterKey,
  WooStoreAttributeTerm[]
> = {
  instrument: [
    { id: 257, name: "Violon", slug: "violon" },
    { id: 291, name: "Alto", slug: "alto" },
    { id: 260, name: "Violoncelle", slug: "violoncelle" },
    { id: 278, name: "Contrebasse", slug: "contrebasse" },
  ],
  marque: [
    { id: 102, name: "Aquila", slug: "aquila" },
    { id: 103, name: "D'Addario", slug: "daddario" },
    { id: 255, name: "Hidersine", slug: "hidersine" },
    { id: 104, name: "Jargar", slug: "jargar" },
    { id: 105, name: "Larsen", slug: "larsen" },
    { id: 106, name: "Optima", slug: "optima" },
    { id: 107, name: "Pirastro", slug: "pirastro" },
    { id: 108, name: "Thomastik", slug: "thomastik" },
    { id: 109, name: "Warchal", slug: "warchal" },
  ],
  son: [
    { id: 70, name: "chaud", slug: "chaud" },
    { id: 71, name: "équilibré", slug: "equilibre" },
    { id: 69, name: "brillant", slug: "brillant" },
  ],
  usage: [
    { id: 88, name: "étudiant", slug: "etudiant" },
    { id: 83, name: "intermédiaire", slug: "intermediaire" },
    { id: 85, name: "orchestre", slug: "orchestre" },
    { id: 87, name: "soliste", slug: "soliste" },
    { id: 84, name: "jazz", slug: "jazz" },
    { id: 86, name: "pizzicato", slug: "pizzicato" },
    { id: 81, name: "baroque", slug: "baroque" },
    { id: 82, name: "expérimental", slug: "experimental" },
  ],
  corde: [
    { id: 261, name: "jeu", slug: "jeu" },
    { id: 267, name: "Mi", slug: "mi" },
    { id: 272, name: "La", slug: "la" },
    { id: 273, name: "Ré", slug: "re" },
    { id: 263, name: "Sol", slug: "sol" },
    { id: 271, name: "Do", slug: "do" },
    { id: 279, name: "Si", slug: "si" },
    { id: 281, name: "Fa", slug: "fa" },
    { id: 289, name: "Fa dièse", slug: "fa-diese" },
    { id: 290, name: "Do dièse", slug: "do-diese" },
  ],
  taille: [
    { id: 262, name: "4/4", slug: "4-4" },
    { id: 280, name: "3/4", slug: "3-4" },
    { id: 276, name: "1/2", slug: "1-2" },
    { id: 282, name: "1/4", slug: "1-4" },
    { id: 283, name: "1/8", slug: "1-8" },
    { id: 320, name: "1/16", slug: "1-16" },
    { id: 324, name: "1/10", slug: "1-10" },
    { id: 327, name: "3/4-1/2", slug: "3-4-1-2" },
    { id: 293, name: '14"-15"', slug: "14-15" },
    { id: 292, name: '15"-16"', slug: "15-16" },
    { id: 297, name: '15"-16.5"', slug: "15-16-5" },
    { id: 296, name: '16"-16.5"', slug: "16-16-5" },
    { id: 295, name: '16"-17"', slug: "16-17" },
  ],
  tension: [
    { id: 274, name: "Light", slug: "light" },
    { id: 319, name: "Medium-Light", slug: "medium-light" },
    { id: 264, name: "Medium", slug: "medium" },
    { id: 317, name: "Medium-Heavy", slug: "medium-heavy" },
    { id: 268, name: "Heavy", slug: "heavy" },
  ],
};

const STRING_FILTER_OPTION_ORDER: Partial<
  Record<StringProductFilterKey, string[]>
> = {
  instrument: ["violon", "alto", "violoncelle", "contrebasse"],
  son: ["chaud", "equilibre", "brillant"],
  usage: [
    "etudiant",
    "intermediaire",
    "orchestre",
    "soliste",
    "jazz",
    "pizzicato",
    "baroque",
    "experimental",
  ],
  corde: [
    "jeu",
    "mi",
    "la",
    "re",
    "sol",
    "do",
    "si",
    "fa",
    "fa-diese",
    "do-diese",
  ],
  taille: ["4-4", "3-4", "1-2", "1-4", "1-8", "1-16"],
  tension: ["light", "medium-light", "medium", "medium-heavy", "heavy"],
};

const ACCESSORY_TYPE_SLUGS = [
  "colophane",
  "etui",
  "housse",
  "etui-pour-archet",
  "epauliere",
  "sourdine",
  "support-de-pique",
  "entretien",
];

const ACCESSORY_FILTER_LABELS: Record<AccessoryProductFilterKey, string> = {
  type: "Type d’accessoire",
  instrument: "Instrument",
  marque: "Marque",
};

const ACCESSORY_STORE_ATTRIBUTE_TAXONOMIES: Record<
  AccessoryProductFilterKey,
  string
> = {
  type: "pa_type_produit",
  instrument: "pa_instrument",
  marque: "pa_marque",
};

const ACCESSORY_STORE_ATTRIBUTE_TERMS: Record<
  AccessoryProductFilterKey,
  WooStoreAttributeTerm[]
> = {
  type: [
    { id: 258, name: "Colophane", slug: "colophane" },
    { id: 410, name: "Épaulière", slug: "epauliere" },
    { id: 380, name: "Sourdine", slug: "sourdine" },
    { id: 371, name: "Étui", slug: "etui" },
    { id: 403, name: "Housse", slug: "housse" },
    { id: 369, name: "Étui pour archet", slug: "etui-pour-archet" },
    { id: 453, name: "Support de pique", slug: "support-de-pique" },
    { id: 400, name: "Entretien", slug: "entretien" },
  ],
  instrument: [
    { id: 257, name: "Violon", slug: "violon" },
    { id: 291, name: "Alto", slug: "alto" },
    { id: 260, name: "Violoncelle", slug: "violoncelle" },
    { id: 278, name: "Contrebasse", slug: "contrebasse" },
  ],
  marque: [
    { id: 378, name: "Alpine Mute", slug: "alpine-mute" },
    { id: 102, name: "Aquila", slug: "aquila" },
    { id: 428, name: "Artino", slug: "artino" },
    { id: 373, name: "Artist", slug: "artist" },
    { id: 466, name: "Cecilia Rosin", slug: "cecilia-rosin" },
    { id: 397, name: "Corelli", slug: "corelli" },
    { id: 411, name: "D'Addario", slug: "d-addario" },
    { id: 442, name: "Finissima", slug: "finissima" },
    { id: 255, name: "Hidersine", slug: "hidersine" },
    { id: 430, name: "Kolstein", slug: "kolstein" },
    { id: 408, name: "Kun", slug: "kun" },
    { id: 439, name: "Lapella", slug: "lapella" },
    { id: 448, name: "Larica Liebenzeller", slug: "larica-liebenzeller" },
    { id: 105, name: "Larsen", slug: "larsen" },
    { id: 406, name: "Nyman-Harts", slug: "nyman-harts" },
    { id: 381, name: "Petz", slug: "petz" },
    { id: 107, name: "Pirastro", slug: "pirastro" },
    { id: 437, name: "Pops'", slug: "pops" },
    { id: 367, name: "Rapsody", slug: "rapsody" },
    { id: 404, name: "Super-Sensitive", slug: "super-sensitive" },
    { id: 108, name: "Thomastik", slug: "thomastik" },
    { id: 391, name: "Tourte", slug: "tourte" },
    { id: 393, name: "Ultra", slug: "ultra" },
    { id: 446, name: "Viva La Musica", slug: "viva-la-musica" },
    { id: 413, name: "W.E. Hill", slug: "w-e-hill" },
    { id: 366, name: "Wiedoeft", slug: "wiedoeft" },
    { id: 485, name: "Wittner", slug: "wittner" },
    { id: 387, name: "WMutes", slug: "wmutes" },
    { id: 451, name: "Wolf", slug: "wolf" },
  ],
};

const ACCESSORY_FILTER_OPTION_ORDER: Partial<
  Record<AccessoryProductFilterKey, string[]>
> = {
  type: ACCESSORY_TYPE_SLUGS,
  instrument: ["violon", "alto", "violoncelle", "contrebasse"],
};

const STRING_FILTER_GROUPS_FIELDS = `
  allPaInstrument(first: 20) {
    nodes {
      name
      slug
      count
    }
  }

  allPaMarque(first: 80) {
    nodes {
      name
      slug
      count
    }
  }

  allPaCorde(first: 30) {
    nodes {
      name
      slug
      count
    }
  }

  allPaTaille(first: 60) {
    nodes {
      name
      slug
      count
    }
  }

  allPaTension(first: 20) {
    nodes {
      name
      slug
      count
    }
  }
`;

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

function isStringProductCard(product: GraphQLProductNode): boolean {
  return !product.allPaTypeProduit?.nodes.some(
    (term) => term.slug === "colophane"
  );
}

/*
 * Transforme un produit WooGraphQL en ProductCardItem.
 * La marque vient de pa_marque, pas des catégories.
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

/*
 * Tous les produits.
 */
export async function getProducts(
  locale: string = "fr",
  first = 12
): Promise<ProductCardItem[]> {
  if (!hasWordPressEndpoint) {
    return getExampleProductCards(locale, first);
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
    return getExampleProductCards(locale, first);
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
    return getExampleProductCards(locale, first);
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

/*
 * Produits résolus par SKU.
 * Utile pour les sélections éditoriales : le CSV porte la logique de choix,
 * WooCommerce reste la source de vérité pour les URLs, prix et images.
 */
export async function getProductsBySkus(
  locale: string = "fr",
  skus: string[] = []
): Promise<Record<string, ProductCardItem>> {
  const cleanSkus = [...new Set(skus.map((sku) => sku.trim()).filter(Boolean))];

  if (cleanSkus.length === 0 || !hasWordPressEndpoint) {
    return {};
  }

  const entries = await Promise.all(
    cleanSkus.map(async (sku) => {
      try {
        const params = new URLSearchParams({ sku });
        const { data } = await fetchWooStore<WooStoreProduct[]>(
          "products",
          params
        );
        const product = data.find(
          (item) => item.sku?.toUpperCase() === sku.toUpperCase()
        );

        if (!product?.sku) {
          return undefined;
        }

        return [
          product.sku.toUpperCase(),
          mapStoreProductToCard(product, locale),
        ] as const;
      } catch {
        return undefined;
      }
    })
  );

  return Object.fromEntries(
    entries.filter(
      (entry): entry is readonly [string, ProductCardItem] => Boolean(entry)
    )
  );
}

/*
 * Sécurise la locale pour éviter de générer des URLs en /undefined/...
 */
function normalizeLocale(locale?: string | null): string {
  if (!locale || locale === "undefined" || locale === "null") {
    return "fr";
  }
  return locale;
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
    return getExampleProductCards(locale, first);
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
    return getExampleProductCards(locale, first);
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
    return getExampleProductCards(locale, first);
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

function appendStoreAttributeFilter(
  params: URLSearchParams,
  index: number,
  taxonomy: string,
  slugs: string[]
) {
  params.set(`attributes[${index}][attribute]`, taxonomy);
  params.set(`attributes[${index}][slug]`, slugs.join(","));
}

function appendStringStoreFilters(
  params: URLSearchParams,
  filters: StringProductFilters,
  options: {
    completeSetsOnly?: boolean;
  } = {}
) {
  let index = 0;
  const cordeSlugs = options.completeSetsOnly
    ? ["jeu"]
    : filters.corde
      ? [filters.corde]
      : STRING_CORDE_SLUGS;

  appendStoreAttributeFilter(params, index, "pa_corde", cordeSlugs);
  index += 1;

  for (const [filterKey, taxonomy] of Object.entries(
    STRING_STORE_ATTRIBUTE_TAXONOMIES
  ) as [StringProductFilterKey, string][]) {
    if (filterKey === "corde") {
      continue;
    }

    const value = filters[filterKey];

    if (!value) {
      continue;
    }

    appendStoreAttributeFilter(params, index, taxonomy, [value]);
    index += 1;
  }
}

function appendAccessoryStoreFilters(
  params: URLSearchParams,
  filters: AccessoryProductFilters
) {
  let index = 0;
  const typeSlugs = filters.type ? [filters.type] : ACCESSORY_TYPE_SLUGS;

  appendStoreAttributeFilter(params, index, "pa_type_produit", typeSlugs);
  index += 1;

  for (const [filterKey, taxonomy] of Object.entries(
    ACCESSORY_STORE_ATTRIBUTE_TAXONOMIES
  ) as [AccessoryProductFilterKey, string][]) {
    if (filterKey === "type") {
      continue;
    }

    const value = filters[filterKey];

    if (!value) {
      continue;
    }

    appendStoreAttributeFilter(params, index, taxonomy, [value]);
    index += 1;
  }
}

function appendStoreSort(params: URLSearchParams, sort?: StringProductSortKey) {
  switch (sort) {
    case "name-asc":
      params.set("orderby", "title");
      params.set("order", "asc");
      break;
    case "name-desc":
      params.set("orderby", "title");
      params.set("order", "desc");
      break;
    case "price-asc":
      params.set("orderby", "price");
      params.set("order", "asc");
      break;
    case "price-desc":
      params.set("orderby", "price");
      params.set("order", "desc");
      break;
  }
}

async function fetchWooStore<T>(
  path: string,
  params: URLSearchParams
): Promise<{
  data: T;
  headers: Headers;
}> {
  if (!WOO_STORE_BASE_URL) {
    throw new Error("WOO_BASE_URL is not defined");
  }

  const url = new URL(`/wp-json/wc/store/v1/${path}`, WOO_STORE_BASE_URL);
  url.search = params.toString();

  if (url.hostname.endsWith(".local")) {
    return fetchWooStoreWithNodeHttp<T>(url);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    if (!url.hostname.endsWith(".local")) {
      throw error;
    }

    return fetchWooStoreWithNodeHttp<T>(url);
  }

  if (!response.ok) {
    throw new Error(`Woo Store API HTTP ${response.status}`);
  }

  return {
    data: (await response.json().catch((error) => {
      throw new Error(`Woo Store API returned invalid JSON: ${error}`);
    })) as T,
    headers: response.headers,
  };
}

async function fetchWooStoreWithNodeHttp<T>(url: URL): Promise<{
  data: T;
  headers: Headers;
}> {
  const isHttps = url.protocol === "https:";
  const client = isHttps ? await import("node:https") : await import("node:http");
  const headers = new Headers();
  const body = await new Promise<string>((resolve, reject) => {
    const request = client.request(
      {
        hostname: url.hostname.endsWith(".local") ? "127.0.0.1" : url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: "GET",
        headers: url.hostname.endsWith(".local")
          ? {
              Host: url.host,
            }
          : undefined,
      },
      (response) => {
        const chunks: Buffer[] = [];

        for (const [name, value] of Object.entries(response.headers)) {
          if (Array.isArray(value)) {
            headers.set(name, value.join(", "));
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }

        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const statusCode = response.statusCode ?? 500;
          const text = Buffer.concat(chunks).toString("utf8");

          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Woo Store API HTTP ${statusCode}`));
            return;
          }

          resolve(text);
        });
      }
    );

    request.on("error", reject);
    request.end();
  });

  return {
    data: JSON.parse(body) as T,
    headers,
  };
}

function getStoreAttributeValues(
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

function mapStoreProductToCard(
  product: WooStoreProduct,
  locale: string
): ProductCardItem {
  const safeLocale = normalizeLocale(locale);

  return {
    title: product.name,
    href: `/${safeLocale}/${PRODUCT_DETAIL_BASE_PATH}/${product.slug}`,
    description: undefined,
    price: htmlToPlainText(product.price_html),
    image: product.images?.[0]?.thumbnail ?? product.images?.[0]?.src,
    brand:
      product.brands?.[0]?.name ??
      getStoreAttributeValues(product, "pa_marque")[0],
    metadata: [
      makeCardMetadataItem(
        "Instrument",
        getStoreAttributeValues(product, "pa_instrument")[0]
      ),
      makeCardMetadataItem("Corde", getStoreAttributeValues(product, "pa_corde")[0]),
      makeCardMetadataItem("Taille", getStoreAttributeValues(product, "pa_taille")[0]),
      makeCardMetadataItem(
        "Tension",
        getStoreAttributeValues(product, "pa_tension")[0]
      ),
    ].filter((item): item is { label: string; value: string } => Boolean(item)),
  };
}

function mapAccessoryStoreProductToCard(
  product: WooStoreProduct,
  locale: string
): ProductCardItem {
  const safeLocale = normalizeLocale(locale);

  return {
    title: product.name,
    href: `/${safeLocale}/${PRODUCT_DETAIL_BASE_PATH}/${product.slug}`,
    description: undefined,
    price: htmlToPlainText(product.price_html),
    image: product.images?.[0]?.thumbnail ?? product.images?.[0]?.src,
    brand:
      product.brands?.[0]?.name ??
      getStoreAttributeValues(product, "pa_marque")[0],
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

async function getStoreFilterGroups(
  filters: StringProductFilters,
  options: {
    completeSetsOnly?: boolean;
  } = {}
): Promise<ProductFilterGroup[]> {
  const params = new URLSearchParams();

  (
    Object.keys(STRING_FILTER_LABELS) as StringProductFilterKey[]
  ).forEach((filterKey, index) => {
    params.set(
      `calculate_attribute_counts[${index}][taxonomy]`,
      STRING_STORE_ATTRIBUTE_TAXONOMIES[filterKey]
    );
  });

  appendStringStoreFilters(params, filters, options);

  const { data } = await fetchWooStore<WooStoreCollectionData>(
    "products/collection-data",
    params
  );
  const counts = new Map(
    (data.attribute_counts ?? []).map((item) => [item.term, item.count])
  );

  return (
    Object.keys(STRING_FILTER_LABELS) as StringProductFilterKey[]
  )
    .map((filterKey) => {
      const options = sortTerms(
        STRING_STORE_ATTRIBUTE_TERMS[filterKey]
          .map((term) => ({
            ...term,
            count: counts.get(term.id) ?? 0,
          }))
          .filter((term) => term.count > 0),
        STRING_FILTER_OPTION_ORDER[filterKey]
      ).map(termToFilterOption);

      return {
        name: filterKey,
        label: STRING_FILTER_LABELS[filterKey],
        options,
      };
    })
    .filter((filter) => filter.options.length > 0);
}

async function getAccessoryStoreFilterGroups(
  filters: AccessoryProductFilters
): Promise<ProductFilterGroup[]> {
  const params = new URLSearchParams();

  (
    Object.keys(ACCESSORY_FILTER_LABELS) as AccessoryProductFilterKey[]
  ).forEach((filterKey, index) => {
    params.set(
      `calculate_attribute_counts[${index}][taxonomy]`,
      ACCESSORY_STORE_ATTRIBUTE_TAXONOMIES[filterKey]
    );
  });

  appendAccessoryStoreFilters(params, filters);

  const { data } = await fetchWooStore<WooStoreCollectionData>(
    "products/collection-data",
    params
  );
  const counts = new Map(
    (data.attribute_counts ?? []).map((item) => [item.term, item.count])
  );

  return (
    Object.keys(ACCESSORY_FILTER_LABELS) as AccessoryProductFilterKey[]
  )
    .map((filterKey) => {
      const options = sortTerms(
        ACCESSORY_STORE_ATTRIBUTE_TERMS[filterKey]
          .map((term) => ({
            ...term,
            count: counts.get(term.id) ?? 0,
          }))
          .filter((term) => term.count > 0),
        ACCESSORY_FILTER_OPTION_ORDER[filterKey]
      ).map(termToFilterOption);

      return {
        name: filterKey,
        label: ACCESSORY_FILTER_LABELS[filterKey],
        options,
      };
    })
    .filter((filter) => filter.options.length > 0);
}

/*
 * Données complètes de la page cordes.
 * Produits et options de filtre sont récupérés en une seule requête GraphQL,
 * ce qui évite deux appels WooCommerce coûteux pendant le rendu serveur.
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
      products: getExampleProductCards(locale, first),
      filters: STRING_FILTER_FALLBACKS,
      pagination: {
        page: safePage,
        pageCount: safePage,
        hasPreviousPage: safePage > 1,
        hasNextPage: false,
        resultCount: first,
      },
    };
  }

  try {
    const pageSize = Math.min(first, WOO_STORE_PRODUCTS_PER_PAGE_MAX);
    const params = new URLSearchParams({
      per_page: String(pageSize),
      page: String(safePage),
    });

    appendStringStoreFilters(params, filters, options);
    appendStoreSort(params, sort);

    const { data: products, headers } = await fetchWooStore<WooStoreProduct[]>(
      "products",
      params
    );
    const filterGroups = await getStoreFilterGroups(filters, options);
    const resultCount = Number(headers.get("x-wp-total") ?? "0");
    const rawPageCount = Number(headers.get("x-wp-totalpages") ?? "1");
    const pageCount = Number.isFinite(rawPageCount)
      ? Math.max(1, rawPageCount)
      : 1;

    return {
      products: products.map((product) => mapStoreProductToCard(product, locale)),
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
      products: getExampleProductCards(locale, first),
      filters: [],
      pagination: {
        page: safePage,
        pageCount: safePage,
        hasPreviousPage: safePage > 1,
        hasNextPage: false,
        resultCount: first,
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

/*
 * Type utilisé par la page produit complète.
 * Contrairement à ProductCardItem, il contient les données nécessaires
 * à une fiche produit : achat, identification, conseil et technique.
 */
export type ProductPageItem = {
  id: string;
  databaseId: number;
  typename: string;
  productType?: string | null;

  name: string;
  slug: string;
  sku?: string | null;

  shortDescription?: string | null;
  description?: string | null;

  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;

  stockQuantity?: number | null;
  stockStatus?: string | null;
  purchasable?: boolean | null;

  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;

  categories: ProductPageTerm[];

  identity: ProductPageField[];
  sound: ProductPageField[];
  technical: ProductPageField[];
};

type ProductPageTerm = {
  name: string;
  slug: string;
};

type ProductPageField = {
  label: string;
  value: string;
  slug?: string;
};

type ProductPageAttributeConnection = {
  nodes: ProductPageTerm[];
} | null;

type GraphQLProductPageNode = {
  __typename: "SimpleProduct" | "VariableProduct" | string;
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku?: string | null;
  type?: string | null;

  shortDescription?: string | null;
  description?: string | null;

  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;

  stockQuantity?: number | null;
  stockStatus?: string | null;
  purchasable?: boolean | null;

  image?: {
    sourceUrl?: string | null;
    altText?: string | null;
  } | null;

  productCategories?: ProductPageAttributeConnection;

  allPaMarque?: ProductPageAttributeConnection;
  allPaInstrument?: ProductPageAttributeConnection;
  allPaTaille?: ProductPageAttributeConnection;
  allPaModele?: ProductPageAttributeConnection;
  allPaCorde?: ProductPageAttributeConnection;
  allPaTension?: ProductPageAttributeConnection;

  allPaAme?: ProductPageAttributeConnection;
  allPaFilage?: ProductPageAttributeConnection;
  allPaAttache?: ProductPageAttributeConnection;
  allPaTypeProduit?: ProductPageAttributeConnection;

  allPaProfilSonore?: ProductPageAttributeConnection;
  allPaComplexite?: ProductPageAttributeConnection;
  allPaPuissance?: ProductPageAttributeConnection;
  allPaReponse?: ProductPageAttributeConnection;
  allPaUsage?: ProductPageAttributeConnection;
  allPaPositionnement?: ProductPageAttributeConnection;

  allPaDurabilite?: ProductPageAttributeConnection;
  allPaStabilite?: ProductPageAttributeConnection;
  allPaTempsRodage?: ProductPageAttributeConnection;
};

type ProductPageResponse = {
  product: GraphQLProductPageNode | null;
};

/*
 * Champs utilisés par la fiche produit.
 * Pour l’instant, les attributs peuvent être vides : c’est normal
 * tant qu’ils ne sont pas renseignés dans WooCommerce.
 */
const PRODUCT_PAGE_FIELDS = `
  id
  databaseId
  name
  slug
  sku
  type

  shortDescription
  description

  price
  regularPrice
  salePrice
  stockQuantity
  stockStatus
  purchasable

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

  allPaInstrument {
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

  allPaModele {
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

  allPaTension {
    nodes {
      name
      slug
    }
  }

  allPaAme {
    nodes {
      name
      slug
    }
  }

  allPaFilage {
    nodes {
      name
      slug
    }
  }

  allPaAttache {
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

  allPaComplexite {
    nodes {
      name
      slug
    }
  }

  allPaPuissance {
    nodes {
      name
      slug
    }
  }

  allPaReponse {
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

  allPaPositionnement {
    nodes {
      name
      slug
    }
  }

  allPaDurabilite {
    nodes {
      name
      slug
    }
  }

  allPaStabilite {
    nodes {
      name
      slug
    }
  }

  allPaTempsRodage {
    nodes {
      name
      slug
    }
  }
`;

/*
 * Récupère la première valeur d’un attribut Woo.
 * En V1, on affiche une seule valeur par champ.
 */
function firstAttributeValue(
  connection?: ProductPageAttributeConnection
): ProductPageTerm | undefined {
  return connection?.nodes?.[0];
}

/*
 * Crée un champ affichable seulement si la donnée existe.
 * Ça évite d’afficher des lignes vides sur la fiche produit.
 */
function makeProductPageField(
  label: string,
  connection?: ProductPageAttributeConnection
): ProductPageField | undefined {
  const value = firstAttributeValue(connection);

  if (!value?.name) {
    return undefined;
  }

  return {
    label,
    value: value.name,
    slug: value.slug,
  };
}

/*
 * Supprime les champs non renseignés.
 */
function cleanFields(
  fields: Array<ProductPageField | undefined>
): ProductPageField[] {
  return fields.filter((field): field is ProductPageField => Boolean(field));
}

/*
 * Transforme le produit GraphQL brut en objet propre pour la page produit.
 */
export function mapProductToPageItem(
  product: GraphQLProductPageNode
): ProductPageItem {
  return {
    id: product.id,
    databaseId: product.databaseId,
    typename: product.__typename,
    productType: product.type,

    name: product.name,
    slug: product.slug,
    sku: product.sku,

    shortDescription: product.shortDescription,
    description: product.description,

    price: product.price,
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,

    stockQuantity: product.stockQuantity,
    stockStatus: product.stockStatus,
    purchasable: product.purchasable,

    image: product.image,

    categories: product.productCategories?.nodes ?? [],

    identity: cleanFields([
      makeProductPageField("Marque", product.allPaMarque),
      makeProductPageField("Instrument", product.allPaInstrument),
      makeProductPageField("Taille", product.allPaTaille),
      makeProductPageField("Modèle", product.allPaModele),
      makeProductPageField("Corde", product.allPaCorde),
      makeProductPageField("Tension", product.allPaTension),
      makeProductPageField("Type de produit", product.allPaTypeProduit),
    ]),

    sound: cleanFields([
      makeProductPageField("Profil sonore", product.allPaProfilSonore),
      makeProductPageField("Complexité", product.allPaComplexite),
      makeProductPageField("Puissance", product.allPaPuissance),
      makeProductPageField("Réponse", product.allPaReponse),
      makeProductPageField("Usage", product.allPaUsage),
      makeProductPageField("Positionnement", product.allPaPositionnement),
    ]),

    technical: cleanFields([
      makeProductPageField("Âme", product.allPaAme),
      makeProductPageField("Filage", product.allPaFilage),
      makeProductPageField("Attache", product.allPaAttache),
      makeProductPageField("Durabilité", product.allPaDurabilite),
      makeProductPageField("Stabilité d’accord", product.allPaStabilite),
      makeProductPageField("Temps de rodage", product.allPaTempsRodage),
    ]),
  };
}

/*
 * Récupère un produit par slug pour la page fiche produit.
 */
export async function getProductPageBySlug(
  slug: string
): Promise<ProductPageItem | null> {
  if (!hasWordPressEndpoint) {
    return getExampleProductPageBySlug(slug);
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetProductPageBySlug($slug: ID!) {
          product(id: $slug, idType: SLUG) {
            __typename

            ... on SimpleProduct {
              ${PRODUCT_PAGE_FIELDS}
            }

            ... on VariableProduct {
              ${PRODUCT_PAGE_FIELDS}
            }
          }
        }
      `,
      { slug }
    )) as ProductPageResponse;

    if (!data.product) {
      return null;
    }

    return mapProductToPageItem(data.product);
  } catch (error) {
    logWordPressProductError(
      `Unable to load WooCommerce product "${slug}"`,
      error
    );
    return null;
  }
}
