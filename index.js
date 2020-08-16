'use strict';

let nativeLocalStorage;

const NoLocalStorage = {
  disable: (whitelist = []) => {
    // store browser localStorage as old value, to be replaced with proxy
    nativeLocalStorage = window.localStorage;
    // buffer for storage keys
    const keys = [];
    // store the whitelisted values to the new local storage object
    const localStorageWithoutPrototype = Object.keys(nativeLocalStorage)
      .reduce((acc, key) => {
        if (whitelist.includes(key)) {
          acc[key] = nativeLocalStorage[key];
          acc.length++;
        }
        return acc;
      }, { length: 0 });
    Object.defineProperty(localStorageWithoutPrototype, 'length', {
      writable: false,
      configurable: true,
    });
    // define prototype mocked Storage
    const prototype = {
      getItem: (key) => window.localStorage[key],
      setItem: (key, value) => {
        window.localStorage[key] = value;
      },
      removeItem: (key) => {
        delete window.localStorage[key];
      },
      key: (n) => keys[n],
      clear: () => {
        for (let i = 0, keys = Object.keys(window.localStorage); i < keys.length; i++) {
          const key = keys[i];
          if (key !== 'length') {
            delete window.localStorage[key];
          }
        }
        keys.length = 0;
      },
    };
    // Bind proxy
    const newLocalStorage = new Proxy(localStorageWithoutPrototype, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        if (whitelist.includes(prop)) {
          if (!target.hasOwnProperty(prop)) {
            Object.defineProperty(target, 'length', { writable: true });
            target.length++;
            Object.defineProperty(target, 'length', { writable: false });
            keys.push(prop);
          }
          target[prop] = value;
          nativeLocalStorage[prop] = value;
        }
        return true;
      },
      deleteProperty: (target, prop) => {
        // length is not deletable
        if (prop === 'length') {
          return false;
        }
        if (target.hasOwnProperty(prop)) {
          delete target[prop];
          delete nativeLocalStorage[prop];
          keys.splice(keys.indexOf(prop), 1);
          Object.defineProperty(target, 'length', { writable: true });
          target.length--;
          Object.defineProperty(target, 'length', { writable: false });
        }
        return true;
      }
    });
    Reflect.setPrototypeOf(newLocalStorage, prototype);
    Object.defineProperty(window, 'localStorage', {
      get: () => newLocalStorage,
      configurable: true,
    });
  },
  enable: () => {
    if (nativeLocalStorage) {
      Object.defineProperty(window, 'localStorage', {
        get: () => nativeLocalStorage,
      });
    }
  },
};

export default NoLocalStorage;