import 'json-bigint-patch';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const root = createRoot(mainElement);
root.render(<App />);
