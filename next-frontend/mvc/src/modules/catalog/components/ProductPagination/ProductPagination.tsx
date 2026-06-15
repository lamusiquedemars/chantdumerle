import Link from "next/link";
import styles from "./ProductPagination.module.css";

type ProductPaginationProps = {
  page: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  values?: Record<string, string>;
};

type PageItem = number | "ellipsis";

function makePageHref(page: number, values: Record<string, string>) {
  const params = new URLSearchParams();

  for (const [name, value] of Object.entries(values)) {
    if (value) {
      params.set(name, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `?${query}` : ".";
}

function makePageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([
    1,
    pageCount,
    page - 1,
    page,
    page + 1,
  ]);

  if (page <= 4) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
    pages.add(5);
  }

  if (page >= pageCount - 3) {
    pages.add(pageCount - 4);
    pages.add(pageCount - 3);
    pages.add(pageCount - 2);
    pages.add(pageCount - 1);
  }

  const sortedPages = [...pages]
    .filter((item) => item >= 1 && item <= pageCount)
    .sort((left, right) => left - right);
  const items: PageItem[] = [];

  sortedPages.forEach((item, index) => {
    const previous = sortedPages[index - 1];

    if (previous && item - previous > 1) {
      items.push("ellipsis");
    }

    items.push(item);
  });

  return items;
}

export default function ProductPagination({
  page,
  pageCount,
  hasPreviousPage,
  hasNextPage,
  values = {},
}: ProductPaginationProps) {
  const safePageCount = Math.max(1, pageCount);
  const safePage = Math.min(Math.max(1, page), safePageCount);
  const pageItems = makePageItems(safePage, safePageCount);

  if (safePageCount <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination des produits">
      {hasPreviousPage ? (
        <Link
          className={styles.link}
          href={makePageHref(safePage - 1, values)}
          rel="prev"
        >
          Précédente
        </Link>
      ) : (
        <span className={styles.disabled}>Précédente</span>
      )}

      <ol className={styles.pages}>
        {pageItems.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <span className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            ) : item === safePage ? (
              <span className={styles.current} aria-current="page">
                <span className={styles.visuallyHidden}>Page </span>
                {item}
              </span>
            ) : (
              <Link
                className={styles.pageLink}
                href={makePageHref(item, values)}
                aria-label={`Aller à la page ${item}`}
              >
                {item}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {hasNextPage ? (
        <Link
          className={styles.link}
          href={makePageHref(safePage + 1, values)}
          rel="next"
        >
          Suivante
        </Link>
      ) : (
        <span className={styles.disabled}>Suivante</span>
      )}
    </nav>
  );
}
