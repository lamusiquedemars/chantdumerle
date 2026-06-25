import styles from "./CatalogResultsStatus.module.css";

type CatalogResultsStatusProps = {
  resultCount?: number;
  emptyMessage?: string;
};

// Statut commun aux pages catalogue: compteur et message quand aucun produit ne matche.
export default function CatalogResultsStatus({
  resultCount,
  emptyMessage,
}: CatalogResultsStatusProps) {
  return (
    <>
      {typeof resultCount === "number" ? (
        <p className={styles.resultsCount}>
          {resultCount} {resultCount > 1 ? "résultats" : "résultat"}
        </p>
      ) : null}

      {emptyMessage ? (
        <div className={styles.emptyState}>
          <p>{emptyMessage}</p>
        </div>
      ) : null}
    </>
  );
}
