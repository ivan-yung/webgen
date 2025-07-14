import * as React from "react";
import { AspectRatio } from "radix-ui";
import { Handle, Position, NodeResizer, NodeToolbar } from '@xyflow/react';
import "../styles/RadixPictureStyles.css";
import { Button } from "../components/ui/button";
import { useStore } from '../store';
import { Checkbox } from "../components/ui/checkbox";

const RadixPicture = ({ id, width, height, selected, data, zIndex }) => { // <-- zIndex is passed as a prop by React Flow
  // Get updateNode from the store
  const updateNode = useStore((state) => state.updateNode);

  // Ref for the hidden file input
  const fileInputRef = React.useRef(null);

  // State to control link input visibility and value
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkValue, setLinkValue] = React.useState("");

  // State for info modal
  const [showInfoModal, setShowInfoModal] = React.useState(false);

  // Function to handle file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageSrc = e.target.result;
        updateNode(id, { src: newImageSrc }); // Only update Zustand store
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to trigger the hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Function to handle checkbox change
  const handleHeroChange = (checked) => {
    updateNode(id, { Hero: checked }); // Only update Zustand store
  };

  // Function to handle link form submit
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (linkValue) {
      updateNode(id, { src: linkValue });
      setShowLinkInput(false);
      setLinkValue("");
    }
  };

  // Use data.src and data.Hero directly for rendering
  const imageSrc = data.src || "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80";
  const isHero = data.Hero || false;

  return (
    // The zIndex is now controlled by the node's top-level zIndex property
    <div className="Container" style={{ width: width, height: height }}>
      <NodeToolbar
        isVisible={selected}
        position={Position.Right}
      >
        <div className="Toolbar">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {/* Button to trigger the file input or show link input */}
          {!showLinkInput && (
            <Button variant="destructive" onClick={() => setShowLinkInput(true)}>
              Upload
            </Button>
          )}
          {showLinkInput && (
            <Button variant="secondary" onClick={() => setShowLinkInput(false)} style={{ marginBottom: '6px' }}>
              Close
            </Button>
          )}
          {/* More Information Button */}
          <Button size="sm" variant="outline" style={{ marginTop: '8px', marginBottom: '4px', fontSize: '0.8rem', padding: '2px 8px' }} onClick={() => setShowInfoModal(true)}>
            ?
          </Button>
          {/* Show link input form if triggered */}
          {showLinkInput && (
            <form onSubmit={handleLinkSubmit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                type="text"
                placeholder="Paste Link"
                value={linkValue}
                onChange={e => setLinkValue(e.target.value)}
                style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <Button type="submit" variant="secondary">Submit</Button>
            </form>
          )}
          {/* Hero Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Checkbox
              id={`hero-checkbox-${id}`}
              checked={isHero}
              onCheckedChange={handleHeroChange}
            />
            <label
              htmlFor={`hero-checkbox-${id}`}
              style={{ marginLeft: '8px', cursor: 'pointer' }}
            >
              Hero
            </label>
          </div>
        </div>
      </NodeToolbar>
      {/* Info Modal */}
      {showInfoModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.12)',
          zIndex: 9999, // Keep this high to appear over the entire UI
          padding: '2rem',
          minWidth: '320px',
          maxWidth: '90vw',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem', color: '#222' }}>How to Submit a Photo</h2>
          <ol style={{ color: '#333', fontSize: '1rem', marginBottom: '1.5rem', paddingLeft: '1.2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>1. Find Your Photo in Google Images.</li>
            <li style={{ marginBottom: '0.5rem' }}>2. Right Click the Photo and Click <b>"Open Image in New Tab"</b>.</li>
            <li>3. Copy and Paste the Image Link Into the Input Field.</li>
          </ol>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)} style={{ marginTop: '0.5rem' }}>Close</Button>
        </div>
      )}
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <AspectRatio.Root ratio={16 / 9} style={{ width: '100%', height: '100%' }}>
        <img
          className="Image"
          src={imageSrc}
          alt="User uploaded image"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatio.Root>
    </div>
  );
};

export default RadixPicture;