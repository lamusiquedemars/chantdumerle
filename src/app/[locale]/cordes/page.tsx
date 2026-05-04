import Hero from "@/components/blocks/Hero/Hero";
import EntryGrid, {
  type EntryGridItem,
} from "@/components/blocks/EntryGrid/EntryGrid";
import GuideList from "@/components/guide/GuideList/GuideList";
import type { GuideCardItem } from "@/components/guide/GuideCard/GuideCard";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import ProductGrid from "@/components/product/ProductGrid/ProductGrid";
import SelectionGrid from "@/components/selection/SelectionGrid/SelectionGrid";
import type { SelectionCardItem } from "@/components/selection/SelectionCard/SelectionCard";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { getFeaturedStringProducts } from "@/lib/wordpress/products";

type CordesPageProps = {
  params: {
    locale: string;
  };
};

export default async function CordesPage({ params }: CordesPageProps) {
  const { locale } = params;

  /*
   * Petite fonction locale pour construire les liens avec la langue active.
   * Exemple : href("/cordes/violon") devient "/fr/cordes/violon".
   */
  const href = (path: string) => `/${locale}${path}`;

  /*
   * Produits WooCommerce mis en avant pour la page Cordes.
   * La règle métier reste dans products.ts :
   * produits de la catégorie "cordes" + marqués "mis en avant" dans Woo.
   */
  const featuredProducts = await getFeaturedStringProducts(locale);
  /*
   * Entrées principales par instrument.
   * Ces cartes orientent vers les pages catalogue filtrées.
   */
  const instrumentItems: EntryGridItem[] = [
    {
      label: "Violon",
      href: href("/cordes/violon"),
      description:
        "Jeux complets et cordes seules pour violon, selon le son, le confort et le niveau de jeu.",
    },
    {
      label: "Alto",
      href: href("/cordes/alto"),
      description:
        "Cordes pour alto, avec une attention portée à la réponse, à la chaleur et à l’équilibre.",
    },
    {
      label: "Violoncelle",
      href: href("/cordes/cello"),
      description:
        "Cordes de violoncelle pour travailler la projection, la profondeur et la stabilité du jeu.",
    },
    {
      label: "Contrebasse",
      href: href("/cordes/contrebasse"),
      description:
        "Cordes de contrebasse pour l’étude, l’orchestre ou une recherche sonore spécifique.",
    },
  ];

  /*
   * Entrées par besoin musical.
   * Ces liens pourront mener vers des pages /selections pilotées depuis WordPress.
   */
  const selectionItems: SelectionCardItem[] = [
    {
      title: "Son chaud",
      href: href("/selections/son-chaud"),
      description:
        "Pour arrondir le timbre, adoucir l’instrument ou chercher plus de souplesse sonore.",
    },
    {
      title: "Projection",
      href: href("/selections/projection"),
      description:
        "Pour gagner en présence, en clarté et en portée sonore.",
    },
    {
      title: "Confort de jeu",
      href: href("/selections/confort-de-jeu"),
      description:
        "Pour trouver des cordes faciles à mettre en vibration et agréables sous les doigts.",
    },
    {
      title: "Débutant / école",
      href: href("/selections/debutant-ecole"),
      description:
        "Pour choisir des cordes fiables, stables et raisonnables sans se perdre dans le catalogue.",
    },
  ];

  /*
   * Guides courts liés au choix des cordes.
   * La page Cordes reste commerciale : les guides viennent en appui, pas en contenu principal.
   */
  const guideItems: GuideCardItem[] = [
    {
      title: "Quand changer ses cordes ?",
      href: href("/guides/quand-changer-ses-cordes"),
      excerpt:
        "Reconnaître les signes d’usure, de perte de réponse ou de timbre fatigué.",
    },
    {
      title: "Choisir une tension de corde",
      href: href("/guides/choisir-tension-corde"),
      excerpt:
        "Comprendre l’effet de la tension sur le confort, la projection et la couleur sonore.",
    },
    {
      title: "Peut-on mélanger plusieurs marques ?",
      href: href("/guides/melanger-marques-cordes"),
      excerpt:
        "Composer un jeu cohérent sans déséquilibrer l’instrument.",
    },
  ];

  return (
    <>
      <Hero
        title="Cordes pour violon, alto, violoncelle et contrebasse"
        subtitle="Une sélection claire de cordes pour trouver rapidement un jeu adapté à votre instrument, votre niveau et votre recherche sonore."
        actions={[
          {
            label: "Violon",
            href: href("/cordes/violon"),
          },
          {
            label: "Alto",
            href: href("/cordes/alto"),
          },
          {
            label: "Violoncelle",
            href: href("/cordes/cello"),
          },
          {
            label: "Contrebasse",
            href: href("/cordes/contrebasse"),
          },
        ]}
      />

      <Section>
        <Container>
          <SectionHeading
            title="Notre sélection de cordes"
            subtitle="Quelques jeux et cordes choisis pour leur fiabilité, leur intérêt musical et leur utilité réelle dans le choix d’un musicien."
          />

          <ProductGrid items={featuredProducts} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Choisir par instrument"
            subtitle="Accédez directement aux cordes adaptées à votre instrument."
          />

          <EntryGrid items={instrumentItems} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Choisir selon votre besoin"
            subtitle="Si vous ne cherchez pas une marque précise, partez plutôt de ce que vous voulez améliorer."
          />

          <SelectionGrid items={selectionItems} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Une sélection courte, pensée pour le choix" />

          <p>
            Le Chant du Merle ne cherche pas à afficher le plus grand nombre de
            références possible. L’objectif est de proposer des cordes
            compréhensibles, comparables et réellement utiles selon
            l’instrument, le niveau de jeu et la recherche sonore.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Guides utiles"
            subtitle="Quelques repères simples pour mieux comprendre vos cordes avant de choisir."
          />

          <GuideList items={guideItems} />
        </Container>
      </Section>
    </>
  );
}