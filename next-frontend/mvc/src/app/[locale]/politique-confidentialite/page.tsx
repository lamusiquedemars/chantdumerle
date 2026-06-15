import type { Metadata } from "next";
import {
  SimplePageSection,
  simplePageStyles,
} from "@/modules/staticPages/components/SimplePage/SimplePage";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Le Chant du Merle",
  description:
    "Politique de confidentialité et informations sur le traitement des données personnelles du site Le Chant du Merle.",
};

export default function PrivacyPolicyPage() {
  return (
    <SimplePage
      title="Politique de confidentialité"
      intro="Cette page explique quelles données personnelles peuvent être collectées et comment elles sont utilisées."
    >
      <SimplePageSection title="Responsable du traitement">
        <p>
          Le responsable du traitement est Ivo Correia de Melo Neto,
          entrepreneur individuel, éditant le site Le Chant du Merle, domicilié
          au 30 chemin de l’Écully, 69660 Collonges-au-Mont-d’Or.
        </p>
        <p>
          Pour toute question relative aux données personnelles, vous pouvez
          écrire à{" "}
          <a
            className={simplePageStyles.link}
            href="mailto:contact@lechantdumerle.fr"
          >
            contact@lechantdumerle.fr
          </a>
          .
        </p>
      </SimplePageSection>

      <SimplePageSection title="Données collectées">
        <p>Le Chant du Merle peut traiter les données suivantes :</p>
        <ul>
          <li>
            données transmises par e-mail : nom, prénom, adresse e-mail,
            contenu du message et informations utiles au traitement de la
            demande ;
          </li>
          <li>
            données liées aux commandes : identité, coordonnées, adresse de
            facturation, adresse de livraison, produits commandés, montant,
            historique de commande et échanges de suivi ;
          </li>
          <li>
            données de paiement nécessaires au traitement de la transaction,
            traitées par le prestataire de paiement Stancer ;
          </li>
          <li>
            données techniques de navigation et journaux de connexion
            nécessaires au fonctionnement et à la sécurité du site.
          </li>
        </ul>
      </SimplePageSection>

      <SimplePageSection title="Finalités">
        <p>Les données sont utilisées pour :</p>
        <ul>
          <li>répondre aux demandes envoyées par e-mail ;</li>
          <li>traiter, facturer, expédier et suivre les commandes ;</li>
          <li>gérer le service client et les éventuels retours ;</li>
          <li>respecter les obligations comptables, fiscales et légales ;</li>
          <li>assurer le fonctionnement, la sécurité et la maintenance du site.</li>
        </ul>
      </SimplePageSection>

      <SimplePageSection title="Destinataires">
        <p>
          Les données peuvent être transmises uniquement lorsque cela est
          nécessaire à l’exécution de la commande ou au fonctionnement du site :
          prestataire de paiement, hébergeur, transporteurs, fournisseur chargé
          de l’expédition directe, outils techniques nécessaires au site et
          conseils comptables ou juridiques le cas échéant.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Livraison depuis un fournisseur">
        <p>
          Certaines commandes peuvent être expédiées directement par un
          fournisseur situé en Espagne. Dans ce cas, les informations nécessaires
          à la préparation et à l’expédition de la commande peuvent lui être
          transmises.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Durées de conservation">
        <p>
          Les données sont conservées pendant la durée nécessaire aux finalités
          pour lesquelles elles ont été collectées. Les données liées aux
          commandes et à la facturation peuvent être conservées pendant les
          durées légales applicables aux obligations comptables et fiscales. Les
          messages envoyés par e-mail sont conservés le temps nécessaire au
          traitement de la demande et au suivi de la relation commerciale.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Cookies et données techniques">
        <p>
          Le site peut utiliser des cookies ou traceurs strictement nécessaires
          à son fonctionnement, notamment pour la navigation, le panier, la
          commande ou la sécurité. Si des outils de mesure d’audience ou de
          marketing sont ajoutés ultérieurement, ils devront faire l’objet d’une
          information dédiée et, lorsque la loi l’exige, d’un consentement.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Droits des personnes">
        <p>
          Conformément à la réglementation applicable, vous pouvez demander
          l’accès, la rectification, l’effacement ou la limitation du traitement
          de vos données personnelles. Vous pouvez également vous opposer à
          certains traitements ou demander la portabilité de vos données lorsque
          ce droit s’applique.
        </p>
        <p>
          Pour exercer ces droits, écrivez à{" "}
          <a
            className={simplePageStyles.link}
            href="mailto:contact@lechantdumerle.fr"
          >
            contact@lechantdumerle.fr
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL.
        </p>
      </SimplePageSection>
    </SimplePage>
  );
}
