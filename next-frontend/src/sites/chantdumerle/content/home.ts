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

// Contenu home du client Chant du Merle.
export function getHomeContent(locale: string) {
  const href = (path: string) => localizedHref(locale, path);

  const instrumentEntries: EntryGridItem[] = [
    {
      label: "Violon",
      href: href("/cordes?instrument=violon"),
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-violin.png",
    },
    {
      label: "Alto",
      href: href("/cordes?instrument=alto"),
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-viola.png",
    },
    {
      label: "Violoncelle",
      href: href("/cordes?instrument=cello"),
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-cello.png",
    },
    {
      label: "Contrebasse",
      href: href("/cordes?instrument=contrebasse"),
      description: "Voir notre sélection",
      backgroundImage: "/icons/icon-db.png",
    },
  ];

  const soundEntries: EntryGridItem[] = [
    {
      label: "Chaud",
      href: href("/cordes?son=chaud"),
      description: "Son rond, dense et chaleureux avec des graves riches",
      backgroundImage:
        "https://vallestrade.com/900196-thickbox_default/Cuerda-violin-Pirastro-Obligato-313121-1-Mi-Bola-Medium.jpg",
    },
    {
      label: "Équilibré",
      href: href("/cordes?son=equilibre"),
      description: "Équilibre harmonieux entre clarté, rondeur et puissance",
      backgroundImage:
        "https://vallestrade.com/902620-thickbox_default/Set-de-cuerdas-cello-Thomastik-Dominant-147-Medium.jpg",
    },
    {
      label: "Brillant",
      href: href("/cordes?son=brillant"),
      description:
        "Son clair et projectif avec une attaque vive et des aigus éclatants",
      backgroundImage:
        "https://vallestrade.com/1043305-thickbox_default/Set-de-cuerdas-violin-Pirastro-Evah-Pirazzi-419025-44-1-lazo-Medium.jpg",
    },
  ];

  const levelEntries: EntryGridItem[] = [
    {
      label: "Étudiant",
      href: href("/selections"),
      description:
        "Stabilité d’accord remarquable, homogénéité parfaite et fiabilité quotidienne",
      backgroundImage:
        "https://vallestrade.com/899815-thickbox_default/Cuerda-viola-Pirastro-Tonica-1-La.jpg",
    },
    {
      label: "Orchestre",
      href: href("/selections"),
      description:
        "Grande précision de timbre, finesse dans les nuances et contrôle dynamique supérieur",
      backgroundImage:
        "https://vallestrade.com/900406-thickbox_default/cuerda-violin-thomastik-vision-vi01-1-mi-bola-removible-medium.jpg",
    },
    {
      label: "Avancé / Soliste",
      href: href("/selections"),
      description:
        "Réponse instantanée, projection généreuse et caractère timbrique affirmé",
      backgroundImage:
        "https://vallestrade.com/915835-thickbox_default/Cuerda-violin-Larsen-Il-Canone-Soloist-4-Sol-Medium.jpg",
    },
  ];

  const featuredSelections: SelectionCardItem[] = [
    {
      title: "Pack essentiel cordes",
      href: href("/selections"),
      description:
        "Un jeu de cordes sélectionné + colophane assortie pour un son équilibré et une grande fiabilité",
      instrument: "Violon",
    },
    {
      title: "Pack essentiel archet",
      href: href("/selections"),
      description:
        "Un archet + colophane pour un équilibre confort et précision de jeu, idéal pour les étudiants et les amateurs",
      instrument: "Alto",
    },
    {
      title: "Pack performance archet",
      href: href("/selections"),
      description:
        "Archet + cordes + colophane pour une expression renforcée et une grande richesse de timbre, parfait pour les musiciens avancés",
      instrument: "Violoncelle",
    },
  ];

  const guideItems: GuideCardItem[] = [
    {
      title: "Comment choisir ses cordes",
      href: href("/guides/comment-choisir-ses-cordes"),
      excerpt: "Les vrais critères utiles pour décider sans se perdre.",
      category: "Choix",
    },
  ];

  return {
    hero: {
      title: "Les cordes, c'est notre spécialité.",
      subtitle:
        "Cordes et accessoires pour instruments du quatuor, sélectionnés avec soin.",
      backgroundImage: "images/brand/hero-home-drawer.png",
      actions: [
        { label: "Choisir mes cordes", href: href("/cordes") },
        { label: "Explorer les sélections", href: href("/selections") },
      ],
    },
    intro: {
      title: "Une sélection réfléchie, bien plus qu'un catalogue.",
      text: "Nous vous guidons vers les cordes les plus adaptées à votre niveau, à votre instrument et au son que vous recherchez.",
    } satisfies HomeTextBlock,
    entrySections: {
      instruments: {
        title: "Entrer par instrument",
        items: instrumentEntries,
      },
      sounds: {
        title: "Je recherche un son :",
        items: soundEntries,
      },
      levels: {
        title: "Entrer par niveau",
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
      title: "Quelques références",
      subtitle:
        "Des cordes et accessoires de premier choix. Marques reconnues, sélection exigeante.",
      backgroundImage: "/images/violin-head.jpg",
    },
    guides: {
      title: "Guides",
      subtitle: "Pour comprendre, comparer, et choisir plus vite.",
      action: {
        label: "Voir les guides",
        href: href("/guides"),
      },
      items: guideItems,
    },
    closing: {
      title: "Choisir avec plus de justesse",
      text: "Notre objectif ici n’est pas de montrer tout l'univers des cordes et accessoires du quatuor, mais d’aider chaque musicien à trouver ce qu'il recherche, avec notre soin et notre passion.",
    } satisfies HomeTextBlock,
    workshop: {
      backgroundImage: "/images/bow-ivo-incidit.jpg",
      content: {
        title: "Atelier Ivo Incidit",
        text: "Des archets à part, pour les musiciens qui cherchent une autre relation à la matière, au timbre et à la sensation de jeu.",
        tone: "light",
        actions: [
          {
            label: "Découvrir l’atelier",
            href: "https://atelierivoincidit.fr",
          },
        ],
      } satisfies HomeTextBlock,
    },
  };
}

export type HomeContent = ReturnType<typeof getHomeContent>;
