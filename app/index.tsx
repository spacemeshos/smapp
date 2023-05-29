import 'json-bigint-patch';
import React from 'react';
import { render } from 'react-dom';
import App from './App';

const logger = require('electron-log');

logger.transports.console.level = false;

render(<App />, document.getElementById('root'));
