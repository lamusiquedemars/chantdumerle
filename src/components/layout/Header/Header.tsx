"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./Header.module.css";
import MainNav, { type NavItem } from "../MainNav/MainNav";
import MobileMenu from "../MobileMenu/MobileMenu";

type HeaderProps = {
  navItems: NavItem[];
  brand?: {
    label: string;
    href: string;
  };
  className?: string;
};

export default function Header({
  navItems,
  brand = { label: "Le Chant du Merle", href: "/" },
  className,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={clsx(styles.header, className)}>
      <div className={styles.inner}>
        <Link href={brand.href} className={styles.brand}>
          {brand.label}
        </Link>

        <div className={styles.desktopNav}>
          <MainNav items={navItems} />
        </div>

        <button
          type="button"
          className={styles.burger}
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

      <MobileMenu items={navItems} isOpen={isOpen} />
    </header>
  );
}