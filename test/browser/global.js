import { ClientFunction } from 'testcafe'; 
import { default as createServer } from '../helper/server'; 

let server; 

fixture `Init`
  .beforeEach((t) => {
    server = createServer();
  })
  .afterEach((t) => {
    server.close(); 
  })
  .page('http://localhost:8080/test/index.html'); 

test('Init Global Instance', async t => {
  const initOptInOut = ClientFunction(() => {
    OptInOut({
      storages: {
        data: OptInOut.storageAdapters.dataStorage({})
      },
      services: {
        facebook: {
          mode: 'optIn'
        }
      }
    }); 
    return OptInOut.instance; 
  }); 
  let obj = await initOptInOut({}); 
  await t.expect(obj).ok();
});

test('Global Instance OptOut date', async t => {
  const initOptInOut = ClientFunction(() => {
    let dataStorage = OptInOut.storageAdapters.dataStorage({});
    OptInOut({
      storages: {
        data: dataStorage
      },
      services: {
        facebook: {
          mode: 'optOut'
        }
      }
    }); 
    OptInOut.optOut('facebook');
    return dataStorage.get('facebook');
  }); 
  let storageData = await initOptInOut({}); 
  await t.expect(storageData).typeOf('object')
    .expect(Date.parse(storageData.optedOut)).typeOf('number');
});

test('Global Instance OptIn date', async t => {
  const initOptInOut = ClientFunction(() => {
    let dataStorage = OptInOut.storageAdapters.dataStorage({});
    OptInOut({
      storages: {
        data: dataStorage
      },
      services: {
        facebook: {
          mode: 'optIn'
        }
      }
    }); 
    OptInOut.optIn('facebook');
    return dataStorage.get('facebook');
  }); 
  let storageData = await initOptInOut({}); 
  await t.expect(storageData).typeOf('object')
    .expect(Date.parse(storageData.optedOut)).typeOf('number');
});

test('Global Instance OptIn isAllowed', async t => {
  const initOptInOut = ClientFunction(() => {
    let dataStorage = OptInOut.storageAdapters.dataStorage({});
    OptInOut({
      storages: {
        data: dataStorage
      },
      services: {
        facebook: {
          mode: 'optIn'
        }
      }
    }); 
    OptInOut.optIn('facebook');
    return OptInOut.isAllowed('facebook','data');
  }); 
  let allowed = await initOptInOut({}); 
  await t.expect(allowed).ok();
});

test('Global Instance OptOut isAllowed', async t => {
  const initOptInOut = ClientFunction(() => {
    let dataStorage = OptInOut.storageAdapters.dataStorage({});
    OptInOut({
      storages: {
        data: dataStorage
      },
      services: {
        facebook: {
          mode: 'optOut'
        }
      }
    }); 
    OptInOut.optOut('facebook');
    return OptInOut.isAllowed('facebook','data');
  }); 
  let allowed = await initOptInOut({}); 
  await t.expect(allowed).ok();
});