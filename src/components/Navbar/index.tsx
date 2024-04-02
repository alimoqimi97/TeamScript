"use client";
import { FC } from "react";
import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import styles from "./styles.module.scss";

const Navbar: FC = () => {
  const { user, isLoaded } = useUser();

  return (
    <nav className={styles["navbar"]}>
      <Link href="/">TeamScript</Link>
      {isLoaded && user ? (
        <div className="w-auto flex justify-between items-center min-w-14">
          {" "}
          <Link href="/dashboard">Dashboard</Link>
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
