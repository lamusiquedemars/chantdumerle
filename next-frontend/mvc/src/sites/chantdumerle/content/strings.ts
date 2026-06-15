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
      href: href("/cordes?instrument=violon&prefilter=instrument"),
      description:
        "Jeux complets et cordes seules pour violon, selon le son, le confort et le niveau de jeu.",
    },
    {
      label: "Alto",
      href: href("/cordes?instrument=alto&prefilter=instrument"),
      description:
        "Cordes pour alto, avec une attention portée à la réponse, à la chaleur et à l’équilibre.",
    },
    {
      label: "Violoncelle",
      href: href("/cordes?instrument=violoncelle&prefilter=instrument"),
      description:
        "Cordes de violoncelle pour travailler la projection, la profondeur et la stabilité du jeu.",
    },
    {
      label: "Contrebasse",
      href: href("/cordes?instrument=contrebasse&prefilter=instrument"),
      description:
        "Cordes de contrebasse pour l’étude, l’orchestre ou une recherche sonore spécifique.",
    },
  ];

  const selectionItems: SelectionCardItem[] = [
    {
      title: "Son chaud",
      href: href("/cordes?son=chaud&prefilter=sound"),
      description:
        "Pour arrondir le timbre, adoucir l’instrument ou chercher plus de souplesse sonore.",
    },
    {
      title: "Projection",
      href: href("/cordes?son=brillant&prefilter=sound"),
      description: "Pour gagner en présence, en clarté et en portée sonore.",
    },
    {
      title: "Confort de jeu",
      href: href("/cordes?son=equilibre&prefilter=sound"),
      description:
        "Pour trouver des cordes faciles à mettre en vibration et agréables sous les doigts.",
    },
    {
      title: "Débutant / école",
      href: href("/cordes?usage=etudiant&prefilter=usage"),
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
      href: href("/cordes?instrument=violon&prefilter=instrument"),
    },
    {
      label: "Alto",
      href: href("/cordes?instrument=alto&prefilter=instrument"),
    },
    {
      label: "Violoncelle",
      href: href("/cordes?instrument=violoncelle&prefilter=instrument"),
    },
    {
      label: "Contrebasse",
      href: href("/cordes?instrument=contrebasse&prefilter=instrument"),
    },
  ];

  return {
    hero: {
      title: "Cordes pour violon, alto, violoncelle et contrebasse",
      subtitle:
        "Une sélection claire de cordes pour trouver rapidement un jeu adapté à votre instrument, votre niveau et votre recherche sonore.",
      backgroundImage: "/images/hero-cordes.png",
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
    filterIntros: {
      instrument: {
        violon: {
          heroTitle: "Cordes pour violon",
          heroSubtitle:
            "Jeux complets et cordes seules pour violon, selon le son, le confort et le niveau de jeu.",
          title: "Trouver un jeu adapté à votre violon",
          paragraphs: [
            "Le choix des cordes de violon dépend beaucoup de l’équilibre naturel de l’instrument : certains ont besoin d’être arrondis, d’autres de gagner en clarté ou en projection.",
            "Cette entrée vous présente d’abord des jeux complets, puis vous pouvez affiner par marque selon vos repères ou vos habitudes.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        alto: {
          heroTitle: "Cordes pour alto",
          heroSubtitle:
            "Cordes pour alto, avec une attention portée à la réponse, à la chaleur et à l’équilibre.",
          title: "Préserver la chaleur sans perdre la réponse",
          paragraphs: [
            "Sur alto, les cordes doivent souvent aider l’instrument à parler avec souplesse, tout en gardant assez de présence dans les registres graves et médiums.",
            "La sélection part des jeux complets disponibles et peut ensuite être affinée par marque.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        violoncelle: {
          heroTitle: "Cordes pour violoncelle",
          heroSubtitle:
            "Cordes de violoncelle pour travailler la projection, la profondeur et la stabilité du jeu.",
          title: "Équilibrer profondeur, réponse et projection",
          paragraphs: [
            "Pour le violoncelle, le bon jeu cherche souvent un équilibre entre profondeur du timbre, stabilité et facilité de réponse sous l’archet.",
            "Cette entrée rassemble les jeux complets avant de vous laisser affiner par marque.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        contrebasse: {
          heroTitle: "Cordes pour contrebasse",
          heroSubtitle:
            "Cordes de contrebasse pour l’étude, l’orchestre ou une recherche sonore spécifique.",
          title: "Choisir selon le jeu, la stabilité et la projection",
          paragraphs: [
            "Les cordes de contrebasse dépendent fortement de l’usage : orchestre, pizzicato, jazz, travail d’étude ou recherche de projection.",
            "Cette entrée privilégie les jeux complets en taille entière et vous laisse ensuite filtrer par marque.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
      },
      sound: {
        chaud: {
          heroTitle: "Cordes au son chaud",
          heroSubtitle:
            "Pour arrondir le timbre, adoucir l’instrument ou chercher plus de souplesse sonore.",
          title: "Quand chercher un son chaud ?",
          paragraphs: [
            "Un son chaud aide souvent à arrondir un instrument trop clair, à calmer une attaque trop directe ou à retrouver plus de densité dans le timbre.",
            "La liste ci-dessous part de ce profil sonore, puis vous pouvez affiner par instrument et par marque pour revenir à une sélection concrète.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        equilibre: {
          heroTitle: "Cordes au son équilibré",
          heroSubtitle:
            "Pour trouver des cordes faciles à mettre en vibration et agréables sous les doigts.",
          title: "L’équilibre comme point de départ",
          paragraphs: [
            "Les cordes équilibrées cherchent un compromis utile : assez de clarté pour parler facilement, assez de rondeur pour ne pas durcir l’instrument.",
            "C’est souvent la meilleure entrée quand on veut comparer sans partir tout de suite vers une couleur très marquée.",
          ],
          action: {
            label: "Comprendre les critères",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        brillant: {
          heroTitle: "Cordes au son brillant",
          heroSubtitle: "Pour gagner en présence, en clarté et en portée sonore.",
          title: "Pour gagner en clarté et projection",
          paragraphs: [
            "Un profil brillant peut réveiller un instrument sombre, aider le son à passer dans une salle ou donner une réponse plus directe sous l’archet.",
            "À utiliser avec nuance : selon l’instrument, la bonne corde brillante doit apporter de la présence sans rendre le timbre sec.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
      },
      usage: {
        etudiant: {
          heroTitle: "Cordes pour étudiant",
          heroSubtitle:
            "Pour choisir des cordes fiables, stables et raisonnables sans se perdre dans le catalogue.",
          title: "Pour étudier sans se battre avec les cordes",
          paragraphs: [
            "Pour un étudiant, la priorité est souvent la fiabilité : stabilité d’accord, rodage court, réponse facile et budget raisonnable.",
            "Cette entrée sert à isoler les modèles qui simplifient le quotidien avant d’affiner par instrument ou par marque.",
          ],
          action: {
            label: "Voir les repères du guide",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        orchestre: {
          heroTitle: "Cordes pour orchestre",
          heroSubtitle:
            "Grande précision de timbre, finesse dans les nuances et contrôle dynamique supérieur.",
          title: "Pour jouer en ensemble avec stabilité",
          paragraphs: [
            "En orchestre, on cherche généralement une corde stable, lisible, homogène et capable de se fondre dans un pupitre sans perdre en précision.",
            "Le filtre donne une base de travail, à compléter ensuite selon l’instrument, la tension et la couleur recherchée.",
          ],
          action: {
            label: "Lire le guide de choix",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
        soliste: {
          heroTitle: "Cordes pour soliste",
          heroSubtitle:
            "Réponse instantanée, projection généreuse et caractère timbrique affirmé.",
          title: "Pour une réponse plus expressive",
          paragraphs: [
            "Une recherche soliste demande souvent davantage de projection, de complexité et de rapidité de réponse.",
            "Cette sélection n’impose pas une corde unique : elle ouvre les modèles à comparer selon la personnalité de l’instrument.",
          ],
          action: {
            label: "Comprendre les critères",
            href: href("/guides/comment-choisir-ses-cordes"),
          },
        },
      },
    },
  };
}
