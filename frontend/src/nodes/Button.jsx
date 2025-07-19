import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { useStore } from '../store'; // Adjust this path to your store file

/**
 * Custom Hook: useOnClickOutside
 * -----------------------------
 * A reusable hook to detect clicks outside of a specified DOM element.
 * @param {React.RefObject} ref - A ref to the element to monitor.
 * @param {Function} handler - The function to call when a click outside occurs.
 */
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if the click is inside the ref's element or its descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Re-run effect if ref or handler changes
}

/**
 * Component: Popover
 * ------------------
 * A pop-up form for editing the node's label. It's rendered in a portal
 * to avoid z-index and clipping issues within React Flow.
 */
function Popover({ nodeRef, initialText, id, onClose }) {
  const updateNode = useStore((state) => state.updateNode);
  const [buttonText, setButtonText] = useState(initialText);
  const popoverRef = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Close the popover if a click is detected outside of it
  useOnClickOutside(popoverRef, onClose);

  // Calculate the popover's position next to the node
  useEffect(() => {
    if (nodeRef.current) {
      const nodeRect = nodeRef.current.getBoundingClientRect();
      const popoverWidth = 240; // The width of the popover (w-60)
      const gap = 16; // The space between the node and the popover

      // Default position is to the right of the node
      let left = nodeRect.right + gap;

      // If there's not enough space on the right, flip to the left
      if (left + popoverWidth > window.innerWidth) {
        left = nodeRect.left - popoverWidth - gap;
      }

      setPosition({
        top: nodeRect.top,
        left: left
      });
    }
  }, [nodeRef]);

  // Handle input changes and update the central store
  const handleInputChange = (event) => {
    const newText = event.target.value;
    setButtonText(newText);
    if (id) {
      updateNode(id, { label: newText });
    }
  };

  // Render the popover in a portal attached to the document body
  return createPortal(
    <div
      ref={popoverRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="absolute z-50 w-60 p-4 bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-xl shadow-2xl transition-all duration-300 ease-in-out"
    >
      <label htmlFor={`text-input-${id}`} className="block mb-2 text-sm font-medium text-gray-300">
        Edit Label
      </label>
      <input
        id={`text-input-${id}`} // Use unique ID for accessibility
        type="text"
        placeholder="Enter text..."
        value={buttonText}
        onChange={handleInputChange}
        className="nodrag w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        autoFocus // Automatically focus the input when the popover opens
      />
    </div>,
    document.body
  );
}

/**
 * Component: ButtonOutline
 * ------------------------
 * The main React Flow custom node component. It displays a button and
 * shows an editable Popover when the node is selected.
 */
export default function ButtonOutline({ selected, id }) {
  const nodeRef = useRef();

  // **THE FIX**: Subscribe directly to the store to get the live label.
  // The 'useStore' hook will re-render this component whenever this specific value changes.
  const label = useStore((state) => {
    const node = state.nodes.find((n) => n.id === id);
    return node ? node.data.label : 'Outline'; // Fallback text
  });

  return (
    <div ref={nodeRef} className="flex items-center">
      {/* This button's text is now reactive to store changes */}
      <Button variant="outline">{label}</Button>
      
      {/* When the node is selected, render the Popover */}
      {selected && (
        <Popover
          nodeRef={nodeRef}
          initialText={label} // Pass the current label to the popover
          id={id}
          onClose={() => {
            // This function is called when clicking outside the popover.
            // You could optionally add logic here to deselect the node.
          }}
        />
      )}
    </div>
  );
}