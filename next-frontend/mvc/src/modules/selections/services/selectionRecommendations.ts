import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import { getProductsBySkus } from "@/modules/catalog/services/wordpressProducts";
import {
  getSelectionDetailContent,
  isSelectionDetailKind,
  selectionInstruments,
  type SelectionDetailContent,
  type SelectionDetailKind,
} from "@/sites/chantdumerle/content/selectionDetails";

type CsvRow = Record<string, string>;

export type SelectionRecommendationType = "jeu_complet" | "jeu_compose";

export type SelectionRecommendation = {
  code: string;
  title: string;
  instrument: string;
  type: SelectionRecommendationType;
  objective: string;
  usage: string;
  soundProfile: string;
  confidence: string;
  note: string;
  model?: string;
  sku?: string;
  productSlug?: string;
  productImage?: string;
  price?: string;
  stock?: string;
  estimatedPrice?: string;
  product?: ProductCardItem;
  previewProduct?: ProductCardItem;
  strings: SelectionRecommendationString[];
};

export type SelectionRecommendationString = {
  label: string;
  model: string;
  sku: string;
  stock: string;
  price: string;
};

export type SelectionRecommendationGroup = {
  key: string;
  title: string;
  subtitle: string;
  items: SelectionRecommendation[];
};

export type SelectionRecommendationsPageData = {
  featured: SelectionRecommendation[];
  byUsage: SelectionRecommendationGroup[];
  byInstrument: SelectionRecommendationGroup[];
  bySound: SelectionRecommendationGroup[];
  stats: {
    total: number;
    completeSets: number;
    composedSets: number;
    instruments: number;
  };
};

export type SelectionDetailPageData = {
  kind: SelectionDetailKind;
  slug: string;
  content: SelectionDetailContent;
  activeInstrument?: string;
  allInstrumentsHref: string;
  instruments: {
    label: string;
    value: string;
    description: string;
    href: string;
    active: boolean;
  }[];
  recommendations: SelectionRecommendation[];
  products: ProductCardItem[];
};

const CSV_RELATIVE_PATH = "woo-backend/wp-content/uploads/wc-imports/propositions_selections_jeux_composes.csv";
const STRING_COLUMNS = ["Mi", "La", "Ré", "Sol", "Do"] as const;
const PRODUCT_LOOKUP_TIMEOUT_MS = 20000;

const USAGE_LABELS: Record<string, string> = {
  etudiant: "Étudiant",
  orchestre: "Orchestre",
  soliste: "Soliste",
};

const SOUND_LABELS: Record<string, string> = {
  chaud: "Son chaud",
  equilibre: "Équilibre",
  brillant: "Projection",
};

const INSTRUMENT_LABELS: Record<string, string> = {
  violon: "Violon",
  alto: "Alto",
  violoncelle: "Violoncelle",
  contrebasse: "Contrebasse",
};

export async function getSelectionRecommendationsPageData(
  locale: string = "fr"
): Promise<SelectionRecommendationsPageData> {
  const recommendations = await getSelectionRecommendations(locale);
  const featured = pickFeaturedRecommendations(recommendations);

  return {
    featured,
    byUsage: buildGroups(recommendations, {
      labels: USAGE_LABELS,
      getKeys: (item) => splitFacet(item.usage),
      subtitle:
        "Des ensembles pensés pour partir d'un contexte de jeu plutôt que d'une marque.",
    }),
    byInstrument: buildGroups(recommendations, {
      labels: INSTRUMENT_LABELS,
      getKeys: (item) => [slugify(item.instrument)],
      subtitle:
        "Un accès rapide aux propositions par famille d'instrument, avec jeux complets et jeux composés.",
    }),
    bySound: buildGroups(recommendations, {
      labels: SOUND_LABELS,
      getKeys: (item) => [slugify(item.soundProfile)],
      subtitle:
        "Pour corriger une couleur trop claire, chercher plus de présence ou garder un équilibre fiable.",
    }),
    stats: {
      total: recommendations.length,
      completeSets: recommendations.filter((item) => item.type === "jeu_complet").length,
      composedSets: recommendations.filter((item) => item.type === "jeu_compose").length,
      instruments: new Set(recommendations.map((item) => item.instrument)).size,
    },
  };
}

export async function getSelectionDetailPageData({
  locale,
  kind,
  slug,
  instrument,
  limit = 10,
}: {
  locale: string;
  kind: string;
  slug: string;
  instrument?: string;
  limit?: number;
}): Promise<SelectionDetailPageData | undefined> {
  if (!isSelectionDetailKind(kind)) {
    return undefined;
  }

  const content = getSelectionDetailContent(kind, slug);

  if (!content) {
    return undefined;
  }

  const activeInstrument = normalizeOptionalSlug(instrument);
  const recommendations = filterRecommendations(
    await getRawSelectionRecommendations(),
    kind,
    slug,
    activeInstrument
  )
    .sort(sortRecommendation)
    .slice(0, limit);
  const enrichedRecommendations = await enrichRecommendationsWithProducts(
    locale,
    recommendations
  );
  const products = enrichedRecommendations
    .map((recommendation) => recommendation.product)
    .filter((product): product is ProductCardItem => Boolean(product));

  return {
    kind,
    slug,
    content,
    activeInstrument,
    allInstrumentsHref: `/${locale}/selections/${kind}/${slug}`,
    instruments: makeInstrumentEntries(locale, kind, slug, activeInstrument),
    recommendations: enrichedRecommendations,
    products,
  };
}

async function getSelectionRecommendations(locale: string) {
  return enrichRecommendationsWithProducts(
    locale,
    await getRawSelectionRecommendations()
  );
}

async function getRawSelectionRecommendations() {
  const rows = parseCsv(await readSelectionCsv());
  return rows
    .map(mapRowToRecommendation)
    .filter((item): item is SelectionRecommendation => Boolean(item));
}

async function enrichRecommendationsWithProducts(
  locale: string,
  recommendations: SelectionRecommendation[]
) {
  const directProductCards = Object.fromEntries(
    recommendations
      .map((item) => makeSelectionProductCard(locale, item))
      .filter(
        (entry): entry is readonly [string, ProductCardItem] => Boolean(entry)
      )
  );
  const productCards = await getSelectionProductCards(
    locale,
    recommendations
      .filter((item) => item.sku && !directProductCards[item.sku.toUpperCase()])
      .map((item) => item.sku)
      .filter((sku): sku is string => Boolean(sku))
  );
  const allProductCards = {
    ...productCards,
    ...directProductCards,
  };

  return recommendations.map((item) => ({
    ...item,
    product: item.sku ? allProductCards[item.sku.toUpperCase()] : undefined,
    previewProduct:
      (item.sku ? allProductCards[item.sku.toUpperCase()] : undefined) ??
      item.strings
        .map((string) => allProductCards[string.sku.toUpperCase()])
        .find(Boolean),
  }));
}

function makeSelectionProductCard(
  locale: string,
  item: SelectionRecommendation
): readonly [string, ProductCardItem] | undefined {
  if (!item.sku || !item.productSlug) {
    return undefined;
  }

  return [
    item.sku.toUpperCase(),
    {
      title: item.title,
      href: `/${locale}/produits/${item.productSlug}`,
      description: item.objective || item.note,
      price: formatSelectionPrice(locale, item.price),
      image: item.productImage,
      brand: item.instrument,
      metadata: [
        { label: "Usage", value: item.usage },
        { label: "Son", value: item.soundProfile },
      ],
    },
  ] as const;
}

function formatSelectionPrice(locale: string, value?: string) {
  if (!value) {
    return undefined;
  }

  const price = Number(value.replace(",", "."));

  if (!Number.isFinite(price)) {
    return value;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

async function getSelectionProductCards(locale: string, skus: string[]) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      getProductsBySkus(locale, skus),
      new Promise<Record<string, ProductCardItem>>((resolve) => {
        timeout = setTimeout(() => resolve({}), PRODUCT_LOOKUP_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

async function readSelectionCsv() {
  const candidates = [
    path.resolve(/*turbopackIgnore: true*/ process.cwd(), CSV_RELATIVE_PATH),
    path.resolve(/*turbopackIgnore: true*/ process.cwd(), "..", CSV_RELATIVE_PATH),
    path.resolve(/*turbopackIgnore: true*/ process.cwd(), "..", "..", CSV_RELATIVE_PATH),
    path.resolve(/*turbopackIgnore: true*/ process.cwd(), "..", "..", "..", CSV_RELATIVE_PATH),
  ];

  for (const candidate of candidates) {
    try {
      return await readFile(candidate, "utf8");
    } catch {
      // Try the next likely project root.
    }
  }

  throw new Error(`Unable to read selection CSV at ${CSV_RELATIVE_PATH}`);
}

function mapRowToRecommendation(row: CsvRow): SelectionRecommendation | undefined {
  const code = row.code?.trim();
  const title = row.titre?.trim();

  if (!code || !title) {
    return undefined;
  }

  const type = normalizeSelectionType(row.type_selection);
  const sku = row.sku_jeu_complet?.trim();

  return {
    code,
    title,
    type,
    sku: sku || undefined,
    instrument: row.instrument?.trim() ?? "",
    objective: row.objectif?.trim() ?? "",
    usage: row.usage_cible?.trim() ?? "",
    soundProfile: row.profil_sonore_cible?.trim() ?? "",
    confidence: row.confiance?.trim() ?? "",
    note: row.note?.trim() ?? "",
    model: row.modele_jeu_complet?.trim() || undefined,
    productSlug: row.slug_jeu_complet?.trim() || undefined,
    productImage: row.image_jeu_complet?.trim() || undefined,
    price: row.prix_jeu_complet?.trim() || undefined,
    stock: row.stock_jeu_complet?.trim() || undefined,
    estimatedPrice: row.prix_total_estime_cordes?.trim() || undefined,
    strings: STRING_COLUMNS.map((label) => ({
      label,
      model: row[`${label}_modele`]?.trim() ?? "",
      sku: row[`${label}_sku`]?.trim() ?? "",
      stock: row[`${label}_stock`]?.trim() ?? "",
      price: row[`${label}_prix`]?.trim() ?? "",
    })).filter((string) => string.model || string.sku),
  };
}

function normalizeSelectionType(value: string): SelectionRecommendationType {
  return slugify(value).includes("compose") ? "jeu_compose" : "jeu_complet";
}

function pickFeaturedRecommendations(items: SelectionRecommendation[]) {
  const preferredCodes = ["VLN-01", "VLC-01", "VLA-06", "DB-11", "VLN-07", "VLC-22"];
  const byCode = new Map(items.map((item) => [item.code, item]));
  const featured = preferredCodes
    .map((code) => byCode.get(code))
    .filter((item): item is SelectionRecommendation => Boolean(item));

  return featured.length > 0 ? featured : items.slice(0, 6);
}

function buildGroups(
  items: SelectionRecommendation[],
  config: {
    labels: Record<string, string>;
    subtitle: string;
    getKeys: (item: SelectionRecommendation) => string[];
  }
): SelectionRecommendationGroup[] {
  return Object.entries(config.labels)
    .map(([key, title]) => ({
      key,
      title,
      subtitle: config.subtitle,
      items: items
        .filter((item) => config.getKeys(item).includes(key))
        .sort(sortRecommendation),
    }))
    .filter((group) => group.items.length > 0);
}

function sortRecommendation(left: SelectionRecommendation, right: SelectionRecommendation) {
  const leftScore = recommendationScore(left);
  const rightScore = recommendationScore(right);

  if (leftScore !== rightScore) {
    return rightScore - leftScore;
  }

  return left.code.localeCompare(right.code, "fr");
}

function recommendationScore(item: SelectionRecommendation) {
  const confidenceScore = item.confidence === "élevée" ? 3 : item.confidence === "moyenne" ? 2 : 1;
  const productScore = item.product ? 2 : 0;
  const typeScore = item.type === "jeu_compose" ? 1 : 0;

  return confidenceScore + productScore + typeScore;
}

function splitFacet(value: string) {
  return value
    .split("/")
    .map(slugify)
    .filter(Boolean);
}

function filterRecommendations(
  recommendations: SelectionRecommendation[],
  kind: SelectionDetailKind,
  slug: string,
  instrument?: string
) {
  if (kind === "packs") {
    return [];
  }

  return recommendations.filter((item) => {
    const facetValues =
      kind === "usage" ? splitFacet(item.usage) : [slugify(item.soundProfile)];
    const matchesFacet = facetValues.includes(slug);
    const matchesInstrument = instrument
      ? slugify(item.instrument) === instrument
      : true;

    return matchesFacet && matchesInstrument;
  });
}

function makeInstrumentEntries(
  locale: string,
  kind: SelectionDetailKind,
  slug: string,
  activeInstrument?: string
) {
  const basePath = `/${locale}/selections/${kind}/${slug}`;

  return selectionInstruments.map((instrument) => ({
    ...instrument,
    href: `${basePath}?instrument=${instrument.value}`,
    active: activeInstrument === instrument.value,
  }));
}

function normalizeOptionalSlug(value?: string) {
  return value ? slugify(value) : undefined;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCsv(csv: string): CsvRow[] {
  const rows = parseCsvRows(csv.replace(/^\uFEFF/, ""));
  const [header = [], ...body] = rows;

  return body.map((row) =>
    Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""]))
  );
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((csvRow) => csvRow.some((cell) => cell.trim()));
}
