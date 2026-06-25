export type StringModelAttributeReference = {
  status: "complete" | "partial" | "empty" | "missing";
  brand: string;
  model: string;
  key: string;
  productCount: number;
  soundProfile: string | null;
  complexity: string | null;
  power: string | null;
  response: string | null;
  musicianUsage: string[];
  pricePositioning: string | null;
  durability: string | null;
  tuningStability: string | null;
  breakInTime: string | null;
};

export const chantDuMerleStringModelAttributes = [
    {
        "status": "empty",
        "brand": "Aquila",
        "model": "Gold Springs",
        "key": "aquila|gold springs",
        "productCount": 1,
        "soundProfile": null,
        "complexity": null,
        "power": null,
        "response": null,
        "musicianUsage": [],
        "pricePositioning": null,
        "durability": null,
        "tuningStability": null,
        "breakInTime": null
    },
    {
        "status": "empty",
        "brand": "Aquila",
        "model": "Series",
        "key": "aquila|series",
        "productCount": 1,
        "soundProfile": null,
        "complexity": null,
        "power": null,
        "response": null,
        "musicianUsage": [],
        "pricePositioning": null,
        "durability": null,
        "tuningStability": null,
        "breakInTime": null
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Helicore",
        "key": "d addario|helicore",
        "productCount": 38,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Helicore Hybrid",
        "key": "d addario|helicore hybrid",
        "productCount": 2,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "jazz",
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Helicore Octave",
        "key": "d addario|helicore octave",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "expérimental"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Helicore Orchestral",
        "key": "d addario|helicore orchestral",
        "productCount": 2,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Helicore Pizzicato",
        "key": "d addario|helicore pizzicato",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "jazz",
            "pizzicato"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Helicore Solo",
        "key": "d addario|helicore solo",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan",
        "key": "d addario|kaplan",
        "productCount": 3,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant",
            "intermédiaire"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Amo",
        "key": "d addario|kaplan amo",
        "productCount": 18,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Amo Heavy",
        "key": "d addario|kaplan amo heavy",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Forza",
        "key": "d addario|kaplan forza",
        "productCount": 4,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Golden Spiral",
        "key": "d addario|kaplan golden spiral",
        "productCount": 4,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "moyenne",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Solo",
        "key": "d addario|kaplan solo",
        "productCount": 1,
        "soundProfile": "équilibré",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Solutions",
        "key": "d addario|kaplan solutions",
        "productCount": 8,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Vivo",
        "key": "d addario|kaplan vivo",
        "productCount": 18,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Vivo Heavy",
        "key": "d addario|kaplan vivo heavy",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Kaplan Vivo KV410 Long",
        "key": "d addario|kaplan vivo kv410 long",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "D'Addario",
        "model": "Zyex",
        "key": "d addario|zyex",
        "productCount": 15,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Classic",
        "key": "jargar|classic",
        "productCount": 44,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Classic Dolce",
        "key": "jargar|classic dolce",
        "productCount": 4,
        "soundProfile": "chaud",
        "complexity": "pur",
        "power": "doux",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Eccentric",
        "key": "jargar|eccentric",
        "productCount": 11,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Evoke",
        "key": "jargar|evoke",
        "productCount": 6,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Silver sound",
        "key": "jargar|silver sound",
        "productCount": 7,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Special",
        "key": "jargar|special",
        "productCount": 4,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Superior",
        "key": "jargar|superior",
        "productCount": 19,
        "soundProfile": "équilibré",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Jargar",
        "model": "Young Talent",
        "key": "jargar|young talent",
        "productCount": 10,
        "soundProfile": "équilibré",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Aurora",
        "key": "larsen|aurora",
        "productCount": 12,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant",
            "intermédiaire"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Il Cannone",
        "key": "larsen|il cannone",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Il Cannone Direct & Focused",
        "key": "larsen|il cannone direct focused",
        "productCount": 4,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Il Cannone Gold",
        "key": "larsen|il cannone gold",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Il Cannone Silver",
        "key": "larsen|il cannone silver",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Il Cannone Soloist",
        "key": "larsen|il cannone soloist",
        "productCount": 4,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Il Cannone Warm & Broad",
        "key": "larsen|il cannone warm broad",
        "productCount": 4,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Magnacore",
        "key": "larsen|magnacore",
        "productCount": 8,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Magnacore Arioso",
        "key": "larsen|magnacore arioso",
        "productCount": 4,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Original et Il Cannone",
        "key": "larsen|original et il cannone",
        "productCount": 1,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Soloist's Ed",
        "key": "larsen|soloist s ed",
        "productCount": 8,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Tzigane",
        "key": "larsen|tzigane",
        "productCount": 9,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Virtuoso",
        "key": "larsen|virtuoso",
        "productCount": 15,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Virtuoso Soloist",
        "key": "larsen|virtuoso soloist",
        "productCount": 3,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Larsen",
        "model": "Wire core",
        "key": "larsen|wire core",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Optima",
        "model": "Goldbrokat",
        "key": "optima|goldbrokat",
        "productCount": 17,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Optima",
        "model": "Goldbrokat Premium",
        "key": "optima|goldbrokat premium",
        "productCount": 11,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Optima",
        "model": "Lenzner Goldbrokat Premium",
        "key": "optima|lenzner goldbrokat premium",
        "productCount": 2,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Optima",
        "model": "Protos",
        "key": "optima|protos",
        "productCount": 20,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Aricore",
        "key": "pirastro|aricore",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Chorda",
        "key": "pirastro|chorda",
        "productCount": 22,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "baroque"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "faible",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Chorda Orchestra",
        "key": "pirastro|chorda orchestra",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "faible",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Chromcor",
        "key": "pirastro|chromcor",
        "productCount": 15,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant",
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Chromcor Orchestra",
        "key": "pirastro|chromcor orchestra",
        "productCount": 4,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Eudoxa",
        "key": "pirastro|eudoxa",
        "productCount": 32,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Eudoxa Orchestra",
        "key": "pirastro|eudoxa orchestra",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Eudoxa-Aricore",
        "key": "pirastro|eudoxa aricore",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Eudoxa-Chromcor",
        "key": "pirastro|eudoxa chromcor",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Eudoxa-Oliv",
        "key": "pirastro|eudoxa oliv",
        "productCount": 3,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi",
        "key": "pirastro|evah pirazzi",
        "productCount": 58,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi Gold",
        "key": "pirastro|evah pirazzi gold",
        "productCount": 24,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi Heavy",
        "key": "pirastro|evah pirazzi heavy",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi Neo",
        "key": "pirastro|evah pirazzi neo",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi Orchestra",
        "key": "pirastro|evah pirazzi orchestra",
        "productCount": 13,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi Slap Orchestra",
        "key": "pirastro|evah pirazzi slap orchestra",
        "productCount": 8,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "jazz"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Evah Pirazzi Soloist",
        "key": "pirastro|evah pirazzi soloist",
        "productCount": 10,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flat-Chromesteel Orchestra",
        "key": "pirastro|flat chromesteel orchestra",
        "productCount": 7,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flat-Chromesteel Soloist",
        "key": "pirastro|flat chromesteel soloist",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor Deluxe",
        "key": "pirastro|flexocor deluxe",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor Deluxe Orchestra",
        "key": "pirastro|flexocor deluxe orchestra",
        "productCount": 7,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor Deluxe Soloist",
        "key": "pirastro|flexocor deluxe soloist",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor Orchestra",
        "key": "pirastro|flexocor orchestra",
        "productCount": 14,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor Permanent",
        "key": "pirastro|flexocor permanent",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor Soloist",
        "key": "pirastro|flexocor soloist",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Flexocor-Permanent",
        "key": "pirastro|flexocor permanent",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Gold",
        "key": "pirastro|gold",
        "productCount": 12,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "nº1",
        "key": "pirastro|n 1",
        "productCount": 3,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Obligato",
        "key": "pirastro|obligato",
        "productCount": 29,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Obligato Orchestra",
        "key": "pirastro|obligato orchestra",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Obligato Soloist",
        "key": "pirastro|obligato soloist",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Oliv",
        "key": "pirastro|oliv",
        "productCount": 53,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Oliv Orchestra",
        "key": "pirastro|oliv orchestra",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "douce",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Oliv-Stiff",
        "key": "pirastro|oliv stiff",
        "productCount": 4,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "douce",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "faible",
        "tuningStability": "moyenne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Original Flat Soloist",
        "key": "pirastro|original flat soloist",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Original Flat-Chrome Orchestra",
        "key": "pirastro|original flat chrome orchestra",
        "productCount": 7,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Original Flat-Chrome Soloist",
        "key": "pirastro|original flat chrome soloist",
        "productCount": 4,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Original-Flexocor Orchestra",
        "key": "pirastro|original flexocor orchestra",
        "productCount": 7,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Passione",
        "key": "pirastro|passione",
        "productCount": 56,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Passione Orchestra",
        "key": "pirastro|passione orchestra",
        "productCount": 13,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Passione Solo",
        "key": "pirastro|passione solo",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Permanent",
        "key": "pirastro|permanent",
        "productCount": 13,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Permanent Orchestra",
        "key": "pirastro|permanent orchestra",
        "productCount": 6,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Permanent Soloist",
        "key": "pirastro|permanent soloist",
        "productCount": 9,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Perpetual",
        "key": "pirastro|perpetual",
        "productCount": 21,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Perpetual Cadenza",
        "key": "pirastro|perpetual cadenza",
        "productCount": 7,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Perpetual Edition",
        "key": "pirastro|perpetual edition",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Perpetual Orchestra",
        "key": "pirastro|perpetual orchestra",
        "productCount": 13,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Perpetual Soloist",
        "key": "pirastro|perpetual soloist",
        "productCount": 12,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Piranito",
        "key": "pirastro|piranito",
        "productCount": 12,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Synoxa",
        "key": "pirastro|synoxa",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "The Jazzer Orchestra",
        "key": "pirastro|the jazzer orchestra",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "jazz"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Tonica",
        "key": "pirastro|tonica",
        "productCount": 16,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "moyenne",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Violino",
        "key": "pirastro|violino",
        "productCount": 6,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Wondertone",
        "key": "pirastro|wondertone",
        "productCount": 8,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Pirastro",
        "model": "Wondertone Solo",
        "key": "pirastro|wondertone solo",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Alphayue",
        "key": "thomastik|alphayue",
        "productCount": 16,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Belcanto",
        "key": "thomastik|belcanto",
        "productCount": 4,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Belcanto Gold",
        "key": "thomastik|belcanto gold",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Belcanto Orchestra",
        "key": "thomastik|belcanto orchestra",
        "productCount": 7,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Belcanto Soloist",
        "key": "thomastik|belcanto soloist",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Dominant",
        "key": "thomastik|dominant",
        "productCount": 42,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Dominant Orchestra",
        "key": "thomastik|dominant orchestra",
        "productCount": 5,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Dominant Pro",
        "key": "thomastik|dominant pro",
        "productCount": 20,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Dominant Soloist",
        "key": "thomastik|dominant soloist",
        "productCount": 5,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Dynamo",
        "key": "thomastik|dynamo",
        "productCount": 8,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Dynamo Solo",
        "key": "thomastik|dynamo solo",
        "productCount": 2,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Infeld bleu",
        "key": "thomastik|infeld bleu",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Infeld rouge",
        "key": "thomastik|infeld rouge",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Peter Infeld",
        "key": "thomastik|peter infeld",
        "productCount": 18,
        "soundProfile": "équilibré",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Peter Infeld Orchestra",
        "key": "thomastik|peter infeld orchestra",
        "productCount": 7,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Peter Infeld platine",
        "key": "thomastik|peter infeld platine",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Prazision",
        "key": "thomastik|prazision",
        "productCount": 10,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Rondo",
        "key": "thomastik|rondo",
        "productCount": 17,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Rondo Experience",
        "key": "thomastik|rondo experience",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Rondo Gold",
        "key": "thomastik|rondo gold",
        "productCount": 8,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Spirit!",
        "key": "thomastik|spirit",
        "productCount": 10,
        "soundProfile": "équilibré",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "étudiant"
        ],
        "pricePositioning": "entrée",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Spirocore",
        "key": "thomastik|spirocore",
        "productCount": 48,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Spirocore Orchestra",
        "key": "thomastik|spirocore orchestra",
        "productCount": 16,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Spirocore Soloist",
        "key": "thomastik|spirocore soloist",
        "productCount": 7,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "long"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Superflexible",
        "key": "thomastik|superflexible",
        "productCount": 16,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Superflexible Orchestra",
        "key": "thomastik|superflexible orchestra",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Superflexible Soloist",
        "key": "thomastik|superflexible soloist",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "pur",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "entrée",
        "durability": "élevée",
        "tuningStability": "excellente",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Ti",
        "key": "thomastik|ti",
        "productCount": 6,
        "soundProfile": "brillant",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Versum",
        "key": "thomastik|versum",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Versum Solo",
        "key": "thomastik|versum solo",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Vision",
        "key": "thomastik|vision",
        "productCount": 20,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Vision Solo",
        "key": "thomastik|vision solo",
        "productCount": 11,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "intermédiaire",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Vision Titanium",
        "key": "thomastik|vision titanium",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Vision Titanium Orchestra",
        "key": "thomastik|vision titanium orchestra",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Thomastik",
        "model": "Vision Titanium Solo",
        "key": "thomastik|vision titanium solo",
        "productCount": 4,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "moyenne",
        "tuningStability": "bonne",
        "breakInTime": "court"
    },
    {
        "status": "complete",
        "brand": "Warchal",
        "model": "Amber",
        "key": "warchal|amber",
        "productCount": 9,
        "soundProfile": "chaud",
        "complexity": "complexe",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Warchal",
        "model": "Brilliant",
        "key": "warchal|brilliant",
        "productCount": 5,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Warchal",
        "model": "Brilliant argent",
        "key": "warchal|brilliant argent",
        "productCount": 1,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Warchal",
        "model": "Brilliant Vintage",
        "key": "warchal|brilliant vintage",
        "productCount": 5,
        "soundProfile": "chaud",
        "complexity": "équilibré",
        "power": "modéré",
        "response": "rapide",
        "musicianUsage": [
            "orchestre"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "moyen"
    },
    {
        "status": "complete",
        "brand": "Warchal",
        "model": "The Beast",
        "key": "warchal|the beast",
        "productCount": 1,
        "soundProfile": "brillant",
        "complexity": "équilibré",
        "power": "puissant",
        "response": "rapide",
        "musicianUsage": [
            "soliste"
        ],
        "pricePositioning": "premium",
        "durability": "élevée",
        "tuningStability": "bonne",
        "breakInTime": "court"
    }
] satisfies StringModelAttributeReference[];
