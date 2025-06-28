import React, { useState } from 'react';

// You can find these simple SVG icons online or use a library like react-icons
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 1.5C4 1.22386 4.22386 1 4.5 1H11.5C11.7761 1 12 1.22386 12 1.5V2.5H13V1.5C13 0.671573 12.3284 0 11.5 0H4.5C3.67157 0 3 0.671573 3 1.5V11.5C3 12.3284 3.67157 13 4.5 13H5.5V12H4.5C4.22386 12 4 11.7761 4 11.5V1.5Z" />
    <path d="M6.5 4C5.67157 4 5 4.67157 5 5.5V13.5C5 14.3284 5.67157 15 6.5 15H13.5C14.3284 15 15 14.3284 15 13.5V5.5C15 4.67157 14.3284 4 13.5 4H6.5ZM6 5.5C6 5.22386 6.22386 5 6.5 5H13.5C13.7761 5 14 5.22386 14 5.5V13.5C14 13.7761 13.7761 14 13.5 14H6.5C6.22386 14 6 13.7761 6 13.5V5.5Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.7803 3.21967C14.0732 3.51256 14.0732 3.98744 13.7803 4.28033L6.78033 11.2803C6.48744 11.5732 6.01256 11.5732 5.71967 11.2803L2.21967 7.78033C1.92678 7.48744 1.92678 7.01256 2.21967 6.71967C2.51256 6.42678 2.98744 6.42678 3.28033 6.71967L6.25 9.68934L12.7197 3.21967C13.0126 2.92678 13.4874 2.92678 13.7803 3.21967Z" />
  </svg>
);


export default function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        // Reset the button state after a short delay
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error('Failed to copy code:', err);
        alert('Failed to copy code. Try again.');
      });
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 hover:text-white transition"
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}