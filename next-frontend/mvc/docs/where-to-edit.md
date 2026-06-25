# Ou Modifier Quoi

Date: 2026-06-18

But: retrouver vite le texte, le composant, le CSS ou la source de donnees d'une
partie visible du site.

Cette carte decrit l'etat actuel. Quand une zone est mal placee ou trop
eparpillee, la colonne "A simplifier" indique la cible.

## Regle De Lecture Rapide

- Route: fichier Next qui recoit l'URL.
- Contenu: texte local, configuration ou source editable.
- Vue/composants: rendu React visible.
- CSS: fichier a modifier pour les espacements, grilles, couleurs locales.
- Donnees: WordPress, WooCommerce ou service local.

## Layout Global

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier le logo, le nom du site, les liens de navigation ou les liens footer | `src/content/site.ts` | Emplacement final. Tous les liens globaux sont ici. |
| Modifier le header | `src/components/layout/Header/Header.tsx` et `Header.module.css` | Garder comme composant layout generique. |
| Modifier les liens et icones de navigation | Texte/config dans `site.ts`, rendu dans `src/components/layout/MainNav/MainNav.tsx`, style dans `MainNav.module.css` | Isoler la logique Woo du compteur panier hors de `MainNav`. |
| Modifier le menu mobile | `src/components/layout/MobileMenu/MobileMenu.tsx` et `MobileMenu.module.css` | Garder generique. |
| Modifier le footer | Liens dans `site.ts`, rendu dans `src/components/layout/Footer/Footer.tsx`, style dans `Footer.module.css` | Garder generique. |
| Modifier les couleurs, typos ou espacements globaux | `src/styles/tokens.css` | Garder, mais renommer/ordonner les tokens selon leur usage. |
| Modifier le reset HTML et styles globaux | `src/app/globals.css` | Garder minimal. |
| Modifier les espacements generiques de sections | `src/components/layout/Section/Section.module.css` | Ajouter des variantes explicites si besoin. |
| Modifier la largeur globale des conteneurs | `src/components/layout/Container/Container.module.css` | Garder. |

## Home

Route: `src/app/[locale]/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier le titre, sous-titre, boutons ou image du hero home | `src/content/home.ts`, cle `hero` | Emplacement final. |
| Modifier le texte d'intro | `src/content/home.ts`, cle `intro` | Idem. |
| Modifier les cartes "Entrer par instrument" | `src/content/navigationCards.ts`, `getInstrumentEntryItems` | Partage home + page Cordes. |
| Modifier les cartes "Je recherche un son" | `src/content/navigationCards.ts`, `getSoundEntryItems` | Partage home + page Cordes. |
| Modifier les cartes "Entrer par niveau" | `src/content/navigationCards.ts`, `getLevelEntryItems` | Partage home + page Cordes. |
| Modifier les selections mises en avant | `src/content/navigationCards.ts`, `getPackSelectionItems` | Partage home + page Selections. |
| Modifier le titre "Quelques references" | `home.ts`, cle `featuredProducts` | Idem. |
| Modifier les produits affiches dans "Quelques references" | `src/app/[locale]/page.tsx` appelle `getFeaturedStringProducts`; logique dans `src/modules/catalog/services/wordpressProducts.ts` | Extraire vers `features/catalog`. |
| Modifier les guides affiches sur la home | `getGuideCards(locale, 3)` dans la route; rendu dans `HomePageView` avec `GuideList` | Meme source dynamique que Cordes, Accessoires et Selections. |
| Modifier le texte de fermeture | `home.ts`, cle `closing` | Idem. |
| Modifier le bloc Atelier Ivo Incidit | `home.ts`, cle `workshop` | Idem. |
| Modifier l'ordre des sections home | `src/modules/pages/components/HomePageView/HomePageView.tsx` | Transformer en sections plus explicites si necessaire. |
| Modifier l'espacement entre sections home | `HomePageView.tsx` via `<Section>`, puis `Section.module.css` | Si section specifique, creer un composant `components/sections/...`. |
| Modifier le CSS du hero home | `src/components/blocks/Hero/Hero.module.css` | Eviter que toutes les variations hero soient dans un seul composant si elles divergent. |
| Modifier les cartes d'entree | `EntryGrid`, `LinkCard`, leurs CSS modules | Garder si reutilisables. |
| Modifier le carousel produits | `src/modules/catalog/components/ProductCarousel/*` et `ProductCard/*` | Garder dans `features/catalog` ou `components/product`. |

## Cordes

Route: `src/app/[locale]/cordes/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier le hero Cordes | `src/content/strings.ts`, cle `hero` | Emplacement final. |
| Modifier l'image hero Cordes | `strings.ts`, `hero.backgroundImage` | Idem. |
| Modifier les textes "Notre selection de cordes" | `strings.ts`, cle `products` | Idem. |
| Modifier les cartes par instrument | `src/content/navigationCards.ts`, `getInstrumentEntryItems` | Meme composant et meme contenu que la home. |
| Modifier les cartes par besoin/son/usage | `src/content/navigationCards.ts`, `getStringNeedEntryItems` | Meme composant `EntryGrid` que la home. |
| Modifier les intros quand on arrive par instrument/son/usage | `strings.ts`, cle `filterIntros` | Idem, mais a renommer pour rendre l'intention plus claire. |
| Modifier les filtres URL acceptes | `src/app/[locale]/cordes/page.tsx` | Extraire parsing/validation vers `features/catalog/stringFilters.ts`. |
| Modifier les filtres produits Woo | `src/modules/catalog/services/wordpressProducts.ts` | Extraire vers `features/catalog/productFilters.ts`. |
| Modifier les attributs Woo affiches | `wordpressProducts.ts` et `src/modules/catalog/i18n/*` | Extraire integration Woo + affichage. |
| Modifier le rendu de la page Cordes | `src/modules/catalog/components/StringsPageView/StringsPageView.tsx` | Decouper en sections: intro, filtres, resultats, orientation. |
| Modifier le CSS de la page Cordes | `StringsPageView.module.css` | Remplacer les overrides `.hero.hero` par variante ou section dediee. |
| Modifier la grille produits | `ProductGrid`, `ProductCard`, leurs CSS | Garder composant produit. |
| Modifier pagination | `ProductPagination.tsx` et `ProductPagination.module.css` | Garder composant catalogue. |
| Modifier les guides affiches en bas de page | WordPress via `getGuideCards(locale, 3)` dans la route; rendu `GuideList` dans `StringsPageView` | Plus de guide statique dans `content/strings.ts`. |

## Accessoires

Route: `src/app/[locale]/accessoires/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier hero, sous-titre, image Accessoires | `src/content/accessories.ts`, cle `hero` | Emplacement final. |
| Modifier texte "Accessoires disponibles" | `accessories.ts`, cle `products` | Idem. |
| Modifier les categories "Choisir par besoin" | `src/content/navigationCards.ts`, `getAccessoryEntryItems` | Meme composant `EntryGrid` que les entrees home/cordes. |
| Modifier les guides affiches en bas de page | WordPress via `getGuideCards(locale, 3)` dans la route; rendu `GuideList` dans `AccessoriesPageView` | Meme source dynamique que la home. |
| Modifier les filtres URL acceptes | `src/app/[locale]/accessoires/page.tsx` | Extraire parsing/validation comme pour Cordes. |
| Modifier les donnees produits accessoires | `getAccessoryProductsPageData` dans `wordpressProducts.ts` | Extraire vers `features/catalog/accessoryProducts.ts`. |
| Modifier le rendu Accessoires | `src/modules/catalog/components/AccessoriesPageView/AccessoriesPageView.tsx` | Decouper ou aligner sur Cordes. |
| Modifier le CSS Accessoires | `AccessoriesPageView.module.css` | Supprimer les overrides `.hero.hero` si possible. |

## Produit

Route: `src/app/[locale]/produits/[slug]/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier les donnees source produit | WooCommerce / WordPress GraphQL | Documenter dans docs d'exploitation CDM. |
| Modifier le chargement par slug | `getProductPageBySlug` dans `src/modules/catalog/services/wordpressProducts.ts` | Extraire vers `features/catalog/productPageData.ts`. |
| Modifier les champs affiches en fiche produit | `ProductDetail.tsx`, `ProductFieldGroup`, et mapping dans `wordpressProducts.ts` | Separer mapping donnees et rendu. |
| Modifier la galerie produit | `ProductGallery.tsx` et `ProductGallery.module.css` | Garder comme composant produit. |
| Modifier le bouton d'ajout panier | `src/modules/commerce/components/AddToCartButton/AddToCartButton.tsx` et CSS | Deplacer vers `features/commerce`. |
| Modifier les libelles panier/stock/SKU | `ProductDetail.tsx` et `AddToCartButton.tsx` | Sortir les libelles dans contenu ou constantes metier. |
| Modifier le style fiche produit | `ProductDetail.module.css` | Garder avec le composant produit. |
| Modifier les breadcrumbs produit | `ProductDetail.tsx` | Extraire si la logique continue de grandir. |

## Selections

Route liste: `src/app/[locale]/selections/page.tsx`

Route detail: `src/app/[locale]/selections/[kind]/[slug]/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier titre principal de la page Selections | `src/content/selections.ts`, cle `title` | Emplacement final. |
| Modifier sous-titre du hero Selections | `selections.ts`, cle `hero.subtitle` | Texte sorti de `SelectionsPageView.tsx`. |
| Modifier image hero Selections | `selections.ts`, cle `hero.backgroundImage` | Image sortie de `SelectionsPageView.tsx`. |
| Modifier paragraphes d'intro | `selections.ts`, cle `paragraphs` | Contenu centralise. |
| Modifier les cartes packs de la page liste | `src/content/navigationCards.ts`, `getPackSelectionItems` | Meme composant `SelectionGrid`/`SelectionCard` que la home; `SelectionCard` accepte deja une image optionnelle. |
| Modifier les groupes "Selon la pratique" / "Selon le son recherche" | `selections.ts`, cle `strings.groups` | Les fonctions `getPackItems` et `getStringGroups` ont ete supprimees. |
| Modifier les guides affiches en bas de page | WordPress via `getGuideCards(locale, 3)` dans la route; rendu `GuideList` dans `SelectionsPageView` | Meme source dynamique que la home. |
| Modifier les contenus de pages detail selection | `src/content/selectionDetails.ts` | Emplacement final. |
| Modifier les instruments des pages detail | `selectionDetails.ts`, `selectionInstruments` | Idem. |
| Modifier les produits de selection par usage/son | WooCommerce, attributs `pa_usage`, `pa_profil_sonore`, `pa_corde = jeu`; service `selectionRecommendations.ts` | Woo est la source runtime; pas de CSV. |
| Modifier les produits de packs vendables | WooCommerce, attribut `pa_type_produit = pack` et type pack | Documenter dans docs Woo CDM. |
| Modifier le rendu liste selections | `SelectionsPageView.tsx` | Decouper en sections si besoin. |
| Modifier le CSS liste selections | `SelectionsPageView.module.css` | Garder avec vue/sections. |
| Modifier les libelles communs du detail selections | `selections.ts`, cle `detail` | Inclut breadcrumbs, filtre instrument, rappel de navigation et libelles Usage/Son. |
| Modifier le rendu detail selections | `SelectionDetailPageView.tsx` | Le rendu lit les libelles depuis `content/selections.ts`. |
| Modifier le CSS detail selections | `SelectionDetailPageView.module.css` | Probablement a simplifier en sections. |

## Guides

Route liste: `src/app/[locale]/guides/page.tsx`

Route detail: `src/app/[locale]/guides/[slug]/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier le titre/sous-titre de la page Guides | `src/content/guides.ts` | Emplacement final. |
| Modifier la liste des guides | WordPress via `getGuideCards` dans `src/modules/guides/services/wordpressGuides.ts` | Documenter clairement: contenu guide = WordPress. |
| Modifier le contenu d'un guide detail | WordPress GraphQL, champ `content` et champs guide CTA | Idem. |
| Modifier le rendu liste Guides | `GuidesPageView.tsx`, `GuideList.tsx`, `GuideCard.tsx` | Garder dans `features/guides` ou `components/guide`. |
| Modifier le CSS liste Guides | `GuidesPageView.module.css`, `GuideList.module.css`, `GuideCard.module.css` | Garder avec composants. |
| Modifier le rendu article guide | `GuideArticlePageView.tsx`, `GuideContent.tsx`, `GuideArticleBlocks.tsx` | Garder dans feature guides. |
| Modifier le CSS article guide | `GuideArticlePageView.module.css`, `GuideContent.module.css` | Garder avec composants. |

## Pages Legales Et Contact

Routes:

- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/mentions-legales/page.tsx`
- `src/app/[locale]/cgv/page.tsx`
- `src/app/[locale]/politique-confidentialite/page.tsx`

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier le texte Contact | `src/content/legal.ts`, constante `contactPageContent` | Route fine dans `contact/page.tsx`. |
| Modifier mentions legales | `legal.ts`, constante `legalNoticePageContent` | Route fine dans `mentions-legales/page.tsx`. |
| Modifier CGV | `legal.ts`, constante `termsOfSalePageContent` | Route fine dans `cgv/page.tsx`. |
| Modifier politique de confidentialite | `legal.ts`, constante `privacyPolicyPageContent` | Route fine dans `politique-confidentialite/page.tsx`. |
| Modifier le rendu commun de ces pages | `SimplePage.tsx` et `StaticPageContent.tsx` | Garder comme composants de page statique. |
| Modifier le CSS commun de ces pages | `SimplePage.module.css` | Garder. |

## Catalogue Demo / Starter

La demo catalogue n'est plus dans le repo Chant du Merle.

| Besoin | Aujourd'hui |
| --- | --- |
| Modifier l'exemple catalogue neutre | Repo `../maracuja-next-starter`, fichiers `src/content/catalog.ts`, `src/app/catalogue/page.tsx` et `src/components/sections/CatalogPageView/*`. |
| Modifier le catalogue reel CDM | Pages CDM `/cordes`, `/accessoires` et `/produits/[slug]`, avec donnees WordPress/WooCommerce. |

## Commerce Et Woo

| Besoin | Aujourd'hui | A simplifier |
| --- | --- | --- |
| Modifier l'endpoint ajout panier cote front | `AddToCartButton.tsx`, constante `/wp-json/cdm/v1/cart/add` | Deplacer config commerce dans `features/commerce` ou `integrations/woocommerce`. |
| Modifier l'endpoint compteur panier | `MainNav.tsx`, constante `/wp-json/cdm/v1/cart` | Isoler hors de la navigation. |
| Modifier l'API panier Woo cote WordPress | `woo-backend/wp-content/mu-plugins/chantdumerle-commerce-bridge.php` | Garder dans repo CDM/backend, pas starter. |
| Modifier les routes proxifiees Woo | `next.config.ts` et `src/proxy.ts` | Garder dans CDM, documenter comme integration Woo. |
| Modifier panier/commande/mon-compte | WooCommerce, routes proxifiees `/panier`, `/commande`, `/mon-compte` | Ne pas chercher dans Next. |

## Images Et Assets

| Besoin | Aujourd'hui |
| --- | --- |
| Logo CDM | `public/images/brand/logo-cdm.png` |
| Hero home | `public/images/brand/hero-home.png` |
| Hero cordes | `public/images/hero-cordes.png` |
| Hero accessoires | `public/images/hero-accessoires.png` |
| Hero selections | `public/images/hero-selections.png` |
| Hero guides | `public/images/hero-guides.png` |
| Icones instruments | `public/icons/icon-violin.png`, `icon-viola.png`, `icon-cello.png`, `icon-db.png` |
| Image atelier home | `public/images/bow-ivo-incidit.jpg` |
| Image references produits home | `public/images/violin-head.jpg` |

## CSS: Ou Chercher En Premier

| Type de modification | Chercher ici d'abord |
| --- | --- |
| Couleur, typo, taille globale, radius, espace tokenise | `src/styles/tokens.css` |
| Style HTML global, reset, body, h1/h2/h3 | `src/app/globals.css` |
| Largeur de page | `Container.module.css` |
| Padding vertical des sections | `Section.module.css` |
| Hero commun | `Hero.module.css` |
| Header/nav/footer | `Header.module.css`, `MainNav.module.css`, `MobileMenu.module.css`, `Footer.module.css` |
| Cartes generiques | `Card.module.css`, `LinkCard.module.css` |
| Grilles d'entree | `EntryGrid.module.css` |
| Grille produits | `ProductGrid.module.css`, `ProductCard.module.css` |
| Page Cordes | `StringsPageView.module.css` |
| Page Accessoires | `AccessoriesPageView.module.css` |
| Page Selections | `SelectionsPageView.module.css` |
| Detail Selections | `SelectionDetailPageView.module.css` |
| Fiche produit | `ProductDetail.module.css`, `ProductGallery.module.css`, `AddToCartButton.module.css` |
| Guides | `GuidesPageView.module.css`, `GuideList.module.css`, `GuideCard.module.css`, `GuideContent.module.css` |
| Pages legales/contact | `SimplePage.module.css` |

## Zones A Corriger En Priorite

1. Contenu CDM: garder les textes locaux dans `src/content/*` et eviter de les remettre dans les routes ou vues.
2. Pages legales/contact: relire juridiquement les textes avant publication
   finale, surtout la mediation.
3. Cordes/accessoires: parsing de query params dans les routes, a extraire.
4. Produits: `wordpressProducts.ts` concentre trop de roles.
5. CSS: les overrides `.hero.hero` indiquent que certaines variantes devraient
   etre explicites.
