import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react"
import SandPackRender from './SandPackRender';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';


const selector =  (store) => ({
  code: store.code,
  llmOutput: store.llmOutput,
  clearLlmOutput: store.clearLlmOutput,
  addLlmOutput: store.addLlmOutput,
});

// Helper to extract the latest code block from llmOutput
function extractLatestCode(llmOutput) {
  console.log("Extracting latest code from llmOutput:", llmOutput);
  if (!Array.isArray(llmOutput)) return null;
  // Find the last entry with type 'code' (or fallback to string message)
  for (let i = llmOutput.length - 1; i >= 0; i--) {
    const entry = llmOutput[i];
    if (entry.type === 'llm-response') {
      // Assume it's a single file, e.g. App.js
      console.log("YAAAAAAAAAAAS");
      return { '/App.js': { code: entry.message } };
    }
  }
  console.log("FUCK");
  return null;
}

const RenderCode = () => {
  const {code, llmOutput, clearLlmOutput, addLlmOutput, codeChunks} = useStore(selector, shallow);

  // 'code' is llmOutput array from Zustand
  const latestCode = extractLatestCode(llmOutput);
  console.log("Rendering code:", latestCode);

  return (
      <>
      <SandPackRender code = {latestCode}/>
      </>
  );
};

export default RenderCode;