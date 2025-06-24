import * as React from "react";
import { AspectRatio } from "radix-ui";
import { Handle, Position, NodeResizer, NodeToolbar } from '@xyflow/react';
import "../styles/RadixPictureStyles.css";
import { Button } from "../components/ui/button";

// Assuming RadixPicture receives 'width' and 'height' as props from @xyflow/react
// when it's rendered as a custom node type.
const RadixPicture = ({ width, height, selected, data }) => {
  return (
    <div className="Container" style={{ width: width, height: height }}>

      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition}>
        <div>
          <Button variant="outline">Outline</Button>
        </div>
      </NodeToolbar>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <AspectRatio.Root ratio={16 / 9} style={{ width: '100%', height: '100%' }}>
        <img
          className="Image"
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape photograph by Tobias Tullius"
          // The image will fill the AspectRatio.Root, which is constrained by the parent Container's width and height.
          // You might need 'object-fit: cover' or 'contain' in your CSS for the .Image class
          // depending on how you want the image to behave within the aspect ratio container.
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatio.Root>
    </div>
  );
};

export default RadixPicture;