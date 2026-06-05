import Link from "next/link";
import clsx from "clsx";
import styles from "./Footer.module.css";

type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  brandLabel: string;
  links?: FooterLink[];
  className?: string;
};

export default function Footer({
  brandLabel,
  links = [],
  className,
}: FooterProps) {
  return (
    <footer className={clsx(styles.footer, className)}>
      <div className={styles.inner}>
        <p className={styles.brand}>{brandLabel}</p>

        {links.length > 0 ? (
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </footer>
  );
}
