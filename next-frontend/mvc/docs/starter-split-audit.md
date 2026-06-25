# Audit De Separation Starter / Chant Du Merle

Date: 2026-06-17

Suivi operationnel: `docs/starter-split-tracker.md`

## Objectif

Separer proprement deux intentions qui sont aujourd'hui melangees:

- un starter Next.js reutilisable pour d'autres projets;
- l'instance specifique Chant du Merle, branchee a WooCommerce et a son contenu editorial.

Le critere de reussite cote maintenance est simple: quand on veut modifier un
sous-titre, un texte, une image ou un espacement visible, l'emplacement doit
etre previsible sans connaitre toute l'architecture.

## Diagnostic Court

Le projet n'est pas un plat de spaghetti, mais le starter est contamine par
l'instance Chant du Merle. La structure `src/app`, `src/components`,
`src/modules`, `src/sites` est coherente sur le papier, mais elle impose un
cout mental trop eleve pour un site unique.

Les points les plus lourds sont:

- `src/modules/catalog/services/wordpressProducts.ts`, trop gros et trop central;
- la logique Woo/WordPress presente dans le starter;
- le contenu CDM eparpille entre routes, `src/content`, Woo et WordPress;
- les styles tres fragmentes en nombreux CSS Modules, parfois avec overrides locaux;
- `src/sites/example` et les donnees exemple qui brouillent le projet actif.

## Classification Des Fichiers

### A Garder Dans Un Starter Propre

Ces fichiers ou concepts peuvent appartenir a un starter, apres neutralisation
des noms, textes et domaines metier:

- `package.json`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`;
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`;
- `src/app/globals.css`;
- `src/styles/tokens.css`, mais avec tokens neutres;
- `src/config/siteTypes.ts`;
- composants layout generiques:
  - `Container`;
  - `Section`;
  - `Header`;
  - `Footer`;
  - `MainNav`;
  - `MobileMenu`;
- composants UI generiques:
  - `Button`;
  - `LinkButton`;
  - `Card`;
  - `LinkCard`;
  - `Badge`;
  - `Breadcrumbs`;
  - `SectionHeading`;
- blocs generiques:
  - `Hero`;
  - `TextBlock`;
  - `EntryGrid`;
  - `PageHeader`;
- helpers vraiment generiques:
  - `localizedHref`;
  - `htmlToPlainText`, si le starter garde une option CMS.

### A Sortir Vers Chant Du Merle

Ces elements sont specifiques a l'instance CDM et ne doivent pas vivre dans un
starter neutre:

- `src/content/*`;
- `src/sites/example/**`, sauf si on en fait un vrai exemple minimal de starter;
- routes metier:
  - `/cordes`;
  - `/accessoires`;
  - `/guides`;
  - `/guides/[slug]`;
  - `/produits/[slug]`;
  - `/selections`;
  - `/selections/[kind]/[slug]`;
- modules metier:
  - `modules/catalog`;
  - `modules/guides`;
  - `modules/selections`;
  - `modules/commerce`;
- images et icones CDM:
  - `public/images/brand/logo-cdm.png`;
  - `public/images/brand/hero-home.png`;
  - `public/images/hero-cordes.png`;
  - `public/images/hero-accessoires.png`;
  - `public/images/hero-guides.png`;
  - `public/images/hero-selections.png`;
  - `public/icons/icon-violin.png`;
  - `public/icons/icon-viola.png`;
  - `public/icons/icon-cello.png`;
  - `public/icons/icon-db.png`;
- exports Woo:
  - `exports/woo-accessoires-attributs-import.csv`;
  - `exports/woo-cordes-profils-import.csv`;
- documentation commerce Woo:
  - `docs/commerce-architecture.md`;
- proxy et rewrites Woo:
  - `src/proxy.ts`;
  - la partie Woo de `next.config.ts`;
- backend WordPress:
  - `woo-backend/wp-content/mu-plugins/chantdumerle-commerce-bridge.php`;
  - `woo-backend/wp-content/themes/chantdumerle/**`;
- scripts d'import et de normalisation Woo dans `tools/`.

### Dette A Supprimer Ou Simplifier

Ces elements ne sont pas forcement mauvais, mais ils compliquent la lecture:

- dossiers vides:
  - `src/components/product`;
  - `src/components/guide`;
  - `src/components/selection`;
  - `src/data`;
  - `src/messages`;
  - `src/lib/i18n/catalog`;
  - `src/lib/i18n/common`;
  - `src/lib/i18n/navigation`;
  - `src/lib/i18n/pages`;
  - `src/lib/mappers`;
  - `src/lib/utils`;
  - `src/modules/guides/content`;
  - `src/modules/selections/content`;
- assets Next par defaut:
  - `public/file.svg`;
  - `public/globe.svg`;
  - `public/next.svg`;
  - `public/vercel.svg`;
  - `public/window.svg`;
- `src/modules/catalog/content/exampleProducts.ts`, a remplacer dans le starter par un exemple minimal neutre ou a sortir;
- `src/app/[locale]/catalogue/page.tsx`, route demo connectee a `sites/example`;
- commentaires CSS trop narratifs dans certains composants;
- overrides CSS du type `.hero.hero`, qui signalent que la variante devrait probablement etre une prop ou un composant de section.

## Probleme Principal De Lisibilite

Aujourd'hui, pour modifier une section visible, il faut parfois chercher dans:

- une route `src/app/[locale]/.../page.tsx`;
- un composant dans `src/modules/.../components`;
- un contenu dans `src/sites/chantdumerle/content`;
- un service dans `src/modules/.../services`;
- un CSS Module local;
- un style global ou token;
- WooCommerce ou WordPress.

Ce modele est defendable pour une equipe qui connait deja la carte, mais il est
trop dur a decouvrir.

## Cible Proposee Pour Le Repo Starter

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  content/
    site.ts
    home.ts
  components/
    layout/
    ui/
    sections/
  lib/
    routing/
    text/
  styles/
    tokens.css
    utilities.css
```

Regles du starter:

- pas de WooCommerce obligatoire;
- pas de WordPress obligatoire;
- pas de routes metier CDM;
- pas de `src/sites/chantdumerle`;
- pas de `sites/example` lourd;
- un seul exemple simple de page, contenu et section;
- documentation courte: "ou modifier quoi".

## Cible Proposee Pour Le Repo Chant Du Merle

```txt
src/
  app/
    [locale]/
      page.tsx
      cordes/
      accessoires/
      produits/
      guides/
      selections/
      contact/
      cgv/
      mentions-legales/
      politique-confidentialite/
  content/
    home.ts
    strings.ts
    accessories.ts
    selections.ts
    legal.ts
  components/
    layout/
    ui/
    sections/
    product/
    guide/
    selection/
  features/
    catalog/
    commerce/
    guides/
    selections/
  integrations/
    wordpress/
    woocommerce/
  styles/
    tokens.css
    utilities.css
```

Regles du site CDM:

- le contenu editable local va dans `src/content`;
- les composants visibles de sections vont dans `src/components/sections`;
- les logiques metier vont dans `src/features`;
- les APIs externes vont dans `src/integrations`;
- Woo et WordPress sont explicites, pas caches dans un starter;
- chaque page a une carte simple: route -> contenu -> sections -> feature/data.

## Regle CSS Proposee

Ne pas revenir a un seul gros CSS global, mais reduire la fragmentation.

Structure cible:

```txt
styles/
  tokens.css       couleurs, typos, espacements
  globals.css      reset + HTML de base
  utilities.css    classes simples reutilisables

components/
  sections/HomeHero/
    HomeHero.tsx
    HomeHero.module.css
```

Regles:

- CSS global pour les fondations;
- CSS Module pour les composants reutilisables ou sections identifiables;
- pas de CSS "page" si la page est composee de sections;
- pas d'override `.hero.hero` sauf cas exceptionnel;
- si un espacement revient partout, il devient un token ou une prop de `Section`;
- si une section est visible a l'ecran, son style doit vivre avec cette section.

## Ordre De Migration Recommande

1. Nettoyer la carte mentale sans changer le comportement:
   - supprimer les dossiers vides;
   - retirer les assets Next par defaut;
   - documenter "ou modifier quoi".

2. Clarifier le repo CDM:
   - deplacer les contenus de pages legales dans `src/content/legal.ts`;
   - creer une carte route -> contenu -> composant;
   - renommer `modules` en `features` si on veut rendre le vocabulaire plus naturel.

3. Decouper les gros services:
   - extraire Store API Woo;
   - extraire GraphQL WordPress;
   - extraire mappers produits;
   - extraire filtres catalogue.

4. Normaliser les sections:
   - `HomeHero`;
   - `HomeEntrySections`;
   - `StringsIntro`;
   - `ProductResults`;
   - `SelectionGroups`;
   - chaque section garde son CSS local.

5. Creer le starter propre:
   - repartir d'une copie minimale;
   - retirer Woo, CDM, produits cordes, guides, selections;
   - garder uniquement layout, UI, sections exemples, tokens, docs.

## Definition Du "Specifique"

Est specifique Chant du Merle tout ce qui mentionne ou suppose:

- Le Chant du Merle;
- instruments du quatuor;
- cordes, archets, colophanes, accessoires;
- attributs Woo `pa_*`;
- panier, commande, compte Woo;
- guides editoriaux CDM;
- selections et packs;
- CSV de recommandations;
- images de marque;
- domaines locaux CDM;
- textes legaux de l'entreprise.

Est generique starter ce qui peut servir tel quel a un autre site:

- layout;
- navigation configurable;
- composants UI;
- tokens personnalisables;
- helper de route localisee;
- exemple de contenu minimal;
- conventions de dossier.
