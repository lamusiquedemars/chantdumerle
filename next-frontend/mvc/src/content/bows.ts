import type { BowsContent } from "@/modules/catalog/types";

export function getBowsContent(locale: string): BowsContent {
  void locale;

  return {
    hero: {
      title: "Archets Le Merle",
      subtitle:
        "Un archet de fabrication maison, réglé à l’atelier pour offrir une réponse claire, une prise en main naturelle et un bon équilibre au quotidien.",
      backgroundImage: "/images/hero-accessoires.png",
    },
  };
}
