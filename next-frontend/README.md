# Next Frontend Headless MVC

`next-frontend` est le frontend Next.js headless utilise pour faire emerger un
modele reutilisable de mini MVC frontend.

Le projet reste pour l'instant un cas client Chant du Merle. Le but n'est pas
de le transformer directement en starter neutre, mais de stabiliser ses
conventions avant d'extraire un dossier `mvc` modulaire.

## Etat Du Projet

- App Router Next.js avec un segment de locale dans `src/app/[locale]`.
- Contenus editoriaux et donnees client progressivement ranges dans
  `src/sites/chantdumerle`.
- Catalogue produit branche sur WordPress/WooGraphQL quand l'endpoint existe,
  avec un jeu de donnees local minimal sinon.
- Ajout panier branche sur WooCommerce quand `WP_GRAPHQL_URL` est configure.
- Plan d'extraction documente dans `MVC_HEADLESS_PLAN.md`.

## Lecture MVC

La lecture MVC reste legere et adaptee a Next.js :

| Role | Emplacement actuel | Responsabilite |
| --- | --- | --- |
| Controller | `src/app` | routes, composition des pages et handlers API |
| View | `src/components`, `src/styles` | rendu, blocs, layout et UI |
| Model | `src/types`, `src/lib`, adaptateurs headless | contrats, acces donnees et mapping |

Les fichiers `page.tsx` exposent les routes. Ils doivent orchestrer les
composants et les donnees sans devenir le seul endroit ou vivent les contenus,
les requetes et les regles metier.

## Routes Actives

La premiere passe de nettoyage garde uniquement les routes implementees :

| Route | Usage |
| --- | --- |
| `/` | redirection provisoire vers `/fr` |
| `/[locale]` | home client |
| `/[locale]/cordes` | univers catalogue des cordes |
| `/[locale]/produits/[slug]` | fiche produit generique |
| `/[locale]/guides` | liste de guides |
| `/[locale]/guides/comment-choisir-ses-cordes` | guide detaille |
| `/[locale]/selections` | page de selections |
| `/api/cart/add` | ajout panier WooCommerce via le module commerce |

Les pages d'univers gardent des slugs metier comme `cordes`. Les fiches produit
passent par la route generique `produits/[slug]` afin de rester utilisables
pour des cordes, accessoires ou instruments.

## Structure

```txt
src/
  app/          routes Next et handlers API
  components/   layout, UI, blocs et composants metier
  config/       configuration client extraite progressivement
  lib/          helpers, routing i18n, mappers et adaptateurs WordPress
  modules/      premiers domaines extraits derriere les routes app
  sites/        configuration et contenus propres au client actif
  styles/       styles partages
  types/        contrats de donnees
```

`src/config/site.ts` centralise deja la marque, la locale par defaut, la
navigation et les liens de footer via `src/sites/chantdumerle/config`. Le
contenu home client vit dans `src/sites/chantdumerle/content`. Les domaines
guides et selections ont deja leurs composants,
contenus et services dans `src/modules`. Le module catalogue regroupe aussi
ses composants, son contenu, son service produit WordPress et ses helpers i18n.
Le module commerce porte la logique d'ajout panier WooGraphQL derriere la route
API Next.js, ainsi que le bouton client d'ajout panier. La fiche produit
generique et l'univers cordes sont rendus par le module catalogue. La home
utilise une vue extraite dans le module `pages`. Les pages guides deleguent
leur rendu au module `guides`.

Les pages sous `[locale]` construisent leurs liens internes avec
`src/lib/i18n/routing/localizedHref.ts` pour garder les chemins metier separes
du prefixe de langue.

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Puis ouvrir le serveur local affiche par Next.js.

## Variables D'Environnement

Le socle frontend n'a pas encore de variable publique obligatoire. Le catalogue
peut afficher des produits exemple sans backend. Pour brancher WordPress,
renseigner :

| Variable | Requise maintenant | Usage |
| --- | --- | --- |
| `WP_GRAPHQL_URL` | non pour le catalogue exemple, oui pour WooCommerce | endpoint GraphQL lu par le catalogue WordPress et le handler panier |

Les variables prefixees `NEXT_PUBLIC_` sont exposees au navigateur par Next.js.
N'en ajouter que lorsqu'une fonctionnalite client en a reellement besoin.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

`npm run lint` et `npm run build` servent de validation avant une extraction
vers `mvc`.

## Suite

Le dossier `mvc` contient maintenant un starter neutre, autonome et validable
sans endpoint WordPress. La suite consiste a l'utiliser sur un premier nouveau
cas client, puis a reinjecter les ajustements utiles dans le modele.
