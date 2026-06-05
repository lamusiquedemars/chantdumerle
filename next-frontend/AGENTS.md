<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projet

- `next-frontend` est le cas client Chant du Merle utilise pour stabiliser un
  modele frontend Next.js headless reutilisable.
- La cible de travail est un dossier `mvc` modulaire, capable de servir de base
  a des sites clients avec ou sans catalogue, contenu editorial ou commerce.
- Lire `MVC_HEADLESS_PLAN.md` avant un changement d'architecture.

# Architecture

- L'App Router porte les routes publiques et les handlers API dans `src/app`.
- Les vues de socle vivent dans `src/components` ; les vues metier extraites
  vivent dans `src/modules/*/components`.
- Les donnees client locales vivent encore dans `src/data` tant que la config
  client n'est pas extraite.
- Les acces WordPress et WooCommerce restent dans `src/lib/wordpress` ou dans
  le module/adaptateur qui les remplacera.
- Les types et adaptateurs doivent proteger les composants generiques du CMS
  actif.

# Regles De Travail

- Garder Chant du Merle comme cas client, pas comme contrat impose au futur
  starter.
- Ne pas exposer de route `page.tsx` ou `route.ts` vide.
- Respecter les conventions Next.js locales et lire la documentation locale
  pertinente avant de modifier une API Next.
- Analyser les conventions existantes avant de deplacer du code vers `mvc`.
- Garder les changements cibles, buildables et coherents avec les modules
  existants.
- Ne pas ajouter une nouvelle architecture, un CMS ou une couche commerce
  obligatoire sans demande explicite.
