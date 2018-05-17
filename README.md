# OptInOut.js

A simple JavaScript library to manage opting in & out of tracking/marketing/mailing - in fact whatever you want to manage. This was created with EU GDPR in mind. 
To get started, check out the quick start below.

Visit our [website](https://optinout.gitlab.io/) for more information, the [documentation](https://optinout.gitlab.io/docs/start.html) or the guides and examples.

The original repository is hosted on [GitLab](https://gitlab.com/optinout/optinout.js), there's a mirror on it on [GitHub](https://github.com/gaambo/optinout.js). You can create issues anywhere, but the main work happens on **GitLab**.

## Quick Start
### Install
You can download the [latest release here](https://gitlab.com/optinout/optinout.js/-/jobs/artifacts/master/download?job=publish:artifacts).  This includes the src & dist directory. 

There's also a [npm package](https://www.npmjs.com/package/optinout.js).

### Load
#### Static HTML
For usage in standard websites with best browser coverage we recommend including the `dist/optinout.js` or `dist/optinout.min.js`.
Just include the script via a standard script-tag in the header/footer: 
`<script src="path/to/optinout.js" ></script>`
### Usage
#### Initialization
You have to initialize the library before using any of its methods: 

    OptInOut(); 

This initializes the library with our default options & storages. Even if you do not want to customize the options you have to add your **services**: 

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

#### Opt-In & Opt-Out
You can use the global's object "static" methods for quick access to the most important methods of the current instance. 
	
		//opting out
		OptInOut.optOut('analytics');

		//opting in
		OptInOut.optIn('facebook');

For easier handling we include a link-helper plugin, which automatically trigger when buttons with specific classes are clicked. Add it as a plugin with `OptInOut.plugins.linkPlugin` on initialization and add the `optInOut-optIn` class and the `data-service`-attribute to your buttons. See [full documentation](docs/start.html#link-helper) for details.

#### Checking Status
Checking if something is allowed or not (--> if the user has opted in/opted out) is easy: 

		OptInOut.isAllowed('facebook');

This method takes the current saved status & the mode of the service into consideration. 
