const Storage = (userOptions) => {

  const defaultOptions = {
    namespace: 'optInOut',
    expiration: Infinity,
    domain: false,
    path: false,
    secure: false,
  };

  let options = Object.assign({}, defaultOptions, userOptions);

  let getNamespacedKey = (key) => {
    return key ? options.namespace + '.' + key : options.namespace;
  };

  let storageAvailable = (() => {
    try {
      const testKey = '__storage_test__';
      const testValue = testKey;
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    }
    catch (e) {
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

  let getItem = (service, key) => {
    if(storageAvailable) {
      let data; 
      try {
        data = JSON.parse(localStorage.getItem(getNamespacedKey(service)));
      } catch(err) {
        data = null; 
      }
      if(key) {
        return data[key] || null; 
      } else {
        return data || null; 
      }
    }

    return null; 
  };

  let setItem = (service,key,value,update) => {
    if(storageAvailable) {
      let currentValue = getItem(service) || {}; 
      if(update) {
        let newData = { [key] : value };
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

  let removeItem = (service,key) => {
    if(storageAvailable) {
      if(key) {
        let currentValue = getItem(service) || {}; 
        delete currentValue[key]; 
        setItem(service,key,currentValue,false); //force overwrite
      } else {
        localStorage.removeItem(getNamespacedKey(service));
      }
      return true; 
    } else {
      return false; 
    }
  };

  return {
    get: (service,key = false) => {
      return getItem(service,key); 
    },
    set: (service,key,value,update = true) => {
      return setItem(service,key,value,update);
    },
    delete: (service,key = false) => {
      return removeItem(service,key);
    }
  };
};

export default Storage; 