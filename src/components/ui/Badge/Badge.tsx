import clsx from "clsx";
import styles from "./Badge.module.css";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return <span className={clsx(styles.badge, className)}>{children}</span>;
}