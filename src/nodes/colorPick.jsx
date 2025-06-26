import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStore } from '../store';

/**
 * A simple, reusable color picker node for React Flow.
 * The label is now dynamic and set via the `data.label` property.
 */
export default function colorPick({ id, data }) {
    // Get the function to update node data from your Zustand store
    const updateNodeData = useStore((state) => state.updateNode);

    // Get the current color from the node's data, with a default fallback
    const currentColor = data.color || '#000000';

    // Get the display label from the node's data, with a default fallback
    const labelText = data.label || 'Color';

    /**
     * This function is called when the color picker value changes.
     * It calls the update function from the store to modify the node's data.
     */
    const onColorChange = useCallback((event) => {
        const newColor = event.target.value;
        // Update the node's data in the Zustand store with just the color
        if (id) {
            updateNodeData(id, { color: newColor });
        }
    }, [id, updateNodeData]);

    return (
        <>
            <div className="p-3 border border-gray-400 rounded-md bg-white shadow-sm">
                <div className="flex items-center space-x-2">
                    <label
                        htmlFor={`color-picker-${id}`}
                        className="text-gray-800 font-semibold"
                    >
                        {/* The label text is now dynamic */}
                        {labelText}
                    </label>
                    <input
                        id={`color-picker-${id}`}
                        type="color"
                        onChange={onColorChange}
                        value={currentColor}
                        // The 'nodrag' class prevents node dragging when interacting with the input
                        className="nodrag"
                    />
                </div>
            </div>
        </>
    );
}