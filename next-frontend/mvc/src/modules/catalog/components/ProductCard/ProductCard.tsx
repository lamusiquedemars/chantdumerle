import Link from "next/link";
import clsx from "clsx";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";
import styles from "./ProductCard.module.css";

const PRODUCT_IMAGE_PLACEHOLDER =
  `${process.env.NEXT_PUBLIC_WP_URL ?? ""}/wp-content/uploads/woocommerce-placeholder-300x300.webp`;

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
  const cleanTitle = htmlToPlainText(title) ?? title;
  const cleanBrand = htmlToPlainText(brand);
  const cleanDescription = htmlToPlainText(description);
  const cleanPrice = htmlToPlainText(price);
  const imageSrc = image || PRODUCT_IMAGE_PLACEHOLDER;
  const cleanMetadata = metadata
    .map((item) => ({
      label: htmlToPlainText(item.label),
      value: htmlToPlainText(item.value),
    }))
    .filter((item) => item.label && item.value);

  return (
    <Link href={href} className={clsx(styles.card, className)}>
      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={cleanTitle} className={styles.image} />
      </div>

      <div className={styles.body}>
        {cleanBrand ? <p className={styles.brand}>{cleanBrand}</p> : null}
        <h3 className={styles.title}>{cleanTitle}</h3>
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
