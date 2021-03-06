"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* eslint-disable no-plusplus, no-param-reassign */
var nativeLocalStorage;
var NoLocalStorage = {
  disable: function disable() {
    var whitelist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    // store browser localStorage as old value, to be replaced with proxy
    nativeLocalStorage = window.localStorage; // buffer for storage keys

    var localStorageKeys = []; // store the whitelisted values to the new local storage object

    var localStorageWithoutPrototype = Object.keys(nativeLocalStorage).reduce(function (acc, key) {
      if (whitelist.includes(key)) {
        acc[key] = nativeLocalStorage[key];
        acc.length++;
      }

      return acc;
    }, {
      length: 0
    });
    Object.defineProperty(localStorageWithoutPrototype, 'length', {
      writable: false,
      configurable: true
    }); // define prototype mocked Storage

    var prototype = {
      getItem: function getItem(key) {
        return window.localStorage[key];
      },
      setItem: function setItem(key, value) {
        window.localStorage[key] = value;
      },
      removeItem: function removeItem(key) {
        delete window.localStorage[key];
      },
      key: function key(n) {
        return localStorageKeys[n];
      },
      clear: function clear() {
        for (var i = 0, keys = Object.keys(window.localStorage); i < keys.length; i++) {
          var key = keys[i];

          if (key !== 'length') {
            delete window.localStorage[key];
          }
        }

        localStorageKeys.length = 0;
      }
    }; // Bind proxy

    var newLocalStorage = new Proxy(localStorageWithoutPrototype, {
      get: function get(target, prop) {
        return target[prop];
      },
      set: function set(target, prop, value) {
        if (whitelist.includes(prop)) {
          if (!(prop in target)) {
            Object.defineProperty(target, 'length', {
              writable: true
            });
            target.length++;
            Object.defineProperty(target, 'length', {
              writable: false
            });
            localStorageKeys.push(prop);
          }

          target[prop] = value;
          nativeLocalStorage[prop] = value;
        }

        return true;
      },
      deleteProperty: function deleteProperty(target, prop) {
        // length is not deletable
        if (prop === 'length') {
          return false;
        }

        if (prop in target) {
          delete target[prop];
          delete nativeLocalStorage[prop];
          localStorageKeys.splice(localStorageKeys.indexOf(prop), 1);
          Object.defineProperty(target, 'length', {
            writable: true
          });
          target.length--;
          Object.defineProperty(target, 'length', {
            writable: false
          });
        }

        return true;
      }
    });
    Reflect.setPrototypeOf(newLocalStorage, prototype);
    Object.defineProperty(window, 'localStorage', {
      get: function get() {
        return newLocalStorage;
      },
      configurable: true
    });
  },
  enable: function enable() {
    if (nativeLocalStorage) {
      Object.defineProperty(window, 'localStorage', {
        get: function get() {
          return nativeLocalStorage;
        }
      });
    }
  }
};
var _default = NoLocalStorage;
exports["default"] = _default;
