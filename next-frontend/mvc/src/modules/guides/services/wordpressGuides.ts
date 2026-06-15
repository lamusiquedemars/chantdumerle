import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { GuideArticlePageContent, GuideAction } from "@/modules/guides/types";
import { fetchGraphQL, hasWordPressEndpoint } from "@/lib/wordpress/client";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";

type GraphQLGuideNode = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  guideSubtitle?: string | null;
  guideCardLabel?: string | null;
  guideCtaTitle?: string | null;
  guideCtaText?: string | null;
  guideCtaPrimaryLabel?: string | null;
  guideCtaPrimaryUrl?: string | null;
  guideCtaSecondaryLabel?: string | null;
  guideCtaSecondaryUrl?: string | null;
};

type GuidesResponse = {
  guides: {
    nodes: GraphQLGuideNode[];
  };
};

type GuideResponse = {
  guide?: GraphQLGuideNode | null;
};

const GUIDE_FIELDS = `
  title
  slug
  excerpt
  content
  guideSubtitle
  guideCardLabel
  guideCtaTitle
  guideCtaText
  guideCtaPrimaryLabel
  guideCtaPrimaryUrl
  guideCtaSecondaryLabel
  guideCtaSecondaryUrl
`;

function normalizeText(value?: string | null): string {
  return value ? htmlToPlainText(value)?.trim() ?? "" : "";
}

function localizeEditableHref(locale: string, href?: string | null): string | null {
  if (!href) {
    return null;
  }

  if (/^(https?:|mailto:|tel:|#)/.test(href)) {
    return href;
  }

  return localizedHref(locale, href);
}

function makeGuideActions(locale: string, guide: GraphQLGuideNode): GuideAction[] {
  const actions: GuideAction[] = [];
  const primaryHref = localizeEditableHref(locale, guide.guideCtaPrimaryUrl);
  const secondaryHref = localizeEditableHref(locale, guide.guideCtaSecondaryUrl);

  if (guide.guideCtaPrimaryLabel && primaryHref) {
    actions.push({
      label: guide.guideCtaPrimaryLabel,
      href: primaryHref,
    });
  }

  if (guide.guideCtaSecondaryLabel && secondaryHref) {
    actions.push({
      label: guide.guideCtaSecondaryLabel,
      href: secondaryHref,
    });
  }

  return actions;
}

function mapGuideToCard(locale: string, guide: GraphQLGuideNode): GuideCardItem {
  return {
    title: normalizeText(guide.title),
    href: localizedHref(locale, `/guides/${guide.slug}`),
    excerpt: normalizeText(guide.excerpt),
    category: guide.guideCardLabel ?? undefined,
  };
}

function mapGuideToPage(
  locale: string,
  guide: GraphQLGuideNode
): GuideArticlePageContent {
  return {
    hero: {
      title: normalizeText(guide.title),
      subtitle:
        guide.guideSubtitle ||
        normalizeText(guide.excerpt) ||
        "Un guide pour avancer avec plus de repères.",
    },
    article: {
      kind: "html",
      html: guide.content ?? "",
    },
    cta: {
      title: guide.guideCtaTitle ?? "Aller plus loin",
      text:
        guide.guideCtaText ??
        "Explorez les cordes et les selections pour affiner votre choix.",
      actions: makeGuideActions(locale, guide),
    },
  };
}

export async function getGuideCards(locale: string, first = 30): Promise<GuideCardItem[]> {
  if (!hasWordPressEndpoint) {
    return [];
  }

  try {
    const data = (await fetchGraphQL(
      `
        query GetGuides($first: Int = 30) {
          guides(first: $first, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
            nodes {
              ${GUIDE_FIELDS}
            }
          }
        }
      `,
      { first }
    )) as GuidesResponse;

    const guideCards = data.guides.nodes.map((guide) =>
      mapGuideToCard(locale, guide)
    );

    return guideCards;
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
    const data = (await fetchGraphQL(
      `
        query GetGuideBySlug($slug: ID!) {
          guide(id: $slug, idType: SLUG) {
            ${GUIDE_FIELDS}
          }
        }
      `,
      { slug }
    )) as GuideResponse;

    if (!data.guide) {
      return null;
    }

    return mapGuideToPage(locale, data.guide);
  } catch (error) {
    console.error(`Unable to load WordPress guide "${slug}":`, error);
    return null;
  }
}
