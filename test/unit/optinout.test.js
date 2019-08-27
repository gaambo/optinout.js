import OptInOut from '../../src/main';
import DataStorage from '../../src/storages/data';

test("isSet to be false by default", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isSet('analytics')).toBe(false);
});

test("Optout of Service with optOut Mode", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('analytics')).toBe(true);
  expect(obj.isSet('analytics')).toBe(false);

  obj.optOut('analytics');

  expect(obj.isAllowed('analytics')).toBe(false);
  expect(obj.isSet('analytics')).toBe(true);
});

test("Optin to Service with optIn mode", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('facebook')).toBe(false);
  expect(obj.isSet('facebook')).toBe(false);

  obj.optIn('facebook');

  expect(obj.isAllowed('facebook')).toBe(true);
  expect(obj.isSet('facebook')).toBe(true);

});

test("Optout to services with optIn mode", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('analytics')).toBe(false);
  expect(obj.isSet('analytics')).toBe(false);

  obj.optOut('analytics');

  expect(obj.isAllowed('analytics')).toBe(false);
  expect(obj.isSet('analytics')).toBe(true);

});

test("Optin with wrong service", () => {
  let dataStorage = DataStorage({});
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
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    }
  });

  expect(obj.isAllowed('facebook', 'data')).toBe(false);
  expect(obj.isSet('facebook', 'data')).toBe(false);

  obj.optIn('facebook', 'data');

  expect(obj.isAllowed('facebook', 'data')).toBe(true);
  expect(obj.isSet('facebook', 'data')).toBe(true);

});

test("Optout of Service with optOut Mode with specified storage", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('analytics', 'data')).toBe(true);
  expect(obj.isSet('analytics')).toBe(false);

  obj.optOut('analytics', 'data');

  expect(obj.isAllowed('analytics', 'data')).toBe(false);
  expect(obj.isSet('analytics')).toBe(true);
});

test("Optin after opting out - with optIn service - checks date", () => { //TODO should check <= oder so? weil selbe zeit genau 
  let dataStorage = DataStorage({});
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
  expect(obj.isSet('facebook')).toBe(true);

  //wait so time of optin and optout is not the same
  setTimeout(() => {
    obj.optIn('facebook');

    expect(obj.isAllowed('facebook')).toBe(true);
    expect(obj.isSet('facebook')).toBe(true);
  }, 1000);


});

test("Optout after opting in - with optIn service - checks date", () => {
  let dataStorage = DataStorage({});
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
  expect(obj.isSet('facebook')).toBe(true);

  //wait so date of optin and optout is not the same
  setTimeout(() => {
    obj.optOut('facebook');

    expect(obj.isAllowed('facebook')).toBe(false);
    expect(obj.isSet('facebook')).toBe(true);
  }, 1000);
});

test("Optin after opting out - with optOut service - checks date", () => {
  let dataStorage = DataStorage({});
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
  expect(obj.isSet('analytics')).toBe(true);

  //wait so date of optin and optout is not the same
  setTimeout(() => {
    obj.optIn('analytics');

    expect(obj.isAllowed('analytics')).toBe(true);
    expect(obj.isSet('analytics')).toBe(true);
  }, 1000);
});

test("Optout after opting in - with optOut service - checks date", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      analytics: { mode: 'optOut' }
    }
  });

  expect(obj.isAllowed('analytics')).toBe(true);
  expect(obj.isSet('analytics')).toBe(false);

  obj.optIn('analytics');

  expect(obj.isAllowed('analytics')).toBe(true);
  expect(obj.isSet('analytics')).toBe(true);

  //wait so date of optin and optout is not the same
  setTimeout(() => {
    obj.optOut('analytics');

    expect(obj.isAllowed('analytics')).toBe(false);
    expect(obj.isSet('analytics')).toBe(true);
  }, 1000);


});

test("Optedin set to false explicitly", () => {
  let dataStorage = DataStorage({
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
  expect(obj.isSet('facebook')).toBe(true);
});

test("Set doNotTrack but use default (no browser)", () => {
  let dataStorage = DataStorage({});
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
  expect(obj.isSet('analytics')).toBe(false);
});

test("Check Status Message - OptIn and OptOut", () => {
  let dataStorage = DataStorage({});
  let obj = OptInOut({
    storages: {
      data: dataStorage,
    },
    services: {
      facebook: { mode: 'optIn' }
    },
    language: {
      status: {
        undefined: 'undefined',
        optedIn: 'opted in',
        optedOut: 'opted out',
      },
    },
  });

  expect(obj.getStatus('facebook')).toEqual(['undefined', null]);

  obj.optIn('facebook');
  expect(obj.getStatus('facebook')).toEqual('opted in');

  //wait so time of optin and optout is not the same
  setTimeout(() => {
    obj.optOut('facebook');
    expect(obj.getStatus('facebook')).toEqual('opted out');
  }, 1000);

});
