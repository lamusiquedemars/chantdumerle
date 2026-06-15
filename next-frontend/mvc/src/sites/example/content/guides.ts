import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type {
  ChooseStringsGuideContent,
  GuideAction,
  GuideArticleBlock,
  GuidesPageContent,
} from "@/modules/guides/types";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";

export function getGuideItems(locale: string): GuideCardItem[] {
  return [
    {
      title: "Premier guide",
      href: localizedHref(locale, "/guides/premier-guide"),
      excerpt: "Un exemple de guide pour présenter la structure éditoriale.",
      category: "Exemple",
    },
  ];
}

// Contenu de la page liste des guides, avec liens adaptes a la locale active.
export function getGuidesPageContent(locale: string): GuidesPageContent {
  return {
    hero: {
      title: "Guides",
      subtitle:
        "Des repères simples pour accompagner une offre, un catalogue ou une méthode.",
    },
    list: {
      title: "Tous les guides",
      subtitle: "Des contenus courts, concrets, pensés pour aider à décider.",
      items: getGuideItems(locale),
      emptyText: "Aucun guide publié pour le moment.",
    },
  };
}

// L'article reste en data pour que la route guide garde seulement le rendu.
export function getFirstGuideContent(
  locale: string
): ChooseStringsGuideContent {
  const href = (path: string) => localizedHref(locale, path);

  const article: GuideArticleBlock[] = [
    {
      type: "paragraph",
      text: "Ce guide montre comment organiser un article éditorial simple dans le starter. Le contenu vient du dossier site, tandis que le rendu reste dans le module guides.",
    },
    {
      type: "paragraph",
      text: "La route Next récupère seulement la locale et le contenu. La vue reçoit ensuite des blocs typés pour afficher paragraphes, titres et listes.",
    },
    {
      type: "heading",
      level: 2,
      text: "Commencer par le besoin",
    },
    {
      type: "paragraph",
      text: "Un bon contenu commence par le besoin utilisateur : comprendre, comparer, choisir, réserver ou acheter.",
    },
    {
      type: "paragraph",
      text: "Le starter garde ces textes hors des composants pour pouvoir les remplacer rapidement selon le client.",
    },
    {
      type: "paragraph",
      text: "Cette séparation évite que les routes deviennent des pages difficiles à maintenir.",
    },
    {
      type: "heading",
      level: 2,
      text: "Composer avec des blocs",
    },
    {
      type: "paragraph",
      text: "Les blocs éditoriaux restent volontairement simples pour couvrir la majorité des pages de conseil.",
    },
    {
      type: "heading",
      level: 3,
      text: "Titre de section",
    },
    {
      type: "paragraph",
      text: "Un bloc heading sert à rythmer l'article.",
    },
    {
      type: "paragraph",
      text: "Un bloc paragraph porte le texte courant.",
    },
    {
      type: "heading",
      level: 3,
      text: "Liste utile",
    },
    {
      type: "paragraph",
      text: "Un bloc list permet de résumer des étapes ou critères.",
    },
    {
      type: "paragraph",
      text: "Ces structures peuvent ensuite être branchées sur un CMS.",
    },
    {
      type: "heading",
      level: 3,
      text: "Brancher un CMS plus tard",
    },
    {
      type: "paragraph",
      text: "Le contenu local sert de base de démonstration. Un adaptateur headless peut ensuite fournir le même contrat de données.",
    },
    {
      type: "heading",
      level: 2,
      text: "À personnaliser",
    },
    {
      type: "paragraph",
      text: "Remplacez ce fichier par le contenu du client, sans modifier les composants du module guides.",
    },
    {
      type: "paragraph",
      text: "Le modèle tient si les contrats restent stables.",
    },
    {
      type: "paragraph",
      text: "C'est le principe clé du mini MVC frontend.",
    },
    {
      type: "heading",
      level: 2,
      text: "Garder le socle léger",
    },
    {
      type: "paragraph",
      text: "Ne chargez que les modules nécessaires au site client.",
    },
    {
      type: "paragraph",
      text: "Un site vitrine peut ignorer commerce, catalogue avancé ou panier.",
    },
    {
      type: "heading",
      level: 2,
      text: "Checklist de départ",
    },
    {
      type: "paragraph",
      text: "Pour adapter le starter, commencez par ces points :",
    },
    {
      type: "list",
      items: [
        "remplacer la configuration du site",
        "remplacer les contenus locaux",
        "garder les routes fines",
        "brancher un adaptateur seulement si le projet en a besoin",
      ],
    },
    {
      type: "paragraph",
      text: "Le starter reste alors rapide à décliner.",
    },
  ];

  return {
    hero: {
      title: "Premier guide",
      subtitle: "Un exemple d'article modulaire pour le starter.",
    },
    article: {
      kind: "blocks",
      blocks: article,
    },
    cta: {
      title: "Aller plus loin",
      text: "Vous pouvez maintenant adapter cet article, ou le remplacer par une source headless.",
      actions: [
        {
          label: "Voir le catalogue",
          href: href("/catalogue"),
        },
        {
          label: "Explorer les sélections",
          href: href("/selections"),
        },
      ] satisfies GuideAction[],
    },
  };
}
