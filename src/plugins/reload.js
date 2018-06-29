/* global location */

const Reload = () => {
  const eventCallback = () => {
    window.location.reload(); // eslint-disable-line no-restricted-globals
  };

  const setup = (optInOut) => {
    optInOut.on('optIn', eventCallback);
    optInOut.on('optOut', eventCallback);
  };

  return {
    setup,
  };
};

export default Reload;
