import { getFeaturedStringProducts, getProducts } from "@/lib/wordpress/products";
import Hero from "@/components/blocks/Hero/Hero";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";
import EntryGrid from "@/components/blocks/EntryGrid/EntryGrid";
import CardGrid from "@/components/blocks/CardGrid/CardGrid";

import Section from "@/components/layout/Section/Section";
import Container from "@/components/layout/Container/Container";

import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import LinkButton from "@/components/ui/LinkButton/LinkButton";

import SelectionGrid from "@/components/selection/SelectionGrid/SelectionGrid";
import GuideList from "@/components/guide/GuideList/GuideList";
import ProductGrid from "@/components/product/ProductGrid/ProductGrid";
import ProductCarousel from "@/components/product/ProductCarousel/ProductCarousel"; 

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const instrumentEntries = [
    {
      label: "Violon",
      href: "/fr/cordes/violon",
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-violin.png",
    },
    {
      label: "Alto",
      href: "/fr/cordes/alto",
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-viola.png",
    },
    {
      label: "Violoncelle",
      href: "/fr/cordes/violoncelle",
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-cello.png",
    },
    {
      label: "Contrebasse",
      href: "/fr/cordes/contrebasse",
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-db.png",
    },
  ];

  const soundEntries = [
    {
      label: "Chaud",
      href: "/fr/cordes?son=chaud",
      description: "Son rond, dense et chaleureux avec des graves riches",
      backgroundImage: "https://vallestrade.com/900196-thickbox_default/Cuerda-violin-Pirastro-Obligato-313121-1-Mi-Bola-Medium.jpg",
    },
    {
      label: "Équilibré",
      href: "/fr/cordes?son=equilibre",
      description: "Équilibre harmonieux entre clarté, rondeur et puissance",
      backgroundImage: "https://vallestrade.com/902620-thickbox_default/Set-de-cuerdas-cello-Thomastik-Dominant-147-Medium.jpg",
    },
    {
      label: "Brillant",
      href: "/fr/cordes?son=brillant",
      description: "Son clair et projectif avec une attaque vive et des aigus éclatants",
      backgroundImage: "https://vallestrade.com/1043305-thickbox_default/Set-de-cuerdas-violin-Pirastro-Evah-Pirazzi-419025-44-1-lazo-Medium.jpg",
    },
  ];

  const levelEntries = [
    {
      label: "Étudiant",
      href: "/fr/selections/etudiant",
      description: "Stabilité d’accord remarquable, homogénéité parfaite et fiabilité quotidienne",
      backgroundImage: "https://vallestrade.com/899815-thickbox_default/Cuerda-viola-Pirastro-Tonica-1-La.jpg",
    },
    {
      label: "Orchestre",
      href: "/fr/selections/orchestre",
      description: "Grande précision de timbre, finesse dans les nuances et contrôle dynamique supérieur",
      backgroundImage: "https://vallestrade.com/900406-thickbox_default/cuerda-violin-thomastik-vision-vi01-1-mi-bola-removible-medium.jpg",
    },
    {
      label: "Avancé / Soliste",
      href: "/fr/selections/soliste",
      description: "Réponse instantanée, projection généreuse et caractère timbrique affirmé",
      backgroundImage: "https://vallestrade.com/915835-thickbox_default/Cuerda-violin-Larsen-Il-Canone-Soloist-4-Sol-Medium.jpg",
    },
  ];

  const featuredSelections = [
    {
      title: "Pack essentiel cordes",
      href: "/fr/selections/pack-essentiel-cordes",
      description: "Un jeu de cordes sélectionné + colophane assortie pour un son équilibré et une grande fiabilité",
      instrument: "Violon",
    },
    {
      title: "Pack essentiel archet",
      href: "/fr/selections/pack-essentiel-archet",
      description: "Un archet + colophane pour un équilibre confort et précision de jeu, idéal pour les étudiants et les amateurs",
      instrument: "Alto",
    },
    {
      title: "Pack performance archet",
      href: "/fr/selections/pack-performance-archet",
      description: "Archet + cordes + colophane pour une expression renforcée et une grande richesse de timbre, parfait pour les musiciens avancés",
      instrument: "Violoncelle",
    },
  ];

  /*featured products*/
  const featuredProducts = await getFeaturedStringProducts(locale, 4);

  const guideItems = [
    {
      title: "Comment choisir ses cordes",
      href: "/fr/guides/comment-choisir-ses-cordes",
      excerpt: "Les vrais critères utiles pour décider sans se perdre.",
      category: "Choix",
    },
    {
      title: "Chaud, brillant, équilibré : que veulent dire ces mots ?",
      href: "/fr/guides/chaud-brillant-equilibre",
      excerpt: "Mettre des mots simples sur des sensations réelles.",
      category: "Son",
    },
    {
      title: "Quand faut-il changer ses cordes ?",
      href: "/fr/guides/quand-changer-ses-cordes",
      excerpt: "Les signes concrets d’usure et de perte de réponse.",
      category: "Entretien",
    },
  ];

  const accessoryEntries = [
    {
      label: "Colophanes",
      href: "/fr/accessoires/colophanes",
      description: "Pour adapter l’attaque et l’adhérence",
    },
    {
      label: "Épaulières",
      href: "/fr/accessoires/epaulieres",
      description: "Confort, stabilité, posture",
    },
    {
      label: "Entretien",
      href: "/fr/accessoires/entretien",
      description: "Nettoyer, protéger, durer",
    },
    {
      label: "Étuis et protection",
      href: "/fr/accessoires/etuis-protection",
      description: "Transport et sécurité",
    },
  ];

  return (
    <>
      <Hero
        title="Les cordes, c'est notre spécialité."
        subtitle="Cordes et accessoires pour instruments du quatuor, sélectionnés avec soin."
        backgroundImage="images/brand/hero-home-drawer.png"
        variant="home"
        actions={[
          { label: "Choisir mes cordes", href: "/fr/cordes" },
          { label: "Explorer les sélections", href: "/fr/selections" },
        ]}
      />

      <Section>
        <Container>
          <TextBlock
            title="Une sélection réfléchie, bien plus qu'un catalogue."
            text="Nous vous guidons vers les cordes les plus adaptées à votre niveau, 
            à votre instrument et au son que vous recherchez."
          />
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <SectionHeading title="Entrer par instrument" />
          <EntryGrid items={instrumentEntries} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Je recherche un son :" />
          <EntryGrid items={soundEntries} />
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <SectionHeading title="Entrer par niveau" />
          <EntryGrid items={levelEntries} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Sélections prêtes à jouer"
            subtitle="Des ensembles pensés pour simplifier le choix et faciliter la prise de décision."
            action={<LinkButton href="/fr/selections">Voir les sélections</LinkButton>}
          />
          <SelectionGrid items={featuredSelections} />
        </Container>
      </Section>

      <Section backgroundImage="/images/violin-head.jpg">
        <Container>
          <SectionHeading
            title="Quelques références"
            subtitle="Des cordes de premier choix. Marques reconnues, sélection exigeante."
            tone="light"
            action={<LinkButton href="/fr/cordes">Voir les cordes</LinkButton>}
          />
          <ProductGrid items={featuredProducts} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Guides"
            subtitle="Pour comprendre, comparer, et choisir plus vite."
            action={<LinkButton href="/fr/guides">Voir les guides</LinkButton>}
          />
          <GuideList items={guideItems} />
        </Container>
      </Section>

      <Section background="accent">
        <Container>
          <SectionHeading
            title="Accessoires"
            subtitle="L’essentiel pour compléter, entretenir et protéger."
            action={<LinkButton href="/fr/accessoires">Voir les accessoires</LinkButton>}
          />
          <CardGrid items={accessoryEntries} />
        </Container>
      </Section>

      <Section>
        <Container>
          <TextBlock
            title="Choisir avec plus de justesse"
            text="Notre objectif ici n’est pas de montrer tout l'univers des cordes et accessoires du quatuor, 
            mais d’aider chaque musicien à trouver ce qu'il recherche, avec notre soin et notre passion."
          />
        </Container>
      </Section>

      <Section backgroundImage="/images/bow-ivo-incidit.jpg">
        <Container>
          <TextBlock
            title="Atelier Ivo Incidit"
            text="Des archets à part, pour les musiciens qui cherchent une autre relation à la matière, au timbre et à la sensation de jeu."
            tone="light"
            actions={[
              {
                label: "Découvrir l’atelier",
                href: "https://atelierivoincidit.fr",
              },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}