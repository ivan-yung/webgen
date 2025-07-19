// App.js
import React, { useState } from 'react';
import { ReactFlow } from '@xyflow/react';
import { shallow } from 'zustand/shallow';

import { useStore } from './store';

import './styles/index.css';
import Buttons from './components/Buttons.jsx';
import LLMSidebar from './components/LLMSidebar.jsx';
import NavBar from './nodes/NavBar.jsx';
import NavMenu from './nodes/NavMenu.tsx';
import Accordion from './nodes/RadixAccordion.jsx';
import RadixPicture from './nodes/RadixPicture.jsx';
import Button from './nodes/Button.jsx';
import colorPick from './nodes/colorPick.jsx';
import RenderCode from './components/RenderCode.jsx';

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  // Add llmOutput and code to the selector to pass to RenderCode
  llmOutput: store.llmOutput,
  code: store.code,
});

const nodeTypes = {
  navBar: NavBar,
  navMenu: NavMenu,
  accordion: Accordion,
  backgroundPicture: RadixPicture,
  button: Button,
  colorPick: colorPick,
};

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [showReactFlow, setShowReactFlow] = useState(true);
  const store = useStore(selector, shallow);

  // State for controlling the generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldGenerate, setShouldGenerate] = useState(false);

  // Callback for the Buttons component to report its loading status
  const handleLoadingChange = (loading) => {
    setIsGenerating(loading);
    // Reset the trigger once generation is complete
    if (!loading) {
      setShouldGenerate(false);
    }
  };

  // Click handler for the external "generate" button
  const handleExternalGenerateClick = () => {
    if (!isGenerating) {
      setShouldGenerate(true);
    }
  };


  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <div className="flex-shrink-0">
          {/* Pass the activation props to the Buttons component */}
          <Buttons
            activated={shouldGenerate}
            onLoadingChange={handleLoadingChange}
          />
          <div className="flex justify-center mt-2">
            <button
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => setShowReactFlow((prev) => !prev)}
            >
              {showReactFlow ? '⟳ Switch View' : '⟲ Show Visual Flow'}
            </button>
          </div>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-h-0">
            {showReactFlow ? (
              <ReactFlow
                nodes={store.nodes}
                nodeTypes={nodeTypes}
                edges={store.edges}
                onNodesChange={store.onNodesChange}
                onEdgesChange={store.onEdgesChange}
                onConnect={store.addEdge}
              >
              </ReactFlow>
            ) : (
              <div className="w-full h-full">
                {/* Ensure the correct code is passed to RenderCode */}
                <RenderCode code={store.llmOutput || store.code} />
              </div>
            )}
          </div>
          <LLMSidebar
            width={sidebarWidth}
            setWidth={setSidebarWidth}
          />
        </div>
        {/* The new Generate button at the bottom */}
        <button
          onClick={handleExternalGenerateClick}
          disabled={isGenerating}
          className="w-full py-3 text-lg font-semibold text-white transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
        >
          {isGenerating ? '🪄 Generating...' : '🚀 Click Here to Generate Site!'}
        </button>
      </div>
    </>
  );
}
