import * as React from "react";
import { AspectRatio } from "radix-ui";
import { Handle, Position, NodeResizer, NodeToolbar } from '@xyflow/react';
import "../styles/RadixPictureStyles.css";
import { Button } from "../components/ui/button";
import { useStore } from '../store'; // Import your Zustand store

const RadixPicture = ({ id, width, height, selected, data }) => { // Add 'id' to props
  // Get updateNode from the store
  const updateNode = useStore((state) => state.updateNode);

  // Initialize imageSrc from data.imageSrc or default if not present
  const [imageSrc, setImageSrc] = React.useState(
    data.imageSrc || "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
  );

  // Ref for the hidden file input
  const fileInputRef = React.useRef(null);

  // Function to handle file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageSrc = e.target.result;
        setImageSrc(newImageSrc); // Update local state
        updateNode(id, { src: newImageSrc }); // Update Zustand store
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // Function to trigger the hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="Container" style={{ width: width, height: height }}>
      <NodeToolbar
        isVisible={selected}
        position={Position.Right}
      >
        <div className="Toolbar">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*" // Accept only image files
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }} // Hide the input
          />
          {/* Button to trigger the file input */}
          <Button variant="destructive" onClick={triggerFileInput}>
            Upload
          </Button>
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
          src={imageSrc} // Use the state variable for the image source
          alt="User uploaded image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatio.Root>
    </div>
  );
};

export default RadixPicture;