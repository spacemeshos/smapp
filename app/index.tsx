import 'json-bigint-patch';
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';

const logger = require('electron-log');

logger.transports.console.level = false;

const root = createRoot(document.getElementById('root'));
root.render(<App />);
