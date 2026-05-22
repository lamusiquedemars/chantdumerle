import clsx from "clsx";
import styles from "./Badge.module.css";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "accent" | "success";
  size?: "sm" | "md";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
    >
      {children}
    </span>
  );
}