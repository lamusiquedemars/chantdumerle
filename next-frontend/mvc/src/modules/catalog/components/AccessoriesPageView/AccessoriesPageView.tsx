import Hero from "@/components/blocks/Hero/Hero";
import EntryGrid from "@/components/blocks/EntryGrid/EntryGrid";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumbs/Breadcrumbs";
import ProductFilters, {
  type ProductFilterGroup,
} from "@/modules/catalog/components/ProductFilters/ProductFilters";
import CatalogResultsStatus from "@/modules/catalog/components/CatalogResultsStatus/CatalogResultsStatus";
import ProductGrid from "@/modules/catalog/components/ProductGrid/ProductGrid";
import ProductPagination from "@/modules/catalog/components/ProductPagination/ProductPagination";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { AccessoriesContent } from "@/modules/catalog/types";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import styles from "./AccessoriesPageView.module.css";

type AccessoriesPageViewProps = {
  locale: string;
  content: AccessoriesContent;
  products: ProductCardItem[];
  filters?: ProductFilterGroup[];
  pagination?: {
    page: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    resultCount: number;
  };
  activeFilters?: Record<string, string>;
  activeSort?: string;
};

function getFilterOptionLabel(
  filters: ProductFilterGroup[],
  name: string,
  value?: string
): string | undefined {
  if (!value) {
    return undefined;
  }

  return filters
    .find((filter) => filter.name === name)
    ?.options.find((option) => option.value === value)?.label;
}

function makeBreadcrumbHref(
  locale: string,
  values: Record<string, string>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();

  return localizedHref(locale, query ? `/accessoires?${query}` : "/accessoires");
}

function buildBreadcrumbItems({
  locale,
  filters,
  activeFilters,
}: {
  locale: string;
  filters: ProductFilterGroup[];
  activeFilters: Record<string, string>;
}): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: "Accueil", href: localizedHref(locale) },
    { label: "Accessoires", href: localizedHref(locale, "/accessoires") },
  ];
  const filterCrumbs: Array<{ name: string; value: string }> = [
    { name: "type", value: activeFilters.type },
    { name: "instrument", value: activeFilters.instrument },
    { name: "marque", value: activeFilters.marque },
  ].filter((item) => Boolean(item.value));

  filterCrumbs.forEach((crumb, index) => {
    const values = Object.fromEntries(
      filterCrumbs.slice(0, index + 1).map((item) => [item.name, item.value])
    );
    const isLast = index === filterCrumbs.length - 1;

    items.push({
      label:
        getFilterOptionLabel(filters, crumb.name, crumb.value) ?? crumb.value,
      href: isLast ? undefined : makeBreadcrumbHref(locale, values),
    });
  });

  return items;
}

export default function AccessoriesPageView({
  locale,
  content,
  products,
  filters = [],
  pagination,
  activeFilters = {},
  activeSort = "",
}: AccessoriesPageViewProps) {
  const paginationValues = {
    ...activeFilters,
    sort: activeSort,
  };
  const breadcrumbItems = buildBreadcrumbItems({
    locale,
    filters,
    activeFilters,
  });

  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImage={content.hero.backgroundImage}
        height="compact"
        actions={[]}
      />

      <Section padding="tight" background="catalogIntro">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

          <SectionHeading
            title={content.products.title}
            subtitle={content.products.subtitle}
            className={styles.introHeading}
          />

          {filters.length > 0 ? (
            <ProductFilters
              filters={filters}
              values={activeFilters}
              sort={activeSort}
              className={styles.filters}
            />
          ) : null}
        </Container>
      </Section>

      <Section padding="results" background="catalogResults">
        <Container width="wide">
          <CatalogResultsStatus
            resultCount={pagination?.resultCount}
            emptyMessage={
              products.length === 0
                ? "Aucun accessoire ne correspond encore à ce filtre."
                : undefined
            }
          />

          {products.length > 0 ? <ProductGrid items={products} /> : null}

          {pagination ? (
            <ProductPagination
              page={pagination.page}
              pageCount={pagination.pageCount}
              hasPreviousPage={pagination.hasPreviousPage}
              hasNextPage={pagination.hasNextPage}
              values={paginationValues}
            />
          ) : null}
        </Container>
      </Section>

      <Section padding="split" background="soft">
        <Container>
          <SectionHeading
            title={content.categories.title}
            subtitle={content.categories.subtitle}
          />

          <EntryGrid items={content.categories.items} columns="three" />
        </Container>
      </Section>

      {content.guides.items.length > 0 ? (
        <Section padding="split" background="soft">
          <Container>
            <SectionHeading
              title={content.guides.title}
              subtitle={content.guides.subtitle}
            />

            <GuideList items={content.guides.items} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}
