import { BlockDefinition, BlockCategory } from '../../models/Block';

class BlockRegistryClass {
  private definitions: Map<string, BlockDefinition> = new Map();
  private byCategory: Map<BlockCategory, BlockDefinition[]> = new Map();

  register(def: BlockDefinition) {
    this.definitions.set(def.id, def);
    const list = this.byCategory.get(def.category) || [];
    list.push(def);
    this.byCategory.set(def.category, list);
  }

  registerAll(defs: BlockDefinition[]) {
    defs.forEach((d) => this.register(d));
  }

  get(id: string): BlockDefinition | undefined {
    return this.definitions.get(id);
  }

  getByCategory(category: BlockCategory): BlockDefinition[] {
    return this.byCategory.get(category) || [];
  }

  getAll(): BlockDefinition[] {
    return Array.from(this.definitions.values());
  }

  getCategories(): BlockCategory[] {
    return Array.from(this.byCategory.keys());
  }

  search(query: string): BlockDefinition[] {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (d) => d.label.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.tooltip?.toLowerCase().includes(q)
    );
  }
}

export const BlockRegistry = new BlockRegistryClass();
