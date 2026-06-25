import Hero from "@/components/blocks/Hero/Hero";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import type { GuidesPageContent } from "@/modules/guides/types";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import styles from "./GuidesPageView.module.css";

type GuidesPageViewProps = {
  content: GuidesPageContent;
  locale: string;
};

// Vue de la liste des guides, isolee de la route Next.js.
export default function GuidesPageView({
  content,
  locale,
}: GuidesPageViewProps) {
  return (
    <>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImage="/images/hero-guides.png"
        backgroundPosition="center 70%"
        height="compact"
        actions={[]}
      />

      <Section padding="breadcrumb" className={styles.breadcrumbSection}>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Accueil", href: localizedHref(locale) },
              { label: "Guides" },
            ]}
          />
        </Container>
      </Section>

      <Section padding="results" className={styles.listSection}>
        <Container>
          <SectionHeading
            title={content.list.title}
            subtitle={content.list.subtitle}
          />
          {content.list.items.length > 0 ? (
            <GuideList items={content.list.items} />
          ) : (
            <p className={styles.emptyState}>{content.list.emptyText}</p>
          )}
        </Container>
      </Section>
    </>
  );
}
