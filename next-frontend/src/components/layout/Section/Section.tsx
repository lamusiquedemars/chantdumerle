import clsx from "clsx";
import styles from "./Section.module.css";
import type { CSSProperties, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "beige" | "accent";
  backgroundImage?: string;
};

type SectionStyle = CSSProperties & {
  "--section-background-image"?: string;
};

export default function Section({
  children,
  className,
  id,
  background,
  backgroundImage,
}: SectionProps) {
  const style: SectionStyle = backgroundImage
    ? {
        // On passe l'image au CSS via une variable pour garder le CSS propre.
        "--section-background-image": `url(${backgroundImage})`,
      }
    : {};

  return (
    <section
      id={id}
      style={style}
      className={clsx(
        styles.section,
        styles[background],
        backgroundImage && styles.withBackground,
        className
      )}
    >
      {children}
    </section>
  );
}