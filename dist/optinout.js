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

  var getExpirationString = function getExpirationString() {
    var expires = void 0;
    switch (options.expiration.constructor) {
      case Number:
        expires = options.expiration === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + options.expiration;
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
        expires = "; expires=" + options.expiration;
        break;
      case Date:
        expires = "; expires=" + options.expiration.toUTCString();
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

    var value = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(getKey(service)).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;

    var valueJson = JSON.parse(value);
    if (key) {
      return valueJson[key] || null;
    } else {
      return valueJson || null;
    }
  };

  var setItem = function setItem(service, key, value, update) {
    if (!service || /^(?:expires|max\-age|path|domain|secure)$/i.test(service)) {
      return false;
    }
    var expires = getExpirationString();

    var writeValue = function writeValue(k, v) {
      document.cookie = encodeURIComponent(k) + "=" + encodeURIComponent(JSON.stringify(v)) + expires + (options.domain ? "; domain=" + options.domain : "") + (options.Path ? "; path=" + options.Path : "") + (options.secure ? "; secure" : "");
    };

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

  var removeItem = function removeItem(key) {
    if (!hasItem(key)) {
      return false;
    }
    document.cookie = encodeURIComponent(getKey(key)) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (options.domain ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "");
    return true;
  };

  var hasItem = function hasItem(key) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
      return false;
    }
    return new RegExp("(?:^|;\\s*)" + encodeURIComponent(getKey(key)).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
  };

  return {
    get: function get$$1(service, key) {
      return getItem(service, key);
    },
    set: function set$$1(service, key, value, update) {
      return setItem(service, key, value, update);
    },
    delete: function _delete(service) {
      return removeItem(service);
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

  return {
    get: function get$$1(service, key) {
      return getItem(service, key);
    },
    set: function set$$1(service, key, value, update) {
      return setItem(service, key, value, update);
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

  return {
    get: function get$$1(service, key) {
      return getItem(service, key);
    },
    set: function set$$1(service, key, value, update) {
      return setItem(service, key, value, update);
    },
    getData: function getData() {
      return data;
    }
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
      services: {}
    };

    //PRIVATE PROPERTIES

    var options = void 0;
    var storages = void 0;
    var services = void 0;

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

    //PUBLIC PROPERTIES 

    //PUBLIC METHODS 
    self.optIn = function (serviceKey) {
      var storageKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      setValueInStorages(serviceKey, 'optedIn', new Date(), storageKey);
    };

    self.optOut = function (serviceKey) {
      var storageKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      setValueInStorages(serviceKey, 'optedOut', new Date(), storageKey);
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

    self.isAllowed = function (serviceKey, storageKey) {
      var service = void 0;
      var checkStorages = void 0;
      if (serviceKey && services[serviceKey]) {
        service = services[serviceKey];
        if (storageKey && storages[storageKey]) {
          delete storages[storageKey];
          checkStorages = [storages[storageKey]].concat(toConsumableArray(Object.keys(storages)));
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
  }

  return new OptInOut(userOptions);
}

var storageAdapters = {
  'cookieStorage': Storage,
  'localStorage': Storage$1,
  'dataStorage': Storage$2
};
optInOut.storageAdapters = storageAdapters;

return optInOut;

}());
