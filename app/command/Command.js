const errors = require('./errors');

class Command {
  constructor(intent, text, args) {
    this.intent = intent;
    this.text = text;
    this.args = args;

    if (!intent) {
      throw new errors.NotAValidIntent('Command requires an intent');
    }
  }
}

module.exports = Command;
