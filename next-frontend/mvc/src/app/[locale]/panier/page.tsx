import { cookies } from "next/headers";
import Link from "next/link";

import {
  getCartItemCount,
  getWooCart,
  WOO_CART_TOKEN_COOKIE,
} from "@/modules/commerce/services/wooCart";
import styles from "./page.module.css";

type StoreCartItem = {
  key?: string;
  id?: number;
  name?: string;
  quantity?: number;
  totals?: {
    line_total?: string;
    currency_code?: string;
    currency_symbol?: string;
    currency_minor_unit?: number;
  };
};

type StoreCartView = {
  items?: StoreCartItem[];
  items_count?: number;
  totals?: {
    total_price?: string;
    total_items?: string;
    currency_code?: string;
    currency_symbol?: string;
    currency_minor_unit?: number;
  };
};

const wooBaseUrl =
  process.env.WOO_BASE_URL ??
  process.env.NEXT_PUBLIC_WP_URL ??
  process.env.WP_GRAPHQL_URL?.replace(/\/graphql\/?$/, "");

const wooHref = (path: string) =>
  wooBaseUrl ? new URL(path, wooBaseUrl).toString() : path;

function formatWooAmount(
  amount?: string,
  currency = "EUR",
  minorUnit = 2
) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return null;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(value / 10 ** minorUnit);
}

export default async function CartPage() {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get(WOO_CART_TOKEN_COOKIE)?.value;
  const { json: cart } =
    wooBaseUrl && cartToken
      ? await getWooCart({ baseUrl: wooBaseUrl, cartToken })
      : { json: null };

  const cartView = cart as StoreCartView | null;
  const itemCount = getCartItemCount(cartView);
  const items = cartView?.items ?? [];
  const total = formatWooAmount(
    cartView?.totals?.total_price,
    cartView?.totals?.currency_code,
    cartView?.totals?.currency_minor_unit
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Panier</p>
        <h1>Votre panier</h1>
      </header>

      {itemCount > 0 ? (
        <section className={styles.cart} aria-label="Contenu du panier">
          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.key ?? item.id} className={styles.item}>
                <span>{item.name ?? "Produit"}</span>
                <strong>Quantité : {item.quantity ?? 0}</strong>
              </li>
            ))}
          </ul>

          <div className={styles.summary}>
            <p>
              Articles : <strong>{itemCount}</strong>
            </p>
            {total ? <p>Total : <strong>{total}</strong></p> : null}
            <a className={styles.checkout} href={wooHref("/commande/")}>
              Passer commande
            </a>
          </div>
        </section>
      ) : (
        <section className={styles.empty}>
          <p>
            {cartToken
              ? "Votre panier est vide."
              : "Aucun panier actif n’a été retrouvé sur ce navigateur."}
          </p>
          <Link href="/fr/cordes">Parcourir les produits</Link>
        </section>
      )}
    </main>
  );
}
