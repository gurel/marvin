const notifier = require('node-notifier');
const robotjs = require('robotjs')

module.exports = {
  name: "listening_state",
  init: function(ipc, settings) {
    this.ipc = ipc;
    this.settings = settings;
  },
  willReact: function (intent, text, args) {
    return intent === "listening_state";
  },
  act: function (intent, text, args) {
    var state = args.listening_state || [{value: 'start'}]
    this.ipc.emit(state === 'start'?'start-listening':'stop-listening');
  }
}
