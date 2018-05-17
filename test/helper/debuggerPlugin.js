const Debug = {
  init: function(lib) {
      lib.on('optIn', function(data) { console.log(data) });
      lib.on('optOut', function(data) { console.log(data) });
  },
};

export default Debug;