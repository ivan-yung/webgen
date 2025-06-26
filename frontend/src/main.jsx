import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
import { Theme } from "@radix-ui/themes";

import '@xyflow/react/dist/style.css';
import './styles/index.css';
 
const root = document.querySelector('#root');
 
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Theme>
    {/* React flow needs to be inside an element with a known height and width to work */}
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </div>

    </Theme>
  </React.StrictMode>,
);