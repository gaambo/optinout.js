import OptInOut from '../../src/main';
import DataStorage from '../../src/storages/data';

test("Check optout date is correctly set in data storage", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(dataStorage.getData()).toEqual({});

  obj.optOut('analytics');

  expect(dataStorage.getData()).toHaveProperty('analytics.optedOut'); 
  expect(Date.parse(dataStorage.getData()['analytics']['optedOut'])).not.toBeNaN();
});

test("Check optin date is correctly set in data storage", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(dataStorage.getData()).toEqual({});

  obj.optIn('facebook');

  expect(dataStorage.getData()).toHaveProperty('facebook.optedIn'); 
  expect(Date.parse(dataStorage.getData()['facebook']['optedIn'])).not.toBeNaN();
});