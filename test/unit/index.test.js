import optInOut from '../../src/main';
import cookieStorage from '../../src/storages/cookie';

const emptyOptions = { plugins: [], doNotTrack: false };

test("initialisationEmpty", () => {
  let obj = optInOut({
    storages: {},
    services: {}
  });

  expect(obj.getOptions()).toEqual(emptyOptions);
  expect(obj.getServices()).toEqual({});
  expect(obj.getStorages()).toEqual({});
});

test("initialisationStorages", () => {
  let storages = {
    cookie: cookieStorage()
  };
  let obj = optInOut({
    storages,
    services: {}
  });

  expect(obj.getOptions()).toEqual(emptyOptions);
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

  expect(obj.getOptions()).toEqual(emptyOptions);
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