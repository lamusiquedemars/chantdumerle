import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { GuidesPageContent } from "@/modules/guides/types";

export function getGuidesPageContent(
  guideItems: GuideCardItem[]
): GuidesPageContent {
  return {
    hero: {
      title: "Guides",
      subtitle:
        "Des repères simples pour choisir vos cordes et accessoires avec plus de justesse.",
    },
    list: {
      title: "Tous les guides",
      subtitle: "Des contenus courts, concrets, pensés pour aider à décider.",
      items: guideItems,
      emptyText: "Aucun guide publié pour le moment.",
    },
  };
}
