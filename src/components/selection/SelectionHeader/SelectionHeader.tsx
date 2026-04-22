import clsx from "clsx";
import styles from "./SelectionHeader.module.css";

type SelectionHeaderProps = {
  title: string;
  intro?: string;
  instrument?: string;
  className?: string;
};

export default function SelectionHeader({
  title,
  intro,
  instrument,
  className,
}: SelectionHeaderProps) {
  return (
    <header className={clsx(styles.header, className)}>
      {instrument ? <p className={styles.instrument}>{instrument}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </header>
  );
}