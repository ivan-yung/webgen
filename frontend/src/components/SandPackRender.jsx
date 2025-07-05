import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react"


const RenderCode = ({ code }) => {

  console.log("Sandboxing type:", code);

  return (
      <>
      <Sandpack
      files={code} 
      template="react"
      />
        
      </>
  );
};

export default RenderCode;