# Headless MVC Front

Front Next.js modulaire avec une lecture MVC legere : routes fines, modules
reutilisables, configuration client separee et donnees locales exemple.

`chantdumerle` est le client actif. `example` reste disponible comme contenu
neutre pour verifier que le moule n'est pas lie a un seul site.

Le projet peut tourner sans backend. Si `WP_GRAPHQL_URL` est renseigne,
les adaptateurs WordPress/WooGraphQL prennent le relais pour le catalogue et le
panier.

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
| `/[locale]` | home Chant du Merle |
| `/[locale]/cordes` | univers catalogue des cordes |
| `/[locale]/produits/[slug]` | fiche produit generique |
| `/[locale]/guides` | liste de guides |
| `/[locale]/guides/[slug]` | guide detaille depuis WordPress |
| `/[locale]/selections` | page de selections |
| `/api/cart/add` | ajout panier WooCommerce optionnel |

La route demo `/[locale]/catalogue` reste disponible pour le contenu `example`.

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

## Creer Un Nouveau Site

Depuis un nouveau dossier de projet, copier le moule :

```bash
cp -R /chemin/vers/chantdumerle/next-frontend/mvc ./frontend
cd frontend
npm install
cp .env.example .env.local
```

Puis adapter le client :

1. Renommer le package dans `package.json`.
2. Creer `src/sites/<client>`.
3. Copier `src/sites/example` comme base neutre, ou `src/sites/chantdumerle`
   si le nouveau site ressemble a Chant du Merle.
4. Modifier `src/config/site.ts` pour importer la configuration du nouveau
   client.
5. Adapter les contenus dans `src/sites/<client>/content`.
6. Ajouter les images dans `public`.
7. Lancer `npm run lint` puis `npm run build`.

Pour un site sans backend, laisser `WP_GRAPHQL_URL` vide. Le catalogue utilisera
les donnees exemple locales.

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

Voir la section "Creer Un Nouveau Site". Garder les routes fines dans
`src/app` et brancher un backend seulement si le projet en a besoin.
