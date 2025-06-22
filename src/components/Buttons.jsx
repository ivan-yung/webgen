import React from "react";
import {useState} from "react";

import { shallow } from 'zustand/shallow';
import { useStore } from "../store";

import Osc from "../nodes/Osc";


const selector = (store) => ({
    createNode: (type, position, data) => store.createNode(type, position, data),
  
    bezEdge: store.updateEdgesDefault,
    stepEdge: store.updateEdgesToSmoothstep,
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    addEdge: store.addEdge,
  
    logEdges: store.logEdges,
    logStore: store.logStore,
  });
  
  const nodeTypes = {
    osc: Osc,
  
  };

  export default function Buttons(){
    const store = useStore(selector, shallow);
    const {logEdges, logStore} = useStore();


    const handleLogEdges = () => {logEdges();}
    const logStoreHandler = () => {logStore();}

    //Node creation calls
    const createOsc = () => {
      store.createNode(
        'osc',
        { x: 100, y: 100},
        {frequency: 0, type: 'sine'}, );
    }

    return(
      <>
      <div style = {{display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0',}}>
        <button onClick = {logStoreHandler}>Log</button>
        <button onClick = {createOsc}>Osc</button>

      </div>  
      
      </>
    )

  }