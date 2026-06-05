import AddToCartButton from "@/modules/commerce/components/AddToCartButton/AddToCartButton";
import type { ProductPageItem } from "@/modules/catalog/services/wordpressProducts";

import styles from "./ProductDetail.module.css";

type ProductDetailProps = {
  product: ProductPageItem;
};

type ProductField = {
  label: string;
  value: string;
};

function ProductFieldGroup({
  title,
  fields,
}: {
  title: string;
  fields: ProductField[];
}) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <section className={styles.infoGroup}>
      <h2>{title}</h2>

      <dl className={styles.fieldList}>
        {fields.map((field) => (
          <div key={`${field.label}-${field.value}`} className={styles.field}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// Vue detail produit reutilisable, independante de la route Next.js.
export default function ProductDetail({ product }: ProductDetailProps) {
  const categoryNames = product.categories.map((category) => category.name);
  const isInStock = product.stockStatus === "IN_STOCK";

  const stockLabel =
    isInStock && typeof product.stockQuantity === "number"
      ? `${product.stockQuantity} en stock`
      : isInStock
        ? "En stock"
        : "Indisponible";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.imageWrapper}>
          {product.image?.sourceUrl ? (
            <img
              src={product.image.sourceUrl}
              alt={product.image.altText || product.name}
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>Image à venir</div>
          )}
        </div>

        <div className={styles.summary}>
          {categoryNames.length > 0 ? (
            <p className={styles.category}>{categoryNames.join(" · ")}</p>
          ) : null}

          <h1>{product.name}</h1>

          {product.shortDescription ? (
            <div
              className={styles.shortDescription}
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          ) : null}

          {product.price ? (
            <p
              className={styles.price}
              dangerouslySetInnerHTML={{ __html: product.price }}
            />
          ) : null}

          <p className={isInStock ? styles.stockOk : styles.stockKo}>
            {stockLabel}
          </p>

          {product.sku ? <p className={styles.sku}>SKU : {product.sku}</p> : null}

          <div className={styles.buyBox}>
            <AddToCartButton
              productId={product.databaseId}
              disabled={
                !product.purchasable || product.stockStatus !== "IN_STOCK"
              }
            />
          </div>
        </div>
      </section>

      <section className={styles.details}>
        <ProductFieldGroup title="Repères produit" fields={product.identity} />
        <ProductFieldGroup title="Caractère sonore" fields={product.sound} />
        <ProductFieldGroup title="Fiche technique" fields={product.technical} />

        {product.description ? (
          <section className={styles.description}>
            <h2>Description</h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </section>
        ) : null}
      </section>
    </main>
  );
}
