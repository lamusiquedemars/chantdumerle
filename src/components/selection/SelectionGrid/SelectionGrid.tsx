import clsx from "clsx";
import styles from "./SelectionGrid.module.css";
import SelectionCard, { type SelectionCardItem } from "../SelectionCard/SelectionCard";

type SelectionGridProps = {
  items?: SelectionCardItem[];
  className?: string;
};

export default function SelectionGrid({
  items = [],
  className,
}: SelectionGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.grid, className)}>
      {items.map((item) => (
        <SelectionCard key={item.href} {...item} />
      ))}
    </div>
  );
}