const GTM = (userOptions) => {
  const defaultOptions = {
    dataLayerKey: 'dataLayer',
    eventNamespace: false,
  };

  const options = Object.assign({}, defaultOptions, userOptions);

  // const getDataLayer = () => window[options.dataLayerKey] || [];

  const getEventName = (event) => {
    if (options.eventNamespace) {
      return `${options.eventNamespace}.${event}`;
    }
    return event;
  };

  const eventCallback = (data, event) => {
    window[options.dataLayerKey].push({
      event: getEventName(event),
      service: data.service || '',
    });
  };

  const init = (optInOut) => {
    optInOut.on('optIn', eventCallback);
    optInOut.on('optOut', eventCallback);
  };

  return {
    init,
  };
};

export default GTM;
