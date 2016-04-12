const electron = require('electron');
const EventEmitter = require('events');
const path = require('path');
const Menu = electron.Menu;

class Tray extends EventEmitter {
  constructor() {
    super();
    this._assetsDir = path.join(__dirname, 'assets');
    this._appIcon = null;
  }
  init() {
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Settings', click: () => { this.emit('open-settings'); } },
      { type: 'separator' },
      { label: 'Quit', click: () => this.emit('quit') }
    ]);
    this._appIcon = new electron.Tray(path.join(this._assetsDir, 'tray.png'));

    this._appIcon.setToolTip('Marvin');
    this._appIcon.setContextMenu(contextMenu);
  }
}

module.exports = Tray;
