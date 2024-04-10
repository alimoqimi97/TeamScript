import { useState, useRef } from "react";
import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
// import MonacoEditor from "react-monaco-editor";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { loader } from "@monaco-editor/react";
import { useGlobalContext } from "@/contexts/useGlobalContext";

loader.config({ monaco });




export default function MonacoCodeEditor() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { language } = useGlobalContext();
  // const [code, setCode] = useState<string>('')
  const editorRef = useRef<any>(null);
  // const valueGetter = useRef(null);

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

  // function handleEditorDidMount(_valueGetter: any) {
  //   setIsEditorReady(true);
  //   valueGetter.current = _valueGetter;
  // }

  // const options = {
  //   selectOnLineNumbers: true
  // };

  // const editorDidMount = (editor, monaco) => {
  //   console.log('editorDidMount', editor);
  //   editor.focus();
  // }
  // const onChange = (newValue, e) => {
  //   console.log('onChange', newValue, e);
  // }

  console.log(language);
  
  
  return (
    <>
      <Editor
          height="100vh"
          width="100vw"
          theme="vs-dark"
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
      {/* <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      /> */}
    </>
  );
}
