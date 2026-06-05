# Headless MVC Starter

Starter Next.js modulaire avec une lecture MVC legere : routes fines, modules
reutilisables, configuration client separee et donnees locales exemple.

Le projet peut tourner sans backend. Si `WP_GRAPHQL_URL` est renseigne, les
adaptateurs WordPress/WooGraphQL peuvent prendre le relais pour le catalogue et
le panier.

## Lecture MVC

| Role | Emplacement | Responsabilite |
| --- | --- | --- |
| Controller | `src/app` | routes, composition des pages et handlers API |
| View | `src/components`, `src/modules/*/components` | rendu, layout, UI et vues de module |
| Model | `src/types`, `src/lib`, `src/modules/*/services` | contrats, adaptateurs et acces donnees |

## Routes

| Route | Usage |
| --- | --- |
| `/` | redirection vers la locale par defaut |
| `/[locale]` | home exemple |
| `/[locale]/catalogue` | univers catalogue |
| `/[locale]/produits/[slug]` | fiche produit generique |
| `/[locale]/guides` | liste de guides |
| `/[locale]/guides/premier-guide` | guide detaille exemple |
| `/[locale]/selections` | page de selections |
| `/api/cart/add` | ajout panier WooCommerce optionnel |

## Structure

```txt
src/
  app/          routes Next et handlers API
  components/   layout, UI et blocs generiques
  config/       point d'entree de la configuration active
  lib/          helpers et adaptateurs partages
  modules/      domaines reutilisables
  sites/        configuration et contenus du site actif
  styles/       styles partages
  types/        contrats de donnees
```

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables D'Environnement

| Variable | Requise | Usage |
| --- | --- | --- |
| `WP_GRAPHQL_URL` | non | endpoint GraphQL pour les adaptateurs WordPress/WooGraphQL |

Sans `WP_GRAPHQL_URL`, le catalogue utilise `src/modules/catalog/content/exampleProducts.ts`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Adapter A Un Client

1. Remplacer `src/sites/example/config/site.ts`.
2. Remplacer les contenus dans `src/sites/example/content`.
3. Garder les routes fines dans `src/app`.
4. Brancher un backend seulement si le projet en a besoin.
