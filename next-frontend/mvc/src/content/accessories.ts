import type { AccessoriesContent } from "@/modules/catalog/types";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import { getAccessoryEntryItems } from "@/content/navigationCards";

export function getAccessoriesContent(
  locale: string,
  guideItems: GuideCardItem[] = []
): AccessoriesContent {
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
      items: getAccessoryEntryItems(locale),
    },
    guides: {
      title: "Guides utiles",
      subtitle:
        "Quelques repères simples pour mieux choisir, comparer et entretenir votre matériel.",
      items: guideItems,
    },
  };
}
