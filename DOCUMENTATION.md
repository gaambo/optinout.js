# Documentation
## Options
### services
*Optional* but should be used, makes no sense otherwise
Type: `object` - string keys with object as value
Default: `{}`

The services you want to use to let users optIn/optOut to. Examples: Facebook Pixel, Google Analytics,...
Each service is a **string key with an object value** which holds other service options, current used options are: 

 - `mode`: 
	 - **Required**
	 - Type: `string`
	 - Allowed values: `'optIn'`, `'optOut'`
 - `default`:
	 - *Optional*
	 - Type: `boolean`
	 - The default value for allowed

The string key is used for opting user in & out and for checking if it's allowed.

**Example**
```javascript
OptInOut({
  services: {
    'facebook': {
      mode: 'optIn',
    }, 
    'analytics': {
      mode: 'optOut',
    },
  },
});
```
### storages
*Optional*
Type: `object` - string keys with storage objects as value  
Default:
```javascript
{
  cookie:  cookieStorage(),
  localStorage:  localStorage(),
  dataStorage:  dataStorage(),
}
```
The storages to save the optIn & optOut information. The order is important: It defines the priority/order in which the storages are asked for information when checking if something is allowed. 
For further information about the storage API and the default used storages see storages [below](#storages-1).
### plugins
*Optional*
Type: `array` of plugin objects  
Default: `[]`

Plugins which can listen for events triggered by this library or (possible in the future) can change how certain methods work. 
For further information see the plugins api [below](#plugins-1).
### doNotTrack
Type: `boolean`  
Default: `false`

Defines if the browsers DoNotTrack option should be used. This will only be used if no optIn/optOut data is explicitly set (== as the default). 
## Storages
### Included storage adapters
This library includes storage adapters for saving/getting data from cookies, the localStorage and a simple array.
#### Cookie Storage
**Callable** via: 
 - Browser: `OptInOut.storageAdapters.cookieStorage(options)`
 - Module: `src/storages/cookie`

**Options**:
 - namespace:
	 - Type: `string`
	 - Default: `'optInOut'`
	 - Defines the namespace used for cookies
 - expiration:
	 - Type: `Date`
	 - Default: `Infinity`
	 - Expiration Date of cookies
 - domain: 
	 - Type: `string`
	 - Default: `false` - does not set value
 - path: 
	 - Type: `string`
	 - Default: `false` - does not set value
- secure: 
	 - Type: `bolean`
	 - Default: `false`
	 - Whether HTTPS/SSL is used and the cookie should be set to secure

#### Local Storage
**Callable** via: 
 - Browser: `OptInOut.storageAdapters.localStorage(data)`
 - Module: `src/storages/localStorage`

**Options**:
 - namespace:
	 - Type: `string`
	 - Default: `'optInOut'`
	 - Defines the namespace used for localStorage

#### Data Storage
**Callable** via: 
 - Browser: `OptInOut.storageAdapters.dataStorage(data)`
 - Module: `src/storages/data`

**Data** is the array which is used to get values from and set values to. 
Should have a structure like the following: 
 - serviceKey
	 - optedIn: Date
	 - optedOut: Date

**Example Data**:
```javascript
{
  'facebook': {
    'optedIn': '2018-03-25',
  },
  'analytics': {
    'optedOut': new Date('2018-03-25'),
  },
}
```
### API
You can easily develop custom storage adapters (e.g. for data coming from server, ajax,...). Storage Adapters must provide the following public callable methods: 

 - **get**:`get(service, key)`
	 - `key` is `optedIn` or `optedOut`
	 - returns `boolean` or `null`
 - **set**: `set(service, key, value, update)`
	 - `key` is `optedIn` or `optedOut`
	 - `value` will be the Date
	 - `update` determines if it should update the current data (= merge) or overwrite all data. True means merging.
	 - returns `boolean` if was set successfully

## Plugins
### Includes Plugins
The library comes shipped with usefull plugins to handle opting in and out via buttons/links and using Google Tag Manager.
#### Link Helper
**Callable** via: 
 - Browser: `OptInOut.plugins.linkPlugin(options)`
 - Module: `src/plugins/link`

**Options**:

 - optInClickSelector:
	 - Type: `string`
	 - Default: `'.optInOut-optIn'`
	 - The CSS selector for the optIn button
 - optOutClickSelector:
	 - Type: `string`
	 - Defualt: `'.optInOut-optOut'`
	 - The CSS selector for the optOut button

The DOM element can/must have the following **data attributes**:

 - service: 
	 - required
	 - service to optin/optout
 - storage
	 - optional
	 - special storage in which this value should be set

#### Google Tag Manager
**Callable** via: 
 - Browser: `OptInOut.plugins.gtmPlugin(options)`
 - Module: `src/plugins/gtm`

**Options**:

 - dataLayerKey:
	 - Type: `string`
	 - Default: `'dataLayer'`
	 - The name of the dataLayer variable defined in the GTM configuration
 - eventNameSpace:
	 - Type: `string` - `false` if should not be used
	 - Default: `false`
	 - This gets prepend to all events pushed to dataLayer (e.g.: `namyNamespace.optIn` instead of `optIn`)

At the moment this plugin just sends the optIn and optOut events to GTM. For information how to get the optIn & optOut status via GTM and use it to enable tags see the GTM Tutorial [below](#google-tag-manager-gtm). 

#### Reload
**Callable** via: 
 - Browser: `OptInOut.plugins.reloadPLugin()`
 - Module: `src/plugins/reload`

Reloads the page after opting in or out. This is useful when you want to reload tracking scripts. You should therefore check if the user has opted in/out on the server. An alternative is to add the tracking scripts dynamically via javascript.

### API
Plugins need to define a public callable `init` method which will be called by the library upon intialisation. The init method will get a reference to the library and can subscribe to events via the `on` method like so: 
```javascript
const  init  = (optInOut) => {
  optInOut.on('optIn', eventCallback);
  optInOut.on('optOut', eventCallback);
};
```
Event callbacks get passed two arguments:

 - `data`: an object with all the data passed from the triggering method
 - `event`: the name of the event

### Events 
The following events are triggered & published by the library: 

 - `optIn`: 
	 - Arguments: 
		 - service: the service key
		 - storage: the storage key
		 - date: the date set
 -  `optOut`: 
	 - Arguments: 
		 - service: the service key
		 - storage: the storage key
		 - date: the date set

# Source & Building
You can install this package with [npm](https://www.npmjs.com/package/optinout.js) or by downloading the [latest release](https://gitlab.com/optinout/optinout.js/-/jobs/artifacts/master/download?job=publish) of this repository. You have to build the files yourself. We're using gulp & rollup for building the dist-files, which creates IIFE, UMD, CommonJS and ES modules.

The following **gulp tasks** are available: 

 - `default` is the build task
 - `build` cleans the dist directory and builds & minifies the dist-files
 - `rollup` creates the dist module files via rollup
 - `minify` minifies the files in dist directory

The following **npm scripts** are available: 

 - `build` runs `gulp build`
 - `lint` runs eslint on source directory
 - `test` runs `unit-test`
 - `unit-test` runs jest unit-tests
 - `browser-test` runs testcafe browser-tests
 - `test-server` starts a simple http server serving a basic html file with the library included for testing
 - `postversion` runs `git push --follow-tags` for pushing tags to git after running npm version