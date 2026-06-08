"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
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
  const queryKey = searchParams.toString();
  const [, startTransition] = useTransition();
  const urlValues = useMemo(() => {
    const nextValues: Record<string, string> = {};

    for (const filter of filters) {
      nextValues[filter.name] =
        searchParams.get(filter.name) ?? values[filter.name] ?? "";
    }

    return nextValues;
  }, [filters, searchParams, values]);
  const [optimisticState, setOptimisticState] = useState<{
    sourceQuery: string;
    targetQuery: string;
    values: Record<string, string>;
  } | null>(null);
  const displayedValues =
    optimisticState &&
    (optimisticState.sourceQuery === queryKey ||
      optimisticState.targetQuery === queryKey)
      ? optimisticState.values
      : urlValues;

  function updateFilter(name: string, value: string) {
    const nextValues = {
      ...displayedValues,
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
    setOptimisticState({
      sourceQuery: queryKey,
      targetQuery: query,
      values: nextValues,
    });

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
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
            value={displayedValues[filter.name] ?? ""}
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
