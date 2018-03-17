var OptInOut = (function () {
'use strict';

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

/*\
|*|
|*|	:: cookies.js ::
|*|
|*|	A complete cookies reader/writer framework with full unicode support.
|*|
|*|	Revision #3 - July 13th, 2017
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/cookies.js
|*|
|*|	This framework is released under the GNU Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|	Syntaxes:
|*|
|*|	* docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|	* docCookies.getItem(name)
|*|	* docCookies.removeItem(name[, path[, domain]])
|*|	* docCookies.hasItem(name)
|*|
\*/

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
    date = date ? date : options.expiration;

    var expires = void 0;
    switch (date.constructor) {
      case Number:
        expires = date === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + date;
        /*
        Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
        version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
        the end parameter might not work as expected. A possible solution might be to convert the the
        relative time to an absolute time. For instance, replacing the previous line with:
        */
        /*
        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
        */
        break;
      case String:
        expires = "; expires=" + date;
        break;
      case Date:
        expires = "; expires=" + date.toUTCString();
        break;
    }

    return expires;
  };

  var getKey = function getKey(key) {
    return options.namespace + '.' + key;
  };

  var getItem = function getItem(service, key) {
    if (!service) {
      return null;
    }

    var value = getValue(service) || null;

    var valueJson = JSON.parse(value);
    if (key) {
      return valueJson[key] || null;
    } else {
      return valueJson || null;
    }
  };

  var writeValue = function writeValue(k, v, expires) {
    document.cookie = encodeURIComponent(k) + "=" + encodeURIComponent(JSON.stringify(v)) + getExpirationString(expires) + (options.domain ? "; domain=" + options.domain : "") + (options.Path ? "; path=" + options.Path : "") + (options.secure ? "; secure" : "");
  };

  var getValue = function getValue(key) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false;
    }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(getKey(key)).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"));
  };

  var setItem = function setItem(service, key, value, update) {
    if (!service || /^(?:expires|max\-age|path|domain|secure)$/i.test(service)) {
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

  var removeItem = function removeItem(service, key) {

    if (!service || !hasItem(service)) {
      return false;
    }

    if (key) {
      var currentValue = getItem(service, key);
      delete currentValue[key];
      return setItem(service, key, currentValue, false); //force overwrite
    } else {
      writeValue(getKey(service), '', new Date('01 Jan 1970'));
      return true;
    }
  };

  var hasItem = function hasItem(service) {
    return Boolean(getValue(service));
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

function optInOut(userOptions) {

  function OptInOut(userOptions) {
    var self = this;
    var defaultOptions = {
      storages: {
        'cookie': Storage(),
        'localStorage': Storage$1(),
        'dataStorage': Storage$2()
      },
      services: {},
      plugins: []
    };

    //PRIVATE PROPERTIES

    var options = void 0;
    var storages = void 0;
    var services = void 0;
    var events = void 0;

    //PRIVATE METHODS

    var setValueInStorages = function setValueInStorages(serviceKey, key, value) {
      var storageKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var update = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

      if (!services[serviceKey]) throw new Error('service ' + serviceKey + ' is not configured for OptInOut');

      if (storageKey && storages[storageKey]) {
        storages[storageKey].set(serviceKey, key, value);
      } else {
        for (var storagesKey in storages) {
          if (!storages.hasOwnProperty(storagesKey)) continue;
          storages[storagesKey].set(serviceKey, key, value, update);
        }
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

    //PUBLIC PROPERTIES 

    //PUBLIC METHODS 
    self.optIn = function (serviceKey) {
      var storageKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var date = new Date();
      setValueInStorages(serviceKey, 'optedIn', date, storageKey);
      triggerEvent('optIn', { service: serviceKey, storage: storageKey, date: date });
    };

    self.optOut = function (serviceKey) {
      var storageKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      setValueInStorages(serviceKey, 'optedOut', new Date(), storageKey);
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

      var allowed = null; //default

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = checkStorages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var currentStorageKey = _step.value;

          var storage = storages[currentStorageKey];
          var value = storage.get(serviceKey);

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
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (allowed === null) {
        //need to use default value
        allowed = service.default ? service.default : service.mode == 'optIn' ? false : true;
      }

      return allowed;
    };

    //INIT OBJECT

    //PROPERTIES
    //options
    options = Object.assign({}, defaultOptions, userOptions);

    var initStorages = function initStorages() {
      storages = {};
      for (var storagesKey in options.storages) {
        if (!options.storages.hasOwnProperty(storagesKey)) continue;
        var storage = options.storages[storagesKey];
        if (typeof storage.get === 'function' && typeof storage.set === 'function') {
          storages[storagesKey] = options.storages[storagesKey];
        }
      }
      delete options.storages;
    };
    initStorages();

    var initServices = function initServices() {
      services = {};
      for (var serviceKey in options.services) {
        if (!options.services.hasOwnProperty(serviceKey)) continue;
        var service = options.services[serviceKey];
        if (typeof service.mode !== 'undefined') {
          services[serviceKey] = options.services[serviceKey];
        }
      }
      delete options.services;
    };
    initServices();

    var initPlugins = function initPlugins() {
      events = {};
      plugins.forEach(function (plugin) {
        if (typeof plugin.init !== 'function') {
          plugin.init(self);
        }
      });
    };
    initPlugins();
  }

  var newObject = new OptInOut(userOptions);

  if (optInOut.instance === undefined) {
    optInOut.instance = newObject;
  }

  return newObject;
}

optInOut.isAllowed = function (service, storage) {
  if (optInOut.instance !== undefined) {
    return optInOut.instance.isAllowed(service, storage);
  }
  return null;
};

optInOut.optIn = function (service, storage) {
  if (optInOut.instance !== undefined) {
    return optInOut.instance.optIn(service, storage);
  }
  return null;
};

optInOut.optOut = function (service, storage) {
  if (optInOut.instance !== undefined) {
    return optInOut.instance.optOut(service, storage);
  }
  return null;
};

var storageAdapters = {
  'cookieStorage': Storage,
  'localStorage': Storage$1,
  'dataStorage': Storage$2
};
optInOut.storageAdapters = storageAdapters;

var plugins = {
  'gtmPlugin': GTM,
  'linkPlugin': LinkHelper
};
optInOut.plugins = GTM;

return optInOut;

}());
