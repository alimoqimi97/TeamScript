"use client";

import { FC, useEffect } from "react";
import * as monaco from "monaco-editor";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MonacoServices } from "@codingame/monaco-languageclient";
import MonacoCodeEditor from "@/components/MonacoEditor";
import styles from "./styles.module.scss";

const DashboardContainer: FC = () => {
  const { isSignedIn } = useUser();
  const HOME_ROUTE: string = "/";

  if (!isSignedIn) {
    redirect(HOME_ROUTE);
  }

  useEffect(() => {
    MonacoServices.install(monaco);
  }, []);

  return (
    <section className={styles["dashboard-container"]}>
      <MonacoCodeEditor />
    </section>
  );
};

export default DashboardContainer;
