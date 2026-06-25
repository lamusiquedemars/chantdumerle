import type { EntryGridItem } from "@/components/blocks/EntryGrid/EntryGrid";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";

export type ContentAction = {
  label: string;
  href: string;
};

type CatalogPageContent = {
  hero: {
    title: string;
    subtitle: string;
    actions: ContentAction[];
    backgroundImage?: string;
  };
  products: {
    title: string;
    subtitle: string;
  };
  instruments: {
    title: string;
    subtitle: string;
    items: EntryGridItem[];
  };
  selections: {
    title: string;
    subtitle: string;
    items: EntryGridItem[];
  };
  editorial: {
    title: string;
    text: string;
  };
  guides: {
    title: string;
    subtitle: string;
    items: GuideCardItem[];
  };
  filterIntros?: {
    instrument?: Record<string, SelectionEntryContent>;
    sound?: Record<string, SelectionEntryContent>;
    usage?: Record<string, SelectionEntryContent>;
  };
};

export type CatalogContent = CatalogPageContent;
export type StringsContent = CatalogPageContent;
export type ProductList = ProductCardItem[];

export type AccessoriesContent = {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
  };
  products: {
    title: string;
    subtitle: string;
  };
  categories: {
    title: string;
    subtitle: string;
    items: EntryGridItem[];
  };
  guides: {
    title: string;
    subtitle: string;
    items: GuideCardItem[];
  };
};

export type FilterIntroContent = {
  title: string;
  paragraphs: string[];
  action?: ContentAction;
};

export type SelectionEntryContent = FilterIntroContent & {
  heroTitle: string;
  heroSubtitle?: string;
};

export type SelectionEntryKind = "instrument" | "sound" | "usage";
