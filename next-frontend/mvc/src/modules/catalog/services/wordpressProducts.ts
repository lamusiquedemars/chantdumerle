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
  };
};

type StringProductFilterKey = "instrument" | "corde" | "taille" | "tension";

export type StringProductFilters = Partial<
  Record<StringProductFilterKey, string>
>;

type StringProductTermsResponse = {
  allPaInstrument: { nodes: GraphQLProductAttributeTerm[] };
  allPaCorde: { nodes: GraphQLProductAttributeTerm[] };
  allPaTaille: { nodes: GraphQLProductAttributeTerm[] };
  allPaTension: { nodes: GraphQLProductAttributeTerm[] };
};

type StringProductsPageResponse = ProductsResponse & StringProductTermsResponse;

export type StringProductsPageData = {
  products: ProductCardItem[];
  filters: ProductFilterGroup[];
};

type ProductTaxonomyFilter = {
  taxonomy: string;
  terms: string[];
  operator: "AND" | "EXISTS" | "IN" | "NOT_EXISTS" | "NOT_IN";
};

const PRODUCT_DETAIL_BASE_PATH = "produits";

const STRING_PRODUCT_BASE_FILTERS: ProductTaxonomyFilter[] = [
  {
    taxonomy: "PA_INSTRUMENT",
    terms: ["violon", "alto", "violoncelle", "contrebasse"],
    operator: "IN",
  },
  {
    taxonomy: "PA_TYPE_PRODUIT",
    terms: ["colophane"],
    operator: "NOT_IN",
  },
];

const STRING_PRODUCT_FILTER_TAXONOMIES: Record<
  StringProductFilterKey,
  string
> = {
  instrument: "PA_INSTRUMENT",
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

function buildProductTaxonomyFilter(filters: StringProductFilters = {}): string {
  const productFilters = [...STRING_PRODUCT_BASE_FILTERS];

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

const STRING_FILTER_GROUPS_FIELDS = `
  allPaInstrument(first: 20) {
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
    description: htmlToPlainText(product.shortDescription),
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

    return data.products.nodes.map((product) =>
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

    return data.products.nodes.map((product) =>
      mapProductToCard(product, locale, { includeStringMetadata: true })
    );
  } catch (error) {
    logWordPressProductError("Unable to load WooCommerce string products", error);
    return [];
  }
}

/*
 * Données complètes de la page cordes.
 * Produits et options de filtre sont récupérés en une seule requête GraphQL,
 * ce qui évite deux appels WooCommerce coûteux pendant le rendu serveur.
 */
export async function getStringProductsPageData(
  locale: string = "fr",
  first = 48,
  filters: StringProductFilters = {}
): Promise<StringProductsPageData> {
  if (!hasWordPressEndpoint) {
    return {
      products: getExampleProductCards(locale, first),
      filters: STRING_FILTER_FALLBACKS,
    };
  }

  try {
    const taxonomyFilter = buildProductTaxonomyFilter(filters);
    const data = (await fetchGraphQL(
      `
        query GetStringProductsPageData($first: Int!) {
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

          ${STRING_FILTER_GROUPS_FIELDS}
        }
      `,
      { first }
    )) as StringProductsPageResponse;

    return {
      products: data.products.nodes.map((product) =>
        mapProductToCard(product, locale, { includeStringMetadata: true })
      ),
      filters: mapStringFilterGroups(data),
    };
  } catch (error) {
    logWordPressProductError(
      "Unable to load WooCommerce string products page data",
      error
    );

    return {
      products: [],
      filters: STRING_FILTER_FALLBACKS,
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
