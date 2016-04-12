const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const Command = require('./Command');
const errors = require('./errors');

class CommandManager {
  constructor() {
    this.commandRegistry = [];
    this.pluginIpc = new EventEmitter();
  }
  setSettings(settings) {
    this.settings = settings;
  }
  execute(command) {
    if (!(command instanceof Command)) {
      throw new errors.NotACommandError('You can only execute Command classes');
    }
    this.commandRegistry.forEach((modu) => {
      console.log(
        '[CommandModule]{execute} ',
        modu.name,
        modu.willReact(command.intent, command.text, command.args)
      );
      if (modu.willReact(command.intent, command.text, command.args)) {
        console.log('[CommandModule]{execute} ', modu.name, 'will act');
        modu.act(command.intent, command.text, command.args);
      }
    });
    console.log('[CommandModule]{execute} ', command.intent, 'with', command.args);
  }

  register(mod) {
    if (!mod.willReact || !mod.act || !mod.name) {
      throw new errors.NotAMarvinCompliantModule('This is not a supported module');
    }
    if (mod.init) {
      mod.init(this.pluginIpc, this.settings);
    }
    console.log('[CommandModule]{register} Registering Module', mod.name);
    this.commandRegistry.push(mod);
  }

  loadPlugin(filepath) {
    console.log('[CommandModule]{loadPlugin} Loading Plugin', filepath);
    const mod = require(filepath);

    if (mod.willReact && mod.act && mod.name) {
      this.register(mod);
    }
  }

  loadAllPlugins(folderpath, callback) {
    console.log('[CommandModule]{loadAllPlugins} loading all plugins');
    const self = this;
    fs.readdir(folderpath, (err, files) => {
      if (err) {
        console.error('Could not list the directory.', err);
      } else {
        files.forEach((file) => {
          self.loadPlugin(path.join(folderpath, file));
        });
        callback();
      }
    });
  }
}

const manager = new CommandManager();

module.exports = manager;
