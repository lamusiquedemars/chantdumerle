import { Cormorant, Source_Sans_3 } from "next/font/google";
import Header from "@/components/layout/Header/Header";
import { mainNavItems } from "@/data/navigation";
import Footer from "@/components/layout/Footer/Footer";
import { footerLinks } from "@/data/footer";
import type { ReactNode } from "react";
import "./globals.css";

// Police de titres.
// Elle sera utilisée via les variables CSS globales si elles sont déjà configurées.
const cormorant = Cormorant({ subsets: ["latin"] });

// Police de texte courant.
// Elle complète la police de titre pour l'ensemble du site.
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

// Layout racine de l'application.
// Il enveloppe toutes les pages avec la structure HTML commune.
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className={`${cormorant.className} ${sourceSans.className}`}>
        {/* Header global du site.
           Il reçoit les liens de navigation depuis src/data/navigation.ts. */}
        <Header
          navItems={mainNavItems}
          brand={{
            label: "Le Chant du Merle",
            href: "/fr",
            logoSrc: "/images/brand/logo-cdm.png",
            logoAlt: "Le Chant du Merle",
          }}
        />

        {/* Contenu propre à chaque page. */}
        <main>{children}</main>

        <Footer links={footerLinks} />
      </body>
    </html>
  );
}
