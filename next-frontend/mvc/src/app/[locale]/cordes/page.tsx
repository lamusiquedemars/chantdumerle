import StringsPageView from "@/modules/catalog/components/StringsPageView/StringsPageView";
import type { SelectionEntryKind } from "@/modules/catalog/types";
import { getStringsContent } from "@/sites/chantdumerle/content/strings";
import {
  getStringProductsPageData,
  type StringProductFilters,
  type StringProductSortKey,
} from "@/modules/catalog/services/wordpressProducts";

const INSTRUMENT_FILTERS = [
  { label: "Violon", value: "violon" },
  { label: "Alto", value: "alto" },
  { label: "Violoncelle", value: "violoncelle" },
  { label: "Contrebasse", value: "contrebasse" },
] as const;

type InstrumentFilterValue = (typeof INSTRUMENT_FILTERS)[number]["value"];

type CordesPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    instrument?: string | string[];
    marque?: string | string[];
    corde?: string | string[];
    taille?: string | string[];
    tension?: string | string[];
    son?: string | string[];
    usage?: string | string[];
    page?: string | string[];
    sort?: string | string[];
    prefilter?: string | string[];
  }>;
};

function readSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isInstrumentFilterValue(
  value?: string
): value is InstrumentFilterValue {
  return Boolean(
    value &&
      INSTRUMENT_FILTERS.some((instrument) => instrument.value === value)
  );
}

function isStringProductSortKey(value?: string): value is StringProductSortKey {
  return (
    value === "name-asc" ||
    value === "name-desc" ||
    value === "price-asc" ||
    value === "price-desc"
  );
}

export default async function CordesPage({
  params,
  searchParams,
}: CordesPageProps) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  const rawInstrument = readSingleParam(query.instrument);
  const instrument = isInstrumentFilterValue(rawInstrument)
    ? rawInstrument
    : undefined;
  const son = readSingleParam(query.son);
  const usage = readSingleParam(query.usage);
  const prefilter = readSingleParam(query.prefilter);
  const activeEntryKind: SelectionEntryKind | undefined =
    prefilter === "instrument" && instrument
      ? "instrument"
      : prefilter === "sound" && son
        ? "sound"
        : prefilter === "usage" && usage
          ? "usage"
          : undefined;
  const completeSetsOnly =
    activeEntryKind === "sound" || activeEntryKind === "usage";
  const filters: StringProductFilters = {
    instrument,
    marque: readSingleParam(query.marque),
    son,
    usage,
    corde: completeSetsOnly ? undefined : readSingleParam(query.corde),
    taille: completeSetsOnly ? undefined : readSingleParam(query.taille),
    tension: completeSetsOnly ? undefined : readSingleParam(query.tension),
  };
  const page = Number(readSingleParam(query.page) ?? "1");
  const rawSort = readSingleParam(query.sort);
  const sort = isStringProductSortKey(rawSort) ? rawSort : undefined;
  const content = getStringsContent(locale);

  const stringProductsData = await getStringProductsPageData(
    locale,
    20,
    filters,
    Number.isFinite(page) ? page : 1,
    sort,
    { completeSetsOnly }
  );

  // Une entree depuis une carte de navigation devient une page de selection,
  // meme si techniquement elle repose encore sur des filtres d'URL.
  const activeFilterIntro =
    activeEntryKind === "instrument" && instrument
    ? content.filterIntros?.instrument?.[instrument]
      : activeEntryKind === "sound" && son
        ? content.filterIntros?.sound?.[son]
        : activeEntryKind === "usage" && usage
          ? content.filterIntros?.usage?.[usage]
          : undefined;

  return (
    <StringsPageView
      locale={locale}
      content={content}
      products={stringProductsData.products}
      filters={stringProductsData.filters}
      pagination={stringProductsData.pagination}
      activeFilters={{
        instrument: instrument ?? "",
        marque: filters.marque ?? "",
        son: filters.son ?? "",
        usage: filters.usage ?? "",
        corde: filters.corde ?? "",
        taille: filters.taille ?? "",
        tension: filters.tension ?? "",
      }}
      activeSort={sort ?? ""}
      activeEntryKind={activeEntryKind}
      activeFilterIntro={activeFilterIntro}
    />
  );
}
