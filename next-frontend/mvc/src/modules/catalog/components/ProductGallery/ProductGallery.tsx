"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProductPageGalleryImage } from "@/modules/catalog/services/productPageData";
import { htmlToPlainText } from "@/lib/text/htmlToPlainText";
import styles from "./ProductGallery.module.css";

type ProductGalleryProps = {
  images: ProductPageGalleryImage[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const cleanImages = useMemo(
    () => images.filter((image) => Boolean(image.src)),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeImage = cleanImages[activeIndex];
  const hasMultipleImages = cleanImages.length > 1;
  const safeProductName = htmlToPlainText(productName) ?? productName;
  const openLightbox = (index = activeIndex) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === 0 ? cleanImages.length - 1 : current - 1
        );
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === cleanImages.length - 1 ? 0 : current + 1
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [cleanImages.length, isLightboxOpen]);

  if (!activeImage) {
    return (
      <div className={styles.placeholder}>
        <span>Image à venir</span>
      </div>
    );
  }

  const selectPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? cleanImages.length - 1 : current - 1
    );
  };

  const selectNext = () => {
    setActiveIndex((current) =>
      current === cleanImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className={styles.gallery}>
      <button
        type="button"
        className={styles.mainImageButton}
        onClick={() => openLightbox()}
        aria-label={`Agrandir ${activeImage.alt || safeProductName}`}
      >
        <Image
          src={activeImage.src}
          alt={activeImage.alt || safeProductName}
          fill
          sizes="(max-width: 820px) calc(100vw - 36px), 690px"
          className={styles.mainImage}
          priority
        />
        <span className={styles.zoomBadge} aria-hidden="true">
          <Search size={18} />
        </span>
      </button>

      {hasMultipleImages ? (
        <div className={styles.thumbnails} aria-label="Images du produit">
          {cleanImages.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              className={
                index === activeIndex
                  ? `${styles.thumbnailButton} ${styles.activeThumbnail}`
                  : styles.thumbnailButton
              }
              onClick={() => openLightbox(index)}
              aria-label={`Agrandir l'image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <Image
                src={image.thumbnail ?? image.src}
                alt=""
                fill
                sizes="76px"
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      ) : null}

      {isLightboxOpen ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={safeProductName}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            className={`${styles.lightboxButton} ${styles.closeButton}`}
            onClick={(event) => {
              event.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="Fermer"
          >
            <X size={24} />
          </button>

          {hasMultipleImages ? (
            <button
              type="button"
              className={`${styles.lightboxButton} ${styles.previousButton}`}
              onClick={(event) => {
                event.stopPropagation();
                selectPrevious();
              }}
              aria-label="Image précédente"
            >
              <ChevronLeft size={30} />
            </button>
          ) : null}

          <div className={styles.lightboxImageFrame}>
            <Image
              src={activeImage.src}
              alt={activeImage.alt || safeProductName}
              fill
              sizes="100vw"
              className={styles.lightboxImage}
              onClick={(event) => event.stopPropagation()}
            />
          </div>

          {hasMultipleImages ? (
            <button
              type="button"
              className={`${styles.lightboxButton} ${styles.nextButton}`}
              onClick={(event) => {
                event.stopPropagation();
                selectNext();
              }}
              aria-label="Image suivante"
            >
              <ChevronRight size={30} />
            </button>
          ) : null}

          {hasMultipleImages ? (
            <p className={styles.counter}>
              {activeIndex + 1} / {cleanImages.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
