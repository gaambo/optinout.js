import OptInOut from '../../src/main';
import DataStorage from '../../src/storages/data';

test("optout", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
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
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
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