import AccessoriesPageView from "@/modules/catalog/components/AccessoriesPageView/AccessoriesPageView";
import { getAccessoriesContent } from "@/content/accessories";
import { getGuideCards } from "@/modules/guides/services/wordpressGuides";
import {
  getAccessoryProductsPageData,
  type AccessoryProductFilters,
  type AccessoryProductSortKey,
} from "@/modules/catalog/services/wordpressProducts";

type AccessoiresPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    type?: string | string[];
    instrument?: string | string[];
    marque?: string | string[];
    page?: string | string[];
    sort?: string | string[];
  }>;
};

function readSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isAccessoryProductSortKey(
  value?: string
): value is AccessoryProductSortKey {
  return (
    value === "name-asc" ||
    value === "name-desc" ||
    value === "price-asc" ||
    value === "price-desc"
  );
}

export default async function AccessoiresPage({
  params,
  searchParams,
}: AccessoiresPageProps) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  const filters: AccessoryProductFilters = {
    type: readSingleParam(query.type),
    instrument: readSingleParam(query.instrument),
    marque: readSingleParam(query.marque),
  };
  const page = Number(readSingleParam(query.page) ?? "1");
  const rawSort = readSingleParam(query.sort);
  const sort = isAccessoryProductSortKey(rawSort) ? rawSort : undefined;
  const guideItems = await getGuideCards(locale, 3);
  const content = getAccessoriesContent(locale, guideItems);
  const accessoryProductsData = await getAccessoryProductsPageData(
    locale,
    20,
    filters,
    Number.isFinite(page) ? page : 1,
    sort
  );

  return (
    <AccessoriesPageView
      locale={locale}
      content={content}
      products={accessoryProductsData.products}
      filters={accessoryProductsData.filters}
      pagination={accessoryProductsData.pagination}
      activeFilters={{
        type: filters.type ?? "",
        instrument: filters.instrument ?? "",
        marque: filters.marque ?? "",
      }}
      activeSort={sort ?? ""}
    />
  );
}
