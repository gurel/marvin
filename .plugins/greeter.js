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
    //ipc.emit('say', 'hello ' + this.settings.user);
  }
}
