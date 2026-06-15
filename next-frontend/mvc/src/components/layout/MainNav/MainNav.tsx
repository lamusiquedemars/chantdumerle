"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import clsx from "clsx";
import styles from "./MainNav.module.css";

/*
  Type commun pour les éléments de navigation.
  Il est réutilisé par Header, MainNav et MobileMenu.
*/
export type NavItem = {
  label: string;
  href: string;
  icon?: "user" | "cart";
  iconOnly?: boolean;
  current?: boolean;
};

type MainNavProps = {
  items: NavItem[];

  /*
    Callback optionnel appelé quand on clique sur un lien.
    Utile en mobile pour fermer le menu après navigation.
  */
  onNavigate?: () => void;

  className?: string;
};

export default function MainNav({
  items,
  onNavigate,
  className,
}: MainNavProps) {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function refreshCartCount() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });

        if (!res.ok) {
          return;
        }

        const json = (await res.json()) as { itemCount?: number };

        if (isMounted) {
          setCartItemCount(Number(json.itemCount ?? 0));
        }
      } catch {
        if (isMounted) {
          setCartItemCount(0);
        }
      }
    }

    function onCartUpdated(event: Event) {
      const itemCount =
        event instanceof CustomEvent ? Number(event.detail?.itemCount) : NaN;

      if (Number.isFinite(itemCount)) {
        setCartItemCount(itemCount);
        return;
      }

      void refreshCartCount();
    }

    void refreshCartCount();
    window.addEventListener("cdm:cart-updated", onCartUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("cdm:cart-updated", onCartUpdated);
    };
  }, []);

  const renderIcon = (icon: NavItem["icon"]) => {
    if (icon === "user") {
      return <CircleUserRound className={styles.icon} aria-hidden="true" />;
    }

    if (icon === "cart") {
      return <ShoppingCart className={styles.icon} aria-hidden="true" />;
    }

    return null;
  };

  return (
    <nav
      className={clsx(styles.nav, className)}
      aria-label="Navigation principale"
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <Link
              href={item.href}
              className={clsx(styles.link, item.iconOnly && styles.iconLink)}
              aria-current={item.current ? "page" : undefined}
              aria-label={item.iconOnly ? item.label : undefined}
              title={item.iconOnly ? item.label : undefined}
              onClick={onNavigate}
            >
              {renderIcon(item.icon)}
              {item.icon === "cart" && cartItemCount > 0 ? (
                <span className={styles.badge} aria-hidden="true">
                  {cartItemCount}
                </span>
              ) : null}
              <span className={item.iconOnly ? styles.visuallyHidden : undefined}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
