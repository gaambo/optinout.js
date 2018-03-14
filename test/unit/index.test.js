import { default as optInOut } from '../../src/index';

test("initialisationEmpty", () => {
  let obj = optInOut({
    storages: {},
    services: {}
  });

  expect(obj.getOptions()).toEqual({});
  expect(obj.getServices()).toEqual({});
  expect(obj.getStorages()).toEqual({});
});

test("initialisationStorages", () => {
  let storages = {
    cookie: optInOut.storageAdapters.cookieStorage()
  };
  let obj = optInOut({
    storages,
    services: {}
  });

  expect(obj.getOptions()).toEqual({});
  expect(obj.getServices()).toEqual({});
  expect(obj.getStorages()).toEqual(storages);
});

test("initialisationServices", () => {
  let services = {
    facebook: { mode: 'optIn' }
  };
  let obj = optInOut({
    storages: {},
    services
  });

  expect(obj.getOptions()).toEqual({});
  expect(obj.getServices()).toEqual(services);
  expect(obj.getStorages()).toEqual({});
});

test("initialisationServicesWrong", () => {
  let services = {
    facebook: { anything: 'optIn' }
  };
  let obj = optInOut({
    storages: {},
    services
  });

  expect(obj.getServices()).toEqual({});
});

test("init storages wrong", () => {
  let storages = {
    cookie: {}
  };
  let obj = optInOut({
    storages,
    services: {}
  });

  expect(obj.getStorages()).toEqual({});
});