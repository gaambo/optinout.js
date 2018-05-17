/* global location */

const Reload = () => {
  const eventCallback = () => {
    console.log(window.location);
    window.location.reload(); // eslint-disable-line no-restricted-globals
  };

  const init = (optInOut) => {
    optInOut.on('optIn', eventCallback);
    optInOut.on('optOut', eventCallback);
  };

  return {
    init,
  };
};

export default Reload;
