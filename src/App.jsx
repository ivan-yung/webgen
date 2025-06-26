import React from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import { shallow } from 'zustand/shallow';
 
import { useStore } from './store';

import './styles/index.css';
import Buttons from './components/Buttons.jsx';
import NavBar from './nodes/NavBar.jsx';
import NavMenu from './nodes/NavMenu.jsx';
import Accordian from './nodes/RadixAccordian.jsx';
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
  accordian: Accordian,
  backgroundPicture: RadixPicture,
  button: Button,
  colorPick: colorPick,
};

export default function App() {
  const store = useStore(selector, shallow);
 
  return (
    <>
      <Buttons/>
      <ReactFlow
        nodes={store.nodes}
        nodeTypes={nodeTypes}
        edges={store.edges}
        onNodesChange={store.onNodesChange}
        onEdgesChange={store.onEdgesChange}
        onConnect={store.addEdge}
      >
      <div className="bg-gray-100 h-full w-full">
      </div>
      </ReactFlow>
      
    </>
  );
}