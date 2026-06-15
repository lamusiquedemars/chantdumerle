import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";

export type GuideAction = {
  label: string;
  href: string;
};

export type GuideArticleBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      type: "list";
      items: string[];
    };

export type GuideArticleContent =
  | {
      kind: "blocks";
      blocks: GuideArticleBlock[];
    }
  | {
      kind: "html";
      html: string;
    };

export type GuidesPageContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  list: {
    title: string;
    subtitle: string;
    items: GuideCardItem[];
    emptyText: string;
  };
};

export type GuideArticlePageContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  article: GuideArticleContent;
  cta: {
    title: string;
    text: string;
    actions: GuideAction[];
  };
};

export type ChooseStringsGuideContent = GuideArticlePageContent;
