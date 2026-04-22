"use client";

import clsx from "clsx";
import styles from "./ProductFilters.module.css";

export type ProductFilterOption = {
  label: string;
  value: string;
};

export type ProductFilterGroup = {
  name: string;
  label: string;
  options: ProductFilterOption[];
};

type ProductFiltersProps = {
  filters: ProductFilterGroup[];
  className?: string;
};

export default function ProductFilters({
  filters,
  className,
}: ProductFiltersProps) {
  return (
    <form className={clsx(styles.filters, className)}>
      {filters.map((filter) => (
        <div key={filter.name} className={styles.group}>
          <label htmlFor={filter.name} className={styles.label}>
            {filter.label}
          </label>
          <select id={filter.name} name={filter.name} className={styles.select}>
            <option value="">Tous</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </form>
  );
}