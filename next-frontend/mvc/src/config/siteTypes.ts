export type SiteLink = {
  label: string;
  href: string;
  icon?: "user" | "cart";
  iconOnly?: boolean;
};

export type SiteBrand = {
  label: string;
  homeHref: string;
  logoSrc?: string;
  logoAlt?: string;
};

export type SiteConfig = {
  name: string;
  defaultLocale: string;
  locales: string[];
  brand: SiteBrand;
  navigation: SiteLink[];
  footer: {
    links: SiteLink[];
  };
};
