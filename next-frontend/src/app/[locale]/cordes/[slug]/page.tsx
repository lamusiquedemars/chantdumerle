import { notFound } from "next/navigation";
import { getProductPageBySlug } from "@/lib/wordpress/products";
import styles from "./ProductPage.module.css";
import AddToCartButton from "./AddToCartButton";

type StringProductPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type ProductField = {
  label: string;
  value: string;
};

/*
 * Petite liste de champs produit.
 * Elle n’affiche rien si le groupe est vide.
 */
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

export default async function StringProductPage({
  params,
}: StringProductPageProps) {
  const { slug } = await params;

  const product = await getProductPageBySlug(slug);

  if (!product) {
    notFound();
  }

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

          {product.sku ? (
            <p className={styles.sku}>SKU : {product.sku}</p>
          ) : null}

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
