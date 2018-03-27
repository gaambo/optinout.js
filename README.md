# OptInOut.js

A simple JavaScript library to manage opting in & out of tracking/marketing/mailing - in fact whatever you want to manage. This was specifically created for the EU GDPR. 
To get started, check out the quick start below, the [documentation](DOCUMENTATION.md) or the examples in the `examples` directory.
# Quick Start
## Install
You can download the [latest release here](https://gitlab.com/optinout/optinout.js/-/jobs/artifacts/master/download?job=publish).  This includes the src & dist directory. 

There's also a [npm package](https://www.npmjs.com/package/optinout.js);

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

For further information about the options see the [documentation](Documentation.md).

# Tutorials
# Ideas 
You can use this library not only for opting in and out of tracking scripts but also for other things: 
	- Embedding YouTube videos
	- Embedding Google Maps
 
## Server Side
See the [Snippets](https://gitlab.com/optinout/optinout.js/snippets) for examples on how to check cookies, doNotTrack and query-strings in **PHP** on server side.

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

# Legal Notice
We will never give any legal (binding) advice on how to use tracking, scripts and embed on your page or other information regarding privacy settings on our page.
You should see **OptInOut** as a tool to execute the privacy settings you need to have on your page. If you need further advice please consult a lawyer.

# Thanks
There were many inspring posts which led to the creation of OptInOut. Below you'll find a list of sources we find interesting to read if you're interested in the topic: 
- [FB Pixel Controller by Oscar/@ovl](https://medium.com/@ovl/facebook-pixel-und-datenschutz-24d9edceacff) (german)
- [Info on how to use tracking with regards to privacy by Dr. Schwenke](https://drschwenke.de/facebook-pixel-voraussetzungen-fuer-einen-rechtssicheren-einsatz/) (german)  