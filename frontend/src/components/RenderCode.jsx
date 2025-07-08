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

// // Helper to extract the latest code block from llmOutput
// function extractLatestCode(llmOutput) {
//   console.log("Extracting latest code from llmOutput:", llmOutput);
//   if (!Array.isArray(llmOutput)) return null;
//   // Find the last entry with type 'code' (or fallback to string message)
//   for (let i = llmOutput.length - 1; i >= 0; i--) {
//     const entry = llmOutput[i];
//     if (entry.type === 'llm-response') {
//       // Assume it's a single file, e.g. App.js

//       return { '/App.js': { code: entry.message } };
//     }
//   }

//   return null;
// }

// In your store logic file (e.g., RenderCode.jsx or store.js)

function extractLatestCode() {
  const currentState = useStore.getState().codeChunks;
  console.log("Current state of codeChunks in the store:", currentState);

  for (const key in currentState) {
    if (currentState.hasOwnProperty(key)) {
      const codeBlock = currentState[key];
      if (codeBlock && codeBlock.code) {
        console.log(`Extracting code from ${key}.jsx:`, codeBlock.code);
        // Append .jsx to the filename key
        return { [`App.js`]: { code: codeBlock.code } }; 
      }
    }
  }
  // Return undefined if no code is found, which SandPackRender will handle
  return undefined; 
}

const RenderCode = () => {
  const {code, llmOutput, clearLlmOutput, addLlmOutput, codeChunks} = useStore(selector, shallow);

  // 'code' is llmOutput array from Zustand
  const latestCode = extractLatestCode();


  return (
      <>
      <SandPackRender code = {latestCode}/>
      </>
  );
};

export default RenderCode;