import clsx from "clsx";
import styles from "./ProductGrid.module.css";
import ProductCard, { type ProductCardItem } from "@/components/ui/ProductCard/ProductCard";

type ProductGridProps = {
  items?: ProductCardItem[];
  className?: string;
};

export default function ProductGrid({
  items = [],
  className,
}: ProductGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.grid, className)}>
      {items.map((item) => (
        <ProductCard key={item.href} {...item} />
      ))}
    </div>
  );
}