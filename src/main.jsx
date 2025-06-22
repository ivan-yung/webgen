import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';
 

import '@xyflow/react/dist/style.css';
import './styles/index.css';
 
const root = document.querySelector('#root');
 
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {/* React flow needs to be inside an element with a known height and width to work */}
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </div>
  </React.StrictMode>,
);