import clsx from "clsx";
import styles from "./Hero.module.css";
import LinkButton from "@/components/ui/LinkButton/LinkButton";

type HeroAction = {
  label: string;
  href: string;
};

type HeroVariant = "home" | "page" | "wide";
type HeroAlign = "left" | "center";

type HeroProps = {
  title: string;
  subtitle?: string;
  actions?: HeroAction[];
  variant?: HeroVariant;
  align?: HeroAlign;
  className?: string;
};

export default function Hero({
  title,
  subtitle,
  actions = [],
  variant = "page",
  align = "left",
  className,
}: HeroProps) {
  return (
    <section
      className={clsx(
        styles.hero,
        styles[variant],
        styles[align],
        className
      )}
    >
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>

        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

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
    </section>
  );
}