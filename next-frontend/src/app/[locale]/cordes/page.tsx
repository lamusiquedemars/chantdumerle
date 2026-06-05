import StringsPageView from "@/modules/catalog/components/StringsPageView/StringsPageView";
import { getStringsContent } from "@/sites/chantdumerle/content/strings";
import {
  getStringProducts,
  getStringProductsByInstrument,
} from "@/modules/catalog/services/wordpressProducts";

const INSTRUMENT_FILTERS = [
  { label: "Violon", value: "violon" },
  { label: "Alto", value: "alto" },
  { label: "Violoncelle", value: "cello" },
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

function normalizeInstrument(
  value?: string
): InstrumentFilterValue | undefined {
  if (!isInstrumentFilterValue(value)) {
    return undefined;
  }

  return value;
}

export default async function CordesPage({
  params,
  searchParams,
}: CordesPageProps) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  const instrument = normalizeInstrument(readSingleParam(query.instrument));
  const content = getStringsContent(locale);

  const products = instrument
    ? await getStringProductsByInstrument(locale, instrument)
    : await getStringProducts(locale);

  const activeInstrumentLabel = instrument
    ? instrumentLabels.get(instrument)
    : undefined;

  return (
    <StringsPageView
      content={content}
      products={products}
      filters={[
        {
          name: "instrument",
          label: "Instrument",
          options: [...INSTRUMENT_FILTERS],
        },
      ]}
      activeFilters={{
        instrument: instrument ?? "",
      }}
      activeInstrumentLabel={activeInstrumentLabel}
    />
  );
}
