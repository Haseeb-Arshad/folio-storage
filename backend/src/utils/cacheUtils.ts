/**
 * Simple in-memory cache utility with TTL support
 * This can be extended to use Redis or another distributed cache for production
 */

interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number | null;
}

class CacheService {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 300) { // Default 5 minutes TTL
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    
    // Set up cleanup interval (every minute)
    setInterval(() => this.cleanup(), 60000);
  }
  
  /**
   * Set a value in the cache with optional TTL
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttl ?? this.defaultTTL;
    const expiresAt = ttl ? Date.now() + (ttl * 1000) : null;
    
    this.cache.set(key, {
      value,
      expiresAt
    });
  }
  
  /**
   * Get a value from the cache
   * Returns undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) return undefined;
    
    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * Delete a value from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Clear all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get a value from the cache, or compute it if not present
   * Great for memoization patterns
   */
  async getOrSet<T>(key: string, fn: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const cachedValue = this.get<T>(key);
    if (cachedValue !== undefined) return cachedValue;
    
    // Calculate the value
    const value = await fn();
    this.set(key, value, options);
    return value;
  }
  
  /**
   * Remove expired items from the cache
   */
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Get current cache size
   */
  get size(): number {
    return this.cache.size;
  }
}

// Export singleton instance and the class
export const cacheService = new CacheService();
export default CacheService;
