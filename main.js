/* eslint strict: 0 */
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const fs = require('fs');
const path = require('path');
const commandManager = require('./app/command');
const Command = require('./app/command/Command');
const Tray = require('./app/tray');
const utils = require('./app/utils');
const electron = require('electron');

const SettingsStore = utils.SettingsStore;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const crashReporter = electron.crashReporter;
const ipcMain = electron.ipcMain;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

const userData = app.getPath('userData');
const pluginDirectory = path.join(userData, 'plugins');
const tray = new Tray();

// const isDarwin = (process.platform === 'darwin');
// const isLinux = (process.platform === 'linux');
// const isWindows = (process.platform === 'win32');

const settings = new SettingsStore(path.join(userData, 'settings.json'));

let listenerWindow = null;
let settingsWindow = null;
let screen = null;

global.sharedObject = {
  listener: null
};

crashReporter.start({
  productName: 'Marvin',
  companyName: 'Marvin'
});

if (process.env.NODE_ENV !== 'development') {
  app.dock.hide();
}
app.commandLine.appendSwitch('enable-speech-input');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  screen = electron.screen;
  initStorage();
  initPlugins();
  openListener();
   // openSettings();
  tray.init();
  initEvents();
});

function openSettings() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  const size = screen.getPrimaryDisplay().workAreaSize;

  settingsWindow = new BrowserWindow({
    width: size.width / 2, height: size.height / 2
  });

  settingsWindow.loadURL(path.join('file://', __dirname, 'app', 'ui', 'settings', 'app.html'));

  if (process.env.NODE_ENV === 'development') {
    settingsWindow.openDevTools();
  }
  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow.webContents.send('start-render', settings.getMemCache());
  });
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}
function initEvents() {
  settings.on('changed', () => {
    if (listenerWindow) {
      listenerWindow.webContents.send('settings-changed', settings.getMemCache());
    }
  });
  tray.on('open-settings', () => {
    openSettings();
  });
  ipcMain.on('close-settings', () => {
    if (settingsWindow) {
      settingsWindow.close();
    }
  });
  ipcMain.on('settings-changed', (event, setting) => {
    console.log('[Setting_changed]', setting);
    settings.setMemCache(setting);
  });
  ipcMain.on('listener-intent', (event, command) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('listener-intent', command);
    }
    commandManager.execute(new Command(command.intent, command.text, command.args));
  });
  tray.on('quit', () => {
    app.quit();
  });
}

function openListener() {
  const size = screen.getPrimaryDisplay().workAreaSize;

  listenerWindow = new BrowserWindow({
    width: 26, height: 68,
    x: size.width - 26, y: size.height - 68,
    frame: false,
    'always-on-top': true,
    'skip-taskbar': true,
    transparent: true,
    show: false,
    resizable: process.env.NODE_ENV !== 'production'
  });

  listenerWindow.loadURL(path.join('file://', __dirname, 'app', 'ui', 'listener', 'listener.html'));

  commandManager.execute(new Command('greeting', 'Hello Marvin', {}));

  if (process.env.NODE_ENV === 'development') {
    listenerWindow.openDevTools();
  } else {
    listenerWindow.openDevTools();
  }
  listenerWindow.webContents.on('did-finish-load', () => {
    listenerWindow.webContents.send('start-listener', settings.getMemCache());
  });

  listenerWindow.on('closed', () => { listenerWindow = null; });

  listenerWindow.show();
}

function initStorage() {
  if (!settings.has('user')) {
    settings.set('user', { name: 'Sir' });
  }
  if (!settings.has('os')) {
    settings.set('os', process.platform);
  }
  if (!settings.has('listener')) {
    settings.set('listener', {
      engine: 'WebkitWitAI',
      WitAIKey: '2IQP6L6HNSIZT7HJ4GVWG3NC5WN5KDTZ'
    });
  }
  if (!settings.has('app')) {
    settings.set('app', { active_on_launch: true });
  }
}

function initPlugins() {
  fs.mkdir(pluginDirectory, (e) => {
    if (!e || (e && e.code === 'EEXIST') && process.env.NODE_ENV !== 'development') {
      // do something with contents
    } else {
      utils.copyDirectorySync(`${__dirname}/.plugins`, pluginDirectory);
    }

    console.log('Copy plugins folder: ', `${__dirname}/.plugins`, '=>', pluginDirectory);

    commandManager.setSettings(settings);
    commandManager.loadAllPlugins(pluginDirectory, () => {
      console.log('All plugins loaded');
    });
  });
}
