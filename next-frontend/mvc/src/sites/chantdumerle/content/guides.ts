import type { GuideCardItem } from "@/modules/guides/components/GuideCard/GuideCard";
import type { CardGridItem } from "@/components/blocks/CardGrid/CardGrid";
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
      title: "Comment choisir ses cordes",
      href: localizedHref(locale, "/guides/comment-choisir-ses-cordes"),
      excerpt:
        "Les grands critères pour choisir sans se perdre : instrument, son recherché, niveau et usage.",
      category: "Choix",
    },
  ];
}

// Contenu de la page liste des guides, avec liens adaptes a la locale active.
export function getGuidesPageContent(locale: string): GuidesPageContent {
  const href = (path: string) => localizedHref(locale, path);

  const entryItems: CardGridItem[] = [
    {
      label: "Choisir ses cordes",
      href: href("/guides/comment-choisir-ses-cordes"),
      description: "Comprendre les grands critères avant de comparer les modèles.",
    },
  ];

  return {
    hero: {
      title: "Guides",
      subtitle:
        "Des repères simples pour choisir vos cordes et accessoires avec plus de justesse.",
    },
    intro: {
      title: "Choisir sans se perdre",
      text: "Le choix des cordes dépend de votre instrument, de votre niveau, de votre usage et du son que vous recherchez. Ces guides vous aident à avancer étape par étape, sans jargon inutile.",
    },
    entries: {
      title: "Commencer par le bon sujet",
      subtitle:
        "Une première entrée pour comprendre ce qui influence réellement votre choix.",
      items: entryItems,
    },
    list: {
      title: "Tous les guides",
      subtitle: "Des contenus courts, concrets, pensés pour aider à décider.",
      action: {
        label: "Voir les cordes",
        href: href("/cordes"),
      },
      items: getGuideItems(locale),
    },
    cta: {
      title: "Besoin d’un choix plus direct ?",
      text: "Vous pouvez aussi partir directement des sélections par instrument, par son recherché ou par niveau de jeu.",
      actions: [
        {
          label: "Voir les sélections",
          href: href("/selections"),
        },
        {
          label: "Voir les cordes violon",
          href: href("/cordes?instrument=violon"),
        },
      ] satisfies GuideAction[],
    },
  };
}

// L'article reste en data pour que la route guide garde seulement le rendu.
export function getChooseStringsGuideContent(
  locale: string
): ChooseStringsGuideContent {
  const href = (path: string) => localizedHref(locale, path);

  const article: GuideArticleBlock[] = [
    {
      type: "paragraph",
      text: "Choisir des cordes n’est pas seulement une question de marque ou de prix. Les cordes influencent directement la couleur du son, la réponse de l’instrument, le confort de jeu et la projection.",
    },
    {
      type: "paragraph",
      text: "Pourtant, il n’existe pas une “meilleure” corde universelle. Une corde très appréciée sur un violon peut devenir décevante sur un autre. Le bon choix dépend surtout d’un équilibre entre votre instrument, votre manière de jouer et le son que vous recherchez.",
    },
    {
      type: "heading",
      level: 2,
      text: "Commencer par écouter son violon",
    },
    {
      type: "paragraph",
      text: "Avant de regarder les références ou les gammes, il faut essayer de comprendre le caractère naturel de l’instrument.",
    },
    {
      type: "paragraph",
      text: "Certains violons sont naturellement brillants, directs ou très projectifs. D’autres sont plus ronds, plus sombres ou plus denses. Les cordes peuvent renforcer ces caractéristiques, ou au contraire les équilibrer.",
    },
    {
      type: "paragraph",
      text: "L’objectif n’est pas forcément de transformer complètement un violon, mais souvent de révéler ce qu’il fait déjà bien.",
    },
    {
      type: "heading",
      level: 2,
      text: "Le son recherché",
    },
    {
      type: "paragraph",
      text: "Beaucoup de choix de cordes tournent autour de trois grandes recherches sonores : chaleur, brillance ou équilibre.",
    },
    {
      type: "heading",
      level: 3,
      text: "Un son chaud",
    },
    {
      type: "paragraph",
      text: "Un son chaud donne une impression de rondeur, de densité et de douceur. Les aigus sont généralement moins agressifs et les graves plus présents.",
    },
    {
      type: "paragraph",
      text: "Ce type de recherche est fréquent sur des instruments très brillants, ou chez des musiciens qui privilégient la richesse du timbre.",
    },
    {
      type: "heading",
      level: 3,
      text: "Un son brillant",
    },
    {
      type: "paragraph",
      text: "Un son brillant apporte davantage de clarté, d’attaque et de projection. Le violon ressort plus facilement dans une salle ou dans un ensemble.",
    },
    {
      type: "paragraph",
      text: "Cela peut être utile pour réveiller un instrument un peu sombre ou gagner en présence dans le jeu orchestral et soliste.",
    },
    {
      type: "heading",
      level: 3,
      text: "Un son équilibré",
    },
    {
      type: "paragraph",
      text: "Beaucoup de musiciens recherchent finalement un équilibre : suffisamment de chaleur pour garder de la matière, mais assez de clarté pour conserver de la précision et de la projection.",
    },
    {
      type: "heading",
      level: 2,
      text: "Le niveau et l’usage comptent aussi",
    },
    {
      type: "paragraph",
      text: "Un étudiant ne recherche pas toujours les mêmes qualités qu’un musicien avancé ou un professionnel.",
    },
    {
      type: "paragraph",
      text: "Certaines cordes privilégient avant tout la stabilité, la facilité d’émission et la durée de vie. D’autres cherchent davantage de nuances, de rapidité de réponse ou de complexité sonore.",
    },
    {
      type: "paragraph",
      text: "Le contexte de jeu compte également : travail quotidien, orchestre, musique de chambre, scène amplifiée ou jeu soliste ne demandent pas toujours les mêmes équilibres.",
    },
    {
      type: "heading",
      level: 2,
      text: "Éviter les choix trop radicaux",
    },
    {
      type: "paragraph",
      text: "Changer complètement la personnalité d’un instrument par les cordes fonctionne rarement. Les meilleurs résultats viennent souvent d’ajustements progressifs et cohérents.",
    },
    {
      type: "paragraph",
      text: "Il est aussi fréquent de mélanger plusieurs références : par exemple une corde de mi plus brillante avec un reste de jeu plus chaleureux, ou inversement.",
    },
    {
      type: "heading",
      level: 2,
      text: "Choisir plus simplement",
    },
    {
      type: "paragraph",
      text: "Pour simplifier le choix, le plus utile est souvent de partir de quelques questions simples :",
    },
    {
      type: "list",
      items: [
        "Mon violon manque-t-il de chaleur ou de clarté ?",
        "Est-ce que je cherche davantage de projection ou de confort ?",
        "Quel est mon niveau et mon usage principal ?",
        "Est-ce que je veux corriger un problème ou affiner une couleur ?",
      ],
    },
    {
      type: "paragraph",
      text: "À partir de là, il devient beaucoup plus facile de s’orienter vers une famille de cordes cohérente.",
    },
  ];

  return {
    hero: {
      title: "Comment choisir ses cordes ?",
      subtitle: "Comprendre les grands équilibres avant de comparer les modèles.",
    },
    article,
    cta: {
      title: "Aller plus loin",
      text: "Vous pouvez ensuite explorer les guides par profil sonore, type de violon, niveau de jeu ou budget pour affiner votre choix plus précisément.",
      actions: [
        {
          label: "Voir les cordes violon",
          href: href("/cordes?instrument=violon"),
        },
        {
          label: "Explorer les sélections",
          href: href("/selections"),
        },
      ] satisfies GuideAction[],
    },
  };
}
