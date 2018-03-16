const Storage = (data) => {

  data = Object.assign({}, data);

  let getItem = (service,key) => {
    if(key) {
      return data[service][key] || null;
    } else {
      return data[service] || null;
    }
  };

  let setItem = (service,key,value,update) => {
    let currentValue = getItem(service) || {}; 
    if(update) {
      let newData = { [key] : value }; 
      value = Object.assign(currentValue, newData); 
    } else {
      value = currentValue;
      value[key] = value; 
    }
    data[service] = value; 
    return true; 
  };

  let removeItem = (service,key) => {
    if(key) {
      delete data[service][key]; 
    } else {
      delete data[service]; 
    }
    return true; 
  };

  let hasItem = (service,key) => {
    if(key) {
      return ( (service in data) && (key in data[service]) ); 
    } else {
      return (service in data); 
    }
  }

  return {
    get: (service,key) => {
      return getItem(service,key);
    },
    set: (service,key,value,update) => {
      return setItem(service,key,value,update);
    },
    delete: (service,key) => {
      return removeItem(service,key);
    },
    getData: () => data,
  };
};

export default Storage; 