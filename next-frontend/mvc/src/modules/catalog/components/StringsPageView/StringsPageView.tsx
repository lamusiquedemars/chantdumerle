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
import type { StringsContent } from "@/modules/catalog/types";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import SelectionGrid from "@/modules/selections/components/SelectionGrid/SelectionGrid";

type StringsPageViewProps = {
  content: StringsContent;
  products: ProductCardItem[];
  filters?: ProductFilterGroup[];
  activeFilters?: Record<string, string>;
  activeInstrumentLabel?: string;
  activeSoundLabel?: string;
};

// Vue de l'univers cordes, gardee dans le module catalogue.
export default function StringsPageView({
  content,
  products,
  filters = [],
  activeFilters = {},
  activeInstrumentLabel,
  activeSoundLabel,
}: StringsPageViewProps) {
  const activeTitle = activeSoundLabel
    ? [
        `Cordes au son ${activeSoundLabel.toLowerCase()}`,
        activeInstrumentLabel
          ? `pour ${activeInstrumentLabel.toLowerCase()}`
          : null,
      ]
        .filter((part): part is string => Boolean(part))
        .join(" ")
    : activeInstrumentLabel
      ? `Cordes pour ${activeInstrumentLabel.toLowerCase()}`
      : "";
  const productsTitle = activeTitle || content.products.title;

  const productsSubtitle = activeSoundLabel
    ? "Une sélection issue du référentiel modèle, croisée avec les produits Woo réellement disponibles."
    : activeInstrumentLabel
    ? `La sélection adaptée aux cordes ${activeInstrumentLabel.toLowerCase()}, avec les mêmes repères de choix et de comparaison.`
    : content.products.subtitle;

  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        actions={content.hero.actions}
      />

      <Section>
        <Container>
          <SectionHeading
            title={productsTitle}
            subtitle={productsSubtitle}
          />

          {filters.length > 0 ? (
            <ProductFilters filters={filters} values={activeFilters} />
          ) : null}

          {products.length > 0 ? (
            <ProductGrid items={products} />
          ) : (
            <p>Aucune corde ne correspond encore à ce filtre.</p>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title={content.instruments.title}
            subtitle={content.instruments.subtitle}
          />

          <EntryGrid items={content.instruments.items} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title={content.selections.title}
            subtitle={content.selections.subtitle}
          />

          <SelectionGrid items={content.selections.items} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title={content.editorial.title} />

          <p>{content.editorial.text}</p>
        </Container>
      </Section>

      <Section>
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
