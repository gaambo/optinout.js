const Storage = (userData) => {
  const data = Object.assign({}, userData);

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

  return {
    get: (service, key) => getItem(service, key),
    set: (service, key, value, update) => setItem(service, key, value, update),
    delete: (service, key) => removeItem(service, key),
    getData: () => data,
  };
};

export default Storage;
