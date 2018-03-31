const doAjaxCall = (url, options) => {

};

const Storage = (startData, userOptions) => {
  const data = Object.assign({}, startData);

  const defaultOptions = {
    ajaxPath: false,
    additionalData: false,
    ajaxFunction: doAjaxCall,
    ajaxOptions: {},
  };

  const options = Object.assign({}, defaultOptions, userOptions);

  const getItem = (service, key) => {
    if (key) {
      return data[service][key] || null;
    }
    return data[service] || null;
  };

  const setItem = (service, key, value, update) => {
    const currentValue = getItem(service) || {};
    let newValue;
    if (update) {
      const newData = { [key]: value };
      newValue = Object.assign(currentValue, newData);
    } else {
      newValue = currentValue;
      newValue[key] = value;
    }
    data[service] = newValue;
    return true;
  };

  const removeItem = (service, key) => {
    if (key) {
      delete data[service][key];
    } else {
      delete data[service];
    }
    return true;
  };

  const hasItem = (service, key) => { // eslint-disable-line no-unused-vars
    if (key) {
      return ((service in data) && (key in data[service]));
    }
    return (service in data);
  };

  return {
    get: (service, key) => getItem(service, key),
    set: (service, key, value, update) => setItem(service, key, value, update),
    delete: (service, key) => removeItem(service, key),
    getData: () => data,
  };
};

export default Storage;
