import type { ProductCardItem } from "@/components/product/ProductCard/ProductCard";
import { fetchGraphQL } from "@/lib/wordpress/client";

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

/*
 * Fragment utilisé quand on doit aussi connaître l’instrument.
 */
const PRODUCT_CARD_WITH_INSTRUMENT_FIELDS = `
  __typename

  ... on SimpleProduct {
    ${PRODUCT_CARD_CORE_FIELDS}
    allPaInstrument {
      nodes {
        name
        slug
      }
    }
    price
    regularPrice
    salePrice
  }

  ... on VariableProduct {
    ${PRODUCT_CARD_CORE_FIELDS}
    allPaInstrument {
      nodes {
        name
        slug
      }
    }
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
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
};

type ProductsResponse = {
  products: {
    nodes: GraphQLProductNode[];
  };
};

/*
 * Retourne le chemin de base selon la catégorie principale du produit.
 */
function getBasePathForCategory(categorySlug: string): string {
  const stringCategorySlugs = [
    "cordes",
    "violon",
    "alto",
    "violoncelle",
    "cello",
    "contrebasse",
  ];

  if (stringCategorySlugs.includes(categorySlug)) {
    return "cordes";
  }

  if (categorySlug === "accessoires") {
    return "accessoires";
  }

  return "produit";
}

/*
 * Transforme un produit WooGraphQL en ProductCardItem.
 * La marque vient de pa_marque, pas des catégories.
 */
export function mapProductToCard(
  product: GraphQLProductNode,
  locale: string = "fr",
  basePath: string = "produit"
): ProductCardItem {
  const brand = product.allPaMarque?.nodes[0]?.name;
  const safeLocale = normalizeLocale(locale);

  return {
    title: product.name,
    href: `/${safeLocale}/${basePath}/${product.slug}`,
    description: product.shortDescription ?? undefined,
    price: product.price ?? product.regularPrice ?? undefined,
    image: product.image?.sourceUrl ?? undefined,
    brand,
  };
}

/*
 * Tous les produits.
 */
export async function getProducts(
  locale: string = "fr",
  first = 12
): Promise<ProductCardItem[]> {
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
    mapProductToCard(product, locale, "produit")
  );
}

/*
 * Produits mis en avant, toutes catégories.
 */
export async function getFeaturedProducts(
  locale: string = "fr",
  first = 8
): Promise<ProductCardItem[]> {
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
    mapProductToCard(product, locale, "produit")
  );
}

/*
 * Produits d’une catégorie WooCommerce.
 */
export async function getProductsByCategory(
  locale: string = "fr",
  categorySlug: string,
  first = 12
): Promise<ProductCardItem[]> {
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

  const basePath = getBasePathForCategory(categorySlug);

  return data.products.nodes.map((product) =>
    mapProductToCard(product, locale, basePath)
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

  const basePath = getBasePathForCategory(categorySlug);

  return data.products.nodes.map((product) =>
    mapProductToCard(product, locale, basePath)
  );
}

/*
 * Cordes mises en avant.
 */
export async function getFeaturedStringProducts(
  locale: string = "fr",
  first = 8
): Promise<ProductCardItem[]> {
  return getFeaturedProductsByCategory(locale, "cordes", first);
}

/*
 * Toutes les cordes.
 */
export async function getStringProducts(
  locale: string = "fr",
  first = 24
): Promise<ProductCardItem[]> {
  return getProductsByCategory(locale, "cordes", first);
}

/*
 * Cordes filtrées par instrument.
 * Filtrage côté Next.js, car attributeTerm attend un ID de terme.
 */
export async function getStringProductsByInstrument(
  locale: string = "fr",
  instrumentSlug: string,
  first = 48
): Promise<ProductCardItem[]> {
  const data = (await fetchGraphQL(
    `
      query GetStringProductsByInstrument($first: Int!) {
        products(first: $first, where: { category: "cordes" }) {
          nodes {
            ${PRODUCT_CARD_WITH_INSTRUMENT_FIELDS}
          }
        }
      }
    `,
    { first }
  )) as ProductsResponse;

  return data.products.nodes
    .filter((product) =>
      product.allPaInstrument?.nodes.some(
        (instrument) => instrument.slug === instrumentSlug
      )
    )
    .map((product) => mapProductToCard(product, locale, "cordes"));
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
}