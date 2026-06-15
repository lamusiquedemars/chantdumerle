import type { Metadata } from "next";
import {
  SimplePageSection,
  simplePageStyles,
} from "@/modules/staticPages/components/SimplePage/SimplePage";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";

export const metadata: Metadata = {
  title: "Conditions générales de vente | Le Chant du Merle",
  description: "Conditions générales de vente du site Le Chant du Merle.",
};

export default function TermsOfSalePage() {
  return (
    <SimplePage
      title="Conditions générales de vente"
      intro="Version de travail à compléter avec les informations commerciales définitives."
    >
      <SimplePageSection title="Vendeur">
        <p>
          Le Chant du Merle est édité par Ivo Correia de Melo Neto,
          entrepreneur individuel, immatriculé au RCS de Lyon sous le numéro
          894 976 133, SIRET 894 976 133 00013, TVA intracommunautaire
          FR33894976133, domicilié au 30 chemin de l'Ecully, 69660
          Collonges-au-Mont-d'Or.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Produits">
        <p>
          Les produits proposés sont des cordes et accessoires pour instruments
          du quatuor. Les caractéristiques essentielles sont présentées sur les
          fiches produits.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Prix">
        <p className={simplePageStyles.note}>
          À compléter : préciser si les prix sont indiqués TTC, les frais de
          livraison applicables et les éventuelles conditions particulières.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Commande et paiement">
        <p className={simplePageStyles.note}>
          À compléter : décrire le parcours de commande, les moyens de paiement
          acceptés, la validation de commande et les conditions d'encaissement.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Livraison">
        <p className={simplePageStyles.note}>
          À compléter : zones desservies, transporteurs, délais indicatifs,
          frais de livraison et modalités de retrait éventuel.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Droit de rétractation">
        <p className={simplePageStyles.note}>
          À compléter : durée, procédure, adresse de retour, exceptions
          applicables et état attendu des produits retournés.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Garanties légales">
        <p>
          Les produits bénéficient des garanties légales applicables,
          notamment la garantie légale de conformité et la garantie contre les
          vices cachés, dans les conditions prévues par la loi.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Service client">
        <p>
          Pour toute question relative à une commande, vous pouvez écrire à{" "}
          <a
            className={simplePageStyles.link}
            href="mailto:contact@lechantdumerle.fr"
          >
            contact@lechantdumerle.fr
          </a>
          .
        </p>
      </SimplePageSection>

      <SimplePageSection title="Médiation">
        <p className={simplePageStyles.note}>
          À compléter : indiquer le médiateur de la consommation compétent et
          ses coordonnées.
        </p>
      </SimplePageSection>
    </SimplePage>
  );
}
