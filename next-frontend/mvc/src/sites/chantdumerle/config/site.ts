import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import type { SiteConfig } from "@/config/siteTypes";

const defaultLocale = "fr";
const siteHref = (path: string = "") => localizedHref(defaultLocale, path);
const wooBaseUrl =
  process.env.WOO_BASE_URL ??
  process.env.NEXT_PUBLIC_WP_URL ??
  process.env.WP_GRAPHQL_URL?.replace(/\/graphql\/?$/, "");
const wooHref = (path: string) =>
  wooBaseUrl ? new URL(path, wooBaseUrl).toString() : siteHref(path);

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
      label: "Accessoires",
      href: siteHref("/accessoires"),
    },
    {
      label: "Sélections",
      href: siteHref("/selections"),
    },
    {
      label: "Guides",
      href: siteHref("/guides"),
    },
    {
      label: "Espace client",
      href: wooHref("/mon-compte/"),
      icon: "user",
      iconOnly: true,
    },
    {
      label: "Panier",
      href: siteHref("/panier"),
      icon: "cart",
      iconOnly: true,
    },
  ],
  footer: {
    links: [
      { label: "Contact", href: siteHref("/contact") },
      { label: "Mentions légales", href: siteHref("/mentions-legales") },
      {
        label: "Confidentialité",
        href: siteHref("/politique-confidentialite"),
      },
      { label: "CGV", href: siteHref("/cgv") },
    ],
  },
} satisfies SiteConfig;
