import type { ProductFilterGroup } from "@/modules/catalog/components/ProductFilters/ProductFilters";
import {
  fetchWooStore,
  type WooStoreAttributeTerm,
  type WooStoreCollectionData,
  type WooStoreProduct,
} from "@/integrations/woocommerce/storeApi";
import {
  getStoreAttributeTermSlugs,
  getStoreProductPrimaryBrand,
} from "@/modules/catalog/services/productMappers";

/*
 * Règles de filtres catalogue.
 * Ce fichier garde ensemble les taxonomies Woo, les fallbacks et les builders
 * de facettes pour que wordpressProducts.ts reste centré sur les requêtes.
 */
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

export type GraphQLProductAttributeTerm = {
  name: string;
  slug: string;
  count?: number | null;
};

export type StringProductTermsResponse = {
  allPaInstrument: { nodes: GraphQLProductAttributeTerm[] };
  allPaMarque: { nodes: GraphQLProductAttributeTerm[] };
  allPaCorde: { nodes: GraphQLProductAttributeTerm[] };
  allPaTaille: { nodes: GraphQLProductAttributeTerm[] };
  allPaTension: { nodes: GraphQLProductAttributeTerm[] };
};

type ProductTaxonomyFilter = {
  taxonomy: string;
  terms: string[];
  operator: "AND" | "EXISTS" | "IN" | "NOT_EXISTS" | "NOT_IN";
};

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

export const STRING_FILTER_FALLBACKS: ProductFilterGroup[] = [
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

const STRING_FILTER_LABELS: Record<StringProductFilterKey, string> = {
  instrument: "Instrument",
  marque: "Marque",
  son: "Son recherché",
  usage: "Usage",
  corde: "Corde",
  taille: "Taille",
  tension: "Tension",
};

export const STRING_STORE_ATTRIBUTE_TAXONOMIES: Record<
  StringProductFilterKey,
  string
> = {
  instrument: "pa_instrument",
  marque: "product_brand",
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
    { id: 254, name: "Aquila", slug: "aquila" },
    { id: 252, name: "D'Addario", slug: "daddario" },
    { id: 68, name: "Hidersine", slug: "hidersine" },
    { id: 65, name: "Jargar", slug: "jargar" },
    { id: 60, name: "Larsen", slug: "larsen" },
    { id: 62, name: "Optima", slug: "optima" },
    { id: 61, name: "Pirastro", slug: "pirastro" },
    { id: 251, name: "Thomastik", slug: "thomastik" },
    { id: 253, name: "Warchal", slug: "warchal" },
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

export const STRING_FILTER_GROUPS_FIELDS = `
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

function graphQLString(value: string): string {
  return JSON.stringify(value);
}

/*
 * Produit le fragment taxonomyFilter attendu par WooGraphQL.
 * Il reste necessaire pour les anciennes requetes GraphQL de produits.
 */
export function buildProductTaxonomyFilter(
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

export function mapStringFilterGroups(
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

export function appendStoreAttributeFilter(
  params: URLSearchParams,
  index: number,
  taxonomy: string,
  slugs: string[]
) {
  params.set(`attributes[${index}][attribute]`, taxonomy);
  params.set(`attributes[${index}][slug]`, slugs.join(","));
}

export function appendStringStoreFilters(
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

    if (filterKey === "marque") {
      params.set("brand", value);
      continue;
    }

    appendStoreAttributeFilter(params, index, taxonomy, [value]);
    index += 1;
  }
}

export function withoutStringProductFilter(
  filters: StringProductFilters,
  filterKey: StringProductFilterKey
): StringProductFilters {
  const nextFilters = { ...filters };

  delete nextFilters[filterKey];

  return nextFilters;
}

export function appendAccessoryStoreFilters(
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

export function appendStoreSort(
  params: URLSearchParams,
  sort?: StringProductSortKey
) {
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

export function storeProductMatchesStringFilters(
  product: WooStoreProduct,
  filters: StringProductFilters
): boolean {
  for (const [filterKey, value] of Object.entries(filters) as [
    StringProductFilterKey,
    string | undefined,
  ][]) {
    if (!value) {
      continue;
    }

    const slugs =
      filterKey === "marque"
        ? [getStoreProductPrimaryBrand(product)?.slug].filter(Boolean)
        : getStoreAttributeTermSlugs(
            product,
            STRING_STORE_ATTRIBUTE_TAXONOMIES[filterKey]
          );

    if (!slugs.includes(value)) {
      return false;
    }
  }

  return true;
}

function getStoreBrandTerms(
  products: WooStoreProduct[]
): GraphQLProductAttributeTerm[] {
  const terms = new Map<string, GraphQLProductAttributeTerm>();

  for (const product of products) {
    const brand = getStoreProductPrimaryBrand(product);

    if (!brand) {
      continue;
    }

    terms.set(brand.slug, {
      name: brand.name,
      slug: brand.slug,
      count: 1,
    });
  }

  return [...terms.values()];
}

function mergeFilterOptions(
  primaryOptions: ProductFilterGroup["options"],
  secondaryTerms: GraphQLProductAttributeTerm[]
): ProductFilterGroup["options"] {
  const options = new Map(
    primaryOptions.map((option) => [option.value, option])
  );

  for (const term of secondaryTerms) {
    if (!options.has(term.slug)) {
      options.set(term.slug, termToFilterOption(term));
    }
  }

  return [...options.values()];
}

/*
 * Construit les facettes dynamiques de la page Cordes depuis la Store API.
 * Les IDs viennent de Woo et servent a recoller les counts aux slugs affiches.
 */
export async function getStoreFilterGroups(
  filters: StringProductFilters,
  products: WooStoreProduct[] = [],
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
      if (options.completeSetsOnly && filterKey === "corde") {
        return {
          name: filterKey,
          label: STRING_FILTER_LABELS[filterKey],
          options: [],
        };
      }

      const countedOptions = sortTerms(
        STRING_STORE_ATTRIBUTE_TERMS[filterKey]
          .map((term) => ({
            ...term,
            count: counts.get(term.id) ?? 0,
          }))
          .filter((term) => term.count > 0),
        STRING_FILTER_OPTION_ORDER[filterKey]
      ).map(termToFilterOption);
      const filterOptions =
        filterKey === "marque"
          ? mergeFilterOptions(
              countedOptions,
              sortTerms(getStoreBrandTerms(products))
            )
          : countedOptions;

      return {
        name: filterKey,
        label: STRING_FILTER_LABELS[filterKey],
        options: filterOptions,
      };
    })
    .filter((filter) => filter.options.length > 0);
}

export async function getAccessoryStoreFilterGroups(
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
