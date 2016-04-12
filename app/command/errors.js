const util = require('util');

function NotACommandError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(NotACommandError, Error);
exports.NotACommandError = NotACommandError;

function NotAMarvinCompliantModule(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(NotAMarvinCompliantModule, Error);
exports.NotAMarvinCompliantModule = NotAMarvinCompliantModule;

function NotAValidIntent(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(NotAValidIntent, Error);
exports.NotAValidIntent = NotAValidIntent;
