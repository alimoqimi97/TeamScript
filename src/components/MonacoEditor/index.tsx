import Editor, { monaco } from "@monaco-editor/react";
import MonacoEditor from 'react-monaco-editor';
import {
  MonacoToProtocolConverter,
  ProtocolToMonacoConverter,
} from "@codingame/monaco-languageclient/lib/monaco-converter";
import { useState, useRef } from "react";
import { integer } from "@codingame/monaco-languageclient";
const path = require("path");

// https://github.com/microsoft/monaco-editor-samples/blob/master/electron-amd-nodeIntegration/electron-index.html
function uriFromPath(_path) {
  let pathName = path.resolve(_path).replace(/\\/g, "/");

  if (pathName.length > 0 && pathName.charAt(0) !== "/") {
    pathName = `/${pathName}`;
  }
  return encodeURI(`file://${pathName}`);
}

// monaco.config({
//   urls: {
//     monacoLoader: uriFromPath(
//       path.join(__dirname, "../node_modules/monaco-editor/min/vs/loader.js")
//     ),
//     monacoBase: uriFromPath(
//       path.join(__dirname, "../node_modules/monaco-editor/min/vs")
//     ),
//   },
// });

export default function MonacoCodeEditor() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  // const [code, setCode] = useState<string>('')
  const valueGetter = useRef(null);

  function handleEditorDidMount(_valueGetter: any) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

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
  return (
    <>
      <Editor
        height="100%"
        width="100%"
        language="javascript"
        theme="dark"
        value="// write your code here"
        onMount={handleEditorDidMount}
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
