import Hero from "@/components/blocks/Hero/Hero";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";
import CardGrid from "@/components/blocks/CardGrid/CardGrid";

import Section from "@/components/layout/Section/Section";
import Container from "@/components/layout/Container/Container";

import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import LinkButton from "@/components/ui/LinkButton/LinkButton";

import GuideList from "@/components/guide/GuideList/GuideList";

import { guideItems } from "@/data/guides";

export default function GuidesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  const entryItems = [
    {
      label: "Choisir ses cordes",
      href: `/${locale}/guides/comment-choisir-ses-cordes`,
      description: "Comprendre les grands critères avant de comparer les modèles.",
    },
    {
      label: "Comprendre le son",
      href: `/${locale}/guides/chaud-brillant-equilibre`,
      description: "Mettre des mots simples sur les sensations sonores.",
    },
    {
      label: "Entretenir ses cordes",
      href: `/${locale}/guides/quand-changer-ses-cordes`,
      description: "Savoir reconnaître l’usure et la perte de réponse.",
    },
  ];

  return (
    <>
      <Hero
        title="Guides"
        subtitle="Des repères simples pour choisir vos cordes et accessoires avec plus de justesse."
        variant="page"
      />

      <Section>
        <Container>
          <TextBlock
            title="Choisir sans se perdre"
            text="Le choix des cordes dépend de votre instrument, de votre niveau, de votre usage et du son que vous recherchez. Ces guides vous aident à avancer étape par étape, sans jargon inutile."
          />
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <SectionHeading
            title="Commencer par le bon sujet"
            subtitle="Trois entrées simples pour comprendre ce qui influence réellement votre choix."
          />
          <CardGrid items={entryItems} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title="Tous les guides"
            subtitle="Des contenus courts, concrets, pensés pour aider à décider."
            action={
              <LinkButton href={`/${locale}/cordes`}>
                Voir les cordes
              </LinkButton>
            }
          />
          <GuideList items={guideItems} />
        </Container>
      </Section>

      <Section background="accent">
        <Container>
          <TextBlock
            title="Besoin d’un choix plus direct ?"
            text="Vous pouvez aussi partir directement des sélections par instrument, par son recherché ou par niveau de jeu."
            actions={[
              {
                label: "Voir les sélections",
                href: `/${locale}/selections`,
              },
              {
                label: "Voir les cordes violon",
                href: `/${locale}/cordes/violon`,
              },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}