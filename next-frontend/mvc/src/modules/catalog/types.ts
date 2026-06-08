import type { EntryGridItem } from "@/components/blocks/EntryGrid/EntryGrid";
import type { ProductCardItem } from "@/modules/catalog/components/ProductCard/ProductCard";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { SelectionCardItem } from "@/modules/selections/components/SelectionCard/SelectionCard";

export type ContentAction = {
  label: string;
  href: string;
};

type CatalogPageContent = {
  hero: {
    title: string;
    subtitle: string;
    actions: ContentAction[];
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
    items: SelectionCardItem[];
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
};

export type CatalogContent = CatalogPageContent;
export type StringsContent = CatalogPageContent;
export type ProductList = ProductCardItem[];
