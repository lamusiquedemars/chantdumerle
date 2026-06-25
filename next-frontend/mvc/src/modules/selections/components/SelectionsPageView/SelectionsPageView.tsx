import Link from "next/link";
import Hero from "@/components/blocks/Hero/Hero";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import GuideList from "@/modules/guides/components/GuideList/GuideList";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import SelectionGrid from "@/modules/selections/components/SelectionGrid/SelectionGrid";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import { getPackSelectionItems } from "@/content/navigationCards";
import {
  selectionsPageContent,
  type SelectionPageGroup,
  type SelectionPageItem,
} from "@/content/selections";
import styles from "./SelectionsPageView.module.css";

type SelectionsPageViewProps = {
  locale: string;
  guideItems?: GuideCardItem[];
};

export default function SelectionsPageView({
  locale,
  guideItems = [],
}: SelectionsPageViewProps) {
  const packs = getPackSelectionItems(locale);
  const stringGroups = localizeGroups(
    selectionsPageContent.strings.groups ?? [],
    locale
  );

  return (
    <>
      <Hero
        title={selectionsPageContent.title}
        subtitle={selectionsPageContent.hero.subtitle}
        backgroundImage={selectionsPageContent.hero.backgroundImage}
        backgroundPosition="center 80%"
        height="compact"
        actions={[]}
      />

      <Section padding="breadcrumbFlush" className={styles.breadcrumbSection}>
        <Container>
          <Breadcrumbs
            items={[
              {
                label: selectionsPageContent.breadcrumbs.homeLabel,
                href: localizedHref(locale),
              },
              { label: selectionsPageContent.breadcrumbs.currentLabel },
            ]}
          />
        </Container>
      </Section>

      <Section padding="intro" className={styles.introSection}>
        <Container>
          <div className={styles.introText}>
            {selectionsPageContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        id={selectionsPageContent.packs.id}
        background="beige"
        padding="split"
        className={styles.packsSection}
      >
        <Container>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>
              {selectionsPageContent.packs.eyebrow}
            </p>
            <h2>{selectionsPageContent.packs.title}</h2>
            <p>{selectionsPageContent.packs.intro}</p>
          </div>

          <SelectionGrid items={packs} />
        </Container>
      </Section>

      <Section padding="split" className={styles.stringsSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>
              {selectionsPageContent.strings.eyebrow}
            </p>
            <h2>{selectionsPageContent.strings.title}</h2>
            <p>{selectionsPageContent.strings.intro}</p>
          </div>

          <div className={styles.selectionGroups}>
            {stringGroups.map((group) => (
              <SelectionGroupCard key={group.title} group={group} />
            ))}
          </div>
        </Container>
      </Section>

      {guideItems.length > 0 ? (
        <Section padding="split" background="soft">
          <Container>
            <SectionHeading
              title={selectionsPageContent.guides.title}
              subtitle={selectionsPageContent.guides.subtitle}
            />

            <GuideList items={guideItems} />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

function SelectionGroupCard({ group }: { group: SelectionPageGroup }) {
  return (
    <section className={styles.selectionGroup}>
      <div className={styles.selectionGroupHeader}>
        <h3>{group.title}</h3>
        <p>{group.intro}</p>
      </div>

      <div className={styles.selectionList}>
        {group.items.map((item) => (
          <SelectionLink key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

function SelectionLink({ item }: { item: SelectionPageItem }) {
  const content = (
    <>
      <strong>{item.title}</strong>
      <span>{item.description}</span>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={styles.selectionItem}>
        {content}
      </Link>
    );
  }

  return <div className={styles.selectionItem}>{content}</div>;
}

function localizeItems(
  items: SelectionPageItem[],
  locale: string
): SelectionPageItem[] {
  return items.map((item) => ({
    ...item,
    href: item.href ? localizedHref(locale, item.href) : undefined,
  }));
}

function localizeGroups(
  groups: SelectionPageGroup[],
  locale: string
): SelectionPageGroup[] {
  return groups.map((group) => ({
    ...group,
    items: localizeItems(group.items, locale),
  }));
}
