/* eslint no-alert:0 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Settings.css';
import classnames from 'classnames';
import electron from 'electron';
const ipcRenderer = electron.ipcRenderer;

export default class Settings extends Component {
  constructor(props, context) {
    super(props, context);
    console.log('Settings', props, context);
    this.state = {
      settings: props.settings,
      dirty: false
    };
  }
  componentWillMount() {
    this.__keypress = this._keypress.bind(this);
    window.addEventListener('keydown', this.__keypress);
  }
  componentWillUnmount() {
    if (this.__keypress) {
      window.removeEventListener('keydown', this.__keypress);
      delete this.__keypress;
    }
  }
  _keypress(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
          event.preventDefault();
          this._save();
          break;
        default:
          break;
      }
    }
  }
  changeName(name) {
    this.setState({
      settings: {
        ...this.state.settings,
        user: { ...this.state.settings.user, name }
      },
      dirty: true
    });
  }
  changeActiveOnLaunch(bol) {
    this.setState({
      settings: {
        ...this.state.settings,
        app: { ...this.state.settings.app, active_on_launch: bol }
      },
      dirty: true
    });
  }
  changeWitAIKey(key) {
    this.setState({
      settings: {
        ...this.state.settings,
        listener: { ...this.state.settings.listener, WitAIKey: key }
      },
      dirty: true
    });
  }
  _save() {
    ipcRenderer.send('settings-changed', this.state.settings);
    alert('Saved !');
    this.setState({
      dirty: false
    });
  }
  _cancel() {
    ipcRenderer.send('close-settings', this.state.settings);
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.tabs}>
          <ul className={styles.tabList}>
            { this.props.route.childRoutes.map((item, index) => {
              const key = item.path;
              return (
                <li
                  key={ key + index }
                  className={
                    classnames(
                      styles.tab,
                      { [styles.tabSelected]: this.props.activePath === key }
                    )
                  }
                >
                  <Link to={ item.path }>{ item.component.tab_name }</Link>
                </li>);
            })}
          </ul>
        </div>
        <div className={styles.contentContainer}>
          {
            React.cloneElement(this.props.children, { settings: this.state.settings,
              changeName: this.changeName.bind(this),
              changeActiveOnLaunch: this.changeActiveOnLaunch.bind(this),
              changeWitAIKey: this.changeWitAIKey.bind(this)
            })
          }
        </div>
        <div className={styles.buttonsContainer}>
          <div
            className={classnames(styles.btn)}
            onClick={this._cancel.bind(this)}
          >
            Cancel | Close
          </div>
          {(() => {
            if (this.state.dirty) {
              return (
                <div
                  className={classnames(styles.btn, styles.btn_success)}
                  onClick={this._save.bind(this)}
                >
                  Apply
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}
Settings.propTypes = {
  children: PropTypes.element.isRequired,
  route: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  activePath: PropTypes.string
};
Settings.contentTypes = {
  location: React.PropTypes.object
};
