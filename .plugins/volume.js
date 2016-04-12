const notifier = require('node-notifier');
const robotjs = require('robotjs')

module.exports = {
  name: "greeter",
  willReact: function (intent, text, args) {
    return intent === "volume";
  },
  act: function (intent, text, args) {
    var direction = args.direction || [{value: 'up'}]
    direction = direction[0].value;
    var number = args.number || [{value: 1}];
    number = number[0].value;
    for(var i = 0; i < number; i++){
      robotjs.keyTap(direction==='up'?'audio_volume_up':'audio_volume_down');
    }
    console.log("volume", direction, "by", number);
  }
}
