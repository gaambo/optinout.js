const Analytics = (userOptions) => {
  const defaultOptions = {
    serviceKey: 'analytics',
    propertyId: false,
  };

  const options = Object.assign({}, defaultOptions, userOptions);

  if (!options.propertyId) throw new Error('propertyId needs to be set in Analytics plugin');

  const optOutKey = `ga-disable-${options.propertyId}`;

  const eventCallback = (data, event) => {
    if (!data.service || data.service !== options.serviceKey) {
      return;
    }
    if (event === 'optOut') {
      window[optOutKey] = true;
    } else if (event === 'optIn') {
      delete window[optOutKey];
    }
  };

  const setup = (optInOut) => {
    optInOut.on('optIn', eventCallback);
    optInOut.on('optOut', eventCallback);
  };

  return {
    setup,
  };
};

export default Analytics;
