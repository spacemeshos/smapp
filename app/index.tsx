import 'json-bigint-patch';
import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';

const root = ReactDom.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
