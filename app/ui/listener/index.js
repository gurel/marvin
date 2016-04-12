import React from 'react';
import { render } from 'react-dom';
import Listener from './Listener.js';

if (window.entryPoint === 'LISTENER') {
  require('electron').ipcRenderer.on('start-listener', (event, settings) => {
    render(<Listener settings={settings} />, document.getElementById('root'));
  });
  require('electron').ipcRenderer.on('settings-changed', (event, settings) => {
    render(<Listener settings={settings} />, document.getElementById('root'));
  });

  if (process.env.NODE_ENV !== 'production') {
    // Use require because imports can't be conditional.
    // In production, you should ensure process.env.NODE_ENV
    // is envified so that Uglify can eliminate this
    // module and its dependencies as dead code.
    // require('./createDevToolsWindow')(store);
  }
}
