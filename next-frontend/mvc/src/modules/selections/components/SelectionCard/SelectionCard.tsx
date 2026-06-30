import Link from "next/link";
import clsx from "clsx";
import styles from "./SelectionCard.module.css";

export type SelectionCardItem = {
  title: string;
  href: string;
  description?: string;
  backgroundImage?: string;
};

type SelectionCardProps = SelectionCardItem & {
  className?: string;
};

export default function SelectionCard({
  title,
  href,
  description,
  backgroundImage,
  className,
}: SelectionCardProps) {
  return (
    <Link href={href} className={clsx(styles.card, className)}>
      {backgroundImage ? (
        <span
          className={styles.media}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
    </Link>
  );
}
