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
        variant="page"
      />

      <Section className={styles.breadcrumbSection}>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Accueil", href: localizedHref(locale) },
              { label: "Guides" },
            ]}
          />
        </Container>
      </Section>

      <Section className={styles.listSection}>
        <Container>
          <SectionHeading
            title={content.list.title}
            subtitle={content.list.subtitle}
          />
          {content.list.items.length > 0 ? (
            <GuideList items={content.list.items} />
          ) : (
            <p>{content.list.emptyText}</p>
          )}
        </Container>
      </Section>
    </>
  );
}
