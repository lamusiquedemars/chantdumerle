import type { Metadata } from "next";
import {
  SimplePageSection,
  simplePageStyles,
} from "@/modules/staticPages/components/SimplePage/SimplePage";
import SimplePage from "@/modules/staticPages/components/SimplePage/SimplePage";

export const metadata: Metadata = {
  title: "Contact | Le Chant du Merle",
  description:
    "Contacter Le Chant du Merle, cordes et accessoires pour instruments du quatuor près de Lyon.",
};

export default function ContactPage() {
  return (
    <SimplePage
      title="Contact"
      intro="Cordes et accessoires pour instruments du quatuor."
    >
      <SimplePageSection>
        <ul className={simplePageStyles.listPlain}>
          <li>
            <strong>Le Chant du Merle</strong>
          </li>
          <li>Cordes et accessoires pour instruments du quatuor</li>
          <li>Collonges-au-Mont-d’Or, près de Lyon</li>
          <li>
            E-mail :{" "}
            <a
              className={simplePageStyles.link}
              href="mailto:contact@lechantdumerle.fr"
            >
              contact@lechantdumerle.fr
            </a>
          </li>
        </ul>
      </SimplePageSection>
    </SimplePage>
  );
}
