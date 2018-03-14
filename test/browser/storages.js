import { ClientFunction } from 'testcafe'; 
import { default as createServer } from '../helper/server'; 

let server; 

fixture `Storages`
  .beforeEach((t) => {
    server = createServer();
  })
  .afterEach((t) => {
    server.close(); 
  })
  .page('http://localhost:8080/test/index.html'); 

test('Init Object', async t => {
  const initOptInOut = ClientFunction(() => {
    window.optouthandler = OptInOut({}); 
    return window.optouthandler; 
  }); 
  let obj = await initOptInOut({}); 
  await t.expect(obj).ok();
});

test('Set Cookie', async t => {
  const initOptInOut = ClientFunction(() => {
    var cookieAdapter = OptInOut.storageAdapters.cookieStorage();
    var obj = OptInOut({
      storages: {
        'cookie': cookieAdapter
      },
      services: {
        'facebook': {
          mode: 'optOut'
        }
      }
    }); 

    obj.optOut('facebook');
    return document.cookie;
  }); 
  
  let cookieData = await initOptInOut(); 
  await t
    .expect(cookieData).ok()
    .expect(decodeURIComponent(cookieData.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent('optInOut.facebook').replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"))).ok();
});

test('Get Cookie Date', async t => {
  const initOptInOut = ClientFunction(() => {
    var cookieAdapter = OptInOut.storageAdapters.cookieStorage();
    var obj = OptInOut({
      storages: {
        'cookie': cookieAdapter
      },
      services: {
        'facebook': {
          mode: 'optOut'
        }
      }
    }); 

    obj.optOut('facebook');
    return cookieAdapter.get('facebook');
  }); 
  
  let cookieData = await initOptInOut(); 
  await t
    .expect(cookieData).typeOf('object')
    .expect(Date.parse(cookieData.optedOut)).typeOf('number');
});