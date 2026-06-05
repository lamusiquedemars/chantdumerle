import { Cormorant, Source_Sans_3 } from "next/font/google";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { siteConfig } from "@/config/site";
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
    <html lang={siteConfig.defaultLocale}>
      <body className={`${cormorant.className} ${sourceSans.className}`}>
        <Header
          navItems={siteConfig.navigation}
          brand={{
            label: siteConfig.brand.label,
            href: siteConfig.brand.homeHref,
            logoSrc: siteConfig.brand.logoSrc,
            logoAlt: siteConfig.brand.logoAlt,
          }}
        />

        {/* Contenu propre à chaque page. */}
        <main>{children}</main>

        <Footer
          brandLabel={siteConfig.brand.label}
          links={siteConfig.footer.links}
        />
      </body>
    </html>
  );
}
