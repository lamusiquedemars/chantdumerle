"use client";

import { useRef } from "react";
import clsx from "clsx";
import ProductCard, {
  type ProductCardItem,
} from "@/modules/catalog/components/ProductCard/ProductCard";
import styles from "./ProductCarousel.module.css";

type ProductCarouselProps = {
  items?: ProductCardItem[];
  className?: string;
  label?: string;
};

export default function ProductCarousel({
  items = [],
  className,
  label = "Produits mis en avant",
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  if (items.length === 0) {
    return null;
  }

  function scroll(direction: "previous" | "next") {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstItem = track.querySelector<HTMLElement>("[data-carousel-item]");
    const scrollAmount = firstItem
      ? firstItem.offsetWidth + 24
      : track.clientWidth * 0.8;

    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className={clsx(styles.carousel, className)} aria-label={label}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => scroll("previous")}
          aria-label="Voir les produits précédents"
        >
          ←
        </button>

        <button
          type="button"
          className={styles.button}
          onClick={() => scroll("next")}
          aria-label="Voir les produits suivants"
        >
          →
        </button>
      </div>

      <div ref={trackRef} className={styles.track}>
        {items.map((item) => (
          <div
            key={item.href}
            className={styles.item}
            data-carousel-item
          >
            <ProductCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
