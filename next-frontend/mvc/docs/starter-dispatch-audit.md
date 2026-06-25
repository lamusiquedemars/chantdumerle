# Audit Dispatch Starter / Chant Du Merle

Date: 2026-06-23

## Objectif

Verifier, apres le nettoyage des services metier, ce qui doit vivre dans:

- le starter `maracuja-next-starter`;
- le site Chant du Merle;
- une documentation ou decision ulterieure.

La regle reste la meme: on ne copie pas une couche parce qu'elle existe. On
deplace ou aligne seulement ce qui rendra le prochain projet plus simple.

## Etat Constate

Le site Chant du Merle est maintenant plus clair cote contenu, CSS et services.
Le starter est bien neutre: pas de WooCommerce, pas de WordPress obligatoire,
pas de routes metier CDM.

Le point principal n'est donc plus la contamination metier. C'est plutot
l'alignement des composants generiques: certains composants ont ete ameliores
dans CDM pendant le nettoyage, alors que le starter garde parfois une version
plus ancienne ou un doublon.

## A Garder Dans Chant Du Merle

Ces elements sont specifiques au site et ne doivent pas etre copies dans le
starter:

| Element | Decision | Raison |
| --- | --- | --- |
| `src/content/*` CDM | Reste CDM | Textes, cartes, images et parcours du site. |
| `src/modules/catalog` | Reste CDM | Logique Woo, filtres cordes/accessoires, fiche produit. |
| `src/modules/selections` | Reste CDM | Parcours usage/son/packs lie aux attributs Woo. |
| `src/modules/guides` | Reste CDM | Lecture des guides WordPress et rendu editorial du site. |
| `src/integrations/woocommerce` | Reste CDM | Integration externe metier. |
| `src/lib/wordpress` | Reste CDM pour l'instant | Le starter ne doit pas imposer WordPress. A reintroduire seulement comme exemple optionnel. |
| Fonds `catalogIntro`, `catalogResults` dans `Section` | Reste CDM | Noms lies au catalogue CDM, pas assez generiques. |
| Assets `public/images` et `public/icons` CDM | Reste CDM | Identite visuelle et navigation specifique. |

## Deja Correct Dans Le Starter

Le starter contient deja les fondations utiles:

| Element | Etat |
| --- | --- |
| Layout, `Container`, `Header`, `Footer`, `MainNav` | Present et neutre. |
| UI: `Button`, `Badge`, `Card`, `Breadcrumbs`, `LinkCard`, `SectionHeading` | Present et neutre. |
| Blocs: `Hero`, `TextBlock`, `PageHeader`, `EntryGrid` | Present, mais certains peuvent etre alignes avec CDM. |
| `src/content/site.ts`, `home.ts`, `catalog.ts` | Present comme exemple local clair. |
| Route `/catalogue` neutre | Present, sans Woo/WordPress. |
| README | Explique deja "ou modifier quoi". |

## A Aligner Dans Le Starter

Ces points meritent une action concrete dans `maracuja-next-starter`.

| Priorite | Action | Raison |
| --- | --- | --- |
| Haute | Fusionner `CardGrid` dans `EntryGrid` | Les deux composants font presque la meme chose. CDM a deja retire `CardGrid` comme doublon. |
| Haute | Aligner `Hero` avec des variantes generiques | CDM a gagne `variant`, `align`, `height`, `backgroundImage`, `backgroundPosition`. Le starter peut garder une version neutre de ces props. |
| Moyenne | Aligner `Section` avec `padding` generique | CDM a resolu les overrides via une prop. Le starter peut reprendre `padding="default|tight|intro"` sans noms catalogue. |
| Moyenne | Evaluer `MobileMenu` | Present dans CDM, absent du starter. Utile seulement si le starter veut une navigation mobile complete. |
| Basse | Ajouter une doc courte "choisir le bon bloc" | Utile apres fusion `CardGrid`/`EntryGrid`, pour eviter de recreer un doublon. |

## Decision Pour La Prochaine Action

Commencer par le starter, car c'est la partie reutilisable:

1. supprimer `CardGrid` du starter;
2. convertir la home starter pour utiliser `EntryGrid`;
3. garder un seul type de carte d'entree;
4. valider `npm run lint` et `npm run build` dans le starter;
5. mettre a jour ce tracker.

Cette action ne touche pas Chant du Merle: elle nettoie uniquement la base
reutilisable pour eviter que le doublon revienne dans un prochain site.
