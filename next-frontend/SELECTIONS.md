# Le Chant du Merle — Entrées de navigation par son, usage et sélections

## Contexte

La home du site contient déjà plusieurs portes d’entrée commerciales :

* Entrer par instrument
* Je recherche un son : chaud, équilibré, brillant
* Entrer par niveau / usage : étudiant, orchestre, avancé / soliste
* Sélections prêtes à jouer
* Quelques références
* Guides
* Accessoires

Aujourd’hui, ces entrées existent visuellement, mais elles doivent devenir de vraies entrées produit reliées aux attributs WooCommerce.

Codex a accès à la base de données WooCommerce. Il ne faut donc pas recréer les données en dur dans le code. Il faut utiliser les attributs produits déjà préparés/importés dans Woo.

## Objectif

Transformer les cartes de la home en vraies portes d’entrée vers des listes de produits filtrées ou vers des pages de sélection.

Le site ne doit pas fonctionner comme un simple catalogue massif. Il doit guider le musicien selon des critères compréhensibles :

* instrument
* type de son recherché
* usage musical
* stabilité / durabilité / temps de rodage
* besoin de projection ou de rondeur
* sélection prête à jouer
* jeu composé recommandé

## Attributs WooCommerce à exploiter

Les attributs principaux à utiliser sont :

```txt
pa_instrument
pa_profil_sonore
pa_usage_musicien
pa_positionnement_prix
pa_complexite_sonore
pa_puissance_sonore
pa_reponse
pa_durabilite
pa_stabilite_accord
pa_temps_rodage
pa_type_produit
```

Valeurs principales attendues :

```txt
pa_instrument:
violon | alto | violoncelle | contrebasse

pa_profil_sonore:
chaud | equilibre | brillant

pa_usage_musicien:
etudiant | orchestre | soliste

pa_positionnement_prix:
entry | intermediate | premium

pa_complexite_sonore:
pur | equilibre | complexe

pa_puissance_sonore:
doux | equilibre | puissant

pa_reponse:
douce | rapide

pa_durabilite:
faible | moyenne | haute

pa_stabilite_accord:
faible | bonne | excellente

pa_temps_rodage:
court | moyen | long

pa_type_produit:
corde-seule | jeu-complet | jeu-compose | colophane | pack | archet | accessoire
```

Attention : les labels affichés et importés peuvent être en français (`jeu composé`), mais les slugs techniques doivent être ceux de Woo (`jeu-compose`).

## Entrées par son

Les cartes de la home :

```txt
Chaud
Équilibré
Brillant
```

doivent pointer vers des listes de cordes filtrées par `pa_profil_sonore`.

Routes possibles :

```txt
/fr/cordes?son=chaud
/fr/cordes?son=equilibre
/fr/cordes?son=brillant
```

ou, si le projet préfère des pages propres :

```txt
/fr/cordes/son-chaud
/fr/cordes/son-equilibre
/fr/cordes/son-brillant
```

La première option est plus simple si la page `/cordes` possède déjà une logique de filtres.

Chaque page ou état filtré doit afficher :

* une intro courte expliquant le type de son ;
* les produits correspondants ;
* la possibilité de filtrer ensuite par instrument ;
* si possible, un tri éditorial par pertinence.

Exemples de logique :

```txt
son=chaud
→ pa_profil_sonore = chaud

son=equilibre
→ pa_profil_sonore = equilibre

son=brillant
→ pa_profil_sonore = brillant
```

## Entrées par usage musicien

Les cartes actuelles :

```txt
Étudiant
Orchestre
Avancé / Soliste
```

doivent exploiter `pa_usage_musicien`.

Routes possibles :

```txt
/fr/cordes?usage=etudiant
/fr/cordes?usage=orchestre
/fr/cordes?usage=soliste
```

ou :

```txt
/fr/selections/etudiant
/fr/selections/orchestre
/fr/selections/soliste
```

Il faut distinguer deux cas :

### 1. Filtre simple

La page affiche tous les produits dont :

```txt
pa_usage_musicien = etudiant
```

ou :

```txt
pa_usage_musicien = orchestre
```

ou :

```txt
pa_usage_musicien = soliste
```

### 2. Sélection éditoriale

La page affiche une sélection plus guidée, avec un texte d’introduction et des produits choisis selon plusieurs critères.

Exemple pour “Étudiant” :

```txt
pa_usage_musicien = etudiant
+ pa_stabilite_accord = bonne ou excellente
+ pa_temps_rodage = court
+ pa_positionnement_prix = entry ou intermediate
```

Exemple pour “Soliste” :

```txt
pa_usage_musicien = soliste
+ pa_puissance_sonore = puissant
+ pa_reponse = rapide
+ pa_complexite_sonore = equilibre ou complexe
```

Mon avis : commencer par le filtre simple, puis enrichir avec des pages de sélection éditoriale.

## Croisements utiles

Le site doit pouvoir afficher des combinaisons de critères.

Exemples :

```txt
/fr/cordes?instrument=violon&son=chaud
/fr/cordes?instrument=violoncelle&usage=soliste
/fr/cordes?instrument=alto&son=equilibre&usage=etudiant
/fr/cordes?son=brillant&reponse=rapide
```

Cela permet de créer ensuite des liens éditoriaux sans ajouter des dizaines de pages codées à la main.

## Logique de recommandation simple

Une première logique de recommandation peut être construite sans moteur complexe.

Exemples :

### Cordes chaudes

Critères principaux :

```txt
pa_profil_sonore = chaud
```

Critères secondaires possibles :

```txt
pa_complexite_sonore = complexe
pa_puissance_sonore = doux ou equilibre
```

### Cordes équilibrées

Critères principaux :

```txt
pa_profil_sonore = equilibre
```

Critères secondaires possibles :

```txt
pa_reponse = rapide
pa_stabilite_accord = bonne ou excellente
```

### Cordes brillantes

Critères principaux :

```txt
pa_profil_sonore = brillant
```

Critères secondaires possibles :

```txt
pa_puissance_sonore = puissant
pa_reponse = rapide
```

### Cordes étudiant

Critères principaux :

```txt
pa_usage_musicien = etudiant
```

Critères secondaires recommandés :

```txt
pa_stabilite_accord = bonne ou excellente
pa_temps_rodage = court
pa_positionnement_prix = entry ou intermediate
```

### Cordes orchestre

Critères principaux :

```txt
pa_usage_musicien = orchestre
```

Critères secondaires recommandés :

```txt
pa_profil_sonore = equilibre ou chaud
pa_reponse = rapide
pa_durabilite = moyenne ou haute
```

### Cordes soliste

Critères principaux :

```txt
pa_usage_musicien = soliste
```

Critères secondaires recommandés :

```txt
pa_puissance_sonore = puissant
pa_reponse = rapide
pa_complexite_sonore = complexe
```

## Sélections prêtes à jouer

La section “Sélections prêtes à jouer” doit servir à proposer des ensembles plus guidés qu’un simple filtre.

Il y a deux types de sélections possibles.

## Type 1 — Sélection éditoriale

Une page éditoriale qui regroupe plusieurs produits recommandés.

Exemples :

```txt
/fr/selections/violon-etudiant-fiable
/fr/selections/violon-son-chaud
/fr/selections/violoncelle-projection-soliste
/fr/selections/alto-equilibre-orchestre
```

Ces pages peuvent être générées à partir d’une configuration simple :

```ts
const selections = [
  {
    slug: "violon-etudiant-fiable",
    title: "Violon — cordes fiables pour étudiant",
    instrument: "violon",
    filters: {
      pa_usage_musicien: "etudiant",
      pa_stabilite_accord: ["bonne", "excellente"],
      pa_temps_rodage: "court",
    },
  },
];
```

Le contenu éditorial doit rester court :

* à qui s’adresse la sélection ;
* ce qu’elle cherche à résoudre ;
* 3 à 6 produits recommandés ;
* éventuellement une alternative plus chaude / plus brillante / plus économique.

## Type 2 — Produit Woo “pack”

Un pack est un vrai produit vendable.

Exemples :

```txt
Pack corde + colophane
Pack archet + colophane
Pack cordes + colophane
Pack complet archet + cordes + colophane
```

Ces produits doivent avoir :

```txt
pa_type_produit = pack
```

et une composition technique, par exemple :

```txt
_pack_composition
```

La composition peut contenir des SKU ou des IDs Woo.

Exemple :

```json
[
  {
    "sku": "SKU_CORDE_1",
    "quantity": 1
  },
  {
    "sku": "SKU_COLOPHANE_1",
    "quantity": 1
  }
]
```

Il faudra décider si le pack est :

* un produit WooCommerce simple avec une composition affichée ;
* un produit bundle via extension WooCommerce ;
* une page de sélection qui ajoute plusieurs produits au panier.

Pour démarrer, la solution la plus simple est : page de sélection + bouton “ajouter les produits au panier” si techniquement raisonnable.

## Jeux composés

Les jeux composés sont un point fort potentiel du site.

Principe : proposer un jeu de cordes mélangé, construit à partir de cordes de marques ou modèles différents.

Exemples :

```txt
Mi Kaplan + A/D/G Evah Pirazzi
Larsen A/D + Spirocore G/C
Jargar A/D + Magnacore G/C
```

Un jeu composé doit avoir :

```txt
pa_type_produit = jeu composé
```

et une composition technique :

```txt
_set_composition
```

Exemple de structure JSON :

```json
{
  "instrument": "violon",
  "strings": {
    "mi": {
      "sku": "SKU_MI",
      "brand": "D'Addario",
      "model": "Kaplan"
    },
    "la": {
      "sku": "SKU_LA",
      "brand": "Pirastro",
      "model": "Evah Pirazzi"
    },
    "re": {
      "sku": "SKU_RE",
      "brand": "Pirastro",
      "model": "Evah Pirazzi"
    },
    "sol": {
      "sku": "SKU_SOL",
      "brand": "Pirastro",
      "model": "Evah Pirazzi"
    }
  }
}
```

Pour violoncelle :

```json
{
  "instrument": "violoncelle",
  "strings": {
    "la": {
      "sku": "SKU_LA"
    },
    "re": {
      "sku": "SKU_RE"
    },
    "sol": {
      "sku": "SKU_SOL"
    },
    "do": {
      "sku": "SKU_DO"
    }
  }
}
```

Le front doit afficher clairement :

* le nom du jeu composé ;
* la logique sonore ;
* les cordes incluses ;
* le prix total ;
* la possibilité d’ajouter chaque corde au panier ;
* idéalement un bouton pour ajouter tout le jeu.

## Différence entre filtre, sélection et pack

Ne pas mélanger ces trois notions.

### Filtre

Un filtre affiche des produits selon des attributs Woo.

Exemple :

```txt
Toutes les cordes chaudes pour violon.
```

### Sélection

Une sélection est une page éditoriale qui recommande quelques produits.

Exemple :

```txt
Trois choix fiables pour un violon d’étude.
```

### Pack

Un pack est un produit ou ensemble vendable.

Exemple :

```txt
Jeu de cordes + colophane.
```

## Priorité de développement conseillée

### Étape 1 — Brancher les entrées de la home sur les filtres

À faire :

* faire fonctionner `/fr/cordes?son=chaud`
* faire fonctionner `/fr/cordes?son=equilibre`
* faire fonctionner `/fr/cordes?son=brillant`
* faire fonctionner `/fr/cordes?usage=etudiant`
* faire fonctionner `/fr/cordes?usage=orchestre`
* faire fonctionner `/fr/cordes?usage=soliste`

### Étape 2 — Ajouter les croisements

À faire :

```txt
instrument + son
instrument + usage
son + usage
instrument + son + usage
```

### Étape 3 — Créer les premières pages de sélection

À faire :

```txt
/fr/selections/violon-etudiant
/fr/selections/violon-chaud
/fr/selections/violon-brillant
/fr/selections/violoncelle-orchestre
/fr/selections/violoncelle-soliste
```

### Étape 4 — Créer les premiers jeux composés

À faire seulement après validation des produits, SKU et stock.

### Étape 5 — Créer les packs vendables

À faire après décision technique :

* produit Woo simple ;
* bundle WooCommerce ;
* ajout multiple au panier.

## Contraintes importantes

Ne pas coder les listes de produits en dur dans la home.

Ne pas utiliser les catégories Woo pour remplacer les attributs de son ou d’usage.

Ne pas confondre `Type` WooCommerce avec le type commercial du produit.

Utiliser `pa_type_produit` pour distinguer :

```txt
corde seule
jeu complet
jeu composé
pack
colophane
accessoire
archet
```

Ne pas afficher des recommandations si les attributs produits sont absents ou incohérents.

Prévoir un fallback propre :

```txt
Aucun produit trouvé pour cette sélection.
```

ou :

```txt
Cette sélection est en cours de préparation.
```

## Points techniques à vérifier

Vérifier dans WPGraphQL / Woo GraphQL :

* récupération des produits par attribut global ;
* récupération des variations ;
* récupération des slugs d’attributs ;
* filtrage côté serveur ;
* pagination ;
* tri ;
* affichage du stock ;
* affichage du prix ;
* compatibilité avec les produits variables.

Vérifier aussi si la page `/cordes` actuelle accepte déjà des search params.

Exemple :

```ts
searchParams: {
  instrument?: string;
  son?: string;
  usage?: string;
}
```

## Mapping URL vers attribut Woo

Exemple simple :

```ts
const soundMap = {
  chaud: "chaud",
  equilibre: "equilibre",
  brillant: "brillant",
};

const usageMap = {
  etudiant: "etudiant",
  orchestre: "orchestre",
  soliste: "soliste",
};

const instrumentMap = {
  violon: "violon",
  alto: "alto",
  violoncelle: "violoncelle",
  contrebasse: "contrebasse",
};
```

Ces mappings doivent ensuite alimenter la requête produits.

## Exemple de logique de requête

Pseudo-code :

```ts
async function getStringProductsByFilters({
  locale,
  instrument,
  sound,
  usage,
}: {
  locale: string;
  instrument?: string;
  sound?: string;
  usage?: string;
}) {
  const filters = [];

  if (instrument) {
    filters.push({
      taxonomy: "pa_instrument",
      terms: [instrument],
    });
  }

  if (sound) {
    filters.push({
      taxonomy: "pa_profil_sonore",
      terms: [sound],
    });
  }

  if (usage) {
    filters.push({
      taxonomy: "pa_usage_musicien",
      terms: [usage],
    });
  }

  return fetchWooProducts({
    locale,
    filters,
    productType: "cordes",
  });
}
```

Adapter ce pseudo-code à la structure réelle du projet.

## Ajustements de la home

Les entrées actuelles peuvent rester dans leur forme, mais les `href` doivent pointer vers les vraies routes.

Exemple :

```ts
const soundEntries = [
  {
    label: "Chaud",
    href: `/${locale}/cordes?son=chaud`,
    description: "Pour arrondir le son, densifier les graves ou calmer un instrument trop clair.",
  },
  {
    label: "Équilibré",
    href: `/${locale}/cordes?son=equilibre`,
    description: "Pour garder un bon compromis entre clarté, rondeur et stabilité.",
  },
  {
    label: "Brillant",
    href: `/${locale}/cordes?son=brillant`,
    description: "Pour gagner en projection, en attaque et en présence.",
  },
];
```

Pour les usages :

```ts
const levelEntries = [
  {
    label: "Étudiant",
    href: `/${locale}/cordes?usage=etudiant`,
    description: "Cordes stables, fiables et faciles à vivre au quotidien.",
  },
  {
    label: "Orchestre",
    href: `/${locale}/cordes?usage=orchestre`,
    description: "Cordes régulières, homogènes et adaptées au jeu collectif.",
  },
  {
    label: "Avancé / Soliste",
    href: `/${locale}/cordes?usage=soliste`,
    description: "Cordes plus réactives, plus projetées, avec davantage de caractère.",
  },
];
```

## Critères d’acceptation

La fonctionnalité est correcte si :

* les cartes de la home ouvrent de vraies listes produits ;
* les résultats correspondent aux attributs Woo ;
* un produit “chaud” apparaît bien dans l’entrée “son chaud” ;
* un produit “étudiant” apparaît bien dans l’entrée “Étudiant” ;
* les filtres peuvent se combiner ;
* les routes ne cassent pas si aucun produit ne correspond ;
* les produits variables continuent d’afficher prix, image, SKU, stock et lien fiche ;
* le code ne contient pas de listes de produits figées ;
* les textes de la home restent courts et orientés musicien.

## Décision de départ

Commencer par :

```txt
/fr/cordes?son=chaud
/fr/cordes?son=equilibre
/fr/cordes?son=brillant
/fr/cordes?usage=etudiant
/fr/cordes?usage=orchestre
/fr/cordes?usage=soliste
```

Puis créer les pages de sélection une fois les filtres fiables.

Ne pas commencer par les packs ni les jeux composés tant que la logique de filtrage Woo n’est pas validée.
