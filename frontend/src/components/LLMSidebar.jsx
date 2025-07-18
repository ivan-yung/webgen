import React, { useRef, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';

const selector = (store) => ({
  codeChunks: store.codeChunks,
  clear: store.clearCodeChunks,
  addCodeChunk: store.addCodeChunk,
  tokenize: store.tokenize,
});

const ClearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5C13 3.77614 12.7761 4 12.5 4H2.5C2.22386 4 2 3.77614 2 3.5ZM3 5.5C3 5.08954 3.38624 4.71429 3.83333 4.71429H11.1667C11.6138 4.71429 12 5.08954 12 5.5V12.5C12 13.3284 11.3284 14 10.5 14H4.5C3.67157 14 3 13.3284 3 12.5V5.5ZM4.71429 5.5V12.5C4.71429 12.6074 4.72381 12.705 4.75 12.7857H10.25C10.2762 12.705 10.2857 12.6074 10.2857 12.5V5.5H4.71429Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
);

export default function LLMSidebar({ width, setWidth }) {
  const { codeChunks, clear, addCodeChunk, tokenize } = useStore(selector, shallow);
  const scrollRef = useRef(null);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [codeChunks]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // NEW: Define the explicit instructions for the LLM.
    const PROMPT_INSTRUCTIONS = `
--- IMPORTANT OUTPUT INSTRUCTIONS ---

CRITICAL: Do not use any non-compilable markers to indicate your changes. This includes diff markers like '+' or '-' and markdown fences like \`\`\`. These are not valid code and will crash the application with a SyntaxError.

If you absolutely must mark a change for clarity, you MUST use a standard code comment, for example: // FIXED: Corrected the logic here.
--- END INSTRUCTIONS ---
`;

    const historyString = codeChunks
      .map(chunk => chunk.text || chunk.code)
      .join('\n\n');

    // CHANGED: Insert the instructions between the history and the new user input.
    const promptWithHistory = `${historyString}\n\n${PROMPT_INSTRUCTIONS}\n\nUser: ${userInput}`;

    addCodeChunk({ userMessage: { text: `User: ${userInput}` } });
    
    setIsSending(true);
    setUserInput('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: promptWithHistory }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const tokenized = tokenize(`LLM: ${data.completion}`);
      addCodeChunk(tokenized);

    } catch (err) {
      console.error(err);
      addCodeChunk({ error: { text: 'Error: Failed to get LLM response.' } });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {!isMobile && !sidebarVisible && (
        <button
          className="fixed right-2 z-[10000] px-3 py-1 text-xs bg-blue-500 text-white rounded shadow-md"
          style={{ transform: 'translateY(-50%)' }}
          onClick={() => setSidebarVisible(true)}
        >
          Vibe with Chat!
        </button>
      )}
      {!isMobile && sidebarVisible && (
        <div
          style={{ width: width, minWidth: 250, maxWidth: 1000, height: '100%', background: '#f9f9f9', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #d1d5db' }}
          className="h-full bg-gray-50 flex flex-col border-l border-gray-300"
        >
          <div className="p-2 border-b border-gray-300 flex items-center justify-between bg-gray-100 flex-shrink-0">
            <h2 className="font-semibold text-sm text-gray-700">LLM Console</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarVisible(v => !v)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded shadow-md"
                title={sidebarVisible ? 'Hide LLM Sidebar' : 'Show LLM Sidebar'}
              >
                {sidebarVisible ? 'Hide' : 'Show'}
              </button>
              <button 
                onClick={clear}
                title="Clear console" 
                className="text-gray-600 hover:text-black"
              >
                <ClearIcon />
              </button>
            </div>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto">
            {codeChunks.length > 0 ? (
              codeChunks.map((chunk, idx) => (
                <div key={idx} className="font-mono text-sm p-2 border-b border-gray-200 text-gray-700 whitespace-pre-wrap break-words">
                  {chunk.text ? (
                    <span>{chunk.text}</span>
                  ) : (
                    <pre className="bg-gray-200 p-2 rounded overflow-x-auto">
                      <code>{chunk.code}</code>
                    </pre>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">
                No output yet.
              </div>
            )}
          </div>

          <div className="p-1 border-t border-g-300 flex-shrink-0">
            <form
              className="flex gap-2 p-2 border-t border-gray-300 bg-gray-50"
              onSubmit={handleFormSubmit}
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
        </div>
      )}
    </>
  );
}