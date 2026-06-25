import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import {
  getInstrumentEntryItems,
  getLevelEntryItems,
  getPackSelectionItems,
  getSoundEntryItems,
} from "@/content/navigationCards";

type ContentAction = {
  label: string;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

type HomeTextBlock = {
  title: string;
  text: string;
  actions?: ContentAction[];
  tone?: "default" | "light";
};

// Contenu home du client Chant du Merle.
export function getHomeContent(locale: string, guideItems: GuideCardItem[] = []) {
  const href = (path: string) => localizedHref(locale, path);

  return {
    hero: {
      title: "Les cordes, c'est notre spécialité.",
      subtitle:
        "Cordes et accessoires pour instruments du quatuor, sélectionnés avec soin.",
      backgroundImage: "/images/brand/hero-home.png",
      actions: [
        { label: "Choisir mes cordes", href: href("/cordes") },
        { label: "Explorer les sélections", href: href("/selections") },
      ],
    },
    intro: {
      title: "Bien plus qu'un catalogue, une sélection réfléchie.",
      text: "Notre proposition est de vous orienter vers les cordes les plus adaptées à votre niveau," +
      " à votre instrument et au son que vous recherchez.",
    } satisfies HomeTextBlock,
    entrySections: {
      instruments: {
        title: "Entrer par instrument",
        items: getInstrumentEntryItems(locale),
      },
      sounds: {
        title: "Je recherche un son :",
        items: getSoundEntryItems(locale),
      },
      levels: {
        title: "Entrer par niveau",
        items: getLevelEntryItems(locale),
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
      items: getPackSelectionItems(locale),
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
      items: guideItems.slice(0, 3),
    },
    closing: {
      title: "Choisir avec justesse",
      text: "C’est notre devise au Chant du Merle. Nous croyons que chaque musicien mérite de "+
      "comprendre son instrument, qu’il soit débutant ou professionnel. "+
      "Nous réduisons volontairement le choix de cordes et d’accessoires, afin de proposer une "+
      "offre claire et surtout pratique. Par ailleurs, nos sélections de cordes et de jeux " +
      "composées, conçus en fonction de l’usage et du type de son recherché, adoptent cette intention "+
      "de clarté et de simplicité. "+
      "Nous croyons aussi que l’information est essentielle, et nos guides pratiques vous aideront "+
      "à comprendre et à choisir. Nous vous souhaitons une bonne navigation !",
    } satisfies HomeTextBlock,
    workshop: {
      backgroundImage: "/images/bow-ivo-incidit.jpg",
      content: {
        title: "Atelier Ivo Incidit",
        text: "Archets artisanaux fabriqués à Lyon, en bois brésiliens alternatifs, pour "+
        "les musiciens qui cherchent une autre relation à la matière, au timbre et à la sensation de jeu.",
        tone: "light",
        actions: [
          {
            label: "Découvrir l’atelier",
            href: "https://atelierivoincidit.fr",
            target: "_blank",
          },
        ],
      } satisfies HomeTextBlock,
    },
  };
}

export type HomeContent = ReturnType<typeof getHomeContent>;
