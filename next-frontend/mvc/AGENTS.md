<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projet

- Ce projet est le front Next.js actif du Chant du Merle, avec une lecture MVC
  legere.
- `src/app` contient les routes publiques.
- `src/modules` contient les vues, types et services reutilisables.
- `src/sites/example` contient la configuration et les contenus du site exemple.
- Le catalogue fonctionne sans backend grace aux donnees locales exemple.
- WooCommerce possede le panier, la commande et l'espace client. Ne pas ajouter
  de panier miroir cote Next.

# Regles De Travail

- Garder les routes `src/app` fines : parametres, chargement des donnees, rendu de vue.
- Ne pas mettre de gros contenus, requetes ou regles metier dans les fichiers `page.tsx`.
- Respecter les modules existants avant d'en creer de nouveaux.
- Garder les adaptateurs headless derriere des services.
- Ne pas imposer un nouveau CMS au socle.
- Valider les changements par `npm run lint` puis `npm run build`.
- Commenter les decisions metier et les frontieres techniques, pas le code
  evident.
