import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { createWithEqualityFn } from 'zustand/traditional';
 
export const useStore = createWithEqualityFn((set, get) => ({
  nodes: [
    { type: 'osc',
      id: 'a',
      data: { frequency: 220, type: 'square' },
      position: { x: 0, y: 0 }
    },
  ],
  edges: [],
 
  // Creates a node based on parameters passed
  // @type: gate type (string input)
  // @position: start position (2d array input)
  // @data: starting data value
  createNode: (type, position, data = {}) => {
    const id = nanoid(6);
    const newNode = {
      id,
      type,
      position,
      data,
    };
    set({
      nodes: [...get().nodes, newNode],
    });
  },


  updateNode(id, data) {
    set({
      nodes: get().nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    });
  },

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
 
  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
 
  addEdge(data) {
    const id = nanoid(6);
    const edge = { id, ...data };
 
    set({ edges: [edge, ...get().edges] });
  },

    //debug funct
  logStore: () => {
    const store = get();
    console.log('Zustand Store:', store.nodes);
  },
}));