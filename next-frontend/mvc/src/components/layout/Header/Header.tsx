"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import styles from "./Header.module.css";
import MainNav, { type NavItem } from "../MainNav/MainNav";
import MobileMenu from "../MobileMenu/MobileMenu";

type HeaderProps = {
  navItems: NavItem[];

  // Données de marque affichées dans le header.
  // logoSrc est optionnel : si aucun logo n'est fourni, on affiche seulement le texte.
  brand: {
    label: string;
    href: string;
    logoSrc?: string;
    logoAlt?: string;
  };

  className?: string;
};

export default function Header({
  navItems,
  brand,
  className,
}: HeaderProps) {
  // État d'ouverture du menu mobile.
  const [isOpen, setIsOpen] = useState(false);
  // Récupère l’URL courante pour marquer le lien actif dans la navigation.
  const pathname = usePathname();

  // Ajoute automatiquement current=true au bon item de navigation.
  const computedNavItems = navItems.map((item) => ({
    ...item,
    current: pathname === item.href || pathname.startsWith(`${item.href}/`),
  }));
  //mécanisme de shrink au scroll de la page
  const [shrink, setShrink] = useState(false);
    useEffect(() => {
      const onScroll = () => {
        setShrink(window.scrollY > 20);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, []);

  return (
    <header className={clsx(styles.header, shrink && styles.headerShrink, className)}>
        <div className={styles.inner}>
        {/* Zone de marque : logo optionnel + nom du site. */}
        <Link href={brand.href} className={styles.brand}>
        {brand.logoSrc ? (
          <span className={styles.logo}>
            <Image
              src={brand.logoSrc}
              alt={brand.logoAlt ?? brand.label}
              fill
              priority
              sizes="(max-width: 900px) 130px, 200px"
              className={styles.logoImage}
            />
          </span>
        ) : null}

          <span className={styles.brandLabel}>{brand.label}</span>
        </Link>

        {/* Navigation desktop. */}
        <div className={styles.desktopNav}>
          <MainNav items={computedNavItems} />
        </div>

        {/* Bouton d'ouverture / fermeture du menu mobile. */}
        <button
          type="button"
          className={clsx(styles.burger, isOpen && styles.burgerOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={styles.burgerLabel}>Menu</span>

          <span className={styles.burgerIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Menu mobile affiché seulement quand isOpen vaut true. */}
      <MobileMenu
        items={computedNavItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </header>
  );
}
