import clsx from "clsx";
import styles from "./SectionHeading.module.css";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx(styles.sectionHeading, className)}>
      <div className={styles.main}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}