const Storage = (userOptions) => {
  const defaultOptions = {
    namespace: 'optInOut',
  };

  const options = Object.assign({}, defaultOptions, userOptions);

  const getNamespacedKey = (key) => { // eslint-disable-line arrow-body-style
    return key ? `${options.namespace}.${key}` : options.namespace;
  };

  const storageAvailable = (() => {
    try {
      const testKey = '__storage_test__';
      const testValue = testKey;
      localStorage.setItem(testKey, testValue);
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
  })();

  const getItem = (service, key) => {
    if (storageAvailable) {
      let data;
      try {
        data = JSON.parse(localStorage.getItem(getNamespacedKey(service)));
      } catch (err) {
        data = null;
      }
      if (key) {
        return data[key] || null;
      }
      return data || null;
    }

    return null;
  };

  const writeValue = (key, value) => {
    if (storageAvailable) {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  };

  const setItem = (service, key, value, update) => {
    if (storageAvailable) {
      const currentValue = getItem(service) || {};
      let newValue;
      if (update) {
        const newData = { [key]: value };
        newValue = Object.assign(currentValue, newData);
      } else {
        newValue = currentValue;
        newValue[key] = value;
      }
      return writeValue(getNamespacedKey(service), JSON.stringify(newValue));
    }
    return false;
  };

  const removeItem = (service, key) => {
    if (storageAvailable) {
      if (key) {
        const currentValue = getItem(service) || {};
        const newValue = currentValue;
        delete newValue[key];
        writeValue(getNamespacedKey(service), JSON.stringify(newValue));
      } else {
        localStorage.removeItem(getNamespacedKey(service));
      }
      return true;
    }
    return false;
  };

  return {
    get: (service, key = false) => getItem(service, key),
    set: (service, key, value, update = true) => setItem(service, key, value, update),
    delete: (service, key = false) => removeItem(service, key),
  };
};

export default Storage;
