// Define a base storage interface
const storage = {
  async setItem(key, value) {
    console.log("value is going to set",key,value)
    throw new Error("Storage method not implemented.");
  },
  async getItem(key) {
    throw new Error("Storage method not implemented.");
  }
};

// Factory function to determine and set the appropriate storage methods
async function configureStorage() {
  if (typeof localStorage !== 'undefined') {
    
    // Web environment
    storage.setItem = async (key, value) => localStorage.setItem(key, value);
    storage.getItem = async (key) => localStorage.getItem(key);
  } else {
    // Mobile environment with AsyncStorage
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    storage.setItem = AsyncStorage.default.setItem;
    storage.getItem = AsyncStorage.default.getItem;
  }
}

configureStorage(); // Initialize storage configuration

export default storage;
