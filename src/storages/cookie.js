/*\
|*|
|*|	:: cookies.js ::
|*|
|*|	A complete cookies reader/writer framework with full unicode support.
|*|
|*|	Revision #3 - July 13th, 2017
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/cookies.js
|*|
|*|	This framework is released under the GNU Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|	Syntaxes:
|*|
|*|	* docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|	* docCookies.getItem(name)
|*|	* docCookies.removeItem(name[, path[, domain]])
|*|	* docCookies.hasItem(name)
|*|
\*/

const Storage = (userOptions) => {
  const defaultOptions = {
    namespace: 'optInOut',
    expiration: Infinity,
    domain: false,
    path: false,
    secure: false,
  };

  let options = Object.assign({}, defaultOptions, userOptions);


  let getExpirationString = () => {
    let expires; 
    switch (options.expiration.constructor) {
      case Number:
        expires = options.expiration === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + options.expiration;
        /*
        Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
        version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
        the end parameter might not work as expected. A possible solution might be to convert the the
        relative time to an absolute time. For instance, replacing the previous line with:
        */
        /*
        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
        */
        break;
      case String:
        expires = "; expires=" + options.expiration;
        break;
      case Date:
        expires = "; expires=" + options.expiration.toUTCString();
        break;
    }

    return expires;
  }

  let getKey = (key) => {
    return options.namespace + '.' + key; 
  }

  let getItem = function (service,key) {
    if (!service) { return null; }

    let value = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(getKey(service)).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;

    let valueJson = JSON.parse(value); 
    if(key) {
      return valueJson[key] || null; 
    } else {
      return valueJson || null; 
    }
  };

  let setItem = function (service,key,value,update) {
    if (!service || /^(?:expires|max\-age|path|domain|secure)$/i.test(service)) { return false; }
    let expires = getExpirationString();

    let writeValue = (k,v) => {
      document.cookie = encodeURIComponent(k) + "=" + encodeURIComponent(JSON.stringify(v)) + expires + (options.domain ? "; domain=" + options.domain : "") + (options.Path ? "; path=" + options.Path : "") + (options.secure ? "; secure" : "");
    };
    
    let saveValue;

    if(update) {
      let newData = { [key]: value };
      let currentData = getItem(service); 
      saveValue = Object.assign({}, currentData, newData); 
    } else {
      saveValue = { [key]: value }; 
    }

    writeValue(getKey(service),saveValue);
    
    return true;
  };

  let removeItem = function (key) {
    if (!hasItem(key)) { return false; }
    document.cookie = encodeURIComponent(getKey(key)) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (options.domain ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "");
    return true;
  };

  let hasItem = function (key) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(getKey(key)).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  };

  return {
    get: (service,key) => {
      return getItem(service,key);
    },
    set: (service,key,value,update) => {
      return setItem(service,key,value,update);
    },
    delete: (service) => {
      return removeItem(service);
    }
  };

}


export default Storage;