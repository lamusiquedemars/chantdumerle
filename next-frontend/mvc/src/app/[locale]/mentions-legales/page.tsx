import type { Metadata } from "next";
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
          FR33894976133, domicilié au 30 chemin de l'Ecully, 69660
          Collonges-au-Mont-d'Or.
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
          </a>
          .
        </p>
      </SimplePageSection>

      <SimplePageSection title="Directeur de la publication">
        <p>Ivo Correia de Melo Neto.</p>
      </SimplePageSection>

      <SimplePageSection title="Hébergement">
        <p className={simplePageStyles.note}>
          Hébergeur à compléter : nom de l'hébergeur, forme juridique, adresse
          postale et moyen de contact.
        </p>
      </SimplePageSection>
    </SimplePage>
  );
}
