/* eslint func-names: 0 */
/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';
import { copyDirectory, copyDirectorySync, SettingsStore } from '../utils';
import async from 'async';

const testDir1 = './test_dir';
const testDir2 = './test_dir2';

describe('utils.settings', () => {
  let settings = null;
  before(() => {
    settings = new SettingsStore('./foo.json');
  });
  it('should be singleton', () => {
    expect(require('../utils').settings).to.equal(require('../utils').settings);
  });
  it('should write settings', () => {
    settings.set('foo', 'bar');
    expect(settings.get('foo')).to.equal('bar');
  });
  it('should write settings', () => {
    settings.set('bar', { foo: 'bar' });
    expect(settings.get('bar')).to.deep.equal({ foo: 'bar' });
  });
  it('should emit event on change', (done) => {
    settings.once('foo', (value) => {
      expect(value).to.equal('bar');
      done();
    });
    settings.set('foo', 'bar');
  });
  after(() => {
    fs.unlinkSync('./foo.json');
  });
});

describe('utils.fileutils', () => {
  beforeEach((done) => {
    async.waterfall([
      (callback) => {
        fs.mkdir(testDir1, callback);
      },
      (callback) => {
        fs.mkdir(testDir2, callback);
      },
      (callback) => {
        fs.writeFile(path.join(testDir1, 'test_file'), 'Hey there!', callback);
      },
      () => {
        done();
      }
    ]);
  });

  it('should copy directory', (done) => {
    copyDirectory(testDir1, testDir2, () => {
      fs.stat(path.join(testDir2, 'test_file'), (err, stat) => {
        expect(err).to.not.exist;
        expect(stat).to.exist;
        done();
      });
    });
  });
  it('should copy directory sync', (done) => {
    copyDirectorySync(testDir1, testDir2);
    fs.stat(path.join(testDir2, 'test_file'), (err, stat) => {
      expect(err).to.not.exist;
      expect(stat).to.exist;
      done();
    });
  });
  afterEach((done) => {
    async.waterfall([
      (callback) => rimraf(testDir1, callback),
      (callback) => rimraf(testDir2, callback),
      () => done()
    ]);
  });
});
