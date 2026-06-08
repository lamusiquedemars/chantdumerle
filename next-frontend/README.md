# Next Frontend MVC

`next-frontend/mvc` est le front officiel et le moule MVC actif.

La cible n'est plus d'avoir un starter theorique a cote du vrai site. Chant du
Merle est le premier client reel du moule, branche dans
`mvc/src/sites/chantdumerle`.

## Front Actif

Les commandes du workspace racine pointent vers `next-frontend/mvc` :

```bash
npm run dev
npm run lint
npm run build
npm run start
```

La procedure pour creer un nouveau site depuis le moule est dans
`mvc/README.md`.

## Lecture MVC

La lecture MVC reste legere et adaptee a Next.js :

| Role | Emplacement actif | Responsabilite |
| --- | --- | --- |
| Controller | `mvc/src/app` | routes, composition des pages et handlers API |
| View | `mvc/src/components`, `mvc/src/modules/*/components` | rendu, layout, UI et vues de module |
| Model | `mvc/src/types`, `mvc/src/lib`, `mvc/src/modules/*/services` | contrats, adaptateurs et acces donnees |

`mvc/src/config/site.ts` choisit la configuration client active. Aujourd'hui,
elle pointe vers `mvc/src/sites/chantdumerle/config/site.ts`.

## Sites Dans Le Moule

```txt
mvc/src/sites/
  chantdumerle/  client reel actif
  example/       contenu neutre de demonstration
```

Le site actif fournit la marque, la navigation, les contenus locaux et les
routes metier visibles. Les modules restent reutilisables et peuvent lire des
donnees locales exemple quand aucun endpoint WordPress n'est configure.

## Routes Actives Chant Du Merle

| Route | Usage |
| --- | --- |
| `/` | redirection vers `/fr` |
| `/[locale]` | home Chant du Merle |
| `/[locale]/cordes` | univers catalogue des cordes |
| `/[locale]/produits/[slug]` | fiche produit generique |
| `/[locale]/guides` | liste de guides |
| `/[locale]/guides/comment-choisir-ses-cordes` | guide detaille |
| `/[locale]/selections` | page de selections |
| `/api/cart/add` | ajout panier WooCommerce optionnel |

Les routes demo `/[locale]/catalogue` et `/[locale]/guides/premier-guide`
restent presentes pour verifier le contenu `example`, mais elles ne sont pas
exposees par la navigation Chant du Merle.

## Variables D'Environnement

| Variable | Requise | Usage |
| --- | --- | --- |
| `WP_GRAPHQL_URL` | non | endpoint GraphQL pour WordPress/WooGraphQL |

Sans `WP_GRAPHQL_URL`, le catalogue utilise
`mvc/src/modules/catalog/content/exampleProducts.ts`.

## Etat Du Nettoyage

L'ancien laboratoire `next-frontend/src` et les fichiers projet Next racine ont
ete supprimes. Le code applicatif vit maintenant dans `next-frontend/mvc`.
