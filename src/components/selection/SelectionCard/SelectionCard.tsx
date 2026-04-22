import Link from "next/link";
import clsx from "clsx";
import styles from "./SelectionCard.module.css";

export type SelectionCardItem = {
  title: string;
  href: string;
  description?: string;
  instrument?: string;
};

type SelectionCardProps = SelectionCardItem & {
  className?: string;
};

export default function SelectionCard({
  title,
  href,
  description,
  instrument,
  className,
}: SelectionCardProps) {
  return (
    <Link href={href} className={clsx(styles.card, className)}>
      <div className={styles.body}>
        {instrument ? <p className={styles.instrument}>{instrument}</p> : null}
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
    </Link>
  );
}