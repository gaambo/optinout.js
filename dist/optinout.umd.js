(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.OptInOut = factory());
}(this, (function () { 'use strict';

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Storage = function Storage(userOptions) {
  var defaultOptions = {
    namespace: 'optInOut',
    expiration: Infinity,
    domain: false,
    path: false,
    secure: false
  };

  var options = Object.assign({}, defaultOptions, userOptions);

  var getExpirationString = function getExpirationString(date) {
    var expirationDate = date || options.expiration;

    var expires = void 0;
    switch (expirationDate.constructor) {
      case Number:
        expires = date === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + expirationDate;
        break;
      case String:
        expires = '; expires=' + expirationDate;
        break;
      case Date:
        expires = '; expires=' + expirationDate.toUTCString();
        break;
      default:
        expires = '';
        break;
    }

    return expires;
  };

  var getKey = function getKey(key) {
    return options.namespace + '.' + key;
  };

  var getValue = function getValue(key) {
    if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
      return false;
    }
    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(getKey(key)).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1'));
  };

  var getItem = function getItem(service, key) {
    if (!service) {
      return null;
    }

    var value = getValue(service) || null;

    var valueJson = JSON.parse(value);
    if (key) {
      return valueJson[key] || null;
    }
    return valueJson || null;
  };

  var writeValue = function writeValue(key, value, expires) {
    document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(value)) + getExpirationString(expires) + (options.domain ? '; domain=' + options.domain : '') + (options.Path ? '; path=' + options.Path : '') + (options.secure ? '; secure' : '');
  };

  var setItem = function setItem(service, key, value, update) {
    if (!service || /^(?:expires|max-age|path|domain|secure)$/i.test(service)) {
      return false;
    }

    var saveValue = void 0;

    if (update) {
      var newData = defineProperty({}, key, value);
      var currentData = getItem(service);
      saveValue = Object.assign({}, currentData, newData);
    } else {
      saveValue = defineProperty({}, key, value);
    }

    writeValue(getKey(service), saveValue);

    return true;
  };

  var hasItem = function hasItem(service) {
    return Boolean(getValue(service));
  };

  var removeItem = function removeItem(service, key) {
    if (!service || !hasItem(service)) {
      return false;
    }

    if (key) {
      var currentValue = getItem(service, key);
      delete currentValue[key];
      return setItem(service, key, currentValue, false); // force overwrite
    }
    writeValue(getKey(service), '', new Date('01 Jan 1970'));
    return true;
  };

  return {
    get: function get$$1(service) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return getItem(service, key);
    },
    set: function set$$1(service, key, value) {
      var update = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      return setItem(service, key, value, update);
    },
    delete: function _delete(service) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return removeItem(service, key);
    }
  };
};

var Storage$1 = function Storage(userOptions) {

  var defaultOptions = {
    namespace: 'optInOut',
    expiration: Infinity,
    domain: false,
    path: false,
    secure: false
  };

  var options = Object.assign({}, defaultOptions, userOptions);

  var getNamespacedKey = function getNamespacedKey(key) {
    return key ? options.namespace + '.' + key : options.namespace;
  };

  var storageAvailable = function () {
    try {
      var testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      localStorage.length !== 0;
    }
  }();

  var getItem = function getItem(service, key) {
    if (storageAvailable) {
      var data = void 0;
      try {
        data = JSON.parse(localStorage.getItem(getNamespacedKey(service)));
      } catch (err) {
        data = null;
      }
      if (key) {
        return data[key] || null;
      } else {
        return data || null;
      }
    }

    return null;
  };

  var setItem = function setItem(service, key, value, update) {
    if (storageAvailable) {
      var currentValue = getItem(service) || {};
      if (update) {
        var newData = defineProperty({}, key, value);
        value = Object.assign(currentValue, newData);
      } else {
        value = currentValue;
        value[key] = value;
      }
      localStorage.setItem(getNamespacedKey(service), JSON.stringify(value));
      return true;
    } else {
      return false;
    }
  };

  var removeItem = function removeItem(service, key) {
    if (storageAvailable) {
      if (key) {
        var currentValue = getItem(service) || {};
        delete currentValue[key];
        setItem(service, key, currentValue, false); //force overwrite
      } else {
        localStorage.removeItem(getNamespacedKey(service));
      }
      return true;
    } else {
      return false;
    }
  };

  return {
    get: function get$$1(service) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return getItem(service, key);
    },
    set: function set$$1(service, key, value) {
      var update = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      return setItem(service, key, value, update);
    },
    delete: function _delete(service) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return removeItem(service, key);
    }
  };
};

var Storage$2 = function Storage(data) {

  data = Object.assign({}, data);

  var getItem = function getItem(service, key) {
    if (key) {
      return data[service][key] || null;
    } else {
      return data[service] || null;
    }
  };

  var setItem = function setItem(service, key, value, update) {
    var currentValue = getItem(service) || {};
    if (update) {
      var newData = defineProperty({}, key, value);
      value = Object.assign(currentValue, newData);
    } else {
      value = currentValue;
      value[key] = value;
    }
    data[service] = value;
    return true;
  };

  var removeItem = function removeItem(service, key) {
    if (key) {
      delete data[service][key];
    } else {
      delete data[service];
    }
    return true;
  };

  return {
    get: function get$$1(service, key) {
      return getItem(service, key);
    },
    set: function set$$1(service, key, value, update) {
      return setItem(service, key, value, update);
    },
    delete: function _delete(service, key) {
      return removeItem(service, key);
    },
    getData: function getData() {
      return data;
    }
  };
};

var GTM = function GTM(userOptions) {

  var defaultOptions = {
    dataLayerKey: 'dataLayer',
    eventNamespace: false
  };

  var options = Object.assign({}, defaultOptions, userOptions);

  var getEventName = function getEventName(event) {
    if (options.eventNamespace) {
      return options.eventNamespace + '.' + event;
    } else {
      return event;
    }
  };

  var eventCallback = function eventCallback(data, event) {
    window[options.dataLayerKey].push({
      'event': getEventName(event),
      'service': data.service || ''
    });
  };

  var init = function init(optInOut) {
    optInOut.on('optin', eventCallback);
    optInOut.on('optOut', eventCallback);
  };

  return {
    init: init,
    optIn: optIn,
    optOut: optOut
  };
};

var LinkHelper = function LinkHelper(userOptions) {

  var defaultOptions = {
    optInClickSelector: '.optinout-optIn',
    optOutClickSelector: '.optout-optOut'
  };

  var options = Object.assign({}, defaultOptions, userOptions);

  var init = function init(optInOut) {
    if (document && document.querySelectorAll) {
      if (options.optInClickSelector) {
        var elements = void 0;
        //OPTIN
        elements = document.querySelectorAll(options.optInClickSelector);
        elements.forEach(function (el) {
          if (el.dataset.service) {
            el.addEventListener('click', function () {
              optInOut.optIn(el.dataset.service, el.dataset.storage || false);
            });
          }
        });

        //OPTOUT
        elements = document.querySelectorAll(options.optOutClickSelector);
        elements.forEach(function (el) {
          if (el.dataset.service) {
            el.addEventListener('click', function () {
              optInOut.optOut(el.dataset.service, el.dataset.storage || false);
            });
          }
        });
      }
    }
  };

  return {
    init: init
  };
};

// storage needs to have get & set methods
// service needs to have mode (optIn|optOut)

var OptInOut = function OptInOut(userOptions) {
  var self = {};

  var defaultOptions = {
    storages: {
      cookie: Storage(),
      localStorage: Storage$1(),
      dataStorage: Storage$2()
    },
    services: {},
    plugins: []
  };

  // PRIVATE PROPERTIES

  var options = void 0;
  var storages = void 0;
  var services = void 0;
  var events = void 0;

  // PRIVATE METHODS

  var setValueInStorages = function setValueInStorages(serviceKey, key, value) {
    var storageKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var update = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    if (!services[serviceKey]) throw new Error('service ' + serviceKey + ' is not configured for OptInOut');

    if (storageKey && storages[storageKey]) {
      storages[storageKey].set(serviceKey, key, value);
    } else {
      Object.keys(storages).forEach(function (storagesKey) {
        storages[storagesKey].set(serviceKey, key, value, update);
      });
    }
  };

  var triggerEvent = function triggerEvent(event, data) {
    var handlers = events[event];
    if (!handlers || handlers.length < 1) {
      return;
    }

    handlers.forEach(function (handler) {
      handler.call(self, [data, event]);
    });
  };

  // PUBLIC PROPERTIES

  // PUBLIC METHODS
  self.optIn = function (serviceKey) {
    var storageKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var date = new Date();
    setValueInStorages(serviceKey, 'optedIn', date, storageKey);
    triggerEvent('optIn', { service: serviceKey, storage: storageKey, date: date });
  };

  self.optOut = function (serviceKey) {
    var storageKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var date = new Date();
    setValueInStorages(serviceKey, 'optedOut', date, storageKey);
    triggerEvent('optOut', { service: serviceKey, storage: storageKey, date: date });
  };

  self.getOption = function (optionKey) {
    return options[optionKey];
  };

  self.getStorage = function (storageKey) {
    return storages[storageKey];
  };

  self.getService = function (serviceKey) {
    return services[serviceKey];
  };

  self.getStorages = function () {
    return storages;
  };

  self.getServices = function () {
    return services;
  };

  self.getOptions = function () {
    return options;
  };

  self.on = function (event, callback) {
    var handlers = events[event] || [];
    handlers.push(callback);
    events[event] = handlers;
  };

  self.isAllowed = function (serviceKey, storageKey) {
    var service = void 0;
    var checkStorages = void 0;
    if (serviceKey && services[serviceKey]) {
      service = services[serviceKey];
      if (storageKey && storages[storageKey]) {
        var storagesCopy = Object.assign({}, storages);
        delete storagesCopy[storageKey];
        checkStorages = [storageKey].concat(toConsumableArray(Object.keys(storagesCopy)));
      } else {
        checkStorages = Object.keys(storages);
      }
    }

    var allowed = null; // default

    checkStorages.every(function (currentStorageKey) {
      var storage = storages[currentStorageKey];
      var value = storage.get(serviceKey);

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

    if (allowed === null) {
      // need to use default value
      allowed = service.default ? service.default : service.mode !== 'optIn';
    }

    return allowed;
  };

  // INIT OBJECT

  // PROPERTIES
  // options
  options = Object.assign({}, defaultOptions, userOptions);

  // init storages
  storages = {};
  Object.keys(options.storages).forEach(function (storagesKey) {
    var storage = options.storages[storagesKey];
    if (typeof storage.get === 'function' && typeof storage.set === 'function') {
      storages[storagesKey] = options.storages[storagesKey];
    }
    return true;
  });
  delete options.storages;

  // init services
  services = {};
  Object.keys(options.services).forEach(function (serviceKey) {
    var service = options.services[serviceKey];
    if (typeof service.mode !== 'undefined') {
      services[serviceKey] = options.services[serviceKey];
    }
  });
  delete options.services;

  // init plugins
  events = {};
  options.plugins.forEach(function (plugin) {
    if (typeof plugin.init !== 'function') {
      plugin.init(self);
    }
  });

  OptInOut.instance = self;
  return self;
};

// set global accessable methods
OptInOut.isAllowed = function (service, storage) {
  if (OptInOut.instance !== undefined) {
    return OptInOut.instance.isAllowed(service, storage);
  }
  return null;
};

OptInOut.optIn = function (service, storage) {
  if (OptInOut.instance !== undefined) {
    return OptInOut.instance.optIn(service, storage);
  }
  return null;
};

OptInOut.optOut = function (service, storage) {
  if (OptInOut.instance !== undefined) {
    return OptInOut.instance.optOut(service, storage);
  }
  return null;
};

// set global accessable/namespaced storageadapters
var storageAdapters = {
  cookieStorage: Storage,
  localStorage: Storage$1,
  dataStorage: Storage$2
};
OptInOut.storageAdapters = storageAdapters;

// set global accessable/namespaced plugins
var plugins = {
  gtmPlugin: GTM,
  linkPlugin: LinkHelper
};
OptInOut.plugins = plugins;

return OptInOut;

})));
