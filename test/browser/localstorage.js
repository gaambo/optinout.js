import { ClientFunction } from 'testcafe';
import { default as createServer } from '../helper/server'; 
import { getLocalStorageItem } from '../helper/clientFunctions'; 

let server; 

fixture `LocalStorage`
  .beforeEach((t) => {
    server = createServer();
  })
  .afterEach((t) => {
    server.close(); 
  })
  .page('http://localhost:8080/test/index.html'); 


test('LocalStorage Initialize OptOut - OptOut - Reload - Delete', async t => {
  const initOptInOut = ClientFunction(() => {
    window.storageAdapter = OptInOut.storageAdapters.localStorage();
    window.optinoptouthandler = OptInOut({
      storages: {
        'local': window.storageAdapter
      },
      services: {
        'facebook': {
          mode: 'optOut'
        }
      }
    }); 
  }); 

  let storageRaw, storageData, allowed; 

  //0. RUN INIT
  await initOptInOut(); 

  //1. CHECK BEFORE DOING ANYTHING = DEFAULT 
  //seems not to work with testcafe
  // //get cookie namespaced string  & check its nulL/nothing set
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut')); 

  // await t
  //   .expect(storageRaw).notOk();

  //check cookie data handler
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));

  await t.
    expect(storageData).notOk(); 

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.
    expect(allowed).eql(true); 

  //2. OPTOUT
  await t.eval(() => window.optinoptouthandler.optOut('facebook'));
  //seems not to work with testcafe
  // //check document cookie is set 
  // storageRaw = await t.eval(() => {
  //   return localStorage['optInOut'];
  // });
  // storageRaw = await getLocalStorageItem('optInOut');
  // await t
  //   .expect(storageRaw).ok()
  //   .expect(storageRaw['facebook']).ok();

  //check optedout date is set
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));
  
  await t
    .expect(storageData).typeOf('object')
    .expect(Date.parse(storageData.optedOut)).typeOf('number');

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.expect(allowed).eql(false);

  //3. RELOAD PAGE
  await t.eval(() => location.reload(true));

  //init handler again
  await initOptInOut(); 

  //seems not to work with testcafe
  // //check document cookie is set 
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut'));
  // await t
  //   .expect(storageRaw).ok()
  //   .expect(storageRaw['facebook']).ok(); 

  //check optedout date is set
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));
  
  await t
    .expect(storageData).typeOf('object')
    .expect(Date.parse(storageData.optedOut)).typeOf('number');

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.expect(allowed).eql(false);

  //4. DELETE DATA
  await t.eval(() => window.storageAdapter.delete('facebook'));

  //seems not to work with testcafe
  // //check cookie is not set 
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut')); 

  // await t
  //   .expect(storageRaw).notOk()
  //   .expect(storageRaw['facebook']).notOk(); 

  //check cookie data handler
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));

  await t.
    expect(storageData).notOk(); 

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.
    expect(allowed).eql(true); 
});

test('LocalStorage Initialize OptIn - OptIn - Reload - Delete', async t => {
  const initOptInOut = ClientFunction(() => {
    window.storageAdapter = OptInOut.storageAdapters.localStorage();
    window.optinoptouthandler = OptInOut({
      storages: {
        'local': window.storageAdapter
      },
      services: {
        'facebook': {
          mode: 'optIn'
        }
      }
    }); 
  }); 

  let storageRaw, storageData, allowed; 

  //0. RUN INIT
  await initOptInOut(); 

  //1. CHECK BEFORE DOING ANYTHING = DEFAULT 

  //seems not to work with testcafe
  // //get cookie namespaced string  & check its nulL/nothing set
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut')); 

  // await t
  //   .expect(storageRaw).notOk()
  //   .expect(storageRaw['facebook']).notOk();

  //check cookie data handler
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));

  await t.
    expect(storageData).notOk(); 

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.
    expect(allowed).eql(false); 

  //2. OPTIN
  await t.eval(() => {
    debugger; 
    window.optinoptouthandler.optIn('facebook')
  });
  //seems not to work with testcafe
  // //check document cookie is set 
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut'));
  // await t
  //   .expect(storageRaw).ok()
  //   .expect(storageRaw['facebook']).ok(); 

  //check optedIn date is set
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));
  
  await t
    .expect(storageData).typeOf('object')
    .expect(Date.parse(storageData.optedIn)).typeOf('number');

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.expect(allowed).eql(true);

  //3. RELOAD PAGE
  await t.eval(() => location.reload(true));

  //init handler again
  await initOptInOut(); 

  //seems not to work with testcafe
  // // check document cookie is set 
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut'));
  // await t
  //   .expect(storageRaw).ok()
  //   .expect(storageRaw['facebook']).ok(); 

  //check optedIn date is set
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));
  
  await t
    .expect(storageData).typeOf('object')
    .expect(Date.parse(storageData.optedIn)).typeOf('number');

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.expect(allowed).eql(true);

  //4. DELETE DATA
  await t.eval(() => window.storageAdapter.delete('facebook'));

  //seems not to work with testcafe
  // //check cookie is not set 
  // storageRaw = await t.eval(() => window.localStorage.getItem('optInOut')); 

  // await t
  //   .expect(storageRaw).notOk()
  //   .expect(storageRaw['facebook']).notOk(); 

  //check cookie data handler
  storageData = await t.eval(() => window.storageAdapter.get('facebook'));

  await t.
    expect(storageData).notOk(); 

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'local'));

  await t.
    expect(allowed).eql(false); 
});