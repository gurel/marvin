import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './containers/App';
import SettingsPage from './containers/SettingsPage';
import PersonalSettingsPage from './containers/PersonalSettingsPage';
import CommandsPage from './containers/CommandsPage';


export default function getRoutes(settings) {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/settings" />
      <Route path="/settings" settings={settings} component={SettingsPage}>
        <IndexRedirect to="/settings/personal" />
        <Route path="/settings/personal" component={PersonalSettingsPage} />
        <Route path="/settings/commands" component={CommandsPage} />
      </Route>
    </Route>
  );
}
