import type { EntryGridItem } from "@/components/blocks/EntryGrid/EntryGrid";
import type { StringsContent } from "@/modules/catalog/types";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { SelectionCardItem } from "@/modules/selections/components/SelectionCard/SelectionCard";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";

type ContentAction = {
  label: string;
  href: string;
};

// Contenu client de l'univers cordes, hors de la route catalogue.
export function getStringsContent(locale: string): StringsContent {
  const href = (path: string) => localizedHref(locale, path);

  // Les filtres restent dans l'URL tant que le catalogue n'a pas ses vues dediees.
  const instrumentItems: EntryGridItem[] = [
    {
      label: "Violon",
      href: href("/cordes?instrument=violon"),
      description:
        "Jeux complets et cordes seules pour violon, selon le son, le confort et le niveau de jeu.",
    },
    {
      label: "Alto",
      href: href("/cordes?instrument=alto"),
      description:
        "Cordes pour alto, avec une attention portée à la réponse, à la chaleur et à l’équilibre.",
    },
    {
      label: "Violoncelle",
      href: href("/cordes?instrument=violoncelle"),
      description:
        "Cordes de violoncelle pour travailler la projection, la profondeur et la stabilité du jeu.",
    },
    {
      label: "Contrebasse",
      href: href("/cordes?instrument=contrebasse"),
      description:
        "Cordes de contrebasse pour l’étude, l’orchestre ou une recherche sonore spécifique.",
    },
  ];

  const selectionItems: SelectionCardItem[] = [
    {
      title: "Son chaud",
      href: href("/selections"),
      description:
        "Pour arrondir le timbre, adoucir l’instrument ou chercher plus de souplesse sonore.",
    },
    {
      title: "Projection",
      href: href("/selections"),
      description: "Pour gagner en présence, en clarté et en portée sonore.",
    },
    {
      title: "Confort de jeu",
      href: href("/selections"),
      description:
        "Pour trouver des cordes faciles à mettre en vibration et agréables sous les doigts.",
    },
    {
      title: "Débutant / école",
      href: href("/selections"),
      description:
        "Pour choisir des cordes fiables, stables et raisonnables sans se perdre dans le catalogue.",
    },
  ];

  const guideItems: GuideCardItem[] = [
    {
      title: "Comment choisir ses cordes ?",
      href: href("/guides/comment-choisir-ses-cordes"),
      excerpt: "Comprendre les grands équilibres avant de comparer les modèles.",
    },
  ];

  const heroActions: ContentAction[] = [
    {
      label: "Violon",
      href: href("/cordes?instrument=violon"),
    },
    {
      label: "Alto",
      href: href("/cordes?instrument=alto"),
    },
    {
      label: "Violoncelle",
      href: href("/cordes?instrument=violoncelle"),
    },
    {
      label: "Contrebasse",
      href: href("/cordes?instrument=contrebasse"),
    },
  ];

  return {
    hero: {
      title: "Cordes pour violon, alto, violoncelle et contrebasse",
      subtitle:
        "Une sélection claire de cordes pour trouver rapidement un jeu adapté à votre instrument, votre niveau et votre recherche sonore.",
      actions: heroActions,
    },
    products: {
      title: "Notre sélection de cordes",
      subtitle:
        "Quelques jeux et cordes choisis pour leur fiabilité, leur intérêt musical et leur utilité réelle dans le choix d’un musicien.",
    },
    instruments: {
      title: "Choisir par instrument",
      subtitle: "Accédez directement aux cordes adaptées à votre instrument.",
      items: instrumentItems,
    },
    selections: {
      title: "Choisir selon votre besoin",
      subtitle:
        "Si vous ne cherchez pas une marque précise, partez plutôt de ce que vous voulez améliorer.",
      items: selectionItems,
    },
    editorial: {
      title: "Une sélection courte, pensée pour le choix",
      text: "Le Chant du Merle ne cherche pas à afficher le plus grand nombre de références possible. L’objectif est de proposer des cordes compréhensibles, comparables et réellement utiles selon l’instrument, le niveau de jeu et la recherche sonore.",
    },
    guides: {
      title: "Guides utiles",
      subtitle:
        "Quelques repères simples pour mieux comprendre vos cordes avant de choisir.",
      items: guideItems,
    },
  };
}
