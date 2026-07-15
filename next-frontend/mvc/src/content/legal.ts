export type RichTextPart =
  | string
  | {
      type: "email" | "internalLink";
      label: string;
      href: string;
    };

export type LegalPageBlock =
  | {
      type: "paragraph";
      text: RichTextPart[];
      variant?: "note";
    }
  | {
      type: "list";
      plain?: boolean;
      items: RichTextPart[][];
    };

export type LegalPageSection = {
  title?: string;
  blocks: LegalPageBlock[];
};

export type LegalPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  title: string;
  intro?: string;
  sections: LegalPageSection[];
};

const contactEmail = "contact@lechantdumerle.fr";
const emailLink = {
  type: "email",
  label: contactEmail,
  href: `mailto:${contactEmail}`,
} as const;

const privacyLink = {
  type: "internalLink",
  label: "politique de confidentialité",
  href: "/fr/politique-confidentialite",
} as const;

const companyIdentity =
  "Le Chant du Merle est édité par Ivo Correia de Melo Neto, entrepreneur individuel, immatriculé au RCS de Lyon sous le numéro 894 976 133, SIRET 894 976 133 00013, TVA intracommunautaire FR33894976133, domicilié au 30 chemin de l’Écully, 69660 Collonges-au-Mont-d’Or.";

export const contactPageContent: LegalPageContent = {
  metadata: {
    title: "Contact | Le Chant du Merle",
    description:
      "Contacter Le Chant du Merle, cordes et accessoires pour instruments du quatuor près de Lyon.",
  },
  title: "Contact",
  intro: "Cordes et accessoires pour instruments du quatuor.",
  sections: [
    {
      blocks: [
        {
          type: "list",
          plain: true,
          items: [
            ["Le Chant du Merle"],
            ["Cordes et accessoires pour instruments du quatuor"],
            ["Collonges-au-Mont-d’Or, près de Lyon"],
            ["E-mail : ", emailLink],
          ],
        },
      ],
    },
  ],
};

export const legalNoticePageContent: LegalPageContent = {
  metadata: {
    title: "Mentions légales | Le Chant du Merle",
    description: "Mentions légales du site Le Chant du Merle.",
  },
  title: "Mentions légales",
  sections: [
    {
      title: "Éditeur du site",
      blocks: [{ type: "paragraph", text: [companyIdentity] }],
    },
    {
      title: "Contact",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Pour toute question, vous pouvez écrire à ",
            emailLink,
            " ou appeler le +33 7 86 43 15 83.",
          ],
        },
      ],
    },
    {
      title: "Directeur de la publication",
      blocks: [{ type: "paragraph", text: ["Ivo Correia de Melo Neto."] }],
    },
    {
      title: "Hébergement",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Le site est hébergé par LWS, Ligne Web Services, société immatriculée au RCS de Paris sous le numéro 851 993 683.",
          ],
        },
      ],
    },
    {
      title: "Données personnelles",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Le Chant du Merle peut collecter et traiter des données personnelles dans le cadre des demandes de contact, des commandes, du paiement, de la livraison et du fonctionnement technique du site. Les informations détaillées sont disponibles dans la ",
            privacyLink,
            ".",
          ],
        },
      ],
    },
  ],
};

export const termsOfSalePageContent: LegalPageContent = {
  metadata: {
    title: "Conditions générales de vente | Le Chant du Merle",
    description: "Conditions générales de vente du site Le Chant du Merle.",
  },
  title: "Conditions générales de vente",
  intro:
    "Conditions applicables aux commandes passées sur le site Le Chant du Merle.",
  sections: [
    {
      title: "Vendeur",
      blocks: [{ type: "paragraph", text: [companyIdentity] }],
    },
    {
      title: "Produits",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Les produits proposés sont des cordes et accessoires pour instruments du quatuor. Les caractéristiques essentielles sont présentées sur les fiches produits.",
          ],
        },
      ],
    },
    {
      title: "Prix",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Les prix affichés sur le site sont indiqués toutes taxes comprises (TTC), hors frais de livraison. Les frais de livraison sont indiqués lors de la commande avant validation définitive.",
          ],
        },
      ],
    },
    {
      title: "Commande et paiement",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Le client valide sa commande après avoir vérifié le détail de son panier, les informations de livraison et le montant total à payer. Le paiement peut être effectué par virement bancaire ou par carte bancaire via Stancer.",
          ],
        },
      ],
    },
    {
      title: "Livraison",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Les produits sont livrés en France métropolitaine et en Europe. Les expéditions peuvent être réalisées directement depuis un fournisseur situé en Espagne, selon les produits commandés et leur disponibilité.",
          ],
        },
        {
          type: "paragraph",
          text: [
            "Pour les produits en stock, les délais de livraison habituellement constatés sont de 2 à 5 jours ouvrés. Ces délais sont indicatifs et peuvent varier selon le transporteur, la destination et la disponibilité effective des produits.",
          ],
        },
        {
          type: "paragraph",
          text: [
            "Les frais de livraison sont calculés au panier selon la destination et la classe d’expédition. À titre indicatif, les petits colis sont facturés 6 € pour la France métropolitaine et 7 € pour l’Europe ; les gros colis sont facturés 15 € pour la France métropolitaine et 17 € pour l’Europe.",
          ],
        },
        {
          type: "paragraph",
          text: [
            "La livraison est offerte à partir de 100 € d’achat pour la France métropolitaine et 120 € pour l’Europe. Aucun minimum de commande n’est actuellement appliqué.",
          ],
        },
      ],
    },
    {
      title: "Droit de rétractation",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Le client consommateur dispose du droit de rétractation légal dans les conditions prévues par le Code de la consommation. Pour exercer ce droit, le client peut contacter Le Chant du Merle par e-mail à ",
            emailLink,
            ".",
          ],
        },
        {
          type: "paragraph",
          text: [
            "Les retours doivent être adressés à Ivo Correia de Melo Neto, 30 chemin de l’Écully, 69660 Collonges-au-Mont-d’Or, sauf indication contraire transmise au client après sa demande de rétractation.",
          ],
        },
      ],
    },
    {
      title: "Garanties légales",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Les produits bénéficient des garanties légales applicables, notamment la garantie légale de conformité et la garantie contre les vices cachés, dans les conditions prévues par la loi.",
          ],
        },
      ],
    },
    {
      title: "Service client",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Pour toute question relative à une commande, vous pouvez écrire à ",
            emailLink,
            ".",
          ],
        },
      ],
    },
    {
      title: "Médiation",
      blocks: [
        {
          type: "paragraph",
          variant: "note",
          text: [
            "Médiateur de la consommation à désigner : les coordonnées du médiateur choisi devront être ajoutées ici. Le tribunal compétent ne remplace pas cette information de médiation préalable.",
          ],
        },
      ],
    },
    {
      title: "Litiges",
      blocks: [
        {
          type: "paragraph",
          text: [
            "En cas de litige, le client est invité à contacter en priorité Le Chant du Merle afin de rechercher une solution amiable. À défaut de résolution amiable ou de médiation, les règles de compétence juridictionnelle applicables seront celles prévues par la loi.",
          ],
        },
      ],
    },
  ],
};

export const privacyPolicyPageContent: LegalPageContent = {
  metadata: {
    title: "Politique de confidentialité | Le Chant du Merle",
    description:
      "Politique de confidentialité et informations sur le traitement des données personnelles du site Le Chant du Merle.",
  },
  title: "Politique de confidentialité",
  intro:
    "Cette page explique quelles données personnelles peuvent être collectées et comment elles sont utilisées.",
  sections: [
    {
      title: "Responsable du traitement",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Le responsable du traitement est Ivo Correia de Melo Neto, entrepreneur individuel, éditant le site Le Chant du Merle, domicilié au 30 chemin de l’Écully, 69660 Collonges-au-Mont-d’Or.",
          ],
        },
        {
          type: "paragraph",
          text: [
            "Pour toute question relative aux données personnelles, vous pouvez écrire à ",
            emailLink,
            ".",
          ],
        },
      ],
    },
    {
      title: "Données collectées",
      blocks: [
        {
          type: "paragraph",
          text: ["Le Chant du Merle peut traiter les données suivantes :"],
        },
        {
          type: "list",
          items: [
            [
              "données transmises par e-mail : nom, prénom, adresse e-mail, contenu du message et informations utiles au traitement de la demande ;",
            ],
            [
              "données liées aux commandes : identité, coordonnées, adresse de facturation, adresse de livraison, produits commandés, montant, historique de commande et échanges de suivi ;",
            ],
            [
              "données de paiement nécessaires au traitement de la transaction, traitées par le prestataire de paiement Stancer ;",
            ],
            [
              "données techniques de navigation et journaux de connexion nécessaires au fonctionnement et à la sécurité du site.",
            ],
          ],
        },
      ],
    },
    {
      title: "Finalités",
      blocks: [
        { type: "paragraph", text: ["Les données sont utilisées pour :"] },
        {
          type: "list",
          items: [
            ["répondre aux demandes envoyées par e-mail ;"],
            ["traiter, facturer, expédier et suivre les commandes ;"],
            ["gérer le service client et les éventuels retours ;"],
            ["respecter les obligations comptables, fiscales et légales ;"],
            [
              "assurer le fonctionnement, la sécurité et la maintenance du site.",
            ],
          ],
        },
      ],
    },
    {
      title: "Destinataires",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Les données peuvent être transmises uniquement lorsque cela est nécessaire à l’exécution de la commande ou au fonctionnement du site : prestataire de paiement, hébergeur, transporteurs, fournisseur chargé de l’expédition directe, outils techniques nécessaires au site et conseils comptables ou juridiques le cas échéant.",
          ],
        },
      ],
    },
    {
      title: "Livraison depuis un fournisseur",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Certaines commandes peuvent être expédiées directement par un fournisseur situé en Espagne. Dans ce cas, les informations nécessaires à la préparation et à l’expédition de la commande peuvent lui être transmises.",
          ],
        },
      ],
    },
    {
      title: "Durées de conservation",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées. Les données liées aux commandes et à la facturation peuvent être conservées pendant les durées légales applicables aux obligations comptables et fiscales. Les messages envoyés par e-mail sont conservés le temps nécessaire au traitement de la demande et au suivi de la relation commerciale.",
          ],
        },
      ],
    },
    {
      title: "Cookies et données techniques",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Le site peut utiliser des cookies ou traceurs strictement nécessaires à son fonctionnement, notamment pour la navigation, le panier, la commande ou la sécurité. Si des outils de mesure d’audience ou de marketing sont ajoutés ultérieurement, ils devront faire l’objet d’une information dédiée et, lorsque la loi l’exige, d’un consentement.",
          ],
        },
      ],
    },
    {
      title: "Droits des personnes",
      blocks: [
        {
          type: "paragraph",
          text: [
            "Conformément à la réglementation applicable, vous pouvez demander l’accès, la rectification, l’effacement ou la limitation du traitement de vos données personnelles. Vous pouvez également vous opposer à certains traitements ou demander la portabilité de vos données lorsque ce droit s’applique.",
          ],
        },
        {
          type: "paragraph",
          text: [
            "Pour exercer ces droits, écrivez à ",
            emailLink,
            ". Vous pouvez également introduire une réclamation auprès de la CNIL.",
          ],
        },
      ],
    },
  ],
};
