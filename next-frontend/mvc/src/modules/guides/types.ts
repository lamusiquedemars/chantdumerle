import type { CardGridItem } from "@/components/blocks/CardGrid/CardGrid";
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

export type GuidesPageContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  intro: {
    title: string;
    text: string;
  };
  entries: {
    title: string;
    subtitle: string;
    items: CardGridItem[];
  };
  list: {
    title: string;
    subtitle: string;
    action: GuideAction;
    items: GuideCardItem[];
  };
  cta: {
    title: string;
    text: string;
    actions: GuideAction[];
  };
};

export type ChooseStringsGuideContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  article: GuideArticleBlock[];
  cta: {
    title: string;
    text: string;
    actions: GuideAction[];
  };
};
