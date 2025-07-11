import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

// Define the default "Hello World" code as a constant
const defaultFiles = {
  "/App.js": `export default function App() {
  return <h1>Hello World</h1>
}`,
};

const SandPackRender = ({ code }) => {
  // Determine which files to use: the provided code or the default placeholder
  const files = code && Object.keys(code).length > 0 ? code : defaultFiles;

  // Determine the active file. If using the provided code, make its first file active.
  // Otherwise, default to "/App.js".
  const activeFileName = code && Object.keys(code).length > 0 ? Object.keys(code)[0] : "/App.js";

  return (
    <Sandpack
      files={files}
      template="react"
      options={{
        activeFile: activeFileName,
        // You can add other options here, like making the editor read-only
        // readOnly: true, 
      }}
    />
  );
};

export default SandPackRender;