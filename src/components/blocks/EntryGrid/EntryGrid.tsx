import clsx from "clsx";
import styles from "./EntryGrid.module.css";
import LinkCard from "@/components/ui/LinkCard/LinkCard";

export type EntryGridItem = {
  label: string;
  href: string;
  description?: string;
};

type EntryGridProps = {
  items: EntryGridItem[];
  className?: string;
};

export default function EntryGrid({ items, className }: EntryGridProps) {
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