import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import type { SiteConfig } from "@/config/siteTypes";

const defaultLocale = "fr";
const siteHref = (path: string = "") => localizedHref(defaultLocale, path);

// Configuration exemple du starter.
export const exampleSiteConfig: SiteConfig = {
  name: "Example Studio",
  defaultLocale,
  locales: [defaultLocale],
  brand: {
    label: "Example Studio",
    homeHref: siteHref(),
    logoAlt: "Example Studio",
  },
  navigation: [
    {
      label: "Catalogue",
      href: siteHref("/catalogue"),
    },
    {
      label: "Sélections",
      href: siteHref("/selections"),
    },
    {
      label: "Guides",
      href: siteHref("/guides"),
    },
  ],
  footer: {
    links: [
      { label: "Catalogue", href: siteHref("/catalogue") },
      { label: "Sélections", href: siteHref("/selections") },
      { label: "Guides", href: siteHref("/guides") },
    ],
  },
} satisfies SiteConfig;
