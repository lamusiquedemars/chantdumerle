import Link from "next/link";
import clsx from "clsx";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";
import styles from "./ProductCard.module.css";

export type ProductCardItem = {
  title: string;
  href: string;
  description?: string;
  price?: string;
  image?: string;
  brand?: string;
  metadata?: ProductCardMetadataItem[];
};

export type ProductCardMetadataItem = {
  label: string;
  value: string;
};

type ProductCardProps = ProductCardItem & {
  className?: string;
};

export default function ProductCard({
  title,
  href,
  description,
  price,
  image,
  brand,
  metadata = [],
  className,
}: ProductCardProps) {
  const cleanDescription = htmlToPlainText(description);
  const cleanPrice = htmlToPlainText(price);
  const cleanMetadata = metadata
    .map((item) => ({
      label: htmlToPlainText(item.label),
      value: htmlToPlainText(item.value),
    }))
    .filter((item) => item.label && item.value);

  return (
    <Link href={href} className={clsx(styles.card, className)}>
      {image ? (
        <div className={styles.media}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className={styles.image} />
        </div>
      ) : null}

      <div className={styles.body}>
        {brand ? <p className={styles.brand}>{brand}</p> : null}
        <h3 className={styles.title}>{title}</h3>
        {cleanDescription ? (
          <p className={styles.description}>{cleanDescription}</p>
        ) : null}

        {cleanMetadata.length > 0 ? (
          <dl className={styles.metadata}>
            {cleanMetadata.map((item) => (
              <div key={`${item.label}-${item.value}`} className={styles.metaItem}>
                <dt className={styles.metaLabel}>{item.label}</dt>
                <dd className={styles.metaValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {cleanPrice ? <p className={styles.price}>{cleanPrice}</p> : null}
      </div>
    </Link>
  );
}
