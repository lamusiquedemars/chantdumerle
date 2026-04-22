import Link from "next/link";
import clsx from "clsx";
import styles from "./MainNav.module.css";

export type NavItem = {
  label: string;
  href: string;
};

type MainNavProps = {
  items: NavItem[];
  className?: string;
};

export default function MainNav({ items, className }: MainNavProps) {
  return (
    <nav className={clsx(styles.nav, className)} aria-label="Navigation principale">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}