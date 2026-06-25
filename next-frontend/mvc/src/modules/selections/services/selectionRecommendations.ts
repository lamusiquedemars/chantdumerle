import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import {
  getPackProducts,
  getSelectionStringProducts,
} from "@/modules/catalog/services/wordpressProducts";
import {
  getSelectionDetailContent,
  isSelectionDetailKind,
  selectionInstruments,
  type SelectionDetailContent,
  type SelectionDetailKind,
} from "@/content/selectionDetails";

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
  products: ProductCardItem[];
};

const PACK_TYPE_ATTRIBUTE_SLUGS: Record<string, string> = {
  "essentiel-cordes": "pack-essentiel-cordes",
  "essentiel-archet": "pack-essentiel-archet",
  "performance-archet": "pack-performance-archet",
};
const DEFAULT_SELECTION_PRODUCT_LIMIT = 48;

export async function getSelectionDetailPageData({
  locale,
  kind,
  slug,
  instrument,
  limit = 48,
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
  const productLimit = normalizeProductLimit(limit);
  const products =
    kind === "packs"
      ? await getPackProducts(
          locale,
          PACK_TYPE_ATTRIBUTE_SLUGS[slug] ?? slug,
          activeInstrument,
          productLimit
        )
      : await getSelectionStringProducts(
          locale,
          {
            kind,
            slug,
          },
          activeInstrument,
          productLimit
        );

  return {
    kind,
    slug,
    content,
    activeInstrument,
    allInstrumentsHref: `/${locale}/selections/${kind}/${slug}`,
    instruments: makeInstrumentEntries(locale, kind, slug, activeInstrument),
    products,
  };
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
  return value ? slugifySelectionValue(value) : undefined;
}

function normalizeProductLimit(limit: number) {
  if (!Number.isFinite(limit)) {
    return DEFAULT_SELECTION_PRODUCT_LIMIT;
  }

  return Math.min(Math.max(Math.floor(limit), 1), 100);
}

function slugifySelectionValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
