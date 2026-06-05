import Link from "next/link";
import clsx from "clsx";
import styles from "./MainNav.module.css";

/*
  Type commun pour les éléments de navigation.
  Il est réutilisé par Header, MainNav et MobileMenu.
*/
export type NavItem = {
  label: string;
  href: string;
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
              className={styles.link}
              aria-current={item.current ? "page" : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}