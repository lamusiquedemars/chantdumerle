import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { GuidesPageContent } from "@/modules/guides/types";

export function getGuidesPageContent(
  guideItems: GuideCardItem[]
): GuidesPageContent {
  return {
    hero: {
      title: "Guides",
      subtitle:
        "Quelques repères simples pour vous aider à choisir vos cordes et accessoires.",
    },
    list: {
      title: "Tous les guides",
      subtitle: "Comment savoir quelle corde est adaptée à mon instrument ? comment définir le "+
      "caractère de mon instrument ? Avec nos guides, nous essayons de répondre à ces questions, et "+
      "tant d'autres qui pourraient arriver.",
      items: guideItems,
      emptyText: "Aucun guide publié pour le moment.",
    },
  };
}
