import clsx from "clsx";
import styles from "./GuideContent.module.css";
import type { ReactNode } from "react";

type GuideContentProps = {
  children: ReactNode;
  className?: string;
};

export default function GuideContent({
  children,
  className,
}: GuideContentProps) {
  return <article className={clsx(styles.content, className)}>{children}</article>;
}