# Headless MVC Front

Front Next.js du site Chant du Merle, avec une lecture MVC legere : routes
fines, modules reutilisables, configuration client separee et donnees
WordPress/WooCommerce.

`chantdumerle` est le client actif. Le moule neutre vit maintenant dans le repo
frere `../maracuja-next-starter`.

Le site a besoin du backend WordPress/WooCommerce pour afficher les produits.
En mode commerce, Next garde les pages de decouverte et WooCommerce possede le
panier, la commande et l'espace client.

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
| `/panier/` | panier WooCommerce proxifie sous le domaine du front |
| `/commande/` | commande WooCommerce |
| `/mon-compte/` | espace client WooCommerce |
| `/wp-json/cdm/v1/cart/add` | ajout AJAX dans le vrai panier Woo |

## Structure

```txt
src/
  app/          routes Next et handlers API
  components/   layout, UI et blocs generiques
  config/       point d'entree technique de la configuration active
  content/      textes, navigation et contenus locaux Chant du Merle
  lib/          helpers et adaptateurs partages
  modules/      domaines reutilisables
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

Ne pas partir de ce repo client. Utiliser le starter neutre :

```bash
git clone https://github.com/lamusiquedemars/maracuja-next-starter.git
cd maracuja-next-starter
npm install
```

Ce repo Chant du Merle doit rester specifique au site CDM : contenu client,
integrations WordPress/WooCommerce, pages cordes/accessoires/selections et
outillage de migration.

## Variables D'Environnement

| Variable | Requise | Usage |
| --- | --- | --- |
| `WP_GRAPHQL_URL` | oui pour les produits | endpoint GraphQL pour les adaptateurs WordPress/WooGraphQL |
| `NEXT_PUBLIC_WP_URL` | non | URL publique WordPress pour les images et appels Woo |
| `WOO_BASE_URL` | non | URL Woo utilisee par les appels serveur |
| `WOO_PROXY_TARGET` | non | cible du proxy same-origin pour les routes Woo transactionnelles |

Sans `WP_GRAPHQL_URL`, les listes produits retournent vide. Les donnees exemple
vivent dans le starter, pas dans le repo Chant du Merle.

Le panier n'est jamais stocke dans Next. Le bouton d'ajout appelle le MU-plugin
Woo `/wp-json/cdm/v1/cart/add`, puis Woo conserve la session utilisee par
`/panier/`, `/commande/` et `/mon-compte/`. Voir
`docs/commerce-architecture.md`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Adapter Chant Du Merle

Garder les routes fines dans `src/app`, les textes locaux dans le contenu CDM et
les donnees produits/guides dans WordPress/WooCommerce.
