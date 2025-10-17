/**
 * In-memory storage for development/demo mode
 * Replace with Cosmos DB in production
 */

interface StorageItem {
  id: string;
  partitionKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

class MemoryStorage {
  private stores: Map<string, Map<string, StorageItem>> = new Map();

  constructor() {
    // Initialize default containers
    this.createContainer('games');
    this.createContainer('players');
    this.createContainer('events');
    this.createContainer('leaderboards');
  }

  private createContainer(name: string): void {
    if (!this.stores.has(name)) {
      this.stores.set(name, new Map());
    }
  }

  async create(container: string, item: StorageItem): Promise<StorageItem> {
    const store = this.stores.get(container);
    if (!store) throw new Error(`Container ${container} not found`);

    const key = `${item.partitionKey}:${item.id}`;
    if (store.has(key)) {
      throw new Error(`Item with id ${item.id} already exists`);
    }

    store.set(key, { ...item });
    return { ...item };
  }

  async read(container: string, id: string, partitionKey: string): Promise<StorageItem | null> {
    const store = this.stores.get(container);
    if (!store) throw new Error(`Container ${container} not found`);

    const key = `${partitionKey}:${id}`;
    const item = store.get(key);
    return item ? { ...item } : null;
  }

  async update(container: string, item: StorageItem): Promise<StorageItem> {
    const store = this.stores.get(container);
    if (!store) throw new Error(`Container ${container} not found`);

    const key = `${item.partitionKey}:${item.id}`;
    if (!store.has(key)) {
      throw new Error(`Item with id ${item.id} not found`);
    }

    store.set(key, { ...item });
    return { ...item };
  }

  async delete(container: string, id: string, partitionKey: string): Promise<void> {
    const store = this.stores.get(container);
    if (!store) throw new Error(`Container ${container} not found`);

    const key = `${partitionKey}:${id}`;
    store.delete(key);
  }

  async query(container: string, filter?: (item: StorageItem) => boolean): Promise<StorageItem[]> {
    const store = this.stores.get(container);
    if (!store) throw new Error(`Container ${container} not found`);

    const items = Array.from(store.values());
    return filter ? items.filter(filter) : items;
  }

  // Utility to clear all data (for testing)
  clear(): void {
    this.stores.forEach((store) => store.clear());
  }
}

// Singleton instance
export const memoryStorage = new MemoryStorage();
