import React, { useState, useEffect, useMemo } from "react";
import { NodeToolbar, Position } from '@xyflow/react';
import { Button } from "../components/ui/button";
import { useStore } from '../store'; // Ensure this path is correct

/**
 * Optimized NavBar component for React Flow.
 *
 * Key Optimizations:
 * 1.  **Single Source of Truth**: Removed the local `settings` state. The component now
 * derives all its display and form data directly from the `data` prop, which
 * reflects the Zustand store state.
 * 2.  **Memoization**: Wrapped the entire JSX output in `React.useMemo`. This ensures
 * the component only re-renders when its specific data (`data` fields), selection
 * state (`selected`), or menu visibility (`showMenu`) changes.
 * 3.  **Direct Updates**: The form inputs now call the `updateNode` function from the
 * store directly on every change, eliminating intermediate state management.
 * 4.  **Efficient Rendering**: The settings panel and its form inputs are not mounted
 * to the DOM unless the menu is explicitly opened, preventing any processing
 * or state handling for hidden elements.
 */
const NavBar = ({ selected, id, data }) => {
    // Local state is now only used for UI concerns, like menu visibility.
    const [showMenu, setShowMenu] = useState(false);

    // Get the update function from the store.
    const updateNode = useStore((state) => state.updateNode);

    // --- STATE MANAGEMENT REFACTORED ---
    // The redundant `settings` useState and the useEffect syncing it are removed.

    const handleSettingChange = (e) => {
        const { name, value } = e.target;
        // Directly update the central store. This keeps data flow unidirectional.
        updateNode(id, { [name]: value });
    };

    const toggleMenuHandler = () => {
        setShowMenu(prevShowMenu => !prevShowMenu);
    };

    // Effect to close the menu when the node is deselected remains unchanged.
    useEffect(() => {
        if (!selected) {
            setShowMenu(false);
        }
    }, [selected]);
    
    // Derive display values directly from props within the render scope.
    // The nullish coalescing operator (??) provides clean default fallbacks.
    const { Field1, Field2, Field3, Field4, Logo } = {
        Field1: data?.Field1 ?? "Home",
        Field2: data?.Field2 ?? "Features",
        Field3: data?.Field3 ?? "Pricing",
        Field4: data?.Field4 ?? "About",
        Logo: data?.Logo ?? "WebProducer",
    };

    // --- PERFORMANCE OPTIMIZATION ---
    // `useMemo` prevents this component from re-rendering if parent props change
    // in a way that doesn't affect this node's content or state.
    return useMemo(() => (
        <div className="relative flex items-start">
            <nav
                className="
                    w-[1000px] h-[60%] backdrop-blur-md bg-gray-800 bg-opacity-70
                    px-8 py-4 rounded-2xl flex items-center justify-between
                    shadow-xl font-sans transition-all duration-300
                "
            >
                <NodeToolbar
                    isVisible={selected}
                    position={Position.Right}
                    className="flex items-center justify-center pl-2.5"
                >
                    {!showMenu && (
                        <Button variant="destructive" onClick={toggleMenuHandler}>Settings</Button>
                    )}
                </NodeToolbar>

                <div className="font-extrabold text-3xl text-white tracking-wide">
                    {/* Display value is derived from the constant declared above */}
                    {Logo}
                </div>
                <ul className="flex gap-6 list-none m-0 p-0">
                    <li><a href="#" className="relative text-gray-100 no-underline font-medium text-base px-3 py-2 rounded-lg transition-all duration-250 hover:bg-gray hover:bg-opacity-10 hover:scale-105 block">{Field1}</a></li>
                    <li><a href="#" className="relative text-gray-100 no-underline font-medium text-base px-3 py-2 rounded-lg transition-all duration-250 hover:bg-gray hover:bg-opacity-10 hover:scale-105 block">{Field2}</a></li>
                    <li><a href="#" className="relative text-gray-100 no-underline font-medium text-base px-3 py-2 rounded-lg transition-all duration-250 hover:bg-gray hover:bg-opacity-10 hover:scale-105 block">{Field3}</a></li>
                    <li><a href="#" className="relative text-gray-100 no-underline font-medium text-base px-3 py-2 rounded-lg transition-all duration-250 hover:bg-gray hover:bg-opacity-10 hover:scale-105 block">{Field4}</a></li>
                </ul>
            </nav>

            {/* The settings form is not rendered at all if it's not open. */}
            {selected && showMenu && (
                <div
                    className="
                        absolute left-full top-0 ml-4 bg-gray-700 bg-opacity-95
                        p-8 rounded-2xl shadow-2xl z-50 flex flex-col gap-4
                        w-[300px] text-gray-100
                    "
                    style={{ minHeight: '100%' }}
                >
                    <h3 className="m-0 mb-4 text-white text-center text-xl">Navbar Settings</h3>
                    {/* Each input reads its value directly from the derived constants */}
                    <label className="flex flex-col gap-2">
                        Field 1 (Home):
                        <input type="text" name="Field1" value={Field1} onChange={handleSettingChange} className="nodrag p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </label>
                    <label className="flex flex-col gap-2">
                        Field 2 (Features):
                        <input type="text" name="Field2" value={Field2} onChange={handleSettingChange} className="nodrag p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </label>
                    <label className="flex flex-col gap-2">
                        Field 3 (Pricing):
                        <input type="text" name="Field3" value={Field3} onChange={handleSettingChange} className="p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </label>
                    <label className="flex flex-col gap-2">
                        Field 4 (About):
                        <input type="text" name="Field4" value={Field4} onChange={handleSettingChange} className="p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </label>
                    <label className="flex flex-col gap-2">
                        Logo Text:
                        <input type="text" name="Logo" value={Logo} onChange={handleSettingChange} className="nodrag p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </label>
                    <Button onClick={toggleMenuHandler} className="mt-4">Close Settings</Button>
                </div>
            )}
        </div>
    // The dependency array ensures regeneration only happens when necessary.
    // It includes all props and state that the component's output depends on.
    ), [selected, showMenu, Field1, Field2, Field3, Field4, Logo, id, updateNode]);
};

export default NavBar;