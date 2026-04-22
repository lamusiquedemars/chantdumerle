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

export default function HomePage() {
  const instrumentEntries = [
    {
      label: "Violon",
      href: "/fr/cordes/violon",
      description: "Cordes et repères pour violon",
    },
    {
      label: "Alto",
      href: "/fr/cordes/alto",
      description: "Cordes et repères pour alto",
    },
    {
      label: "Violoncelle",
      href: "/fr/cordes/violoncelle",
      description: "Cordes et repères pour violoncelle",
    },
    {
      label: "Contrebasse",
      href: "/fr/cordes/contrebasse",
      description: "Cordes et repères pour contrebasse",
    },
  ];

  const soundEntries = [
    {
      label: "Chaud",
      href: "/fr/cordes?son=chaud",
      description: "Plus de rondeur et de densité",
    },
    {
      label: "Équilibré",
      href: "/fr/cordes?son=equilibre",
      description: "Un bon centre, sans excès",
    },
    {
      label: "Brillant",
      href: "/fr/cordes?son=brillant",
      description: "Plus d’éclat et de projection",
    },
  ];

  const levelEntries = [
    {
      label: "Étudiant",
      href: "/fr/selections/etudiant",
      description: "Fiable, simple, cohérent",
    },
    {
      label: "Conservatoire",
      href: "/fr/selections/conservatoire",
      description: "Plus de précision et de nuance",
    },
    {
      label: "Avancé / Soliste",
      href: "/fr/selections/soliste",
      description: "Réponse, projection, caractère",
    },
  ];

  const featuredSelections = [
    {
      title: "Pack étudiant violon",
      href: "/fr/selections/pack-etudiant-violon",
      description: "Une base claire, stable et rassurante",
      instrument: "Violon",
    },
    {
      title: "Pack conservatoire alto",
      href: "/fr/selections/pack-conservatoire-alto",
      description: "Un équilibre entre confort et précision",
      instrument: "Alto",
    },
    {
      title: "Pack soliste violoncelle",
      href: "/fr/selections/pack-soliste-violoncelle",
      description: "Une sélection plus exigeante et plus ample",
      instrument: "Violoncelle",
    },
  ];

  const featuredProducts = [
    {
      title: "Pirastro Obligato",
      href: "/fr/produit/pirastro-obligato",
      description: "Son chaud, souple, ample",
      brand: "Pirastro",
      price: "À partir de 89 €",
    },
    {
      title: "Thomastik Dominant",
      href: "/fr/produit/thomastik-dominant",
      description: "Référence équilibrée, polyvalente",
      brand: "Thomastik",
      price: "À partir de 72 €",
    },
    {
      title: "Larsen Soloist",
      href: "/fr/produit/larsen-soloist",
      description: "Projection et présence",
      brand: "Larsen",
      price: "À partir de 96 €",
    },
  ];

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
        title="Trouver les bonnes cordes ne devrait pas être un doute."
        subtitle="Cordes et accessoires pour instruments du quatuor, avec une logique de sélection guidée."
        actions={[
          { label: "Choisir mes cordes", href: "/fr/cordes" },
          { label: "Explorer les sélections", href: "/fr/selections" },
        ]}
      />

      <Section>
        <Container>
          <TextBlock
            title="Une sélection, pas un catalogue"
            text="Le Chant du Merle aide à choisir plus clairement, avec moins de bruit, moins d’hésitation, et une lecture musicale des produits."
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Entrer par instrument" />
          <EntryGrid items={instrumentEntries} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Entrer par son" />
          <EntryGrid items={soundEntries} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Entrer par niveau" />
          <EntryGrid items={levelEntries} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Sélections prêtes à jouer"
            subtitle="Des parcours plus simples pour réduire le doute."
            action={<LinkButton href="/fr/selections">Voir les sélections</LinkButton>}
          />
          <SelectionGrid items={featuredSelections} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Quelques références"
            subtitle="Une mise en avant courte, au service du choix."
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

      <Section>
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
            text="Ici, l’objectif n’est pas de montrer tout ce qui existe, mais d’aider chaque musicien à aller vers une solution lisible, cohérente et musicale."
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <TextBlock
            title="Archets Ivo Incidit"
            text="Un atelier à part, pour les musiciens qui cherchent une autre relation au geste, au timbre et à la réponse."
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