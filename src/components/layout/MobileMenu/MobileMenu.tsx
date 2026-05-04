import clsx from "clsx";
import styles from "./MobileMenu.module.css";
import MainNav, { type NavItem } from "../MainNav/MainNav";

type MobileMenuProps = {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
};

export default function MobileMenu({
  items,
  isOpen,
  onClose,
  className,
}: MobileMenuProps) {
  return (
    <div
      className={clsx(
        styles.mobileMenu,
        isOpen ? styles.open : styles.closed,
        className
      )}
      aria-hidden={!isOpen}
    >
      <MainNav items={items} onNavigate={onClose} />
    </div>
  );
}