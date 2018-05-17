import DataStorage from '../../../src/storages/data-ajax';

test("Set and Get Data in AJAX-DataStorage", () => {
  let dataStorage =  DataStorage({});

  var date = new Date();
  dataStorage.set('analytics', 'optIn', date, false);
  expect(dataStorage.get('analytics')).toHaveProperty('optIn');
  expect(dataStorage.get('analytics', 'optIn')).toEqual(date);

  expect(dataStorage.getData()).toEqual({analytics: { optIn: date }});
});

test("Set and Remove AJAX-DataStorage", () => {
  let dataStorage =  DataStorage({});

  var date = new Date();
  dataStorage.set('analytics', 'optIn', date, false);
  expect(dataStorage.get('analytics')).toHaveProperty('optIn');

  dataStorage.delete('analytics', 'optIn');
  expect(dataStorage.get('analytics')).not.toHaveProperty('optIn');

  dataStorage.delete('analytics');
  expect(dataStorage.get('analytics')).toBeNull();

});

test("Call AJAX Function in AJAX-DataStorage", () => {
  let called = false;

  let ajaxUrl = 'example.com';
  let ajaxOptions = { opt1: 'test' };
  let additionalData = { data1: 'test2' };
  let dataStorage =  DataStorage({}, {
    ajaxUrl: ajaxUrl,
    ajaxOptions: ajaxOptions, 
    additionalData: additionalData,
    ajaxFunction: (url, data, options) => {
      called = {
        url,
        data,
        options
      };
  }});

  var date = new Date();
  dataStorage.set('analytics', 'optIn', date, false);

  var fullData = additionalData;
  additionalData.service = 'analytics';
  additionalData.key = 'optIn';
  additionalData.value = date;
  additionalData.update = false;
  additionalData.currentValue = false;

  expect(called).toBeTruthy();
  expect(called.url).toEqual(ajaxUrl);
  expect(called.data).toEqual(fullData);
  expect(called.options).toEqual(ajaxOptions);
});