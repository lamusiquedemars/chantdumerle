# Bugs ouverts

Ce fichier est la source de verite des anomalies connues qui restent a traiter.
Une demande de statut telle que "what's up" doit mentionner les elements encore
ouverts de ce document.

## CDM-001 - Rupture du parcours Archets et panier

- Statut : ouvert, correction volontairement differee.
- Gravite : critique pour le parcours d'achat.
- Signale le : 15 juillet 2026.
- Environnement constate : local Herd, domaines `.test`.

### Symptomes

1. Sur la page panier, la navigation n'est plus celle du frontend Next. La
   rubrique `Archets` disparait et la page donne l'impression d'avoir ete
   reconstruite separement par WooCommerce.
2. Depuis la page `Selections`, ouvrir `Archet essentiel`, puis ajouter le
   produit au panier ne met pas a jour le badge du panier.
3. Le produit `Archet essentiel` n'apparait pas non plus dans le panier apres
   l'ajout.

### Parcours de reproduction

1. Ouvrir `/fr/selections`.
2. Choisir `Archet essentiel`.
3. Ajouter le produit au panier.
4. Observer le badge dans la navigation.
5. Ouvrir `/panier` et verifier le contenu ainsi que la rubrique `Archets`.

### Resultat attendu

- Le panier conserve une navigation coherente avec le frontend, notamment la
  rubrique `Archets`.
- L'ajout depuis `Archet essentiel` appelle le bon produit ou la bonne variante
  WooCommerce.
- Le badge augmente immediatement apres un ajout reussi.
- Le produit ajoute est present dans le panier WooCommerce de la meme session.

### Points a verifier lors de la correction

- Routage et rendu de `/panier` entre Next et le theme WooCommerce.
- Identifiant produit ou variante transmis depuis la selection.
- Reponse de `/wp-json/cdm/v1/cart/add` et propagation de l'evenement
  `cdm:cart-updated`.
- Continuite des cookies de session entre le frontend et les routes Woo
  proxifiees.
- Parcours avec une session neuve et une session existante, sur ordinateur et
  mobile.

Ne pas clore ce bug sans validation visuelle et fonctionnelle de l'ensemble du
parcours.
