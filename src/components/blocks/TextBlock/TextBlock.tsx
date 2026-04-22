import clsx from "clsx";
import styles from "./TextBlock.module.css";
import LinkButton from "@/components/ui/LinkButton/LinkButton";

type TextBlockAction = {
  label: string;
  href: string;
};

type TextBlockProps = {
  title: string;
  text: string;
  actions?: TextBlockAction[];
  className?: string;
};

export default function TextBlock({
  title,
  text,
  actions = [],
  className,
}: TextBlockProps) {
  return (
    <div className={clsx(styles.textBlock, className)}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>

      {actions.length > 0 ? (
        <div className={styles.actions}>
          {actions.map((action) => (
            <LinkButton key={action.href} href={action.href}>
              {action.label}
            </LinkButton>
          ))}
        </div>
      ) : null}
    </div>
  );
}