# Extending Marvin Capabilities
## Adding intents

## Adding plugins
You can place your plugins under these folders:

**Mac Os X:** /Users/{username}/Library/Application Support/Marvin/plugins

Your plugins can either be .js files of folders (which can include node_modules of their own)

Sample plugin:

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
    console.log("say hello");
    ipc.emit('say', 'hello ' + this.settings.user);
  }
}
```

# Included dependencies you can use

[node-notifier](https://github.com/mikaelbr/node-notifier) - You can open notification baloons

[robotjs](https://github.com/octalmage/robotjs) - Send keyboard and mouse events to the system

------
Other useful libraries include:
[async](https://github.com/caolan/async),
[react](https://github.com/facebook/react),
[electron](https://github.com/atom/electron),


