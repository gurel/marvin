import EventEmitter from 'events';

export default
class ListenerBase extends EventEmitter {
  constructor() {
    super();
    if (new.target === ListenerBase) {
      throw new TypeError('Cannot construct ListenerBase instances directly');
    }
    if (this.start === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError('Must override method start');
    }
    if (this.stop === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError('Must override method stop');
    }
  }
}
