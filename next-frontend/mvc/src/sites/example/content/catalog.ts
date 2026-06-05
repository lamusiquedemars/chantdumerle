import type { EntryGridItem } from "@/components/blocks/EntryGrid/EntryGrid";
import type { CatalogContent } from "@/modules/catalog/types";
import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { SelectionCardItem } from "@/modules/selections/components/SelectionCard/SelectionCard";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";

type ContentAction = {
  label: string;
  href: string;
};

// Contenu exemple de l'univers catalogue.
export function getCatalogContent(locale: string): CatalogContent {
  const href = (path: string) => localizedHref(locale, path);

  const instrumentItems: EntryGridItem[] = [
    {
      label: "Produit exemple",
      href: href("/catalogue?type=product"),
      description: "Une fiche produit locale, utile pour tester le module.",
    },
    {
      label: "Service exemple",
      href: href("/catalogue?type=service"),
      description: "Un item de catalogue adaptable à une offre de service.",
    },
    {
      label: "Contenu exemple",
      href: href("/guides"),
      description: "Une entrée vers les contenus éditoriaux du starter.",
    },
  ];

  const selectionItems: SelectionCardItem[] = [
    {
      title: "Découverte",
      href: href("/selections"),
      description: "Une sélection courte pour mettre en avant un premier choix.",
    },
    {
      title: "Comparaison",
      href: href("/selections"),
      description: "Un angle éditorial pour aider l'utilisateur à comparer.",
    },
    {
      title: "Conseil",
      href: href("/selections"),
      description: "Une sélection orientée besoin ou contexte d'usage.",
    },
    {
      title: "Avancé",
      href: href("/selections"),
      description: "Une proposition plus complète pour les cas complexes.",
    },
  ];

  const guideItems: GuideCardItem[] = [
    {
      title: "Premier guide",
      href: href("/guides/premier-guide"),
      excerpt: "Un guide exemple pour structurer un contenu éditorial.",
    },
  ];

  const heroActions: ContentAction[] = [
    {
      label: "Produit",
      href: href("/catalogue?type=product"),
    },
    {
      label: "Service",
      href: href("/catalogue?type=service"),
    },
    {
      label: "Contenu",
      href: href("/guides"),
    },
  ];

  return {
    hero: {
      title: "Catalogue exemple",
      subtitle: "Une page catalogue prête à connecter à une source headless.",
      actions: heroActions,
    },
    products: {
      title: "Produits exemple",
      subtitle: "Le module utilise des données locales si aucun backend n'est configuré.",
    },
    instruments: {
      title: "Choisir par entrée",
      subtitle: "Adaptez ces cartes aux catégories du prochain client.",
      items: instrumentItems,
    },
    selections: {
      title: "Choisir selon un besoin",
      subtitle: "Les sélections servent à éditorialiser le catalogue.",
      items: selectionItems,
    },
    editorial: {
      title: "Une page volontairement simple",
      text: "Le starter montre la séparation entre contenu, vue et données. Remplacez ces textes par le vocabulaire du prochain client.",
    },
    guides: {
      title: "Guides utiles",
      subtitle: "Ajoutez des contenus courts pour accompagner le catalogue.",
      items: guideItems,
    },
  };
}
