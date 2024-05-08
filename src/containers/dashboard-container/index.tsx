"use client";

import { FC, useEffect } from "react";
import * as monaco from "monaco-editor";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MonacoServices } from "@codingame/monaco-languageclient";
import MonacoCodeEditor from "@/components/MonacoEditor";
import styles from "./styles.module.scss";
import { SocketProvider } from "@/contexts/useSocketContext";
import UsersVideos from "@/components/UsersVideos";
import VideoPlayer from "@/components/VideoPlayer";

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
    <SocketProvider>
      <section className={styles["dashboard-container"]}>
        {/* <MonacoCodeEditor /> */}
        <UsersVideos />
      </section>
    </SocketProvider>
  );
};

export default DashboardContainer;
