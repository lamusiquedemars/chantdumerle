import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { GuideArticlePageContent, GuideAction } from "@/modules/guides/types";
import type { GraphQLGuideNode } from "./guideQueries";

function normalizeText(value?: string | null): string {
  return value ? htmlToPlainText(value)?.trim() ?? "" : "";
}

function localizeEditableHref(locale: string, href?: string | null): string | null {
  if (!href) {
    return null;
  }

  // Editors can enter absolute URLs, anchors or local paths in WordPress.
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

export function mapGuideToCard(
  locale: string,
  guide: GraphQLGuideNode
): GuideCardItem {
  return {
    title: normalizeText(guide.title),
    href: localizedHref(locale, `/guides/${guide.slug}`),
    excerpt: normalizeText(guide.excerpt),
    category: guide.guideCardLabel ?? undefined,
  };
}

export function mapGuideToPage(
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
