"use client";

import { FC, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
    const provider = new WebrtcProvider("TeamScriptRoom", doc);
    const text = doc.getText("code"); // doc {"code": "what ide is showing."}

    // Bind Yjs to monaco
    const binding = new MonacoBinding(
      text,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  };

  return (
    <section>
      <Editor
        height="100vh"
        width="100vw"
        theme="vs-dark"
        language="typescript"
        onMount={handleEditorMount}
      />
    </section>
  );
};

export default DashboardContainer;
