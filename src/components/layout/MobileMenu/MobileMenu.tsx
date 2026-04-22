import clsx from "clsx";
import styles from "./MobileMenu.module.css";
import MainNav, { type NavItem } from "../MainNav/MainNav";

type MobileMenuProps = {
  items: NavItem[];
  isOpen: boolean;
  className?: string;
};

export default function MobileMenu({
  items,
  isOpen,
  className,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className={clsx(styles.mobileMenu, className)}>
      <MainNav items={items} />
    </div>
  );
}