import cookieStorage from './storages/cookie';
import localStorage from './storages/localStorage';

import doNotTrack from './helper/doNotTrack';

// storage needs to have get & set methods
// service needs to have mode (optIn|optOut)

const optInOut = (userOptions) => {
  const self = {};

  const defaultOptions = {
    storages: {
      cookie: cookieStorage(),
      localStorage: localStorage(),
    },
    services: {},
    plugins: [],
    doNotTrack: false,
  };

  // PRIVATE PROPERTIES

  let options;
  let storages;
  let services;
  let events;

  // PRIVATE METHODS

  const setValueInStorages = (serviceKey, key, value, storageKey = false, update = true) => {
    if (!services[serviceKey]) throw new Error(`service ${serviceKey} is not configured for optInOut`);

    if (storageKey && storages[storageKey]) {
      storages[storageKey].set(serviceKey, key, value);
    } else {
      Object.keys(storages).forEach((storagesKey) => {
        storages[storagesKey].set(serviceKey, key, value, update);
      });
    }
  };

  const triggerEvent = (event, data) => {
    const handlers = events[event];
    if (!handlers || handlers.length < 1) {
      return;
    }

    handlers.forEach((handler) => {
      handler.call(self, data, event);
    });
  };

  // PUBLIC PROPERTIES

  // PUBLIC METHODS
  self.optIn = (serviceKey, storageKey = false) => {
    const date = new Date();
    setValueInStorages(serviceKey, 'optedIn', date, storageKey);
    triggerEvent('optIn', { service: serviceKey, storage: storageKey, date });
  };

  self.optOut = (serviceKey, storageKey = false) => {
    const date = new Date();
    setValueInStorages(serviceKey, 'optedOut', date, storageKey);
    triggerEvent('optOut', { service: serviceKey, storage: storageKey, date });
  };

  self.getOption = optionKey => options[optionKey];

  self.getStorage = storageKey => storages[storageKey];

  self.getService = serviceKey => services[serviceKey];

  self.getStorages = () => storages;

  self.getServices = () => services;

  self.getOptions = () => options;

  self.getPlugins = () => options.plugins;

  self.on = (event, callback) => {
    const handlers = events[event] || [];
    handlers.push(callback);
    events[event] = handlers;
  };

  self.isAllowed = (serviceKey, storageKey = false) => {
    let service;
    let checkStorages;
    if (serviceKey && services[serviceKey]) {
      service = services[serviceKey];
      if (storageKey && storages[storageKey]) {
        const storagesCopy = Object.assign({}, storages);
        delete storagesCopy[storageKey];
        checkStorages = [storageKey, ...Object.keys(storagesCopy)];
      } else {
        checkStorages = Object.keys(storages);
      }
    }

    let allowed = null; // default

    checkStorages.every((currentStorageKey) => {
      const storage = storages[currentStorageKey];
      const value = storage.get(serviceKey);

      if (typeof value === 'undefined' || value === undefined || value === null) return true; // continue

      if (service.mode === 'optIn') {
        if (value.optedIn === false) {
          allowed = false;
        } else if (value.optedIn && !value.optedOut) {
          allowed = true;
        } else if (Date.parse(value.optedOut) < Date.parse(value.optedIn)) {
          allowed = true;
        } else if (Date.parse(value.optedOut) > Date.parse(value.optedIn)) {
          allowed = false;
        }
      } else if (service.mode === 'optOut') {
        if (value.optedIn === undefined || !value.optedIn) {
          allowed = !value.optedOut;
        } else if (Date.parse(value.optedIn) > Date.parse(value.optedOut)) {
          allowed = true;
        } else if (Date.parse(value.optedIn) < Date.parse(value.optedOut)) {
          allowed = false;
        }
      }

      if (allowed !== null) return false; // break
      return true;
    });

    const defaultAllowed = service.default ? service.default : (service.mode !== 'optIn');

    if (allowed === null) { // use do not track or default
      if (options.doNotTrack) {
        if (doNotTrack()) {
          allowed = false;
        } else {
          allowed = defaultAllowed;
        }
      } else {
        allowed = defaultAllowed;
      }
    }

    return allowed;
  };

  // INIT OBJECT

  // PROPERTIES
  // options
  options = Object.assign({}, defaultOptions, userOptions);

  // init storages
  storages = {};
  Object.keys(options.storages).forEach((storagesKey) => {
    const storage = options.storages[storagesKey];
    if (typeof storage.get === 'function' && typeof storage.set === 'function') {
      storages[storagesKey] = options.storages[storagesKey];
    }
    return true;
  });
  delete options.storages;

  // init services
  services = {};
  Object.keys(options.services).forEach((serviceKey) => {
    const service = options.services[serviceKey];
    if (typeof service.mode !== 'undefined') {
      services[serviceKey] = options.services[serviceKey];
    }
  });
  delete options.services;

  // init plugins
  events = {};
  options.plugins.forEach((plugin) => {
    if (typeof plugin.init === 'function') {
      plugin.init(self);
    }
  });

  return self;
};

export default optInOut;
