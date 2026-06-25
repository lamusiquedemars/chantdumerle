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
  preservedValues?: Record<string, string>;
  sort?: string;
  className?: string;
};

const SORT_OPTIONS = [
  { label: "Nom A-Z", value: "name-asc" },
  { label: "Nom Z-A", value: "name-desc" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
] as const;

export default function ProductFilters({
  filters,
  values = {},
  preservedValues = {},
  sort = "",
  className,
}: ProductFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialValues = useMemo(() => {
    const nextValues: Record<string, string> = {};

    for (const filter of filters) {
      nextValues[filter.name] =
        searchParams.get(filter.name) ?? values[filter.name] ?? "";
    }

    return nextValues;
  }, [filters, searchParams, values]);
  const initialSort = searchParams.get("sort") ?? sort;
  const formKey = JSON.stringify({
    values: initialValues,
    sort: initialSort,
    filters: filters.map((filter) => filter.name),
    preservedValues,
    query: searchParams.toString(),
  });

  return (
    <ProductFiltersForm
      key={formKey}
      filters={filters}
      initialValues={initialValues}
      initialSort={initialSort}
      preservedValues={preservedValues}
      pathname={pathname}
      currentQuery={searchParams.toString()}
      className={className}
    />
  );
}

function makeBaseParams(
  currentQuery: string,
  preservedValues: Record<string, string>
) {
  const nextParams = new URLSearchParams(currentQuery);

  nextParams.delete("page");

  for (const [name, value] of Object.entries(preservedValues)) {
    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }
  }

  return nextParams;
}

function ProductFiltersForm({
  filters,
  initialValues,
  initialSort,
  preservedValues,
  pathname,
  currentQuery,
  className,
}: {
  filters: ProductFilterGroup[];
  initialValues: Record<string, string>;
  initialSort: string;
  preservedValues: Record<string, string>;
  pathname: string;
  currentQuery: string;
  className?: string;
}) {
  function applyFilters(form: HTMLFormElement) {
    const formData = new FormData(form);
    const nextParams = makeBaseParams(currentQuery, preservedValues);

    for (const filter of filters) {
      const value = String(formData.get(filter.name) ?? "");

      if (value) {
        nextParams.set(filter.name, value);
      } else {
        nextParams.delete(filter.name);
      }
    }

    const currentSort = String(formData.get("sort") ?? "");

    if (currentSort) {
      nextParams.set("sort", currentSort);
    } else {
      nextParams.delete("sort");
    }

    const query = nextParams.toString();
    window.location.assign(query ? `${pathname}?${query}` : pathname);
  }

  function clearFilters() {
    const nextParams = makeBaseParams(currentQuery, preservedValues);

    for (const filter of filters) {
      nextParams.delete(filter.name);
    }

    nextParams.delete("sort");

    const query = nextParams.toString();
    window.location.assign(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form
      className={clsx(styles.filters, className)}
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(event.currentTarget);
      }}
    >
      <div className={styles.controls}>
        {filters.map((filter) => (
          <div key={filter.name} className={styles.group}>
            <label htmlFor={filter.name} className={styles.label}>
              {filter.label}
            </label>
            <select
              id={filter.name}
              name={filter.name}
              className={styles.select}
              defaultValue={initialValues[filter.name] ?? ""}
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

        <div className={styles.group}>
          <label htmlFor="sort" className={styles.label}>
            Tri
          </label>
          <select
            id="sort"
            name="sort"
            className={styles.select}
            defaultValue={initialSort}
          >
            <option value="">Par défaut</option>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.clear}
          onClick={clearFilters}
        >
          Effacer les filtres
        </button>
        <button className={styles.submit} type="submit">
          Appliquer
        </button>
      </div>
    </form>
  );
}
