import Link from "next/link";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import ProductGrid from "@/modules/catalog/components/ProductGrid/ProductGrid";
import type { SelectionDetailPageData } from "@/modules/selections/services/selectionRecommendations";
import { selectionsPageContent } from "@/content/selections";
import styles from "./SelectionDetailPageView.module.css";

type SelectionDetailPageViewProps = {
  data: SelectionDetailPageData;
  locale: string;
};

export default function SelectionDetailPageView({
  data,
  locale,
}: SelectionDetailPageViewProps) {
  const activeInstrument = data.instruments.find(
    (instrument) => instrument.active
  );
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: selectionsPageContent.breadcrumbs.homeLabel,
      href: localizedHref(locale),
    },
    {
      label: selectionsPageContent.breadcrumbs.currentLabel,
      href: localizedHref(locale, "/selections"),
    },
  ];

  if (activeInstrument) {
    breadcrumbItems.push({
      label: data.content.title,
      href: data.allInstrumentsHref,
    });
    breadcrumbItems.push({ label: activeInstrument.label });
  } else {
    breadcrumbItems.push({ label: data.content.title });
  }

  return (
    <>
      <Section className={styles.heroSection}>
        <Container>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>{data.content.eyebrow}</p>
            <h1>{data.content.title}</h1>
          </div>
        </Container>
      </Section>

      <Section padding="tight" className={styles.introSection}>
        <Container>
          <Breadcrumbs
            items={breadcrumbItems}
            className={styles.breadcrumbs}
          />

          <div className={styles.introText}>
            <p>{data.content.intro}</p>
          </div>

          <div className={styles.instrumentBlock}>
            <div className={styles.instrumentHeader}>
              <h2>{selectionsPageContent.detail.instrumentFilterTitle}</h2>
            </div>

            <div className={styles.instrumentCards}>
              <Link
                href={data.allInstrumentsHref}
                className={
                  data.activeInstrument
                    ? styles.instrumentCard
                    : `${styles.instrumentCard} ${styles.active}`
                }
              >
                {selectionsPageContent.detail.allInstrumentsLabel}
              </Link>
              {data.instruments.map((instrument) => (
                <Link
                  key={instrument.value}
                  href={instrument.href}
                  className={
                    instrument.active
                      ? `${styles.instrumentCard} ${styles.active}`
                      : styles.instrumentCard
                  }
                >
                  {instrument.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section padding="products" background="catalogResults">
        <Container width="wide">
          {data.products.length > 0 ? (
            <ProductGrid items={data.products} />
          ) : (
            <p className={styles.emptyText}>{data.content.emptyText}</p>
          )}
        </Container>
      </Section>

      <SelectionReminder locale={locale} />
    </>
  );
}

function SelectionReminder({ locale }: { locale: string }) {
  return (
    <Section padding="split" background="soft">
      <Container>
        <div className={styles.reminderGrid}>
          {selectionsPageContent.detail.reminderColumns.map((column) => (
            <div key={column.title} className={styles.reminderColumn}>
              <h2>{column.title}</h2>
              <div className={styles.reminderLinks}>
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={localizedHref(locale, link.href)}
                    className={styles.reminderLink}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
