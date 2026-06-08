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
  const cleanDescription = htmlToPlainText(description);
  const cleanPrice = htmlToPlainText(price);

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
        {cleanPrice ? <p className={styles.price}>{cleanPrice}</p> : null}
      </div>
    </Link>
  );
}
