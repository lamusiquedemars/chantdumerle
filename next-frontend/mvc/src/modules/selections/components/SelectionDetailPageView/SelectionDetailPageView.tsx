import Link from "next/link";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import type {
  SelectionDetailPageData,
  SelectionRecommendation,
} from "@/modules/selections/services/selectionRecommendations";
import styles from "./SelectionDetailPageView.module.css";

const PRODUCT_IMAGE_PLACEHOLDER =
  `${process.env.NEXT_PUBLIC_WP_URL ?? ""}/wp-content/uploads/woocommerce-placeholder-300x300.webp`;

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
    { label: "Accueil", href: localizedHref(locale) },
    { label: "Sélections", href: localizedHref(locale, "/selections") },
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

      <Section className={styles.introSection}>
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
              <h2>Affiner par instrument</h2>
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
                Tous
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

      <Section className={styles.productsSection}>
        <Container className={styles.resultsContainer}>
          {data.recommendations.length > 0 ? (
            <div className={styles.productLikeGrid}>
              {data.recommendations.map((item) => (
                <ProductLikePreview
                  key={item.sku ?? `${item.instrument}-${item.title}`}
                  item={item}
                />
              ))}
            </div>
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
  const columns = [
    {
      title: "Packs",
      links: [
        ["Pack essentiel cordes", "/selections/packs/decouverte"],
        ["Pack essentiel archet", "/selections/packs/etude"],
        ["Pack performance archet", "/selections/packs/scene"],
      ],
    },
    {
      title: "Jeux par usage",
      links: [
        ["Étudiant", "/selections/usage/etudiant"],
        ["Orchestre", "/selections/usage/orchestre"],
        ["Soliste", "/selections/usage/soliste"],
      ],
    },
    {
      title: "Jeux par son",
      links: [
        ["Son chaud", "/selections/son/chaud"],
        ["Son brillant", "/selections/son/brillant"],
        ["Son équilibré", "/selections/son/equilibre"],
      ],
    },
  ];

  return (
    <Section className={styles.reminderSection}>
      <Container>
        <div className={styles.reminderGrid}>
          {columns.map((column) => (
            <div key={column.title} className={styles.reminderColumn}>
              <h2>{column.title}</h2>
              <div className={styles.reminderLinks}>
                {column.links.map(([label, href]) => (
                  <Link
                    key={href}
                    href={localizedHref(locale, href)}
                    className={styles.reminderLink}
                  >
                    {label}
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

function ProductLikePreview({ item }: { item: SelectionRecommendation }) {
  const price = formatPrice(item.price ?? item.estimatedPrice);
  const image = item.previewProduct?.image ?? PRODUCT_IMAGE_PLACEHOLDER;
  const href = item.product?.href ?? item.previewProduct?.href;

  const content = (
    <>
      <div className={styles.productLikeMedia}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={item.title} />
      </div>
      <div className={styles.productLikeBody}>
        <p className={styles.productLikeBrand}>{item.instrument}</p>
        <h3>{item.title}</h3>
        <p>{item.objective || item.note}</p>
        <dl>
          <div>
            <dt>Usage</dt>
            <dd>{item.usage}</dd>
          </div>
          <div>
            <dt>Son</dt>
            <dd>{item.soundProfile}</dd>
          </div>
        </dl>
        {price ? <p className={styles.productLikePrice}>{price}</p> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles.productLikeCard}>
        {content}
      </Link>
    );
  }

  return (
    <article className={styles.productLikeCard}>
      {content}
    </article>
  );
}

function formatPrice(value?: string) {
  if (!value) {
    return undefined;
  }

  const amount = Number(value.replace(",", "."));

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
