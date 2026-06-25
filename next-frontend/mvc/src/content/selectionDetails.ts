export type SelectionDetailKind = "usage" | "son" | "packs";

export type SelectionDetailContent = {
  title: string;
  eyebrow: string;
  intro: string;
  emptyText: string;
};

export type InstrumentEntry = {
  label: string;
  value: string;
  description: string;
};

export const selectionInstruments: InstrumentEntry[] = [
  {
    label: "Violon",
    value: "violon",
    description: "Des jeux fiables, réactifs et faciles à comparer.",
  },
  {
    label: "Alto",
    value: "alto",
    description: "Des propositions qui gardent chaleur et réponse.",
  },
  {
    label: "Violoncelle",
    value: "violoncelle",
    description: "Des jeux choisis pour l'équilibre et la projection.",
  },
  {
    label: "Contrebasse",
    value: "contrebasse",
    description: "Des jeux pensés pour stabilité, assise et usage réel.",
  },
];

const selectionDetails: Record<
  SelectionDetailKind,
  Record<string, SelectionDetailContent>
> = {
  usage: {
    etudiant: {
      eyebrow: "Jeux par usage",
      title: "Sélection de cordes pour étudiant",
      intro:
        "Pour un étudiant, le bon jeu doit d'abord simplifier le quotidien : accord stable, réponse facile, sensation rassurante sous les doigts et prix cohérent avec un usage régulier.",
      emptyText:
        "Aucun jeu étudiant n'est disponible pour ce choix pour le moment.",
    },
    orchestre: {
      eyebrow: "Jeux par usage",
      title: "Sélection de cordes pour orchestre",
      intro:
        "En orchestre, on cherche des cordes homogènes, stables et lisibles dans le pupitre. L'objectif est de garder de la précision sans durcir l'instrument ni prendre trop de place dans l'ensemble.",
      emptyText:
        "Aucun jeu orchestre n'est disponible pour ce choix pour le moment.",
    },
    soliste: {
      eyebrow: "Jeux par usage",
      title: "Sélection de cordes pour soliste",
      intro:
        "Une recherche soliste demande souvent plus de projection, de couleur et de rapidité de réponse. Cette sélection privilégie les jeux capables de porter le son sans l'aplatir.",
      emptyText:
        "Aucun jeu soliste n'est disponible pour ce choix pour le moment.",
    },
  },
  son: {
    chaud: {
      eyebrow: "Jeux par son",
      title: "Sélection de cordes au son chaud",
      intro:
        "Un son chaud aide à arrondir un instrument clair, à calmer une attaque trop directe ou à chercher davantage de densité dans le timbre.",
      emptyText:
        "Aucun jeu au son chaud n'est disponible pour ce choix pour le moment.",
    },
    brillant: {
      eyebrow: "Jeux par son",
      title: "Sélection de cordes au son brillant",
      intro:
        "Un jeu brillant peut réveiller un instrument sombre, donner plus de présence et aider le son à passer, à condition de garder une attaque musicale.",
      emptyText:
        "Aucun jeu brillant n'est disponible pour ce choix pour le moment.",
    },
    equilibre: {
      eyebrow: "Jeux par son",
      title: "Sélection de cordes équilibrées",
      intro:
        "Les jeux équilibrés sont de bons points de départ : assez de clarté pour parler facilement, assez de rondeur pour ne pas durcir l'instrument.",
      emptyText:
        "Aucun jeu équilibré n'est disponible pour ce choix pour le moment.",
    },
  },
  packs: {
    "essentiel-cordes": {
      eyebrow: "Packs",
      title: "Pack essentiel cordes",
      intro:
        "Un jeu de cordes sélectionné avec une colophane assortie, pour partir sur un ensemble cohérent sans multiplier les décisions techniques.",
      emptyText: "Aucun pack essentiel cordes n'est disponible pour ce choix pour le moment.",
    },
    "essentiel-archet": {
      eyebrow: "Packs",
      title: "Pack essentiel archet",
      intro:
        "Un archet avec une colophane adaptée, pour travailler avec de bons repères dès le départ et garder une réponse simple sous la main.",
      emptyText: "Aucun pack essentiel archet n'est disponible pour ce choix pour le moment.",
    },
    "performance-archet": {
      eyebrow: "Packs",
      title: "Pack performance archet",
      intro:
        "Archet, cordes et colophane réunis pour gagner en réponse, en couleur et en projection dans une situation de jeu plus exposée.",
      emptyText: "Aucun pack performance archet n'est disponible pour ce choix pour le moment.",
    },
  },
};

export function getSelectionDetailContent(
  kind: string,
  slug: string
): SelectionDetailContent | undefined {
  if (!isSelectionDetailKind(kind)) {
    return undefined;
  }

  return selectionDetails[kind][slug];
}

export function isSelectionDetailKind(
  kind: string
): kind is SelectionDetailKind {
  return kind === "usage" || kind === "son" || kind === "packs";
}

export function getSelectionDetailPaths() {
  return Object.entries(selectionDetails).flatMap(([kind, entries]) =>
    Object.keys(entries).map((slug) => ({
      kind: kind as SelectionDetailKind,
      slug,
    }))
  );
}
