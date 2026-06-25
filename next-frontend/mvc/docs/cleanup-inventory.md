# Inventaire Nettoyage Sans Risque

Date: 2026-06-18

Objectif: preparer le nettoyage du repo actuel sans perdre ce qui peut servir
au futur starter.

Regle: une chose peut etre inutile pour Chant du Merle mais utile pour le
starter. Dans ce cas, on ne la supprime pas aveuglement: on la marque comme
`A sortir vers starter`.

## Statuts

- `Supprimer`: inutile pour CDM et inutile pour le starter.
- `Garder CDM`: utile au site Chant du Merle.
- `A sortir vers starter`: inutile ou encombrant pour CDM, mais utile comme
  base starter.
- `A confirmer`: decision a prendre avant action.

## Candidats Verifies

| Element | Usage actuel | Sort CDM | Sort starter | Decision |
| --- | --- | --- | --- | --- |
| `src/components/product/*` dossiers vides | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; les vrais composants produits sont dans `src/modules/catalog/components`. |
| `src/components/guide/*` dossiers vides | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; les vrais composants guides sont dans `src/modules/guides/components`. |
| `src/components/selection/*` dossiers vides | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; les vrais composants selections sont dans `src/modules/selections/components`. |
| `src/data` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; pas de dossier data vide dans CDM. |
| `src/messages` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; pas d'i18n messages active. |
| `src/lib/i18n/catalog` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; ancienne intention i18n. |
| `src/lib/i18n/common` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; ancienne intention i18n. |
| `src/lib/i18n/navigation` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; ancienne intention i18n. |
| `src/lib/i18n/pages/*` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; ancienne intention i18n. |
| `src/lib/mappers` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; a recreer seulement avec de vrais mappers. |
| `src/lib/utils` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; evite un dossier fourre-tout. |
| `src/modules/guides/content` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; le contenu guides vient de WordPress ou `src/content/guides.ts`. |
| `src/modules/selections/content` vide | Aucun fichier dedans | Supprime | Non | Supprime le 2026-06-18; le contenu selections vit dans `src/content`. |
| `public/file.svg` | Aucune reference trouvee | Supprime | Non | Asset Next par defaut, supprime le 2026-06-18. |
| `public/globe.svg` | Aucune reference trouvee | Supprime | Non | Asset Next par defaut, supprime le 2026-06-18. |
| `public/next.svg` | Aucune reference trouvee | Supprime | Non | Asset Next par defaut, supprime le 2026-06-18. |
| `public/vercel.svg` | Aucune reference trouvee | Supprime | Non | Asset Next par defaut, supprime le 2026-06-18. |
| `public/window.svg` | Aucune reference trouvee | Supprime | Non | Asset Next par defaut, supprime le 2026-06-18. |
| `public/images/brand/.DS_Store` | Fichier systeme macOS | Supprime | Non | Bruit pur, supprime le 2026-06-18. |
| `src/app/[locale]/catalogue/page.tsx` | Route demo branchee a `sites/example` | Supprime | Ajoute au starter | Sorti du repo CDM le 2026-06-18; route neutre `/catalogue` creee dans le starter. |
| `src/modules/catalog/components/CatalogPageView/*` | Vue de la route demo catalogue | Supprime | Remplace par vue starter | Supprime du repo CDM le 2026-06-18; `CatalogPageView` neutre existe dans le starter. |
| `src/sites/example/**` | Exemple/moule reference par README et route demo | Supprime | Remplace par contenu starter | Supprime du repo CDM le 2026-06-18; le starter contient `src/content/catalog.ts`. |
| `src/modules/catalog/content/exampleProducts.ts` | Fallback si pas de backend WP GraphQL | Supprime | Remplace par exemple starter | Supprime du repo CDM le 2026-06-18; CDM retourne vide si Woo/WordPress n'est pas configure. |
| `src/components/ui/Button/*` | Composant UI generique | Garder tant que CDM l'utilise | Copie starter faite | Ajoute au starter le 2026-06-18, avec tokens neutres. |
| `src/components/ui/Badge/*` | Composant UI generique | Garder tant que CDM l'utilise | Copie starter faite | Ajoute au starter le 2026-06-18, sans dependance CDM/Woo. |
| `src/components/ui/Card/*` | Composant UI generique | Garder tant que CDM l'utilise | Copie starter faite | Ajoute au starter le 2026-06-18, comme surface neutre. |
| `src/components/ui/Breadcrumbs/*` | Composant UI generique | Garder tant que CDM l'utilise | Copie starter faite | Ajoute au starter le 2026-06-18; libelle ARIA a garder localisable plus tard si besoin. |
| `src/components/blocks/PageHeader/*` | Bloc de page generique | Garder tant que CDM l'utilise | Copie starter faite | Ajoute au starter le 2026-06-18, comme header de page interne. |

## Actions Sans Risque Proposees

Ces actions semblent inutiles dans les deux cibles:

1. supprimer les SVG Next par defaut non references;
2. supprimer `.DS_Store`;
3. supprimer les dossiers vides qui ne sont pas volontairement gardes comme
   structure starter.

## Actions Deja Decidees

Ces elements ont ete sortis de Chant du Merle le 2026-06-18:

- `src/sites/example/**`;
- `src/app/[locale]/catalogue/page.tsx`;
- `src/modules/catalog/components/CatalogPageView/*`;
- `src/modules/catalog/content/exampleProducts.ts`.

Raison: ils encombraient CDM, mais leur idee reste utile dans le starter. Le
starter contient maintenant une route `/catalogue` neutre et documentee.
