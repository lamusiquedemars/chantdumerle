import type { EntryGridItem } from "@/components/blocks/EntryGrid/EntryGrid";
import type { SelectionCardItem } from "@/modules/selections/components/SelectionCard/SelectionCard";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";

const wpUploadUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_WP_URL ?? ""}/wp-content/uploads/${path}`;

export function getInstrumentEntryItems(locale: string): EntryGridItem[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      label: "Violon",
      href: href("/cordes?instrument=violon&prefilter=instrument"),
      description:
        "Jeux complets et cordes seules pour violon, selon le son, le confort et le niveau de jeu.",
      backgroundImage: "/icons/icon-violin.png",
    },
    {
      label: "Alto",
      href: href("/cordes?instrument=alto&prefilter=instrument"),
      description:
        "Cordes pour alto, avec une attention portée à la réponse, à la chaleur et à l’équilibre.",
      backgroundImage: "/icons/icon-viola.png",
    },
    {
      label: "Violoncelle",
      href: href("/cordes?instrument=violoncelle&prefilter=instrument"),
      description:
        "Cordes de violoncelle pour travailler la projection, la profondeur et la stabilité du jeu.",
      backgroundImage: "/icons/icon-cello.png",
    },
    {
      label: "Contrebasse",
      href: href("/cordes?instrument=contrebasse&prefilter=instrument"),
      description:
        "Cordes de contrebasse pour l’étude, l’orchestre ou une recherche sonore spécifique.",
      backgroundImage: "/icons/icon-db.png",
    },
  ];
}

export function getSoundEntryItems(locale: string): EntryGridItem[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      label: "Chaud",
      href: href("/cordes?son=chaud&prefilter=sound"),
      description: "Son rond, dense et chaleureux avec des graves riches",
      backgroundImage: wpUploadUrl(
        "2026/06/Cuerda-violin-Pirastro-Obligato-313121-1-Mi-Bola-Medium.jpg"
      ),
    },
    {
      label: "Équilibré",
      href: href("/cordes?son=equilibre&prefilter=sound"),
      description: "Équilibre harmonieux entre clarté, rondeur et puissance",
      backgroundImage: wpUploadUrl(
        "2026/06/Cuerda-violin-Thomastik-Dominant-133-4-Sol-Medium.jpg"
      ),
    },
    {
      label: "Brillant",
      href: href("/cordes?son=brillant&prefilter=sound"),
      description:
        "Son clair et projectif avec une attaque vive et des aigus éclatants",
      backgroundImage: wpUploadUrl(
        "2026/06/Set-de-cuerdas-violin-Pirastro-Evah-Pirazzi-419025-44-1-lazo-Medium.jpg"
      ),
    },
  ];
}

export function getLevelEntryItems(locale: string): EntryGridItem[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      label: "Étudiant",
      href: href("/cordes?usage=etudiant&prefilter=usage"),
      description:
        "Stabilité d’accord remarquable, homogénéité parfaite et fiabilité quotidienne",
      backgroundImage: wpUploadUrl(
        "2026/06/Cuerda-viola-Pirastro-Tonica-1-La.jpg"
      ),
    },
    {
      label: "Orchestre",
      href: href("/cordes?usage=orchestre&prefilter=usage"),
      description:
        "Grande précision de timbre, finesse dans les nuances et contrôle dynamique supérieur",
      backgroundImage: wpUploadUrl(
        "2026/06/cuerda-violin-thomastik-vision-vi01-1-mi-bola-removible-medium.jpg"
      ),
    },
    {
      label: "Avancé / Soliste",
      href: href("/cordes?usage=soliste&prefilter=usage"),
      description:
        "Réponse instantanée, projection généreuse et caractère timbrique affirmé",
      backgroundImage: wpUploadUrl(
        "2026/06/Cuerda-violin-Larsen-Il-Canone-Soloist-4-Sol-Medium.jpg"
      ),
    },
  ];
}

export function getStringNeedEntryItems(locale: string): EntryGridItem[] {
  return [
    ...getSoundEntryItems(locale),
    ...getLevelEntryItems(locale),
  ];
}

export function getAccessoryEntryItems(locale: string): EntryGridItem[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      label: "Colophanes",
      href: href("/accessoires?type=colophane"),
      description:
        "Pour adapter l’accroche, la réponse et la sensation sous l’archet.",
      backgroundImage: "/icons/icon-rosin.png",
    },
    {
      label: "Épaulières",
      href: href("/accessoires?type=epauliere"),
      description:
        "Pour stabiliser le violon ou l’alto et trouver une posture plus naturelle.",
      backgroundImage: "/icons/icon-sr.png",
    },
    {
      label: "Sourdines",
      href: href("/accessoires?type=sourdine"),
      description:
        "Pour réduire le volume, travailler à la maison ou modifier la couleur sonore.",
      backgroundImage: "/icons/icon-mute.png",
    },
    {
      label: "Étuis & housses",
      href: href("/accessoires?type=etui"),
      description: "Pour protéger l’instrument pendant le transport et le rangement.",
      backgroundImage: "/icons/icon-case.png",
    },
    {
      label: "Entretien",
      href: href("/accessoires?type=entretien"),
      description: "Pour garder cordes, vernis et chevilles dans de bonnes conditions.",
      backgroundImage: "/icons/icon-clean.png",
    },
    {
      label: "Supports de pique",
      href: href("/accessoires?type=support-de-pique"),
      description: "Pour stabiliser violoncelle ou contrebasse au sol.",
      backgroundImage: "/icons/icon-endpin.png",
    },
  ];
}

export function getPackSelectionItems(locale: string): SelectionCardItem[] {
  const href = (path: string) => localizedHref(locale, path);

  return [
    {
      title: "Pack essentiel cordes",
      href: href("/selections/packs/essentiel-cordes"),
      description:
        "Un jeu de cordes sélectionné avec une colophane assortie.",
      instrument: "Violon",
    },
    {
      title: "Pack essentiel archet",
      href: href("/selections/packs/essentiel-archet"),
      description:
        "Un archet avec une colophane adaptée, pour travailler avec de bons repères dès le départ.",
      instrument: "Alto",
    },
    {
      title: "Pack performance archet",
      href: href("/selections/packs/performance-archet"),
      description:
        "Archet, cordes et colophane réunis pour gagner en réponse, en couleur et en projection.",
      instrument: "Violoncelle",
    },
  ];
}
