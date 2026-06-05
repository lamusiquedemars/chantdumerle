import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import type { SiteConfig } from "@/config/siteTypes";

const defaultLocale = "fr";
const siteHref = (path: string = "") => localizedHref(defaultLocale, path);

// Configuration active du client Chant du Merle.
export const chantDuMerleSiteConfig = {
  name: "Le Chant du Merle",
  defaultLocale,
  locales: [defaultLocale],
  brand: {
    label: "Le Chant du Merle",
    homeHref: siteHref(),
    logoSrc: "/images/brand/logo-cdm.png",
    logoAlt: "Le Chant du Merle",
  },
  navigation: [
    {
      label: "Cordes",
      href: siteHref("/cordes"),
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
      { label: "Cordes", href: siteHref("/cordes") },
      { label: "Sélections", href: siteHref("/selections") },
      { label: "Guides", href: siteHref("/guides") },
    ],
  },
} satisfies SiteConfig;
