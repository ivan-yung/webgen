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

    //Node creation calls
    const createOsc = () => {
      store.createNode(
        'osc',
        { x: 100, y: 100},
        {frequency: 0, type: 'sine'},
      );}

    const createNavBar = () => {
      store.createNode(
        'navBar',
        { x: 100, y: 100},
        {Field1: 'Home', Field2: 'About'}, );
    }

    const createNavMenu = () => {
      store.createNode(
        'navMenu',
        { x: 100, y: 100},
        {Field1: 'Home', Field2: 'About'}, );
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
        {src: 'https://via.placeholder.com/150', alt: 'Placeholder Image'},
      );
    }

    const createButton = () => {
      store.createNode(
        'button',
        { x: 100, y: 100},
        {label: 'Button'},
      );
    }

    return(
      <>
      <div style = {{display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
        <Button variant="outline" onClick = {logStoreHandler}>Log</Button>
        <Button variant="outline" onClick = {createOsc}>Osc</Button>
        <Button variant="outline" onClick = {createNavBar}>Nav</Button>
        <Button variant="outline" onClick = {createNavMenu}>NavMenu</Button>
        <Button variant="outline" onClick = {createAccordian}>Accordian</Button>
        <Button variant="outline" onClick = {createPicture}>Picture</Button>
        <Button variant="outline" onClick = {createButton}>Button</Button>
      </div>  
      
      </>
    )

  }