import { default as optInOut } from '../../src/index';

test("optout", () => {
  let dataStorage =  optInOut.storageAdapters.dataStorage({});
  let obj = optInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('facebook')).toBe(true);

  obj.optOut('facebook');

  expect(dataStorage.getData()).toHaveProperty('facebook.optedOut'); 
  expect(Date.parse(dataStorage.getData()['facebook']['optedOut'])).not.toBeNaN();

  expect(obj.isAllowed('facebook')).toBe(false);
});

test("optin", () => {
  let dataStorage =  optInOut.storageAdapters.dataStorage({});
  let obj = optInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('facebook')).toBe(false);

  obj.optIn('facebook');

  expect(dataStorage.getData()).toHaveProperty('facebook.optedIn'); 
  expect(Date.parse(dataStorage.getData()['facebook']['optedIn'])).not.toBeNaN();

  expect(obj.isAllowed('facebook')).toBe(true);

  obj.optOut('facebook'); 

  expect(dataStorage.getData()).toHaveProperty('facebook.optedIn'); 
  expect(dataStorage.getData()).toHaveProperty('facebook.optedOut'); 
  expect(Date.parse(dataStorage.getData()['facebook']['optedIn'])).not.toBeNaN();
  expect(Date.parse(dataStorage.getData()['facebook']['optedOut'])).not.toBeNaN();

  expect(obj.isAllowed('facebook')).toBe(false);

});