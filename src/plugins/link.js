const LinkHelper = (userOptions) => {

  const defaultOptions = {
    optInClickSelector: '.optinout-optIn',
    optOutClickSelector: '.optout-optOut'
  };

  let options = Object.assign({}, defaultOptions, userOptions);

  const init = (optInOut) => {
    if(document && document.querySelectorAll) {
      if(options.optInClickSelector) {
        let elements;
        //OPTIN
        elements = document.querySelectorAll(options.optInClickSelector);
        elements.forEach(function(el) {
          if(el.dataset.service) {
            el.addEventListener('click', () => {
              optInOut.optIn(el.dataset.service, el.dataset.storage || false);
            });
          }
        });

        //OPTOUT
        elements = document.querySelectorAll(options.optOutClickSelector);
        elements.forEach(function(el) {
          if(el.dataset.service) {
            el.addEventListener('click', () => {
              optInOut.optOut(el.dataset.service, el.dataset.storage || false);
            });
          }
        });
      }
    }
  };

  return {
    init: init
  };
};

export default LinkHelper; 