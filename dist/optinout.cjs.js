'use strict';

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
|*|	* docCookies.keys()
|*|
\*/

var docCookies = {
	getItem: function getItem(sKey) {
		if (!sKey) {
			return null;
		}
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	setItem: function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
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
					sExpires = "; expires=" + vEnd;
					break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
					break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		return true;
	},
	removeItem: function removeItem(sKey, sPath, sDomain) {
		if (!this.hasItem(sKey)) {
			return false;
		}
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		return true;
	},
	hasItem: function hasItem(sKey) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}
		return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
	},
	keys: function keys() {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
		}
		return aKeys;
	}
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OptInOut = function () {

    var OptInOut = function () {
        function OptInOut(options, hooks) {
            _classCallCheck(this, OptInOut);

            this._options = this._parseOptions(options);
            this._hooks = hooks;
        }

        _createClass(OptInOut, [{
            key: '_parseOptions',
            value: function _parseOptions(options) {
                return options;
            }
        }, {
            key: '_getOption',
            value: function _getOption(key) {
                return this._options[key];
            }
        }, {
            key: '_pushDataLayer',
            value: function _pushDataLayer(data) {
                var tagManagerOptions = this._getOption('googleTagManager');
                if (!tagManagerOptions.use) {
                    return null;
                }
                var dataLayer = window.hasOwnProperty(tagManagerOptions.dataLayerKey) ? window[tagManagerOptions.dataLayerKey] : false;
                if (dataLayer) {
                    return dataLayer.push(data);
                }
            }
        }, {
            key: '_getDataLayer',
            value: function _getDataLayer() {
                var tagManagerOptions = this._getOption('googleTagManager');
                if (!tagManagerOptions.use) {
                    return null;
                }
                var dataLayer = window.hasOwnProperty(tagManagerOptions.dataLayerKey) ? window[tagManagerOptions.dataLayerKey] : false;
                return dataLayer;
            }
        }, {
            key: 'hasCookieConsent',
            value: function hasCookieConsent() {
                var options = this._getOption('cookieConsent');
                if (!this.options.cookieConsent.check) {
                    //if no checking configured, return true default
                    return true;
                }

                var hasConsent = docCookies.hasItem(options.cookieKey);
                if (options.hook) {
                    hasConsent = options.hook(hasConsent);
                }

                return hasConsent;
            }
        }, {
            key: 'setCookieConsent',
            value: function setCookieConsent(val) {
                var options = this._getOption('cookieConsent');

                if (val) {
                    return docCookies.setItem(options.cookieKey, true, options.expiration, options.path, options.domain, options.secure);
                } else {
                    return docCookies.removeItem(options.cookieKey);
                }
            }
        }, {
            key: 'allowCookies',
            value: function allowCookies() {

                var allowed = this.setCookieConsent(true);

                var tagManagerOptions = this._getOption('googleTagManager');
                if (allowed && tagManagerOptions.use) {
                    this._pushDataLayer({
                        'event': 'allowCookies'
                    });
                }
            }
        }, {
            key: 'disallowCookies',
            value: function disallowCookies() {

                var allowed = this.setCookieConsent(false, tag);

                var tagManagerOptions = this._getOption('googleTagManager');
                if (allowed && tagManagerOptions.use) {
                    this._pushDataLayer({
                        'event': 'disallowCoockies'
                    });
                }
            }
        }, {
            key: 'isTrackingAllowed',
            value: function isTrackingAllowed(tag) {
                var options = this._getOption('tracking');
                var tagOptions = options.tags.hasOwnProperty(tag);
                tagOptions = tagOptions ? tagOptions : options;

                var isAllowed = docCookies.hasItem(tagOptions.cookieKey);
                if (tagOptions.hook) {
                    isAllowed = tagOptions.hook(isAllowed);
                }

                return isAllowed;
            }
        }, {
            key: 'setTrackingAllowed',
            value: function setTrackingAllowed(val, tag) {
                var options = this._getOption('tracking');
                var tagOptions = options.tags.hasOwnProperty(tag);
                tagOptions = tagOptions ? tagOptions : options;

                if (val) {
                    return docCookies.setItem(tagOptions.cookieKey, true, tagOptions.expiration, tagOptions.path, tagOptions.domain, tagOptions.secure);
                } else {
                    return docCookies.removeItem(tagOptions.cookieKey);
                }
            }
        }, {
            key: 'allowTracking',
            value: function allowTracking(tag) {

                var allowed = this.setTrackingAllowed(true, tag);

                var tagManagerOptions = this._getOption('googleTagManager');
                if (allowed && tagManagerOptions.use) {
                    this._pushDataLayer({
                        'event': 'allowTracking',
                        'allowTrackingTag': tag
                    });
                }
            }
        }, {
            key: 'disallowTracking',
            value: function disallowTracking(tag) {

                var allowed = this.setTrackingAllowed(false, tag);

                var tagManagerOptions = this._getOption('googleTagManager');
                if (allowed && tagManagerOptions.use) {
                    this._pushDataLayer({
                        'event': 'disallowTracking',
                        'disallowTrackingTag': tag
                    });
                }
            }
        }]);

        return OptInOut;
    }();

    return OptInOut;
}();

module.exports = OptInOut;
