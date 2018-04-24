import OptInOut from '../../src/main';
import DataStorage from '../../src/storages/data';

test("Optout of Service with optOut Mode", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('analytics')).toBe(true);

  obj.optOut('analytics');

  expect(obj.isAllowed('analytics')).toBe(false);
});

test("Optin to Service with optIn mode", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('facebook')).toBe(false);

  obj.optIn('facebook');

  expect(obj.isAllowed('facebook')).toBe(true);

});

test("Optin with wrong service", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(() => {
    obj.optIn('anyother');
  }).toThrow();
});

test("Optin to Service with optIn mode with specified storage", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('facebook', 'data')).toBe(false);

  obj.optIn('facebook', 'data');

  expect(obj.isAllowed('facebook', 'data')).toBe(true);

});

test("Optout of Service with optOut Mode with specified storage", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('analytics', 'data')).toBe(true);

  obj.optOut('analytics', 'data');

  expect(obj.isAllowed('analytics', 'data')).toBe(false);
});

test("Optin after opting out - with optIn service - checks date", () => { //TODO should check <= oder so? weil selbe zeit genau 
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  obj.optOut('facebook'); 

  expect(obj.isAllowed('facebook')).toBe(false);

  //wait so time of optin and optout is not the same
  setTimeout(() => {
    obj.optIn('facebook');

  expect(obj.isAllowed('facebook')).toBe(true);
  }, 1000); 

  
});

test("Optout after opting in - with optIn service - checks date", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  obj.optIn('facebook'); 
  
  expect(obj.isAllowed('facebook')).toBe(true);

  obj.optOut('facebook');

  expect(obj.isAllowed('facebook')).toBe(false);
});

test("Optin after opting out - with optOut service - checks date", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  obj.optOut('analytics'); 

  expect(obj.isAllowed('analytics')).toBe(false);

  obj.optIn('analytics');

  expect(obj.isAllowed('analytics')).toBe(true);
});

test("Optout after opting in - with optOut service - checks date", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('analytics')).toBe(true);

  obj.optIn('analytics'); 
  
  expect(obj.isAllowed('analytics')).toBe(true);

  //wait so date of optin and optout is not the same
  setTimeout(() => {
    obj.optOut('analytics');

    expect(obj.isAllowed('analytics')).toBe(false);
  }, 1000);

  
});

test("Optedin set to false explicitly", () => {
  let dataStorage =  DataStorage({
    facebook: { optedIn: false }
  });
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('facebook')).toBeFalsy();
});

test("Set doNotTrack but use default (no browser)", () => {
  let dataStorage =  DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    },
    doNotTrack: true
  });

  expect(obj.isAllowed('analytics')).toBe(true);
})
