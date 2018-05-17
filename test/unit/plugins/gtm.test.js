import OptInOut from '../../../src/main';
import GTMPlugin from '../../../src/plugins/gtm';
import DataStorage from '../../../src/storages/data';

test("Initialize GTM Plugin and call Trigger", () => {
  let pushedData = false;

  window.dataLayer = {
    push: (data) => {
      pushedData = data;
    },
  };

  let plugin = GTMPlugin({dataLayerKey: 'dataLayer', eventNamespace: 'optInOut'});

  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    },
    plugins: [ plugin ]
  });

  obj.optIn('facebook');
  expect(pushedData).toEqual({ event: 'optInOut.optIn', service: 'facebook'});

  obj.optOut('facebook');
  expect(pushedData).toEqual({ event: 'optInOut.optOut', service: 'facebook'});

});