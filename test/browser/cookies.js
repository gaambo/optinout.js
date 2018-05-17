import { ClientFunction } from 'testcafe'; 
import { default as createServer } from '../helper/server'; 

let server; 

fixture `Cookies`
  .beforeEach((t) => {
    server = createServer();
  })
  .afterEach((t) => {
    server.close(); 
  })
  .page('http://localhost:8080/test/index.html'); 


test('CookieStorage Initialize OptOut - OptOut - Reload - Delete', async t => {
  const initOptInOut = ClientFunction(() => {
    window.cookieAdapter = OptInOut.storageAdapters.cookieStorage();
    debugger;
    window.optinoptouthandler = OptInOut({
      storages: {
        'cookie': window.cookieAdapter
      },
      services: {
        'facebook': {
          mode: 'optOut'
        }
      }
    }); 
  }); 

  const getCookie = (data) => {
    return decodeURIComponent(data.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent('optInOut.facebook').replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"));
  }; 

  let cookie, cookieData, allowed; 

  //0. RUN INIT
  await initOptInOut(); 

  //1. CHECK BEFORE DOING ANYTHING = DEFAULT 
  //get cookie namespaced string  & check its nulL/nothing set
  cookie = await t.eval(() => document.cookie); 

  await t.
    expect(getCookie(cookie)).notOk(); 

  //check cookie data handler
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));

  await t.
    expect(cookieData).notOk(); 

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.
    expect(allowed).eql(true); 

  //2. OPTOUT
  await t.eval(() => window.optinoptouthandler.optOut('facebook'));
  //check document cookie is set 
  cookie = await t.eval(() => document.cookie);
  await t
    .expect(getCookie(cookie)).ok(); 

  //check optedout date is set
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));
  
  await t
    .expect(cookieData).typeOf('object')
    .expect(Date.parse(cookieData.optedOut)).typeOf('number');

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.expect(allowed).eql(false);

  //3. RELOAD PAGE
  await t.eval(() => location.reload(true));

  //init handler again
  await initOptInOut(); 

  //check document cookie is set 
  cookie = await t.eval(() => document.cookie);
  await t
    .expect(getCookie(cookie)).ok(); 

  //check optedout date is set
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));
  
  await t
    .expect(cookieData).typeOf('object')
    .expect(Date.parse(cookieData.optedOut)).typeOf('number');

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.expect(allowed).eql(false);

  //4. DELETE DATA
  await t.eval(() => window.cookieAdapter.delete('facebook'));

  //check cookie is not set 
  cookie = await t.eval(() => document.cookie); 

  await t.
    expect(getCookie(cookie)).notOk(); 

  //check cookie data handler
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));

  await t.
    expect(cookieData).notOk(); 

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.
    expect(allowed).eql(true); 
});

test('CookieStorage Initialize OptIn - OptIn - Reload - Delete', async t => {
  const initOptInOut = ClientFunction(() => {
    window.cookieAdapter = OptInOut.storageAdapters.cookieStorage();
    window.optinoptouthandler = OptInOut({
      storages: {
        'cookie': window.cookieAdapter
      },
      services: {
        'facebook': {
          mode: 'optIn'
        }
      }
    }); 
  }); 

  const getCookie = (data) => {
    return decodeURIComponent(data.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent('optInOut.facebook').replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"));
  }; 

  let cookie, cookieData, allowed; 

  //0. RUN INIT
  await initOptInOut(); 

  //1. CHECK BEFORE DOING ANYTHING = DEFAULT 
  //get cookie namespaced string  & check its nulL/nothing set
  cookie = await t.eval(() => document.cookie); 

  await t.
    expect(getCookie(cookie)).notOk(); 

  //check cookie data handler
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));

  await t.
    expect(cookieData).notOk(); 

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.
    expect(allowed).eql(false); 

  //2. OPTIN
  await t.eval(() => window.optinoptouthandler.optIn('facebook'));
  //check document cookie is set 
  cookie = await t.eval(() => document.cookie);
  await t
    .expect(getCookie(cookie)).ok(); 

  //check optedin date is set
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));
  
  await t
    .expect(cookieData).typeOf('object')
    .expect(Date.parse(cookieData.optedIn)).typeOf('number');

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.expect(allowed).eql(true);

  //3. RELOAD PAGE
  await t.eval(() => location.reload(true));

  //init handler again
  await initOptInOut(); 

  //check document cookie is set 
  cookie = await t.eval(() => document.cookie);
  await t
    .expect(getCookie(cookie)).ok(); 

  //check optedout date is set
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));
  
  await t
    .expect(cookieData).typeOf('object')
    .expect(Date.parse(cookieData.optedIn)).typeOf('number');

  //check is allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.expect(allowed).eql(true);

  //4. DELETE DATA
  await t.eval(() => window.cookieAdapter.delete('facebook'));

  //check cookie is not set 
  cookie = await t.eval(() => document.cookie); 

  await t.
    expect(getCookie(cookie)).notOk(); 

  //check cookie data handler
  cookieData = await t.eval(() => window.cookieAdapter.get('facebook'));

  await t.
    expect(cookieData).notOk(); 

  //check is not allowed
  allowed = await t.eval(() => window.optinoptouthandler.isAllowed('facebook', 'cookie'));

  await t.
    expect(allowed).eql(false); 
});

