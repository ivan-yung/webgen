import React, { useState, useEffect } from "react";
import { shallow } from 'zustand/shallow';


// Component to display the generated code
const CodeDisplay = ({ code }) => {
    const [copy, setCopy] = useState(false);
    const handleCopy = () => {
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                // Optionally show a toast or feedback
            }).catch((err) => {
                console.error('Failed to copy code:', err);
                alert('Failed to copy code. Try again.');
            });
        } else {
            alert('No code to copy!');
        }
        setCopy(true);
    };

    if (!code) {
        return null;
    }

    return (
        <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-2xl mx-auto my-4">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded-t-lg">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <div>
                    <button
                        onClick={handleCopy}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors mr-2">
                        {copy ? '✓' : '📋'}
                    </button>
                </div>
            </div>
            <pre className="p-4 overflow-auto text-sm max-h-[60vh]">
                <code className="language-javascript whitespace-pre-wrap">{code}</code>
            </pre>
        </div>
    );
};

export default CodeDisplay;