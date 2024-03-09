import { FC } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

const Navbar: FC = () => {
  return (
    <nav className={styles["navbar"]}>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
};

export default Navbar
