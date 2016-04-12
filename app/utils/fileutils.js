const wrench = require('wrench');

function copyDirectory(from, to, callback) {
  wrench.copyDirRecursive(from, to, { forceDelete: true }, callback);
}

function copyDirectorySync(from, to) {
  wrench.copyDirSyncRecursive(from, to, { forceDelete: true });
}

module.exports = {
  copyDirectory,
  copyDirectorySync
};
