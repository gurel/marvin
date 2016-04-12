import React, { Component, PropTypes } from 'react';
import styles from './PersonalSettings.css';

export default
class PersonalSettings extends Component {
  constructor(props, context) {
    super(props, context);
    console.log('[PersonalSettings]', props);
  }
  _onTextChange(method, event) {
    console.log(event.target.value);
    this.props[method](event.target.value);
  }
  _onCheckboxChange(method, event) {
    this.props[method](event.target.checked);
  }
  render() {
    return (
      <div className={styles.container}>
        <div>
          Name :
          <input
            type="text"
            value={this.props.settings.user.name}
            onChange={this._onTextChange.bind(this, 'changeName')}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={this.props.settings.app.active_on_launch}
              onChange={this._onCheckboxChange.bind(this, 'changeActiveOnLaunch')}
            />
            Activate speech on application launch
          </label>
        </div>
        <div>
          Engine : <select>
                      <option>WebkitWitAI</option>
                  </select>
        </div>
        <div>
          WitAI Client Key :
          <input
            type="text"
            value={this.props.settings.listener.WitAIKey}
            onChange={this._onTextChange.bind(this, 'changeWitAIKey')}
          />
        </div>
      </div>
    );
  }
}

PersonalSettings.propTypes = {
  settings: PropTypes.object.isRequired
};
