import clsx from "clsx";
import styles from "./SelectionProducts.module.css";
import ProductGrid from "@/components/product/ProductGrid/ProductGrid";
import type { ProductCardItem } from "@/components/ui/ProductCard/ProductCard";

type SelectionProductsProps = {
  title?: string;
  items?: ProductCardItem[];
  className?: string;
};

export default function SelectionProducts({
  title = "Produits de la sélection",
  items = [],
  className,
}: SelectionProductsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={clsx(styles.selectionProducts, className)}>
      <h2 className={styles.title}>{title}</h2>
      <ProductGrid items={items} />
    </section>
  );
}