import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { GuideArticlePageContent } from "@/modules/guides/types";
import { hasWordPressEndpoint } from "@/lib/wordpress/client";
import { mapGuideToCard, mapGuideToPage } from "./guideMappers";
import { fetchGuideNodeBySlug, fetchGuideNodes } from "./guideQueries";

export async function getGuideCards(locale: string, first = 30): Promise<GuideCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const guides = await fetchGuideNodes(first);
    return guides.map((guide) => mapGuideToCard(locale, guide));
  } catch (error) {
    console.error("Unable to load WordPress guides:", error);
    return [];
  }
}

export async function getGuidePageBySlug(
  locale: string,
  slug: string
): Promise<GuideArticlePageContent | null> {
  if (!hasWordPressEndpoint) {
    return null;
  }

  try {
    const guide = await fetchGuideNodeBySlug(slug);

    if (!guide) {
      return null;
    }

    return mapGuideToPage(locale, guide);
  } catch (error) {
    console.error(`Unable to load WordPress guide "${slug}":`, error);
    return null;
  }
}
