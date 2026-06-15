import Container from "@/components/layout/Container/Container";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./SimplePage.module.css";

type SimplePageProps = {
  title: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
};

export default function SimplePage({
  title,
  eyebrow,
  intro,
  children,
}: SimplePageProps) {
  return (
    <article className={styles.page}>
      <Container className={styles.inner}>
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 className={styles.title}>{title}</h1>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </header>

        <div className={styles.content}>{children}</div>
      </Container>
    </article>
  );
}

export const simplePageStyles = styles;

export function SimplePageSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx(styles.section, className)}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
