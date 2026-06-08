"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  values?: Record<string, string>;
  className?: string;
};

export default function ProductFilters({
  filters,
  values = {},
  className,
}: ProductFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(name: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form className={clsx(styles.filters, className)}>
      {filters.map((filter) => (
        <div key={filter.name} className={styles.group}>
          <label htmlFor={filter.name} className={styles.label}>
            {filter.label}
          </label>
          <select
            id={filter.name}
            name={filter.name}
            className={styles.select}
            value={values[filter.name] ?? ""}
            onChange={(event) => updateFilter(filter.name, event.target.value)}
          >
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
