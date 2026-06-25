# Cas A Decider - Parents Cordes Woo

Date: 2026-06-23

But: fournir une liste lisible des groupes ou Woo contient plusieurs produits
qui semblent representer la meme offre commerciale, ou des produits simples qui
devraient probablement devenir des variations. Ce document remplace les CSV/JSON
temporaires d'audit.

Lecture rapide:

- `recommended_parent`: candidat technique propose par l'audit, pas une decision
  metier.
- `duplicate_parent_candidate`: autre produit tres proche; a conserver,
  fusionner, archiver ou convertir selon decision.
- `variation_candidate`: produit simple qui ressemble a une variation, souvent
  par taille.
- Les attributs vides sont affiches avec `-`; justement, un attribut manquant
  peut expliquer pourquoi Woo a demultiplie les produits.

## Resume

| Type de cas | Nombre |
| --- | ---: |
| Parent ambigu avec variantes probables | 9 |
| Doublons de parents sans axe clair | 6 |

## optima / protos / alto / jeu / moyenne

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-0C2389`
- Tailles detectees: 11 | 12 | 13 | 14 | 15-2 | 16
- Candidats parents: CDM-0C2389 | CDM-4BCBFC | CDM-75740C | CDM-9EA3D1 | CDM-B6330C | CDM-BF72B0
- Variantes possibles: CDM-SET-VLA-29 | CDM-SET-VLA-30 | CDM-SET-VLA-31 | CDM-SET-VLA-32 | CDM-SET-VLA-33 | CDM-SET-VLA-34
- Doublons possibles: CDM-4BCBFC | CDM-75740C | CDM-9EA3D1 | CDM-B6330C | CDM-BF72B0
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-0C2389 | optima-protos-medium-5 | Optima Protos - Medium | optima | protos | alto | jeu | - | moyenne | - | - | 40.6 | 15.000000 |
| duplicate_parent_candidate | CDM-4BCBFC | optima-protos-medium-6 | Optima Protos - Medium | optima | protos | alto | jeu | - | moyenne | - | - | 39.54 | 1.000000 |
| duplicate_parent_candidate | CDM-75740C | optima-protos-medium-2 | Optima Protos - Medium | optima | protos | alto | jeu | - | moyenne | - | - | 39.54 | 14.000000 |
| duplicate_parent_candidate | CDM-9EA3D1 | optima-protos-medium-3 | Optima Protos - Medium | optima | protos | alto | jeu | - | moyenne | - | - | 39.54 | 12.000000 |
| duplicate_parent_candidate | CDM-B6330C | optima-protos-medium-7 | Optima Protos - Medium | optima | protos | alto | jeu | - | moyenne | - | - | 39.54 | 4.000000 |
| duplicate_parent_candidate | CDM-BF72B0 | optima-protos-medium-4 | Optima Protos - Medium | optima | protos | alto | jeu | - | moyenne | - | - | 39.54 | 12.000000 |
| variation_candidate | CDM-SET-VLA-29 | optima-protos-medium-11 | Optima Protos - Medium - 11" | optima | protos | alto | jeu | 11 | moyenne | - | jeu-complet | 39.45 | 12 |
| variation_candidate | CDM-SET-VLA-30 | optima-protos-medium-12 | Optima Protos - Medium - 12" | optima | protos | alto | jeu | 12 | moyenne | - | jeu-complet | 39.45 | 3 |
| variation_candidate | CDM-SET-VLA-31 | optima-protos-medium-13 | Optima Protos - Medium - 13" | optima | protos | alto | jeu | 13 | moyenne | - | jeu-complet | 39.45 | 8 |
| variation_candidate | CDM-SET-VLA-32 | optima-protos-medium-14 | Optima Protos - Medium - 14'' | optima | protos | alto | jeu | 14 | moyenne | - | jeu-complet | 39.45 | 0 |
| variation_candidate | CDM-SET-VLA-33 | optima-protos-medium-15 | Optima Protos - Medium - 15'' | optima | protos | alto | jeu | 15-2 | moyenne | - | jeu-complet | 39.45 | 13 |
| variation_candidate | CDM-SET-VLA-34 | optima-protos-medium-16 | Optima Protos - Medium - 16'' | optima | protos | alto | jeu | 16 | moyenne | - | jeu-complet | 39.45 | 3 |

## thomastik / dominant / alto / jeu / moyenne

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-2065B3`
- Tailles detectees: 12 | 14 | 15-2 | 16 | 16-5 | 17
- Candidats parents: CDM-2065B3 | CDM-9CEBFF | CDM-CB7482 | CDM-EDB7CD | CDM-EF1B81 | CDM-F36AD4
- Variantes possibles: CDM-SET-VLA-40 | CDM-SET-VLA-41 | CDM-SET-VLA-42 | CDM-SET-VLA-43 | CDM-SET-VLA-44 | CDM-SET-VLA-45
- Doublons possibles: CDM-9CEBFF | CDM-CB7482 | CDM-EDB7CD | CDM-EF1B81 | CDM-F36AD4
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-2065B3 | thomastik-dominant-medium-3 | Thomastik Dominant - Medium | thomastik | dominant | alto | jeu | - | moyenne | - | - | 126.55 | 0.000000 |
| duplicate_parent_candidate | CDM-9CEBFF | thomastik-dominant-medium-7 | Thomastik Dominant - Medium | thomastik | dominant | alto | jeu | - | moyenne | - | - | 126.55 | 4.000000 |
| duplicate_parent_candidate | CDM-CB7482 | thomastik-dominant-medium-2 | Thomastik Dominant - Medium | thomastik | dominant | alto | jeu | - | moyenne | - | - | 125.7 | 0.000000 |
| duplicate_parent_candidate | CDM-EDB7CD | thomastik-dominant-medium-4 | Thomastik Dominant - Medium | thomastik | dominant | alto | jeu | - | moyenne | - | - | 126.25 | 0.000000 |
| duplicate_parent_candidate | CDM-EF1B81 | thomastik-dominant-medium-6 | Thomastik Dominant - Medium | thomastik | dominant | alto | jeu | - | moyenne | - | - | 126.55 | 4.000000 |
| duplicate_parent_candidate | CDM-F36AD4 | thomastik-dominant-medium-5 | Thomastik Dominant - Medium | thomastik | dominant | alto | jeu | - | moyenne | - | - | 126.55 | 8.000000 |
| variation_candidate | CDM-SET-VLA-40 | thomastik-dominant-medium-12 | Thomastik Dominant - Medium - 12 | thomastik | dominant | alto | jeu | 12 | moyenne | - | jeu-complet | 126.56 | 3 |
| variation_candidate | CDM-SET-VLA-41 | thomastik-dominant-medium-14 | Thomastik Dominant - Medium - 14 | thomastik | dominant | alto | jeu | 14 | moyenne | - | jeu-complet | 126.56 | 2 |
| variation_candidate | CDM-SET-VLA-42 | thomastik-dominant-medium-15 | Thomastik Dominant - Medium - 15 | thomastik | dominant | alto | jeu | 15-2 | moyenne | - | jeu-complet | 126.56 | 0 |
| variation_candidate | CDM-SET-VLA-43 | thomastik-dominant-medium-16 | Thomastik Dominant - Medium - 16 | thomastik | dominant | alto | jeu | 16 | moyenne | - | jeu-complet | 126.56 | 0 |
| variation_candidate | CDM-SET-VLA-44 | thomastik-dominant-medium-16-5 | Thomastik Dominant - Medium - 16.5 | thomastik | dominant | alto | jeu | 16-5 | moyenne | - | jeu-complet | 126.26 | 1 |
| variation_candidate | CDM-SET-VLA-45 | thomastik-dominant-medium-17 | Thomastik Dominant - Medium - 17 | thomastik | dominant | alto | jeu | 17 | moyenne | - | jeu-complet | 125.71 | 1 |

## daddario / d-addario-helicore / alto / jeu / moyenne

- Statut audit: `duplicate_parent_candidates`
- Produit recommande techniquement: `CDM-09DBDB`
- Tailles detectees: -
- Candidats parents: CDM-09DBDB | CDM-C509C6 | CDM-FA3F43
- Variantes possibles: -
- Doublons possibles: CDM-C509C6 | CDM-FA3F43
- Pourquoi il faut decider: Plusieurs candidats parents avec les memes axes commerciaux et peu ou pas de variation visible.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-09DBDB | daddario-helicore-medium-2 | D'Addario Helicore - Medium | daddario | d-addario-helicore | alto | jeu | - | moyenne | - | - | 92.18 | 6.000000 |
| duplicate_parent_candidate | CDM-C509C6 | daddario-helicore-medium | D'Addario Helicore - Medium | daddario | d-addario-helicore | alto | jeu | - | moyenne | - | - | 92.18 | 1.000000 |
| duplicate_parent_candidate | CDM-FA3F43 | daddario-helicore-medium-3 | D'Addario Helicore - Medium | daddario | d-addario-helicore | alto | jeu | - | moyenne | - | - | 92.18 | 3.000000 |

## thomastik / vision / violon / jeu / moyenne

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-1B5EF2`
- Tailles detectees: 1-10 | 4-4
- Candidats parents: CDM-1B5EF2 | CDM-E5C0B9 | CDM-72F66C
- Variantes possibles: CDM-E5C0B9 | CDM-72F66C
- Doublons possibles: CDM-E5C0B9 | CDM-72F66C
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-1B5EF2 | thomastik-vision-medium-2 | Thomastik Vision - Medium | thomastik | vision | violon | jeu | 1-10 | moyenne | - | - | 57.51 | - |
| duplicate_parent_candidate | CDM-E5C0B9 | thomastik-vision-aluminium-solo-4-4 | Thomastik Vision aluminium - Solo - 4/4 | thomastik | vision | violon | jeu | 4-4 | moyenne | - | - | 83.06 | 15.000000 |
| duplicate_parent_candidate | CDM-72F66C | thomastik-vision-argent-solo-4-4 | Thomastik Vision argent - Solo - 4/4 | thomastik | vision | violon | jeu | 4-4 | moyenne | - | - | 85.79 | 3.000000 |

## larsen / aurora / violon / jeu / moyenne

- Statut audit: `duplicate_parent_candidates`
- Produit recommande techniquement: `CDM-88C841`
- Tailles detectees: 1-16
- Candidats parents: CDM-88C841 | CDM-5024CF
- Variantes possibles: -
- Doublons possibles: CDM-5024CF
- Pourquoi il faut decider: Plusieurs candidats parents avec les memes axes commerciaux et peu ou pas de variation visible.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-88C841 | larsen-aurora-medium-2 | Larsen Aurora - Medium | larsen | aurora | violon | jeu | 1-16 | moyenne | - | - | 46.91 | - |
| duplicate_parent_candidate | CDM-5024CF | larsen-aurora-argent-medium | Larsen Aurora argent - Medium | larsen | aurora | violon | jeu | - | moyenne | - | - | 48.03 | 2.000000 |

## pirastro / evah-pirazzi-gold / alto / jeu / -

- Statut audit: `duplicate_parent_candidates`
- Produit recommande techniquement: `CDM-14BFFF`
- Tailles detectees: -
- Candidats parents: CDM-14BFFF | CDM-6F6A0F
- Variantes possibles: -
- Doublons possibles: CDM-6F6A0F
- Pourquoi il faut decider: Plusieurs candidats parents avec les memes axes commerciaux et peu ou pas de variation visible.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-14BFFF | pirastro-evah-pirazzi-gold | Pirastro Evah Pirazzi Gold | pirastro | evah-pirazzi-gold | alto | jeu | - | - | - | - | 183.64 | 26.000000 |
| duplicate_parent_candidate | CDM-6F6A0F | pirastro-evah-pirazzi-gold-2 | Pirastro Evah Pirazzi Gold | pirastro | evah-pirazzi-gold | alto | jeu | - | - | - | - | 189.09 | 1.000000 |

## pirastro / evah-pirazzi-slap-orchestra-synthetique / contrebasse / jeu / moyenne

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-4EE938`
- Tailles detectees: 3-4
- Candidats parents: CDM-4EE938 | CDM-CEF8E9
- Variantes possibles: CDM-4EE938 | CDM-CEF8E9
- Doublons possibles: CDM-CEF8E9
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-4EE938 | pirastro-evah-pirazzi-slap-orchestra-synthetique-medium-3-4 | Pirastro Evah Pirazzi Slap Orchestra synthetique - Medium - 3/4 | pirastro | evah-pirazzi-slap-orchestra-synthetique | contrebasse | jeu | 3-4 | moyenne | - | - | 333.68 | 0.000000 |
| duplicate_parent_candidate | CDM-CEF8E9 | pirastro-evah-pirazzi-slap-orchestra-synthetique-medium-3-4-2 | Pirastro Evah Pirazzi Slap Orchestra synthetique - Medium - 3/4 | pirastro | evah-pirazzi-slap-orchestra-synthetique | contrebasse | jeu | 3-4 | moyenne | - | - | 480.18 | 0.000000 |

## pirastro / perpetual / violon / jeu / moyenne / boule

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-F76555`
- Tailles detectees: 4-4
- Candidats parents: CDM-F76555 | CDM-FE6DC7
- Variantes possibles: CDM-F76555 | CDM-FE6DC7
- Doublons possibles: CDM-FE6DC7
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-F76555 | pirastro-perpetual-acier-chrome-boule-medium-4-4 | Pirastro Perpetual acier chrome - boule - Medium - 4/4 | pirastro | perpetual | violon | jeu | 4-4 | moyenne | boule | - | 153.72 | 3.000000 |
| duplicate_parent_candidate | CDM-FE6DC7 | pirastro-perpetual-aluminium-boule-medium-4-4 | Pirastro Perpetual aluminium - boule - Medium - 4/4 | pirastro | perpetual | violon | jeu | 4-4 | moyenne | boule | - | 145.91 | 15.000000 |

## pirastro / piranito / violon / jeu / moyenne / boule

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-78370D`
- Tailles detectees: 1-4 | 4-4
- Candidats parents: CDM-78370D | CDM-0C93B7
- Variantes possibles: CDM-0C93B7
- Doublons possibles: CDM-0C93B7
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-78370D | pirastro-piranito-boule-medium | Pirastro Piranito - boule - Medium | pirastro | piranito | violon | jeu | 1-4 | moyenne | boule | - | 39.52 | - |
| duplicate_parent_candidate | CDM-0C93B7 | pirastro-piranito-aluminium-boule-medium-4-4 | Pirastro Piranito aluminium - boule - Medium - 4/4 | pirastro | piranito | violon | jeu | 4-4 | moyenne | boule | - | 39.52 | 21.000000 |

## pirastro / tonica / alto / jeu / moyenne

- Statut audit: `duplicate_parent_candidates`
- Produit recommande techniquement: `CDM-BD68C6`
- Tailles detectees: 12-13
- Candidats parents: CDM-BD68C6 | CDM-645BAE
- Variantes possibles: -
- Doublons possibles: CDM-645BAE
- Pourquoi il faut decider: Plusieurs candidats parents avec les memes axes commerciaux et peu ou pas de variation visible.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-BD68C6 | pirastro-tonica-medium | Pirastro Tonica - Medium | pirastro | tonica | alto | jeu | 12-13 | moyenne | - | - | 69.41 | - |
| duplicate_parent_candidate | CDM-645BAE | pirastro-tonica-alto-jeu-medium | Pirastro Tonica alto - jeu - Medium | pirastro | tonica | alto | jeu | - | moyenne | - | - | 69.41 | 0.000000 |

## pirastro / tonica / violon / jeu / moyenne / boule

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-685423`
- Tailles detectees: 1-16 | 4-4
- Candidats parents: CDM-685423 | CDM-F98F2C
- Variantes possibles: CDM-F98F2C
- Doublons possibles: CDM-F98F2C
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-685423 | pirastro-tonica-boule-medium | Pirastro Tonica - boule - Medium | pirastro | tonica | violon | jeu | 1-16 | moyenne | boule | - | 42 | - |
| duplicate_parent_candidate | CDM-F98F2C | pirastro-tonica-gold-boule-medium-4-4 | Pirastro Tonica Gold - boule - Medium - 4/4 | pirastro | tonica | violon | jeu | 4-4 | moyenne | boule | - | 42 | 29.000000 |

## pirastro / tonica / violon / mi / moyenne / boule

- Statut audit: `duplicate_parent_candidates`
- Produit recommande techniquement: `CDM-69EDE8`
- Tailles detectees: 1-16
- Candidats parents: CDM-B03A18 | CDM-69EDE8
- Variantes possibles: -
- Doublons possibles: CDM-B03A18
- Pourquoi il faut decider: Plusieurs candidats parents avec les memes axes commerciaux et peu ou pas de variation visible.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| duplicate_parent_candidate | CDM-B03A18 | pirastro-tonica-acier-argente-mi-boule-medium | Pirastro Tonica acier argente - Mi - boule - Medium | pirastro | tonica | violon | mi | 1-16 | moyenne | boule | - | 4.29 | - |
| recommended_parent | CDM-69EDE8 | pirastro-tonica-aluminium-mi-boule-medium | Pirastro Tonica aluminium - Mi - boule - Medium | pirastro | tonica | violon | mi | 1-16 | moyenne | boule | - | 7.91 | - |

## thomastik / dominant / violon / jeu / faible

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-18AFD5`
- Tailles detectees: 4-4
- Candidats parents: CDM-F54282 | CDM-18AFD5
- Variantes possibles: CDM-F54282 | CDM-18AFD5
- Doublons possibles: CDM-F54282
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| duplicate_parent_candidate | CDM-F54282 | thomastik-dominant-135bw-acier-light-4-4 | Thomastik Dominant 135BW acier - Light - 4/4 | thomastik | dominant | violon | jeu | 4-4 | faible | - | - | 71.72 | 0.000000 |
| recommended_parent | CDM-18AFD5 | thomastik-dominant-135w-aluminium-light-4-4 | Thomastik Dominant 135W aluminium - Light - 4/4 | thomastik | dominant | violon | jeu | 4-4 | faible | - | - | 76.5 | 3.000000 |

## thomastik / dominant / violon / jeu / forte

- Statut audit: `variants_to_attach_parent_ambiguous`
- Produit recommande techniquement: `CDM-12906A`
- Tailles detectees: 4-4
- Candidats parents: CDM-206780 | CDM-12906A
- Variantes possibles: CDM-206780 | CDM-12906A
- Doublons possibles: CDM-206780
- Pourquoi il faut decider: Des variantes probables existent, mais plusieurs produits simples peuvent etre le parent commercial.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| duplicate_parent_candidate | CDM-206780 | thomastik-dominant-135bst-acier-heavy-4-4 | Thomastik Dominant 135BST acier - Heavy - 4/4 | thomastik | dominant | violon | jeu | 4-4 | forte | - | - | 71.72 | 2.000000 |
| recommended_parent | CDM-12906A | thomastik-dominant-135st-aluminium-heavy-4-4 | Thomastik Dominant 135ST aluminium - Heavy - 4/4 | thomastik | dominant | violon | jeu | 4-4 | forte | - | - | 76.5 | 16.000000 |

## thomastik / dominant / violon / jeu / moyenne

- Statut audit: `duplicate_parent_candidates`
- Produit recommande techniquement: `CDM-F14E0B`
- Tailles detectees: 1-16
- Candidats parents: CDM-F14E0B | CDM-F57352
- Variantes possibles: -
- Doublons possibles: CDM-F57352
- Pourquoi il faut decider: Plusieurs candidats parents avec les memes axes commerciaux et peu ou pas de variation visible.

| Role | SKU | Slug | Titre | Marque | Modele | Instrument | Corde | Taille | Tension | Attache | Type produit | Prix | Stock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |
| recommended_parent | CDM-F14E0B | thomastik-dominant-135-aluminium-medium | Thomastik Dominant 135 aluminium - Medium | thomastik | dominant | violon | jeu | 1-16 | moyenne | - | - | 76.5 | - |
| duplicate_parent_candidate | CDM-F57352 | thomastik-dominant-135b-acier-medium | Thomastik Dominant 135B acier - Medium | thomastik | dominant | violon | jeu | 1-16 | moyenne | - | - | 71.72 | - |
