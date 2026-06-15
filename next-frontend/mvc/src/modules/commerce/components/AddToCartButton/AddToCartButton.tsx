"use client";

import { useState } from "react";

import styles from "./AddToCartButton.module.css";

type AddToCartButtonProps = {
  productId: number;
  disabled?: boolean;
};

// Bouton panier client branche sur le handler commerce du starter.
export default function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAddToCart() {
    if (disabled) {
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(json?.error ?? "Erreur lors de l’ajout au panier.");
      }

      const json = (await res.json()) as { itemCount?: number };

      window.dispatchEvent(
        new CustomEvent("cdm:cart-updated", {
          detail: {
            itemCount: json.itemCount,
          },
        })
      );

      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’ajouter ce produit au panier."
      );
      setStatus("error");
    }
  }

  return (
    <>
      <label htmlFor="quantity">Quantité</label>

      <input
        id="quantity"
        name="quantity"
        type="number"
        min="1"
        value={quantity}
        onChange={(event) => {
          setQuantity(Number(event.target.value));
          setStatus("idle");
          setErrorMessage(null);
        }}
        className={styles.quantity}
      />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || status === "loading"}
        className={styles.cartButton}
      >
        {disabled
          ? "Produit indisponible"
          : status === "loading"
            ? "Ajout en cours…"
            : "Ajouter au panier"}
      </button>

      {disabled ? (
        <p className={styles.noticeError}>
          Ce produit n’est pas disponible à l’achat pour le moment.
        </p>
      ) : null}

      {status === "success" ? (
        <p className={styles.notice}>Produit ajouté au panier. Le compteur est à jour.</p>
      ) : null}

      {status === "error" ? (
        <p className={styles.noticeError}>
          {errorMessage ?? "Impossible d’ajouter ce produit au panier."}
        </p>
      ) : null}
    </>
  );
}
