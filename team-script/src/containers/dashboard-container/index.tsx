"use client";

import { FC, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

const DashboardContainer: FC = () => {
  const editorRef = useRef<any>(null);
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
      new Set([editorRef.current])
    );
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
