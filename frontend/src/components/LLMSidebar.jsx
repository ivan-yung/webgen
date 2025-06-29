import React, { useRef, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ResizableBox } from 'react-resizable';

import '../styles/index.css';

const selector = (store) => ({
  output: store.llmOutput,
  clear: store.clearLlmOutput,
  addMessage: store.addLlmOutput,
});

const ClearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5C13 3.77614 12.7761 4 12.5 4H2.5C2.22386 4 2 3.77614 2 3.5ZM3 5.5C3 5.08954 3.38624 4.71429 3.83333 4.71429H11.1667C11.6138 4.71429 12 5.08954 12 5.5V12.5C12 13.3284 11.3284 14 10.5 14H4.5C3.67157 14 3 13.3284 3 12.5V5.5ZM4.71429 5.5V12.5C4.71429 12.6074 4.72381 12.705 4.75 12.7857H10.25C10.2762 12.705 10.2857 12.6074 10.2857 12.5V5.5H4.71429Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
);


export default function LLMSidebar({ width, setWidth }) {
  const { output, clear, addMessage } = useStore(selector, shallow);
  const scrollRef = useRef(null);
  const [lastCopiedIndex, setLastCopiedIndex] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const copyHandler = (codeToCopy, index) => {
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          setLastCopiedIndex(index);
          setTimeout(() => setLastCopiedIndex(null), 2000);
        })
        .catch((err) => {
          console.error('Failed to copy code:', err);
          alert('Failed to copy code. Try again.');
        });
    }
  };

  const sendResponse = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    addMessage({ type: 'user', message: userInput });
    setIsSending(true);
    try {
      // Send to backend
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: userInput }),
      });
      const data = await response.json();
      addMessage({
        type: 'llm-response',
        language: 'javascript',
        message: data.completion,
      });
    } catch (err) {
      addMessage({ type: 'error', message: 'Failed to get LLM response.' });
    }
    setIsSending(false);
    setUserInput('');
  };


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);
  
  // The renderMessage function is now simple again. It ONLY renders a SINGLE message.
  const renderMessage = (entry, index) => {
    if (entry.language) {
      const isCopied = lastCopiedIndex === index;
      return (
        <div
          key={index}
          className="relative font-mono text-sm border-b border-gray-200 cursor-pointer"
          onClick={() => copyHandler(entry.message, index)}
        >
          {isCopied && (
            <div className="absolute top-2 right-2 text-xs text-green-600 bg-white/80 px-2 py-1 rounded-md z-10">
              Copied!
            </div>
          )}
          <SyntaxHighlighter
            language={entry.language}
            style={oneLight}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              padding: '10px',
              border: isCopied ? '1px solid #16a34a' : '1px solid transparent',
              transition: 'border 0.2s ease-in-out',
            }}
          >
            {entry.message}
          </SyntaxHighlighter>
        </div>
      );
    }
    
    let style = 'text-gray-700';
    let prefix = '>';
    switch (entry.type) {
      case 'llm-response':
        style = 'text-blue-600';
        prefix = '🤖';
        break;
      case 'error':
        style = 'text-red-500';
        prefix = '❌';
        break;
      case 'system':
        style = 'text-purple-600 italic';
        prefix = '⚙️';
        break;
    }

    return (
      <div key={index} className={`font-mono text-sm p-1.5 border-b border-gray-200 flex items-start ${style}`}>
        <span className="mr-2">{prefix}</span>
        <pre className="whitespace-pre-wrap break-words">{entry.message}</pre>
      </div>
    );
  };

  // The ResizableBox now correctly wraps the entire sidebar content in the main return statement.
  return (
    <ResizableBox
        width={width}
        height={Infinity}
        onResize={(e, data) => setWidth(data.size.width)}
        axis="x"
        resizeHandles={['w']}
        minConstraints={[250, Infinity]}
        maxConstraints={[1000, Infinity]}
        className="h-full bg-gray-50 flex flex-col border-l border-gray-300"
    >
        <div className="p-2 border-b border-gray-300 flex items-center justify-between bg-gray-100 flex-shrink-0">
          <h2 className="font-semibold text-sm text-gray-700">LLM Console</h2>
          <button 
            onClick={clear}
            title="Clear console" 
            className="text-gray-600 hover:text-black"
          >
            <ClearIcon />
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto">
          {output.length > 0 ? output.map(renderMessage) : (
               <div className="p-4 text-center text-sm text-gray-400">No output yet.</div>
          )}
        </div>
        
        <div className="p-1 border-t border-gray-300 flex-shrink-0">
          <form
            className="flex gap-2 p-2 border-t border-gray-300 bg-gray-50"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!userInput.trim()) return;
              addMessage({ type: 'user', message: userInput });
              setIsSending(true);
              try {
                // Send to backend
                const response = await fetch('/api/groq', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ instructions: userInput }),
                });
                const data = await response.json();
                addMessage({
                  type: 'llm-response',
                  language: 'javascript',
                  message: data.completion,
                });
              } catch (err) {
                addMessage({ type: 'error', message: 'Failed to get LLM response.' });
              }
              setIsSending(false);
              setUserInput('');
            }}
          >
            <input
              className="flex-1 p-1 text-sm border rounded"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
            />
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={isSending || !userInput.trim()}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
    </ResizableBox>
  );
}