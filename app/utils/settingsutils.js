const fs = require('fs');
const async = require('async');
const EventEmitter = require('events');

class SettingsStore extends EventEmitter {
  constructor(file) {
    super();
    const self = this;
    this.watchEnabled = true;
    this.fileName = file;
    this._settings = {};
    this._readFile(() => {
      fs.watch(self.fileName, self._onChange.bind(self));
    });
  }
  _readFile(cb) {
    const self = this;
    this.watchEnabled = false;

    async.waterfall([
      (callback) => {
        let data = '{}';
        try {
          data = fs.readFileSync(self.fileName, { encoding: 'utf8' });
        } catch (e) {
          fs.writeFileSync(self.fileName, '{}');
        }
        callback(null, JSON.parse(data));
      },
      (data, callback) => {
        self._settings = data;
        self.watchEnabled = true;
        callback(null);
      },
      (err) => {
        if (cb) cb(err);
      }
    ], (error) => {
      if (error) {
        console.log('error', error);
      } else {
        console.log('initialized');
      }
    });
  }
  _onChange(event) {
    if (event === 'change' && this.watchEnabled) {
      this._readFile();
    }
  }
  _writeToFile(callback) {
    const self = this;
    this.watchEnabled = false;
    fs.writeFile(this.fileName, JSON.stringify(this._settings, null, 2), () => {
      self.watchEnabled = true;
      if (callback) {
        callback();
      }
    });
  }
  getMemCache() {
    return this._settings;
  }
  setMemCache(settings, callback) {
    this._settings = settings;
    this._writeToFile(callback);
    this.emit('changed', settings);
  }
  set(key, value, callback) {
    this._settings[key] = value;
    this._writeToFile(callback);
    this.emit(key, value);
    this.emit('changed', this._settings);
  }
  get(key) {
    return this._settings[key];
  }
  has(key) {
    return this._settings[key] !== undefined;
  }
}

module.exports = SettingsStore;
