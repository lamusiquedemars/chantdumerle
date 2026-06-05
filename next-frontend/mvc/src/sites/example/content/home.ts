import type { EntryGridItem } from "@/components/blocks/EntryGrid/EntryGrid";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { SelectionCardItem } from "@/modules/selections/components/SelectionCard/SelectionCard";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";

type ContentAction = {
  label: string;
  href: string;
};

type HomeTextBlock = {
  title: string;
  text: string;
  actions?: ContentAction[];
  tone?: "default" | "light";
};

// Contenu home exemple du starter.
export function getHomeContent(locale: string) {
  const href = (path: string) => localizedHref(locale, path);

  const instrumentEntries: EntryGridItem[] = [
    {
      label: "Service",
      href: href("/catalogue?type=service"),
      description: "Une offre structurée pour démarrer vite",
    },
    {
      label: "Produit",
      href: href("/catalogue?type=product"),
      description: "Une fiche catalogue prête à adapter",
    },
    {
      label: "Contenu",
      href: href("/guides"),
      description: "Des pages éditoriales simples et modulaires",
    },
  ];

  const soundEntries: EntryGridItem[] = [
    {
      label: "Découvrir",
      href: href("/catalogue"),
      description: "Présenter une sélection courte et facile à parcourir",
    },
    {
      label: "Comparer",
      href: href("/selections"),
      description: "Mettre en avant des choix éditoriaux ou commerciaux",
    },
    {
      label: "Comprendre",
      href: href("/guides/premier-guide"),
      description: "Guider la décision avec un article court",
    },
  ];

  const levelEntries: EntryGridItem[] = [
    {
      label: "Vitrine",
      href: href("/selections"),
      description: "Pages simples, contenus statiques et navigation claire",
    },
    {
      label: "Catalogue",
      href: href("/selections"),
      description: "Listes, fiches et produits exemple sans backend requis",
    },
    {
      label: "Headless",
      href: href("/selections"),
      description: "Adaptateurs prêts à brancher sur une source externe",
    },
  ];

  const featuredSelections: SelectionCardItem[] = [
    {
      title: "Sélection découverte",
      href: href("/selections"),
      description: "Un exemple de curation pour présenter un choix recommandé.",
      instrument: "Starter",
    },
    {
      title: "Sélection avancée",
      href: href("/selections"),
      description: "Un deuxième exemple pour illustrer une offre plus complète.",
      instrument: "Module",
    },
    {
      title: "Sélection conseil",
      href: href("/selections"),
      description: "Une sélection éditoriale pour guider une décision.",
      instrument: "Guide",
    },
  ];

  const guideItems: GuideCardItem[] = [
    {
      title: "Premier guide",
      href: href("/guides/premier-guide"),
      excerpt: "Un article exemple pour montrer la structure éditoriale.",
      category: "Exemple",
    },
  ];

  return {
    hero: {
      title: "Example Studio",
      subtitle: "Un starter Next.js headless MVC léger, prêt à adapter.",
      backgroundImage: "/images/violin-head.jpg",
      actions: [
        { label: "Voir le catalogue", href: href("/catalogue") },
        { label: "Explorer les sélections", href: href("/selections") },
      ],
    },
    intro: {
      title: "Un socle modulaire, sans backend obligatoire.",
      text: "Le starter sépare routes, modules, configuration client et contenus pour accélérer les prochains sites.",
    } satisfies HomeTextBlock,
    entrySections: {
      instruments: {
        title: "Entrer par besoin",
        items: instrumentEntries,
      },
      sounds: {
        title: "Parcourir le parcours",
        items: soundEntries,
      },
      levels: {
        title: "Adapter le modèle",
        items: levelEntries,
      },
    },
    selections: {
      title: "Sélections prêtes à jouer",
      subtitle:
        "Des ensembles pensés pour simplifier le choix et faciliter la prise de décision.",
      action: {
        label: "Voir les sélections",
        href: href("/selections"),
      },
      items: featuredSelections,
    },
    featuredProducts: {
      title: "Produits exemple",
      subtitle: "Des données locales permettent de tester le catalogue immédiatement.",
      backgroundImage: "/images/violin-head.jpg",
    },
    guides: {
      title: "Guides",
      subtitle: "Des contenus éditoriaux courts pour structurer l'information.",
      action: {
        label: "Voir les guides",
        href: href("/guides"),
      },
      items: guideItems,
    },
    closing: {
      title: "Un modèle à personnaliser",
      text: "Remplacez la configuration, les contenus et les adaptateurs pour créer un nouveau site client sans repartir de zéro.",
    } satisfies HomeTextBlock,
    workshop: {
      backgroundImage: "/images/violin-head.jpg",
      content: {
        title: "Prêt pour un vrai cas client",
        text: "Le dossier sites contient l'identité et les contenus. Les modules restent réutilisables.",
        tone: "light",
        actions: [
          {
            label: "Lire le README",
            href: "/",
          },
        ],
      } satisfies HomeTextBlock,
    },
  };
}

export type HomeContent = ReturnType<typeof getHomeContent>;
