import clsx from "clsx";
import styles from "./Container.module.css";
import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide";
};

export default function Container({
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <div className={clsx(styles.container, styles[`width-${width}`], className)}>
      {children}
    </div>
  );
}
