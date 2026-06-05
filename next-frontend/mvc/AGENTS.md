<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projet

- Ce projet est un starter Next.js headless avec une lecture MVC legere.
- `src/app` contient les routes et handlers API.
- `src/modules` contient les vues, types et services reutilisables.
- `src/sites/example` contient la configuration et les contenus du site exemple.
- Le catalogue fonctionne sans backend grace aux donnees locales exemple.

# Regles De Travail

- Garder les routes `src/app` fines : parametres, chargement des donnees, rendu de vue.
- Ne pas mettre de gros contenus, requetes ou regles metier dans les fichiers `page.tsx`.
- Respecter les modules existants avant d'en creer de nouveaux.
- Garder les adaptateurs headless derriere des services.
- Ne pas imposer WordPress, WooCommerce ou un autre CMS au socle.
- Valider les changements par `npm run lint` puis `npm run build`.
- Garder les commentaires courts et utiles.
