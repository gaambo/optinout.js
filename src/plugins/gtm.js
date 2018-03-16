const GTM = (userOptions) => {

  const defaultOptions = {
    dataLayerKey: 'dataLayer',
    eventNamespace: false
  };

  let options = Object.assign({}, defaultOptions, userOptions);

  const getDataLayer = () => {
    return window[options.dataLayerKey] || []; 
  }

  const getEventName = (event) => {
    if(options.eventNamespace) {
      return options.eventNamespace + '.' + event; 
    } else {
      return event; 
    }
  }

  const eventCallback = (data,event) => {
    window[options.dataLayerKey].push({
      'event': getEventName(event),
      'service': data.service || ''
    });
  };

  const init = (optInOut) => {
    optInOut.on('optin', eventCallback);
    optInOut.on('optOut', eventCallback); 
  };

  return {
    init: init,
    optIn: optIn, 
    optOut: optOut
  };
};

export default GTM; 