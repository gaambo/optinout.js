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

test('Init Object', async t => {
  const initOptInOut = ClientFunction(() => {
    window.optouthandler = OptInOut({}); 
    return window.optouthandler; 
  }); 
  let obj = await initOptInOut({}); 
  await t.expect(obj).ok();
});