import CookieStorage from '../../../src/storages/cookie';

test("Set and Get Data in CookieStorage", () => {
  // global.document = { cookie: cookieMock }; //use cookie mock 

  let cookieStorage = CookieStorage({});

  var date = new Date();
  cookieStorage.set('analytics', 'optIn', date, false);
  expect(cookieStorage.get('analytics')).toHaveProperty('optIn');
  expect(cookieStorage.get('analytics', 'optIn')).toEqual(date.toISOString());

  expect(cookieStorage.get(false)).toBeFalsy();
  // expect(cookieStorage.get('expires=')).toBeFalsy();

  var newDate = new Date('2000-06-01');
  cookieStorage.set('analytics', 'optIn', newDate, true); //try updating
  expect(cookieStorage.get('analytics', 'optIn')).toEqual(newDate.toISOString());
});

test("Set and Remove CookieStorage", () => {
  // global.document = { cookie: cookieMock }; //use cookie mock 
  let cookieStorage = CookieStorage({});

  var date = new Date();
  cookieStorage.set('analytics', 'optIn', date, false);
  expect(cookieStorage.get('analytics')).toHaveProperty('optIn');

  cookieStorage.delete('analytics', 'optIn');
  expect(cookieStorage.get('analytics')).not.toHaveProperty('optIn');

  cookieStorage.delete('analytics');
  expect(cookieStorage.get('analytics')).toBeNull();

});

test("Test different Expiration-Date Types in CookieStorage", () => {
  var _cookie = document.cookie;
  document.__defineSetter__("cookie", function(the_cookie) {_cookie=the_cookie;} );
  document.__defineGetter__("cookie", function() {return _cookie;} );

  var optInDate = new Date();

  let cookieStorageInfinity = CookieStorage({ expiration: Infinity });
  cookieStorageInfinity.set('analytics', 'optIn', optInDate, false);
  expect(_cookie).toMatch('expires=Fri, 31 Dec 9999 23:59:59 GMT');

  let cookieStorageAge = CookieStorage({ expiration: 5 });
  cookieStorageAge.set('analytics', 'optIn', optInDate, false);
  expect(_cookie).toMatch('max-age=5');

  let cookieStorageString = CookieStorage({ expiration: optInDate.toUTCString() });
  cookieStorageString.set('analytics', 'optIn', optInDate, false);
  expect(_cookie).toMatch('expires=' + optInDate.toUTCString());

  let cookieStorageDate = CookieStorage({ expiration: optInDate });
  cookieStorageDate.set('analytics', 'optIn', optInDate, false);
  expect(_cookie).toMatch('expires=' + optInDate.toUTCString());

  let cookieStorageAny = CookieStorage({ expiration: { test: false } });
  cookieStorageAny.set('analytics', 'optIn', optInDate, false);
  expect(_cookie).toMatch(/(?!expires=)$/);
});