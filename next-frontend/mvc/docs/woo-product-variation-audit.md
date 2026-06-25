# Audit Produits Variables Woo

Date: 2026-06-23

## Question

Le site affiche parfois plusieurs cartes qui ressemblent au meme produit,
notamment selon la taille, la tension ou l'attache.

Objectif de l'audit: verifier si le front de Chant du Merle decompose des
variations, ou si WooCommerce contient deja des produits simples separes la ou
on attendrait des produits variables.

## Conclusion Courte

Le probleme vient principalement de la donnee Woo, pas seulement du composant
front.

La page Cordes lit les produits via la Store API Woo et affiche les produits
retournes. Or Woo contient beaucoup de cordes comme produits `simple` avec
`parent = 0`, meme quand leur nom correspond clairement a une declinaison de
taille, tension ou attache.

Exemple constate:

- `Optima Protos – Medium – 1/2 – Mi – Boule`
- `Optima Protos – Medium – 1/4 – Mi – Boule`
- `Optima Protos – Medium – 1/8 – Mi – Boule`
- `Optima Protos – Medium – 3/4 – Mi – Boule`
- `Optima Protos – Medium – 4/4 – Mi – Boule`

Ces lignes sont des produits Woo `simple`, pas des variations rattachees a un
parent variable.

## Chiffres Locaux

Base locale `chantdumerle_wp`:

| Objet Woo | Nombre |
| --- | ---: |
| `product` | 1963 |
| `product_variation` | 709 |
| parents `simple` | 1753 |
| parents `variable` | 207 |

Pour les produits parents ayant `pa_corde = jeu`:

| Type Woo | Nombre |
| --- | ---: |
| `simple` | 413 |
| `variable` | 36 |

Parmi ces produits `pa_corde = jeu`, `274` produits simples n'ont pas
d'attribut metier `pa_type_produit`. La doc commerce dit pourtant que la page
Cordes devrait afficher les jeux vendables via:

```txt
pa_type_produit = jeu-complet, jeu-compose
```

Le code actuel de la page Cordes filtre surtout par:

```txt
pa_corde = jeu
```

avec `completeSetsOnly = true`.

## Regle Metier Retrouvee

La modelisation Woo indique que ces attributs peuvent etre des variations:

- `pa_taille`;
- `pa_corde`;
- `pa_tension`;
- `pa_attache`;
- parfois `pa_instrument`;
- parfois `pa_filage`.

Donc l'intention existe bien: si prix ou stock changent selon taille/tension,
ces valeurs peuvent etre des variations sous un parent Woo.

## Definition Operationnelle Produit / Variante

Un **produit parent** doit representer une offre commerciale lisible par le
client:

- un modele de corde ou un jeu clairement identifie;
- une promesse produit stable: marque, gamme, instrument, type de produit,
  corde ou jeu, tension principale;
- une page produit unique ou le client comprend ce qu'il achete.

Une **variante** doit representer un choix vendable de cette meme offre:

- taille;
- tension quand elle decline le meme modele;
- attache;
- corde dans le cas d'un jeu compose ou d'une corde seule declinee;
- toute combinaison qui change le SKU, le stock ou le prix sans changer le
  produit commercial de base.

Un nouveau produit separe est justifie seulement si le client doit comprendre
une offre differente: autre gamme, autre matiere, autre instrument, autre type
de produit, autre role musical ou autre construction commerciale.

Application directe:

- `Optima Protos - Medium` pour alto devrait etre un parent commercial;
- les tailles `12"`, `13"`, `14"`, etc. devraient etre des variations;
- les produits `CDM-SET-*` generes a partir de cordes d'un jeu deja existant ne
  doivent pas devenir des produits autonomes s'ils representent seulement les
  tailles ou compositions vendables du meme jeu;
- s'il manque les enfants Woo du produit original, il faut les creer ou les
  rattacher, pas multiplier des fiches produit concurrentes.

## Ce Qui N'Est Pas A Faire

Ne pas corriger en masquant simplement les doublons cote front.

Raison: deux produits qui se ressemblent peuvent representer des choses
differentes:

- corde seule;
- jeu complet;
- jeu compose;
- variation de taille;
- variation de tension;
- variation d'attache;
- ancien import encore present;
- nouveau produit CDM `CDM-SET-*`.

Un dedoublonnage brutal par nom, marque ou modele risquerait de cacher des
produits vendables.

## Pistes De Correction

1. Corriger la donne Woo avant de durcir le filtre Cordes:
   - `pa_type_produit = jeu-complet, jeu-compose` est la cible metier;
   - ce filtre ne doit pas encore etre obligatoire cote front, car des jeux
     originaux vendables n'ont pas cet attribut;
   - le runtime garde donc `pa_corde = jeu` jusqu'a reparation Woo.

2. Auditer les produits simples sans `pa_type_produit`:
   - `274` produits `simple` avec `pa_corde = jeu` n'ont pas de type produit;
   - certains sont probablement d'anciens imports ou des cordes seules mal
     typées.

3. Decider la granularite Woo:
   - un jeu complet peut rester simple si chaque combinaison est un produit
     vraiment distinct;
   - si taille/tension/attache sont des choix du meme produit commercial, il
     faut un parent variable et des variations;
   - les cordes seules peuvent aussi etre variables par taille/tension/attache
     selon les cas.

4. Ajouter un controle qualite avant import:
   - detecter les groupes meme marque/modele/instrument/corde avec plusieurs
     tailles ou tensions;
   - signaler s'ils sont simples alors qu'ils devraient etre variables;
   - ne pas modifier automatiquement sans validation metier.

## Prochaine Action Recommandee

Faire une action courte et sure cote donnees:

1. regrouper les produits par marque, modele, instrument, corde/jeu et tension;
2. identifier les groupes qui contiennent plusieurs tailles ou SKU
   `CDM-SET-*`;
3. separer les vrais parents Woo, les variations manquantes et les doublons;
4. seulement ensuite muter Woo ou l'import.

Cette action evitera de compenser une modelisation Woo fausse par une logique
front fragile.

## Correction Runtime Ajustee

Sauvegarde avant modification:

```txt
backups/2026-06-23-woo-cordes-filter/
backups/2026-06-23-strings-search-gate/
```

Premier essai annule partiellement:

```txt
pa_type_produit = jeu-complet, jeu-compose
```

Ce filtre etait trop strict pour la base actuelle: il cachait des jeux complets
originaux qui n'ont pas encore `pa_type_produit`, par exemple `CDM-B6330C` et
`CDM-4BCBFC`.

Correction runtime actuelle:

- la landing `/fr/cordes` n'affiche plus tous les produits par defaut;
- les resultats apparaissent seulement apres entree instrument/son/usage ou
  application d'un filtre;
- la requete runtime garde `pa_corde = jeu` pour ne pas exclure les jeux
  originaux mal types;
- les filtres `corde`, `taille` et `tension` ne sont plus affiches dans la
  recherche des jeux complets, car ils sont ignores par cette route.

Validation locale:

| Verification | Resultat |
| --- | --- |
| `/fr/cordes` sans filtre | pas de liste produit, message de recherche |
| `/fr/cordes?instrument=alto&prefilter=instrument` | resultats affiches |
| `./node_modules/.bin/tsc --noEmit` | OK |

## Correction Fiche Produit Variable

Sauvegarde avant modification:

```txt
backups/2026-06-23-product-variations-ui/
```

Correction appliquee:

- la fiche produit prefere maintenant le parent Woo quand le Store API renvoie
  a la fois un parent variable et une variation avec le meme slug;
- les attributs variables Woo (`has_variations`) sont transformes en champs de
  selection lisibles;
- les variations Woo disponibles sont conservees avec leur identifiant produit;
- le bouton d'ajout au panier envoie l'identifiant de la variation choisie, ce
  qui permet au bridge Woo local de reconstruire `variation_id` et
  `variation` cote panier.

Exemple valide localement:

```txt
/fr/produits/optima-protos-la-medium
```

La page affiche une seule fiche produit avec les choix `Modele`, `Instrument`,
`Corde`, `Taille` et `Tension`. Le bouton reste bloque tant qu'aucune
combinaison valide n'est choisie.

Validation locale:

| Verification | Resultat |
| --- | --- |
| Page produit variable `/fr/produits/optima-protos-la-medium` | HTTP 200 |
| Selecteurs de variante rendus dans le HTML | OK |
| Variations Woo disponibles dans les props serveur | OK |
| `./node_modules/.bin/tsc --noEmit` | OK |
| `npm run lint` | OK |
| `npm run build` | OK |

Limite importante:

Cette correction regle l'affichage des vrais produits variables Woo. Elle ne
convertit pas les produits `simple` mal modelises en produits variables. Les
produits simples dupliques par taille, tension ou attache restent un chantier
de donnees Woo/import.

## Correctif UX Des Variantes

Constat apres test manuel:

- Woo marque parfois plusieurs attributs comme `has_variations`;
- certains de ces attributs sont pourtant constants sur toutes les variations;
- exemple: `Optima Protos - La - Medium` varie seulement par `Taille`, alors
  que `Modele`, `Instrument`, `Corde` et `Tension` sont constants.

Correction appliquee:

- la fiche n'affiche plus que les attributs qui ont vraiment plusieurs valeurs
  dans les variations disponibles;
- le matching de variation compare seulement les attributs choisis par le
  client, pas les attributs constants caches;
- les variations sont enrichies depuis la Store API par ID pour exposer leur
  SKU, prix et stock;
- la zone d'achat est rendue cote client pour que le choix de variante mette a
  jour les informations visibles de la fiche;
- le timeout Store API passe a `25000ms`, comme GraphQL, car la Store API
  locale repond parfois en plus de 8 secondes sur les fiches produit.

Exemple verifie:

```txt
/fr/produits/optima-protos-la-medium
```

Resultat attendu:

- un seul select visible: `Taille`;
- options visibles: `1/2`, `1/4`, `1/8`, `3/4`, `4/4`;
- les variations Woo restent disponibles cote client avec leurs IDs
  `2923`, `2924`, `2925`, `2926`, `2927`.
- la variation `4/4` met a jour la fiche avec le SKU `CDM-1E2324` et son stock
  propre.

## Exemple De Produits Encore Mal Modelises

Les slugs suivants ne sont pas des variantes Woo:

```txt
/fr/produits/optima-protos-medium-7
/fr/produits/optima-protos-medium-13
/fr/produits/optima-protos-medium-15
```

Ils sont actuellement des produits Woo `simple`, `parent = 0`, sans variations.
Leur difference visible est la taille d'alto, mais Woo les expose comme trois
produits independants.

Autre signal du meme probleme:

```txt
CDM-SET-VLA-30
```

Ce produit est aussi un `simple` independant. Il semble avoir ete regenere comme
jeu compose a partir de cordes Protos, alors que des jeux complets originaux
existaient deja (`CDM-B6330C`, `CDM-4BCBFC`). Ces `CDM-SET-*` ne devraient pas
cohabiter comme nouveaux produits separes si le produit original devait porter
les variations de taille.

Conclusion: ce cas ne peut pas etre corrige proprement uniquement dans le front.
Il faut reparer l'import ou la modelisation Woo pour creer un parent variable
`Optima Protos - Medium` avec une variation par taille.

## Audit Vrais Parents Woo

Les sorties CSV/JSON temporaires et le script d'audit ont ete retires du repo.
Les cas utiles pour decision metier sont conserves ici:

```txt
docs/woo-string-parent-review-cases.md
```

Resultat global:

| Mesure | Resultat |
| --- | --- |
| Produits Cordes scannes | 1612 |
| Groupes signales | 288 |
| Parents clairs avec variantes a rattacher | 17 |
| Variantes probables mais parent ambigu | 9 |
| Groupes sans parent clair | 136 |
| Groupes a revue manuelle | 120 |
| Doublons de parents sans axe de variation clair | 6 |

Cas Optima Protos alto:

```txt
group_key: optima|protos|alto|jeu|moyenne
status: variants_to_attach_parent_ambiguous
```

Produits simples pouvant etre le parent commercial:

```txt
CDM-0C2389
CDM-4BCBFC
CDM-75740C
CDM-9EA3D1
CDM-B6330C
CDM-BF72B0
```

Produits `CDM-SET-*` identifies comme variantes probables par taille:

```txt
CDM-SET-VLA-29
CDM-SET-VLA-30
CDM-SET-VLA-31
CDM-SET-VLA-32
CDM-SET-VLA-33
CDM-SET-VLA-34
```

Conclusion specifique:

- les `CDM-SET-VLA-*` ne doivent pas rester des produits autonomes si l'offre
  commerciale est bien `Optima Protos - Medium` pour alto;
- avant mutation Woo, il faut choisir quel produit simple devient le parent a
  conserver;
- les autres produits simples identiques doivent etre fusionnes, supprimes ou
  convertis selon leur historique reel;
- pour choisir, utiliser `docs/woo-string-parent-review-cases.md`, qui sort les
  resultats et les attributs visibles de chaque candidat.
- les variations doivent porter la taille, le SKU, le prix et le stock.
