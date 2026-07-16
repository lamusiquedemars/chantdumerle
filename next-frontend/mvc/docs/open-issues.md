# Bugs ouverts

Ce fichier est la source de verite des anomalies connues qui restent a traiter.
Une demande de statut telle que "what's up" doit mentionner les elements encore
ouverts de ce document.

## CDM-001 - Rupture du parcours Archets et panier

- Statut : corrige et valide localement le 16 juillet 2026.
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

- Hypothese du 15 juillet 2026 : le parcours basculerait vers le site
  WordPress, dont la navigation ne contient pas la page `Archets`. Confirmer le
  domaine et l'application qui rendent `/panier` avant toute correction.
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

### Correction locale du 16 juillet 2026

- L'hypothese de routage est confirmee : `/panier` reste sous le domaine du
  frontend, mais son rendu est fourni par le theme WordPress/WooCommerce au
  moyen du proxy interne prevu par l'architecture.
- La rubrique `Archets` a ete ajoutee a la navigation du theme WooCommerce afin
  de conserver le meme parcours que dans le frontend Next.
- Avec une session neuve et isolee, l'ajout du produit WooCommerce `8065` depuis
  `/wp-json/cdm/v1/cart/add` renvoie un compteur de `1`, pose les cookies Woo et
  conserve le produit dans `/panier`.
- Le badge et l'ensemble du parcours doivent encore etre valides visuellement
  dans un navigateur, sur ordinateur puis sur mobile, avant fermeture definitive.
- La validation utilisateur a ensuite montre un comportement instable : l'archet
  seul est ajoute, mais pas toujours le pack archet. Le journal Next n'a montre
  aucun appel `POST` lors d'un clic concerne, apres qu'un build de production et
  le serveur de developpement ont partage le meme dossier `.next`. Le serveur de
  developpement a ete redemarre avant de poursuivre le diagnostic.
- Le theme WordPress n'affichait aucun compteur dans son icone panier. Un badge
  base sur le contenu de la session WooCommerce a ete ajoute.
- Les produits simples utilisent maintenant l'ajout natif WooCommerce : le pack
  ouvre directement `/panier` et ne depend plus de l'hydratation JavaScript du
  frontend. Les produits a variantes conservent le pont AJAX.
- Le badge du theme WooCommerce se resynchronise apres mise a jour de quantite,
  suppression et vidage du panier. Le parcours WebKit automatise a valide la
  sequence `1 -> 3 -> 0`, puis l'utilisateur a confirme l'ajout et
  l'actualisation dans Safari.
- Sur `/panier`, le message d'ajout ne propose plus le bouton redondant `Voir le
  panier`; le lien de validation de la commande reste present.

## CDM-002 - Rendu CSS instable

- Statut : ouvert, reproduction precise requise.
- Signale le : 16 juillet 2026.
- Environnement constate : Safari local.

Le rendu CSS est signale comme instable. Ne pas rattacher cette anomalie au
panier sans preuve. Relever la page, l'etat avant/apres, les feuilles chargees
et les erreurs de console avant toute correction.
