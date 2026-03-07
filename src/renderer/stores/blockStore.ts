import { create } from 'zustand';
import { BlockInstance, BlockInput, createBlockInstance, BlockDefinition } from '../models/Block';
import { useProjectStore } from './projectStore';

interface BlockState {
  blocks: Record<string, BlockInstance>;

  addBlock: (instance: BlockInstance) => void;
  removeBlock: (blockId: string) => void;
  updateBlockInput: (blockId: string, inputName: string, value: BlockInput) => void;
  connectBlocks: (topBlockId: string, bottomBlockId: string) => void;
  disconnectBlock: (blockId: string) => void;
  setBranchBlock: (parentId: string, branchIndex: number, childId: string | null) => void;
  moveBlock: (blockId: string, x: number, y: number) => void;
  getBlock: (blockId: string) => BlockInstance | undefined;
  getAllBlocks: () => BlockInstance[];
  getTopLevelBlocks: () => BlockInstance[];
  clearBlocks: () => void;
  loadBlocks: (blocks: Record<string, BlockInstance>) => void;
}

export const useBlockStore = create<BlockState>((set, get) => ({
  blocks: {},

  addBlock: (instance) => {
    set((state) => ({
      blocks: { ...state.blocks, [instance.id]: instance },
    }));
    useProjectStore.getState().markDirty();
  },

  removeBlock: (blockId) => {
    set((state) => {
      const newBlocks = { ...state.blocks };
      const block = newBlocks[blockId];
      if (!block) return state;

      // Disconnect from parent
      for (const b of Object.values(newBlocks)) {
        if (b.nextBlock === blockId) {
          newBlocks[b.id] = { ...b, nextBlock: null };
        }
        const branchIdx = b.branchBlocks.indexOf(blockId);
        if (branchIdx !== -1) {
          const newBranches = [...b.branchBlocks];
          newBranches[branchIdx] = null;
          newBlocks[b.id] = { ...b, branchBlocks: newBranches };
        }
      }

      delete newBlocks[blockId];
      return { blocks: newBlocks };
    });
    useProjectStore.getState().markDirty();
  },

  updateBlockInput: (blockId, inputName, value) => {
    set((state) => {
      const block = state.blocks[blockId];
      if (!block) return state;
      return {
        blocks: {
          ...state.blocks,
          [blockId]: {
            ...block,
            inputValues: { ...block.inputValues, [inputName]: value },
          },
        },
      };
    });
    useProjectStore.getState().markDirty();
  },

  connectBlocks: (topBlockId, bottomBlockId) => {
    set((state) => {
      const topBlock = state.blocks[topBlockId];
      if (!topBlock) return state;

      // Disconnect bottom block from any existing parent
      const newBlocks = { ...state.blocks };
      for (const b of Object.values(newBlocks)) {
        if (b.nextBlock === bottomBlockId) {
          newBlocks[b.id] = { ...b, nextBlock: null };
        }
      }

      // If top already has a next, attach it to the end of bottom's chain
      if (topBlock.nextBlock) {
        let lastInChain = bottomBlockId;
        let current = newBlocks[bottomBlockId];
        while (current?.nextBlock) {
          lastInChain = current.nextBlock;
          current = newBlocks[current.nextBlock];
        }
        if (current) {
          newBlocks[lastInChain] = { ...newBlocks[lastInChain], nextBlock: topBlock.nextBlock };
        }
      }

      newBlocks[topBlockId] = { ...topBlock, nextBlock: bottomBlockId };

      // Remove position from bottom block (it's no longer top-level)
      const bottom = newBlocks[bottomBlockId];
      if (bottom?.position) {
        const { position, ...rest } = bottom;
        newBlocks[bottomBlockId] = { ...rest, position: undefined } as BlockInstance;
      }

      return { blocks: newBlocks };
    });
    useProjectStore.getState().markDirty();
  },

  disconnectBlock: (blockId) => {
    set((state) => {
      const newBlocks = { ...state.blocks };

      for (const b of Object.values(newBlocks)) {
        if (b.nextBlock === blockId) {
          newBlocks[b.id] = { ...b, nextBlock: null };
        }
        const branchIdx = b.branchBlocks.indexOf(blockId);
        if (branchIdx !== -1) {
          const newBranches = [...b.branchBlocks];
          newBranches[branchIdx] = null;
          newBlocks[b.id] = { ...b, branchBlocks: newBranches };
        }
      }

      return { blocks: newBlocks };
    });
    useProjectStore.getState().markDirty();
  },

  setBranchBlock: (parentId, branchIndex, childId) => {
    set((state) => {
      const parent = state.blocks[parentId];
      if (!parent) return state;
      const newBranches = [...parent.branchBlocks];
      newBranches[branchIndex] = childId;
      return {
        blocks: {
          ...state.blocks,
          [parentId]: { ...parent, branchBlocks: newBranches },
        },
      };
    });
    useProjectStore.getState().markDirty();
  },

  moveBlock: (blockId, x, y) => {
    set((state) => {
      const block = state.blocks[blockId];
      if (!block) return state;
      return {
        blocks: {
          ...state.blocks,
          [blockId]: { ...block, position: { x, y } },
        },
      };
    });
  },

  getBlock: (blockId) => get().blocks[blockId],
  getAllBlocks: () => Object.values(get().blocks),
  getTopLevelBlocks: () => {
    const blocks = get().blocks;
    const childIds = new Set<string>();
    for (const b of Object.values(blocks)) {
      if (b.nextBlock) childIds.add(b.nextBlock);
      for (const br of b.branchBlocks) {
        if (br) childIds.add(br);
      }
      for (const input of Object.values(b.inputValues)) {
        if (input.kind === 'block') childIds.add(input.blockId);
      }
    }
    return Object.values(blocks).filter(b => !childIds.has(b.id));
  },

  clearBlocks: () => set({ blocks: {} }),
  loadBlocks: (blocks) => set({ blocks }),
}));
