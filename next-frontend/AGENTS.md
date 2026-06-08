<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Projet

- `next-frontend/mvc` est le front actif et le moule MVC a valider.
- Chant du Merle vit maintenant dans `mvc/src/sites/chantdumerle` comme premier
  client reel du moule.
- L'ancien laboratoire `next-frontend/src` a ete supprime apres validation
  navigateur.
- Lire `MVC_HEADLESS_PLAN.md` avant un changement d'architecture.

# Architecture

- L'App Router porte les routes publiques et les handlers API dans
  `mvc/src/app`.
- Les vues de socle vivent dans `mvc/src/components` ; les vues metier vivent
  dans `mvc/src/modules/*/components`.
- Les donnees client locales vivent dans `mvc/src/sites/<client>/content`.
- Les acces WordPress et WooCommerce restent dans `mvc/src/lib/wordpress` ou
  dans le module/adaptateur qui les remplacera.
- Les types et adaptateurs doivent proteger les composants generiques du CMS
  actif.

# Regles De Travail

- Garder Chant du Merle comme premier cas client reel, pas comme contrat impose
  au futur starter.
- Ne pas exposer de route `page.tsx` ou `route.ts` vide.
- Respecter les conventions Next.js locales et lire la documentation locale
  pertinente avant de modifier une API Next.
- Analyser les conventions existantes avant de deplacer du code dans `mvc`.
- Garder les changements cibles, buildables et coherents avec les modules
  existants.
- Ne pas ajouter une nouvelle architecture, un CMS ou une couche commerce
  obligatoire sans demande explicite.
