/* eslint func-names: 0 */
import { expect } from 'chai';
import Command from '../app/command/Command';
import CommandManager from '../app/command';
import commanderrors from '../app/command/errors';

describe('Command', () => {
  it('should construct', (done) => {
    const args = { foo: 'bar' };
    const cmd = new Command('intent', 'text', args);
    expect(cmd.intent).to.equal('intent');
    expect(cmd.text).to.equal('text');
    expect(cmd.args).to.deep.equal({ foo: 'bar' });
    done();
  });
  it('should construct', (done) => {
    const fn = function () {
      const cmd = new Command();
      cmd.intent = 'foo';
    };
    expect(fn).to.throw(commanderrors.NotAValidIntent);
    done();
  });
});

describe('Command Manager', () => {
  it('should have execute method', () => {
    expect(CommandManager).to.respondTo('execute');
  });
  it('should have register method', () => {
    expect(CommandManager).to.respondTo('register');
  });
  it('should have loadPlugin method', () => {
    expect(CommandManager).to.respondTo('loadPlugin');
  });
  it('should have loadAllPlugins method', () => {
    expect(CommandManager).to.respondTo('loadAllPlugins');
  });
  it('should have loadPlugin method', () => {
    expect(CommandManager).to.respondTo('loadPlugin');
  });
  it('module check should work', () => {
    const fn = function () {
      CommandManager.register({});
    };
    expect(fn).to.throw(commanderrors.NotAMarvinCompliantModule);
  });

  it('module should be loaded', () => {
    const fn = function () {
      CommandManager.register({ willReact() {}, act() {}, name: 'foo' });
    };
    expect(fn).to.not.throw(commanderrors.NotAMarvinCompliantModule);
  });
  it('should only execute Command class', () => {
    const fn = function () {
      CommandManager.execute({ });
    };
    expect(fn).to.throw(commanderrors.NotACommandError);
  });
});

