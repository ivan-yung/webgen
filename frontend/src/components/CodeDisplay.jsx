import React, { useState, useEffect } from "react";
import { shallow } from 'zustand/shallow';

// Component to display the generated code
const CodeDisplay = ({ code, onClear }) => {
    if (!code) {
        return null;
    }

    const handleCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            // Use execCommand as a fallback for iframe environments
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textarea);
    };

    return (
        <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-2xl mx-auto my-4">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded-t-lg">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <div>
                    <button
                        onClick={handleCopy}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors mr-2">
                        Copy
                    </button>
                    <button
                        onClick={onClear}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors">
                        Clear
                    </button>
                </div>
            </div>
            <pre className="p-4 overflow-auto text-sm">
                <code className="language-javascript">{code}</code>
            </pre>
        </div>
    );
};

export default CodeDisplay;