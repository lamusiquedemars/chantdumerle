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
  backgroundImage?: string;
};

export default function LinkCard({
  href,
  title,
  description,
  children,
  className,
  backgroundImage,
}: LinkCardProps) {
  return (
    <Link href={href} className={clsx(styles.linkCard, className)}>
      {backgroundImage ? (
        <span
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
        {children}
      </div>
    </Link>
  );
}