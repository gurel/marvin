[![Stories in Ready](https://badge.waffle.io/gurel/marvin.svg?label=ready&title=Backlog)](http://waffle.io/gurel/marvin) [![Stories in Ready](https://badge.waffle.io/gurel/marvin.svg?label=in+progress&title=In+Progress)](http://waffle.io/gurel/marvin) [![Stories in Ready](https://badge.waffle.io/gurel/marvin.svg?label=bug&title=Bugs)](http://waffle.io/gurel/marvin)

Marvin is a personal assistant responding to voice input. By default it uses [Webkit Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) and [WitAI](https://wit.ai) to record and parse voice inputs.

This project is written with javascript and runs on [electron](http://electron.atom.io).

Tested under:

- Yosemite

# Engines

## Webkit Speech API + WitAI

Engine Name: WebkitWitAI

Status: Stable

This engine uses webkit speech engine for speech to text capabilities. It then sends the text to WitAI for intent recognition.

## Sox + WitAI

Engine Name: SoxWitAI

Status: Under development

This engine uses Sox cli to record voice input and sends it to Wit.ai for speech to text and intent recognition.

# Plugins

## Default Plugins

### greeter

*Path*: greeter.js

*Sample command*: Hello Marvin!

This plugin will say hello back to you.

### listening state

*Path*: listening_state.js

*Sample command*: Start Listening

Will active/deactive the app.

### volume

*Path*: volume.js

*Sample command*: Turn volume up by 5 bars

Use this to increase/decrease you computers volume.

### notifier

*Path*: marvin-notifier

This plugin react to every intent and pop-ups a notification baloon to give feedback on the intent.

## Writing you own plugins
The plugins are put to the applications default user folder.

Mac OS X:
> /Users/username/Library/Application Support/Marvin/plugins

On application launch it will load each script found under this folder and load them. Any change in this folder requires an app restart.

These plugins could be stateful, in example the user may want the system to **shutdown** and the plugin may require verification like **yes/no** before acting on the request. 

Below is the api that should be implemented.


### @property name [Required]
This will be the name of the plugin. This will be used on the settings screen and logs.
### @func init(ipc, settings)
This function will be called only once the plugin is loaded.
### @func willReact(intent, text, args):*bool* [Required]
This function will be called everytime the intent recognition is finished. It should return a boolean value stating whether the act function should be called or not.
### @func act(intent, text, args) [Required]

```
const notifier = require('node-notifier');

module.exports = {
  name: "greeter",
  init: function(ipc, settings) {
    this.ipc = ipc;
    this.settings = settings;
  },
  willReact: function (intent, text, args) {
    return intent === "greetings";
  },
  act: function (intent, text, args) {
    ipc.emit('say', 'hello ' + this.settings.get('user').name);
  }
}
```

# Working with source
This project is forked from [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate), although many dependencies have been added/removed from it.

> npm run dev

> npm run lint

> npm run test

> npm run package

# Known Bugs
- The system uses html5 navigator.onLine property to detect whether the computer is connected to the internet. This may sometimes give a false positive as the router may require a login information. Please be sure that you are connected before filing any bug reports.


