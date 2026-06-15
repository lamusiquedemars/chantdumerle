import type { Metadata } from "next";
import Link from "next/link";
import {
  SimplePageSection,
  simplePageStyles,
} from "@/modules/staticPages/components/SimplePage/SimplePage";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";

export const metadata: Metadata = {
  title: "Mentions légales | Le Chant du Merle",
  description: "Mentions légales du site Le Chant du Merle.",
};

export default function LegalNoticePage() {
  return (
    <SimplePage title="Mentions légales">
      <SimplePageSection title="Éditeur du site">
        <p>
          Le Chant du Merle est édité par Ivo Correia de Melo Neto,
          entrepreneur individuel, immatriculé au RCS de Lyon sous le numéro
          894 976 133, SIRET 894 976 133 00013, TVA intracommunautaire
          FR33894976133, domicilié au 30 chemin de l’Écully, 69660
          Collonges-au-Mont-d’Or.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Contact">
        <p>
          Pour toute question, vous pouvez écrire à{" "}
          <a
            className={simplePageStyles.link}
            href="mailto:contact@lechantdumerle.fr"
          >
            contact@lechantdumerle.fr
          </a> ou appeler le +33 7 86 43 15 83
          .
        </p>
      </SimplePageSection>

      <SimplePageSection title="Directeur de la publication">
        <p>Ivo Correia de Melo Neto.</p>
      </SimplePageSection>

      <SimplePageSection title="Hébergement">
        <p>
          Le site est hébergé par LWS, Ligne Web Services, société immatriculée
          au RCS de Paris sous le numéro 851 993 683.
        </p>
      </SimplePageSection>

      <SimplePageSection title="Données personnelles">
        <p>
          Le Chant du Merle peut collecter et traiter des données personnelles
          dans le cadre des demandes de contact, des commandes, du paiement, de
          la livraison et du fonctionnement technique du site. Les informations
          détaillées sont disponibles dans la{" "}
          <Link
            className={simplePageStyles.link}
            href="/fr/politique-confidentialite"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </SimplePageSection>
    </SimplePage>
  );
}
