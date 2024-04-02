

import Editor, { monaco } from '@monaco-editor/react';
import { useState, useRef } from 'react';
const path = require('path')

// https://github.com/microsoft/monaco-editor-samples/blob/master/electron-amd-nodeIntegration/electron-index.html
function uriFromPath(_path) {
  let pathName = path.resolve(_path).replace(/\\/g, '/');

  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = `/${pathName}`;
  }
  return encodeURI(`file://${pathName}`);
}

monaco.config({
  urls: {
    monacoLoader: uriFromPath(
      path.join(__dirname, '../node_modules/monaco-editor/min/vs/loader.js')
    ),
    monacoBase: uriFromPath(
      path.join(__dirname, '../node_modules/monaco-editor/min/vs')
    )
  }
});

export default function MonacoEditor() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const valueGetter = useRef(null);

  function handleEditorDidMount(_valueGetter: any) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

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
    </>
  );
}