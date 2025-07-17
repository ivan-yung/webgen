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

function extractLatestCode() {
  const currentState = useStore.getState().codeChunks;
  for (const key in currentState) {
    if (currentState.hasOwnProperty(key)) {
      const codeBlock = currentState[key];
      if (codeBlock && codeBlock.code) {
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
  console.log('Latest Code:', latestCode);

  return (
      <>
      <SandPackRender code = {latestCode}/>
      </>
  );
};

export default RenderCode;


