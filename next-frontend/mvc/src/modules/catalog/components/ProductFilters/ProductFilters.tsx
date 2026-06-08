"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
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
  const searchParams = useSearchParams();
  const currentValues = useMemo(() => {
    const nextValues: Record<string, string> = {};

    for (const filter of filters) {
      nextValues[filter.name] =
        searchParams.get(filter.name) ?? values[filter.name] ?? "";
    }

    return nextValues;
  }, [filters, searchParams, values]);

  function updateFilter(name: string, value: string) {
    const nextValues = {
      ...currentValues,
      [name]: value,
    };
    const nextParams = new URLSearchParams();

    for (const filter of filters) {
      const nextValue = nextValues[filter.name];

      if (nextValue) {
        nextParams.set(filter.name, nextValue);
      }
    }

    const query = nextParams.toString();
    window.location.assign(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form
      className={clsx(styles.filters, className)}
      onSubmit={(event) => event.preventDefault()}
    >
      {filters.map((filter) => (
        <div key={filter.name} className={styles.group}>
          <label htmlFor={filter.name} className={styles.label}>
            {filter.label}
          </label>
          <select
            id={filter.name}
            name={filter.name}
            className={styles.select}
            value={currentValues[filter.name] ?? ""}
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
