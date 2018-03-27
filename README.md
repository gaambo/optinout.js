# OptInOut.js

A simple JavaScript library to manage opting in & out of tracking/marketing/mailing - in fact whatever you want to manage. This was specifically created for the EU GDPR. 
To get started, check out the documentation below. Examples & snippets are coming soon.
# Quick Start
## Install
You can download the [latest release here](https://gitlab.com/optinout/optinout.js/tags).  This includes the src & dist directory. 
## Load
### Static HTML
For usage in standard websites with best browser coverage we recommend including the `dist/optinout.js` or `dist/optinout.min.js`.
Just include the script via a standard script-tag in the header/footer: 
`<script src="path/to/optinout.js" ></script>`
## Usage
### Initialization
You have to initialize the library before using any of its methods: 

    OptInOut(); 
    
If using **jQuery** you can use: 

    $(document).ready(function(){
      OptInOut();
    });

This initializes the library with our default options & storages. Even if you do not want to customize the options you have to add your **services**: 

    OptInOut({
	  services: {
	    'facebook': {
	      mode: 'optIn',
		 }, 
		 'analytics: {
		   mode: 'optOut',
		 },
	  },
    });
### Methods
The most important methods the object (returned by the main initialization function) has are:

 - **optIn**: `optIn(serviceKey, storageKey = false)`
	- opts the user in to the service
	- if storageKey is given, it will be only set in this storage
 - **optOut**: `optOut(serviceKey, storageKey = false)`
	- opts the user out of the service
	- if storageKey is given, it will be only set in this storage
 - **isAllowed**: `isAllowed(serviceKey, storageKey = false)`
	- returns true or false wheather using this service is allowed

For quick reference and usage in tag managers the `OptInOut`-Function-Object also offers these three methods as "static" methods which get called on the current instance.

For further information about the options see the (documentation)[Documentation.md].

# Tutorials
## Server Side
See the (Snippets)[https://gitlab.com/optinout/optinout.js/snippets] for examples on how to check cookies, doNotTrack and query-strings in **PHP** on server side.

## Google Tag Manager (GTM)
You can include the library directly on your site or just paste the minified version in an custom HTML tag (surrounded by `<script></script>`).

Create a variable of type Custom JavaScript for each service you want to controll and set its code like so: 
```
function() {
  if(OptInOut !== undefined) {
    return OptInOut.isAllowed('facebook');
  }
}
```
This variable always has the value whether tracking for this service is allowed or not. You can use this in conditional triggers.

#### Exclude Trigger
You can create a new trigger of type Custom Event, then turn on matching by RegEx and set the event name to `.*`. Then filter the events for the variable created above containing `true` or `false`.

You can use this trigger as an exclude trigger with any other triggers/events.

#### Certain Trigger
You can create a certain trigger (e.g. pageview trigger) and filter it for the variable created above containing `true` or `false`.

# Source & Building
You can install this package with npm (coming soon) or by downloading the current release of this repository. You have to build the files yourself. We're using gulp & rollup for building the dist-files, which creates IIFE, UMD, CommonJS and ES modules.

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