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
    addLlmOutput: (message) => store.addLlmOutput(message),

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

function cleanGroqOutput(text) {
  // First, we check if the provided input is actually a string.
  // This prevents errors if another data type is passed by mistake.
  if (typeof text !== 'string') {
    console.error("Error: Input must be a string. Returning original input.");
    return text;
  }

  // We use the String.prototype.replace() method with a regular expression.
  // The regular expression /```/g looks for the "```" sequence.
  // The 'g' flag stands for "global," which ensures that *all* occurrences
  // are replaced, not just the first one.
  // We replace each occurrence with an empty string (''), effectively removing it.
  const cleanedText = text.replace(/```/g, '');

  // Return the newly cleaned string.
  return cleanedText;
}

  export default function Buttons(){
    const store = useStore(selector, shallow);
    const {logEdges, logStore} = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

      try {
        const response = await fetch('/api/groq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            designJson: layout,
            instructions,
          }),
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch from backend');
        }
      
        const data = await response.json();
        console.log('Groq API completion:', data.completion);
        setGeneratedCode(data.completion);

        const parsedgroq = cleanGroqOutput(data.completion);
        store.addLlmOutput({type: 'llm-response', language: 'javascript', message: parsedgroq});

        setShowModal(true);
      
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
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
        <div className="fixed top-0 left-0 z-50 flex items-center h-[64px] bg-transparent select-none" style={{minWidth: '200px'}}>
          <span className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow ml-4" style={{fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.12em'}}>
            Vi<span className="text-blue-500">b</span><span className="text-purple-500">e</span><span className="text-pink-500">Web</span>
          </span>
        </div>
        <div className="flex justify-center items-center gap-2 bg-gray-100 p-2 rounded-md shadow-md w-full pl-[220px]">
          {/* Buttons bar, shifted right to make space for fixed logo */}
          <Button 
            variant="outline" 
            onClick={GenerateHandler}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold border-blue-300 shadow transition-colors duration-150 px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isLoading ? '🪄 Generating...' : '🪄 Generate'}
          </Button>
          <Button variant="outline" onClick={createNavBar}>Nav</Button>
          <Button variant="outline" onClick={createNavMenu}>NavMenu</Button>
          <Button variant="outline" onClick={createaccordion}>accordion</Button>
          <Button variant="outline" onClick={createPicture}>Picture</Button>
          <Button variant="outline" onClick={createButton}>Button</Button>
        </div>

        {error && 
          <div>
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