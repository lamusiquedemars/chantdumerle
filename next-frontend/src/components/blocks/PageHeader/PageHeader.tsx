import clsx from "clsx";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  intro?: string;
  className?: string;
};

export default function PageHeader({
  title,
  intro,
  className,
}: PageHeaderProps) {
  return (
    <header className={clsx(styles.pageHeader, className)}>
      <h1 className={styles.title}>{title}</h1>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </header>
  );
}