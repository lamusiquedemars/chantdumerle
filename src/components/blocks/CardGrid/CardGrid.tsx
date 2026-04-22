import clsx from "clsx";
import styles from "./CardGrid.module.css";
import LinkCard from "@/components/ui/LinkCard/LinkCard";

export type CardGridItem = {
  label: string;
  href: string;
  description?: string;
};

type CardGridProps = {
  items: CardGridItem[];
  className?: string;
};

export default function CardGrid({ items, className }: CardGridProps) {
  return (
    <div className={clsx(styles.grid, className)}>
      {items.map((item) => (
        <LinkCard
          key={item.href}
          href={item.href}
          title={item.label}
          description={item.description}
        />
      ))}
    </div>
  );
}