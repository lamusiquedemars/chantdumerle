"use client";

import { useState } from "react";
import styles from "./ProductPage.module.css";

type AddToCartButtonProps = {
  productId: number;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleAddToCart() {
    setStatus("loading");

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
        throw new Error("Erreur lors de l’ajout au panier.");
      }

      setStatus("success");
    } catch {
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
        }}
        className={styles.quantity}
      />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || status === "loading"}
        className={styles.cartButton}
      >
        {status === "loading" ? "Ajout en cours…" : "Ajouter au panier"}
      </button>

      {status === "success" ? (
        <p className={styles.notice}>Produit ajouté au panier.</p>
      ) : null}

      {status === "error" ? (
        <p className={styles.notice}>Impossible d’ajouter ce produit au panier.</p>
      ) : null}
    </>
  );
}