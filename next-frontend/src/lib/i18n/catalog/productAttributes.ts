/**
 * Dictionnaire des attributs produit traduisibles pour l'affichage front.
 *
 * Rôle :
 * - centraliser les libellés traduits des attributs WooCommerce
 * - centraliser les libellés traduits de leurs valeurs
 * - garder des clés techniques stables côté code
 *
 * Ce fichier sert uniquement de couche d'affichage multilingue.
 */

export type Locale = "fr" | "en" | "it";

/**
 * Libellé traduit pour une même donnée.
 */
export type LocalizedLabel = {
  fr: string;
  en: string;
  it: string;
};

/**
 * Ensemble des valeurs possibles pour un attribut,
 * indexées par leur clé technique stable.
 */
export type AttributeValueMap = Record<string, LocalizedLabel>;

/**
 * Définition complète d'un attribut produit :
 * - son label traduit
 * - ses valeurs traduites
 */
export type AttributeDictionaryEntry = {
  label: LocalizedLabel;
  values: AttributeValueMap;
};

/**
 * Dictionnaire complet des attributs produit.
 *
 * Clé = nom technique canonique de l'attribut.
 */
export type ProductAttributesDictionary = Record<string, AttributeDictionaryEntry>;

/**
 * Règles :
 * - clés techniques stables
 * - minuscules
 * - sans accent
 * - sans espace
 * - tirets autorisés si nécessaire
 *
 * Les labels visibles ne doivent jamais être utilisés comme clés.
 */
export const productAttributesDictionary: ProductAttributesDictionary = {
  marque: {
    label: {
      fr: "Marque",
      en: "Brand",
      it: "Marca",
    },
    values: {},
  },

  modele: {
    label: {
      fr: "Modèle",
      en: "Model",
      it: "Modello",
    },
    values: {},
  },

  instrument: {
    label: {
      fr: "Instrument",
      en: "Instrument",
      it: "Strumento",
    },
    values: {
        violin: { fr: "Violon", en: "Violin", it: "Violino", },
        viola: { fr: "Alto", en: "Viola", it: "Viola", },
        cello: { fr: "Violoncelle", en: "Cello", it: "Violoncello", },
        bass: { fr: "Contrebasse", en: "Bass", it: "Contrabbasso", },
    },
  },

  corde: {
    label: {
      fr: "Corde",
      en: "String",
      it: "Corda",
    },
    values: {
        e: { fr: "Mi", en: "E", it: "Mi", },
        a: { fr: "La", en: "A", it: "La", },
        d: { fr: "Ré", en: "D", it: "Re", },
        g: { fr: "Sol", en: "G", it: "Sol", },
        c: { fr: "Do", en: "C", it: "Do", },
        b: { fr: "Si", en: "B", it: "Si", },
        fsharp: { fr: "Fa#", en: "F#", it: "Fa#", },
    },
  },

  taille: {
    label: {
      fr: "Taille",
      en: "Size",
      it: "Misura",
    },
    values: {},
  },

  tension: {
    label: {
      fr: "Tension",
      en: "Tension",
      it: "Tensione",
    },
    values: { 
        light: { fr: "Légère", en: "Light", it: "Leggera", },
        medium: { fr: "Moyenne", en: "Medium", it: "Media", },
        heavy: { fr: "Lourde", en: "Heavy", it: "Pesante", },
        strong: { fr: "Forte", en: "Strong", it: "Forte", },
     },
  },

  attache: {
    label: {
      fr: "Attache",
      en: "End",
      it: "Attacco",
    },
    values: {
        ball: { fr: "Boule", en: "Ball", it: "Palla", },
        loop: { fr: "Boucle", en: "Loop", it: "Anello", },
        hook: { fr: "Crochet", en: "Hook", it: "Gancio", },
    },
  },

  ame: {
    label: {
      fr: "Âme",
      en: "Core",
      it: "Anima",
    },
    values: {
        steel: { fr: "Acier", en: "Steel", it: "Acciaio", },
        nylon: { fr: "Nylon", en: "Nylon", it: "Nylon", },
        perlon: { fr: "Perlon", en: "Perlon", it: "Perlon", },
        gut: { fr: "Boyau", en: "Gut", it: "Budello", },
    },
  },

  filage: {
    label: {
      fr: "Filage",
      en: "Winding",
      it: "Avvolgimento",
    },
    values: {
        none: { fr: "Aucun", en: "None", it: "Nessuno", },
        silver: { fr: "Argenté", en: "Silver", it: "Argento", },
        aluminum: { fr: "Aluminium", en: "Aluminum", it: "Alluminio", },
        copper: { fr: "Cuivre", en: "Copper", it: "Rame", },
        tungsten: { fr: "Tungstène", en: "Tungsten", it: "Tungsteno", },
        gold: { fr: "Or", en: "Gold", it: "Oro", },
    },
  },
};