import Link from "next/link";
import clsx from "clsx";
import styles from "./LinkCard.module.css";
import type { ReactNode } from "react";

type LinkCardProps = {
  href: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export default function LinkCard({
  href,
  title,
  description,
  children,
  className,
}: LinkCardProps) {
  return (
    <Link href={href} className={clsx(styles.linkCard, className)}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
        {children}
      </div>
    </Link>
  );
}