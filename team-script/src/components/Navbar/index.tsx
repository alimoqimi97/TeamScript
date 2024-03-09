"use client";
import { FC } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import styles from "./styles.module.scss";

const Navbar: FC = () => {
  const { user, isLoaded } = useUser();

  return (
    <nav className={styles["navbar"]}>
      <Link href="/">Home</Link>
      {isLoaded && user ? (
        <div className="w-auto flex justify-between items-center">
          {" "}
          <Link href="/dashboard">Dashboard</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link href="/">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
