import React, { useState, useEffect } from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

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

  // Mobile mode detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Sandpack
      files={files}
      template="react"
      options={{
        activeFile: activeFileName,
        showLineNumbers: true, // default - true
        showInlineErrors: true, // default - false
        wrapContent: true, // default - false
        editorHeight: 750, // default - 300
        editorWidthPercentage: isMobile ? 10 : 30, // 70% code display, 30% editor on mobile

      }}
    />

  );
};

export default SandPackRender;
