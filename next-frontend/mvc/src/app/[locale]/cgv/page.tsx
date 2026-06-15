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
      intro="Conditions applicables aux commandes passées sur le site Le Chant du Merle."
    >
      <SimplePageSection title="Vendeur">
        <p>
          Le Chant du Merle est édité par Ivo Correia de Melo Neto,
          entrepreneur individuel, immatriculé au RCS de Lyon sous le numéro
          894 976 133, SIRET 894 976 133 00013, TVA intracommunautaire
          FR33894976133, domicilié au 30 chemin de l’Écully, 69660
          Collonges-au-Mont-d’Or.
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
        <p>
          Les prix affichés sur le site sont indiqués toutes taxes comprises
          (TTC), hors frais de livraison. Les frais de livraison sont indiqués
          lors de la commande avant validation définitive.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Commande et paiement">
        <p>
          Le client valide sa commande après avoir vérifié le détail de son
          panier, les informations de livraison et le montant total à payer. Le
          paiement peut être effectué par virement bancaire ou par carte
          bancaire via Stancer.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Livraison">
        <p>
          Les produits sont livrés en Europe. Les expéditions peuvent être
          réalisées directement depuis un fournisseur situé en Espagne, selon
          les produits commandés et leur disponibilité.
        </p>
        <p>
          Pour les produits en stock, les délais de livraison habituellement
          constatés sont de 2 à 5 jours ouvrés. Ces délais sont indicatifs et
          peuvent varier selon le transporteur, la destination et la
          disponibilité effective des produits.
        </p>
        <p>
          Les frais de livraison sont indicatifs : 10 € pour les petits objets
          et à partir de 15 € pour les objets volumineux, notamment les étuis,
          selon la taille et la destination.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Droit de rétractation">
        <p>
          Le client consommateur dispose du droit de rétractation légal dans
          les conditions prévues par le Code de la consommation. Pour exercer ce
          droit, le client peut contacter Le Chant du Merle par e-mail à{" "}
          <a
            className={simplePageStyles.link}
            href="mailto:contact@lechantdumerle.fr"
          >
            contact@lechantdumerle.fr
          </a>
          .
        </p>
        <p>
          Les retours doivent être adressés à Ivo Correia de Melo Neto, 30
          chemin de l’Écully, 69660 Collonges-au-Mont-d’Or, sauf indication
          contraire transmise au client après sa demande de rétractation.
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
          Médiateur de la consommation à désigner : les coordonnées du
          médiateur choisi devront être ajoutées ici. Le tribunal compétent ne
          remplace pas cette information de médiation préalable.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Litiges">
        <p>
          En cas de litige, le client est invité à contacter en priorité Le
          Chant du Merle afin de rechercher une solution amiable. À défaut de
          résolution amiable ou de médiation, les règles de compétence
          juridictionnelle applicables seront celles prévues par la loi.
        </p>
      </SimplePageSection>
    </SimplePage>
  );
}
