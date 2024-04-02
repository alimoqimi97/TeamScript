"use client";

import { FC, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import styles from "./styles.module.scss";

import { MonacoServices } from "@codingame/monaco-languageclient";

import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

loader.config({ monaco });

const DashboardContainer: FC = () => {
  const { isSignedIn } = useUser();
  const editorRef = useRef<any>(null);
  const HOME_ROUTE: string = "/";

  if (!isSignedIn) {
    redirect(HOME_ROUTE);
  }

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    // initialize YJS
    const doc = new Y.Doc(); // collection of shared objects -> Text

    // Connect to peers (or start connection) with WebRTC
    const provider = new WebrtcProvider("TeamScriptRoom", doc, {
      signaling: ["ws://localhost:4444"],
    });
    const text = doc.getText("code"); // doc {"code": "what ide is showing."}
    provider.on("synced", (synced) => {
      console.log("synced!", synced);
    });
    // Bind Yjs to monaco
    const binding = new MonacoBinding(
      text,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  };

  useEffect(() => {
    MonacoServices.install(monaco);
  }, []);

  return (
    <section className={styles["dashboard-container"]}>
      <Editor
        height="100vh"
        width="100vw"
        theme="vs-dark"
        language="cpp"
        onMount={handleEditorMount}
        options={{
          autoIndent: "full",
          contextmenu: true,
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 24,
          hideCursorInOverviewRuler: true,
          matchBrackets: "always",
          minimap: {
            enabled: true,
            maxColumn: 1,
            side: "right",
            size: "fill",
            renderCharacters: true,
            scale: 1,
          },
          scrollbar: {
            horizontalSliderSize: 4,
            verticalSliderSize: 18,
          },
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
        }}
      />
    </section>
  );
};

export default DashboardContainer;
