import 'json-bigint-patch';
import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';

const logger = require('electron-log');

logger.transports.console.level = false;

const root = ReactDom.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
