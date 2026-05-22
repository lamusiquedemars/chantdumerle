// On importe uniquement le type NavItem.
// Cela évite d'importer du code inutile dans ce fichier de données.
import type { NavItem } from "@/components/layout/MainNav/MainNav";

// Navigation principale du site.
// Ces liens sont passés au Header, puis affichés dans MainNav et MobileMenu.
export const mainNavItems: NavItem[] = [
  {
    label: "Cordes",
    href: "/fr/cordes",
  },
  {
    label: "Accessoires",
    href: "/fr/accessoires",
  },
  {
    label: "Sélections",
    href: "/fr/selections",
  },
  {
    label: "Guides",
    href: "/fr/guides",
  },
  {
    label: "Philosophie",
    href: "/fr/philosophie",
  },
];