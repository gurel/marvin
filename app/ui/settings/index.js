import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import './app.global.css';

const history = hashHistory;

if (window.entryPoint === 'SETTINGS') {
  require('electron').ipcRenderer.on('start-render', (event, settings) => {
    render(<Router history={history} routes={routes(settings)} />, document.getElementById('root'));
  });

  require('electron').ipcRenderer.on('settings-changed', (event, settings) => {
    console.log('settings-changed', event, settings);
  });

  if (process.env.NODE_ENV !== 'production') {
    // Use require because imports can't be conditional.
    // In production, you should ensure process.env.NODE_ENV
    // is envified so that Uglify can eliminate this
    // module and its dependencies as dead code.
    // require('./createDevToolsWindow')(store);
  }
}
