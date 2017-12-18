import cookieHelper from './cookie.js';

const OptInOut = (() => {

    const DefaultOptions = {
        cookieConsent: {
            check: true, 
            expiration: new Date(new Date() +30), 
            path: '/', 
            domain: null, 
            secure: null,
            cookieKey: 'cookieConsent', 
            hook: null
        },
        tracking: {
            expiration: new Date(new Date() +30), 
            path: '/', 
            domain: null, 
            secure: null,
            cookieKey: 'tracking', 
            hook: null,
            tags: {},
        },
        googleTagManager: {
            use: false, 
            dataLayerKey: 'dataLayer',
        }
    }; 

    class OptInOut {
        constructor(options,hooks) {
            this._options = this._parseOptions(options); 
            this._hooks = hooks; 
        }

        _parseOptions(options) {
            return options; 
        }

        _getOption(key) {
            return this._options[key]; 
        }

        _pushDataLayer(data) {
            let tagManagerOptions = this._getOption('googleTagManager'); 
            if(!tagManagerOptions.use) {
                return null;
            }
            var dataLayer = window.hasOwnProperty(tagManagerOptions.dataLayerKey) ? window[tagManagerOptions.dataLayerKey] : false; 
            if(dataLayer) {
                return dataLayer.push(data); 
            }
        }

        _getDataLayer() {
            let tagManagerOptions = this._getOption('googleTagManager'); 
            if(!tagManagerOptions.use) {
                return null;
            }
            var dataLayer = window.hasOwnProperty(tagManagerOptions.dataLayerKey) ? window[tagManagerOptions.dataLayerKey] : false; 
            return dataLayer;
        }

        hasCookieConsent() {
            let options = this._getOption('cookieConsent'); 
            if(!this.options.cookieConsent.check) { //if no checking configured, return true default
                return true; 
            }

            let hasConsent = cookieHelper.hasItem(options.cookieKey); 
            if(options.hook) {
                hasConsent = options.hook(hasConsent); 
            }

            return hasConsent; 
        }

        setCookieConsent(val) {
            let options = this._getOption('cookieConsent'); 

            if(val) {
                return cookieHelper.setItem(
                    options.cookieKey, 
                    true,
                    options.expiration, 
                    options.path,  
                    options.domain,  
                    options.secure,  
                );
            } else {
                return cookieHelper.removeItem(options.cookieKey)
            }            
        }

        allowCookies() {
            
            let allowed = this.setCookieConsent(true); 

            let tagManagerOptions = this._getOption('googleTagManager'); 
            if(allowed && tagManagerOptions.use) {
                this._pushDataLayer({
                    'event': 'allowCookies',
                });
            }
        }

        disallowCookies() {
            
            let allowed = this.setCookieConsent(false,tag); 

            let tagManagerOptions = this._getOption('googleTagManager'); 
            if(allowed && tagManagerOptions.use) {
                this._pushDataLayer({
                    'event': 'disallowCoockies'
                });
            }
        }

        isTrackingAllowed(tag) {
            let options = this._getOption('tracking'); 
            let tagOptions = options.tags.hasOwnProperty(tag); 
            tagOptions = tagOptions ? tagOptions : options; 

            let isAllowed = cookieHelper.hasItem(tagOptions.cookieKey); 
            if(tagOptions.hook) {
                isAllowed = tagOptions.hook(isAllowed); 
            }

            return isAllowed; 
        }

        setTrackingAllowed(val,tag) {
            let options = this._getOption('tracking'); 
            let tagOptions = options.tags.hasOwnProperty(tag); 
            tagOptions = tagOptions ? tagOptions : options; 

            if(val) {
                return cookieHelper.setItem(
                    tagOptions.cookieKey, 
                    true,
                    tagOptions.expiration, 
                    tagOptions.path,  
                    tagOptions.domain,  
                    tagOptions.secure,  
                );
            } else {
                return cookieHelper.removeItem(tagOptions.cookieKey); 
            }
        }

        allowTracking(tag) {
            
            let allowed = this.setTrackingAllowed(true,tag); 

            let tagManagerOptions = this._getOption('googleTagManager'); 
            if(allowed && tagManagerOptions.use) {
                this._pushDataLayer({
                    'event': 'allowTracking', 
                    'allowTrackingTag': tag,
                });
            }
        }

        disallowTracking(tag) {
            
            let allowed = this.setTrackingAllowed(false,tag); 

            let tagManagerOptions = this._getOption('googleTagManager'); 
            if(allowed && tagManagerOptions.use) {
                this._pushDataLayer({
                    'event': 'disallowTracking', 
                    'disallowTrackingTag': tag,
                });
            }
        }
    }

    return OptInOut; 
})(); 

export default OptInOut; 

