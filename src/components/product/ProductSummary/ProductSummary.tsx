import clsx from "clsx";
import styles from "./ProductSummary.module.css";
import Badge from "@/components/ui/Badge/Badge";

type ProductSummaryProps = {
  title: string;
  brand?: string;
  price?: string;
  description?: string;
  badges?: string[];
  className?: string;
};

export default function ProductSummary({
  title,
  brand,
  price,
  description,
  badges = [],
  className,
}: ProductSummaryProps) {
  return (
    <div className={clsx(styles.summary, className)}>
      {brand ? <p className={styles.brand}>{brand}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {price ? <p className={styles.price}>{price}</p> : null}
      {description ? <p className={styles.description}>{description}</p> : null}

      {badges.length > 0 ? (
        <div className={styles.badges}>
          {badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}