import basicDataStorage from './data';

const Storage = (startData, userOptions) => {
  const dataStorage = basicDataStorage(startData);

  const defaultOptions = {
    ajaxUrl: false,
    additionalData: false,
    ajaxFunction: null,
    ajaxOptions: {},
  };

  const options = Object.assign({}, defaultOptions, userOptions);

  const setItem = (service, key, value, update) => {
    dataStorage.set(service, key, value, update);

    const currentValue = dataStorage.get(service) || false;
    if (options.ajaxFunction) {
      const ajaxData = Object.assign({}, options.additionalData, {
        service,
        key,
        value,
        update,
        currentValue,
      });

      options.ajaxFunction(options.ajaxUrl, ajaxData, options.ajaxOptions);
      return true;
    }
    return false;
  };

  const removeItem = (service, key) => {
    dataStorage.delete(service, key);
    return setItem(service, key, null, false);
  };

  return {
    get: (service, key) => dataStorage.get(service, key),
    set: (service, key, value, update) => setItem(service, key, value, update),
    delete: (service, key) => removeItem(service, key),
    getData: () => dataStorage.getData(),
  };
};

export default Storage;
