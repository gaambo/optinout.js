import LocalStorage from '../../../src/storages/localStorage';
import LocalStorageMock from '../../helper/localStorageMock';

test("Set and Get Data in LocalStorage", () => {
  global.localStorage = LocalStorageMock;
  let localStorage =  LocalStorage({});

  var date = new Date();
  localStorage.set('analytics', 'optIn', date, false);
  expect(localStorage.get('analytics')).toHaveProperty('optIn');
  expect(localStorage.get('analytics', 'optIn')).toEqual(date.toISOString());

  var newDate = new Date('2000-06-01');
  localStorage.set('analytics', 'optIn', newDate, true); //try updating
  expect(localStorage.get('analytics', 'optIn')).toEqual(newDate.toISOString());
});

test("Set and Remove LocalStorage", () => {
  global.localStorage = LocalStorageMock;
  let localStorage =  LocalStorage({});

  var date = new Date();
  localStorage.set('analytics', 'optIn', date, false);
  expect(localStorage.get('analytics')).toHaveProperty('optIn');

  localStorage.delete('analytics', 'optIn');
  expect(localStorage.get('analytics')).not.toHaveProperty('optIn');

  localStorage.delete('analytics');
  expect(localStorage.get('analytics')).toBeNull();

});
