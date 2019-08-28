const getDataAttribute = (el, key) => {
  if (el.dataset) {
    return el.dataset[key];
  } else if (el.getAttribute) {
    return el.getAttribute(`data-${key}`);
  }
  return null;
};

const LinkHelper = (userOptions) => {
  const defaultOptions = {
    optInClickSelector: '.optInOut-optIn',
    optOutClickSelector: '.optInOut-optOut',
  };

  const options = Object.assign({}, defaultOptions, userOptions);

  const setup = (optInOut) => {
    if (document && document.querySelectorAll) {
      if (options.optInClickSelector) {
        let elements;
        // OPTIN
        elements = document.querySelectorAll(options.optInClickSelector);
        elements.forEach((el) => {
          const service = getDataAttribute(el, 'service');
          const storage = getDataAttribute(el, 'storage') || false;
          if (service) {
            el.addEventListener('click', () => {
              optInOut.optIn(service, storage);
            });
          }
        });

        // OPTOUT
        elements = document.querySelectorAll(options.optOutClickSelector);
        elements.forEach((el) => {
          const service = getDataAttribute(el, 'service');
          const storage = getDataAttribute(el, 'storage') || false;
          if (service) {
            el.addEventListener('click', () => {
              optInOut.optOut(service, storage);
            });
          }
        });
      }
    }
  };

  return {
    setup,
  };
};

export default LinkHelper;
