import clsx from "clsx";
import styles from "./GuideList.module.css";
import GuideCard, { type GuideCardItem } from "../GuideCard/GuideCard";

type GuideListProps = {
  items?: GuideCardItem[];
  className?: string;
};

export default function GuideList({
  items = [],
  className,
}: GuideListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.list, className)}>
      {items.map((item) => (
        <GuideCard key={item.href} {...item} />
      ))}
    </div>
  );
}