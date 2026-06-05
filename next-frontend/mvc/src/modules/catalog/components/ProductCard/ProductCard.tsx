import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import styles from "./ProductCard.module.css";

export type ProductCardItem = {
  title: string;
  href: string;
  description?: string;
  price?: string;
  image?: string;
  brand?: string;
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
  className,
}: ProductCardProps) {
  return (
    <Link href={href} className={clsx(styles.card, className)}>
      {image ? (
        <div className={styles.media}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 820px) 100vw, 33vw"
            className={styles.image}
          />
        </div>
      ) : null}

      <div className={styles.body}>
        {brand ? <p className={styles.brand}>{brand}</p> : null}
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
        {price ? <p className={styles.price}>{price}</p> : null}
      </div>
    </Link>
  );
}
