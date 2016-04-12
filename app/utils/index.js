const fileutils = require('./fileutils');
const SettingsStore = require('./settingsutils');

exports = {
  copyDirectory: fileutils.copyDirectory,
  copyDirectorySync: fileutils.copyDirectorySync,
  SettingsStore
};

module.exports = exports;
