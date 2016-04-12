/* eslint arrow-body-style: [2, "always"] */

import React, { PropTypes } from 'react';
import Settings from '../components/Settings';

const SettingsPage = ({ children, route }, { location }) => {
  return (
    <Settings settings={route.settings} route={route} activePath={location.pathname}>
      { children }
    </Settings>
  );
};

SettingsPage.propTypes = {
  children: PropTypes.element.isRequired,
  route: PropTypes.object.isRequired
};
SettingsPage.contentTypes = {
  location: React.PropTypes.object
};

export default SettingsPage;
