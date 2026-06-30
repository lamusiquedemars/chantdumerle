import AddToCartButton from "@/modules/commerce/components/AddToCartButton/AddToCartButton";
import type { ProductPageItem } from "@/modules/catalog/services/productPageData";
import ProductGallery from "@/modules/catalog/components/ProductGallery/ProductGallery";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { localizedHref } from "@/lib/i18n/routing/localizedHref";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";

import styles from "./ProductDetail.module.css";

type ProductDetailProps = {
  locale: string;
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

function findProductField(product: ProductPageItem, label: string) {
  return product.identity.find((field) => field.label === label);
}

const ACCESSORY_TYPE_BREADCRUMBS: Record<string, string> = {
  colophane: "Colophanes",
  epauliere: "Épaulières",
  sourdine: "Sourdines",
  etui: "Étuis",
  housse: "Housses",
  "etui-pour-archet": "Étuis pour archet",
  "support-de-pique": "Supports de pique",
  entretien: "Entretien",
};

const PACK_TYPE_BREADCRUMBS: Record<
  string,
  { label: string; href: string }
> = {
  "pack-essentiel-cordes": {
    label: "Pack essentiel cordes",
    href: "/selections/packs/essentiel-cordes",
  },
  "pack-essentiel-archet": {
    label: "Pack essentiel archet",
    href: "/selections/packs/essentiel-archet",
  },
  "pack-performance-archet": {
    label: "Pack performance archet",
    href: "/selections/packs/performance-archet",
  },
};

function buildProductBreadcrumbItems(
  product: ProductPageItem,
  locale: string
): BreadcrumbItem[] {
  const instrument = findProductField(product, "Instrument");
  const productType = findProductField(product, "Type de produit");
  const packType = findProductField(product, "Type pack");
  const packTypeBreadcrumb = packType?.slug
    ? PACK_TYPE_BREADCRUMBS[packType.slug]
    : undefined;
  const accessoryTypeLabel = productType?.slug
    ? ACCESSORY_TYPE_BREADCRUMBS[productType.slug]
    : undefined;
  const items: BreadcrumbItem[] = [
    { label: "Accueil", href: localizedHref(locale) },
  ];

  if (productType?.slug && accessoryTypeLabel) {
    items.push(
      { label: "Accessoires", href: localizedHref(locale, "/accessoires") },
      {
        label: accessoryTypeLabel,
        href: localizedHref(locale, `/accessoires?type=${productType.slug}`),
      },
      { label: htmlToPlainText(product.name) ?? product.name }
    );

    return items;
  }

  if (productType?.slug === "pack") {
    items.push(
      { label: "Sélections", href: localizedHref(locale, "/selections") },
      { label: "Packs", href: localizedHref(locale, "/selections#packs") }
    );

    if (packTypeBreadcrumb) {
      items.push({
        label: packTypeBreadcrumb.label,
        href: localizedHref(locale, packTypeBreadcrumb.href),
      });
    }

    items.push({ label: htmlToPlainText(product.name) ?? product.name });

    return items;
  }

  if (productType?.slug === "archet") {
    items.push(
      { label: "Archets", href: localizedHref(locale, "/archets") },
      { label: htmlToPlainText(product.name) ?? product.name }
    );

    return items;
  }

  items.push({ label: "Cordes", href: localizedHref(locale, "/cordes") });

  if (instrument?.slug) {
    items.push({
      label: instrument.value,
      href: localizedHref(
        locale,
        `/cordes?instrument=${instrument.slug}&prefilter=instrument`
      ),
    });
  }

  items.push({ label: htmlToPlainText(product.name) ?? product.name });

  return items;
}

// Vue detail produit reutilisable, independante de la route Next.js.
export default function ProductDetail({ locale, product }: ProductDetailProps) {
  const categoryNames = product.categories.map((category) => category.name);
  const stockStatus = product.stockStatus?.toUpperCase();
  const isExplicitlyOutOfStock = stockStatus === "OUT_OF_STOCK";
  const isInStock = !isExplicitlyOutOfStock;
  /*
   * WooCommerce reste l’arbitre final du stock dans l’endpoint panier.
   * Ici, on bloque seulement les cas explicitement non achetables pour éviter
   * qu’une donnée GraphQL absente ou mal normalisée rende le bouton muet.
   */
  const canAddToCart = product.purchasable !== false && !isExplicitlyOutOfStock;
  const productName = htmlToPlainText(product.name) ?? product.name;
  const breadcrumbItems = buildProductBreadcrumbItems(product, locale);

  const stockLabel =
    isInStock && typeof product.stockQuantity === "number"
      ? `${product.stockQuantity} en stock`
      : isInStock
        ? "En stock"
        : "Indisponible";

  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbItems} className={styles.breadcrumbs} />

      <section className={styles.hero}>
        <ProductGallery
          images={product.galleryImages}
          productName={productName}
        />

        <div className={styles.summary}>
          {categoryNames.length > 0 ? (
            <p className={styles.category}>{categoryNames.join(" · ")}</p>
          ) : null}

          <h1>{productName}</h1>

          {product.shortDescription ? (
            <div
              className={styles.shortDescription}
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          ) : null}

          <div className={styles.buyBox}>
            <AddToCartButton
              productId={product.databaseId}
              disabled={!canAddToCart}
              priceHtml={product.price}
              sku={product.sku}
              stockLabel={stockLabel}
              isInStock={isInStock}
              variationOptions={product.variationOptions}
              variations={product.variations}
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
