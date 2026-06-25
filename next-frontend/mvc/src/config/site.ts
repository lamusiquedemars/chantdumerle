import { chantDuMerleSiteConfig } from "@/content/site";

export type { SiteBrand, SiteConfig, SiteLink } from "./siteTypes";

// Point d'entree unique pour brancher la configuration client active.
export const siteConfig = chantDuMerleSiteConfig;
