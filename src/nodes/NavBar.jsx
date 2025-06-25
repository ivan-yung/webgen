import React, { useState, useEffect } from "react";
import { NodeToolbar, Position } from '@xyflow/react';
import { Button } from "../components/ui/button";
import { useStore } from '../store'; // Ensure this path is correct for your project

// Assuming NavBar receives 'id' and 'data' props from its parent (e.g., React Flow)
const NavBar = ({ selected, id, data }) => {
    const [showMenu, setShowMenu] = useState(false);
    // Get updateNode from the store
    const updateNode = useStore((state) => state.updateNode);

    // Initialize local state using the new field names from the 'data' prop
    // Provide default values if 'data' or specific properties are undefined
    const [settings, setSettings] = useState({
        Field1: data?.Field1 || "Home",    // Corresponds to homeText
        Field2: data?.Field2 || "Features", // Corresponds to featuresText
        Field3: data?.Field3 || "Pricing",  // Corresponds to pricingText
        Field4: data?.Field4 || "About",    // Corresponds to aboutText
        Logo: data?.Logo || "WebProducer",  // Corresponds to logoText
    });

    // Effect to synchronize local state with prop data if 'data' prop changes externally
    useEffect(() => {
        setSettings({
            Field1: data?.Field1 || "Home",
            Field2: data?.Field2 || "Features",
            Field3: data?.Field3 || "Pricing",
            Field4: data?.Field4 || "About",
            Logo: data?.Logo || "WebProducer",
        });
    }, [data]); // Re-run this effect whenever the 'data' prop changes

    const handleSettingChange = (e) => {
        const { name, value } = e.target;

        // 1. Update the local component state
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));

        // 2. Update the Zustand store for this specific node
        // 'id' is the node's ID, and '{ [name]: value }' is the partial data to update
        updateNode(id, { [name]: value });
    };

    const toggleMenuHandler = () => {
        setShowMenu(prevShowMenu => !prevShowMenu);
    };

    // Close menu when component is no longer selected
    useEffect(() => {
        if (!selected) {
            setShowMenu(false);
        }
    }, [selected]);

    return(
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
                    className="
                        flex items-center justify-center pl-2.5
                    "
                >
                    {/* Hide the Settings button when showMenu is true */}
                    {!showMenu && (
                        <Button variant="destructive" onClick={toggleMenuHandler}>Settings</Button>
                    )}
                </NodeToolbar>

                <div
                    className="
                        font-extrabold text-3xl text-white tracking-wide
                    "
                >
                    {settings.Logo} {/* Now uses settings.Logo */}
                </div>
                <ul
                    className="
                        flex gap-6 list-none m-0 p-0
                    "
                >
                    <li>
                        <a href="#"
                           className="
                                relative text-gray-100 no-underline font-medium text-base
                                px-3 py-2 rounded-lg transition-all duration-250
                                hover:bg-gray hover:bg-opacity-10 hover:scale-105
                                block
                           "
                        >
                            {settings.Field1} {/* Now uses settings.Field1 */}
                        </a>
                    </li>
                    <li>
                        <a href="#"
                           className="
                                relative text-gray-100 no-underline font-medium text-base
                                px-3 py-2 rounded-lg transition-all duration-250
                                hover:bg-gray hover:bg-opacity-10 hover:scale-105
                                block
                           "
                        >
                            {settings.Field2} {/* Now uses settings.Field2 */}
                        </a>
                    </li>
                    <li>
                        <a href="#"
                           className="
                                relative text-gray-100 no-underline font-medium text-base
                                px-3 py-2 rounded-lg transition-all duration-250
                                hover:bg-gray hover:bg-opacity-10 hover:scale-105
                                block
                           "
                        >
                            {settings.Field3} {/* Now uses settings.Field3 */}
                        </a>
                    </li>
                    <li>
                        <a href="#"
                           className="
                                relative text-gray-100 no-underline font-medium text-base
                                px-3 py-2 rounded-lg transition-all duration-250
                                hover:bg-gray hover:bg-opacity-10 hover:scale-105
                                block
                           "
                        >
                            {settings.Field4} {/* Now uses settings.Field4 */}
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Settings Panel - Only display when both selected AND showMenu are true */}
            {selected && showMenu && (
                <div
                    className="
                        absolute left-full top-0 ml-4
                        bg-gray-700 bg-opacity-95 p-8 rounded-2xl shadow-2xl
                        z-50 flex flex-col gap-4 w-[300px] text-gray-100
                    "
                    style={{ minHeight: '100%' }}
                >
                    <h3 className="m-0 mb-4 text-white text-center text-xl">Navbar Settings</h3>
                    <label className="flex flex-col gap-2">
                        Field 1 (Home):
                        <input
                            type="text"
                            name="Field1" // Changed name to Field1
                            value={settings.Field1}
                            onChange={handleSettingChange}
                            className="
                                p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                            "
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        Field 2 (Features):
                        <input
                            type="text"
                            name="Field2" // Changed name to Field2
                            value={settings.Field2}
                            onChange={handleSettingChange}
                            className="
                                p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                            "
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        Field 3 (Pricing):
                        <input
                            type="text"
                            name="Field3" // Changed name to Field3
                            value={settings.Field3}
                            onChange={handleSettingChange}
                            className="
                                p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                            "
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        Field 4 (About):
                        <input
                            type="text"
                            name="Field4" // Changed name to Field4
                            value={settings.Field4}
                            onChange={handleSettingChange}
                            className="
                                p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                            "
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        Logo Text:
                        <input
                            type="text"
                            name="Logo" // Changed name to Logo
                            value={settings.Logo}
                            onChange={handleSettingChange}
                            className="
                                p-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                            "
                        />
                    </label>
                    <Button onClick={toggleMenuHandler} className="mt-4">Close Settings</Button>
                </div>
            )}
        </div>
    );
};

export default NavBar;