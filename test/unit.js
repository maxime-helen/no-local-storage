'use-strict';

/* eslint-disable no-plusplus, no-param-reassign */

import assert from 'assert';
import NoLocalStorage from '../index';

let mockedStorage = {};

describe('Unit test suit', () => {
  beforeEach('Mock window.localStorage', () => {
    const mockedWindow = {
      localStorage: {
        length: 0,
      },
    };
    const prototype = {
      getItem: (key) => window.localStorage[key],
      setItem: (key, value) => {
        window.localStorage[key] = value;
      },
      removeItem: (key) => {
        delete window.localStorage[key];
      },
      clear: () => {
        mockedStorage = {};
      },
    };
    const mockedLocalStorageProxy = new Proxy(mockedWindow.localStorage, {
      get(target, prop) {
        if (Object.keys(prototype).includes(prop)) {
          return target[prop];
        }
        return mockedStorage[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        mockedStorage[prop] = value;
        return true;
      },
      deleteProperty(target, prop) {
        delete mockedStorage[prop];
        delete target[prop];
        return true;
      },
    });
    Reflect.setPrototypeOf(mockedLocalStorageProxy, prototype);
    Object.defineProperty(mockedWindow, 'localStorage', {
      get() {
        return mockedLocalStorageProxy;
      },
      set() {},
    });
    global.window = mockedWindow;
  });

  afterEach('Cleanup window and NoLocalStorage properties', () => {
    NoLocalStorage.nativeLocalStorage = undefined;
    global.window = undefined;
    mockedStorage = {};
  });

  it('disable() prevents to get item', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.disable();
    assert(window.localStorage.foo === undefined);
    assert(window.localStorage.getItem('foo') === undefined);
  });

  it('disable() gets whitelisted item', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.disable(['foo']);
    assert(window.localStorage.foo === mockedStorage.foo);
    assert(window.localStorage.getItem('foo') === mockedStorage.foo);
  });

  it('disable() prevents to set item', () => {
    NoLocalStorage.disable();
    window.localStorage.foo = 2;
    assert(window.localStorage.foo === undefined);
    window.localStorage.setItem(2);
    assert(window.localStorage.foo === undefined);
    assert(window.localStorage.length === 0);
  });

  it('disable() sets whitelisted item', () => {
    NoLocalStorage.disable(['foo']);
    window.localStorage.foo = 2;
    assert(window.localStorage.foo === 2);
    window.localStorage.setItem('foo', 3);
    assert(window.localStorage.foo === 3);
    assert(window.localStorage.length === 1);
  });

  it('disable() and remove an item does nothing', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.disable();
    delete window.localStorage.foo;
    assert(window.localStorage.foo === undefined);
    window.localStorage.removeItem('foo');
    assert(window.localStorage.foo === undefined);
    assert(window.localStorage.length === 0);
  });

  it('disable() removes a whitelisted item', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.disable(['foo']);
    window.localStorage.setItem('foo', 1);
    delete window.localStorage.foo;
    assert(window.localStorage.foo === undefined);
    assert(window.localStorage.foo === mockedStorage.foo);
    window.localStorage.setItem('foo', 1);
    assert(window.localStorage.foo === 1);
    window.localStorage.removeItem('foo');
    assert(window.localStorage.foo === undefined);
    assert(window.localStorage.bar === mockedStorage.bar);
    assert(window.localStorage.length === 0);
  });

  it('disable() clears added whitelisted items', () => {
    NoLocalStorage.disable(['foo', 'bar']);
    window.localStorage.foo = 1;
    assert(window.localStorage.foo === mockedStorage.foo);
    window.localStorage.setItem('bar', 2);
    assert(window.localStorage.bar === mockedStorage.bar);
    assert(window.localStorage.length === 2);
    window.localStorage.clear();
    assert(window.localStorage.length === 0);
    assert(window.localStorage.foo === undefined);
    assert(window.localStorage.foo === mockedStorage.foo);
    assert(window.localStorage.bar === undefined);
    assert(window.localStorage.bar === mockedStorage.bar);
    assert(window.localStorage.length === 0);
  });

  it('disable() iterates whitelisted items with key()', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.disable(['bar', 'foobar', 'barfoo']);
    window.localStorage.foo = 1;
    window.localStorage.bar = 1;
    window.localStorage.foobar = 1;
    window.localStorage.barfoo = 1;
    assert(window.localStorage.key(0) === 'bar');
    assert(window.localStorage.key(1) === 'foobar');
    assert(window.localStorage.key(2) === 'barfoo');
    delete window.localStorage.foobar;
    assert(window.localStorage.key(1) === 'barfoo');
    assert(window.localStorage.key(2) === undefined);
  });

  it('enable() without prior disable() does nothing', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.enable();
    assert(window.localStorage.foo === mockedStorage.foo);
    window.localStorage.setItem('foo', 2);
    assert(window.localStorage.foo === mockedStorage.foo);
  });

  it('enable() after prior disable() sets back native behavior', () => {
    window.localStorage.foo = 1;
    NoLocalStorage.disable();
    assert(window.localStorage.foo === undefined);
    NoLocalStorage.enable();
    assert(window.localStorage.foo === mockedStorage.foo);
  });
});
