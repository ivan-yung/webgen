import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useStore } from '../store'; // Adjust this path to your store file

export default function ButtonOutline({ selected, id, initialText = "Outline" }) {
  // Get the updateNode function from your Zustand store
  const updateNode = useStore((state) => state.updateNode);
  // Initialize buttonText with initialText from props or "Outline" if not provided
  const [buttonText, setButtonText] = useState(initialText);

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setButtonText(newText);
    // Update the node's data in the Zustand store
    if (id) { // Ensure id is present before updating
      updateNode(id, { label: newText }); // Assuming 'label' is the key for button text in your node data
    }
  };

  return (
    <div className="flex items-center">
      <Button variant="outline">{buttonText}</Button>
      <div
        className={`ml-4 bg-gray-700 bg-opacity-95 p-4 rounded-2xl shadow-2xl transition-opacity duration-300 ${
          selected ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <input
          type="text"
          placeholder="Enter text..."
          value={buttonText}
          onChange={handleInputChange}
          className="nodrag w-full p-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}