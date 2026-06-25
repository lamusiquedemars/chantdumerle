export type SelectionPageItem = {
  title: string;
  description: string;
  href?: string;
};

export type SelectionPageGroup = {
  title: string;
  intro: string;
  items: SelectionPageItem[];
};

export type SelectionPageSection = {
  id?: string;
  eyebrow: string;
  title: string;
  intro: string;
  items?: SelectionPageItem[];
  groups?: SelectionPageGroup[];
};

export type SelectionReminderColumn = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

// Contenu client de la page de selections.
// Pour modifier les textes visibles de /selections, commencer ici.
export const selectionsPageContent = {
  title: "Nos Sélections Prêtes à Jouer",
  hero: {
    subtitle:
      "Des propositions préparées pour choisir plus simplement : packs prêts à jouer, cordes selon la pratique, ou jeux orientés vers une couleur sonore.",
    backgroundImage: "/images/hero-selections.png",
  },
  breadcrumbs: {
    homeLabel: "Accueil",
    currentLabel: "Sélections",
  },
  paragraphs: [
    "Nous avons créé ces sélections pour vous simplifier le choix et vous faire gagner un temps précieux.",
    "Au cœur de chaque pack se trouvent des cordes sélectionnées avec soin. Nous testons et combinons des cordes issues de sets différents pour proposer des associations cohérentes et équilibrées en termes de timbre, de réponse et de projection — un travail que nous réalisons en amont pour vous éviter d’avoir à les choisir et les acheter une par une.",
    "Ces packs intègrent également les accessoires les plus pertinents (colophane, repose-épaule, accordeur, etc.) ainsi que, pour certains, un archet adapté. L’objectif est de vous offrir des ensembles harmonieux et immédiatement prêts à l’emploi, adaptés à chaque niveau.",
  ],
  packs: {
    id: "packs",
    eyebrow: "Packs",
    title: "Packs prêts à jouer",
    intro:
      "Des ensembles complets avec les éléments à associer : cordes, archet et colophane.",
  } satisfies SelectionPageSection,
  strings: {
    eyebrow: "Cordes",
    title: "Notre sélection de jeux de cordes",
    intro:
      "Des jeux classés selon votre pratique ou selon la couleur sonore recherchée.",
    groups: [
      {
        title: "Selon la pratique",
        intro:
          "Pour choisir des cordes adaptées au travail, au pupitre ou au jeu plus exposé.",
        items: [
          {
            title: "Étudiant",
            description:
              "Accord simple, toucher confortable et réponse facile au quotidien.",
            href: "/selections/usage/etudiant",
          },
          {
            title: "Orchestre",
            description:
              "Son homogène, attaque contrôlée et bonne tenue dans le pupitre.",
            href: "/selections/usage/orchestre",
          },
          {
            title: "Soliste",
            description:
              "Plus de projection, de nuances et de réponse sous l’archet.",
            href: "/selections/usage/soliste",
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
            description: "Plus de rondeur, de profondeur et de souplesse.",
            href: "/selections/son/chaud",
          },
          {
            title: "Son brillant",
            description: "Plus de présence, de clarté et de projection.",
            href: "/selections/son/brillant",
          },
          {
            title: "Son équilibré",
            description:
              "Chaleur, précision et facilité de jeu sans caractère trop marqué.",
            href: "/selections/son/equilibre",
          },
        ],
      },
    ],
  } satisfies SelectionPageSection,
  guides: {
    title: "Guides utiles",
    subtitle:
      "Quelques repères pour comprendre les cordes, les usages et les choix de matériel avant de composer votre sélection.",
  },
  detail: {
    instrumentFilterTitle: "Affiner par instrument",
    allInstrumentsLabel: "Tous",
    productMetaLabels: {
      usage: "Usage",
      sound: "Son",
    },
    reminderColumns: [
      {
        title: "Packs",
        links: [
          {
            label: "Pack essentiel cordes",
            href: "/selections/packs/essentiel-cordes",
          },
          {
            label: "Pack essentiel archet",
            href: "/selections/packs/essentiel-archet",
          },
          {
            label: "Pack performance archet",
            href: "/selections/packs/performance-archet",
          },
        ],
      },
      {
        title: "Jeux par usage",
        links: [
          { label: "Étudiant", href: "/selections/usage/etudiant" },
          { label: "Orchestre", href: "/selections/usage/orchestre" },
          { label: "Soliste", href: "/selections/usage/soliste" },
        ],
      },
      {
        title: "Jeux par son",
        links: [
          { label: "Son chaud", href: "/selections/son/chaud" },
          { label: "Son brillant", href: "/selections/son/brillant" },
          { label: "Son équilibré", href: "/selections/son/equilibre" },
        ],
      },
    ] satisfies SelectionReminderColumn[],
  },
};
