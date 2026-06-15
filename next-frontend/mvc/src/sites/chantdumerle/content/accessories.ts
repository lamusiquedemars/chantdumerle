import type { AccessoriesContent } from "@/modules/catalog/types";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";

export function getAccessoriesContent(locale: string): AccessoriesContent {
  const href = (path: string) => localizedHref(locale, path);

  return {
    hero: {
      title: "Accessoires pour instruments à cordes",
      subtitle:
        "Colophanes, épaulières, sourdines, étuis et produits d’entretien pour accompagner le jeu, protéger l’instrument et garder de bons repères au quotidien.",
      backgroundImage: "/images/hero-accessoires.png",
    },
    products: {
      title: "Accessoires disponibles",
      subtitle:
        "Nous avons retenu des accessoires que nous connaissons pour leur qualité, leur fiabilité et leur bon rapport qualité-prix. Le choix est volontairement réduit : mieux vaut proposer moins de références, mais des produits que l’on peut recommander sans hésiter.",
    },
    categories: {
      title: "Choisir par besoin",
      subtitle:
        "Partez du geste recherché : faire sonner, jouer plus confortablement, protéger ou entretenir.",
      items: [
        {
          label: "Colophanes",
          href: href("/accessoires?type=colophane"),
          description: "Pour adapter l’accroche, la réponse et la sensation sous l’archet.",
        },
        {
          label: "Épaulières",
          href: href("/accessoires?type=epauliere"),
          description: "Pour stabiliser le violon ou l’alto et trouver une posture plus naturelle.",
        },
        {
          label: "Sourdines",
          href: href("/accessoires?type=sourdine"),
          description: "Pour réduire le volume, travailler à la maison ou modifier la couleur sonore.",
        },
        {
          label: "Étuis & housses",
          href: href("/accessoires?type=etui"),
          description: "Pour protéger l’instrument pendant le transport et le rangement.",
        },
        {
          label: "Entretien",
          href: href("/accessoires?type=entretien"),
          description: "Pour garder cordes, vernis et chevilles dans de bonnes conditions.",
        },
        {
          label: "Supports de pique",
          href: href("/accessoires?type=support-de-pique"),
          description: "Pour stabiliser violoncelle ou contrebasse au sol.",
        },
      ],
    },
  };
}
