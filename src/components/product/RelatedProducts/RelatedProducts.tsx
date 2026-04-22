import clsx from "clsx";
import styles from "./RelatedProducts.module.css";
import ProductGrid from "../ProductGrid/ProductGrid";
import type { ProductCardItem } from "@/components/ui/ProductCard/ProductCard";

type RelatedProductsProps = {
  title?: string;
  items?: ProductCardItem[];
  className?: string;
};

export default function RelatedProducts({
  title = "Produits liés",
  items = [],
  className,
}: RelatedProductsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={clsx(styles.relatedProducts, className)}>
      <h2 className={styles.title}>{title}</h2>
      <ProductGrid items={items} />
    </section>
  );
}