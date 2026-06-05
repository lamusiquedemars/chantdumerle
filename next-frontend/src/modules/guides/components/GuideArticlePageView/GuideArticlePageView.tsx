import Hero from "@/components/blocks/Hero/Hero";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import GuideArticleBlocks from "@/modules/guides/components/GuideContent/GuideArticleBlocks";
import GuideContent from "@/modules/guides/components/GuideContent/GuideContent";
import type { ChooseStringsGuideContent } from "@/modules/guides/types";

type GuideArticlePageViewProps = {
  content: ChooseStringsGuideContent;
};

// Vue d'article guide, reusable pour une page detail editoriale.
export default function GuideArticlePageView({
  content,
}: GuideArticlePageViewProps) {
  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        variant="page"
      />

      <Section>
        <Container>
          <GuideContent>
            <GuideArticleBlocks blocks={content.article} />
          </GuideContent>
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <TextBlock {...content.cta} />
        </Container>
      </Section>
    </>
  );
}
