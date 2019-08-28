const Storage = (userOptions) => {
  const defaultOptions = {
    namespace: 'optInOut',
    expiration: Infinity,
    domain: false,
    path: '/',
    secure: false,
  };

  const options = Object.assign({}, defaultOptions, userOptions);


  const getExpirationString = (date) => {
    const expirationDate = date || options.expiration;

    let expires;
    switch (expirationDate.constructor) {
      case Number:
        expires = expirationDate === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${expirationDate}`;
        break;
      case String:
        expires = `; expires=${expirationDate}`;
        break;
      case Date:
        expires = `; expires=${expirationDate.toUTCString()}`;
        break;
      default:
        expires = '';
        break;
    }

    return expires;
  };

  const getKey = key => `${options.namespace}.${key}`;

  const getValue = (key) => {
    if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) { return false; }
    return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(getKey(key)).replace(/[-.+*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1'));
  };

  const getItem = (service, key) => {
    if (!service) { return null; }

    const value = getValue(service) || null;
    let valueJson;
    try {
      valueJson = JSON.parse(value);
    } catch (err) {
      valueJson = null;
    }

    if (key) {
      return valueJson[key] || null;
    }
    return valueJson || null;
  };

  const writeValue = (key, value, expires) => {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}${getExpirationString(expires)}${options.domain ? `; domain=${options.domain}` : ''}${options.path ? `; path=${options.path}` : ''}${options.secure ? '; secure' : ''}`;
  };

  const setItem = (service, key, value, update) => {
    if (!service || /^(?:expires|max-age|path|domain|secure)$/i.test(service)) { return false; }

    let saveValue;

    if (update) {
      const newData = { [key]: value };
      const currentData = getItem(service);
      saveValue = Object.assign({}, currentData, newData);
    } else {
      saveValue = { [key]: value };
    }

    writeValue(getKey(service), saveValue);

    return true;
  };

  const hasItem = service => Boolean(getValue(service));

  const removeItem = (service, key) => {
    if (!service || !hasItem(service)) { return false; }

    if (key) {
      const currentValue = getItem(service);
      const newValue = currentValue;
      delete newValue[key];

      writeValue(getKey(service), newValue);
      return true;
    }
    writeValue(getKey(service), '', new Date('01 Jan 1970'));
    return true;
  };

  return {
    get: (service, key = false) => getItem(service, key),
    set: (service, key, value, update = true) => setItem(service, key, value, update),
    delete: (service, key = false) => removeItem(service, key),
  };
};

export default Storage;
