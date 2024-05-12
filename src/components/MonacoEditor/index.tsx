import { useRef } from "react";
import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { loader } from "@monaco-editor/react";
import { useGlobalContext } from "@/contexts/useGlobalContext";
import styles from "./styles.module.scss";

loader.config({ monaco });

export default function MonacoCodeEditor() {
  const { language, theme } = useGlobalContext();
  const editorRef = useRef<any>(null);

  const handleEditorMount = (editor: any, monaco: any) => {
    console.log(monaco);

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

  return (
    <div className={styles["monaco-editor"]}>
      <Editor
        className={styles["editor"]}
        // height="100vh"
        // width="1000px"
        theme={theme}
        language={language}
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
    </div>
  );
}
