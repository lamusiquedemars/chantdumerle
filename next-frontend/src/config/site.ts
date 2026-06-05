import { chantDuMerleSiteConfig } from "@/sites/chantdumerle/config/site";

export type { SiteBrand, SiteConfig, SiteLink } from "./siteTypes";

// Point d'entree unique pour brancher la configuration client active.
export const siteConfig = chantDuMerleSiteConfig;
