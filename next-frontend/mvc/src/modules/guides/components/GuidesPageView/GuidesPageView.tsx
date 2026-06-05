import Hero from "@/components/blocks/Hero/Hero";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";
import CardGrid from "@/components/blocks/CardGrid/CardGrid";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
import type { GuidesPageContent } from "@/modules/guides/types";
import GuideList from "@/modules/guides/components/GuideList/GuideList";

type GuidesPageViewProps = {
  content: GuidesPageContent;
};

// Vue de la liste des guides, isolee de la route Next.js.
export default function GuidesPageView({ content }: GuidesPageViewProps) {
  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        variant="page"
      />

      <Section>
        <Container>
          <TextBlock {...content.intro} />
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <SectionHeading
            title={content.entries.title}
            subtitle={content.entries.subtitle}
          />
          <CardGrid items={content.entries.items} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            title={content.list.title}
            subtitle={content.list.subtitle}
            action={
              <LinkButton href={content.list.action.href}>
                {content.list.action.label}
              </LinkButton>
            }
          />
          <GuideList items={content.list.items} />
        </Container>
      </Section>

      <Section background="accent">
        <Container>
          <TextBlock {...content.cta} />
        </Container>
      </Section>
    </>
  );
}
