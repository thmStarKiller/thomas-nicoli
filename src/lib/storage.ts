/**
 * Safe localStorage wrapper that handles SSR and SecurityError
 * 
 * In some contexts (iframes, browser security settings, incognito mode),
 * localStorage may exist but throw SecurityError when accessed.
 * This wrapper provides safe defaults.
 */

/**
 * Check if localStorage is available and accessible
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Try to access localStorage - this will throw if blocked
    const storage = window.localStorage;
    const test = storage.length;
    return true;
  } catch (e) {
    // localStorage is blocked (SecurityError, QuotaExceededError, etc.)
    return false;
  }
}

/**
 * Safely get item from localStorage
 * @returns The stored value or null if not available/accessible
 */
export function getLocalStorage(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get localStorage item "${key}":`, error);
    return null;
  }
}

/**
 * Safely set item in localStorage
 * @returns true if successful, false otherwise
 */
export function setLocalStorage(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set localStorage item "${key}":`, error);
    return false;
  }
}

/**
 * Safely remove item from localStorage
 * @returns true if successful, false otherwise
 */
export function removeLocalStorage(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove localStorage item "${key}":`, error);
    return false;
  }
}

/**
 * Safely clear all localStorage
 * @returns true if successful, false otherwise
 */
export function clearLocalStorage(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Get parsed JSON from localStorage
 * @returns The parsed object or null if not available/invalid
 */
export function getLocalStorageJSON<T>(key: string): T | null {
  const value = getLocalStorage(key);
  if (!value) {
    return null;
  }
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}" as JSON:`, error);
    return null;
  }
}

/**
 * Set JSON object in localStorage
 * @returns true if successful, false otherwise
 */
export function setLocalStorageJSON<T>(key: string, value: T): boolean {
  try {
    const jsonString = JSON.stringify(value);
    return setLocalStorage(key, jsonString);
  } catch (error) {
    console.warn(`Failed to stringify value for localStorage item "${key}":`, error);
    return false;
  }
}
