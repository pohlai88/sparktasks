/**
 * Storage abstraction layer interfaces
 */

export interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  listKeys(prefix: string): Promise<string[]>;
  
  // Optional atomic operations capability
  atomic?: {
    // Atomically write multiple key-value pairs
    setItems?(items: Array<{ key: string; value: string }>): Promise<void>;
    
    // Advertise atomicity capability: 'transaction' | 'temp-swap' | 'none'
    capability: 'transaction' | 'temp-swap' | 'none';
  };
}

export interface StorageNamespace {
  prefix: string;
  driver: StorageDriver;
}
