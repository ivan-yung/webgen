import React from 'react';
import SandPackRender from './SandPackRender';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';

// 1. CORRECTED: The selector now correctly pulls the `codeChunks` array from the store.
const selector = (store) => ({
  codeChunks: store.codeChunks,
});

/**
 * 2. REWRITTEN: This new function finds the LATEST code chunk.
 * It accepts the chunks array as an argument instead of calling the store directly.
 *
 * @param {Array} chunks - The codeChunks array from the store.
 * @returns {Object|undefined} - The Sandpack-formatted file object or undefined.
 */
function findLatestCodeChunk(chunks) {
  // Guard against empty or invalid input
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return undefined;
  }

  // Find the last chunk in the array that has a 'code' property.
  const latestCodeChunk = chunks
    .slice()
    .reverse()
    .find(chunk => chunk.hasOwnProperty('code'));

  if (latestCodeChunk) {
    // CHANGED: The filename is now /App.js to match the Sandpack default.
    return { '/App.js': { code: latestCodeChunk.code } };
  }

  return undefined;
}
const RenderCode = () => {
  // 3. CORRECTED: We now get the codeChunks array from our corrected selector.
  const { codeChunks } = useStore(selector, shallow);

  // 4. Call the rewritten function with the reactive state from the hook.
  const latestCode = findLatestCodeChunk(codeChunks);

  console.log('Latest Code for Sandpack:', latestCode);

  return (
    // The SandPackRender component receives the correctly formatted, latest code.
    <SandPackRender code={latestCode} />
  );
};

export default RenderCode;