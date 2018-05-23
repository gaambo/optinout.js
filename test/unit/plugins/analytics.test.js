import OptInOut from '../../../src/main';
import AnalyticsPlugins from '../../../src/plugins/analytics';
import DataStorage from '../../../src/storages/data';

test("Initialize Analytics Plugin and call Trigger", () => {

  let plugin = AnalyticsPlugins({propertyId: 'UA-XXXX-1'});

  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optIn' }
    },
    plugins: [ plugin ]
  });

  window['ga-disable-UA-XXXX-1'] = 'test';

  obj.optIn('analytics');
  expect(window['ga-disable-UA-XXXX-1']).toBeUndefined();

  obj.optOut('analytics');
  expect(window['ga-disable-UA-XXXX-1']).toBeTruthy();

});