import Link from "next/link";
import clsx from "clsx";
import styles from "./LinkButton.module.css";
import type { ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export default function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: LinkButtonProps) {
  return (
    <Link href={href} className={clsx(styles.linkButton, styles[variant], className)}>
      {children}
    </Link>
  );
}