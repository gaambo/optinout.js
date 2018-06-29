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
          if (el.dataset.service) {
            el.addEventListener('click', () => {
              optInOut.optIn(el.dataset.service, el.dataset.storage || false);
            });
          }
        });

        // OPTOUT
        elements = document.querySelectorAll(options.optOutClickSelector);
        elements.forEach((el) => {
          if (el.dataset.service) {
            el.addEventListener('click', () => {
              optInOut.optOut(el.dataset.service, el.dataset.storage || false);
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
