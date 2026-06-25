# Architecture Commerce

## Responsabilites

Next gere les pages de decouverte : home, cordes, accessoires, selections,
guides et fiches produit editoriales. WooCommerce reste la source de verite
pour les prix, le stock, le panier, la commande, le compte client et les
paiements.

Le front ne doit jamais maintenir un panier miroir. Toute action d'achat doit
ecrire dans la session Woo native.

## Flux Panier

Depuis une fiche produit Next, le bouton d'ajout appelle :

```txt
POST /wp-json/cdm/v1/cart/add
```

Cet endpoint est fourni par le MU-plugin Woo
`woo-backend/wp-content/mu-plugins/chantdumerle-commerce-bridge.php`. Il charge
le panier Woo, valide le produit, ajoute la quantite demandee, force la
persistance de session et retourne le compteur.

Le compteur de navigation lit :

```txt
GET /wp-json/cdm/v1/cart
```

Ces appels doivent rester same-origin pour que les cookies Woo soient ceux du
panier, de la commande et de l'espace client.

## Routes Transactionnelles

Les routes suivantes appartiennent a Woo et sont proxyfiees par Next quand
`WOO_PROXY_TARGET`, `WOO_BASE_URL` ou `NEXT_PUBLIC_WP_URL` est configure :

```txt
/wp-json/*
/wp-content/*
/panier/*
/commande/*
/mon-compte/*
```

La navigation Next pointe directement vers `/panier/` et `/mon-compte/`. Le
theme Woo garde les liens de decouverte vers les pages Next.

## Catalogue

Les listings produits utilisent la Store API Woo pour les produits et
`products/collection-data` pour les filtres dynamiques.

La page cordes affiche uniquement les jeux vendables :

```txt
pa_type_produit = jeu-complet, jeu-compose
```

Les facettes instrument, marque, son, usage, corde, taille et tension restent
dynamiques : chaque selection reduit les options disponibles.

Les accessoires restent sur une page separee et sont regroupes via
`pa_type_produit`.

## Selections Et Packs

Les selections sont des produits Woo. Les pages detail `usage` et `son`
chargent les jeux via les attributs `pa_usage`, `pa_profil_sonore` et
`pa_corde = jeu`; le CSV d'import ne fait pas partie du runtime front.

Les packs sont vendables : ils doivent etre modelises comme produits Woo avec
`pa_type_produit = pack` et utiliser le meme endpoint panier que les autres
produits.
