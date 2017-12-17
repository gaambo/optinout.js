import cookieHelper from './cookie.js';

const OptInOut = (() => {
    class OptInOut {
        constructor(options,hooks) {
            this._options = this._getOptions(options); 
            this._hooks = hooks; 
        }

        _getOptions(options) {
            return options; 
        }
    }

    return OptInOut; 
})(); 

export default OptInOut; 

