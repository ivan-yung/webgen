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

      // Dummy API call for testing
      // setTimeout(() => {
      //   const dummyCode = `// Example React code generated\n\nexport default function App() {\n  return (\n    <div className=\"min-h-screen bg-gray-50 flex flex-col items-center justify-center\">\n      <h1 className=\"text-3xl font-bold text-purple-700 mb-4\">WebProducer Demo</h1>\n      <button className=\"px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition\" onClick={() => alert('Button clicked!')}>Click Me</button>\n    </div>\n  );\n}`;
      //   setGeneratedCode(dummyCode);
      //   store.addLlmOutput({type: 'llm-response', language: 'javascript', message: dummyCode});
      //   setShowModal(true);
      //   setIsLoading(false);
      // }, 800);
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
      <div className="flex justify-center gap-2 bg-gray-100 p-2 rounded-md">
        <Button variant="outline" onClick={GenerateHandler}>
          {isLoading ? '🪄 Generating...' : '🪄 Generate'}
        </Button>
        <Button variant="outline" onClick={createNavBar}>Nav</Button>
        <Button variant="outline" onClick={createNavMenu}>NavMenu</Button>
        <Button variant="outline" onClick={createaccordion}>accordion</Button>
        <Button variant="outline" onClick={createPicture}>Picture</Button>
        <Button variant="outline" onClick={createButton}>Button</Button>
      </div>

      {/* Modal for CodeDisplay */}
      {/* {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(100,100,100,0.4)'}}>
          <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto relative border border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >&times;</button>
            <div className="overflow-auto max-h-[65vh]">
              <CodeDisplay code={generatedCode} />
            </div>
          </div>
        </div>
      )} */}

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