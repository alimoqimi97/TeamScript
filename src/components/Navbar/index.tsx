"use client";
import { FC } from "react";
import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import LanguageSelector from "../LanguageSelector";
import styles from "./styles.module.scss";

const Navbar: FC = () => {
  const { user, isLoaded } = useUser();

  return (
    <nav className={styles["navbar"]}>
      <Link href="/">TeamScript</Link>
      {isLoaded && user ? (
        <div className={styles["actions"]}>
          <LanguageSelector /> <Link href="/dashboard" prefetch={false}>Dashboard</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <SignInButton>
          <button className={styles["sign-in"]}>Sign-in</button>
        </SignInButton>
      )}
    </nav>
  );
};

export default Navbar;
