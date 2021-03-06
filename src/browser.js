import cookieStorage from './storages/cookie';
import localStorage from './storages/localStorage';
import dataStorage from './storages/data';
import ajaxDataStorage from './storages/data-ajax';
import gtmPlugin from './plugins/gtm';
import analyticsPlugin from './plugins/analytics';
import linkPlugin from './plugins/link';
import reloadPlugin from './plugins/reload';
import OptInOut from './main';

// wrapper around module so we can set static methods

const optInOut = (userOptions) => {
  optInOut.instance = OptInOut(userOptions);
  return optInOut.instance;
};

// set global accessable methods
optInOut.isAllowed = (service, storage) => {
  if (optInOut.instance !== undefined) {
    return optInOut.instance.isAllowed(service, storage);
  }
  return null;
};

optInOut.getStatus = (service) => {
  if (optInOut.instnace !== undefined) {
    return optInOut.instance.getStatus(service);
  }
  return null;
};

optInOut.optIn = (service, storage) => {
  if (optInOut.instance !== undefined) {
    return optInOut.instance.optIn(service, storage);
  }
  return null;
};

optInOut.optOut = (service, storage) => {
  if (optInOut.instance !== undefined) {
    return optInOut.instance.optOut(service, storage);
  }
  return null;
};

optInOut.getInstance = () => {
  if (optInOut.instance !== undefined) {
    return optInOut.instance;
  }
  return null;
};

// set global accessable/namespaced storageadapters
const storageAdapters = {
  cookieStorage,
  localStorage,
  dataStorage,
  ajaxDataStorage,
};
optInOut.storageAdapters = storageAdapters;

// set global accessable/namespaced plugins
const plugins = {
  gtmPlugin,
  linkPlugin,
  reloadPlugin,
  analyticsPlugin,
};
optInOut.plugins = plugins;

export default optInOut;
