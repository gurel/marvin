const notifier = require('node-notifier');

module.exports = {
  name: "marvin-notifier",
  willReact: function (intent, text, args) {
    return 1;
  },
  act: function (intent, text, args) {
    console.log(notifier.notify({
      'title': 'Marvin',
      'message': ""+intent
    }));
  }
}
