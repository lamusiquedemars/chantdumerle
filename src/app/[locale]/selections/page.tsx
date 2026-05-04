import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";

type SelectionsPageProps = {
  params: {
    locale: string;
  };
};

export default function SelectionsPage({ params }: SelectionsPageProps) {
  return (
    <Section>
      <Container>
        <SectionHeading title="Nos Sélections Prêtes à Jouer" />

        <p>
          Nous avons créé ces sélections pour vous simplifier le choix et vous faire
          gagner un temps précieux.
        </p>

        <p>
          Au cœur de chaque pack se trouvent des cordes sélectionnées avec soin.
          Nous testons et combinons des cordes issues de sets différents pour
          proposer des associations cohérentes et équilibrées en termes de timbre,
          de réponse et de projection — un travail que nous réalisons en amont pour
          vous éviter d’avoir à les choisir et les acheter une par une.
        </p>

        <p>
          Ces packs intègrent également les accessoires les plus pertinents
          (colophane, repose-épaule, accordeur, etc.) ainsi que, pour certains, un
          archet adapté. L’objectif est de vous offrir des ensembles harmonieux et
          immédiatement prêts à l’emploi, adaptés à chaque niveau.
        </p>
      </Container>
    </Section>
  );
}
