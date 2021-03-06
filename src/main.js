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
    language: {
      undefined: 'undefined',
      optedIn: 'opted in',
      optedOut: 'opted out',
      defaults: {},
    },
  };

  // PRIVATE PROPERTIES

  let options;
  let storages;
  let services;
  let events;
  let language; // eslint-disable-line prefer-const

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

  const getIsAllowed = (serviceKey, storageKey = false) => {
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
    } else {
      throw new Error(`service ${serviceKey} does not exist/is not configured`);
    }

    let allowed = null; // default

    checkStorages.every((currentStorageKey) => {
      const storage = storages[currentStorageKey];
      const value = storage.get(serviceKey);

      if (typeof value === 'undefined' || value === undefined || value === null) return true; // continue

      if (service.mode === 'optIn') {
        if (value.optedIn === false) {
          // optedIn is explicitly false (has been set, but not to optin)
          allowed = false;
        } else if (value.optedIn && !value.optedOut) {
          // optedIn is set and optedOut is not set
          allowed = true;
        } else if (value.optedOut && !value.optedIn) {
          // optedOut is set and optedIn is not set
          allowed = false;
        } else if (Date.parse(value.optedOut) < Date.parse(value.optedIn)) {
          // both set, optedIn is newer
          allowed = true;
        } else if (Date.parse(value.optedOut) > Date.parse(value.optedIn)) {
          // both set, optedOut is newer
          allowed = false;
        }
      } else if (service.mode === 'optOut') {
        if (value.optedIn === undefined || !value.optedIn) {
          // optedIn is not set - refer to optOut
          allowed = !value.optedOut;
        } else if (value.optedIn && !value.optedOut) {
          // optIn is explicitly set and optOut not
          allowed = true;
        } else if (Date.parse(value.optedIn) > Date.parse(value.optedOut)) {
          // both set, optedIn is newser
          allowed = true;
        } else if (Date.parse(value.optedIn) < Date.parse(value.optedOut)) {
          // both set, optedOut is newer
          allowed = false;
        }
      }

      if (allowed !== null) return false; // break
      return true;
    });

    return allowed; // can be null: means, nothing is set yet
  };

  // PUBLIC PROPERTIES

  // PUBLIC METHODS
  self.optIn = (serviceKey, storageKey = false) => {
    const date = new Date();
    setValueInStorages(serviceKey, 'optedIn', date, storageKey);
    triggerEvent('optIn', {
      service: serviceKey, storage: storageKey, date, status: self.getStatus(serviceKey, true),
    });
  };

  self.optOut = (serviceKey, storageKey = false) => {
    const date = new Date();
    setValueInStorages(serviceKey, 'optedOut', date, storageKey);
    triggerEvent('optOut', {
      service: serviceKey, storage: storageKey, date, status: self.getStatus(serviceKey, false),
    });
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
    let allowed = getIsAllowed(serviceKey, storageKey);
    const service = services[serviceKey];
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

  self.isSet = (serviceKey, storageKey = false) => {
    const allowed = getIsAllowed(serviceKey, storageKey);
    if (allowed === null) {
      if (options.doNotTrack && doNotTrack()) {
        return true;
      }
      return false;
    }
    return true;
  };

  self.getStatus = (serviceKey, isAllowed = null) => {
    const isCurrentlyAllowed = isAllowed !== null ? isAllowed : getIsAllowed(serviceKey);
    if (isCurrentlyAllowed === true) return language.optedIn;
    else if (isCurrentlyAllowed === false) return language.optedOut;

    return [
      language.undefined,
      language.defaults[serviceKey] || null,
    ];
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
    if (typeof plugin === 'function') {
      plugin(self);
    } else if (typeof plugin.setup === 'function') {
      plugin.setup(self);
    }
  });

  // init language
  language = Object.assign( // eslint-disable-line prefer-const
    {},
    defaultOptions.language,
    userOptions.language,
  );

  // finalizie setup
  triggerEvent('init', self);
  return self;
};

export default optInOut;
