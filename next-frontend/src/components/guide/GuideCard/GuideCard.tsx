import Link from "next/link";
import clsx from "clsx";
import styles from "./GuideCard.module.css";

export type GuideCardItem = {
  title: string;
  href: string;
  excerpt?: string;
  category?: string;
};

type GuideCardProps = GuideCardItem & {
  className?: string;
};

export default function GuideCard({
  title,
  href,
  excerpt,
  category,
  className,
}: GuideCardProps) {
  return (
    <Link href={href} className={clsx(styles.card, className)}>
      <div className={styles.body}>
        {category ? <p className={styles.category}>{category}</p> : null}
        <h3 className={styles.title}>{title}</h3>
        {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
      </div>
    </Link>
  );
}