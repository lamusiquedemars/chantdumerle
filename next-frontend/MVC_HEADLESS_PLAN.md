# MVC Headless Plan

## Intention

`next-frontend` sert aujourd'hui de laboratoire pour un front Next.js headless.
La cible est d'en extraire un dossier `mvc` reutilisable pour plusieurs sites
clients, sans faire de Chant du Merle le modele obligatoire.

Le futur `mvc` doit rester :

- evolutif : un site simple ne porte pas le poids d'une boutique complete ;
- modulaire : contenu, catalogue, commerce et multilingue restent separables ;
- headless : les vues ne dependent pas directement d'un CMS unique ;
- lisible : les conventions de routes, de donnees et de composants sont visibles ;
- sain : le starter doit builder avec son contenu exemple.

## Lecture MVC Dans Next

Next.js App Router ne reproduit pas un MVC serveur classique. Pour ce starter,
la lecture MVC vise surtout a garder les responsabilites separees.

| Role | Emplacement cible | Responsabilite |
| --- | --- | --- |
| Model | `src/types`, `src/lib/adapters`, `src/modules/*/services` | Contrats, acces donnees et adaptation des sources headless |
| View | `src/components`, `src/modules/*/components`, `src/styles` | Layouts, blocs, UI et rendu des modules |
| Controller | `src/app`, orchestration de modules | Routes Next, composition des pages et handlers API |

Les fichiers `page.tsx` restent les entrees publiques des routes. Ils ne
doivent pas devenir le depot de tous les textes, toutes les requetes et toutes
les regles metier.

## Cible Du Dossier `mvc`

Arborescence de depart proposee :

```txt
mvc/
  src/
    app/
    components/
      blocks/
      layout/
      ui/
    config/
    content/
    lib/
      adapters/
      i18n/
      routing/
      seo/
      utils/
    modules/
      blog/
      catalog/
      commerce/
      pages/
      selections/
    styles/
    types/
  public/
  .env.example
  AGENTS.md
  README.md
```

## Separation A Tenir

### Socle

Le socle contient les conventions partagees :

- layout racine ;
- configuration de site ;
- routing helpers ;
- SEO de base ;
- composants generiques ;
- adaptateurs headless ;
- erreurs, 404 et etats de chargement de base.

### Modules

Un module existe seulement quand son domaine merite une frontiere claire :

- `pages` pour les pages editoriales simples ;
- `blog` ou `guides` pour des contenus listes + details ;
- `catalog` pour listes, filtres et fiches d'entites ;
- `commerce` pour panier, achat et API commerce ;
- `selections` pour une couche de curation au-dessus d'un catalogue.

Un site vitrine ne doit pas importer le module commerce pour fonctionner.

### Site Client

Le site client fournit :

- nom, marque, logo et liens globaux ;
- navigation et footer ;
- locales actives ;
- tokens visuels ;
- medias ;
- contenus locaux ;
- endpoints et adaptateurs actifs ;
- modules actives.

## Configuration Client Cible

Le starter doit ramener les changements d'un nouveau client vers quelques
points previsibles :

```ts
export const siteConfig = {
  name: "Example Site",
  defaultLocale: "fr",
  locales: ["fr"],
  brand: {
    homeHref: "/",
    logoSrc: "/images/logo.png",
  },
  modules: {
    blog: false,
    catalog: false,
    commerce: false,
    selections: false,
  },
};
```

Les endpoints WordPress ou WooCommerce restent dans des variables
d'environnement et dans leurs adaptateurs, pas dans les composants generiques.

## Phases De Migration

### 1. Stabiliser `next-frontend`

Objectif : repartir d'un projet qui ne ment pas sur son etat.

- garder uniquement les routes qui ont une implementation utile ;
- retirer ou completer les fichiers `page.tsx` et `route.ts` vides ;
- choisir une convention unique pour les URLs produit ;
- corriger les liens qui pointent vers des routes absentes ;
- obtenir `npm run lint` acceptable et `npm run build` vert.

### 2. Documenter Les Conventions

Objectif : savoir ce que l'on extrait avant de deplacer du code.

- remplacer le README generique ;
- ajouter `.env.example` ;
- preciser les conventions du starter dans `AGENTS.md` ;
- documenter la liste des modules et les points de personnalisation.

### 3. Extraire La Configuration Client

Objectif : sortir les specificites Chant du Merle du futur socle.

- isoler brand, navigation, footer et SEO ;
- sortir les textes home et les liens clients des composants globaux ;
- isoler les tokens visuels de marque ;
- eviter les chemins `/fr` en dur dans les briques generiques.

Premiere passe lancee dans `src/config/site.ts` :

- marque, locale par defaut, navigation et liens de footer centralises ;
- `Header` et `Footer` alimentes par props au lieu d'embarquer le nom du
  client ;
- redirection racine et attribut `lang` relies a la config.
- helper `localizedHref` ajoute pour eviter les prefixes de locale en dur dans
  les pages et donnees qui suivent la route active.
- contenu de la home extrait puis range dans
  `src/sites/chantdumerle/content/home.ts` pendant que la route garde
  l'orchestration et les produits dynamiques.
- contenu de l'univers cordes extrait puis range dans
  `src/sites/chantdumerle/content/strings.ts` pendant que la route catalogue
  garde la composition et l'appel produits.
- contenus selections et guides extraits des routes, avec l'article guide
  represente par des blocs editoriaux simples.
- premier module cree dans `src/modules/guides` avec son contenu et ses
  composants, les routes `src/app` restant les entrees publiques.
- module `selections` cree avec ses composants, son contenu et son service
  WordPress ; ses composants produits attendent encore le module `catalog`.
- module `catalog` avance avec les composants `Product*`, le contenu cordes,
  le service produit WordPress et les helpers i18n de catalogue places dans
  `src/modules/catalog`.
- module `commerce` cree avec un handler d'ajout panier et un service WooGraphQL,
  la route API Next.js restant un simple point d'entree.
- fiche produit generique allegee : la route `produits/[slug]` recupere la
  donnee et delegue le rendu a `catalog`, le bouton panier vivant dans
  `commerce`.
- routes home et cordes allegees : elles recuperent la locale, les contenus et
  les produits, puis deleguent le rendu a des vues de module.
- routes guides allegees : la liste et le detail d'article recuperent le
  contenu localise, puis deleguent le rendu au module `guides`.
- fallback catalogue local ajoute : le module `catalog` peut afficher des
  produits exemple si `WP_GRAPHQL_URL` n'est pas configure.
- espace client `src/sites/chantdumerle` cree pour separer la configuration et
  les contenus Chant du Merle du socle actif.
- contenus `strings`, `guides` et `selections` deplaces dans
  `src/sites/chantdumerle/content`, les modules gardant leurs types et vues.

### 4. Isoler Les Adaptateurs Headless

Objectif : proteger les vues contre le choix du backend.

- ranger WordPress et WooCommerce dans des adaptateurs ;
- definir des contrats de module stables ;
- permettre a un module de lire des donnees locales en exemple ;
- garder les erreurs, caches et revalidations au bon niveau.

Premier deplacement structurel effectue :

- `guides` sert de premier module local avec `components` et `content` ;
- `selections` regroupe deja ses vues, son contenu et son service WordPress ;
- `catalog` regroupe maintenant ses composants, son contenu cordes, son service
  produit WordPress, un fallback local exemple et ses helpers i18n ;
- `commerce` regroupe maintenant le handler d'ajout panier et son service
  WooGraphQL, plus le bouton client d'ajout panier ;
- `src/lib/wordpress` garde encore le client GraphQL partage et les autres
  adaptateurs non module, avant une extraction plus nette ;

### 5. Creer Le Dossier `mvc`

Objectif : produire un starter neutre.

- copier seulement les briques generiques ;
- livrer une home et une page exemple ;
- livrer des modules exemples limites ;
- ne garder aucun nom, logo ou contenu client reel ;
- verifier le starter sans backend externe obligatoire.

Etat :

- dossier `mvc` cree ;
- configuration active branchee sur `src/sites/example` ;
- contenus exemple neutres pour home, catalogue, selections et guides ;
- routes neutralisees : `/[locale]/catalogue` et
  `/[locale]/guides/premier-guide` ;
- catalogue validable sans `WP_GRAPHQL_URL` grace au fallback local ;
- `npm run lint` et `WP_GRAPHQL_URL= npm run build` valides dans `mvc`.

### 6. Realigner Chant Du Merle

Objectif : valider le modele avec un vrai cas client.

- rebrancher les modules utiles ;
- reinjecter la configuration Chant du Merle ;
- conserver les choix metier propres au catalogue de cordes ;
- verifier que les differences client restent dans les couches prevues.

Etat :

- `mvc/src/sites/chantdumerle` cree avec la configuration et les contenus du
  site reel ;
- `mvc/src/config/site.ts` pointe maintenant vers Chant du Merle ;
- routes metier Chant du Merle ajoutees dans `mvc` :
  `/[locale]/cordes` et `/[locale]/guides/comment-choisir-ses-cordes` ;
- le module catalogue garde le fallback local du starter tout en exposant les
  fonctions metier des cordes ;
- les scripts racine `npm run dev|lint|build|start` ciblent maintenant
  `next-frontend/mvc` ;
- `npm run lint` et `npm run build` sont valides sur `mvc`.
- apres verification navigateur, l'ancien laboratoire `next-frontend/src` et
  les fichiers projet Next racine ont ete supprimes.

## Inventaire Des Routes Actuelles

Dans l'App Router, un fichier `page` expose une route publique et un fichier
`route` expose un handler API. Un fichier vide doit donc etre retire ou
implemente avant de servir de base au starter.

| Route actuelle | Fichier | Etat observe | Decision premiere passe |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | redirect vers `/fr` | garder provisoirement |
| `/[locale]` | `src/app/[locale]/page.tsx` | home specialisee Chant du Merle | garder puis sortir la config client |
| `/[locale]/cordes` | `src/app/[locale]/cordes/page.tsx` | page catalogue cordes | garder comme cas module catalog |
| `/[locale]/produits/[slug]` | `src/app/[locale]/produits/[slug]/page.tsx` | fiche produit generique + ajout panier | route produit retenue |
| `/[locale]/cordes/[slug]` | `src/app/[locale]/cordes/[slug]/page.tsx` | ancienne fiche produit specialisee | remplacee par `produits/[slug]` |
| `/[locale]/cordes/violon` | `src/app/[locale]/cordes/violon/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/cordes/alto` | `src/app/[locale]/cordes/alto/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/cordes/cello` | `src/app/[locale]/cordes/cello/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/cordes/contrebasse` | `src/app/[locale]/cordes/contrebasse/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/accessoires` | `src/app/[locale]/accessoires/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/accessoires/[slug]` | `src/app/[locale]/accessoires/[slug]/page.tsx` | fichier vide et build bloquant au debut de l'audit | retire en premiere passe |
| `/[locale]/selections` | `src/app/[locale]/selections/page.tsx` | page editoriale statique | garder ou passer en module selections |
| `/[locale]/selections/[slug]` | `src/app/[locale]/selections/[slug]/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/guides` | `src/app/[locale]/guides/page.tsx` | liste editoriale | garder comme cas module contenu |
| `/[locale]/guides/comment-choisir-ses-cordes` | `src/app/[locale]/guides/comment-choisir-ses-cordes/page.tsx` | detail guide statique | garder provisoirement |
| `/[locale]/guides/[slug]` | `src/app/[locale]/guides/[slug]/page.tsx` | placeholder commentee au debut de l'audit | retire en premiere passe |
| `/[locale]/philosophie` | `src/app/[locale]/philosophie/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/[locale]/archets-ivo-incidit` | `src/app/[locale]/archets-ivo-incidit/page.tsx` | fichier vide au debut de l'audit | retire en premiere passe |
| `/api/cart/add` | `src/app/api/cart/add/route.ts` | handler WooCommerce actif | garder dans le module commerce |
| `/api/preview` | `src/app/api/preview/route.ts` | fichier vide au debut de l'audit | retire en premiere passe |
| `/api/revalidate` | `src/app/api/revalidate/route.ts` | fichier vide au debut de l'audit | retire en premiere passe |

## Decisions A Prendre Apres Cet Inventaire

### URLs Produit

Decision retenue :

- les pages d'univers ou de categorie gardent leurs slugs metier, par exemple
  `cordes`, puis plus tard `accessoires` ou `instruments` ;
- la fiche d'un produit reste generique sous `produits/[slug]` ;
- les cartes produit issues de l'adaptateur WordPress generent cette route
  unique quelle que soit leur categorie ;
- les liens vers les anciennes pages par instrument passent provisoirement par
  des query params sur `/cordes`.

Ce choix evite qu'une fiche accessoire ou instrument doive vivre sous
`cordes/[slug]`, tout en laissant chaque page d'univers porter son contenu et
son SEO.

### Langues

Le projet a un segment `[locale]` et des fichiers i18n, mais beaucoup de liens
restent en `/fr`.

Decision recommandee pour `mvc` :

- starter mono-langue par defaut ;
- i18n prevue comme option ou module ;
- aucun lien client `/fr` en dur dans le socle generique.

### Commerce

Le module commerce ne doit pas etre requis par un site vitrine.
La premiere version de `mvc` peut livrer les contrats et l'emplacement du
module sans embarquer un checkout complet.

### Liens Provisoires

La premiere passe de nettoyage retire les liens visibles vers les routes
supprimees :

- navigation et footer ne pointent plus vers `accessoires` ou `philosophie`
  tant que ces pages n'existent pas ;
- la home et la page cordes ne pointent plus vers des details de selection
  absents ;
- les listes de guides n'exposent plus que le guide detaille actuellement
  implemente.

Les query params `instrument` et `son` gardent des URLs valides sur `/cordes`.
Le filtrage associe reste une decision du module `catalog`.

## Criteres De Validation Du Starter

- un clone de `mvc` build sans backend externe obligatoire ;
- un nouveau client change surtout `config`, `content`, `public` et les tokens ;
- les routes exposees ont une implementation reelle ;
- les modules optionnels ne polluent pas le socle ;
- les composants generiques ne contiennent pas de nom ou d'URL client ;
- le README explique comment partir d'un site vitrine puis activer un module.

## Etat De La Premiere Passe

La stabilisation initiale de `next-frontend` a commence :

1. les routes vides ou placeholders ont ete retirees ;
2. les liens visibles ont ete realignes sur les routes encore exposees ;
3. les fiches produit passent par la route generique `produits/[slug]` ;
4. lint et build repassent apres ce nettoyage.

## Prochaine Etape

Continuer les changements frontend directement dans `next-frontend/mvc`.
Le dossier `next-frontend` ne garde plus que la documentation de migration et
le projet actif `mvc`.

## Suivi Actif Chant Du Merle

Cette section sert de memoire de travail apres l'import Woo et le rebranchement
des listings. Elle doit etre mise a jour a chaque grosse etape pour ne pas
perdre le fil.

### Fait

- import des produits Woo depuis `01-produits-woo.csv` effectue par
  l'interface WooCommerce ;
- sauvegarde DB post-import creee dans
  `woo-backend/wp-content/uploads/db-backups/chantdumerle_wp_after_import_20260607.sql` ;
- attributs commerciaux Woo normalises via
  `tools/normalize-woo-product-attributes.php` ;
- produits actifs rattaches aux taxonomies globales Woo :
  `pa_marque`, `pa_modele`, `pa_instrument`, `pa_corde`, `pa_taille`,
  `pa_tension`, `pa_attache`, `pa_ame`, `pa_filage`, `pa_type_produit` ;
- variations converties de `attribute_*` vers `attribute_pa_*` ;
- faux doublons de valeurs corriges, notamment `Do/do`, `Boule/boule`,
  `Boucle/boucle` ;
- slugs accentues nettoyes pour les filtres : `re`, `fa-diese`, `do-diese`,
  `acier-chrome`, `tungstene` ;
- page `/[locale]/cordes` branchee sur les vrais produits Woo via
  `taxonomyFilter` WPGraphQL ;
- filtres de premiere passe ajoutes sur `/cordes` :
  `instrument`, `corde`, `taille`, `tension` ;
- options de filtres chargees depuis les termes Woo ;
- colophanes exclues du listing cordes via `pa_type_produit=colophane` ;
- cartes produit enrichies par des metadonnees optionnelles et generiques ;
- les listings cordes Chant du Merle alimentent ces metadonnees avec
  instrument, corde, taille et tension sans specialiser le composant de carte ;
- AB testing a prevoir sur les cartes produit pour decider si toutes les
  metadonnees doivent rester visibles dans la grille ;
- referentiel modele construit depuis `cordes_attributs.csv` et les produits
  Woo reels : `142` couples marque + modele de cordes, `140` complets,
  `2` Aquila a completer ;
- valeurs Woo corrigees a la source : `Infeld azul` devient `Infeld bleu`,
  `Infeld roja` devient `Infeld rouge`, et `Original Flat Chorme Orchestra`
  devient `Original Flat-Chrome Orchestra` ; les alias applicatifs ont ete
  retires ;
- module TypeScript genere pour exposer le referentiel modele au front Chant du
  Merle, avec lookup par `marque + modele` ;
- filtre metier `son` branche sur `/[locale]/cordes` avec les valeurs du
  referentiel modele (`chaud`, `brillant`, `equilibre`) et croisement final par
  `marque + modele` ;
- les cartes "Choisir selon votre besoin" pointent maintenant vers les listings
  sonores quand le besoin correspond deja au referentiel ;
- controle visuel `/fr/cordes` valide par Ivo ;
- `npm run build` valide dans `next-frontend/mvc`.

### A Faire Maintenant

1. Completer les deux lignes Aquila du referentiel si elles doivent etre
   exposees dans les pages par besoin musical.
2. Etendre les listings par intention metier :
   niveau, budget, usage, reponse, puissance, a partir du referentiel modele.
3. Decider le mode de stockage long terme du referentiel modele :
   CSV maintenable au depart, puis table dediee ou CPT WordPress si besoin.
4. Preparer les produits composes/curations :
   jeux recommandes, panachages de cordes, selections par besoin musical.
5. Revoir les performances GraphQL des listings metier :
   les pages repondent en 200 et deviennent rapides apres cache Next, mais le
   premier rendu de certaines valeurs `son` depend encore fortement de
   WPGraphQL local ; prevoir requete allegee, cache dedie ou endpoint metier
   avant mise en production.

### Prochaine Decision

La prochaine action recommandee est la sauvegarde Git coherent du chantier
`mvc`, avant d'ajouter de nouvelles pages metier. Ensuite seulement, avancer sur
les listings par besoin musical avec le referentiel modele.
