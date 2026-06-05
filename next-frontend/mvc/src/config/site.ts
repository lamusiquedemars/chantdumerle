import { exampleSiteConfig } from "@/sites/example/config/site";

export type { SiteBrand, SiteConfig, SiteLink } from "./siteTypes";

// Point d'entree unique pour brancher la configuration client active.
export const siteConfig = exampleSiteConfig;
