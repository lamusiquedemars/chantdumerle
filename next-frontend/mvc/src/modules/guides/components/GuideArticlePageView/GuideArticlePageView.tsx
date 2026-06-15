import Hero from "@/components/blocks/Hero/Hero";
import TextBlock from "@/components/blocks/TextBlock/TextBlock";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import GuideArticleBlocks from "@/modules/guides/components/GuideContent/GuideArticleBlocks";
import GuideContent from "@/modules/guides/components/GuideContent/GuideContent";
import type { GuideArticlePageContent } from "@/modules/guides/types";
import styles from "./GuideArticlePageView.module.css";

type GuideArticlePageViewProps = {
  content: GuideArticlePageContent;
  locale: string;
};

// Vue d'article guide, reusable pour une page detail editoriale.
export default function GuideArticlePageView({
  content,
  locale,
}: GuideArticlePageViewProps) {
  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        variant="page"
      />

      <Section className={styles.breadcrumbSection}>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Accueil", href: localizedHref(locale) },
              { label: "Guides", href: localizedHref(locale, "/guides") },
              { label: content.hero.title },
            ]}
          />
        </Container>
      </Section>

      <Section className={styles.articleSection}>
        <Container>
          <GuideContent>
            {content.article.kind === "html" ? (
              <div dangerouslySetInnerHTML={{ __html: content.article.html }} />
            ) : (
              <GuideArticleBlocks blocks={content.article.blocks} />
            )}
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
