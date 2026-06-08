import StringsPageView from "@/modules/catalog/components/StringsPageView/StringsPageView";
import { getStringsContent } from "@/sites/chantdumerle/content/strings";
import {
  getStringProductsPageData,
  type StringProductFilters,
} from "@/modules/catalog/services/wordpressProducts";

const INSTRUMENT_FILTERS = [
  { label: "Violon", value: "violon" },
  { label: "Alto", value: "alto" },
  { label: "Violoncelle", value: "violoncelle" },
  { label: "Contrebasse", value: "contrebasse" },
] as const;

type InstrumentFilterValue = (typeof INSTRUMENT_FILTERS)[number]["value"];

const instrumentLabels = new Map(
  INSTRUMENT_FILTERS.map((instrument) => [instrument.value, instrument.label])
);

type CordesPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    instrument?: string | string[];
    corde?: string | string[];
    taille?: string | string[];
    tension?: string | string[];
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
  const filters: StringProductFilters = {
    instrument,
    corde: readSingleParam(query.corde),
    taille: readSingleParam(query.taille),
    tension: readSingleParam(query.tension),
  };
  const content = getStringsContent(locale);

  const { products, filters: filterGroups } = await getStringProductsPageData(
    locale,
    48,
    filters
  );

  const activeInstrumentLabel = instrument
    ? instrumentLabels.get(instrument)
    : undefined;

  return (
    <StringsPageView
      content={content}
      products={products}
      filters={filterGroups}
      activeFilters={{
        instrument: instrument ?? "",
        corde: filters.corde ?? "",
        taille: filters.taille ?? "",
        tension: filters.tension ?? "",
      }}
      activeInstrumentLabel={activeInstrumentLabel}
    />
  );
}
