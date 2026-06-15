import Hero from "@/components/blocks/Hero/Hero";
import EntryGrid from "@/components/blocks/EntryGrid/EntryGrid";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import ProductGrid from "@/modules/catalog/components/ProductGrid/ProductGrid";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import ProductFilters, {
  type ProductFilterGroup,
} from "@/modules/catalog/components/ProductFilters/ProductFilters";
import ProductPagination from "@/modules/catalog/components/ProductPagination/ProductPagination";
import type {
  SelectionEntryKind,
  SelectionEntryContent,
  StringsContent,
} from "@/modules/catalog/types";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import SelectionGrid from "@/modules/selections/components/SelectionGrid/SelectionGrid";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import styles from "./StringsPageView.module.css";

type StringsPageViewProps = {
  locale: string;
  content: StringsContent;
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
  activeEntryKind?: SelectionEntryKind;
  activeFilterIntro?: SelectionEntryContent;
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

  return localizedHref(locale, query ? `/cordes?${query}` : "/cordes");
}

function buildBreadcrumbItems({
  locale,
  filters,
  activeFilters,
  activeEntryKind,
  activeFilterIntro,
}: {
  locale: string;
  filters: ProductFilterGroup[];
  activeFilters: Record<string, string>;
  activeEntryKind?: SelectionEntryKind;
  activeFilterIntro?: SelectionEntryContent;
}): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: "Accueil", href: localizedHref(locale) },
    { label: "Cordes", href: localizedHref(locale, "/cordes") },
  ];

  if (activeEntryKind === "instrument" && activeFilters.instrument) {
    items.push({
      label:
        getFilterOptionLabel(filters, "instrument", activeFilters.instrument) ??
        activeFilters.instrument,
    });

    return items;
  }

  if (activeEntryKind === "sound" && activeFilters.son) {
    items.push({
      label:
        activeFilterIntro?.heroTitle.replace(/^Cordes au son /, "Son ") ??
        getFilterOptionLabel(filters, "son", activeFilters.son) ??
        activeFilters.son,
    });

    return items;
  }

  if (activeEntryKind === "usage" && activeFilters.usage) {
    items.push({
      label:
        activeFilterIntro?.heroTitle.replace(/^Cordes pour /, "") ??
        getFilterOptionLabel(filters, "usage", activeFilters.usage) ??
        activeFilters.usage,
    });

    return items;
  }

  const filterCrumbs: Array<{ name: string; value: string }> = [
    { name: "instrument", value: activeFilters.instrument },
    { name: "marque", value: activeFilters.marque },
    { name: "corde", value: activeFilters.corde },
    { name: "taille", value: activeFilters.taille },
    { name: "tension", value: activeFilters.tension },
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

// Vue de l'univers cordes, gardee dans le module catalogue.
export default function StringsPageView({
  locale,
  content,
  products,
  filters = [],
  pagination,
  activeFilters = {},
  activeSort = "",
  activeEntryKind,
  activeFilterIntro,
}: StringsPageViewProps) {
  const isSelectionEntry = Boolean(activeFilterIntro);
  const heroTitle = activeFilterIntro?.heroTitle ?? content.hero.title;
  const heroSubtitle = activeFilterIntro?.heroSubtitle ?? content.hero.subtitle;
  const visibleFilterNames =
    activeEntryKind === "instrument"
      ? ["marque", "usage", "son", "corde", "taille", "tension"]
      : activeEntryKind === "sound" || activeEntryKind === "usage"
        ? ["instrument", "marque"]
        : [];
  const visibleFilters = isSelectionEntry
    ? filters.filter((filter) => visibleFilterNames.includes(filter.name))
    : filters;
  const preservedFilterValues: Record<string, string> = {};

  if (activeEntryKind) {
    preservedFilterValues.prefilter = activeEntryKind;
  }

  if (activeEntryKind === "instrument") {
    preservedFilterValues.instrument = activeFilters.instrument ?? "";
  }

  if (activeEntryKind === "sound") {
    preservedFilterValues.son = activeFilters.son ?? "";
  }

  if (activeEntryKind === "usage") {
    preservedFilterValues.usage = activeFilters.usage ?? "";
  }
  const paginationValues = {
    ...preservedFilterValues,
    ...activeFilters,
    sort: activeSort,
  };
  const breadcrumbItems = buildBreadcrumbItems({
    locale,
    filters,
    activeFilters,
    activeEntryKind,
    activeFilterIntro,
  });

  return (
    <>
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={content.hero.backgroundImage}
        actions={[]}
        className={styles.hero}
      />

      <Section className={styles.introSection}>
        <Container>
          <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

          {!isSelectionEntry ? (
            <SectionHeading
              title={content.products.title}
              subtitle={content.products.subtitle}
              className={styles.introHeading}
            />
          ) : null}

          {activeFilterIntro ? (
            <div className={styles.filterIntro}>
              <h3 className={styles.filterIntroTitle}>
                {activeFilterIntro.title}
              </h3>
              {activeFilterIntro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {activeFilterIntro.action ? (
                <LinkButton href={activeFilterIntro.action.href}>
                  {activeFilterIntro.action.label}
                </LinkButton>
              ) : null}
            </div>
          ) : null}

          {visibleFilters.length > 0 ? (
            <ProductFilters
              filters={visibleFilters}
              values={activeFilters}
              preservedValues={preservedFilterValues}
              sort={activeSort}
              className={styles.filters}
            />
          ) : null}
        </Container>
      </Section>

      <Section className={styles.resultsSection}>
        <Container className={styles.resultsContainer}>
          {pagination ? (
            <p className={styles.resultsCount}>
              {pagination.resultCount}{" "}
              {pagination.resultCount > 1 ? "résultats" : "résultat"}
            </p>
          ) : null}

          {products.length > 0 ? (
            <ProductGrid items={products} />
          ) : null}

          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Aucune corde ne correspond encore à ce filtre.</p>
            </div>
          ) : null}

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

      <Section className={styles.orientationSection}>
        <Container>
          <SectionHeading
            title={content.instruments.title}
            subtitle={content.instruments.subtitle}
          />

          <EntryGrid items={content.instruments.items} />
        </Container>
      </Section>

      <Section className={styles.orientationSection}>
        <Container>
          <SectionHeading
            title={content.selections.title}
            subtitle={content.selections.subtitle}
          />

          <SelectionGrid items={content.selections.items} />
        </Container>
      </Section>

      <Section className={styles.guidesSection}>
        <Container>
          <SectionHeading
            title={content.guides.title}
            subtitle={content.guides.subtitle}
          />

          <GuideList items={content.guides.items} />
        </Container>
      </Section>
    </>
  );
}
