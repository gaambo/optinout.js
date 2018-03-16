import { default as cookieStorage } from './storages/cookie';
import { default as localStorage } from './storages/localStorage';
import { default as dataStorage } from './storages/data';
import { default as gtmPlugin } from './plugins/gtm';

// storage needs to have get & set methods
// service needs to have mode (optIn|optOut)

function optInOut(userOptions) {

  function OptInOut(userOptions) {
    const self = this;
    const defaultOptions = {
      storages: {
        'cookie': cookieStorage(),
        'localStorage': localStorage(),
        'dataStorage': dataStorage()
      },
      services: {

      },
      plugins: [],
    };

    //PRIVATE PROPERTIES

    let options;
    let storages;
    let services;
    let events;

    //PRIVATE METHODS

    let setValueInStorages = (serviceKey, key, value, storageKey = false, update = true) => {
      if (!services[serviceKey]) throw new Error('service ' + serviceKey + ' is not configured for OptInOut');

      if (storageKey && storages[storageKey]) {
        storages[storageKey].set(serviceKey, key, value);
      } else {
        for (let storagesKey in storages) {
          if (!storages.hasOwnProperty(storagesKey)) continue;
          storages[storagesKey].set(serviceKey, key, value, update);
        }
      }
    };

    let triggerEvent = (event,data) => {
      let handlers = events[event]; 
      if(!handlers || handlers.length < 1) {
        return; 
      }

      handlers.forEach((handler) => {
        handler.call(self, [data,event]); 
      })
    };

    //PUBLIC PROPERTIES 

    //PUBLIC METHODS 
    self.optIn = (serviceKey, storageKey = false) => {
      let date = new Date();
      setValueInStorages(serviceKey, 'optedIn', date , storageKey);
      triggerEvent('optIn', { service: serviceKey, storage: storageKey, date: date });
    };

    self.optOut = (serviceKey, storageKey = false) => {
      setValueInStorages(serviceKey, 'optedOut', new Date(), storageKey);
      triggerEvent('optOut', { service: serviceKey, storage: storageKey, date: date });
    };

    self.getOption = (optionKey) => {
      return options[optionKey];
    };

    self.getStorage = (storageKey) => {
      return storages[storageKey];
    };

    self.getService = (serviceKey) => {
      return services[serviceKey];
    };

    self.getStorages = () => storages; 

    self.getServices = () => services;

    self.getOptions = () => options;

    self.on = (event,callback) => {
      let handlers = events[event] || []; 
      handlers.push(callback); 
      events[event] = handlers; 
    };

    self.isAllowed = (serviceKey, storageKey) => {
      let service;
      let checkStorages;
      if (serviceKey && services[serviceKey]) {
        service = services[serviceKey];
        if (storageKey && storages[storageKey]) {
          let storagesCopy = Object.assign({},storages); 
          delete storagesCopy[storageKey];
          checkStorages = [storageKey, ...Object.keys(storagesCopy)];         
        } else {
          checkStorages = Object.keys(storages);
        }
      }

      let allowed = null; //default

      for (let currentStorageKey of checkStorages) {
        let storage = storages[currentStorageKey];
        let value = storage.get(serviceKey);

        if (typeof value === 'undefined' || value === undefined || value === null) continue;

        if (service.mode == 'optIn') {
          if (value.optedIn == false) {
            allowed = false;
          } else if (value.optedIn && !value.optedOut) {
            allowed = true;
          } else if (Date.parse(value.optedOut) < Date.parse(value.optedIn)) {
            allowed = true;
          } else if (Date.parse(value.optedOut) > Date.parse(value.optedIn)) {
            allowed = false;
          }
        } else if (service.mode == 'optOut') {
          if (value.optedIn == undefined || value.optedIn == false) {
            allowed = !value.optedOut;
          } else if (Date.parse(value.optedIn) > Date.parse(value.optedOut)) {
            allowed = true;
          } else if (Date.parse(value.optedIn) < Date.parse(value.optedOut)) {
            allowed = false;
          }
        }

        if (allowed !== null) break;
      }

      if (allowed === null) { //need to use default value
        allowed = service.default ? service.default : (service.mode == 'optIn' ? false : true);
      }

      return allowed;
    };

    //INIT OBJECT

    //PROPERTIES
    //options
    options = Object.assign({}, defaultOptions, userOptions);

    let initStorages = () => {
      storages = {};
      for (let storagesKey in options.storages) {
        if (!options.storages.hasOwnProperty(storagesKey)) continue;
        let storage = options.storages[storagesKey];
        if (typeof storage.get === 'function' && typeof storage.set === 'function') {
          storages[storagesKey] = options.storages[storagesKey];
        }
      }
      delete options.storages;
    };
    initStorages();

    let initServices = () => {
      services = {};
      for (let serviceKey in options.services) {
        if (!options.services.hasOwnProperty(serviceKey)) continue;
        let service = options.services[serviceKey];
        if (typeof service.mode !== 'undefined') {
          services[serviceKey] = options.services[serviceKey];
        }
      }
      delete options.services;
    };
    initServices();

    let initPlugins = () => {
      events = {}; 
      plugins.forEach((plugin) => {
        if(typeof plugin.init !== 'function') {
          plugin.init(self); 
        }
      });
    }
  };

  var newObject = new OptInOut(userOptions); 

  if(optInOut.instance === undefined) {
    optInOut.instance = newObject; 
  }

  return newObject; 
};

optInOut.isAllowed = (service,storage) => {
  if(optInOut.instance !== undefined) {
    return optInOut.instance.isAllowed(service,storage); 
  }
  return null;
};

optInOut.optIn = (service,storage) => {
  if(optInOut.instance !== undefined) {
    return optInOut.instance.optIn(service,storage); 
  }
  return null; 
};

optInOut.optOut = (service,storage) => {
  if(optInOut.instance !== undefined) {
    return optInOut.instance.optOut(service,storage); 
  }
  return null; 
};

const storageAdapters = {
  'cookieStorage': cookieStorage,
  'localStorage': localStorage,
  'dataStorage': dataStorage
};
optInOut.storageAdapters = storageAdapters;

const plugins = {
  'gtmPlugin': gtmPlugin
}; 
optInOut.plugins = gtmPlugin; 

export default optInOut;