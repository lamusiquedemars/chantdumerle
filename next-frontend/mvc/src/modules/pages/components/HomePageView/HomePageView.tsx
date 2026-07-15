import Hero from "@/components/blocks/Hero/Hero";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";
import EntryGrid from "@/components/blocks/EntryGrid/EntryGrid";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
import ProductCarousel from "@/modules/catalog/components/ProductCarousel/ProductCarousel";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import SelectionGrid from "@/modules/selections/components/SelectionGrid/SelectionGrid";
import type { HomeContent } from "@/content/home";
import styles from "./HomePageView.module.css";

type HomePageViewProps = {
  content: HomeContent;
  featuredProducts: ProductCardItem[];
};

// Vue home composee a partir du contenu client et des produits dynamiques.
export default function HomePageView({
  content,
  featuredProducts,
}: HomePageViewProps) {
  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImage={content.hero.backgroundImage}
        actions={content.hero.actions}
        variant="home"
      />

      <Section background="beige">
        <Container>
          <SectionHeading title={content.entrySections.instruments.title} />
          <EntryGrid items={content.entrySections.instruments.items} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title={content.entrySections.sounds.title} />
          <EntryGrid items={content.entrySections.sounds.items} />
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <SectionHeading title={content.entrySections.levels.title} />
          <EntryGrid items={content.entrySections.levels.items} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title={content.selections.title}
            subtitle={content.selections.subtitle}
            action={
              <LinkButton href={content.selections.action.href}>
                {content.selections.action.label}
              </LinkButton>
            }
          />
          <SelectionGrid items={content.selections.items} />
        </Container>
      </Section>

      <Section backgroundImage={content.featuredProducts.backgroundImage}>
        <Container>
          <SectionHeading
            title={content.featuredProducts.title}
            subtitle={content.featuredProducts.subtitle}
            tone="light"
          />
          <ProductCarousel items={featuredProducts} />
        </Container>
      </Section>

      {content.guides.items.length > 0 ? (
        <Section>
          <Container>
            <SectionHeading
              title={content.guides.title}
              subtitle={content.guides.subtitle}
              action={
                <LinkButton href={content.guides.action.href}>
                  {content.guides.action.label}
                </LinkButton>
              }
            />
            <GuideList items={content.guides.items} />
          </Container>
        </Section>
      ) : null}

      <Section backgroundImage={content.workshop.backgroundImage}>
        <Container>
          <TextBlock {...content.workshop.content} />
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <div className={styles.closingManifesto}>
            <hr className={styles.manifestoDivider} />
            <div className={styles.manifestoContent}>
              <h2>{content.closing.title}</h2>
              <div className={styles.manifestoText}>
                {content.closing.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="soft">
        <Container>
          <div className={styles.shippingBlock}>
            <div className={styles.shippingIntro}>
              <h2>{content.shipping.title}</h2>
              <p>{content.shipping.intro}</p>
              <p>{content.shipping.details}</p>
            </div>

            <div className={styles.shippingTableWrap}>
              <table className={styles.shippingTable}>
                <thead>
                  <tr>
                    <th scope="col">Destination</th>
                    <th scope="col">Délais estimés</th>
                    <th scope="col">Petit colis</th>
                    <th scope="col">Gros colis</th>
                    <th scope="col">Franco</th>
                  </tr>
                </thead>
                <tbody>
                  {content.shipping.rates.map((rate) => (
                    <tr key={rate.destination}>
                      <th scope="row">{rate.destination}</th>
                      <td>{rate.estimatedDelay}</td>
                      <td>{rate.smallParcel}</td>
                      <td>{rate.largeParcel}</td>
                      <td>{rate.freeFrom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.shippingFooter}>
              <p>{content.shipping.note}</p>
              <LinkButton href={content.shipping.action.href} variant="secondary">
                {content.shipping.action.label}
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
