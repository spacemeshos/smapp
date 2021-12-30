import { isDebug } from '../utils';

export default async () => {
  if (!isDebug()) return;
  // eslint-disable-next-line global-require
  const { default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
  await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false }).then(
    (names) => console.log('DevTools Installed:', names), // eslint-disable-line no-console
    (err) => console.log('DevTools Installation Error:', err) // eslint-disable-line no-console
  );
};
