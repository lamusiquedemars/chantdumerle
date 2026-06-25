import { Cormorant, Source_Sans_3 } from "next/font/google";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { siteConfig } from "@/config/site";
import type { ReactNode } from "react";
import "./globals.css";

const cormorant = Cormorant({ subsets: ["latin"] });

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

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

        <main>{children}</main>

        <Footer
          brandLabel={siteConfig.brand.label}
          links={siteConfig.footer.links}
        />
      </body>
    </html>
  );
}
