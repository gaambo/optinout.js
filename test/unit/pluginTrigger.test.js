//TODO check plugin triggers working

import OptInOut from '../../src/main';

test("Initialize with object Plugin", () => {
  const plugin = {
    setup: jest.fn()
  }
  let obj = OptInOut({
    plugins: [
      plugin
    ]
  });

  expect(obj.getPlugins()).toEqual([plugin]);
  expect(plugin.setup).toHaveBeenLastCalledWith(obj);
});

test("Initialize with method Plugin", () => {
  const plugin = jest.fn();

  let obj = OptInOut({
    plugins: [
      plugin
    ]
  });

  expect(obj.getPlugins()).toEqual([plugin]);
  expect(plugin).toHaveBeenLastCalledWith(obj);
});

test("Trigger optIn Plugin Event", () => {
  let triggerCalled = false;
  let eventName;
  let eventData;

  const trigger = (data,event) => {
    triggerCalled = true;
    eventName = event;
    eventData = data;
  };

  const plugin = {
    setup: (lib) => {
      lib.on('optIn', trigger);
    },
  }
  let obj = OptInOut({
    services: {
      facebook: { mode: 'optIn' },
    }, 
    plugins: [
      plugin
    ]
  });

  obj.optIn('facebook');

  //{ service: serviceKey, storage: storageKey, date }
  
  expect(obj.getPlugins()).toEqual([plugin]);
  expect(triggerCalled).toBeTruthy();
  expect(eventName).toEqual('optIn');
  expect(eventData).toHaveProperty('service', 'facebook');
  expect(eventData).toHaveProperty('storage', false);
  expect(eventData).toHaveProperty('date');
});