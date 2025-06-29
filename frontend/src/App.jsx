// App.js
import React, {useState} from 'react';
import { ReactFlow } from '@xyflow/react';
import { shallow } from 'zustand/shallow';

import { useStore } from './store';

import './styles/index.css';
import Buttons from './components/Buttons.jsx';
import LLMSidebar from './components/LLMSidebar.jsx'; // Import the new sidebar
import NavBar from './nodes/NavBar.jsx';
import NavMenu from './nodes/NavMenu.jsx';
import Accordion from './nodes/RadixAccordion.jsx';
import RadixPicture from './nodes/RadixPicture.jsx';
import Button from './nodes/Button.jsx';
import colorPick from './nodes/colorPick.jsx';

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
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
  const store = useStore(selector, shallow);

  return (
    <>
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-shrink-0">
      <Buttons />
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-h-0">
          <ReactFlow
            nodes={store.nodes}
            nodeTypes={nodeTypes}
            edges={store.edges}
            onNodesChange={store.onNodesChange}
            onEdgesChange={store.onEdgesChange}
            onConnect={store.addEdge}
          >
          </ReactFlow>
        </div>
        <LLMSidebar 
        width = {sidebarWidth}
        setWidth = {setSidebarWidth}
        />
      </div>
    </div>
  </>
  );
}