// Local storage utilities for ClariFi

const STORAGE_KEYS = {
  MAIN_SPLIT: 'clarifi-main-split',
  NOTES_HEIGHT: 'clarifi-notes-height', 
  ACTIVE_PANE: 'clarifi-active-pane',
  LAST_MODULE: 'clarifi-last-module',
  PDF_PAGE: 'clarifi-pdf-page'
};

// Generic storage functions
export const storage = {
  // Get item from localStorage
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Set item in localStorage
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      return false;
    }
  },

  // Remove item from localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  },

  // Clear all ClariFi data
  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Specific storage functions for ClariFi features
export const appStorage = {
  // Main split panel width
  getMainSplit: () => storage.get(STORAGE_KEYS.MAIN_SPLIT, 50),
  setMainSplit: (width) => storage.set(STORAGE_KEYS.MAIN_SPLIT, width),

  // Notes panel height (when in split mode)
  getNotesHeight: () => storage.get(STORAGE_KEYS.NOTES_HEIGHT, 50),
  setNotesHeight: (height) => storage.set(STORAGE_KEYS.NOTES_HEIGHT, height),

  // Active right pane (notes or chat)
  getActivePane: () => storage.get(STORAGE_KEYS.ACTIVE_PANE, 'notes'),
  setActivePane: (pane) => storage.set(STORAGE_KEYS.ACTIVE_PANE, pane),

  // Last accessed module
  getLastModule: () => storage.get(STORAGE_KEYS.LAST_MODULE, null),
  setLastModule: (module) => storage.set(STORAGE_KEYS.LAST_MODULE, module),

  // Current PDF page
  getPdfPage: () => storage.get(STORAGE_KEYS.PDF_PAGE, 1),
  setPdfPage: (page) => storage.set(STORAGE_KEYS.PDF_PAGE, page)
};

export { STORAGE_KEYS };