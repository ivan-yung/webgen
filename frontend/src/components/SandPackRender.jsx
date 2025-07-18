import React, { useState, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import SplitPane from 'react-split-pane';
import '../styles/SandPackFlex.css';

const defaultFiles = {
  "/App.js": `export default function App() {
  return <h1>Hello World</h1>
}`,
};

const SandPackRender = ({ code }) => {
  const files = code && Object.keys(code).length > 0 ? code : defaultFiles;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SandpackProvider
      key={JSON.stringify(files)}
      files={files}
      template="react"
    >
      {/*
        The SplitPane component is used to create the resizable layout.
        - 'split' determines the orientation of the split.
        - 'minSize' and 'defaultSize' control the initial and minimum width of the left pane.
        - 'pane2Style' ensures the second pane (preview) fills the remaining space.
      */}
      <SplitPane
        split="vertical"
        minSize={200}
        defaultSize="50%"
        pane2Style={{ overflow: 'auto' }}
      >
        {/* The SandpackCodeEditor is placed in the left pane */}
        <SandpackCodeEditor
          showLineNumbers={true}
          showInlineErrors={true}
          wrapContent={true}
          style={{
            height: '750px',
            overflow: 'auto',
          }}
        />
        {/*
          The SandpackLayout and SandpackPreview are in the right pane.
          We hide the editor within this layout to only show the preview.
        */}
        <SandpackLayout>
          <SandpackPreview
            style={{
              height: '750px',
            }}
            showNavigator={false} // Optionally hide the navigator for a cleaner look
          />
        </SandpackLayout>
      </SplitPane>
    </SandpackProvider>
  );
};

export default SandPackRender;