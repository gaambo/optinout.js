import * as cookieStorage from './storages/cookie';
import * as localStorage from './storages/localStorage';
import * as dataStorage from './storages/data';
import * as gtmPlugin from './plugins/gtm';
import * as linkPlugin from './plugins/link';

// storage needs to have get & set methods
// service needs to have mode (optIn|optOut)

const OptInOut = (userOptions) => {
  const self = {};

  const defaultOptions = {
    storages: {
      cookie: cookieStorage(),
      localStorage: localStorage(),
      dataStorage: dataStorage(),
    },
    services: {

    },
    plugins: [],
  };

  // PRIVATE PROPERTIES

  let options;
  let storages;
  let services;
  let events;

  // PRIVATE METHODS

  const setValueInStorages = (serviceKey, key, value, storageKey = false, update = true) => {
    if (!services[serviceKey]) throw new Error(`service ${serviceKey} is not configured for OptInOut`);

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
      handler.call(self, [data, event]);
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

  self.on = (event, callback) => {
    const handlers = events[event] || [];
    handlers.push(callback);
    events[event] = handlers;
  };

  self.isAllowed = (serviceKey, storageKey) => {
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

    Object.keys(checkStorages).every((currentStorageKey) => {
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

    if (allowed === null) { // need to use default value
      allowed = service.default ? service.default : (service.mode !== 'optIn');
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
    if (typeof plugin.init !== 'function') {
      plugin.init(self);
    }
  });


  OptInOut.instance = self;
  return self;
};

// set global accessable methods
OptInOut.isAllowed = (service, storage) => {
  if (OptInOut.instance !== undefined) {
    return OptInOut.instance.isAllowed(service, storage);
  }
  return null;
};

OptInOut.optIn = (service, storage) => {
  if (OptInOut.instance !== undefined) {
    return OptInOut.instance.optIn(service, storage);
  }
  return null;
};

OptInOut.optOut = (service, storage) => {
  if (OptInOut.instance !== undefined) {
    return OptInOut.instance.optOut(service, storage);
  }
  return null;
};

// set global accessable/namespaced storageadapters
const storageAdapters = {
  cookieStorage,
  localStorage,
  dataStorage,
};
OptInOut.storageAdapters = storageAdapters;

// set global accessable/namespaced plugins
const plugins = {
  gtmPlugin,
  linkPlugin,
};
OptInOut.plugins = plugins;

export default OptInOut;
