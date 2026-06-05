import Hero from "@/components/blocks/Hero/Hero";
import EntryGrid from "@/components/blocks/EntryGrid/EntryGrid";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import ProductGrid from "@/modules/catalog/components/ProductGrid/ProductGrid";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { StringsContent } from "@/modules/catalog/types";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import SelectionGrid from "@/modules/selections/components/SelectionGrid/SelectionGrid";

type StringsPageViewProps = {
  content: StringsContent;
  featuredProducts: ProductCardItem[];
};

// Vue de l'univers cordes, gardee dans le module catalogue.
export default function StringsPageView({
  content,
  featuredProducts,
}: StringsPageViewProps) {
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
            title={content.products.title}
            subtitle={content.products.subtitle}
          />

          <ProductGrid items={featuredProducts} />
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
