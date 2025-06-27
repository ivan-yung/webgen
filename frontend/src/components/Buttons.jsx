import React from "react";
import {useState} from "react";

import { shallow } from 'zustand/shallow';
import { useStore } from "../store";
import { Button } from "@/components/ui/button";

import CodeDisplay from "./CodeDisplay.jsx";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import prompt from '../../prompts/gensite.txt?raw';
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

function parseJson(raw){
  
  const len = raw.length;
  const bgColor = raw[0].data.color;
  const accColor = raw[1].data.color;

  let parsed = {
    layout: []
  };

  parsed.layout = ({Theme: bgColor, Accent: accColor})

  for (let i=3; i<len; i++){

    switch(raw[i].type){
      case 'navBar':
        parsed.navBar = {
          position: raw[i].position,
          data: raw[i].data,
          size: raw[i].measured,
        };
        break;
      case 'navMenu':
        parsed.navMenu = {
          position: raw[i].position,
          data: raw[i].data,
          size: raw[i].measured,
        };
        break;
      case 'accordion':
        parsed.accordion = {
          position: raw[i].position,
          data: raw[i].data,
          size: raw[i].measured,
        };
        break;
      case 'backgroundPicture':
        parsed.image = {
          position: raw[i].position,
          data: raw[i].data,
          size: raw[i].measured,
        };
        break;
      case 'button':
          parsed.button = {
            position: raw[i].position,
            data: raw[i].data,
            size: raw[i].measured,  
          }
    };


  };
  console.log(parsed);
  return parsed;
};

  export default function Buttons(){
    const store = useStore(selector, shallow);
    const {logEdges, logStore} = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState(null);

    const GenerateHandler = async () => {
      setIsLoading(true);
      setError(null);
      const rawLayout = logStore();
      console.log(rawLayout);
      
      //parse rawLayout
      const layout = parseJson(rawLayout);
      console.log(layout);
      //forward parsed layout to go server
      const instructions = prompt;

      // try {
      //   const response = await fetch('/api/groq', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       designJson: layout,
      //       instructions,
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error('Failed to fetch from backend');
      //   }

      //   const data = await response.json();
      //   console.log('Groq API completion:', data.completion);
      //   setGeneratedCode(data.completion);
      //   // Optionally update state/UI with data.completion

      // } catch (error) {
      //   console.error('Error:', error);
      //   setError(error.message);
      // } finally {
      //   setIsLoading(false);
      // }
      setError('there is an error');
      setIsLoading(false);
    }
    
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

    const createaccordion = () => {
      store.createNode(
        'accordion',
        { x: 100, y: 100},
        {
        Heading1: 'Is it free?', 
        Heading2: 'How does it work?',
        Heading3: 'How can I generate?', 
        Content1: 'Yes. it is free for usage!',
        Content2: 'Every front end ui component is represented as a json object, which can be used to generate code for your project.',
        Content3: 'You can generate code by clicking on the generate button, which will create code for all the components you have created in the canvas.',
      }, );
    }

    const createPicture = () => {
      store.createImage(
        'backgroundPicture',
        { x: 100, y: 100},
        {src: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80', Hero: false},
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
        <Button variant="outline" onClick = {GenerateHandler}>
          {isLoading ? '🪄 Generating...' : '🪄 Generate'}
        </Button>
        <Button variant="outline" onClick = {createNavBar}>Nav</Button>
        <Button variant="outline" onClick = {createNavMenu}>NavMenu</Button>
        <Button variant="outline" onClick = {createaccordion}>accordion</Button>
        <Button variant="outline" onClick = {createPicture}>Picture</Button>
        <Button variant="outline" onClick = {createButton}>Button</Button>
      </div>  

        {error && 
        <div>
          {/* {error} */}
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error Generating Site!</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
        }
      </>
    )

  }