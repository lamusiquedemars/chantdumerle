import clsx from "clsx";
import styles from "./Section.module.css";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={clsx(styles.section, className)}>
      {children}
    </section>
  );
}