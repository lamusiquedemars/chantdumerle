import Link from "next/link";
import Hero from "@/components/blocks/Hero/Hero";
import Container from "@/components/layout/Container/Container";
import Section from "@/components/layout/Section/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import { selectionsPageContent } from "@/sites/chantdumerle/content/selections";
import styles from "./SelectionsPageView.module.css";

type SelectionsPageViewProps = {
  locale: string;
};

type SelectionItem = {
  title: string;
  description: string;
  href?: string;
};

type SelectionGroup = {
  title: string;
  intro: string;
  items: SelectionItem[];
};

export default function SelectionsPageView({ locale }: SelectionsPageViewProps) {
  const packs = getPackItems(locale);
  const stringGroups = getStringGroups(locale);

  return (
    <>
      <Hero
        title={selectionsPageContent.title}
        subtitle="Des propositions préparées pour choisir plus simplement : packs prêts à jouer, cordes selon la pratique, ou jeux orientés vers une couleur sonore."
        backgroundImage="/images/hero-selections.png"
        actions={[]}
        className={styles.hero}
      />

      <Section className={styles.breadcrumbSection}>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Accueil", href: localizedHref(locale) },
              { label: "Sélections" },
            ]}
          />
        </Container>
      </Section>

      <Section className={styles.introSection}>
        <Container>
          <div className={styles.introText}>
            {selectionsPageContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="beige" className={styles.packsSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Packs</p>
            <h2>Packs prêts à jouer</h2>
            <p>
              Des ensembles complets avec les éléments à associer : cordes,
              archet et colophane.
            </p>
          </div>

          <div className={styles.packCards}>
            {packs.map((pack) => (
              <SelectionCard key={pack.title} item={pack} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className={styles.stringsSection}>
        <Container>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Cordes</p>
            <h2>Notre sélection de jeux de cordes</h2>
            <p>
              Des jeux classés selon votre pratique ou selon la couleur sonore
              recherchée.
            </p>
          </div>

          <div className={styles.selectionGroups}>
            {stringGroups.map((group) => (
              <SelectionGroupCard key={group.title} group={group} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

function SelectionCard({ item }: { item: SelectionItem }) {
  const content = (
    <>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={styles.packCard}>
        {content}
      </Link>
    );
  }

  return <article className={styles.packCard}>{content}</article>;
}

function SelectionGroupCard({ group }: { group: SelectionGroup }) {
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

function SelectionLink({ item }: { item: SelectionItem }) {
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

function getPackItems(locale: string): SelectionItem[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      title: "Pack essentiel cordes",
      description:
        "Un jeu de cordes sélectionné avec une colophane assortie.",
      href: href("/selections/packs/decouverte"),
    },
    {
      title: "Pack essentiel archet",
      description:
        "Un archet avec une colophane adaptée, pour travailler avec de bons repères dès le départ.",
      href: href("/selections/packs/etude"),
    },
    {
      title: "Pack performance archet",
      description:
        "Archet, cordes et colophane réunis pour gagner en réponse, en couleur et en projection.",
      href: href("/selections/packs/scene"),
    },
  ];
}

function getStringGroups(locale: string): SelectionGroup[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      title: "Selon la pratique",
      intro:
        "Pour choisir des cordes adaptées au travail, au pupitre ou au jeu plus exposé.",
      items: [
        {
          title: "Étudiant",
          description:
            "Accord simple, toucher confortable et réponse facile au quotidien.",
          href: href("/selections/usage/etudiant"),
        },
        {
          title: "Orchestre",
          description:
            "Son homogène, attaque contrôlée et bonne tenue dans le pupitre.",
          href: href("/selections/usage/orchestre"),
        },
        {
          title: "Soliste",
          description:
            "Plus de projection, de nuances et de réponse sous l’archet.",
          href: href("/selections/usage/soliste"),
        },
      ],
    },
    {
      title: "Selon le son recherché",
      intro:
        "Pour orienter le choix vers plus de chaleur, plus de présence ou un équilibre naturel.",
      items: [
        {
          title: "Son chaud",
          description:
            "Plus de rondeur, de profondeur et de souplesse.",
          href: href("/selections/son/chaud"),
        },
        {
          title: "Son brillant",
          description:
            "Plus de présence, de clarté et de projection.",
          href: href("/selections/son/brillant"),
        },
        {
          title: "Son équilibré",
          description:
            "Chaleur, précision et facilité de jeu sans caractère trop marqué.",
          href: href("/selections/son/equilibre"),
        },
      ],
    },
  ];
}
