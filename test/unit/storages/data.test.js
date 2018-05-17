import DataStorage from '../../../src/storages/data';

test("Set and Get Data in DataStorage", () => {
  let dataStorage =  DataStorage({});

  var date = new Date();
  dataStorage.set('analytics', 'optIn', date, false);
  expect(dataStorage.get('analytics')).toHaveProperty('optIn');
  expect(dataStorage.get('analytics', 'optIn')).toEqual(date);
});

test("Set and Remove DataStorage", () => {
  let dataStorage =  DataStorage({});

  var date = new Date();
  dataStorage.set('analytics', 'optIn', date, false);
  expect(dataStorage.get('analytics')).toHaveProperty('optIn');

  dataStorage.delete('analytics', 'optIn');
  expect(dataStorage.get('analytics')).not.toHaveProperty('optIn');

  dataStorage.delete('analytics');
  expect(dataStorage.get('analytics')).toBeNull();

});