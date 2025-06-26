import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { createWithEqualityFn } from 'zustand/traditional';
 
export const useStore = createWithEqualityFn((set, get) => ({
  nodes: [
    {
      id: 'theme',
      type: 'colorPick',
      position: { x: 10, y: 0 },
      selected: false,
      data: {color: '#000000', label: 'Theme' },
    },
    {
      id: 'accent',
      type: 'colorPick',
      position: { x: 150, y: 0 },
      selected: false,
      data: {color: '#7a54c3', label: 'Accent' },
    },
    {
      id: 'Background-Canvas',
      type: 'group',
      data: { label: null },
      position: { x: 10, y: 100 },
      style: {
        width: 1000,
        height: 2000,
      },
      draggable: false,
    },
  ],
  edges: [],
 
  // Creates a node based on parameters passed
  // @type: object type (string input)
  // @position: start position (2d array input)
  // @data: starting data value
  createNode: (type, position, data = {}) => {
    const id = nanoid(6);
    const newNode = {
      id,
      type,
      position,
      parentId: 'Background-Canvas',
      extent: 'parent',
      data,
      selected: false,
    };
    set({
      nodes: [...get().nodes, newNode],
    });
  },

  // Creates an image object based on parameters passed
  // @type: object type (string input)
  // @position: start position (2d array input)
  createImage: (type, position, data = {}) => {
    const id = nanoid(6);
    const newNode = {
      id,
      type,
      position,
      parentId: 'Background-Canvas',
      extent: 'parent',
      data,
      height: 150,
      width: 300,
      selected: false,
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