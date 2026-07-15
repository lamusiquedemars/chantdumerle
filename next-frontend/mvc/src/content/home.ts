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

type ShippingRate = {
  destination: string;
  estimatedDelay: string;
  smallParcel: string;
  largeParcel: string;
  freeFrom: string;
};

// Contenu home du client Chant du Merle.
export function getHomeContent(locale: string, guideItems: GuideCardItem[] = []) {
  const href = (path: string) => localizedHref(locale, path);

  return {
    hero: {
      title: "Les cordes, c'est notre spécialité.",
      subtitle:
        "Cordes et accessoires pour instruments du quatuor, sélectionnés avec soin pour vous aider à trouver le son juste.",
      backgroundImage: "/images/brand/hero-home.png",
      actions: [
        { label: "Choisir mes cordes", href: href("/cordes") },
        { label: "Explorer les sélections", href: href("/selections") },
      ],
    },
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
      paragraphs: [
        "C’est notre devise au Chant du Merle.",
        "Nous croyons que chaque musicien mérite de comprendre son instrument, qu’il soit débutant ou professionnel. Nous réduisons volontairement le choix de cordes et d’accessoires, afin de proposer une offre claire et surtout pratique.",
        "Nos sélections de cordes et de jeux composés, pensées selon l’usage et le type de son recherché, suivent cette même intention : rendre le choix plus simple, plus lisible, plus juste.",
      ],
    } satisfies {
      title: string;
      paragraphs: string[];
    },
    shipping: {
      title: "Essai et envoi",
      intro:
        "Les archets peuvent être essayés à l’atelier, à Collonges-au-Mont-d’Or, près de Lyon. Un essai par envoi peut aussi être envisagé selon les cas.",
      details:
        "Les commandes sont expédiées avec suivi. Les frais et délais ci-dessous sont donnés à titre indicatif ; le montant définitif est confirmé au panier avant validation.",
      rates: [
        {
          destination: "France métropolitaine",
          estimatedDelay: "2 à 5 jours ouvrés",
          smallParcel: "6 €",
          largeParcel: "15 €",
          freeFrom: "offerte dès 100 €",
        },
        {
          destination: "Europe",
          estimatedDelay: "3 à 7 jours ouvrés",
          smallParcel: "7 €",
          largeParcel: "17 €",
          freeFrom: "offerte dès 120 €",
        },
      ],
      note:
        "Les conditions détaillées d’essai, d’expédition, de paiement et de garantie sont précisées dans les Conditions Générales de Vente.",
      action: {
        label: "Consulter les CGV",
        href: href("/cgv"),
      },
    } satisfies {
      title: string;
      intro: string;
      details: string;
      rates: ShippingRate[];
      note: string;
      action: ContentAction;
    },
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
