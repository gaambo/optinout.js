import OptInOut from '../../src/main';
import CookieStorage from '../../src/storages/cookie';

const defaultLanguage = {
  undefined: 'undefined',
  defaults: {}, 
  optedIn: 'opted in', 
  optedOut: 'opted out', 
};
const defaultOptions = { plugins: [], doNotTrack: false, language: defaultLanguage };

test("Initialize Default/Empty", () => {
  let obj = OptInOut({
    storages: {},
    services: {},
  });

  expect(obj.getOptions()).toEqual(defaultOptions);
  expect(obj.getServices()).toEqual({});
  expect(obj.getStorages()).toEqual({});
});

test("Initialize Storage", () => {
  let cookieStorage = CookieStorage();
  let storages = {
    cookie: cookieStorage,
  };
  let obj = OptInOut({
    storages,
    services: {}
  });

  expect(obj.getOptions()).toEqual(defaultOptions);
  expect(obj.getServices()).toEqual({});
  expect(obj.getStorages()).toEqual(storages);
  expect(obj.getStorage('cookie')).toEqual(cookieStorage);
});

test("Initialize service", () => {
  let services = {
    facebook: { mode: 'optIn' }
  };
  let obj = OptInOut({
    storages: {},
    services
  });

  expect(obj.getOptions()).toEqual(defaultOptions);
  expect(obj.getServices()).toEqual(services);
  expect(obj.getStorages()).toEqual({});
  expect(obj.getService('facebook')).toEqual({mode: 'optIn'});
});

test("Initialize with wrong service object", () => {
  let services = {
    facebook: { anything: 'optIn' }
  };
  let obj = OptInOut({
    storages: {},
    services
  });

  expect(obj.getServices()).toEqual({});
});

test("Initialize with wrong storage object", () => {
  let storages = {
    cookie: {}
  };
  let obj = OptInOut({
    storages,
    services: {}
  });

  expect(obj.getStorages()).toEqual({});
});

test("Initialize with another option", () => {
  let obj = OptInOut({
    anyOption: 123
  });

  expect(obj.getOption('anyOption')).toEqual(123);
});

test("Trigger init event", () => {
  const initCallback = jest.fn();

  let obj = OptInOut({
    services: {
      facebook: {
        mode: 'optIn',
      }
    }, 
    plugins: [
      (lib) => {
        lib.on('init', initCallback);
      }
    ]
  }); 

  expect(initCallback).toBeCalled();
});