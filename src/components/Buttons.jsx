import React from "react";
import {useState} from "react";

import { shallow } from 'zustand/shallow';
import { useStore } from "../store";
import { Button } from "@/components/ui/button"

import '../styles/index.css';

const selector = (store) => ({
    createNode: (type, position, data) => store.createNode(type, position, data),
    createImage: (type, position, data) => store.createImage(type, position, data),
  
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

  export default function Buttons(){
    const store = useStore(selector, shallow);
    const {logEdges, logStore} = useStore();


    const handleLogEdges = () => {logEdges();}
    const logStoreHandler = () => {logStore();}

    const createNavBar = () => {
      store.createNode(
        'navBar',
        { x: 100, y: 100},
        {Field1: 'Home', Field2: 'Features', Field3: 'Pricing', Field4: 'About', Logo: 'WebProducer'}, );
    }

    const createNavMenu = () => {
      store.createNode(
        'navMenu',
        { x: 100, y: 100},
        {Field1: 'Learn', Field2: 'Overview', Field3: 'Github'}, );
    }

    const createAccordian = () => {
      store.createNode(
        'accordian',
        { x: 100, y: 100},
        {Field1: 'Home', Field2: 'About'}, );
    }

    const createPicture = () => {
      store.createImage(
        'backgroundPicture',
        { x: 100, y: 100},
        {src: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80'},
      );
    }

    const createButton = () => {
      store.createNode(
        'button',
        { x: 100, y: 100},
        {label: 'Outline'},
      );
    }

    return(
      <>
      <div style = {{display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
        <Button variant="outline" onClick = {logStoreHandler}>🪄 Generate</Button>
        <Button variant="outline" onClick = {createNavBar}>Nav</Button>
        <Button variant="outline" onClick = {createNavMenu}>NavMenu</Button>
        <Button variant="outline" onClick = {createAccordian}>Accordian</Button>
        <Button variant="outline" onClick = {createPicture}>Picture</Button>
        <Button variant="outline" onClick = {createButton}>Button</Button>
      </div>  
      
      </>
    )

  }